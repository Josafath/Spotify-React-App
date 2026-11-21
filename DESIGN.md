---
name: Jossify
description: Your Spotify listening ranking. Your #1 at poster scale, the rest as a precise ranked chart.
colors:
  bg: "#0e0d0f"
  surface-1: "#161518"
  surface-2: "#1f1d22"
  surface-3: "#2a282e"
  line: "#2b292f"
  line-strong: "#3a3840"
  text: "#f5f4f6"
  text-2: "#aeacb4"
  text-3: "#8a8790"
  accent: "#ff6a3d"
  accent-hover: "#ff8460"
  accent-ink: "#1c0a03"
  accent-soft: "rgb(255 106 61 / 0.14)"
typography:
  display:
    fontFamily: "'Figtree Variable', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "clamp(2.25rem, 0.8rem + 5.2vw, 5.75rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "'Figtree Variable', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "clamp(1.75rem, 1.2rem + 1.6vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Figtree Variable', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Figtree Variable', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "'Figtree Variable', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Figtree Variable', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1
  rank:
    fontFamily: "'Figtree Variable', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.5
    fontFeature: "tnum"
  column-header:
    fontFamily: "'Figtree Variable', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.04em"
rounded:
  thumb: "4px"
  sm: "6px"
  art: "8px"
  md: "12px"
  lg: "20px"
  pill: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  "8": "4rem"
  "9": "6rem"
components:
  button-primary:
    backgroundColor: "{colors.text}"
    textColor: "{colors.bg}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 1.5rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "#ffffff"
    textColor: "{colors.bg}"
  button-primary-large:
    backgroundColor: "{colors.text}"
    textColor: "{colors.bg}"
    rounded: "{rounded.pill}"
    padding: "0 2rem"
    height: "3.25rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 1.5rem"
    height: "2.75rem"
  button-ghost-hover:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.text}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.text-2}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 0.75rem"
    height: "2.25rem"
  button-quiet-hover:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text}"
  segmented-control:
    backgroundColor: "{colors.surface-2}"
    rounded: "{rounded.pill}"
    padding: "3px"
  segmented-option:
    backgroundColor: "transparent"
    textColor: "{colors.text-2}"
    rounded: "{rounded.pill}"
    padding: "0 1rem"
    height: "2.25rem"
  segmented-option-active:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.pill}"
  ranked-row:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "0.75rem"
    height: "4.5rem"
  ranked-row-hover:
    backgroundColor: "{colors.surface-1}"
  artwork-hero:
    backgroundColor: "{colors.surface-2}"
    rounded: "{rounded.art}"
    width: "clamp(9rem, 22vw, 20rem)"
  artwork-thumb:
    backgroundColor: "{colors.surface-2}"
    rounded: "{rounded.thumb}"
    size: "3rem"
  movement-new:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    rounded: "{rounded.pill}"
    padding: "4px 7px"
  profile-pill:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "2px 0.75rem 2px 2px"
  profile-pill-hover:
    backgroundColor: "{colors.surface-3}"
  play-button:
    backgroundColor: "{colors.surface-3}"
    textColor: "{colors.text}"
    size: "2.25rem"
  play-button-current:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
  player-bar:
    backgroundColor: "{colors.surface-1}"
    rounded: "{rounded.md}"
    height: "80px"
  preview-card:
    backgroundColor: "{colors.surface-1}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
---

# Design System: Jossify

## Overview

**Creative North Star: "The Poster and the Chart"**

Jossify is the category-standard dark music-stats app, executed at full craft. Every ranking view has exactly two registers: the listener's #1 shown at poster scale (big square artwork, the name set at display size), and everything below it set as a precise, quiet chart, where rank numerals, movement markers and hairlines carry the information. The interface frames the user's music and otherwise stays out of the way; album and artist artwork is the only imagery and the only real colour on screen.

The ground is a near-black with a faint warm tint, raised in two tonal steps rather than with shadows. One ember accent does all the signalling, and it is rare on purpose: active controls, the #1 rank and upward movement. A single family, Figtree, builds the hierarchy through weight (600 / 700 / 800) and tight negative tracking at display size, with tabular numerals wherever numbers line up. Density is moderate: generous around the hero, compact and scannable in the list (4.5rem rows on desktop, 4rem on phones).

The world refuses the equal-card cover grid with no hierarchy, and it refuses the Spotify-green clone: Spotify green lives only inside Spotify's own logo, sign-in and attribution assets.

**Key Characteristics:**
- Tinted near-black ground, two raised surface steps, hairline separators.
- One ember accent, reserved for active state, the #1 rank and upward/new movement.
- Figtree Variable only; hierarchy by weight and tracking; tabular rank numerals.
- Artwork is the only imagery: 8px-radius square covers, circular artists.
- Pill-shaped controls throughout (buttons, segmented switches, profile chip).
- Flat everywhere except the feature artwork, which casts the one shadow.
- Motion with a job: a poster entrance on first view, and the in-place re-rank when the range changes.

## Colors

A warm-tinted charcoal ramp with a zinc text ramp and a single ember accent; colour beyond that comes only from the user's artwork.

### Primary
- **Ember** (`accent`): the one accent. Checked segmented options, the "#1" rank marker in the hero context line, upward movement arrows, the "New" movement chip, the play button of the loaded track, the focus ring (2px, 3px offset), text selection and the caret. 6.8:1 on the ground.
- **Ember Glow** (`accent-hover`): hover state for accent-filled controls.
- **Ember Ink** (`accent-ink`): text and icons sitting on an ember fill (6.8:1 on ember). Never use the ground or white on ember.
- **Ember Haze** (`accent-soft`): 14% ember fill behind the "New" movement chip.

### Neutral
- **Warm Night** (`bg`): the page ground everywhere, and the text colour on light (primary) buttons.
- **Raised Night** (`surface-1`): first raise. Row hover fill, ghost-button hover, the landing preview card.
- **Lifted Night** (`surface-2`): segmented-control track, profile chip, artwork placeholders, skeleton blocks, quiet-button hover.
- **High Night** (`surface-3`): play button rest, profile-chip hover, avatar fallback, scrollbar thumb.
- **Hairline** (`line`): every 1px separator: list rows, column header rule, top bar bottom edge, footer top edge, card borders.
- **Strong Hairline** (`line-strong`): ghost-button outline only.
- **Bone** (`text`): primary text (17.7:1) and the fill of primary buttons.
- **Ash** (`text-2`): secondary text: artist lines, album/genre column, rank numerals, column headers, lead copy (8.6:1).
- **Smoke** (`text-3`): tertiary text: durations, down/same movement, footer copy, idle open-link icons (5.5:1 on bg, 5.2:1 on surface-1).

### Artwork tint
The ranking view washes its top band (up to `min(40rem, 90vh)`) with a colour sampled from the #1 artwork: the sampled hue is kept, saturation capped at 70%, lightness pinned to 20% (`hsl(h s% 20%)`), shown at 0.55 opacity and masked to fade into the ground, cross-fading over 600ms when the #1 changes. Worst case it keeps `text-2` at 5.6:1.

### Named Rules
**The Earned Ember Rule.** Ember means "active", "#1" or "rising" and nothing else. Headings, labels, decoration, borders and illustration never take the accent. If an ember element does not answer "is this selected, the top item, or moving up?", it is wrong.

**The Green Belongs to Spotify Rule.** Spotify green appears only inside Spotify's own logo, sign-in and attribution assets, never as a Jossify UI colour.

**The Tint Floor Rule.** Anything that can sit over the artwork tint (the hero, the list header, the first rows) uses `text-2` or brighter. `text-3` never sits on the tint.

## Typography

**Display Font:** Figtree Variable (with Figtree Fallback, ui-sans-serif, system-ui, -apple-system, Segoe UI fallbacks)
**Body Font:** Figtree Variable (same stack)

**Figtree Fallback** is not a second typeface: it is local Arial resized to Figtree's width and line metrics (`size-adjust`, `ascent-override`, `descent-override` in `global.css`), shown only until Figtree loads so the swap never shifts the layout. The Latin Figtree file is preloaded from `index.html` at build time.

**Character:** One friendly geometric-humanist sans doing everything. At display size it goes heavy (800) and tight (-0.035em) so a track name reads like a poster; at list size it is calm 600/400 with tabular numerals.

### Hierarchy
- **Display** (800, `clamp(2.25rem, 0.8rem + 5.2vw, 5.75rem)`, line-height 0.98, -0.035em): the #1 item's name in the hero, and nothing else on ranking views. Below 40rem it drops to `clamp(1.5rem, 1rem + 3vw, 2rem)` at line-height 1.05 so the list starts in the first screen. Long names wrap anywhere rather than overflow.
- **Headline** (700, `clamp(1.75rem, 1.2rem + 1.6vw, 2.25rem)`, 1.1, -0.02em): state-message titles (empty, error, signed-out) and the landing preview's #1 name (at 800, -0.03em).
- **Title** (600-700, 1.375rem, 1.1): the hero's artist line (600, in `text`) and the list heading "Your top 40" (700, -0.01em). The wordmark sits at 1.125-1.375rem, 800, -0.02em.
- **Body** (400, 1rem, 1.5): default copy; row names at 600. Larger lead copy steps to 1.125-1.375rem in `text-2`, capped at 34-36rem / 60ch.
- **Body Small** (400, 0.875rem, 1.5): row subtitles, album/genre column, durations, context lines, footer.
- **Label** (600-700, 0.875rem): buttons (700) and segmented options (600).
- **Rank** (700, 1.125rem, tabular, right-aligned, `text-2`): list rank numerals; 1rem on phones.
- **Column Header** (600, 0.75rem, uppercase, 0.04em, `text-2`): the list's column-header row only ("#", "Title", "Album"). It labels table columns; it is not a pattern for section labels.

### Named Rules
**The Tabular Rank Rule.** Every number that lines up with another number (ranks, movement places, durations) uses tabular numerals.

**The Weight Ladder Rule.** Hierarchy comes from Figtree's weight and size, not from new families, italics or colour: 800 for the poster and wordmark, 700 for ranks, headings and buttons, 600 for names and controls, 400 for everything else.

## Layout

Content sits in a centred column (`max-width: 76rem`) with a fluid gutter (`clamp(1rem, 0.5rem + 2.5vw, 2.5rem)`). The spacing scale runs 0.25 / 0.5 / 0.75 / 1 / 1.5 / 2 / 3 / 4 / 6rem (`spacing.1` to `spacing.9`); hero and landing padding use clamps between steps 5-9 so the composition breathes with the viewport.

- **Top bar:** sticky, 4rem tall, three columns (wordmark / centred switches / account), ground at 92% opacity with `saturate(140%) blur(14px)` and a hairline bottom edge. At 60rem and below it becomes two rows: wordmark and account, then both switches stretched full-width (each takes its own row if they don't fit together). Below 40rem the switch options shrink to 2rem tall, 0.8125rem text, and the account collapses to avatar and icon.
- **Hero:** a two-column grid of artwork (`clamp(9rem, 22vw, 20rem)`) and text, both bottom-aligned, actions under the text. Below 40rem the art shrinks to `clamp(6.5rem, 30vw, 8rem)` beside the text and the actions drop to a full-width row.
- **Ranked list:** the column-header row and every list row share one grid template (rank / movement / art / title / detail / duration / actions). At 60rem and below the detail column goes; below 40rem the header hides and rows collapse to rank / art / title / movement / actions.
- **Landing:** a two-column 1.1fr / 0.9fr split (intro and a live-looking preview card), stacking to one column at 60rem and below; below 40rem the action buttons go full width.

Breakpoints are `60rem` and `40rem`, both max-width.

**The Shared Grid Rule.** A ranked list's header and rows read from one column template, so every column lines up at every width.

## Elevation & Depth

The system is flat. Depth comes from tonal steps (`bg` to `surface-1` to `surface-2` to `surface-3`) and 1px hairlines, plus the top bar's frosted backdrop. One shadow exists, and it belongs to the record.

### Shadow Vocabulary
- **Record shadow** (`box-shadow: 0 24px 48px -16px rgb(0 0 0 / 0.65), 0 8px 16px -8px rgb(0 0 0 / 0.5)`): the hero #1 artwork and the #1 cover in the landing preview card. Makes the poster artwork sit off the ground.

### Named Rules
**The Only Shadow Is the Record Rule.** Only feature artwork casts a shadow. Cards, buttons, rows, menus and the top bar are flat; separate them with a tonal step or a hairline instead.

## Shapes

Two families of form. Everything you press is a pill (999px): buttons, segmented tracks and options, the profile chip, the "New" chip. Everything that holds artwork is a gently rounded square: 8px for feature covers, 4px for list thumbnails (3rem, 2.75rem on phones), with artists always clipped to a circle. Row hover fills and the focus outline use a small 6px radius; the one framed container (the landing preview card) uses 20px with a hairline border. Icon-only buttons (preview, open-in-Spotify) are circles.

## Components

### Buttons
Confident light pills that defer to the artwork.
- **Shape:** full pill (999px), 2.75rem tall, 1.5rem side padding; large variant 3.25rem tall, 2rem padding, 1rem text.
- **Primary:** `text` fill with `bg` text, 700 weight, 0.875rem. Used for "Open in Spotify", sign-in and retry-style primary actions. Hover goes to pure white.
- **Ghost:** transparent with a `line-strong` 1px outline and `text` label; hover fills `surface-1` and the outline moves to `text-3`. The secondary action beside a primary.
- **Quiet:** borderless, 2.25rem tall, `text-2` label; hover fills `surface-2` and the label brightens. Used for sign-out.
- **States:** colour and border transitions at 150ms; press scales to 0.97; disabled is 50% opacity with a not-allowed cursor. Trailing icons are 16px line icons.

### Segmented Control (Tracks/Artists, time range)
- **Style:** a `surface-2` pill track with 3px padding and 2px gaps; options are pills 2.25rem tall, 600 weight, `text-2`.
- **State:** hover brightens the label to `text`; the checked option fills ember with `accent-ink` text. Built on real radio inputs; focus shows a 2px ember outline at 2px offset on the option.

### Ranked List Row (signature)
- **Structure:** rank numeral, movement badge, 3rem thumbnail, name (600, `text`, underlines on hover, links to Spotify) over subtitle (`text-2`, with a 1rem `text-3` explicit marker), detail column, duration (`text-3`, tabular), circular open-in-Spotify icon button.
- **Surface:** transparent at rest, `surface-1` hover fill with a 6px radius; the 1px `line` separator is drawn straight underneath so it doesn't follow the rounded fill.
- **Height:** 4.5rem minimum (4rem on phones).

### Movement Badge
- **Up:** ember arrow and tabular place count. **Down / same:** `text-3` arrow or dash. **New:** an ember-on-`accent-soft` pill reading "New". 14px, 2.5-stroke line icons; a screen-reader sentence carries the full meaning.

### Hero (#1)
- Feature artwork (8px radius or circle, record shadow, `surface-2` placeholder), display-size name, artist line at title size, and one context sentence in `text-2` that begins with the ember "#1", ends with the movement badge, and wraps as text. Beneath it, a primary "Play" pill and a ghost "Open in Spotify" pill; in the demo, where nothing is playable, "Open in Spotify" is the primary. The context line sits below the title; nothing sits above it.

### Navigation (top bar and account)
- Wordmark (mark plus "Jossify", 800, -0.02em) left; switches centred; account right as a `surface-2` profile pill (2rem circular avatar, name at 0.875rem/600, `surface-3` on hover) plus a quiet sign-out button.

### Play Button
- In list rows: circular, 2.25rem, `surface-3` at rest; hover inverts to `text` fill with `bg` icon; the loaded track fills ember with `accent-ink` (an active control). Shows Pause while Spotify reports playback. Press scales to 0.94. In the hero it is the labelled primary pill. Not rendered in the demo.

### Player Bar
- Spotify's official embedded player (iFrame API), docked to the bottom edge: full-width `surface-1` band at 0.96 opacity with backdrop blur and a top hairline, the 80px embed in a 12px (`radius-md`) frame inside the page width, and a quiet circular close button. Slides up once (320ms ease-out) when the first track is chosen; the page gains bottom padding while it is open so it never covers content. The embed's own colours are Spotify's and are not themed.

### Cards / Containers
- Used once, for the landing preview: `surface-1` fill, 20px radius, 1px `line` border, 1.5rem padding, no shadow. Internal sections are divided by hairlines.

### Loading Skeleton
- Mirrors the hero and list geometry with `surface-2` blocks (6px radius, 8px for the art, 4px for thumbs) pulsing to 0.55 opacity over 1.6s.

### Motion
Two kinds of authored motion, both transform/opacity only on `cubic-bezier(0.16, 1, 0.3, 1)` (GSAP `expo.out`).

**Entrances (GSAP, `src/lib/motion/`).** Rare moments get the delight budget; frequent ones stay short.
- **Landing (once per visit):** the headline rises word by word out of per-word masks (900ms, 70ms stagger); lead, actions and facts follow (16px rise, 700ms, 80ms stagger); the preview card rises 32px from 0.98 scale, its #1 cover scales in from 0.9 and its rows stagger in (50ms).
- **Landing preview re-rank:** a compact 4 weeks / 6 months switch inside the card. After the entrance, if the card is on screen and motion is allowed, it switches once on its own (2.6s) to demonstrate the re-rank; after that it changes only when the visitor asks. A new #1 cross-fades in (8px, 350ms).
- **The #1 reveal (signature):** plays the first time each view (tracks or artists × 4 weeks, 6 months, all time) shows its #1 in a visit, even when two ranges share the same #1. Returning to a view already seen uses the short hand-off. The frame rises 24px from 0.94 scale (900ms). Once the cover has loaded (at most 700ms wait), the picture is revealed by kind: a **track** cover wipes up into its frame like a sleeve pulled from a crate (`inset` clip), an **artist** portrait opens as an iris (`circle` clip). Both settle from 1.25 zoom over 1.4s (`power3.out`, 150ms delay). Then one band of light (22% white, 110°) crosses the artwork (1s, `power2.inOut`). The title's words rise out of masks (800ms, 50ms stagger), subtitle, context and actions follow (12px, 600ms, 60ms stagger), and the ember "#1" lands last with a small overshoot (from 0.4 scale, 700ms, `back.out(1.6)`), the only bounce in the system. The clip sits on the image, never the frame, so the record shadow is never cut. The first 12 rows follow (16px, 600ms, 35ms stagger, 350ms delay); rows below the fold are already in place.
- **Returning to a view already seen:** a short hand-off under 400ms: artwork from 0.4 opacity and 0.98 scale (300ms), words from 40% below (350ms, 15ms stagger), the rest from 0.4 opacity; a new list's first 12 rows stagger in at 25ms.
- **Pointer tilt:** the hero artwork (5°) and the landing preview card (3°) tilt toward a fine pointer, 600ms `power3.out`. Never on touch.

**The re-rank (WAAPI, `useFlipList`).** When the range changes, the list re-ranks in place (FLIP). Rows that left fade out where they were (240ms ease-out), rows that stayed glide to their new place (560ms), and new rows rise 8px and fade in (360ms after a 160ms delay). It runs on the compositor through the Web Animations API rather than GSAP, so it stays smooth while new data renders. A range change during a row entrance lands the entrance first so the two never fight.

The artwork tint cross-fades over 600ms. The player bar slides up once (320ms) when it first opens. Everything else is a 150ms colour transition.

**Reduced motion:** no entrances, tilt, auto-demo or re-rank. The only thing kept is a 280ms opacity cross-fade on the hero when the #1 changes, so the change is still legible.

## Do's and Don'ts

### Do:
- **Do** keep ember for checked controls, the #1 rank, upward movement and "New", plus the focus ring and selection (The Earned Ember Rule).
- **Do** put `accent-ink` on every ember fill, and `bg` on every `text`-filled button.
- **Do** use tabular numerals for ranks, movement places and durations.
- **Do** separate surfaces with a tonal step or a 1px `line` hairline.
- **Do** show artwork at 8px radius (4px for list thumbnails) and clip artists to a circle.
- **Do** keep anything that can sit on the artwork tint at `text-2` or brighter.
- **Do** keep motion to transform and opacity on `cubic-bezier(0.16, 1, 0.3, 1)`, and skip it under reduced motion.
- **Do** write GSAP animations with `useMotion` / `usePointerTilt` from `src/lib/motion/hooks.ts`, importing `gsap` from `src/lib/motion/gsap.ts`, so reduced motion, cleanup and defaults come for free.

### Don't:
- **Don't** use Spotify green anywhere except inside Spotify's own logo, sign-in and attribution assets.
- **Don't** add shadows to anything but feature artwork.
- **Don't** put `text-3` over the artwork tint.
- **Don't** set the ranking as a grid of equal cover cards; the #1 leads at poster scale and the rest is a list.
- **Don't** place a label or kicker above the hero title; context goes in the sentence below it.
- **Don't** introduce a second typeface or a second accent colour.
- **Don't** animate frequent actions (hover, segmented switches, play/pause) beyond 150ms colour transitions and press scale; entrances belong to first views and new content.
- **Don't** animate rows on scroll or move data the user is reading; only the first screen enters in sequence.
- **Don't** loop motion on its own: the landing preview demonstrates the re-rank once, then waits for the visitor.
