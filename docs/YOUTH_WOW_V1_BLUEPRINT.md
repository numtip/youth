# Youth Next — WOW-V1 Blueprint

> Status: **approved for planning only — no implementation yet.**
> Base commit: `e7d5147` (`main`, synced 2026-08-18). Live preview gate:
> https://numtip.github.io/youth/
>
> Joomla legacy (`researchex.mju.ac.th/youth/`) is **content/reference evidence
> only**. Its visual design is not a baseline and must not be copied.

---

## 1. Vision — "Youth in Action"

Maejo University's Youth Volunteer program puts students, lecturers, and local
communities to work on real local problems: coffee farms, biochar community
enterprises, organic vegetable groups, community tourism. The site should feel
like **people in the field, not a brochure**.

WOW-V1 makes the evidence of that work the hero:

> **Youth in Action** — real people, real places, real work across northern
> Thailand, told with photography first and motion that earns its place.

Success looks like: the homepage leads with actual fieldwork photography, the
program's cumulative record is stated from verified data only, and every story
is one click from a photo-rich project page.

---

## 2. Design principles

1. **Photography first.** Real project photos are the primary visual language.
   No stock imagery, no decorative illustration that substitutes for evidence.
2. **Honest data.** Every number shown is computed from the content collections
   at build time. Nothing is hard-coded or invented.
3. **Static-first, zero-JS-by-default.** All pages render to HTML at build time.
   Motion is progressive enhancement; the site works fully with JS disabled.
4. **TH/EN parity.** Every UI string and every content field has both locales.
   Thai remains the default, unprefixed language.
5. **Respect the reader.** `prefers-reduced-motion` is honored globally; motion
   is subtle, purposeful, and never required to understand content.
6. **No framework debt.** Astro + Tailwind only. No UI/motion library unless a
   proven, documented need appears in Phase C.
7. **Accessibility is design.** Semantics, focus, contrast, and alt text are
   part of the design system, not a retrofit.
8. **Preserve the platform contract.** `/youth/` base-path awareness,
   `src/lib/site.ts` helpers, content validation, CI gates, and the
   Markdown content pipeline remain untouched in spirit.

---

## 3. Visual identity + typography + design tokens

### Identity

- **Color** — keep the existing emerald (primary) + stone (neutral) system and
  extend it in the Tailwind `@theme` block only. Emeralds stay the "youth"
  green; add an amber accent used sparingly for years/achievements.
- **Texture** — photography carries texture; UI surfaces stay clean and flat.
  The existing `media-figure` crop system (4/3, 16/9) is the standard.
- **Shape** — consistent rounded cards (`rounded-xl` today) and pill badges.

### Typography

- **Self-host Sarabun** (Thai + Latin) so Thai rendering is consistent across
  OSes. Current stack lists Sarabun but loads no font files.
- Hierarchy: display (hero) → h2 section titles → card titles → body. Use the
  existing `md-body` typographic scale for prose.

### Tokens (Tailwind 4 `@theme` in `src/styles/global.css`)

```css
@theme {
  --color-brand-*:      /* emerald family, tokenized aliases */
  --color-accent-*:     /* amber family for years/achievements */
  --font-display: "Sarabun", ...;
  --font-body: "Sarabun", ...;
  --ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-reveal: 450ms;
  --duration-enter: 700ms;
  --shadow-card: ...;
}
```

Every new color/font/easing must be a token; utility classes in templates must
reference tokens, not raw values.

---

## 4. Cinematic Hero

Evolution of the existing hero (already uses `hero-banner.jpg` at `opacity-40`
with `drop-shadow`). WOW-V1 upgrades it in place — same architecture, better
craft.

### Composition

- Full-bleed real-photo background (`public/media/brand/hero-banner.jpg`,
  replaced by a higher-quality original if the owner can provide one).
- Dark overlay + gradient scrim for text contrast (replaces flat `opacity-40`).
- Headline (`t.hero.title`), tagline (`t.siteTagline`), subtitle
  (`t.hero.subtitle`), and the existing white CTA to `/activities/`.
- **Evidence chip row**: three small verified numbers (see Impact Strip data)
  anchored at the hero bottom — "13 projects · 57 activities · 4 years".
- Scroll cue: a subtle bounce/chevron that vanishes on scroll.

### Implementation

- `HomePage.astro` hero section only; overlay via Tailwind gradients, no new
  components required for V1. Loading is `eager` with
  `fetchpriority="high"` + `width`/`height` attributes to prevent CLS.
- Optional slow Ken-Burns zoom on the hero image **only**, via CSS animation,
  disabled under reduced-motion.

---

## 5. Impact Strip — verified data only

The strip shows **aggregates computed from the content collections at build
time**, never hand-written numbers. Add query helpers to `src/lib/content.ts`:

```ts
getImpactTotals() // { projects: 13, activities: 57, years: 4, media: 585 }
```

Currently verifiable from collections:

| Metric | Value | Source |
| --- | --- | --- |
| Projects | 13 | published `projects` entries |
| Activities | 57 | published `activities` entries |
| Academic years | 4 | distinct `year` values (2564, 2567, 2568, 2569) |
| Media files referenced | 585 | unique `/media/` paths (all present) |

Layout: a full-width band below the hero, 3–4 stat cells, each with the number,
a Thai label, and an optional English label. Numbers render server-side; no JS.
Any future metric (participants, communities reached, faculties) must first be
added to the content schema from a verified source — **do not invent metrics**.

---

## 6. Featured Stories

Curated, not algorithmic: add an optional `featured: boolean` (default `false`)
to the project schema in `src/content.config.ts`, plus validation in
`scripts/validate-content.mjs`.

- Homepage section "Featured Stories" shows up to 3–4 `featured` projects as
  larger, asymmetric cards (image-led) reusing `ProjectCard` styles.
- Non-featured projects still appear under "โครงการล่าสุด" / the activities
  index unchanged.
- TH/EN labels added to `src/i18n/index.ts` (`home.featured`).

---

## 7. Year Journey / Timeline

The activities index already groups by year (`ActivitiesIndexPage`). WOW-V1
turns that grouping into a **vertical timeline** (Thai-friendly reading order).

- Left rail: year marker (2564, 2567, 2568, 2569 — rendered as-is, honest
  about gaps; no invented years).
- Each year block lists its projects as the existing cards, with a connecting
  line and node dot.
- Project cards link to project pages exactly as today.
- Reveal-on-scroll per year block (see motion architecture), disabled under
  reduced-motion.
- No data-model change: reuse `byYear` grouping already in the component.

---

## 8. Project Story Page

Projects currently have **no long-form body** (frontmatter only). WOW-V1 adds a
story surface without breaking existing content:

- **Backward-compatible schema**: add optional `body` field or allow `.md` body
  on project files (activities already render body via `render()`); existing
  13 projects remain valid with no body.
- Page layout (`ProjectPage.astro`): cover hero band → title/summary →
  story body → activity cards (current list) → photo story strip.
- Facts stay data-driven: year badge, summary, activities, sources already
  exist; the story body is the only new authored content (owner-written,
  verbatim, no fabrication).
- New EN fields follow the same `_en` convention as today.

---

## 9. Photo Story / Gallery

Upgrade `Gallery.astro` from a static grid to a **photo story**:

- Keep the responsive grid; add per-image captions derived from alt text.
- **Lightbox**: a dependency-free `<dialog>`-based viewer — arrow-key
  navigation, ESC to close, focus trap, `aria-label`, image counter.
- Keyboard accessible: lightbox buttons reachable in tab order; `alt` text is
  the source of truth for all descriptions.
- No framework — a single small Astro component + inline script pattern already
  used by `SearchPage`.
- Respects reduced-motion: transitions degrade to instant show/hide.

---

## 10. Lightweight motion architecture

Principles: **zero external motion libraries; motion is CSS + a tiny amount of
islands-free inline JS; everything has a reduced-motion fallback.**

1. **CSS transitions/animations** for hover, focus, reveal transforms,
   hero Ken-Burns — all defined with tokens in `global.css`.
2. **IntersectionObserver reveal** (`data-reveal` attributes + one shared
   inline script, or Astro View Transitions API for page-level transitions —
   decide in Phase A spike with no code committed either way).
3. **Astro View Transitions API** only if page-level transitions are adopted;
   it is built into Astro and adds no dependency. Scope: subtle fade/slide on
   navigation, disabled under reduced-motion.
4. **No scroll-jacking, no parallax on body, no background-video autoplay.**
5. Bundle budget: **0 additional external JS bundles**; inline scripts only
   (search already sets the precedent).

---

## 11. prefers-reduced-motion + accessibility

Global rule set in `src/styles/global.css`:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important; }
}
```

Checklist (per component touched):

- All interactive elements focus-visible (existing global style kept).
- Gallery: keyboard nav + focus management + ARIA live counter.
- Cards: whole-card link pattern retained; `alt` text descriptive, not
  `{title} — N` (add photo-specific alts where authored).
- Hero: text has sufficient contrast over scrim (verify against WCAG AA);
  decorative background `aria-hidden="true"`.
- Timeline: landmark/semantic list structure; year markers are headings.
- Impact strip numbers rendered as text (not images) with proper locale
  formatting.

---

## 12. Image optimization strategy

Current state: 585 `/media/` files, **~214 MB raw** on disk; worst offenders are
multi-MB PNGs (e.g., `organic-vegetable/activity-3` screenshots up to 1.5 MB);
the hero banner is a 293 KB JPG. `MediaFigure` only adds `loading="lazy"`.

Phase A pipeline (scripts, matching existing `scripts/` conventions):

1. **Analyze** — new `scripts/audit-images.mjs` reporting the largest files,
   format breakdown, and total weight; fails CI over a budget (see §13).
2. **Transform** — new `scripts/optimize-images.mjs` generating
   width-capped WebP/AVIF alongside originals into `public/media/optimized/`
   (or a `dist`-time transform), with `srcset`/`sizes` emitted by
   `MediaFigure`. Original files stay archived outside `public/` per
   `public/media/README.md`.
3. **Hero asset** — replace `hero-banner.jpg` with an optimized,
   appropriately-cropped original if the owner provides one; otherwise use the
   existing file optimized.
4. **Alt text** — require descriptive Thai alt per image during Phase A cleanup
   (matches README mandate; enforce via `validate-media` warnings).

No CDN required; GH Pages static output stays the deploy target.

---

## 13. Performance budgets

Measured on the Phase D QA exit (`SITE_BASE=/youth/ npm run build`, 2026-08-18):

| Budget | Target | Phase D exit (verified) | Verdict |
| --- | --- | --- | --- |
| Total static output | ≤ 100 MB after optimization | 218.5 MB (`dist`), 214.3 MB raw originals | FAIL (P2, gated) |
| Max image per page (home/index) | ≤ 250 KB avg, ≤ 1 MB worst | 179.4 KB avg, 421.5 KB worst, 0 over 1 MB | PASS |
| Max image per page (photo-dense project) | ≤ 250 KB avg, ≤ 1 MB worst | 245.9 KB avg, 1,419.2 KB worst, 7 over 1 MB | FAIL (P2, gated) |
| CSS per page | ≤ 34 KB (34,816 B) | 33,887 B = 33.09 KB at `base=/youth/` (33,851 B at `base=/`), 1 file, 1 `<link>` per page | PASS (929 B headroom) |
| JS (external) per page | 0 | 0 `.js`/`.mjs` in `dist`, 0 `<script src=` in 154 pages | PASS |
| HTML per page | ≤ 40 KB | 135 of 154 pages pass; 19 breach, worst 136,135 B | Deviation — see below |
| `npm run build` time | ≤ 30 s | ~6.5 s (154 pages) | PASS |
| Lighthouse mobile — TH home | LCP ≤ 2.5 s, CLS ≤ 0.1 | Perf 99–100, A11y 96, BP 96, SEO 100; LCP 1.7–1.9 s, CLS 0–0.003, TBT 0 ms | PASS |
| Lighthouse mobile — TH activity + gallery | LCP ≤ 2.5 s, CLS ≤ 0.1 | Perf 95, A11y 94, BP 96, SEO 100; LCP 2.8 s, CLS 0, TBT 0 ms | LCP over by 0.3 s |
| Smoke tests | pass | 43/43 at both `base=/` and `base=/youth/` | PASS |

The CSS ceiling is now **enforced**, not just documented: `scripts/smoke-test.mjs`
asserts total emitted CSS ≤ 34,816 B and exactly one stylesheet link per page.
That check exists because the first Phase D measurement was taken from a stale
`dist` and under-reported CSS by 595 B. The image audit script enforces the media
budgets. Lighthouse figures are real runs (LH 12.8.2, mobile form factor,
simulated throttling) against the deployed site, which is a near-identical build
of the Phase C exit commit — they do not include the Phase D fixes.

### HTML budget deviation (Phase D — not a silent waiver)

The ≤ 40 KB target holds for typical pages (avg 25.0 KB across 154 pages) but
**19 pages breach it**: 18 photo-dense project pages plus TH `/search/`.

Driver is gallery markup that scales with image count — `fish-hen-farming`
carries 83 images, `organic-vegetable` 63. A secondary avoidable cost is the
per-page `application/json` gallery blob, which re-serializes the `src` and
`alt` of every image already present in the `<img>` markup (18,753 B = 19.7% of
`fish-hen-farming`). Removing it would cut 16–21% per page but would **not**
bring the worst pages into budget (`organic-vegetable` 136,135 B → ~107,400 B),
so it does not resolve the deviation and was not worth the release-time risk of
rewriting the freshly-QA'd lightbox.

**≤ 40 KB is not technically sensible for pages carrying 60–85 photos.** Revised
statement: **≤ 40 KB for pages with roughly ≤ 20 gallery images**; photo-dense
project pages are expected to run 60–136 KB uncompressed. Over the wire this is
far smaller (the 33 KB stylesheet compresses to 7,668 B; HTML compresses
comparably), and measured TBT stays at 0 ms because there is no external JS.

### Phase D P1 fixes (verified)

| Fix | Evidence before | Evidence after |
| --- | --- | --- |
| Card focus ring was clipped away entirely (`overflow-hidden` card, link fills the padding box, ring offset outward) | 3 px mimic ring at `+2px` invisible on screenshot | `.card-link:focus-visible{outline-offset:-2px}` — ring visible on card body |
| Activities timeline squeezed cards at ≤ 479 px | EN 320 px grid `81.5px 48px 126.5px`; content 126 px (40% of viewport); one title wrapped to 18 lines | grid `20px 256px`; content 256 px (80%); worst title 7 lines; no horizontal scroll |
| EN activity pages emitted Thai prose with no language override (WCAG 3.1.2) | `<html lang="en">` wrapping untranslated Thai body | `lang="th"` on `.md-body`, 114 pages |
| Heading order skipped `h2 → h4` on project pages (WCAG 1.3.1) | 26 pages with a skip | 0 heading-order violations across 154 pages; every page has exactly one `h1` |
| Search input suppressed its focus ring and had a 1.28:1 substitute (WCAG 2.4.7/1.4.11) | `focus:outline-none` + `focus:ring-emerald-200` | utilities removed; global 2 px emerald ring applies |
| Search placeholder contrast | 2.59:1 | 4.79:1 |
| Footer copyright contrast | 3.65:1 at 12 px | 6.76:1 |
| Search results injected `h3` directly under `h1` | `h3` | `h2` |
| Landmark names were English on TH pages | `aria-label="Language"`, nav labelled "Home" | localized `เมนูหลัก` / `เลือกภาษา` / `เส้นทางนำทาง`, EN "Main navigation" / "Select language" |
| Skip link did not move focus in Safari | no `tabindex` on `<main>` | `tabindex="-1"`; focus lands on `<main>`, and `:focus-visible` does **not** match, so no page-wide outline |
| Sticky header could cover fragment targets | no `scroll-padding-top` | `scroll-padding-top: 6rem` |
| Four activity pages linked internal sources without the base path — 404 on GitHub Pages | `href="/activities/2569/biochar-brand"` on 8 pages | `href="/youth/activities/2569/biochar-brand"`; **0** unprefixed site-absolute refs across 154 pages |
| Featured cover blew the ≤ 1 MB per-image budget on 3 high-traffic pages | `eco-tourism-route/cover.jpg` 1,483,995 B | WebP derivative 247.2 KB (−83%); homepage image payload 3,534.5 KB → 2,332.5 KB (−1,202.0 KB, −34.0%), worst 1,449.2 → 421.5 KB, images over 1 MB 1 → 0 |

### Phase D P1 regressions caught by independent review

Both were introduced by the Phase D fixes above and found by the release review,
not by the original QA pass. Recorded because the first round asserted the
opposite behaviour, and that assertion was wrong.

| Regression | Why it happened | Evidence | Fix |
| --- | --- | --- | --- |
| The timeline rail collapsed to a 64.5 px stub below 480 px — the exact band the reflow was written for | `.year-timeline__item` declares no `grid-template-rows`, so `grid-row: 1 / -1` resolved `-1` to explicit-grid line 1 and spanned nothing | At 479 px EN the rail measured 64.5 px against 1,103 px needed to reach the next node (94% missing); TH 64.5 px against 1,055 px | `grid-row: 1 / span 2`; rail now measures 1,115 px (EN) and 1,067 px (TH) at 479 px, and 922 px against 910 px needed at 320 px |
| `tabindex="-1"` on `<main>` made the skip link paint a 2 px emerald ring around the entire page | Chrome carries keyboard modality forward from the skip link, so `<main>` matched `:focus-visible` and picked up the global ring. The first QA pass tested with `skip.click()`, which does not set keyboard modality, and so measured `false` | With `:focus-visible` genuinely forced via CDP, `<main>` matched and the ring drew around a 1905 × 3034 px box | `main[tabindex='-1']:focus-visible { outline: none }`; forced-state check now reports `outline-style: none` |

A third, smaller issue from the same review: the inset card ring's corners were
being cut by the card's 12 px `overflow: hidden` curve, since the link itself had
no radius. Added `border-radius: 0.625rem` to `.card-link:focus-visible`, giving
a complete rounded ring (verified via forced `:focus-visible`).

The review also found that `scripts/smoke-test.mjs` logged harness errors without
recording a failure, so a preview-startup crash printed "0/0 smoke checks passed"
and exited 0 — the gate every claim here rests on could report green while
running nothing. Now records a failure and exits non-zero on both an exception
and an empty result set.

### Phase D P2 debt (recorded, deliberately not fixed)

1. **Gallery JSON blob duplication** — 16–21% of photo-dense page HTML. Fix is to
   read `src`/`alt` off the existing `.gallery-item img` nodes. Does not resolve
   the HTML deviation on its own.
2. **TH `/search/` is 42,799 B**, 85.5% of it the inline search index (36,597 B).
   EN is fine at 26,488 B. Trimming per-record fields changes search behaviour,
   so it is a Phase-E-or-later decision.
3. **Raw media 214.3 MB vs the 100 MB budget**; `dist` ships 218.5 MB. Only 5
   optimized derivatives exist (668.0 KB). Bulk conversion stays gated on
   `scripts/image-pilot.json`.
4. **7 images over 1 MB remain on `activities/2568/organic-vegetable`**, worst a
   1,419.2 KB PNG screenshot used as photography.
5. **No favicon.** Browsers request `/favicon.ico` at the *domain root* — outside
   `/youth/` — and get a 404, which zeroes Lighthouse `errors-in-console` and
   caps Best Practices at 96. Needs an owner-supplied brand asset, so it is not
   something QA should invent.
6. **Activity hero `<img>` has no `width`/`height`** (the homepage hero does).
   Currently harmless: measured CLS is 0 because `.media-figure` reserves the box
   via `aspect-ratio`. Defense-in-depth only.
7. **Lightbox counter is populated before `showModal()`**, so the `aria-live`
   region may not announce the first slide. Simply moving `updateSlide()` after
   `showModal()` would announce but flash an empty `<img>`; the correct fix
   re-sets the counter text after opening.
8. **`<figure>` inside `<button>`** in the gallery trigger violates the button
   content model. Parses fine; no assistive-tech impact measured.
9. **`uses-long-cache-ttl` scores 0.5** — GitHub Pages exposes no cache-header
   control. Accepted.
10. **TH `/404/` language switcher** targets `/404/`, which GitHub Pages serves
    through `404.html`; the link lands on a 404 page rather than the EN 404.
11. **`legacyUrls` render as raw `/youth/index.php/...` paths** that 404 on
    GitHub Pages. The adjacent absolute "Legacy Joomla source" link does work,
    so each reference list carries one working and one dead link. This is
    content modelling, pre-existing and outside WOW-V1 scope.
12. **Internal `sources` links are base-prefixed but not locale-aware** — EN
    pages link to the TH project page. Correct and resolving, just not localized.
13. **Backdrop click never closes the lightbox.** `.gallery-lightbox-panel` has
    the same rect as the `<dialog>`, so `e.target === dialog` is never true and
    the handler at `Gallery.astro:160-164` cannot fire. Pre-existing; Escape and
    the close button both work, so this is a missing convenience rather than a
    trap. Note the Phase D QA pass initially recorded this as working — that test
    dispatched the click on the dialog element directly, which is not what a real
    backdrop click does.
14. **`scroll-padding-top: 6rem` (96 px) does not match the header** at most
    widths: measured header height is 155 px (TH) / 175 px (EN) at 320 px, 131 px
    at 375–480 px, 103 px at 640–768 px, and 61 px at 1280 px. It is a partial
    mitigation, never a regression — too small on narrow screens, harmlessly
    large on desktop. It also does nothing for the site's only fragment link,
    since `#main-content` already sits at the top of the page; its real effect is
    on tab-scroll-into-view. Make it responsive or drop it when the header layout
    is next revisited.
15. **`nav.home` is now unused** — the Header was its only consumer before the
    landmark fix. Left in place rather than churning the `Ui` interface.
16. **On 4 activity pages both reference links are the same dead
    `/youth/index.php/...` path** (`aquatic-circular-economy/activity-1` and
    `biochar-brand/activity-1`, TH + EN), so those pages have no working source
    link at all. A sharper case of item 11, and still a content fix.

### CSS budget revision (Phase B — not a silent waiver)

The original CSS target was **≤ 25 KB** (Phase A table listed 20.6 KB
pre-font; Phase A exit after self-hosted Sarabun was **23.7 KB**). That left
**1.3 KB** of headroom.

Phase B homepage (cinematic hero + impact strip + featured stories) first
landed at **31.0 KB**. Root cause: Tailwind 4 emits each gradient color stop
three times (hex, `color-mix`, gradient-stops). Three hero overlay utilities
cost ~8.5 KB of generated CSS. Arbitrary `backdrop-blur-[2px]` on chips added
~324 B on top of the Header `backdrop-blur` machinery already present in
Phase A (~3 KB — not in scope to remove).

Targeted cleanup (no visual redesign): collapse overlays into `.hero-scrim` /
`.hero-frame` in `global.css`, drop the arbitrary chip blur, drop redundant
`lg:col-span-2`. Result: **27.9 KB** (28,599 bytes).

**≤ 25 KB is not technically sensible** without cutting Phase B surfaces or
the Phase A sticky-header blur. Honest Phase B add after waste removal is
~4.2 KB on the 23.7 KB Phase A baseline. Revised gate: **≤ 30 KB**, leaving
~2.1 KB for Phase C story surfaces.

Do not re-introduce Tailwind gradient utilities on the hero; keep the scrim
as a single component class.

### CSS budget revision (Phase C — not a silent waiver)

Phase B exit was **27.9 KB**. The Phase B gate reserved ~2.1 KB for Phase C;
that was insufficient for three story surfaces.

Phase C adds component CSS in `global.css` only (no new Tailwind utilities):
year timeline (~110 lines), gallery `<dialog>` lightbox (~150 lines), project
hero band (~10 lines). First land: **33.6 KB** (+5.7 KB). After trimming
hover/animation duplication: **32.4 KB** (+4.5 KB honest add).

**≤ 30 KB is not technically sensible** without removing the lightbox chrome,
timeline rail, or captions. Revised gate: **≤ 34 KB** (33,194 bytes measured).
Gallery lightbox remains inline-script only; no external JS bundle.

---

## 14. TH/EN + GitHub Pages base-path contracts

Non-negotiable rules for every new feature:

1. **All internal links/assets** go through `withBase`/`localeHref`
   (`src/lib/site.ts`, `src/i18n/index.ts`). Never hard-code `/youth/`.
2. **New content fields** with language variants use the existing `_en`
   convention; UI strings go into `src/i18n/index.ts` both locales.
3. **EN routes** stay under `/en/`; TH remains unprefixed
   (`prefixDefaultLocale: false`).
4. **New schema fields** must be mirrored in `src/content.config.ts`
   (zod), `scripts/validate-content.mjs`, and covered by
   `scripts/smoke-test.mjs`.
5. **CI gates unchanged**: `npm ci` → `validate` → `check` → `build` →
   `test:smoke`, deploy only on `main`.
6. **Canonical/SEO**: keep base-aware canonical in `BaseLayout`.

---

## 15. Phases

### A — Foundation (no visible UI change)

- Design tokens + self-hosted Sarabun font.
- Image audit + optimization pipeline; hero asset decision.
- Motion primitives + global reduced-motion guard; View Transitions spike
  (decision only).
- `getImpactTotals()` helper in `src/lib/content.ts`.
- Schema/validation groundwork for `featured` and optional project body.

### B — Homepage

- Cinematic Hero upgrade (scrim, evidence chips, scroll cue, Ken-Burns).
- Impact Strip (verified data).
- Featured Stories section.
- Header/footer polish (existing structure, no rearchitecture).

### C — Story surfaces

- Year Journey timeline on `/activities/`.
- Project Story Page (body + photo story).
- Gallery lightbox + captions.
- Search page keeps its inline-script pattern (no change expected).

### D — QA / Preview

- Accessibility pass (keyboard, focus, contrast, reduced-motion).
- EN parity check across new sections.
- Extend `smoke-test` for new sections + no-external-JS assertion.
- Lighthouse budgets; owner preview at GH Pages; merge → auto-deploy.

---

## 16. Exact component/file impact per phase

| Phase | Files |
| --- | --- |
| **A** | `src/styles/global.css` (tokens, fonts, reduced-motion), `src/layouts/BaseLayout.astro` (font links, view-transition meta), `src/components/MediaFigure.astro` (srcset/sizes, dimensions), `scripts/audit-images.mjs` *(new)*, `scripts/optimize-images.mjs` *(new)*, `scripts/validate-media.mjs` (alt warnings), `scripts/validate-content.mjs` (new fields), `src/content.config.ts` (`featured`, optional body), `src/lib/content.ts` (`getImpactTotals`) |
| **B** | `src/components/pages/HomePage.astro` (hero, impact strip, featured), `src/components/ProjectCard.astro` (featured variant), `src/i18n/index.ts` (new strings TH+EN), `public/media/brand/hero-banner.jpg` (replaced/optimized), `src/components/Footer.astro`/`Header.astro` (polish) |
| **C** | `src/components/pages/ActivitiesIndexPage.astro` (timeline), `src/components/pages/ProjectPage.astro` (story layout, body render), `src/components/Gallery.astro` (lightbox), `src/components/GalleryLightbox.astro` *(new)*, project `.md` files (optional bodies), `src/i18n/index.ts` (timeline/lightbox strings) |
| **D** | `scripts/smoke-test.mjs` (new sections, no-external-JS), `docs/HANDOFF-*.md`, `.github/workflows/deploy.yml` (unchanged unless budgets added) |

---

## 17. Acceptance gates and rollback

### Gates (all must pass before merge to `main`)

1. `npm run validate`, `npm run check`, `npm run build`, `npm run test:smoke`
   all exit 0 on the feature branch.
2. New image audit passes (total output ≤ 100 MB, per-page image budget).
3. No external JS bundles emitted (`dist` check in smoke test).
4. EN parity: every new UI string has TH + EN; content `_en` present or
   fallback asserted.
5. Keyboard + reduced-motion manual pass on: hero, timeline, gallery lightbox.
6. Owner visual acceptance on the GH Pages preview before merge.

### Rollback

- Deployment is `main`-only via GH Pages; **revert = `git revert` on `main`**
  (CI redeploys automatically). Keep WOW work on short-lived feature branches.
- Each phase is independently shippable (A is invisible, B is homepage-only),
  so a regression in a later phase does not block earlier value.
- Media optimization is additive (optimized copies alongside originals), so
  reverting the pipeline never breaks existing pages.

### View Transitions (Phase A spike — do not ship)

Astro's View Transitions API injects a client router script. That would break
the site's **zero-external-JS** posture. Phase A therefore does **not** enable
`<ClientRouter />` / `transition:animate`.

Phase B motion stays CSS-only (tokens + `prefers-reduced-motion` already in
`global.css`). An optional IntersectionObserver reveal may be added later as
an inline script, same pattern as search. Revisit View Transitions only if a
page-level transition is proven necessary and can be done without a persistent
JS bundle.
