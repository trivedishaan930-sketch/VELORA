import { jsonResponse } from "../_lib/http.js";
import { hasAmazonCreatorCredentials, getAmazonProducts, normalizeAmazonItem } from "../_lib/amazon.js";

const CACHE_TTL_MS = 23 * 60 * 60 * 1000;

export async function onRequestGet({ env }) {
  if (!env.DB) return jsonResponse({ error: "Product database is not connected yet.", setupRequired: true }, 503);

  const now = Date.now();
  await env.DB.prepare("DELETE FROM amazon_product_cache WHERE expires_at <= ?1").bind(now).run();

  const result = await env.DB.prepare(
    "SELECT asin, category FROM featured_products WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC LIMIT 30"
  ).all();
  const featured = result.results || [];
  if (!featured.length) return jsonResponse({ products: [] }, 200, { "Cache-Control": "public, max-age=60" });
  const byAsin = new Map();
  const refresh = [];

  for (const row of featured) {
    const cached = await env.DB.prepare(
      "SELECT payload_json, expires_at FROM amazon_product_cache WHERE asin = ?1"
    ).bind(row.asin).first();
    if (cached && Number(cached.expires_at) > now) {
      try {
        byAsin.set(row.asin, { ...JSON.parse(cached.payload_json), category: row.category });
      } catch {
        refresh.push(row);
      }
    } else {
      refresh.push(row);
    }
  }

  if (refresh.length && !hasAmazonCreatorCredentials(env)) {
    return jsonResponse({ error: "Amazon Creators API is not configured yet.", setupRequired: true }, 503);
  }

  for (let offset = 0; offset < refresh.length; offset += 10) {
    const batch = refresh.slice(offset, offset + 10);
    const items = await getAmazonProducts(env, batch.map(row => row.asin));
    const returned = new Map(items.map(item => [String(item.asin), item]));
    for (const row of batch) {
      const item = returned.get(row.asin);
      if (!item) continue;
      const product = normalizeAmazonItem(item, row.category);
      if (!product) continue;
      const cachePayload = {
        asin: product.asin,
        title: product.title,
        imageUrl: product.imageUrl,
        affiliateUrl: product.affiliateUrl
      };
      await env.DB.prepare(
        "INSERT INTO amazon_product_cache (asin, payload_json, expires_at, updated_at) VALUES (?1, ?2, ?3, ?4) " +
        "ON CONFLICT(asin) DO UPDATE SET payload_json = excluded.payload_json, expires_at = excluded.expires_at, updated_at = excluded.updated_at"
      ).bind(row.asin, JSON.stringify(cachePayload), now + CACHE_TTL_MS, now).run();
      byAsin.set(row.asin, product);
    }
  }

  const products = featured.map(row => byAsin.get(row.asin)).filter(Boolean);
  return jsonResponse({
    products,
    disclosure: "As an Amazon Associate I earn from qualifying purchases."
  }, 200, { "Cache-Control": "public, max-age=120, stale-while-revalidate=60" });
}
