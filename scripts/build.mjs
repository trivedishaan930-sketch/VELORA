import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");
const publishFiles = [
  "index.html", "offline.html", "styles.css", "app.js", "admin-products.html",
  "admin-products.js", "guide.css", "site-pages.css", "travel-tools.js", "budget-planner.js", "service-worker-register.js", "manifest.webmanifest", "sw.js", "_headers", "_routes.json"
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of publishFiles) await cp(path.join(root, file), path.join(output, file));
await cp(path.join(root, "public"), path.join(output, "public"), { recursive: true });
await cp(path.join(root, "travel"), path.join(output, "travel"), { recursive: true });
for (const directory of ["experiences", "style", "journal", "about"]) {
  await cp(path.join(root, directory), path.join(output, directory), { recursive: true });
}
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
  "/experiences/",
  "/style/",
  "/journal/",
  "/journal/postcards-from-blue-hour/",
  "/journal/small-gestures/",
  "/journal/a-night-with-no-itinerary/",
  "/about/",
  "/privacy/",
  "/terms/",
  "/safety/"
];
// Inject the shared PWA manifest and root-scoped service-worker registration into
// every public, indexable entry route. Source pages stay readable and route-specific.
for (const route of sitemapPaths) {
  const relativePage = route === "/" ? "index.html" : path.join(route.slice(1), "index.html");
  const outputPath = path.join(output, relativePage);
  let html = await readFile(outputPath, "utf8");
  const closingHead = html.indexOf("</head>");
  if (closingHead < 0) throw new Error("Public page is missing </head>: " + relativePage);
  const additions = [];
  if (!html.includes('<link rel="manifest" href="/manifest.webmanifest">')) {
    additions.push('<link rel="manifest" href="/manifest.webmanifest">');
  }
  if (!html.includes('<script defer src="/service-worker-register.js"></script>')) {
    additions.push('<script defer src="/service-worker-register.js"></script>');
  }
  if (additions.length) {
    html = html.slice(0, closingHead) + additions.join("") + html.slice(closingHead);
    await writeFile(outputPath, html, "utf8");
  }
}

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
