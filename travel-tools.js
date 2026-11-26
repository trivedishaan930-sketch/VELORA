/* VELORA checklists store item IDs locally and can display a brief, expiring plan handoff. */
(() => {
  "use strict";
  const preparationHandoffKey = "velora-preparation-handoff-v1";

  function attachPreparationContext(root, listId) {
    let handoff;
    try {
      const raw = localStorage.getItem(preparationHandoffKey);
      if (!raw) return;
      handoff = JSON.parse(raw);
    } catch {
      try { localStorage.removeItem(preparationHandoffKey); } catch { /* Storage may be unavailable. */ }
      return;
    }

    const now = Date.now();
    const createdAt = Number(handoff?.createdAt);
    const ageIsValid = Number.isFinite(createdAt) && createdAt <= now + 60000 && now - createdAt <= 30 * 60 * 1000;
    if (!handoff || handoff.version !== 1 || !ageIsValid ||
        !["india-arrival-ready", "first-international-trip"].includes(handoff.path) ||
        (handoff.destination !== "" && (typeof handoff.destination !== "string" || handoff.destination.length > 120)) ||
        !Number.isInteger(Number(handoff.days)) || Number(handoff.days) < 1 || Number(handoff.days) > 365 ||
        !Number.isInteger(Number(handoff.travellers)) || Number(handoff.travellers) < 1 || Number(handoff.travellers) > 50) {
      try { localStorage.removeItem(preparationHandoffKey); } catch { /* Storage may be unavailable. */ }
      return;
    }
    // Keep a valid handoff until the visitor opens the checklist they explicitly selected.
    if (handoff.path !== listId) return;

    const note = document.createElement("div");
    note.className = "guide-note plan-context-note";
    note.setAttribute("role", "note");
    const heading = document.createElement("strong");
    heading.textContent = "Your VELORA plan context";
    const details = document.createElement("p");
    const parts = [];
    if (typeof handoff.destination === "string" && handoff.destination.trim()) {
      parts.push("Destination: " + handoff.destination.trim());
    }
    parts.push(Number(handoff.days) + " days");
    parts.push(Number(handoff.travellers) + " traveller" + (Number(handoff.travellers) === 1 ? "" : "s"));
    details.textContent = parts.join(" · ") + ".";
    const explanation = document.createElement("p");
    explanation.textContent = "This summary came from your plan on this device. It is a planning reminder, not a verified travel requirement. Check the official sources on this page before departure.";
    note.append(heading, details, explanation);
    root.insertAdjacentElement("beforebegin", note);

    // Consume the handoff after showing it once. Checklist ticks are stored separately.
    try { localStorage.removeItem(preparationHandoffKey); } catch { /* It remains local if storage cannot be cleared. */ }
  }

  document.querySelectorAll("[data-checklist]").forEach(root => {
    const listId = root.dataset.checklist;
    attachPreparationContext(root, listId);
    const key = "velora-checklist-v1:" + listId;
    const boxes = [...root.querySelectorAll("[data-check-id]")];
    const count = root.querySelector("[data-check-count]");
    const total = root.querySelector("[data-check-total]");
    const bar = root.querySelector("[data-check-progress]");
    const status = root.querySelector("[data-checklist-status]");
    const clear = root.querySelector("[data-checklist-clear]");
    let saved = new Set();
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      if (Array.isArray(value)) saved = new Set(value.filter(item => typeof item === "string"));
    } catch { saved = new Set(); }
    boxes.forEach(box => {
      box.checked = saved.has(box.dataset.checkId);
      box.addEventListener("change", () => {
        if (box.checked) saved.add(box.dataset.checkId);
        else saved.delete(box.dataset.checkId);
        persist();
        render();
      });
    });
    function persist() {
      try {
        localStorage.setItem(key, JSON.stringify([...saved]));
        if (status) status.textContent = "Checked item IDs are saved in this browser only. No passport, identity or itinerary details are sent to VELORA.";
      } catch {
        if (status) status.textContent = "Local storage is unavailable. Your checklist will work until this page is closed or reloaded.";
      }
    }
    function render() {
      const done = boxes.filter(box => box.checked).length;
      if (count) count.textContent = String(done);
      if (total) total.textContent = String(boxes.length);
      const percentage = boxes.length ? Math.round(done / boxes.length * 100) : 0;
      if (bar) bar.style.width = percentage + "%";
      const progress = root.querySelector('[role="progressbar"]');
      if (progress) {
        progress.setAttribute("aria-valuenow", String(percentage));
        progress.setAttribute("aria-valuetext", done + " of " + boxes.length + " items complete");
      }
    }
    clear?.addEventListener("click", () => {
      saved.clear();
      boxes.forEach(box => { box.checked = false; });
      persist();
      render();
    });
    render();
  });
  document.querySelectorAll("[data-print-page]").forEach(button => button.addEventListener("click", () => window.print()));
})();
