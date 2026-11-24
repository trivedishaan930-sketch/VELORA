import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const publishFiles = [
  "index.html", "styles.css", "app.js", "admin-products.html",
  "admin-products.js", "robots.txt", "sitemap.xml", "_headers", "_routes.json"
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of publishFiles) await cp(path.join(root, file), path.join(output, file));
await cp(path.join(root, "public"), path.join(output, "public"), { recursive: true });
console.log("VELORA Cloudflare Pages build complete.");
