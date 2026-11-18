# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, both primary:

- **Spotify listeners** who want to see what they actually listen to: their top artists and top tracks over three time ranges (last 4 weeks, last 6 months, all time). They sign in with Spotify, look, compare ranges, and may open items in Spotify.
- **Recruiters and engineers reviewing the author's GitHub profile.** They judge the live app and the repository (README, code structure, tests, CI) as evidence of the author's professional and technical growth.

## Product Purpose

Jossify shows a Spotify user their personal listening ranking. Success: a listener signs in and immediately understands their taste across time; a reviewer opening the repo or the live link sees a polished, well-engineered product.

## Positioning

A personal, read-only lens on the user's own Spotify data, built and maintained by one developer as a showcase of craft. No account, no backend, no data stored beyond the browser session.

## Operating Context

- Live at https://jossify-joss.web.app/ (Firebase Hosting, SPA served from `build/`).
- Sign-in via Spotify Authorization Code + PKCE, fully client-side. Redirect URIs: `https://jossify-joss.web.app/TopMusic` and `http://127.0.0.1:3000/TopMusic`.
- Spotify Web API endpoints used: `/v1/me/top/artists` and `/v1/me/top/tracks` with `time_range` = `short_term` | `medium_term` | `long_term`, scope `user-top-read`.
- Used on desktop and phone browsers.

## Capabilities and Constraints

- Top artists and top tracks, up to 40 each, per time range.
- Links out to each item on Spotify.
- Spotify's 30-second `preview_url` is null for most tracks now; audio previews cannot be relied on.
- Spotify development-mode apps only allow users added to the app's allowlist in the Developer Dashboard; open access requires Spotify's extended quota approval.
- Interface language: English.
- Engineering commitments for v2: TypeScript, typed `fetch` client (no axios), TanStack Query for data fetching, ESLint, GitHub Actions CI running lint + tests + build.

## Brand Commitments

- Name: **Jossify**. Domain stays `jossify-joss.web.app`.
- Spotify brand assets (logo, "Sign in with Spotify") must follow Spotify's developer branding guidelines: attribution to Spotify, Spotify content shown with links back to Spotify, no implication that Jossify is made by Spotify.
- Visual direction (chosen 2026-11-17): the category standard, a dark music-stats app, executed at full craft. Quality bar: stats.fm, Last.fm, Apple Music, Spotify desktop.
- Jossify uses its own accent colour. Spotify green appears only in Spotify's own logo and the Spotify sign-in/attribution.

## Evidence on Hand

- Real data comes only from the signed-in user's Spotify account at runtime. No sample users, testimonials, or usage numbers exist; do not fabricate any.
- Existing assets in `src/images/` (Jossify icon with/without name, backgrounds, Spotify logo/icon).

## Product Principles

1. The user's music is the content; the interface frames it and stays out of the way.
2. Honest about data: show what Spotify returns, say clearly when something is missing or failed.
3. The repository is part of the product: code, tests, and docs are held to the same bar as the UI.
4. Works well on a phone, because that is where people check their music.

## Accessibility & Inclusion

Target WCAG 2.2 AA: keyboard operable, visible focus, sufficient contrast, reduced-motion respected, meaningful alt text for artwork.
