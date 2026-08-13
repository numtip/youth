import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { load } from 'js-yaml';

export const ROOT = resolve(process.cwd());

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function readFrontmatter(file) {
  const raw = readFileSync(file, 'utf8');
  const match = raw.match(FRONTMATTER_RE);
  if (!match) {
    return { data: null, body: raw, error: 'missing YAML frontmatter' };
  }
  try {
    return { data: load(match[1]) ?? {}, body: raw.slice(match[0].length) };
  } catch (err) {
    return { data: null, body: raw, error: `invalid YAML frontmatter: ${err.message}` };
  }
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else if (entry.name.endsWith('.md')) out.push(path);
  }
  return out;
}

/**
 * Load a content collection directory into entries with parsed frontmatter.
 * Returns [{ file (abs), rel (src/content/<name>-relative), data, body, error }].
 */
export function loadCollection(name) {
  const dir = join(ROOT, 'src', 'content', name);
  if (!existsSync(dir)) return [];
  const baseLen = join(ROOT, 'src', 'content', name).length + 1;
  return walk(dir).map((file) => {
    const rel = file.slice(baseLen).split(sep).join('/');
    const { data, body, error } = readFrontmatter(file);
    return { file, rel, data, body, error };
  });
}

/** Resolve a site-absolute path (leading slash) to a filesystem path under public/. */
export function toPublicPath(sitePath) {
  return join(ROOT, 'public', sitePath.replace(/^\/+/, ''));
}
