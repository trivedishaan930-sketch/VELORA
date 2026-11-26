# VELORA — Romance · Connection · Lifestyle

**Make Room for Romance.**

A premium international Romance, Connection & Lifestyle product foundation for adults (18+). Travel is the first commercial wedge, not the full identity. The North Star is to make meaningful experiences easier to imagine, plan and enjoy.

## Project continuity and working rules

Long-term product direction and business model: [`docs/PRODUCT-NORTH-STAR-AND-LONG-TERM-ROADMAP.md`](docs/PRODUCT-NORTH-STAR-AND-LONG-TERM-ROADMAP.md). This is the strategic source of truth for VELORA's eight departments, global ambition, Moment-to-Memory product loop, revenue ladder, SEO strategy, safety, architecture and release gates.

Near-term operating plan: [`BUSINESS-PLAN.md`](BUSINESS-PLAN.md). It must stay consistent with the long-term North Star.

Marketing and growth execution: [`docs/GO-TO-MARKET-AND-GROWTH-PLAYBOOK.md`](docs/GO-TO-MARKET-AND-GROWTH-PLAYBOOK.md). This operating playbook covers audience priorities, channels, campaigns, content distribution, lifecycle, partners, funnel, analytics, experimentation, paid-media gates and compliance.

Permanent founder-authorised execution plan: [`docs/VELORA-AUTONOMOUS-EXECUTION-PLAN.md`](docs/VELORA-AUTONOMOUS-EXECUTION-PLAN.md). Read it before each `VELORA PUSH` and before using the three independent Manus, Grok and Claude audits.

Before making changes, read [`docs/MASTER-PROJECT-HANDOVER.md`](docs/MASTER-PROJECT-HANDOVER.md). It records VELORA's full product vision, eight departments, operating principles, audit requirements, safety rules and cross-chat continuity process. Treat it as the project guide, then verify the current code and deployment state rather than assuming the status written there is still current.

Latest foundation audit: [`docs/FOUNDATION-AUDIT-2026-11-25.md`](docs/FOUNDATION-AUDIT-2026-11-25.md). It records the verified baseline and prioritized roadmap as of 25 Nov 2026; treat it as dated and re-check current state.

## What's included

- Bespoke VELORA editorial hero artwork (`public/assets/hero/velora-hero-editorial.svg`) with fully clothed, tasteful styling; the previously rejected swimwear image has been removed.
- An eight-department ecosystem map that distinguishes available guides/tools, editorial content, local demos and future work without empty department shells.
- Responsive desktop and mobile layouts with an audited hero/entry-point layout and no floating Concierge overlap on small screens.
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
│   │   ├── hero/velora-hero-editorial.svg
│   │   ├── destinations/*.webp
│   │   └── experiences/*.webp
│   └── icons/
├── privacy/index.html\n├── terms/index.html\n├── safety/index.html\n├── velora-premium.css\n├── scripts/check.mjs
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

## Current redesign status (26 November 2026)\n\nThe founder-approved P0 redesign is being prepared on branch `work/velora-world-class-p0-v2`. It introduces the replacement editorial hero, eight-department status map, shorter homepage flow, mobile collision fix, destination/style mismatch check and standalone trust pages. It is **not a production release** until GitHub quality checks and the Cloudflare production smoke test pass on the merged main commit.\n\n## Run locally

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

The `.github/workflows/cloudflare.yml` workflow automatically builds and deploys each push to `main` to the already-verified Cloudflare Pages project name `velora`. The public `pages.dev` hostname is `velora-75y.pages.dev`. After deployment, the workflow smoke-tests the homepage, all four published travel-tool and guide routes, their titles/canonicals, `robots.txt`, all sitemap routes and API health. It can also be run manually from GitHub Actions. The production smoke test now also covers the three standalone trust pages and the approved hero/design assets.

GitHub Pages is no longer the production deployment. Its older workflow (`.github/workflows/deploy.yml`) is retained as a **manual-only legacy fallback** and does not run on every push. Do not use its `github.io` URL as VELORA's canonical production host.

See [Cloudflare deployment and backend setup](docs/CLOUDFLARE-DEPLOYMENT.md) for the project mapping, D1 setup, secrets and post-deployment checks.

## Current functionality and honest limitations

| Area | Current state |
|---|---|
| Homepage and connected eight-department map | Static HTML/CSS; the redesigned P0 branch is pending merge and production verification |
| Search and destination filters | Browser-side filters over included inspiration cards |
| Trip planner | Local illustrative day-by-day outline; not a live itinerary, quote or booking |
| Style studio | Local outfit guidance based on selected occasion and weather |
| Checklist and saved items | Browser `localStorage`; no account sync |
| Concierge | Rules-based local demo; no AI provider connected |
| Weather, visas, advisories, hotels and reservations | Not connected; check current official/provider sources |
| Shopping checkout, product prices and ratings | Not connected; no product is represented as live or verified |
| Login, database, user profile or community | Not implemented in this starter |
| Privacy / Terms / Safety | Standalone starter pages; legal review still required before commercial launch |\n| PWA/offline | Manifest and service-worker shell cache included (v9); test after HTTPS deployment |

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
- Base components remain in `styles.css`; the audited responsive release layer is `velora-premium.css`.
- Update local behaviour in `app.js`.
- The approved current hero is `public/assets/hero/velora-hero-editorial.svg`. Do not reintroduce the rejected shirtless / bikini-style photograph or other swimwear/sexualised imagery.
- When changing the offline asset list, update `CACHE_NAME` in `sw.js` so returning browsers refresh the cache.

## Security

No API key is required. Keep `.env` files out of Git. Future AI, booking, payment and account integrations must use secure server-side handling; never put private keys in browser JavaScript or a public repository.


## Production deployment

See docs/CLOUDFLARE-DEPLOYMENT.md for Cloudflare Pages + Functions + D1, free-tier limits, Amazon Creators API setup and hosting cutover.
