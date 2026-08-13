# Local Runbook — Youth Next

How to set up, develop, validate, and build the static Astro site locally. This project has no PHP runtime, no public database, and no server-side state in Phase 1.

## Prerequisites

- Node.js 20+ (tested on Node 24)
- npm 10+
- Git (optional, for version control)
- A terminal that can run `npm` scripts

The legacy Joomla site lives at `D:\Server\root\youth` and must never be modified. The new app lives in `D:\Server\youth-next`.

## Install

```powershell
cd D:\Server\youth-next
npm install
```

This installs Astro, Tailwind CSS, TypeScript, and the validation tooling (`js-yaml`).

## Local development

```powershell
npm run dev
```

The dev server runs at `http://localhost:4321` and hot-reloads on change.

## Validation

Content and media are validated by standalone Node scripts that read the source content collections directly.

```powershell
npm run validate            # content + media
npm run validate:content    # content schema/slug/secret/PII checks only
npm run validate:media      # referenced /media/ file existence checks only
```

Rules enforced by `validate:content`:

- Published projects/activities must have `title`, `summary`, `cover`, `status`, and at least one **structured source/reference record** in `sources` (an object with `title` + `url`).
- `legacyUrls` are separate redirect paths (relative only) and do **not** satisfy the source/reference requirement.
- `year` is a Buddhist Era year between 2500 and 2700.
- `slug` is lowercase kebab-case and unique (projects: globally; activities: within `project` + `year`).
- `cover` and `gallery` paths start with `/media/`.
- `gallery` has no duplicate paths.
- `legacyUrls` are relative paths (start with `/`).
- Each `sources` record must have a non-empty `title` and a valid `url` (absolute `http(s)://` or site-relative `/`).
- Frontmatter must not contain likely secrets or PII (email addresses, phone numbers, keys named `password`/`token`/`secret`, private-key blocks, etc.).

Rules enforced by `validate:media`:

- Every `/media/` path referenced by content must exist under `public/`.
- Missing media is tolerated **only** if listed in `scripts/media-allowlist.json`.
- Once the allowlist entries are removed (as real media is migrated), any still-missing file fails validation.

## Type-checking and build

```powershell
npm run check    # validate + astro check (TypeScript/Astro diagnostics)
npm run build    # validate + static production build into dist/
```

Both `check` and `build` run the validation scripts first, so a broken content file fails before the build proceeds.

## Preview the production build

```powershell
npm run preview
```

Serves `dist/` locally (default port 4321). Use `npm run dev` during development and `npm run preview` to sanity-check the static output.

## Smoke tests

After a build, run the lightweight browser-level smoke tests (uses only Node's built-in `fetch` against `astro preview`; no test framework):

```powershell
npm run build
npm run test:smoke
```

This checks TH/EN navigation, the language switcher, search payload embedding, known pages, and 404 handling.

## TH/EN route conventions

The site is Thai-first. Thai is the default locale and uses unprefixed URLs; English uses the `/en/` prefix.

| Thai (default) | English |
| --- | --- |
| `/` | `/en/` |
| `/activities/` | `/en/activities/` |
| `/activities/2569/biochar-brand/` | `/en/activities/2569/biochar-brand/` |
| `/activities/2569/biochar-brand/activity-1/` | `/en/activities/2569/biochar-brand/activity-1/` |
| `/about/` | `/en/about/` |
| `/contact/` | `/en/contact/` |
| `/documents/` | `/en/documents/` |
| `/search/` | `/en/search/` |

Implementation notes:

- Route pages under `src/pages/` (Thai) and `src/pages/en/` (English) are thin wrappers around shared page components in `src/components/pages/`.
- UI text lives in `src/i18n/index.ts` (TH/EN dictionaries). Add or edit labels there.
- Content (`title`, `summary`) currently exists only in Thai. English pages show the Thai content until `title_en` / `summary_en` fields are added. Do **not** machine-translate project/activity content.

## Content authoring

Content lives in Astro content collections (Markdown + frontmatter):

- Projects: `src/content/projects/<year>/<slug>.md`
- Activities: `src/content/activities/<year>/<project>/<slug>.md`

A project example:

```yaml
title: "ยุวชนอาสาพัฒนาแบรนด์คนเอาถ่าน"
title_en: ""          # optional; omit until approved English exists
slug: "biochar-brand"
year: 2569
summary: "ยกระดับผลิตภัณฑ์ชีวภาพอินทรีย์สันนาเม็ง ..."
cover: "/media/projects/2569/biochar-brand/cover.jpg"
status: "published"   # or "draft"
sources:             # REQUIRED for published entries
  - title: "แหล่งอ้างอิงที่ได้รับการอนุมัติ"
    url: "https://example.com/source"
legacyUrls:          # optional redirect paths; NOT a source record
  - "/youth/index.php/activity/36-youth-biochar-2569"
order: 10
```

An activity example (note `project`, `sequence`, `eventDate`, `gallery`):

```yaml
title: "ประชาสัมพันธ์และรับสมัครนักศึกษา ..."
slug: "activity-1"
project: "biochar-brand"
year: 2569
sequence: 1
eventDate: "2026-07-05"
summary: "..."
cover: "/media/projects/2569/biochar-brand/activity-1/1.jpg"
gallery:
  - "/media/projects/2569/biochar-brand/activity-1/1.jpg"
  - "/media/projects/2569/biochar-brand/activity-1/2.jpg"
status: "published"
sources:             # REQUIRED for published entries
  - title: "แหล่งอ้างอิงที่ได้รับการอนุมัติ"
    url: "https://example.com/source"
legacyUrls:
  - "/youth/index.php/activity/36-youth-biochar-2569/76-activity-biochar-2569-1"
```

After editing content, re-run `npm run validate` and `npm run build`, then preview.

## Media placement

- Approved images go under `public/media/projects/<year>/<project>/<activity>/`.
- Optimised WebP/AVIF derivatives are recommended for the public site; keep original approved JPEGs outside the public folder or in an access-controlled archive.
- Every public image needs a descriptive Thai `alt` text (set from the entry title/summary or `gallery`).
- Never copy the legacy Joomla `images/` directory wholesale.

## Temporary placeholder / allowlist policy

- Until real media is migrated, the UI renders an accessible CSS placeholder for missing images (`MediaFigure.astro`) and validation tolerates the missing files only via `scripts/media-allowlist.json`.
- As each real file is added under `public/media/...`, remove its entry from the allowlist.
- When the allowlist is empty (or the file removed), any remaining missing media fails `npm run validate:media` (and therefore `check`/`build`).

## Rollback basics

- Every static release is reproducible from a Git commit + `npm run build`.
- To roll back: check out the last known-good commit and rebuild (`npm run build`), or swap the served `dist/` directory for the previous release.
- Keep the legacy `D:\Server\root\youth` untouched as the source of truth during migration.

## Commands cheat sheet

```powershell
npm install
npm run dev
npm run validate
npm run check
npm run build
npm run preview
npm run test:smoke
```
