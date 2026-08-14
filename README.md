# Youth Next — Blueprint for the New Public Website

This folder is the starting point for rebuilding the Youth Volunteer website outside Joomla.

The target is a **static-first public website** based on the approach used by [goffice2026](https://github.com/numtip/goffice2026): Astro, TypeScript, Tailwind CSS, content stored as Markdown/JSON, and a static production deployment. It intentionally has no PHP runtime, no public database, and no Joomla extensions.

## Scope

- Keep the existing Joomla site at `D:\Server\root\youth` untouched during the rebuild.
- Build the new application in this folder: `D:\Server\youth-next`.
- Develop locally at `http://localhost:4321`.
- Reproduce public pages first: home, project activity listing, project detail, activity detail, documents, and search.
- Migrate historical content only after the page templates and data validation are accepted.

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Site generator | Astro (current stable) | Static output, fast page loads, small attack surface |
| Language | TypeScript (strict) | Safer data and component changes |
| Styling | Tailwind CSS | Reusable responsive design system |
| Content | Markdown + JSON/CSV | Versioned, reviewable, no public database required |
| Images/files | Local `public/media/` in development; object storage in production if needed | Simple migration path |
| Build/deploy | npm scripts + GitHub Actions | Repeatable release process |
| Production web server | Nginx + HTTPS | Serve static files only |

Use the repository only as a design and architecture reference. This new project must use current, compatible package releases; do not blindly copy its lockfile or credentials.

## Current status

As of 2026-08-14 the site is live at `https://numtip.github.io/youth/` (GitHub
Pages preview gate). Years migrated: **2568** (4 projects / 16 activities) and
**2569** (2 scaffolded projects). Next: **2567** and **2564**.

- Latest status: [`docs/HANDOFF-2026-08-14.md`](docs/HANDOFF-2026-08-14.md)
- Daily report: [`docs/reports/YOUTH_DAILY_REPORT_2026-08-14.md`](docs/reports/YOUTH_DAILY_REPORT_2026-08-14.md)

## Start with Cursor

Open `D:\Server\youth-next` in Cursor, then give the agent the contents of [CURSOR_AGENT_PROMPT.md](CURSOR_AGENT_PROMPT.md). The agent should read all files in `docs/blueprint/` before it creates application code.

## Local commands the completed project must support

```powershell
npm install
npm run dev
npm run check
npm run build
npm run preview
```

The development server should use port `4321`, producing `http://localhost:4321`. A later Apache/Nginx configuration can map the final static build to a path such as `http://localhost/youth-next/` or a production domain.

## Blueprint index

- [Architecture](docs/blueprint/01-ARCHITECTURE.md)
- [Content model](docs/blueprint/02-CONTENT-MODEL.md)
- [Migration plan](docs/blueprint/03-MIGRATION-PLAN.md)
- [Security and operations](docs/blueprint/04-SECURITY-OPERATIONS.md)
- [Delivery phases](docs/blueprint/05-DELIVERY-PLAN.md)
- [Cursor implementation brief](CURSOR_AGENT_PROMPT.md)

