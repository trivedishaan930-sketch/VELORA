# VELORA Visitor-Journey QA & Activation Gates

**Review date:** 28 November 2026  
**Production site:** https://velora-75y.pages.dev/  
**Repository baseline at start:** `229feb52e5aa092e029b94f4cde5ac88b0a49d35`

## 1. Evidence boundary

This pass reviewed current GitHub source, previous production smoke evidence, API setup contracts, OpenSEO project state and the published route architecture.

The requested interactive real-browser run did not start: the connected TinyFish wallet was negative by USD 0.072. No top-up or purchase was made. Direct web fetch/browser inspection of the live site was also unavailable in this environment. Therefore this review is **not** a completed Android device QA, screenshot audit, browser-console audit or proof that PWA offline navigation works on a visitor device.

Do not convert automated source checks or prior deployment smoke into a real-device test claim.

## 2. Confirmed release baseline

- Repository is public, default branch `main`, with authorised push permissions.
- At the start of this review, main was `229feb52e5aa092e029b94f4cde5ac88b0a49d35`; no open PRs were returned.
- Production workflow run `46172080738`: deploy job completed successfully; source verification/build, deployment and production smoke steps all succeeded.
- Service Worker is `velora-shell-v15`; source-level handler tests cover API/admin bypass, Authorization and no-store request bypass, public asset caching, and exclusion of private/no-store/Vary-star responses.
- Previous OpenSEO crawl `e7d27014-9852-4876-befa-a76885cb1aec`: 15/15 sitemap pages HTTP 200, one H1 each, zero missing image alt and zero crawl issues. This is a crawl result, not a screenshot, Lighthouse result or user-device test.

## 3. Visitor journey review matrix

| Journey | Source-level status | Device/browser evidence still required |
|---|---|---|
| Homepage → primary navigation → Experiences | Routes and links are present | Tap targets, menu state, visual layout, back navigation |
| Experiences planner → generated plan → budget | Local form and handoff handlers exist | Native date/number controls, validation, result readability, storage failure behavior |
| Budget → preparation checklists | One-time local handoff exists | Cross-route prefill, reload/back behavior, reset and data deletion |
| Style studio → style result | Local form handler exists | Small viewport layout, keyboard and screen-reader feedback |
| Journal index → stories | Separate crawlable pages exist | Images, article reading layout, navigation return |
| Policy pages → planning CTA | Five stale planner URLs were identified and are being corrected | Confirm all policy links reach the current planner |
| PWA install → offline navigation | Worker source and CI smoke exist | Actual installed worker version, airplane-mode route loads, cache eviction/update behavior |
| Saved items and export | Browser-local code exists | Storage denied/private mode, export file behaviour, clearing data |

## 4. Finding corrected in this change

The planner moved from the old homepage section to `/experiences/#plannerForm`, but five cross-page calls-to-action still linked to the retired `/#planner` fragment:
- `/travel/`
- `/travel/budget-planner/`
- `/privacy/`
- `/terms/`
- `/safety/`

This makes those CTAs land on the homepage without the intended planner section. They are being replaced with the current Experiences planner URL.

A repository regression check is being added to resolve same-origin fragment links against the known published page map and verify the referenced ID exists. This should catch similar defects when a component moves across routes.

## 5. Data and privacy review

Current design remains browser-first:
- Experience plans, saved items, style inputs, travel checklists, budget drafts and one-time handoffs use browser storage.
- The privacy page describes those local storage paths and says the app does not send trip-plan or budget details to VELORA's application server.
- The API is a separate catalogue foundation; its D1 binding is not currently configured. Do not store visitor trip plans in D1 without a fresh data minimisation, retention, consent, security and privacy review.
- Service Worker v15 excludes API routes and authenticated/no-store requests from its cache policy. This is client-side cache isolation, not a substitute for server-side authentication or authorisation.

## 6. Search Console activation gate

The connected Google account currently exposes zero Search Console properties. Organic clicks, impressions, query coverage, URL Inspection and indexing status are therefore unknown.

Founder action:
1. Create a URL-prefix Search Console property for `https://velora-75y.pages.dev/` at https://search.google.com/search-console/welcome.
2. Verify ownership using a supported method; do not share verification tokens or account credentials in chat.
3. Connect that verified property to OpenSEO.
4. Only then establish a search-performance baseline and prioritise content using first-party query/page data.

Do not interpret absence of a connected property as proof that Google has not indexed the site.

## 7. Backend activation gates

The last verified live API state was:
- `/api/health`: `ok=true`
- `databaseConfigured=false`
- `amazonCreatorsApiConfigured=false`
- `/api/products`: expected HTTP 503 setup response because D1 is absent.

The repo contains `migrations/0001_initial.sql` and a Cloudflare setup guide. When approved by the founder:
1. Create the D1 database `velora-production` in the correct Cloudflare account.
2. Add a Pages Functions D1 binding named exactly `DB` to Pages project `velora`.
3. Apply the reviewed migration.
4. Redeploy and confirm `databaseConfigured=true` and expected read/write behaviour.
5. Keep Amazon API credentials as server-side encrypted secrets only, and configure only after Associates/Creators API eligibility and terms are confirmed.

D1 is currently designed for the curated catalogue and API rate limits, not customer profiles, bookings or saved trip accounts. Do not expand schema to personal data as part of basic activation.

## 8. Android device acceptance checklist

On the founder's Android phone using Chrome:
- Open the production URL while online and refresh once to install/activate the current worker.
- Confirm homepage, Travel, Experiences, Budget Planner, Style, Journal and policy navigation.
- Complete one generic sample itinerary and continue to budget; confirm one-time values transfer only on the device.
- Save a draft, reopen it, export it, then clear the test data.
- Check the experience planner and budget pages at 360 px and 390 px widths for horizontal overflow, clipped buttons and unreadable controls.
- Confirm every CTA and browser Back action behaves as expected.
- Check Settings/site information for service worker/storage state if available.
- With the site already warmed, enable airplane mode and load Travel, Experiences, Budget Planner and at least one Journal page. Record any missing page/image and return online before testing updates.
- Repeat after a cache version change to confirm an update does not leave stale routes.

Record device model, Android version, Chrome version, viewport, date, worker/cache version, result and screenshot for each failure. Do not enter real personal information into the prototype.

## 9. Exit criteria

Visitor journey QA is complete only after:
- Automated route/fragment/asset/API checks pass.
- Real mobile and desktop browser walkthroughs pass.
- PWA v15 online install and offline navigation pass on at least one real Android device.
- No unexplained console errors or broken links remain.
- Privacy notice matches actual browser/network behavior.
- Search Console property is verified before organic performance claims.
- D1 activation is separately approved, migrated and production-smoke tested.

Until then, label device and activation tasks as pending rather than complete.
