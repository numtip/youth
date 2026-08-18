# WOW-V1 Release Closeout — Youth in Action

**Release:** WOW-V1 — Youth in Action  
**Date:** 2026-08-18  
**Production commit:** `eb182f273e302ffaad4bd9cb88a76c3d259df4fc` (merge of PR #11)  
**GitHub Pages workflow:** [Deploy to GitHub Pages · run 32106667229](https://github.com/numtip/youth/actions/runs/32106667229) — build **SUCCESS**, deploy **SUCCESS**  
**Live URL:** https://numtip.github.io/youth/

---

## Phases completed

| Phase | Scope | Status |
|-------|-------|--------|
| A | Foundation (Astro static, TH/EN, `/youth/` base, content collections, smoke harness) | ✅ |
| B | Homepage (cinematic hero, impact totals, featured/latest stories) | ✅ |
| C | Story surfaces (project/activity pages, gallery/lightbox, search) | ✅ |
| D | QA/Launch (accessibility, performance, content parity, release hardening) | ✅ |

---

## Verified release metrics

| Metric | Value |
|--------|-------|
| Projects | 13 |
| Activities | 57 |
| Academic years | 4 (2569, 2568, 2567, 2564) |
| Referenced media | 585 |
| Static pages | 154 |
| Smoke (base `/`) | 43/43 |
| Smoke (base `/youth/`) | 43/43 |
| CSS at `/youth/` | 30,711 B (ceiling 34,816 B) |
| External JS | 0 |
| Build time | ~5–8 s |

---

## Acceptance summary

- **Accessibility P1:** closed (Phase D fixes merged in PR #11)
- **TH/EN parity:** pass (UI localized; activity Thai prose marked on EN pages)
- **Pages base-path (`/youth/`):** pass (internal links, lang switch, smoke at production base)
- **Live production spot-check:** pass (2026-08-18) — homepage, timeline, WebP/JPG heroes, gallery/lightbox, search, static pages, zero external JS

---

## Rollback

Revert the production merge commit on `main` and allow the GitHub Pages workflow to redeploy:

```bash
git revert eb182f273e302ffaad4bd9cb88a76c3d259df4fc
git push origin main
```

---

## Open P2 debt (NOT release blockers)

Canonical register: [`docs/YOUTH_WOW_V1_BLUEPRINT.md`](../YOUTH_WOW_V1_BLUEPRINT.md) § Phase D P2 debt.

Documented **P2 deviations** (open):

- Total static output 218.5 MB > 100 MB target
- 7 >1 MB images on `organic-vegetable` project page
- Gallery JSON blob duplication in photo-dense HTML
- TH `/search/` payload/HTML size marginally over budget
- Favicon pending owner brand asset
- Gallery semantic/a11y nuances (aria-live timing, figure-in-button)
- Legacy Joomla URL debt (52 activity pages)
- Locale-aware internal `sources` links (EN → TH project pages)
- Lightbox backdrop-click convenience bug
- Responsive `scroll-padding-top` mismatch vs header heights
- Unused `nav.home` i18n key
- Four activity pages with both legacy source links dead
- 404 language-switch `/404/` path behavior

**Out of scope for WOW-V1:** bulk media optimization, legacy redirect remodeling, favicon invention, gallery architecture rewrite, new features, View Transitions.
