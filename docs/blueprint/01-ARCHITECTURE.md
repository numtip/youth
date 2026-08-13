# 01 — Architecture

## Target architecture

```text
Author edits Markdown / JSON / CSV
            |
            v
Git repository + review
            |
            v
Astro build (CI or local build)
            |
            v
Static files in dist/
            |
            v
Nginx + HTTPS -> public visitors
```

The public site contains no PHP interpreter, no Joomla plug-ins, no writable public upload directory, and no open database connection. This eliminates the class of risks created by end-of-life Joomla/PHP extensions.

## Application layers

| Layer | Responsibility | Must not do |
| --- | --- | --- |
| `src/pages/` | Route pages and page composition | Store content directly in markup |
| `src/components/` | Reusable UI, accessibility, responsive behaviour | Query external data at render time without approval |
| `src/content/` | Markdown content collections with frontmatter | Contain executable code |
| `src/data/` | JSON/CSV indexes and configuration | Contain access keys or user credentials |
| `public/media/` | Optimised public images/PDFs | Allow browser uploads |
| `scripts/` | One-way import, validation, image optimisation | Mutate legacy Joomla data |
| `docs/` | Runbooks, mapping, data dictionary | Contain secrets |

## Route design

| New route | Role | Legacy source during migration |
| --- | --- | --- |
| `/` | Landing page | `index.php` |
| `/activities` | All projects by year | `index.php/activity` |
| `/activities/:year/:project` | Project activity listing | Joomla category URL |
| `/activities/:year/:project/:activity` | Activity details and gallery | Joomla article URL |
| `/documents` | Public documents | Document-download categories |
| `/search` | Client-side/static search | Joomla search |
| `/about`, `/contact` | Static information pages | Existing Joomla pages |

## Local development

- Project folder: `D:\Server\youth-next`
- Astro dev server: `http://localhost:4321`
- Legacy comparison site: `http://localhost/youth/`
- Do not put the development server behind the legacy Apache/PHP stack in Phase 1.
- For a static deployment test, build to `dist/` and serve it through a separate static host path. Only change the default site path after acceptance testing.

## Content ownership model

Phase 1 uses repository-managed content. An editor changes Markdown/JSON in a branch, receives review, and then deploys through CI. This is the safest model for a small public website.

If a browser-based editor is essential later, add an authenticated admin service as a separate Phase 2 boundary. It must use MFA/SSO, role-based permissions, audit logs, encrypted backups, and an API separated from the public static site. Do not reintroduce a general-purpose CMS merely to edit a few activity pages.

