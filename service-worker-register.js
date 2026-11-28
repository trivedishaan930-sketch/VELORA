/* Register VELORA's root-scoped offline shell without blocking page rendering. */
(() => {
  "use strict";
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // Offline support is optional; a failed registration must not interrupt the visitor.
    });
  }, { once: true });
})();
