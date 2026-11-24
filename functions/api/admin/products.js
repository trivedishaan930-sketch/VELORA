import { jsonResponse, readJson, requireAdmin, adminError } from "../../_lib/http.js";

const CATEGORIES = new Set(["luggage", "bags", "travel-tech", "style", "beauty", "comfort", "gifts"]);

export async function onRequest({ request, env }) {
  if (!requireAdmin(request, env)) return adminError();
  if (!env.DB) return jsonResponse({ error: "D1 database binding DB is not configured." }, 503);

  if (request.method === "GET") {
    const result = await env.DB.prepare(
      "SELECT asin, category, is_active, display_order, created_at FROM featured_products ORDER BY display_order ASC, created_at DESC"
    ).all();
    return jsonResponse({ products: result.results || [] });
  }

  if (request.method === "POST") {
    let body;
    try { body = await readJson(request); }
    catch (error) { return jsonResponse({ error: error.message }, 400); }
    const asin = String(body.asin || "").trim().toUpperCase();
    const category = String(body.category || "luggage");
    const displayOrder = Math.max(0, Math.min(9999, Number(body.displayOrder) || 100));
    if (!/^[A-Z0-9]{8,14}$/.test(asin)) return jsonResponse({ error: "Invalid ASIN." }, 400);
    if (!CATEGORIES.has(category)) return jsonResponse({ error: "Invalid product category." }, 400);

    const now = Date.now();
    await env.DB.prepare(
      "INSERT INTO featured_products (asin, category, is_active, display_order, created_at, updated_at) " +
      "VALUES (?1, ?2, 1, ?3, ?4, ?4) " +
      "ON CONFLICT(asin) DO UPDATE SET category = excluded.category, is_active = 1, display_order = excluded.display_order, updated_at = excluded.updated_at"
    ).bind(asin, category, displayOrder, now).run();
    return jsonResponse({ ok: true, asin, category });
  }

  if (request.method === "DELETE") {
    let body;
    try { body = await readJson(request); }
    catch (error) { return jsonResponse({ error: error.message }, 400); }
    const asin = String(body.asin || "").trim().toUpperCase();
    if (!/^[A-Z0-9]{8,14}$/.test(asin)) return jsonResponse({ error: "Invalid ASIN." }, 400);
    await env.DB.prepare("UPDATE featured_products SET is_active = 0, updated_at = ?1 WHERE asin = ?2")
      .bind(Date.now(), asin).run();
    // Remove cached Amazon catalogue content as soon as the curator hides the item.
    await env.DB.prepare("DELETE FROM amazon_product_cache WHERE asin = ?1").bind(asin).run();
    return jsonResponse({ ok: true, asin });
  }

  return jsonResponse({ error: "Method not allowed." }, 405, { Allow: "GET, POST, DELETE" });
}
