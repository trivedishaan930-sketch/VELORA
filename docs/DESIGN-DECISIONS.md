# VELORA design and product decisions

## User-provided references

1. **Main hero — approved current art direction (26 Nov 2026):** the old supplied shirtless / bikini-style sunset photograph was rejected by the founder and removed from the active asset set. Current hero is `public/assets/hero/velora-hero-editorial.svg`, original VELORA-created architectural vector artwork with two fully clothed adults, warm stone, deep ocean tones and headline negative space. It is an interim bespoke visual asset, not a documentary photograph. Any future photography must be fully clothed, tasteful, rights-cleared and never repeated across sections.
2. **Supporting image library:** current homepage uses distinct scenic destination images once each. The former repeated couple-beach image was retired; fashion and manifesto visuals now use original CSS art direction rather than duplicate photography.
3. **Scenic layout reference:** `agra-ai-homepage-reference.jpg` is retained in `docs/` for project context only. It is not displayed on the VELORA site and its branding, copy and exact composition are not copied.
4. **Product brief:** the primary project brief sets the product, visual, functional, accessibility, safety and zero-cost constraints. The earlier notes add context but do not override the primary specification.

## Product scope

The first browser-first foundation serves Solo Explorers, Couples & Honeymooners, and Romance & Lifestyle Seekers. It brings together destination inspiration, a practical trip outline, style guidance, travel essentials, original stories, a rules-based concierge demonstration, and wellness/safety principles.

The website's visible language is English. It is designed for adults and is romantic but non-explicit. It is not a dating, escort, pornography or sexual-services platform.

## Visual system

- Midnight Navy `#101A2C`: structure and primary controls.
- Deep Ocean Blue `#17364A`: supporting depth.
- Champagne Gold `#D7B36A`: restrained accent.
- Warm Ivory `#F7F3E9`: main canvas.
- Soft Rose `#C98E99`: supporting warmth.
- Editorial serif display typography paired with a modern sans-serif.

## Explicitly not represented as live

Weather, hotel availability, travel advisories, entry/visa rules, booking, checkout, product ratings, user authentication and external AI are not connected. Planner and concierge outputs are clearly labelled as local illustrative/demo content.


## P0 redesign implementation — working branch, 26 November 2026

- New VELORA editorial SVG replaces the rejected public hero; Open Graph and Twitter image references updated; the old hero asset is deleted from the active public assets.
- Homepage navigation and copy now describe Romance, Connection & Lifestyle. A compact eight-department map uses honest `live`, `editorial`, `demo` and `future` labels rather than eight empty department pages.
- The redundant experience band, inactive shop block and generic wellness block were removed from the homepage. The local Concierge demonstration was folded into the Trust & Safety area and explicitly labelled as not connected to external AI.
- Mobile hero search was reduced to four clear entry points; the floating Concierge control is hidden on mobile to prevent overlap; text and control sizing has been increased.
- The style-feature and manifesto visuals now use bespoke CSS composition; the repeated couple-walk asset was removed from the public asset set and PWA cache.
- Standalone privacy, terms and safety pages are now part of the planned build, sitemap and smoke checks.
- Current branch work is not yet production-verified. Do not mark the visual release complete until branch checks and main-branch Cloudflare deployment both pass.
