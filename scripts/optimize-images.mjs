import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import sharp from 'sharp';
import { ROOT, toPublicPath } from './lib/content.mjs';

const PILOT_FILE = join(ROOT, 'scripts', 'image-pilot.json');
const REPORT_FILE = join(ROOT, 'scripts', 'image-pilot-report.json');
const OPTIMIZED_PREFIX = '/media/optimized/';

function formatBytes(n) {
  if (n >= 1_048_576) return `${(n / 1_048_576).toFixed(1)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${n} B`;
}

function derivativeSitePath(src) {
  if (!src.startsWith('/media/')) {
    throw new Error(`Refusing to optimize a non-/media/ path: ${src}`);
  }
  const rest = src.slice('/media/'.length).replace(/\.[^.]+$/, '.webp');
  return `${OPTIMIZED_PREFIX}${rest}`;
}

const args = new Set(process.argv.slice(2));
if (args.has('--all')) {
  console.error(
    'Refusing --all. Bulk conversion is gated on the Phase A pilot (scripts/image-pilot.json). ' +
      'Re-run without --all after the pilot report is accepted.',
  );
  process.exit(1);
}

if (!existsSync(PILOT_FILE)) {
  console.error(`Missing ${PILOT_FILE}`);
  process.exit(1);
}

const config = JSON.parse(readFileSync(PILOT_FILE, 'utf8'));
const maxWidth = Number(config.maxWidth) || 1600;
const quality = Number(config.quality) || 80;
const paths = Array.isArray(config.paths) ? config.paths : [];

if (paths.length === 0) {
  console.error('image-pilot.json has no paths.');
  process.exit(1);
}

const rows = [];

for (const src of paths) {
  const input = toPublicPath(src);
  if (!existsSync(input)) {
    console.error(`FAIL  missing original (left untouched, but cannot optimize): ${src}`);
    process.exit(1);
  }

  const before = statSync(input).size;
  const meta = await sharp(input, { failOn: 'none' }).metadata();
  const destSite = derivativeSitePath(src);
  const dest = toPublicPath(destSite);
  mkdirSync(dirname(dest), { recursive: true });

  await sharp(input, { failOn: 'none' })
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toFile(dest);

  const after = statSync(dest).size;
  const outMeta = await sharp(dest).metadata();
  const saved = before - after;
  const ratio = after / before;
  const ok = after < before && (outMeta.width ?? 0) > 0;

  rows.push({
    src,
    dest: destSite,
    beforeBytes: before,
    afterBytes: after,
    savedBytes: saved,
    ratio,
    inWidth: meta.width ?? null,
    inHeight: meta.height ?? null,
    outWidth: outMeta.width ?? null,
    outHeight: outMeta.height ?? null,
    formatIn: (extname(src).slice(1) || meta.format || '').toLowerCase(),
    formatOut: 'webp',
    ok,
  });

  console.log(
    `${ok ? 'PASS' : 'WARN'}  ${src}\n` +
      `       ${formatBytes(before)} ${meta.width}×${meta.height} → ${formatBytes(after)} ${outMeta.width}×${outMeta.height} webp` +
      `  (${ratio < 1 ? '−' : '+'}${Math.abs((1 - ratio) * 100).toFixed(0)}%)`,
  );
}

const beforeTotal = rows.reduce((s, r) => s + r.beforeBytes, 0);
const afterTotal = rows.reduce((s, r) => s + r.afterBytes, 0);
const allOk = rows.every((r) => r.ok);

const report = {
  generatedAt: new Date().toISOString(),
  maxWidth,
  quality,
  originalsUntouched: true,
  gate: {
    everyDerivativeSmaller: allOk,
    totalReduction: beforeTotal - afterTotal,
  },
  totals: { beforeBytes: beforeTotal, afterBytes: afterTotal, files: rows.length },
  files: rows,
};

writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2) + '\n');

console.log(
  `\nPilot totals: ${formatBytes(beforeTotal)} → ${formatBytes(afterTotal)} ` +
    `(${((1 - afterTotal / beforeTotal) * 100).toFixed(0)}% smaller). Originals untouched.`,
);
console.log(`Wrote ${REPORT_FILE}`);

if (!allOk) {
  console.error('\nPilot gate FAILED: at least one derivative is not smaller than its original.');
  process.exit(1);
}

console.log('\nPilot gate PASS — MediaFigure may consume /media/optimized/*.webp with original fallback.');
