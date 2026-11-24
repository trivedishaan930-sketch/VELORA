import { jsonResponse, readJson, requireAdmin, adminError } from "../../_lib/http.js";
import { hasAmazonCreatorCredentials, searchAmazonProducts, normalizeAmazonItem } from "../../_lib/amazon.js";

export async function onRequestPost({ request, env }) {
  if (!requireAdmin(request, env)) return adminError();
  if (!env.DB) return jsonResponse({ error: "D1 database binding DB is not configured." }, 503);
  if (!hasAmazonCreatorCredentials(env)) {
    return jsonResponse({
      error: "Amazon Creators API is not configured. Confirm API eligibility and add credentials as Cloudflare secrets.",
      apiSetupRequired: true
    }, 503);
  }
  let body;
  try { body = await readJson(request); }
  catch (error) { return jsonResponse({ error: error.message }, 400); }
  const keywords = String(body.keywords || "").trim().slice(0, 100);
  if (keywords.length < 2) return jsonResponse({ error: "Enter at least two characters to search Amazon." }, 400);

  const now = Date.now();
  const rate = await env.DB.prepare(
    "INSERT INTO api_rate_limits (scope, last_request_at) VALUES ('amazon-search', ?1) " +
    "ON CONFLICT(scope) DO UPDATE SET last_request_at = excluded.last_request_at " +
    "WHERE excluded.last_request_at - api_rate_limits.last_request_at >= 1100"
  ).bind(now).run();
  if (rate.meta && rate.meta.changes === 0) {
    return jsonResponse({ error: "Please wait one second before making another catalogue search." }, 429);
  }

  try {
    const items = await searchAmazonProducts(env, keywords);
    const products = items.map(item => normalizeAmazonItem(item)).filter(Boolean).map(item => ({
      asin: item.asin, title: item.title, imageUrl: item.imageUrl, affiliateUrl: item.affiliateUrl
    }));
    return jsonResponse({ products, count: products.length });
  } catch (error) {
    const status = error.status || 502;
    const message = error.status === 403
      ? "Amazon denied Creators API access. The Associates account may not meet the 10 qualifying sales / 30-day requirement, or credentials may need approval."
      : (error.status === 429 ? "Amazon rate limit reached. Please wait before searching again." : "Amazon product search is temporarily unavailable.");
    return jsonResponse({ error: message, code: error.amazonCode || "AMAZON_API_ERROR" }, status);
  }
}
