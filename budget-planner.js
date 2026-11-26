/* VELORA Trip Budget Planner — local calculation only; no live prices or FX. */
(() => {
  "use strict";
  const form = document.getElementById("budgetForm");
  if (!form) return;
  const $ = id => document.getElementById(id);
  const ids = [
    "budgetCurrency", "budgetDays", "budgetTravellers", "budgetLimit",
    "costFlights", "costStay", "costTransport", "costFood", "costActivities",
    "costInsurance", "costConnectivity", "costOther", "budgetContingency"
  ];
  const storageKey = "velora-trip-budget-v1";
  const labels = {
    flights: "Flights / long-distance travel",
    stay: "Accommodation",
    transport: "Local transport",
    food: "Food",
    activities: "Activities",
    insurance: "Insurance / cover",
    connectivity: "Connectivity",
    other: "Other costs"
  };
  let lastBreakdown = [];
  let plannerContext = null;
  let preparationStepReady = false;
  const preparationHandoffKey = "velora-preparation-handoff-v1";

  function readNumber(id, fallback = 0) {
    const el = $(id);
    if (!el || el.value.trim() === "") return fallback;
    const n = Number(el.value);
    return Number.isFinite(n) ? n : fallback;
  }
  function getCurrency() {
    return $("budgetCurrency").value || "INR";
  }

  function applyPlannerHandoff() {
    const handoffKey = "velora-planner-budget-handoff-v1";
    let handoff;
    try {
      const raw = localStorage.getItem(handoffKey);
      if (!raw) return;
      handoff = JSON.parse(raw);
    } catch {
      return;
    }

    const now = Date.now();
    const createdAt = Number(handoff?.createdAt);
    const isRecent = Number.isFinite(createdAt) && createdAt <= now + 60000 && now - createdAt <= 30 * 60 * 1000;
    if (!handoff || handoff.version !== 1 || !isRecent || typeof handoff.destination !== "string" ||
        !handoff.destination.trim() || handoff.destination.length > 120) {
      try { localStorage.removeItem(handoffKey); } catch { /* Storage may be unavailable. */ }
      return;
    }

    plannerContext = {
      destination: handoff.destination.trim().slice(0, 120),
      occasion: typeof handoff.occasion === "string" ? handoff.occasion.slice(0, 80) : "Experience plan"
    };

    const currency = String(handoff.currency || "");
    const currencyIsSupported = [...$("budgetCurrency").options].some(option => option.value === currency);
    if (currencyIsSupported) $("budgetCurrency").value = currency;

    const days = Number(handoff.duration);
    const travellers = Number(handoff.travellers);
    if (Number.isInteger(days) && days >= 1 && days <= 365) $("budgetDays").value = String(days);
    if (Number.isInteger(travellers) && travellers >= 1 && travellers <= 50) $("budgetTravellers").value = String(travellers);

    const ceiling = handoff.budgetCeiling === null || handoff.budgetCeiling === "" ? null : Number(handoff.budgetCeiling);
    if (Number.isFinite(ceiling) && ceiling > 0 && ceiling <= 1000000000) $("budgetLimit").value = String(ceiling);

    const context = $("plannerContextNote");
    const contextText = $("plannerContextText");
    if (context && contextText) {
      const parts = [
        handoff.destination.trim(),
        typeof handoff.occasion === "string" ? handoff.occasion.slice(0, 80) : "Experience plan",
        (Number.isInteger(days) && days >= 1 && days <= 365 ? days : $("budgetDays").value) + " days",
        (Number.isInteger(travellers) && travellers >= 1 && travellers <= 50 ? travellers : $("budgetTravellers").value) + " travellers"
      ];
      contextText.textContent = parts.join(" · ") + ". Review the currency and budget ceiling before adding costs.";
      context.hidden = false;
    }

    // Consume the handoff once. The editable budget form now owns the values.
    try { localStorage.removeItem(handoffKey); } catch { /* It remains local if storage cannot be cleared. */ }
  }
  function updatePreparationStep() {
    const section = $("budgetNextStep");
    const description = $("budgetNextDescription");
    if (!section) return;
    section.hidden = !preparationStepReady;
    if (description) {
      description.textContent = plannerContext?.destination
        ? "Your current plan for " + plannerContext.destination + " is ready for the next step. Choose the checklist that matches your journey direction."
        : "Choose the checklist that matches your journey direction. Your trip length and traveller count will be carried forward on this device.";
    }
  }

  function continueToPreparation(path) {
    const allowedPaths = new Set(["india-arrival-ready", "first-international-trip"]);
    if (!allowedPaths.has(path) || !validate()) return;
    const handoff = {
      version: 1,
      createdAt: Date.now(),
      path,
      destination: plannerContext?.destination || "",
      days: readNumber("budgetDays", 5),
      travellers: readNumber("budgetTravellers", 2)
    };
    try {
      // Only destination and trip size move to the chosen checklist; cost amounts are not carried.
      localStorage.setItem(preparationHandoffKey, JSON.stringify(handoff));
      window.location.assign("/travel/" + path + "/");
    } catch {
      $("budgetStatus").textContent = "Your browser could not carry the plan context forward. The preparation checklist can still be opened from this page.";
    }
  }

  function money(value) {
    const currency = getCurrency();
    const locale = currency === "INR" ? "en-IN" : "en-US";
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: currency === "JPY" ? 0 : 2
      }).format(Number.isFinite(value) ? value : 0);
    } catch {
      return currency + " " + (Number(value) || 0).toFixed(2);
    }
  }
  function validate() {
    const days = readNumber("budgetDays", NaN);
    const travellers = readNumber("budgetTravellers", NaN);
    if (!Number.isInteger(days) || days < 1 || days > 365) {
      $("budgetDays").setCustomValidity("Enter a whole trip length from 1 to 365 days.");
      $("budgetDays").reportValidity();
      return false;
    }
    $("budgetDays").setCustomValidity("");
    if (!Number.isInteger(travellers) || travellers < 1 || travellers > 50) {
      $("budgetTravellers").setCustomValidity("Enter between 1 and 50 travellers.");
      $("budgetTravellers").reportValidity();
      return false;
    }
    $("budgetTravellers").setCustomValidity("");
    for (const id of ids.filter(id => id !== "budgetCurrency" && id !== "budgetDays" && id !== "budgetTravellers" && id !== "budgetContingency")) {
      const el = $(id);
      if (id === "budgetLimit" && el.value.trim() === "") continue;
      const value = readNumber(id, NaN);
      if (!Number.isFinite(value) || value < 0 || value > Number(el.max || 1000000000)) {
        el.setCustomValidity("Enter a valid non-negative amount.");
        el.reportValidity();
        return false;
      }
      el.setCustomValidity("");
    }
    return true;
  }
  function collectValues() {
    return Object.fromEntries(ids.map(id => [id, $(id).value]));
  }
  function calculate({ revealPreparation = false } = {}) {
    if (!validate()) return;
    if (revealPreparation) preparationStepReady = true;
    updatePreparationStep();
    const days = readNumber("budgetDays", 5);
    const travellers = readNumber("budgetTravellers", 2);
    const food = readNumber("costFood") * days * travellers;
    const activities = readNumber("costActivities") * travellers;
    const baseItems = [
      ["flights", readNumber("costFlights")],
      ["stay", readNumber("costStay")],
      ["transport", readNumber("costTransport")],
      ["food", food],
      ["activities", activities],
      ["insurance", readNumber("costInsurance")],
      ["connectivity", readNumber("costConnectivity")],
      ["other", readNumber("costOther")]
    ];
    const base = baseItems.reduce((sum, [, value]) => sum + value, 0);
    const contingencyRate = readNumber("budgetContingency", 10);
    const reserve = base * contingencyRate / 100;
    const total = base + reserve;
    if (!Number.isFinite(total) || total > 8000000000) {
      $("budgetStatus").textContent = "The result is outside the calculator's safe numeric range. Check the amounts and try again.";
      return;
    }
    const perPerson = total / travellers;
    const perDay = total / days;
    const cap = $("budgetLimit").value.trim() === "" ? null : readNumber("budgetLimit", null);
    const currency = getCurrency();

    $("contingencyValue").textContent = contingencyRate + "%";
    $("estimatedTotal").textContent = money(total);
    $("estimatedSubline").textContent = days + " day" + (days === 1 ? "" : "s") + " · " + travellers + " traveller" + (travellers === 1 ? "" : "s") + " · " + currency;
    $("perPersonTotal").textContent = money(perPerson);
    $("perDayTotal").textContent = money(perDay);
    $("contingencyTotal").textContent = money(reserve);
    $("budgetCurrencyNote").textContent = "All figures are " + currency + ". No currency conversion or live pricing is used.";

    const comparison = $("budgetComparison");
    if (cap !== null && Number.isFinite(cap) && cap > 0) {
      comparison.hidden = false;
      $("budgetCeiling").textContent = money(cap);
      const difference = cap - total;
      const diff = $("budgetDifference");
      diff.classList.toggle("is-over", difference < 0);
      diff.textContent = difference >= 0
        ? "Estimated headroom: " + money(difference) + " below your budget ceiling."
        : "Estimated over budget: " + money(Math.abs(difference)) + ". Review the cost items or your budget ceiling.";
    } else {
      comparison.hidden = true;
    }

    const fullTotal = total || 1;
    lastBreakdown = baseItems.map(([key, value]) => ({ key, label: labels[key], value }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
    const list = $("budgetBreakdownList");
    list.replaceChildren();
    if (!lastBreakdown.length) {
      const empty = document.createElement("p");
      empty.className = "budget-empty";
      empty.textContent = "Add at least one cost to see the breakdown.";
      list.append(empty);
    } else {
      lastBreakdown.forEach(item => {
        const row = document.createElement("div");
        row.className = "budget-bar-row";
        const head = document.createElement("div");
        head.className = "budget-bar-label";
        const name = document.createElement("span");
        name.textContent = item.label;
        const amount = document.createElement("strong");
        amount.textContent = money(item.value);
        head.append(name, amount);
        const track = document.createElement("div");
        track.className = "budget-bar-track";
        track.setAttribute("role", "img");
        const percentage = item.value / fullTotal * 100;
        track.setAttribute("aria-label", item.label + ": " + percentage.toFixed(1) + "% of estimated total including contingency");
        const fill = document.createElement("span");
        fill.style.width = Math.min(100, percentage) + "%";
        track.append(fill);
        row.append(head, track);
        list.append(row);
      });
      const reserveRow = document.createElement("div");
      reserveRow.className = "budget-bar-row";
      const reserveHead = document.createElement("div");
      reserveHead.className = "budget-bar-label";
      const reserveName = document.createElement("span");
      reserveName.textContent = "Contingency reserve";
      const reserveAmount = document.createElement("strong");
      reserveAmount.textContent = money(reserve);
      reserveHead.append(reserveName, reserveAmount);
      const reserveTrack = document.createElement("div");
      reserveTrack.className = "budget-bar-track";
      const reserveFill = document.createElement("span");
      reserveFill.style.width = Math.min(100, reserve / fullTotal * 100) + "%";
      reserveTrack.append(reserveFill);
      reserveRow.append(reserveHead, reserveTrack);
      list.append(reserveRow);
    }
    $("budgetStatus").textContent = "Estimate updated. Your values are calculated in this browser and have not been sent to VELORA.";
  }
  form.addEventListener("submit", event => {
    event.preventDefault();
    calculate({ revealPreparation: true });
  });
  document.querySelectorAll("[data-prep-route]").forEach(button => {
    button.addEventListener("click", () => continueToPreparation(button.dataset.prepRoute));
  });
  ids.forEach(id => {
    $(id).addEventListener("input", calculate);
    $(id).addEventListener("change", calculate);
  });
  $("budgetSave").addEventListener("click", () => {
    if (!validate()) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(collectValues()));
      $("budgetStatus").textContent = "Draft saved on this device only. It is not uploaded to VELORA.";
      $("budgetLoad").disabled = false;
    } catch {
      $("budgetStatus").textContent = "This browser did not allow local storage. Your estimate still works until you close or reload the page.";
    }
  });
  $("budgetLoad").addEventListener("click", () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (!saved || typeof saved !== "object" || Array.isArray(saved)) throw new Error("No saved draft.");
      ids.forEach(id => {
        if (typeof saved[id] === "string" && $(id)) $(id).value = saved[id];
      });
      calculate();
      $("budgetStatus").textContent = "Saved draft loaded from this device.";
    } catch {
      $("budgetStatus").textContent = "No usable saved draft was found on this device.";
    }
  });
  $("budgetReset").addEventListener("click", () => {
    form.reset();
    plannerContext = null;
    preparationStepReady = false;
    const contextNote = $("plannerContextNote");
    if (contextNote) contextNote.hidden = true;
    updatePreparationStep();
    ids.forEach(id => $(id).setCustomValidity(""));
    $("budgetComparison").hidden = true;
    $("contingencyValue").textContent = "10%";
    calculate();
    $("budgetStatus").textContent = "Calculator reset. Your saved local draft, if any, has not been deleted.";
  });
  $("budgetPrint").addEventListener("click", () => {
    if (validate()) {
      calculate();
      window.print();
    }
  });
  try {
    $("budgetLoad").disabled = !localStorage.getItem(storageKey);
  } catch {
    $("budgetLoad").disabled = true;
  }
  applyPlannerHandoff();
  calculate();
})();
