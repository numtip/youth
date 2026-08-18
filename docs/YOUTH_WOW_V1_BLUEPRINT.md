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

Measured on the Phase A exit (local `npm run build`):

| Budget | Target | Current (baseline) |
| --- | --- | --- |
| Total static output | ≤ 100 MB after optimization | ~221 MB |
| Max image per page (gallery) | ≤ 250 KB avg, ≤ 1 MB worst | up to 1.5 MB |
| CSS per page | ≤ 25 KB | 20.6 KB |
| JS (external) per page | 0 KB | 0 KB (inline only) |
| HTML per page | ≤ 40 KB | ~10–21 KB |
| `npm run build` time | ≤ 30 s | ~15 s |
| Lighthouse (mobile) | LCP ≤ 2.5 s, CLS ≤ 0.1 | not measured yet |

Budgets enforced by the new image audit script in CI; smoke test extended to
assert no external JS is emitted.

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
