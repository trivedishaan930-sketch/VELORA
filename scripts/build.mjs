import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const publishFiles = [
  "index.html", "offline.html", "styles.css", "app.js", "admin-products.html",
  "admin-products.js", "guide.css", "travel-tools.js", "budget-planner.js", "_headers", "_routes.json"
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of publishFiles) await cp(path.join(root, file), path.join(output, file));
await cp(path.join(root, "public"), path.join(output, "public"), { recursive: true });
await cp(path.join(root, "travel"), path.join(output, "travel"), { recursive: true });
for (const directory of ["privacy", "terms", "safety"]) {
  await cp(path.join(root, directory), path.join(output, directory), { recursive: true });
}

const siteOrigin = String(
  process.env.SITE_ORIGIN || "https://velora-75y.pages.dev"
).trim().replace(/\/+$/, "");

const robots = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /admin-products.html",
  "Disallow: /api/",
  "",
  "Sitemap: " + siteOrigin + "/sitemap.xml",
  ""
].join("\n");

const sitemapPaths = [
  "/",
  "/travel/",
  "/travel/india-arrival-ready/",
  "/travel/first-international-trip/",
  "/travel/budget-planner/",
  "/privacy/",
  "/terms/",
  "/safety/"
];
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapPaths.flatMap(route => [
    "  <url>",
    "    <loc>" + siteOrigin + route + "</loc>",
    "    <changefreq>monthly</changefreq>",
    "    <priority>" + (route === "/" ? "1.0" : route === "/travel/" ? "0.8" : "0.7") + "</priority>",
    "  </url>"
  ]),
  "</urlset>",
  ""
].join("\n");

await writeFile(path.join(output, "robots.txt"), robots, "utf8");
await writeFile(path.join(output, "sitemap.xml"), sitemap, "utf8");

console.log("VELORA site build complete for " + siteOrigin);
