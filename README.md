# VELORA — Romance · Travel · Lifestyle

**Make Room for Romance.**

A browser-first, responsive website foundation for an international adult audience. The product direction is editorial, cinematic and helpful: travel discovery, romantic experience planning, personal style, useful essentials, original non-explicit stories, wellness and safety guidance.

## Project continuity and working rules

Before making changes, read [`docs/MASTER-PROJECT-HANDOVER.md`](docs/MASTER-PROJECT-HANDOVER.md). It records VELORA's full product vision, eight departments, operating principles, audit requirements, safety rules and cross-chat continuity process. Treat it as the project guide, then verify the current code and deployment state rather than assuming the status written there is still current.

## What's included

- Full-width homepage hero using the exact sunset-couple photograph supplied for this project.
- Responsive desktop and mobile layouts; mobile uses a separate composition and focal position rather than simply shrinking the desktop grid.
- Destination inspiration with original scenic image assets, local search and category filters.
- A date, duration, traveller, style, budget and stay preference planner that produces a locally generated illustrative itinerary.
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

## Free deployment

The repository includes a GitHub Actions workflow for GitHub Pages. Push to the `main` branch, then open the repository's **Settings → Pages** and set the source to **GitHub Actions**. The workflow publishes the static site. A first deployment is not complete until the action run succeeds and the resulting Pages URL opens correctly.

Alternative: Cloudflare Pages can deploy this repository with no build command and the project root (`/`) as the output directory. Check the current free-plan limits and your account settings before launch.

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
- Replace the hero only with an image you have rights to use; preserve the supplied original as required by the project brief.
- When changing the offline asset list, update `CACHE_NAME` in `sw.js` so returning browsers refresh the cache.

## Security

No API key is required. Keep `.env` files out of Git. Future AI, booking, payment and account integrations must use secure server-side handling; never put private keys in browser JavaScript or a public repository.


## Production deployment

See docs/CLOUDFLARE-DEPLOYMENT.md for Cloudflare Pages + Functions + D1, free-tier limits, Amazon Creators API setup and hosting cutover.
