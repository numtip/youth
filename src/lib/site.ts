/**
 * Site base-path helpers.
 *
 * The same source is built for two deployment targets:
 *   - local root: `base = '/'`         (dev/preview at http://localhost:4321)
 *   - GitHub Pages: `base = '/youth/'` (https://numtip.github.io/youth/)
 *
 * Astro exposes the configured `base` as `import.meta.env.BASE_URL`. Every
 * internal link and public asset URL must flow through `withBase`/`stripBase`
 * so nothing hard-codes a subpath like `/youth/`.
 */

const rawBase = import.meta.env.BASE_URL || '/';

/** Base path without a trailing slash: `''` at the root, `/youth` on a subpath. */
export const BASE_PATH = rawBase === '/' ? '' : rawBase.replace(/\/+$/, '');

/** Prepend the base path to a site-absolute path (which starts with `/`). */
export function withBase(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!BASE_PATH) return p;
  if (p === BASE_PATH || p.startsWith(`${BASE_PATH}/`)) return p;
  return `${BASE_PATH}${p}`;
}

/** Strip the base path from a URL pathname if it is present (idempotent). */
export function stripBase(pathname: string): string {
  if (!BASE_PATH) return pathname;
  if (pathname === BASE_PATH) return '/';
  if (pathname.startsWith(`${BASE_PATH}/`)) return pathname.slice(BASE_PATH.length);
  return pathname;
}
