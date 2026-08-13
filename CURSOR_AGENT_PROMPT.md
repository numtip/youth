# Cursor Agent Implementation Brief

You are implementing `Youth Next`, a public website replacing a legacy Joomla 3 site. Read every document in `docs/blueprint/` before changing files.

## Non-negotiable constraints

1. Work only inside `D:\Server\youth-next`. Never modify `D:\Server\root\youth`, its database, Apache configuration, or the legacy media folders.
2. Create a static-first Astro application using TypeScript strict mode and Tailwind CSS. Output must be static (`dist/`); do not introduce PHP, Joomla, WordPress, server-side sessions, or a public database in Phase 1.
3. The local development URL is `http://localhost:4321`.
4. Content is stored as validated Markdown/JSON/CSV under `src/content/` and `src/data/`. Do not hard-code project data in page components.
5. Preserve Thai text in UTF-8. All new public pages must use Thai as the primary language and meaningful image `alt` text.
6. Match the information architecture of the legacy public site, not its old styling. Build a modern responsive design with accessible keyboard navigation.
7. Do not import untrusted legacy PHP, database dumps, extensions, user accounts, passwords, or executable files.

## First implementation milestone

Build only these pages with the sample 2569 data included in this blueprint:

- `/` — landing page with 2569 projects before older years
- `/activities` — project index
- `/activities/2569/biochar-brand`
- `/activities/2569/aquatic-circular-economy`
- `/activities/2569/biochar-brand/activity-1`
- `/activities/2569/aquatic-circular-economy/activity-1`
- `/search`

## Required engineering work

- Set up Astro, Tailwind, TypeScript strict mode, ESLint/formatting, and static build scripts.
- Implement content collections and schemas specified in `02-CONTENT-MODEL.md`.
- Use `starter-templates/src/content/config.ts` as the starting content-collection schema, adapting it only when the documented model changes.
- Create reusable layout, header, footer, card, gallery, breadcrumb, activity-list, and search components.
- Import only the approved 2569 sample content and media paths shown in the blueprint. Use placeholder media only if source images have not been copied yet.
- Add validation: `npm run check` must run Astro/TypeScript checking; `npm run build` must succeed.
- Add a short `docs/LOCAL-RUNBOOK.md` explaining setup, build, preview, and where to edit content.

## Definition of done for the first milestone

- All listed routes render without a runtime backend.
- The landing page displays the two 2569 project cards before historical content.
- Image cards use a fixed 4:3 crop and responsive loading.
- Content is editable by changing files, rebuilding, and previewing locally.
- `npm run check` and `npm run build` pass.
- Report changed files, commands run, and any questions that require a human decision.
