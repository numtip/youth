# Youth Next — Daily Report 2026-08-14

Status: **complete** (2568 batch merged & live). Next session resumes with **2567**.

---

## 1. Summary

Delivered the GitHub Pages-first preview gate and the first historical
migration batch (latest live year **2568**) for the Youth Next static site.

```
Local validation → GitHub Actions quality gates → GitHub Pages preview → Live acceptance
```

Two pull requests were merged to `main` today:

| PR | Title | SHA (merge) |
| --- | --- | --- |
| [#1](https://github.com/numtip/youth/pull/1) | feat: add GitHub Pages preview with base-path support and CI gates | `6636e5d` |
| [#2](https://github.com/numtip/youth/pull/2) | feat(content): migrate 2568 legacy year (4 projects, 16 activities) | _(this report's merge)_ |

---

## 2. Phase 1 — Pages-first delivery (PR #1)

- `astro.config.mjs` reads `SITE_BASE`/`SITE_URL` from the environment; the same
  source builds for the local root (`base: '/'`) and the GitHub Pages subpath
  (`base: '/youth/'`).
- New `src/lib/site.ts` (`withBase`/`stripBase`) makes every internal link, media
  URL, language switcher, search result, and canonical URL base-path aware. No
  hard-coded `/youth/` anywhere in source.
- `src/i18n/index.ts`, `MediaFigure.astro`, and `BaseLayout.astro` updated to use
  the base-path helpers.
- `scripts/smoke-test.mjs` accepts `SITE_BASE` and asserts internal links carry
  the base path.
- New `.github/workflows/deploy.yml`: gates `npm ci` → `validate` → `check` →
  `build` → `test:smoke`, then uploads the Pages artifact and deploys via the
  official Pages Actions. Deploy only on `main`; PRs run gates only.

## 3. Phase 2 — historical migration, 2568 batch (PR #2)

Read-only inventory of the legacy Joomla site
(`https://researchex.mju.ac.th/youth/`, local mirror `D:\Server\root\youth`) via
three read-only subagents (menu/year/project/activity/URL inventory; visual
hierarchy/responsive audit; image & source-provenance inventory).

Migrated **4 projects + 16 activities** (verbatim Thai text, structured
`sources` pointing at origin URLs, original media copied — no hotlinking):

| Legacy Joomla URL | New slug | Activities |
| --- | --- | --- |
| `32-organic-vegetable2025` | `organic-vegetable` | 5 |
| `33-entrepreneurial-potential2025` | `entrepreneurial-potential` | 3 |
| `34-arabica-coffee-production` | `arabica-coffee` | 5 |
| `35-visit-mae-sai` | `visit-mae-sai` | 3 |

**Content/media counts**

| Item | Count |
| --- | --- |
| Projects (2568) | 4 |
| Activities (2568) | 16 |
| Gallery image references | 196 |
| Media files on disk (2568) | 200 (196 gallery + 4 covers) |
| Media size | ~29.9 MB |
| Total projects in repo (all years) | 6 |
| Total activities in repo (all years) | 18 |

**Data-quality notes (verbatim preservation)**

- Thai text preserved verbatim; no machine translation, no fabrication.
- Deduplicated one accidental repeated sentence in
  `organic-vegetable/activity-3`.
- `entrepreneurial-potential` uses the homepage card title (the category page
  carried the typo "ยุวอาสา").
- `arabica-coffee` legacy activity labels were misnumbered; re-sequenced 1–5 by
  article order.

## 4. Validation (local, exit code 0)

| Command | Result |
| --- | --- |
| `npm run validate` | PASS — 6 projects + 18 activities; 10 media allowlisted (2569 only) |
| `npm run check` | PASS — 0 errors / 0 warnings / 0 hints |
| `npm run build` (base `/`) | PASS — 62 static pages |
| `npm run test:smoke` (base `/`) | PASS — 23/23 |
| `npm run build` + smoke (`SITE_BASE=/youth/`) | PASS — 62 pages, 23/23, base `/youth` |
| `git diff --check` | PASS |

## 5. CI / deploy

- PR #2 CI: `build` job **pass** (all gates), `deploy` job **skip** (main-only).
- After merge to `main`, the Pages deployment ran and published the live site.

## 6. Remaining blockers (unchanged)

1. **10 media files** (2569) still missing and temporarily allowlisted.
2. **English content** pending approval — `title`/`summary` Thai-only; no machine
   translation.
3. **Nginx TH/EN deep-route 404** — deferred VPS gate, not verified by Pages.
4. **2567 + 2564 migration** — inventory complete, migration not yet started
   (next batch).

## 7. Safety boundaries

- Legacy Joomla `D:\Server\root\youth` read-only, untouched.
- No Apache / VPS / production changes.
- No media fabricated; no TH → EN machine translation.
