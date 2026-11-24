(() => {
  "use strict";
  const tokenInput = document.querySelector("#adminToken");
  const status = document.querySelector("#adminStatus");
  const resultsRoot = document.querySelector("#searchResults");
  const savedRoot = document.querySelector("#savedProducts");
  let adminToken = "";
  const categories = [
    ["luggage", "Luggage"], ["bags", "Bags & organisers"], ["travel-tech", "Travel tech"],
    ["style", "Fashion & style"], ["beauty", "Beauty & grooming"], ["comfort", "Comfort & care"], ["gifts", "Thoughtful gifts"]
  ];
  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  }
  async function api(path, options = {}) {
    if (!adminToken) throw new Error("Connect using the private admin token first.");
    const headers = new Headers(options.headers || {});
    headers.set("Authorization", "Bearer " + adminToken);
    if (options.body) headers.set("Content-Type", "application/json");
    const response = await fetch(path, { ...options, headers, cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "Request failed.");
    return payload;
  }
  function renderSearchResults(products) {
    resultsRoot.replaceChildren();
    if (!products.length) {
      const empty = document.createElement("p"); empty.className = "admin-empty";
      empty.textContent = "No products were returned for this search."; resultsRoot.append(empty); return;
    }
    products.forEach(product => {
      const card = document.createElement("article"); card.className = "admin-result-card";
      const image = document.createElement("img"); image.src = product.imageUrl; image.alt = ""; image.loading = "lazy";
      const body = document.createElement("div");
      const title = document.createElement("b"); title.textContent = product.title;
      const asin = document.createElement("small"); asin.textContent = "ASIN: " + product.asin;
      const category = document.createElement("select"); category.className = "admin-category";
      category.setAttribute("aria-label", "VELORA category for " + product.asin);
      categories.forEach(([value, label]) => {
        const option = document.createElement("option"); option.value = value; option.textContent = label; category.append(option);
      });
      const add = document.createElement("button"); add.type = "button"; add.className = "button button-dark"; add.textContent = "Add to VELORA";
      add.addEventListener("click", async () => {
        add.disabled = true; add.textContent = "Adding…";
        try {
          await api("/api/admin/products", { method: "POST", body: JSON.stringify({ asin: product.asin, category: category.value }) });
          add.textContent = "Added ✓"; setStatus("Product added to the VELORA edit."); await loadSavedProducts();
        } catch (error) {
          add.disabled = false; add.textContent = "Add to VELORA"; setStatus(error.message, true);
        }
      });
      body.append(title, asin, category, add); card.append(image, body); resultsRoot.append(card);
    });
  }
  async function loadSavedProducts() {
    const payload = await api("/api/admin/products");
    savedRoot.replaceChildren();
    if (!payload.products.length) {
      const empty = document.createElement("p"); empty.className = "admin-empty";
      empty.textContent = "No products have been added yet."; savedRoot.append(empty); return;
    }
    payload.products.forEach(product => {
      const row = document.createElement("div"); row.className = "admin-saved-row";
      const name = document.createElement("div");
      const asin = document.createElement("b"); asin.textContent = product.asin;
      const meta = document.createElement("small"); meta.textContent = product.category + (product.is_active ? " · active" : " · hidden");
      name.append(asin, meta);
      const action = document.createElement("button"); action.type = "button"; action.className = "admin-remove";
      action.textContent = product.is_active ? "Remove" : "Restore";
      action.addEventListener("click", async () => {
        action.disabled = true;
        try {
          if (product.is_active) await api("/api/admin/products", { method: "DELETE", body: JSON.stringify({ asin: product.asin }) });
          else await api("/api/admin/products", { method: "POST", body: JSON.stringify({ asin: product.asin, category: product.category }) });
          await loadSavedProducts();
        } catch (error) {
          setStatus(error.message, true); action.disabled = false;
        }
      });
      row.append(name, action); savedRoot.append(row);
    });
  }
  document.querySelector("#connectAdmin").addEventListener("click", async () => {
    adminToken = tokenInput.value.trim();
    if (!adminToken) { setStatus("Enter the Cloudflare admin token.", true); return; }
    try {
      const result = await api("/api/health");
      if (!result.databaseConfigured) throw new Error("The D1 database binding DB is not ready yet.");
      setStatus("Connected securely. Product management is ready."); await loadSavedProducts();
    } catch (error) {
      adminToken = ""; setStatus(error.message, true);
    }
  });
  document.querySelector("#disconnectAdmin").addEventListener("click", () => {
    adminToken = ""; tokenInput.value = ""; resultsRoot.replaceChildren(); savedRoot.replaceChildren();
    setStatus("Private token cleared from this tab.");
  });
  document.querySelector("#amazonSearchForm").addEventListener("submit", async event => {
    event.preventDefault();
    const keywords = document.querySelector("#amazonKeywords").value.trim();
    resultsRoot.textContent = "Searching Amazon…";
    try {
      const payload = await api("/api/admin/amazon-search", { method: "POST", body: JSON.stringify({ keywords }) });
      renderSearchResults(payload.products); setStatus("Found " + payload.count + " matching product(s). Select the ones that fit VELORA.");
    } catch (error) {
      resultsRoot.replaceChildren();
      const message = document.createElement("p"); message.className = "admin-empty is-error"; message.textContent = error.message;
      resultsRoot.append(message); setStatus(error.message, true);
    }
  });
})();
