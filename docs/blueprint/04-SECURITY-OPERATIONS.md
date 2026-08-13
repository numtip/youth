# 04 — Security and Operations

## Security baseline

- Static public site only: no PHP, runtime CMS, public database, server-side login, or file upload endpoint in Phase 1.
- Use HTTPS only in production; redirect HTTP to HTTPS.
- Nginx serves only the built `dist/` directory, with directory listing disabled.
- Set Content-Security-Policy, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and clickjacking protection appropriate to the final host.
- Set immutable caching for fingerprinted build assets and conservative caching for HTML.
- Do not store secrets in the repository, Markdown, JSON, `public/`, browser code, or `.env.example` values.
- Enable dependency update alerts and run dependency audit/checks in CI.
- Require protected main branch, pull-request review, and MFA for all repository administrators.

## Backups and recovery

- Keep source in private Git hosting with at least one protected remote backup.
- Back up approved media separately with version history.
- Archive a read-only copy of the legacy Joomla files/database before any cutover; do not expose this backup through the web server.
- Every deployment must be reproducible from a Git commit and the documented build command.
- Keep the prior static release so rollback is a directory/symlink switch, not a rebuild under pressure.

## CI quality gates

The deployment workflow should fail if any of these fail:

1. dependency installation with lockfile integrity;
2. TypeScript/Astro validation;
3. production build;
4. broken internal-link check;
5. content-schema validation;
6. image-path and MIME-type check;
7. basic accessibility check on the landing page and activity page;
8. secret scan.

## Local sandbox rules

- The legacy site remains at `D:\Server\root\youth`.
- The new app stays at `D:\Server\youth-next`.
- Its development server is separate from USB Webserver/Apache at port 80.
- Never point Apache's `/youth` alias to the new site until staging acceptance is complete.

