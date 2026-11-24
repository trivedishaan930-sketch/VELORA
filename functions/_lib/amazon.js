const CREATOR_API_BASE = "https://creatorsapi.amazon";
let tokenMemo = { token: "", expiresAt: 0, key: "" };

function marketplace(env) {
  return env.AMAZON_MARKETPLACE || "www.amazon.in";
}
function tokenEndpoint(version) {
  if (version === "3.1") return "https://api.amazon.com/auth/o2/token";
  if (version === "3.2") return "https://api.amazon.co.uk/auth/o2/token";
  if (version === "3.3") return "https://api.amazon.co.jp/auth/o2/token";
  throw new Error("Unsupported Amazon credential version. Use 3.1, 3.2 or 3.3.");
}
export function hasAmazonCreatorCredentials(env) {
  return Boolean(env.AMAZON_CLIENT_ID && env.AMAZON_CLIENT_SECRET && env.AMAZON_PARTNER_TAG);
}
async function accessToken(env) {
  if (!hasAmazonCreatorCredentials(env)) throw new Error("Amazon Creators API credentials are not configured.");
  const version = env.AMAZON_CREDENTIAL_VERSION || "3.2";
  const key = env.AMAZON_CLIENT_ID + ":" + version;
  const now = Date.now();
  if (tokenMemo.key === key && tokenMemo.token && tokenMemo.expiresAt > now + 60000) return tokenMemo.token;

  const response = await fetch(tokenEndpoint(version), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: env.AMAZON_CLIENT_ID,
      client_secret: env.AMAZON_CLIENT_SECRET,
      scope: "creatorsapi::default"
    })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token) {
    const error = new Error("Amazon authentication failed. Check Creators API credentials and eligibility.");
    error.status = response.status === 401 || response.status === 403 ? 403 : 502;
    error.amazonCode = payload.error || payload.code || "TOKEN_ERROR";
    throw error;
  }
  const lifetime = Math.max(60, Math.min(Number(payload.expires_in) || 3600, 3600));
  tokenMemo = { token: payload.access_token, expiresAt: now + lifetime * 1000, key };
  return tokenMemo.token;
}
async function catalogRequest(env, operation, requestBody) {
  const token = await accessToken(env);
  const market = marketplace(env);
  const response = await fetch(CREATOR_API_BASE + "/catalog/v1/" + operation, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json",
      "x-marketplace": market
    },
    body: JSON.stringify({ ...requestBody, marketplace: market, partnerTag: env.AMAZON_PARTNER_TAG })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error("Amazon Creators API request failed.");
    error.status = response.status === 403 ? 403 : (response.status === 429 ? 429 : 502);
    error.amazonCode = payload.errors?.[0]?.code || payload.code || "CATALOG_ERROR";
    throw error;
  }
  return payload;
}
export async function searchAmazonProducts(env, keywords) {
  const payload = await catalogRequest(env, "searchItems", {
    keywords, itemCount: 10, searchIndex: "All",
    resources: ["images.primary.medium", "itemInfo.title"]
  });
  return payload.searchResult?.items || [];
}
export async function getAmazonProducts(env, itemIds) {
  if (!Array.isArray(itemIds) || itemIds.length < 1 || itemIds.length > 10) {
    throw new Error("GetItems supports batches of 1 to 10 ASINs.");
  }
  const payload = await catalogRequest(env, "getItems", {
    itemIds, itemIdType: "ASIN",
    resources: ["images.primary.medium", "itemInfo.title"]
  });
  return payload.itemsResult?.items || [];
}
export function normalizeAmazonItem(item, category = "travel-essentials") {
  const imageUrl = item.images?.primary?.medium?.url ||
    item.images?.primary?.large?.url || item.images?.primary?.small?.url || "";
  const title = item.itemInfo?.title?.displayValue || "";
  const affiliateUrl = item.detailPageURL || "";
  const validImage = imageUrl.startsWith("https://m.media-amazon.com/");
  const validLink = affiliateUrl.startsWith("https://www.amazon.in/") ||
    affiliateUrl.startsWith("https://amazon.in/");
  if (!item.asin || !title || !validImage || !validLink) return null;
  return { asin: String(item.asin), title: String(title), imageUrl, affiliateUrl, category };
}
