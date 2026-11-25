# VELORA — Cloudflare deployment & backend setup

Recommended production stack (zero-cost-first):
- Frontend and static hosting: Cloudflare Pages connected to this GitHub repository.
- API/backend: Cloudflare Pages Functions (same origin; no separate server).
- Database: Cloudflare D1 (SQLite at the edge).
- Product catalogue: Amazon India Creators API from server-side Functions.
- Images: VELORA-owned artwork remains in public assets; Amazon product images are requested from Amazon and never downloaded or re-hosted by VELORA.

GitHub Pages is retained temporarily as a fallback during the move. GitHub says Pages is not intended or permitted as free hosting for an online business/e-commerce site whose primary purpose is facilitating commercial transactions or SaaS. Once Cloudflare Pages is live and verified, turn GitHub Pages off in repository settings and disable its deployment workflow.

## Free-tier fit (checked 24 November 2026)

| Service | Free allowance relevant to VELORA |
|---|---|
| Cloudflare Pages | 500 builds/month, one concurrent build, 20,000 files, 25 MiB per asset |
| Workers Free (Pages Functions count toward it) | 100,000 requests/day, 10 ms CPU per request |
| D1 Free | 5 million rows read/day, 100,000 rows written/day, 5 GB total storage/account, 500 MB max per database, 10 databases/account |

Static site requests do not invoke Functions unless the URL matches the Functions route. Keep APIs small and cache Amazon catalog responses. D1's 500 MB per-database maximum is enough for the initial curated catalogue, but this is not an unlimited free tier; monitor usage and move to a paid plan or another SQL service when traffic/data require it.

Official limits:
- https://developers.cloudflare.com/pages/platform/limits/
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/pages/functions/bindings/

## 1. Existing Cloudflare Pages project and deployment target

The currently verified public VELORA deployment is `https://velora-75y.pages.dev/`. The existing Cloudflare Pages **project name is `velora`**; its configured `pages.dev` production hostname is `velora-75y.pages.dev`. These are distinct identifiers in this account. The separate URL `https://velora.pages.dev/` has been observed serving an unrelated cosmetics storefront. Do not confuse that hostname with the existing Pages project named `velora`, and do not deploy to the hostname `velora.pages.dev`.

The GitHub workflow `.github/workflows/cloudflare.yml` builds this repository and deploys branch `main` to the existing Cloudflare Pages project **`velora`**. It uses the GitHub repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The workflow is triggered by pushes to `main` and can also be run manually. It deliberately does not create a Pages project: if the verified project or credentials are unavailable, deployment should fail visibly rather than silently creating or targeting a different project. The 25 Nov 2026 GitHub Actions history confirms a successful deployment using `--project-name=velora`, with a deployment URL under `velora-75y.pages.dev`; a later failure occurred only after the workflow incorrectly targeted `velora-75y` as the project name.

The build sets `SITE_ORIGIN` to `https://velora-75y.pages.dev` so the generated `robots.txt` and `sitemap.xml` use the actual deployed hostname. If a final custom domain is attached later, update the canonical URL, the workflow's `SITE_ORIGIN`, and the HTML social URLs together, then verify the live redirects and sitemap before changing search-console properties.

Do not create a second app or change GitHub repository ownership. Keep GitHub Pages as a fallback until Cloudflare deployment, API health and the required production setup have all been verified.

## 2. Create and bind the D1 database

1. In Cloudflare go to Storage & Databases, D1 SQL Database, Create database.
2. Name it velora-production.
3. Open the Pages project, Settings, Functions, D1 database bindings, Add binding.
4. Set the variable name to exactly DB and choose velora-production.
5. Save and redeploy the Pages project.
6. Open the D1 database's SQL Console and run the contents of migrations/0001_initial.sql.

The migration creates two permanent catalogue tables (featured ASINs and short-lived product cache) plus a one-row API rate-limit table. It does not store customer accounts, payment data or personal travel profiles.

## 3. Add secrets — never commit them to GitHub

In the Pages project go to Settings, Variables and Secrets, Add. Create these as encrypted Secrets (not plain variables):
- AMAZON_CLIENT_ID
- AMAZON_CLIENT_SECRET
- AMAZON_PARTNER_TAG
- VELORA_ADMIN_TOKEN

Add AMAZON_CREDENTIAL_VERSION as a plain variable using the exact Credential Version shown when the Amazon application credentials are created. Amazon's current locale table lists IN under the EU token endpoint group (version 3.2); still use the version assigned to the actual credentials. AMAZON_MARKETPLACE may be set to www.amazon.in (the code defaults to it).

Generate a strong random VELORA_ADMIN_TOKEN (at least 32 random characters) in a password manager. Do not paste it into chat, GitHub files, screenshots, email or WhatsApp. Use it only in the password field on the private product-admin page. The page keeps it in memory for the current tab and does not save it in local storage.

## 4. Amazon India — exact integration and eligibility

The integration uses the current Creators API, not the deprecated PA-API 5 endpoint. Amazon says Creators API access requires:
- a valid Amazon Associates account for the India marketplace;
- at least 10 qualifying sales in the trailing 30 days;
- Creators API registration and generated credentials.

Amazon documents OAuth 2.0 Client Credentials. India is in credential version 3.2's authentication region; token endpoint is https://api.amazon.co.uk/auth/o2/token. Catalog calls use https://creatorsapi.amazon/catalog/v1/searchItems and getItems, with x-marketplace: www.amazon.in.

Official references:
- https://affiliate-program.amazon.in/creatorsapi/docs/en-us/introduction
- https://affiliate-program.amazon.in/creatorsapi/docs/en-us/get-started/using-curl
- https://affiliate-program.amazon.in/creatorsapi/docs/en-us/api-reference/operations/search-items
- https://affiliate-program.amazon.in/creatorsapi/docs/en-us/concepts/best-programming-practices
- https://affiliate-program.amazon.in/help/operating/agreement/

Important:
- An Associates account alone does not prove Creators API access. Check the Creators API registration/credentials page in Associates Central.
- Amazon's API rate is initially up to 1 request/second and up to 8,640/day for the first 30 days; limits are adjusted based on shipped revenue and access can lapse after 30 days without qualifying referred sales.
- The importer stores only ASINs and editorial category permanently. Titles and image URLs are cached for 23 hours and refreshed from Amazon; product images are hot-linked from Amazon, never copied into VELORA storage. Offers/prices are deliberately not requested or displayed at launch.
- VELORA does not scrape Amazon pages. If Creators API eligibility is not active, the product importer will show a clear setup/eligibility message; do not use scraping or third-party product feeds without permission.
- Amazon requires the prominent site disclosure: "As an Amazon Associate I earn from qualifying purchases." A link-level disclosure such as "(paid link)" is also displayed near product links.
- Product advertising content must carry Amazon's required content disclaimer in plain view. The VELORA product section includes it.

## 5. Test after setup

Open these on the verified Cloudflare site https://velora-75y.pages.dev/:
- /api/health — should report databaseConfigured: true and amazonCreatorsApiConfigured: true when secrets are set.
- /api/products — should return {"products":[]} until products are selected in the admin page.
- /admin-products.html — enter the admin token, search products and click Add to VELORA. Product title/image/link are pulled automatically; only ASIN/category are retained in the permanent catalogue table.
- Main page, The VELORA Shop Edit — should show curated products after they are added.

If API access is unavailable, no live product links will be shown. Keep the product section in its honest "being prepared" state until access is verified.

## 6. Deployment cutover

After the Cloudflare Pages site, API health and product admin screen are verified:
1. Add the final custom domain later if desired; a custom domain is not required to use pages.dev.
2. Disable GitHub Pages in repository Settings, Pages.
3. Disable or remove the old .github/workflows/deploy.yml GitHub Pages workflow.
4. Update canonical URLs and sitemap once the final public domain is known.

No paid Cloudflare plan, paid database, paid ads or new affiliate account is required for this initial architecture. Upgrade only when actual use or reliability needs justify it.
