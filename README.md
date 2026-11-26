# VELORA — Romance · Travel · Lifestyle

**Make Room for Romance.**

A browser-first, responsive website foundation for an international adult audience. The product direction is editorial, cinematic and helpful: travel discovery, romantic experience planning, personal style, useful essentials, original non-explicit stories, wellness and safety guidance.

## Project continuity and working rules

Long-term product direction and business model: [`docs/PRODUCT-NORTH-STAR-AND-LONG-TERM-ROADMAP.md`](docs/PRODUCT-NORTH-STAR-AND-LONG-TERM-ROADMAP.md). This is the strategic source of truth for VELORA's eight departments, global ambition, Moment-to-Memory product loop, revenue ladder, SEO strategy, safety, architecture and release gates.

Near-term operating plan: [`BUSINESS-PLAN.md`](BUSINESS-PLAN.md). It must stay consistent with the long-term North Star.

Marketing and growth execution: [`docs/GO-TO-MARKET-AND-GROWTH-PLAYBOOK.md`](docs/GO-TO-MARKET-AND-GROWTH-PLAYBOOK.md). This operating playbook covers audience priorities, channels, campaigns, content distribution, lifecycle, partners, funnel, analytics, experimentation, paid-media gates and compliance.

Before making changes, read [`docs/MASTER-PROJECT-HANDOVER.md`](docs/MASTER-PROJECT-HANDOVER.md). It records VELORA's full product vision, eight departments, operating principles, audit requirements, safety rules and cross-chat continuity process. Treat it as the project guide, then verify the current code and deployment state rather than assuming the status written there is still current.

Latest foundation audit: [`docs/FOUNDATION-AUDIT-2026-11-25.md`](docs/FOUNDATION-AUDIT-2026-11-25.md). It records the verified baseline and prioritized roadmap as of 25 Nov 2026; treat it as dated and re-check current state.

## What's included

- Full-width homepage hero using the exact sunset-couple photograph supplied for this project.
- Responsive desktop and mobile layouts; mobile uses a separate composition and focal position rather than simply shrinking the desktop grid.
- Destination inspiration with original scenic image assets, local search and category filters.
- Crawlable Travel Hub, India Arrival Ready / First 72 Hours guide, First International Trip checklist, and a client-side Trip Budget Planner for group/per-person/day estimates.
- An occasion-aware getaway planner for romantic escapes, honeymoons, anniversaries, proposals, first trips together, solo resets, friends and family; it builds a locally generated day-by-day experience outline with comfort reminders and links to the budget/readiness tools.
- Style studio with occasion, style direction and weather inputs.
- Personal travel checklist, an essentials buying guide, saved destinations/ideas/plans, saved-list export and print-friendly views.
- Original, non-explicit editorial stories and practical relationship / date ideas.
- A VELORA Concierge interface with a transparent rules-based demo (no external AI model is connected).
- Privacy, terms and safety starter notes; PWA manifest and offline shell; GitHub Pages workflow.
- No external framework, build command, paid API, account, database or subscription is required.

## Project structure

```text
velora-project/
├── .github/workflows/deploy.yml
├── docs/
│   ├── ASSET-SOURCES.md
│   ├── DESIGN-DECISIONS.md
│   ├── TERMUX-DEPLOYMENT.md
│   └── agra-ai-homepage-reference.jpg
├── public/
│   ├── assets/
│   │   ├── hero/velora-sunset-couple.jpg
│   │   ├── destinations/*.webp
│   │   └── experiences/*.webp
│   └── icons/
├── scripts/check.mjs
├── .env.example
├── .gitignore
├── app.js
├── index.html
├── manifest.webmanifest
├── package.json
├── README.md
├── styles.css
└── sw.js
```

## Run locally

### Android / Termux

See [`docs/TERMUX-DEPLOYMENT.md`](docs/TERMUX-DEPLOYMENT.md) for copy-and-paste commands to unzip, preview, push to GitHub and publish via GitHub Pages.

### Computer

With Python 3 installed:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

Or run `npm run start` (the package script uses Python 3 and installs no npm dependencies).

Run the project checks:

```bash
npm run check
```

## Production deployment

**Production host:** Cloudflare Pages at [https://velora-75y.pages.dev/](https://velora-75y.pages.dev/).

The `.github/workflows/cloudflare.yml` workflow automatically builds and deploys each push to `main` to the already-verified Cloudflare Pages project name `velora`. The public `pages.dev` hostname is `velora-75y.pages.dev`. After deployment, the workflow smoke-tests the homepage, all four published travel-tool and guide routes, their titles/canonicals, `robots.txt`, all sitemap routes and API health. It can also be run manually from GitHub Actions.

GitHub Pages is no longer the production deployment. Its older workflow (`.github/workflows/deploy.yml`) is retained as a **manual-only legacy fallback** and does not run on every push. Do not use its `github.io` URL as VELORA's canonical production host.

See [Cloudflare deployment and backend setup](docs/CLOUDFLARE-DEPLOYMENT.md) for the project mapping, D1 setup, secrets and post-deployment checks.

## Current functionality and honest limitations

| Area | Current state |
|---|---|
| Homepage, navigation and responsive sections | Implemented in static HTML/CSS |
| Search and destination filters | Browser-side filters over included inspiration cards |
| Trip planner | Local illustrative day-by-day outline; not a live itinerary, quote or booking |
| Style studio | Local outfit guidance based on selected occasion and weather |
| Checklist and saved items | Browser `localStorage`; no account sync |
| Concierge | Rules-based local demo; no AI provider connected |
| Weather, visas, advisories, hotels and reservations | Not connected; check current official/provider sources |
| Shopping checkout, product prices and ratings | Not connected; no product is represented as live or verified |
| Login, database, user profile or community | Not implemented in this starter |
| PWA/offline | Manifest and service-worker shell cache included; test after HTTPS deployment |

The legal and privacy copy is starter information, not legal advice. Replace it with reviewed, jurisdiction-appropriate policies before accepting users or collecting data. An age acknowledgement is not identity verification.

## Design direction

- Midnight Navy `#101A2C`, Deep Ocean Blue `#17364A`, Champagne Gold `#D7B36A`, Warm Ivory `#F7F3E9`, Soft Rose `#C98E99`, White `#FFFFFF`.
- Editorial serif display headings with clean sans-serif body text.
- Scenic homepage hero, calm negative space, subtle details and responsive layouts.
- Agra AI screenshot was used only as a reference for integrating a large scenic image. VELORA's layout, branding, copy, colours and design are original.

## Safety principles

VELORA is an adult-oriented, non-explicit romance, travel and lifestyle concept. It is not a pornography website, escort marketplace, sexual-services platform or real-person dating/matching system. It does not promise AI can replace genuine relationships. Do not add user-uploaded image generation, real-person matching, commerce or health claims without appropriate consent, safety, moderation, security and legal design.

## Updating the site

- Change page copy in `index.html`.
- Adjust responsive visual design in `styles.css`.
- Update local behaviour in `app.js`.
- Use only fully clothed, tasteful premium editorial imagery that follows `docs/DESIGN-DECISIONS.md`; the earlier rejected swimwear hero has been removed from published assets.
- When changing the offline asset list, update `CACHE_NAME` in `sw.js` so returning browsers refresh the cache.

## Security

No API key is required. Keep `.env` files out of Git. Future AI, booking, payment and account integrations must use secure server-side handling; never put private keys in browser JavaScript or a public repository.


## Production deployment

See docs/CLOUDFLARE-DEPLOYMENT.md for Cloudflare Pages + Functions + D1, free-tier limits, Amazon Creators API setup and hosting cutover.
