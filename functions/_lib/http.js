export function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders
    }
  });
}
export async function readJson(request, maxBytes = 4096) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > maxBytes) throw new Error("Request body is too large.");
  const text = await request.text();
  if (text.length > maxBytes) throw new Error("Request body is too large.");
  try { return JSON.parse(text || "{}"); }
  catch { throw new Error("Invalid JSON request body."); }
}
export function requireAdmin(request, env) {
  const expected = env.VELORA_ADMIN_TOKEN;
  const header = request.headers.get("Authorization") || "";
  const supplied = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!expected || !supplied || supplied.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) mismatch |= expected.charCodeAt(i) ^ supplied.charCodeAt(i);
  return mismatch === 0;
}
export function adminError() {
  return jsonResponse({ error: "Authentication required." }, 401);
}
