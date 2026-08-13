# 05 — Delivery Plan

## Phase 0 — Blueprint and baseline

Deliverables: this blueprint, local project directory, content model, risk boundary, and Cursor implementation brief.

Exit criteria: stakeholders agree that the first release is public/static and that repository-managed content is acceptable.

## Phase 1 — Static public MVP

Deliverables: Astro application, responsive landing page, activity index, project/activity pages, gallery, search, Thai metadata, 2569 content, and local runbook.

Exit criteria: the new site works at `http://localhost:4321`, builds without Joomla/PHP, and is accepted against the 2569 content.

## Phase 2 — Historical migration

Deliverables: validated 2567–2568 content batches, media optimisation, redirect map, test report, and content-owner sign-off.

Exit criteria: agreed historical pages and images match the approved migration inventory; no editor shortcodes or legacy external links remain.

## Phase 3 — Staging and launch

Deliverables: Linux/Nginx staging, HTTPS, CI/CD, backups, security headers, monitoring, release/runbook, and redirects.

Exit criteria: functional, content, performance, accessibility, and rollback tests pass; the owner approves DNS/path cutover.

## Phase 4 — Optional editorial back office

Only do this after Phase 3 proves it is needed. Define editor roles, approval workflow, audit requirements, retention, MFA/SSO, and ownership before selecting a service. Keep it separate from the public website.

## Decisions needed from the owner before launch

1. Who may edit and approve public content?
2. Is Git/Markdown editing sufficient, or is an authenticated browser editor required?
3. Which historical years/documents must be public at launch?
4. What is the production domain, host owner, and HTTPS certificate owner?
5. Which legacy URLs must be permanently preserved?

