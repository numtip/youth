import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadCollection, toPublicPath, ROOT } from './lib/content.mjs';

const ALLOWLIST_FILE = join(ROOT, 'scripts', 'media-allowlist.json');

let allowlist = [];
if (existsSync(ALLOWLIST_FILE)) {
  const raw = JSON.parse(readFileSync(ALLOWLIST_FILE, 'utf8'));
  allowlist = Array.isArray(raw) ? raw : (raw.paths ?? []);
} else {
  console.warn('No media-allowlist.json found — all missing media will be treated as errors.');
}

const allowSet = new Set(allowlist);

// Collect every /media/ path referenced by content (cover + gallery).
const referenced = new Set();
for (const entry of [...loadCollection('projects'), ...loadCollection('activities')]) {
  const d = entry.data;
  if (!d) continue;
  if (typeof d.cover === 'string') referenced.add(d.cover);
  if (Array.isArray(d.gallery)) {
    for (const g of d.gallery) if (typeof g === 'string') referenced.add(g);
  }
}

const errors = [];
const warnings = [];
const missing = [];

for (const ref of [...referenced].sort()) {
  if (!existsSync(toPublicPath(ref))) {
    missing.push(ref);
    if (allowSet.has(ref)) {
      warnings.push(`missing media (temporarily allowlisted): ${ref}`);
    } else {
      errors.push(`missing media file not in allowlist: ${ref}`);
    }
  }
}

for (const a of allowlist) {
  if (!referenced.has(a)) warnings.push(`allowlist entry is not referenced by any content: ${a}`);
}

console.log(`Media validation: ${referenced.size} unique /media/ path(s) referenced.`);

if (missing.length) {
  console.log(`\nMissing media (${missing.length}):`);
  for (const m of missing) console.log(`  - ${m}`);
}

if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  for (const w of warnings) console.log(`  - ${w}`);
}

if (errors.length) {
  console.error(`\nErrors (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('\nMedia validation FAILED. Add the real files, or (temporarily) list them in scripts/media-allowlist.json.');
  process.exit(1);
}

if (allowSet.size > 0) {
  console.log(
    `\nNote: ${allowSet.size} path(s) are on the temporary media allowlist. ` +
      'Remove the allowlist (or its entries) once real media is migrated; missing media will then fail validation.',
  );
}

console.log('Media validation passed.');
