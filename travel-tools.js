/* VELORA travel checklists store only item IDs locally, never travel details. */
(() => {
  "use strict";
  document.querySelectorAll("[data-checklist]").forEach(root => {
    const listId = root.dataset.checklist;
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
      if (bar) bar.style.width = (boxes.length ? done / boxes.length * 100 : 0) + "%";
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
