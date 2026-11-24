import { jsonResponse } from "../_lib/http.js";
import { hasAmazonCreatorCredentials } from "../_lib/amazon.js";
export async function onRequestGet({ env }) {
  return jsonResponse({
    ok: true,
    service: "VELORA API",
    databaseConfigured: Boolean(env.DB),
    amazonCreatorsApiConfigured: hasAmazonCreatorCredentials(env) && Boolean(env.VELORA_ADMIN_TOKEN),
    note: "No user profile or payment data is collected by this starter API."
  });
}
