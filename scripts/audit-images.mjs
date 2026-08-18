import { readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { ROOT } from './lib/content.mjs';

const MEDIA_ROOT = join(ROOT, 'public', 'media');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

function formatBytes(n) {
  if (n >= 1_048_576) return `${(n / 1_048_576).toFixed(1)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${n} B`;
}

function toSitePath(abs) {
  return `/${relative(join(ROOT, 'public'), abs).split('\\').join('/')}`;
}

function isOptimized(file) {
  const rel = relative(MEDIA_ROOT, file).split('\\').join('/');
  return rel === 'optimized' || rel.startsWith('optimized/');
}

const all = walk(MEDIA_ROOT).filter((p) => IMAGE_EXT.has(extname(p).toLowerCase()));
const originals = all.filter((p) => !isOptimized(p));
const optimized = all.filter((p) => isOptimized(p));

function summarize(files) {
  const byExt = new Map();
  let bytes = 0;
  const items = files.map((file) => {
    const size = statSync(file).size;
    bytes += size;
    const ext = extname(file).toLowerCase() || '(none)';
    const group = byExt.get(ext) ?? { count: 0, bytes: 0 };
    group.count += 1;
    group.bytes += size;
    byExt.set(ext, group);
    return { file, size, sitePath: toSitePath(file) };
  });
  items.sort((a, b) => b.size - a.size);
  return { items, bytes, byExt };
}

const orig = summarize(originals);
const deriv = summarize(optimized);

console.log('Image audit (public/media, originals only — optimized/ excluded)\n');
console.log(`Files: ${orig.items.length}`);
console.log(`Total: ${formatBytes(orig.bytes)} (${orig.bytes} bytes)`);
console.log('\nBy format:');
for (const [ext, g] of [...orig.byExt.entries()].sort((a, b) => b[1].bytes - a[1].bytes)) {
  console.log(`  ${ext.padEnd(8)} ${String(g.count).padStart(4)} files  ${formatBytes(g.bytes)}`);
}

console.log('\nLargest 15 originals:');
for (const item of orig.items.slice(0, 15)) {
  console.log(`  ${formatBytes(item.size).padStart(10)}  ${item.sitePath}`);
}

if (deriv.items.length) {
  console.log(`\nOptimized derivatives: ${deriv.items.length} files, ${formatBytes(deriv.bytes)}`);
} else {
  console.log('\nOptimized derivatives: none yet (run `npm run optimize:images`).');
}

const BUDGET_BYTES = 100 * 1024 * 1024;
if (orig.bytes > BUDGET_BYTES) {
  console.log(
    `\nNote: original media (${formatBytes(orig.bytes)}) exceeds the 100 MB Phase A budget. ` +
      'This audit does not fail the build; bulk conversion is gated on the pilot in scripts/image-pilot.json.',
  );
}

writeFileSync(
  join(ROOT, 'scripts', 'image-audit-report.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      originals: {
        count: orig.items.length,
        bytes: orig.bytes,
        byExt: Object.fromEntries(orig.byExt),
        largest: orig.items.slice(0, 15).map((i) => ({ path: i.sitePath, bytes: i.size })),
      },
      optimized: { count: deriv.items.length, bytes: deriv.bytes },
    },
    null,
    2,
  ) + '\n',
);

console.log('\nWrote scripts/image-audit-report.json');
