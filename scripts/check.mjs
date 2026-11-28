import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let siteOrigin = String(process.env.SITE_ORIGIN || 'https://velora-75y.pages.dev').trim();
while (siteOrigin.endsWith('/')) siteOrigin = siteOrigin.slice(0, -1);
const required = [
  'index.html', 'offline.html', 'styles.css', 'app.js', 'manifest.webmanifest', 'service-worker-register.js', 'package.json',
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
  'app.js', 'admin-products.js', 'travel-tools.js', 'budget-planner.js', 'service-worker-register.js', 'scripts/build.mjs',
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

// Exercise the public product endpoint's setup states without live services.
const { onRequestGet: getPublicProducts } = await import('../functions/api/products.js');
const missingDatabaseResponse = await getPublicProducts({ env: {} });
if (missingDatabaseResponse.status !== 503) {
  console.error('Product API must return 503 when D1 is not configured.');
  process.exit(1);
}
function mockProductDatabase(cachedProduct = null) {
  return {
    prepare() {
      return {
        bind() { return this; },
        async run() { return { success: true }; },
        async all() { return { results: [{ asin: 'B000000001', category: 'luggage' }] }; },
        async first() { return cachedProduct; }
      };
    }
  };
}
const missingAmazonResponse = await getPublicProducts({ env: { DB: mockProductDatabase() } });
const missingAmazonPayload = await missingAmazonResponse.json();
if (missingAmazonResponse.status !== 503 || missingAmazonPayload.setupRequired !== true ||
    missingAmazonPayload.error !== 'Amazon Creators API is not configured yet.') {
  console.error('Product API must return a clear setup response when uncached products need Amazon credentials.');
  process.exit(1);
}
const cachedAmazonPayload = {
  asin: 'B000000001',
  title: 'Cached luggage',
  imageUrl: 'https://m.media-amazon.com/images/I/example.jpg',
  affiliateUrl: 'https://www.amazon.in/dp/B000000001'
};
const cachedProductResponse = await getPublicProducts({
  env: {
    DB: mockProductDatabase({
      payload_json: JSON.stringify(cachedAmazonPayload),
      expires_at: Date.now() + 60000
    })
  }
});
const cachedProductBody = await cachedProductResponse.json();
if (cachedProductResponse.status !== 200 || cachedProductBody.products?.[0]?.title !== 'Cached luggage') {
  console.error('Product API must continue serving valid cached catalogue items without refreshing Amazon credentials.');
  process.exit(1);
}

const cloudflareWorkflow = fs.readFileSync(path.join(root, '.github/workflows/cloudflare.yml'), 'utf8');
if (!cloudflareWorkflow.includes('"$SITE_ORIGIN/api/products"') ||
    !cloudflareWorkflow.includes('payload.setupRequired === true') ||
    !cloudflareWorkflow.includes('Array.isArray(payload.products)')) {
  console.error('Production smoke test must validate both the catalogue and explicit API setup responses.');
  process.exit(1);
}

const serviceWorkerDownloadIndex = cloudflareWorkflow.indexOf('"$SITE_ORIGIN/sw.js" -o "$RUNNER_TEMP/velora-sw.js"');
const serviceWorkerApiAssertionIndex = cloudflareWorkflow.indexOf('url.pathname.startsWith');
const serviceWorkerAuthAssertionIndex = cloudflareWorkflow.indexOf('request.headers.has');
if (serviceWorkerDownloadIndex < 0 ||
    serviceWorkerApiAssertionIndex <= serviceWorkerDownloadIndex ||
    serviceWorkerAuthAssertionIndex <= serviceWorkerDownloadIndex) {
  console.error('Production smoke test must download sw.js before checking its API/auth guards.');
  process.exit(1);
}

// Exercise the service-worker fetch policy in an isolated Node VM.
const serviceWorkerSource = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const serviceWorkerListeners = new Map();
let serviceWorkerCacheMatches = 0;
let serviceWorkerCachePuts = 0;
let serviceWorkerNetworkResponse = async () => new Response('network resource', {
  headers: { 'Cache-Control': 'public, max-age=3600' }
});
const serviceWorkerCache = {
  async put() { serviceWorkerCachePuts += 1; },
  async addAll() {}
};
const serviceWorkerCaches = {
  async match() { serviceWorkerCacheMatches += 1; return null; },
  async open() { return serviceWorkerCache; },
  async keys() { return ['velora-shell-v15']; },
  async delete() { return true; }
};
const serviceWorkerSelf = {
  location: { origin: 'https://velora-75y.pages.dev' },
  clients: { async claim() {} },
  async skipWaiting() {},
  addEventListener(type, listener) { serviceWorkerListeners.set(type, listener); }
};
runInNewContext(serviceWorkerSource, {
  self: serviceWorkerSelf,
  caches: serviceWorkerCaches,
  URL,
  Response,
  fetch: (...args) => serviceWorkerNetworkResponse(...args)
});
async function dispatchServiceWorkerFetch(request) {
  let responsePromise = null;
  const listener = serviceWorkerListeners.get('fetch');
  if (!listener) throw new Error('Service worker fetch handler was not registered.');
  listener({ request, respondWith(value) { responsePromise = Promise.resolve(value); } });
  const response = responsePromise ? await responsePromise : null;
  await new Promise(resolve => setImmediate(resolve));
  return { handled: responsePromise !== null, response };
}
const serviceWorkerOrigin = 'https://velora-75y.pages.dev';
if (!serviceWorkerSource.includes('velora-shell-v15')) {
  console.error('Service worker cache version is not v15.');
  process.exit(1);
}
for (const url of [
  serviceWorkerOrigin + '/api',
  serviceWorkerOrigin + '/api/health',
  serviceWorkerOrigin + '/api/products',
  serviceWorkerOrigin + '/api/admin/products'
]) {
  const beforeMatches = serviceWorkerCacheMatches;
  const result = await dispatchServiceWorkerFetch(new Request(url));
  if (result.handled || serviceWorkerCacheMatches !== beforeMatches) {
    console.error('Service worker must leave API requests network-only:', url);
    process.exit(1);
  }
}
const privateRequest = new Request(serviceWorkerOrigin + '/private/data', {
  headers: { Authorization: 'Bearer test-token' }
});
const beforePrivateMatches = serviceWorkerCacheMatches;
if ((await dispatchServiceWorkerFetch(privateRequest)).handled ||
    serviceWorkerCacheMatches !== beforePrivateMatches) {
  console.error('Service worker must not intercept requests carrying Authorization.');
  process.exit(1);
}
const noStoreRequest = new Request(serviceWorkerOrigin + '/private/data', { cache: 'no-store' });
if ((await dispatchServiceWorkerFetch(noStoreRequest)).handled) {
  console.error('Service worker must leave no-store requests network-only.');
  process.exit(1);
}
serviceWorkerNetworkResponse = async () => new Response('static resource');
const publicAssetResponse = await dispatchServiceWorkerFetch(
  new Request(serviceWorkerOrigin + '/styles.css')
);
if (!publicAssetResponse.handled || publicAssetResponse.response.status !== 200 ||
    serviceWorkerCachePuts !== 1) {
  console.error('Service worker must continue caching public static assets.');
  process.exit(1);
}
for (const headers of [
  { 'Cache-Control': 'no-store' },
  { 'Cache-Control': 'private, max-age=60' },
  { Vary: '*' }
]) {
  serviceWorkerNetworkResponse = async () => new Response('non-cacheable resource', { headers });
  await dispatchServiceWorkerFetch(new Request(serviceWorkerOrigin + '/public/response'));
  if (serviceWorkerCachePuts !== 1) {
    console.error('Service worker cached a response marked private, no-store or Vary: *.');
    process.exit(1);
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
const travelToolsSource = fs.readFileSync(path.join(root, 'travel-tools.js'), 'utf8');
const arrivalGuideSource = fs.readFileSync(path.join(root, 'travel/india-arrival-ready/index.html'), 'utf8');
const outboundGuideSource = fs.readFileSync(path.join(root, 'travel/first-international-trip/index.html'), 'utf8');
const budgetCurrencyStart = budgetPageSource.indexOf('id="budgetCurrency"');
const budgetCurrencyBlock = budgetPageSource.slice(budgetCurrencyStart, budgetPageSource.indexOf('</select>', budgetCurrencyStart) + 9);
if (supportedCurrencies.some(code => !budgetCurrencyBlock.includes('value="' + code + '"')) ||
    !budgetPageSource.includes('id="plannerContextNote"') ||
    !budgetPageSource.includes('id="budgetNextStep"') ||
    !budgetPageSource.includes('data-prep-route="india-arrival-ready"') ||
    !budgetPageSource.includes('data-prep-route="first-international-trip"') ||
    !budgetScriptSource.includes('velora-preparation-handoff-v1') ||
    !budgetScriptSource.includes('function continueToPreparation') ||
    (budgetScriptSource.split('window.location.assign("/travel/" + path + "/")').length - 1) !== 1 ||
    !budgetScriptSource.includes('preparationStepReady') ||
    !travelToolsSource.includes('function attachPreparationContext') ||
    !travelToolsSource.includes('plan-context-note') ||
    !arrivalGuideSource.includes('data-checklist="india-arrival-ready"') ||
    !outboundGuideSource.includes('data-checklist="first-international-trip"') ||
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
const guideCssSource = fs.readFileSync(path.join(root, 'guide.css'), 'utf8');
const serviceWorker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
if (!siteCss.includes('.floating-concierge{display:none}') || !siteCss.includes('font-size:16px') ||
    !sitePagesCss.includes('.page-header') || !sitePagesCss.includes('.gateway-card-grid') ||
    !guideCssSource.includes('.budget-next-step') || !guideCssSource.includes('.plan-context-note') ||
    !sitePagesCss.includes('@media(max-width:480px)') || !sitePagesCss.includes('prefers-reduced-motion')) {
  console.error('Responsive multi-page design system checks are missing.');
  process.exit(1);
}
if (!serviceWorker.includes('velora-shell-v15') ||
    !serviceWorker.includes('service-worker-register.js') ||
    !serviceWorker.includes('manifest.webmanifest') ||
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
    !privacyPolicySource.includes('estimated costs, currency, cost breakdown and budget ceiling are not passed') ||
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



const metadataPageSources = new Map();
const metadataPages = [
  { file: 'index.html', route: '/', label: 'homepage' },
  ...contentPages,
  ...travelPages,
  ...policyPages
];
for (const page of metadataPages) {
  const source = page.file === 'index.html' ? html : fs.readFileSync(path.join(root, page.file), 'utf8');
  metadataPageSources.set(page.route, { file: page.file, source });
  const titleMatch = source.match(/<title>([^<]+)<\/title>/i);
  const descriptionMatch = source.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i);
  const titleLength = titleMatch ? titleMatch[1].trim().length : 0;
  const descriptionLength = descriptionMatch ? descriptionMatch[1].trim().length : 0;
  if (!titleLength || titleLength > 60 || descriptionLength < 70 || descriptionLength > 160) {
    console.error('Search metadata length check failed:', page.file, { titleLength, descriptionLength });
    process.exit(1);
  }
}


// Validate same-site fragment links across all published routes. This catches
// stale cross-page CTAs when a planner or feature moves to its own URL.
const brokenPageFragments = [];
for (const page of metadataPages) {
  const source = metadataPageSources.get(page.route)?.source || '';
  for (const match of source.matchAll(/\bhref=["']([^"']*#[^"']+)["']/g)) {
    let target;
    try {
      target = new URL(match[1], siteOrigin + page.route);
    } catch {
      continue;
    }
    if (target.origin !== siteOrigin || !target.hash) continue;
    const targetPage = metadataPageSources.get(target.pathname);
    if (!targetPage) continue;
    const fragment = decodeURIComponent(target.hash.slice(1));
    if (!targetPage.source.includes('id="' + fragment + '"') &&
        !targetPage.source.includes("id='" + fragment + "'")) {
      brokenPageFragments.push(page.file + ' -> ' + match[1]);
    }
  }
}
if (brokenPageFragments.length) {
  console.error('Broken internal page fragments:', brokenPageFragments.join(', '));
  process.exit(1);
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
  'robots.txt', 'sitemap.xml', '_headers', '_routes.json', 'site-pages.css', 'sw.js', 'manifest.webmanifest', 'service-worker-register.js',
  'experiences/index.html', 'style/index.html', 'journal/index.html', 'journal/postcards-from-blue-hour/index.html', 'journal/small-gestures/index.html', 'journal/a-night-with-no-itinerary/index.html', 'about/index.html',
  'public/assets/experiences/couple-sunset-walk.webp', 'public/assets/destinations/maldives.webp', 'public/assets/destinations/amalfi-coast.webp', 'public/assets/destinations/kyoto-garden.webp', 'public/icons/velora-mark.svg', 'guide.css', 'privacy/index.html', 'terms/index.html', 'safety/index.html', 'travel-tools.js', 'travel/index.html', 'travel/india-arrival-ready/index.html', 'travel/first-international-trip/index.html', 'travel/budget-planner/index.html', 'budget-planner.js'
];
const missingDist = publicFiles.filter(file => !fs.existsSync(path.join(dist, file)));
if (missingDist.length) {
  console.error('Build output is missing files:', missingDist.join(', '));
  process.exit(1);
}
const serviceWorkerDist = fs.readFileSync(path.join(dist, 'sw.js'), 'utf8');
const headersSource = fs.readFileSync(path.join(root, '_headers'), 'utf8');
if (!serviceWorkerDist.includes('velora-shell-v15') ||
    !serviceWorkerDist.includes("url.pathname.startsWith('/api/')") ||
    !serviceWorkerDist.includes("request.headers.has('Authorization')") ||
    !serviceWorkerDist.includes("'./travel-tools.js'") ||
    !serviceWorkerDist.includes("'./budget-planner.js'") ||
    !serviceWorkerDist.includes("'./service-worker-register.js'") ||
    !headersSource.includes('Cache-Control: no-cache, no-store, must-revalidate') ||
    !headersSource.includes('Service-Worker-Allowed: /')) {
  console.error('Cloudflare build output is missing the current service worker, registration helper, precached planning assets or update headers.');
  process.exit(1);
}
const coreAssetsMatch = serviceWorkerDist.match(/const CORE_ASSETS = \[([\s\S]*?)\];/);
const coreAssets = coreAssetsMatch ? [...coreAssetsMatch[1].matchAll(/'([^']+)'/g)].map(match => match[1]) : [];
const missingCoreAssets = coreAssets.filter(asset => {
  const relative = asset.replace(/^\.\//, '');
  const target = path.join(dist, relative);
  return asset.endsWith('/')
    ? !fs.existsSync(path.join(target, 'index.html'))
    : !fs.existsSync(asset === './' ? path.join(dist, 'index.html') : target);
});
if (!coreAssetsMatch || missingCoreAssets.length) {
  console.error('Service-worker install would fail because required cache assets are missing:', missingCoreAssets.join(', '));
  process.exit(1);
}
const requiredGuideDist = ['travel/index.html', 'travel/india-arrival-ready/index.html', 'travel/first-international-trip/index.html', 'travel/budget-planner/index.html'];
const missingGuideDist = requiredGuideDist.filter(file => !fs.existsSync(path.join(dist, file)));
if (missingGuideDist.length) {
  console.error('Build output is missing travel pages:', missingGuideDist.join(', '));
  process.exit(1);
}
for (const page of metadataPages) {
  const outputPath = path.join(dist, page.file);
  const html = fs.readFileSync(outputPath, 'utf8');
  if (!html.includes('<link rel="manifest" href="/manifest.webmanifest">') ||
      !html.includes('<script defer src="/service-worker-register.js"></script>')) {
    console.error('Built page is missing PWA metadata or service-worker registration:', page.file);
    process.exit(1);
  }
}
if (!fs.existsSync(path.join(dist, 'manifest.webmanifest')) ||
    !fs.existsSync(path.join(dist, 'service-worker-register.js'))) {
  console.error('PWA manifest or service-worker registration helper missing from build.');
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
