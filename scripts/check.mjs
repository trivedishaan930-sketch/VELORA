import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'index.html', 'styles.css', 'app.js', 'package.json',
  'admin-products.html', 'admin-products.js', 'guide.css', 'travel-tools.js', 'travel/index.html', 'travel/india-arrival-ready/index.html', 'travel/first-international-trip/index.html', 'travel/budget-planner/index.html', 'budget-planner.js', 'scripts/build.mjs',
  'functions/_lib/amazon.js', 'functions/_lib/http.js',
  'functions/api/health.js', 'functions/api/products.js',
  'functions/api/admin/amazon-search.js', 'functions/api/admin/products.js',
  'migrations/0001_initial.sql', 'wrangler.toml', '_routes.json',
  'public/assets/hero/velora-sunset-couple.jpg',
  'public/assets/destinations/maldives.webp',
  'public/assets/destinations/amalfi-coast.webp',
  'public/assets/destinations/kyoto-garden.webp',
  'public/assets/experiences/couple-sunset-walk.webp',
  'public/icons/velora-mark.svg', 'README.md', 'BUSINESS-PLAN.md',
  'docs/CLOUDFLARE-DEPLOYMENT.md', 'LICENSE'
];
const missing = required.filter(file => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error('Missing required files:', missing.join(', '));
  process.exit(1);
}

const jsFiles = [
  'app.js', 'admin-products.js', 'travel-tools.js', 'budget-planner.js', 'scripts/build.mjs',
  'functions/_lib/amazon.js', 'functions/_lib/http.js',
  'functions/api/health.js', 'functions/api/products.js',
  'functions/api/admin/amazon-search.js', 'functions/api/admin/products.js'
];
for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, file)], { encoding: 'utf8' });
  if (result.status !== 0) {
    console.error('JavaScript syntax failed:', file);
    process.stderr.write(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const requiredOccasions = ['romantic-escape', 'honeymoon', 'anniversary', 'proposal', 'first-trip', 'solo-reset', 'friends', 'family'];
if (!html.includes('id="planOccasion"') || requiredOccasions.some(key => !appSource.includes('"'+key+'"'))) {
  console.error('Occasion-aware getaway planner is incomplete.');
  process.exit(1);
}

let siteOrigin = String(process.env.SITE_ORIGIN || 'https://velora-75y.pages.dev').trim();
while (siteOrigin.endsWith('/')) siteOrigin = siteOrigin.slice(0, -1);
const travelPages = [
  { file: 'travel/index.html', route: '/travel/', title: 'Travel Planning, With Confidence — VELORA Travel Guides' },
  { file: 'travel/india-arrival-ready/index.html', route: '/travel/india-arrival-ready/', title: 'India Arrival Ready: Your First 72 Hours — VELORA' },
  { file: 'travel/first-international-trip/index.html', route: '/travel/first-international-trip/', title: 'Your First International Trip: A Practical Checklist — VELORA' },
  { file: 'travel/budget-planner/index.html', route: '/travel/budget-planner/', title: 'Trip Budget Planner — Estimate Your Travel Costs | VELORA' }
];
const titlesSeen = new Set();
for (const page of travelPages) {
  const source = fs.readFileSync(path.join(root, page.file), 'utf8');
  const titleStart = source.indexOf('<title>');
  const titleEnd = source.indexOf('</title>');
  const title = titleStart >= 0 && titleEnd > titleStart ? source.slice(titleStart + 7, titleEnd).trim() : '';
  const headingCount = source.split('<h1').length - 1;
  const hasDescription = source.includes('name="description" content="');
  const hasCanonical = source.includes('rel="canonical" href="' + siteOrigin + page.route + '"');
  if (!title || title !== page.title || titlesSeen.has(title)) {
    console.error('Travel page title check failed:', page.file, title);
    process.exit(1);
  }
  titlesSeen.add(title);
  if (headingCount !== 1 || !hasDescription || !hasCanonical || !source.includes('guide.css')) {
    console.error('Travel page SEO structure failed:', page.file);
    process.exit(1);
  }
  if (page.route !== '/travel/' && page.route !== '/travel/budget-planner/' && !source.includes('/travel-tools.js')) {
    console.error('Interactive travel checklist script missing:', page.file);
    process.exit(1);
  }
  if (page.route === '/travel/budget-planner/' && !source.includes('/budget-planner.js')) {
    console.error('Budget calculator script missing:', page.file);
    process.exit(1);
  }
}

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length) {
  console.error('Duplicate HTML IDs:', [...new Set(duplicates)].join(', '));
  process.exit(1);
}

const targets = new Set(ids);
const missingAnchors = [...new Set(
  [...html.matchAll(/\bhref="#([^"]+)"/g)].map(match => match[1]).filter(id => !targets.has(id))
)];
if (missingAnchors.length) {
  console.error('Broken in-page anchors:', missingAnchors.join(', '));
  process.exit(1);
}

if (!html.includes('id="shop"') || !html.includes('id="productGrid"')) {
  console.error('The VELORA Shop Edit or product grid is missing.');
  process.exit(1);
}
const routeConfig = JSON.parse(fs.readFileSync(path.join(root, '_routes.json'), 'utf8'));
if (routeConfig.version !== 1 || !routeConfig.include?.includes('/api/*')) {
  console.error('Cloudflare Pages route configuration is invalid.');
  process.exit(1);
}
const amazonModule = fs.readFileSync(path.join(root, 'functions/_lib/amazon.js'), 'utf8');
if (!amazonModule.includes('https://creatorsapi.amazon') || !amazonModule.includes('creatorsapi::default')) {
  console.error('Amazon Creators API server module is missing required endpoints/scopes.');
  process.exit(1);
}
if (/AKIA[0-9A-Z]{16}|amzn\.mws\.[A-Za-z0-9/+=]{20,}/.test(amazonModule)) {
  console.error('Potential credential-like string found in Amazon integration source.');
  process.exit(1);
}
const localAssets = [...html.matchAll(/(?:src|href)="(public\/[^"]+|styles\.css|app\.js)"/g)].map(match => match[1]);
const brokenAssets = localAssets.filter(asset => !fs.existsSync(path.join(root, asset)));
if (brokenAssets.length) {
  console.error('Broken local assets:', brokenAssets.join(', '));
  process.exit(1);
}

const build = spawnSync(process.execPath, [path.join(root, 'scripts/build.mjs')], { cwd: root, encoding: 'utf8' });
if (build.status !== 0) {
  console.error('Cloudflare build failed.');
  process.stderr.write(build.stderr || build.stdout);
  process.exit(build.status ?? 1);
}
const dist = path.join(root, 'dist');
const publicFiles = [
  'index.html', 'styles.css', 'app.js', 'admin-products.html', 'admin-products.js',
  'robots.txt', 'sitemap.xml', '_headers', '_routes.json',
  'public/assets/hero/velora-sunset-couple.jpg', 'public/icons/velora-mark.svg', 'guide.css', 'travel-tools.js', 'travel/index.html', 'travel/india-arrival-ready/index.html', 'travel/first-international-trip/index.html', 'travel/budget-planner/index.html', 'budget-planner.js'
];
const missingDist = publicFiles.filter(file => !fs.existsSync(path.join(dist, file)));
if (missingDist.length) {
  console.error('Build output is missing files:', missingDist.join(', '));
  process.exit(1);
}
const requiredGuideDist = ['travel/index.html', 'travel/india-arrival-ready/index.html', 'travel/first-international-trip/index.html', 'travel/budget-planner/index.html'];
const missingGuideDist = requiredGuideDist.filter(file => !fs.existsSync(path.join(dist, file)));
if (missingGuideDist.length) {
  console.error('Build output is missing travel pages:', missingGuideDist.join(', '));
  process.exit(1);
}
const sitemapContent = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
for (const page of travelPages) {
  if (!sitemapContent.includes('<loc>' + siteOrigin + page.route + '</loc>')) {
    console.error('Travel page missing from sitemap:', page.route);
    process.exit(1);
  }
}
const forbiddenDist = ['functions', 'migrations', 'docs', '.env.example', 'wrangler.toml', 'package.json']
  .filter(file => fs.existsSync(path.join(dist, file)));
if (forbiddenDist.length) {
  console.error('Private/source files unexpectedly included in public build:', forbiddenDist.join(', '));
  process.exit(1);
}
console.log('VELORA checks passed: ' + required.length + ' required files, ' + jsFiles.length +
  ' JavaScript syntax checks, unique IDs, anchor targets, API routes, Amazon module, local assets and safe build output.');
