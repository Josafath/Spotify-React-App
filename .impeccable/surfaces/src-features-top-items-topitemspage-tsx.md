---
version: 1
slug: "src-features-top-items-topitemspage-tsx"
primary_target: "src/features/top-items/TopItemsPage.tsx"
related_targets: ["src/features/auth/LoginPage.tsx"]
---

# Surface: Jossify v2 app (sign-in + top items)

Mode: Experience (the user's own music leads). Build path: code-led (no image generation).

Audience/job: a Spotify listener checks their top tracks and artists per time range; a recruiter judges polish. Action: sign in, switch Tracks/Artists and range, open items in Spotify. Content: only the signed-in user's real Spotify data. Constraints: Spotify branding rules (attribution, link-backs, no Spotify-green UI), WCAG 2.2 AA, phone-first usability.

## Direction contract

THESIS: The category-standard dark music-stats app at full craft: your #1 leads at poster scale, everything else is a precise ranked list with movement between ranges. Refuses the equal-card cover grid with no hierarchy and the Spotify-green clone.

OWN-WORLD: Tinted near-black ground with two raised surface steps; zinc text ramp; one ember accent (about #ff6a3d) reserved for active controls, the #1 rank and upward movement; Figtree variable with tabular numerals; artwork is the only imagery (8px radius covers, circular artists); pill segmented controls; hairline separators, no shadows except the hero art.

STORY: The listener sees their #1 instantly, flips range and watches the ranking shift with up/down/new markers, scans 40 items, taps through to Spotify. A reviewer sees a calm, finished product.

FIRST VIEWPORT: Top bar: wordmark left, Tracks/Artists and range pills, avatar and sign-out right. Hero band: large artwork (about 280px desktop) left; the #1 title at display scale, then the artist line and a context line ("Your most played track · Last 4 weeks") below it, never a label above it; "Open in Spotify" pill. Ranks 2-6 begin inside the viewport.

FORM: category standard (canon), chosen by the user over the rolled direction; signature interaction: range switch re-ranks the list in place with movement chips and a short staggered settle, reduced-motion safe. seed: seed:0f606d0d5eae92c3

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
