# DecoFlowers C3 — Design QA

Source visual truth: /workspace/work/premium-prospects/c-research/designs/DecoFlowers-C-3.png
Browser implementation: /workspace/work/deco-c-3/qa/reference-capture.png
Full-view comparison: /workspace/work/deco-c-3/qa/comparison.png
Focused hero comparison: /workspace/work/deco-c-3/qa/comparison-hero.png
Additional evidence: mobile.png, room-mobile.png, showroom-mobile.png, contact-mobile.png and scroll-motion.png in /workspace/work/deco-c-3/qa.

Source and normalized implementation pixels: 1122 × 1402. CSS viewport for first-chapter alignment: 1122 × 744, density1. The source is a cropped two-chapter proposal; the full browser screenshot is cropped to identical dimensions. Full browser capture remains reference-capture-full.png. Static source comparison uses reduced-motion; actual motion has separate no-preference evidence. Lower content was captured after scrolling and waiting for visible images to decode.

## Required fidelity surfaces

- Fonts: local Manrope and Cormorant according to direction; live editable typography. Hierarchy, wrapping, spacing and weights inspected. C2 wordmark uses native live text typesetting, not drawn vector art.
- Layout: distinctive portal/dock, editorial masthead/shelf, and rail/scale-selector retained. Responsive320–1920px without horizontal overflow.720px viewport checks200%-equivalent content width; native browser zoom was not independently measured.
- Colors: charcoal/mineral, lavender/aubergine/sienna, mineral/graphite/blue. Image/text contrast visually reviewed beyond automated contrast.
- Images: separately generated subject assets matching each proposal, intrinsic-sized localWebP, authentic showroom photos credited. No rasterizedUI or fabricated portfolio claims. All displayed images load, including interactive states.
- Copy: six verified directions, retail/wholesale, interior landscaping, delivery and correct+998900190901/officialInstagram. No inventedSKU/prices/case names/guarantees. Architectural illustrations labelled as such.

## Findings and history

- P2 mobile contact overflow: minmax(0,1fr), min-width0 and responsive typography corrected.
- P1 animation after filters/FAQ: stable scroll measurements wrap rebuild/refresh; advanced scale/filter/scroll/pause sequence passes.

Post-fix evidence opened and reviewed by root and independent reviewer. Independent visual review: /workspace/work/deco-c-qa/independent-visual-review.md, passed. No remaining actionable P0/P1/P2.

## Browser behavior

ActualChromium/Playwright evidence: /workspace/work/deco-c-3/qa/report.json. Console/page errors0; WCAG A/AA automated findings0 on page and prepared-request state.
Core checks: responsive320–1920, menu opens and Escape closes, empty validation, editable draft, download content, all images loaded after scroll, source provenance page, motion pause available
Advanced checks: three scene changes, final rapid choice, brief presets and filters, smooth native accordion opens and closes, scroll animation changes and manual pause holds, 200% equivalent viewport fits, no-JS content and telephone accessible

Editable request export preserves changed content. Motion pause/reduced-motion covered; contacts remain accessible withoutJS.

## Expected differences and limits

Regenerated individual assets, added true brand content, responsive navigation. Incorrect phone in C2 source corrected. C3 uses photographic scope views, not a realtime3D construction model. Some source-oriented wording can be refined in future P3copy polish.

final result: passed
