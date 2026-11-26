import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'index.html', 'offline.html', 'styles.css', 'app.js', 'package.json',
  'privacy/index.html', 'terms/index.html', 'safety/index.html',
  'admin-products.html', 'admin-products.js', 'guide.css', 'site-pages.css', 'travel-tools.js', 'travel/index.html', 'travel/india-arrival-ready/index.html', 'travel/first-international-trip/index.html', 'travel/budget-planner/index.html', 'budget-planner.js', 'scripts/build.mjs',
  'experiences/index.html', 'style/index.html', 'journal/index.html', 'journal/postcards-from-blue-hour/index.html', 'journal/small-gestures/index.html', 'journal/a-night-with-no-itinerary/index.html', 'about/index.html',
  'functions/_lib/amazon.js', 'functions/_lib/http.js',
  'functions/api/health.js', 'functions/api/products.js',
  'functions/api/admin/amazon-search.js', 'functions/api/admin/products.js',
  'migrations/0001_initial.sql', 'wrangler.toml', '_routes.json',
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
const experiencesHtml = fs.readFileSync(path.join(root, 'experiences/index.html'), 'utf8');
const styleHtml = fs.readFileSync(path.join(root, 'style/index.html'), 'utf8');
const aboutHtml = fs.readFileSync(path.join(root, 'about/index.html'), 'utf8');
const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const requiredOccasions = ['romantic-escape', 'honeymoon', 'anniversary', 'proposal', 'first-trip', 'solo-reset', 'friends', 'family'];
if (!experiencesHtml.includes('id="planOccasion"') || requiredOccasions.some(key => !appSource.includes('"'+key+'"')) ||
    !styleHtml.includes('id="styleStudio"') || !styleHtml.includes('id="styleResult"')) {
  console.error('Occasion-aware getaway planner is incomplete.');
  process.exit(1);
}

const supportedCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'THB', 'JPY'];
const plannerCurrencyBlock = experiencesHtml.slice(experiencesHtml.indexOf('id="planBudgetCurrency"'), experiencesHtml.indexOf('</select>', experiencesHtml.indexOf('id="planBudgetCurrency"')) + 9);
const plannerTravellerField = experiencesHtml.includes('id="planTravellers" name="travellers" type="number"');
if (!plannerCurrencyBlock || supportedCurrencies.some(code => !plannerCurrencyBlock.includes('value="' + code + '"')) ||
    !plannerCurrencyBlock.includes('value="INR" selected') || !plannerTravellerField ||
    !experiencesHtml.includes('id="planBudgetAmount"') || experiencesHtml.includes('id="planBudget"')) {
  console.error('Local-currency budget and exact traveller-count inputs are incomplete.');
  process.exit(1);
}
const budgetPageSource = fs.readFileSync(path.join(root, 'travel/budget-planner/index.html'), 'utf8');
const budgetScriptSource = fs.readFileSync(path.join(root, 'budget-planner.js'), 'utf8');
const budgetCurrencyStart = budgetPageSource.indexOf('id="budgetCurrency"');
const budgetCurrencyBlock = budgetPageSource.slice(budgetCurrencyStart, budgetPageSource.indexOf('</select>', budgetCurrencyStart) + 9);
if (supportedCurrencies.some(code => !budgetCurrencyBlock.includes('value="' + code + '"')) ||
    !budgetPageSource.includes('id="plannerContextNote"') ||
    !appSource.includes('velora-planner-budget-handoff-v1') ||
    !appSource.includes('localStorage.setItem(plannerHandoffKey') ||
    !appSource.includes("window.location.assign('/travel/budget-planner/')") ||
    !budgetScriptSource.includes('function applyPlannerHandoff') ||
    !budgetScriptSource.includes('localStorage.removeItem(handoffKey)') ||
    !fs.readFileSync(path.join(root, 'privacy/index.html'), 'utf8').includes('one-time')) {
  console.error('Planner-to-budget local handoff, receiving context or privacy notice is incomplete.');
  process.exit(1);
}
if (!appSource.includes('function resolvePlannerStyle') || !appSource.includes('"kyoto"') || !appSource.includes('Culture & city')) {
  console.error('Destination/style compatibility guidance is missing.');
  process.exit(1);
}
if (!appSource.includes('resolveUseCulture') || !appSource.includes('resolveEditDestination') ||
    appSource.includes("$('#chatForm')") || appSource.includes("$('#floatConcierge')") ||
    appSource.includes('function localConciergeReply') || appSource.includes('loadProductEdit') ||
    appSource.includes('heroSearchForm')) {
  console.error('Planner conflict choices or removal of unused demo/shop/search code is incomplete.');
  process.exit(1);
}
const homepageSections = [...html.matchAll(/<section\b/g)].length;
if (homepageSections > 9 || html.includes('hero-search-panel') || html.includes('heroSearchForm') ||
    html.includes('id="concierge"') || html.includes('id="chatForm"') ||
    html.includes('class="concierge-section"') || html.includes('class="wellness-section"') ||
    html.includes('class="closing-section"') || html.includes('class="floating-concierge"')) {
  console.error('Homepage still contains redundant modules, a duplicate hero search or a demo chat shell.');
  process.exit(1);
}
if (!aboutHtml.includes('FUTURE') || !aboutHtml.includes('VELORA AI Concierge') ||
    !aboutHtml.includes('LIVE GUIDES') || html.includes('Rules-based local prototype')) {
  console.error('Future AI Concierge capability is not labelled honestly.');
  process.exit(1);
}
if (!html.includes('ROMANCE · CONNECTION · LIFESTYLE') || !html.includes('Start a plan') ||
    !html.includes('href="/experiences/"') || !html.includes('href="/travel/"') ||
    !html.includes('href="/style/"') || !html.includes('href="/journal/"') || !html.includes('href="/about/"')) {
  console.error('The homepage brand/navigation entry points are incomplete.');
  process.exit(1);
}
if (!html.includes('public/assets/experiences/couple-sunset-walk.webp') ||
    html.includes('velora-hero-editorial.svg') || html.includes('velora-sunset-couple.jpg') ||
    !html.includes('public/assets/destinations/maldives.webp') ||
    !html.includes('public/assets/destinations/amalfi-coast.webp') ||
    !html.includes('public/assets/destinations/kyoto-garden.webp') ||
    html.includes('MADE FOR ADULTS') ||
    !html.includes('THOUGHTFUL EXPERIENCES. BEAUTIFULLY CONSIDERED.') ||
    !html.includes('og:image') || !html.includes('twitter:image') ||
    html.includes('Manrope:wght')) {
  console.error('Premium photography, destination images, announcement copy or one-sans font setup is incomplete.');
  process.exit(1);
}
const siteCss = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const sitePagesCss = fs.readFileSync(path.join(root, 'site-pages.css'), 'utf8');
const serviceWorker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
if (!siteCss.includes('.floating-concierge{display:none}') || !siteCss.includes('font-size:16px') ||
    !sitePagesCss.includes('.page-header') || !sitePagesCss.includes('.gateway-card-grid') ||
    !sitePagesCss.includes('@media(max-width:480px)') || !sitePagesCss.includes('prefers-reduced-motion')) {
  console.error('Responsive multi-page design system checks are missing.');
  process.exit(1);
}
if (!serviceWorker.includes('velora-shell-v12') ||
    !serviceWorker.includes('couple-sunset-walk.webp') ||
    !serviceWorker.includes('maldives.webp') ||
    !serviceWorker.includes('amalfi-coast.webp') ||
    !serviceWorker.includes('kyoto-garden.webp') ||
    !serviceWorker.includes('await cache.addAll(CORE_ASSETS)') ||
    !serviceWorker.includes('await cache.add(asset)') ||
    !serviceWorker.includes("'./experiences/'") || !serviceWorker.includes("'./style/'") ||
    !serviceWorker.includes("'./journal/'") || !serviceWorker.includes("'./about/'") ||
    !serviceWorker.includes('./offline.html') ||
    !serviceWorker.includes("caches.match('./offline.html')")) {
  console.error('Offline image caching or route-aware fallback is incomplete.');
  process.exit(1);
}

let siteOrigin = String(process.env.SITE_ORIGIN || 'https://velora-75y.pages.dev').trim();
while (siteOrigin.endsWith('/')) siteOrigin = siteOrigin.slice(0, -1);
const travelPages = [
  { file: 'travel/index.html', route: '/travel/', title: 'Travel Planning, With Confidence — VELORA Travel Guides' },
  { file: 'travel/india-arrival-ready/index.html', route: '/travel/india-arrival-ready/', title: 'India Arrival Ready: Your First 72 Hours — VELORA' },
  { file: 'travel/first-international-trip/index.html', route: '/travel/first-international-trip/', title: 'First International Trip Checklist — VELORA' },
  { file: 'travel/budget-planner/index.html', route: '/travel/budget-planner/', title: 'Trip Budget Planner — Estimate Your Travel Costs | VELORA' }
];
const contentPages = [
  { file: 'experiences/index.html', route: '/experiences/', title: 'Getaway & Experience Planner | VELORA' },
  { file: 'style/index.html', route: '/style/', title: 'Personal Style & Travel Outfits | VELORA' },
  { file: 'journal/index.html', route: '/journal/', title: 'The VELORA Journal — Stories & Date Ideas' },
  { file: 'journal/postcards-from-blue-hour/index.html', route: '/journal/postcards-from-blue-hour/', title: 'Postcards from the Blue Hour | VELORA' },
  { file: 'journal/small-gestures/index.html', route: '/journal/small-gestures/', title: 'Small Gestures, Lasting Meaning | VELORA' },
  { file: 'journal/a-night-with-no-itinerary/index.html', route: '/journal/a-night-with-no-itinerary/', title: 'A Night With No Itinerary | VELORA' },
  { file: 'about/index.html', route: '/about/', title: 'About VELORA — Romance, Travel & Lifestyle' }
];
const policyPages = [
  { file: 'privacy/index.html', route: '/privacy/', title: 'Privacy Information — VELORA' },
  { file: 'terms/index.html', route: '/terms/', title: 'Terms of Use — VELORA' },
  { file: 'safety/index.html', route: '/safety/', title: 'Safety & Respect — VELORA' }
];
const allContentPages = [...contentPages, ...travelPages, ...policyPages];
const titlesSeen = new Set();
for (const page of allContentPages) {
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
  if (headingCount !== 1 || !hasDescription || !hasCanonical ||
      (!source.includes('guide.css') && !source.includes('site-pages.css'))) {
    console.error('Travel page SEO structure failed:', page.file);
    process.exit(1);
  }
  if (page.route.startsWith('/travel/') && page.route !== '/travel/' && page.route !== '/travel/budget-planner/' && !source.includes('/travel-tools.js')) {
    console.error('Interactive travel checklist script missing:', page.file);
    process.exit(1);
  }
  if (page.route === '/travel/budget-planner/' && !source.includes('/budget-planner.js')) {
    console.error('Budget calculator script missing:', page.file);
    process.exit(1);
  }
}

const privacyPolicySource = fs.readFileSync(path.join(root, 'privacy/index.html'), 'utf8');
const termsPolicySource = fs.readFileSync(path.join(root, 'terms/index.html'), 'utf8');
if (!appSource.includes('View full plan') || !appSource.includes('item.details') ||
    !appSource.includes('result.cloneNode(true)') ||
    !appSource.includes('VELORA — MY SAVED MOMENTS & PLANS') ||
    !experiencesHtml.includes('Saving stores the full plan only in this browser on this device.') ||
    !privacyPolicySource.includes('complete experience plans you explicitly save') ||
    !html.includes('Make room<br>for <em>what matters.</em>') ||
    !html.includes('Make Room for Romance is where VELORA begins')) {
  console.error('Full-plan local saving/export, privacy disclosure or broad VELORA homepage positioning is incomplete.');
  process.exit(1);
}
if (!privacyPolicySource.includes('planned future capability') ||
    privacyPolicySource.includes('rules-based browser demonstration') ||
    !termsPolicySource.includes('not available in the current public prototype')) {
  console.error('Policy pages do not match the published AI Concierge capability state.');
  process.exit(1);
}

const metadataPages = [
  { file: 'index.html', label: 'homepage' },
  ...contentPages,
  ...travelPages,
  ...policyPages
];
for (const page of metadataPages) {
  const source = page.file === 'index.html' ? html : fs.readFileSync(path.join(root, page.file), 'utf8');
  const titleMatch = source.match(/<title>([^<]+)<\/title>/i);
  const descriptionMatch = source.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i);
  const titleLength = titleMatch ? titleMatch[1].trim().length : 0;
  const descriptionLength = descriptionMatch ? descriptionMatch[1].trim().length : 0;
  if (!titleLength || titleLength > 60 || descriptionLength < 70 || descriptionLength > 160) {
    console.error('Search metadata length check failed:', page.file, { titleLength, descriptionLength });
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

if (html.includes('id="shop"') || html.includes('id="productGrid"') || html.includes('href="#shop"')) {
  console.error('Inactive Shop should not be presented as a live homepage destination.');
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
const localAssets = [...html.matchAll(/(?:src|href)="(\/?public\/[^"]+|\/?styles\.css|\/?site-pages\.css|\/?app\.js)"/g)]
  .map(match => match[1].replace(/^\/+/, ''));
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
  'index.html', 'offline.html', 'styles.css', 'app.js', 'admin-products.html', 'admin-products.js',
  'robots.txt', 'sitemap.xml', '_headers', '_routes.json', 'site-pages.css',
  'experiences/index.html', 'style/index.html', 'journal/index.html', 'journal/postcards-from-blue-hour/index.html', 'journal/small-gestures/index.html', 'journal/a-night-with-no-itinerary/index.html', 'about/index.html',
  'public/assets/experiences/couple-sunset-walk.webp', 'public/assets/destinations/maldives.webp', 'public/assets/destinations/amalfi-coast.webp', 'public/assets/destinations/kyoto-garden.webp', 'public/icons/velora-mark.svg', 'guide.css', 'privacy/index.html', 'terms/index.html', 'safety/index.html', 'travel-tools.js', 'travel/index.html', 'travel/india-arrival-ready/index.html', 'travel/first-international-trip/index.html', 'travel/budget-planner/index.html', 'budget-planner.js'
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
for (const page of allContentPages) {
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
  ' JavaScript syntax checks, multi-page content metadata, unique IDs, anchor targets, planner and style tools, API routes, sitemap, assets and safe build output.');
