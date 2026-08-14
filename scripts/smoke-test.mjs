import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib/content.mjs';

const DIST = join(ROOT, 'dist');
const PORT = 4323;
const ORIGIN = `http://127.0.0.1:${PORT}`;

// Production base path. Must match the SITE_BASE used at build time so the
// preview server (and these checks) exercise the same route prefix.
// '' at the root, e.g. '/youth' for GitHub Pages.
const BASE_PATH = (process.env.SITE_BASE || '/').replace(/\/+$/, '') || '';

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('dist/ not found — run `npm run build` before `npm run test:smoke`.');
  process.exit(1);
}

const ASTRO_BIN = join(ROOT, 'node_modules', 'astro', 'bin', 'astro.mjs');
const child = spawn(process.execPath, [ASTRO_BIN, 'preview', '--port', String(PORT), '--host', '127.0.0.1'], {
  cwd: ROOT,
  stdio: ['ignore', 'pipe', 'pipe'],
});

let logs = '';
child.stdout.on('data', (d) => (logs += d.toString()));
child.stderr.on('data', (d) => (logs += d.toString()));

const results = [];

function record(name, ok, detail = '') {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}

function siteUrl(path) {
  return `${ORIGIN}${BASE_PATH}${path}`;
}

async function waitReady(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(siteUrl('/'));
      if (res.ok) return;
    } catch {
      // server not up yet
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error('preview server did not become ready.\n' + logs);
}

async function fetchHtml(path) {
  const res = await fetch(siteUrl(path));
  return { status: res.status, html: await res.text() };
}

async function checkRoute(path, marker, label = path) {
  const { status, html } = await fetchHtml(path);
  const ok = status === 200 && html.includes(marker);
  record(label, ok, ok ? '200' : `status ${status}, marker "${marker}"`);
  return html;
}

try {
  await waitReady();

  // TH routes
  await checkRoute('/', 'ยุวชนอาสา เพื่อการพัฒนาชุมชน', 'TH /');
  await checkRoute('/activities/', 'กิจกรรมทั้งหมด', 'TH /activities/');
  await checkRoute('/activities/2569/biochar-brand/', 'ยุวชนอาสาพัฒนาแบรนด์คนเอาถ่าน', 'TH /activities/2569/biochar-brand/');
  await checkRoute('/activities/2569/biochar-brand/activity-1/', 'ประชาสัมพันธ์และรับสมัครนักศึกษา', 'TH activity-1');
  await checkRoute('/about/', 'เกี่ยวกับเรา', 'TH /about/');
  await checkRoute('/contact/', 'ติดต่อเรา', 'TH /contact/');
  await checkRoute('/documents/', 'เอกสารสาธารณะ', 'TH /documents/');
  const thSearch = await checkRoute('/search/', 'ค้นหา', 'TH /search/');

  // EN routes
  await checkRoute('/en/', 'Youth Volunteers for Community Development', 'EN /en/');
  await checkRoute('/en/activities/', 'All activities', 'EN /en/activities/');
  await checkRoute('/en/activities/2569/biochar-brand/', 'ยุวชนอาสาพัฒนาแบรนด์คนเอาถ่าน', 'EN project (Thai content fallback)');
  await checkRoute('/en/activities/2569/biochar-brand/activity-1/', 'ประชาสัมพันธ์และรับสมัครนักศึกษา', 'EN activity-1');
  await checkRoute('/en/about/', 'About us', 'EN /en/about/');
  await checkRoute('/en/contact/', 'Contact us', 'EN /en/contact/');
  await checkRoute('/en/documents/', 'Public documents', 'EN /en/documents/');
  const enSearch = await checkRoute('/en/search/', 'Search', 'EN /en/search/');

  // Language switching links
  const thHome = await fetchHtml('/');
  const enHome = await fetchHtml('/en/');
  record(
    'lang switch: TH home links to EN',
    thHome.html.includes('hreflang="en"') && thHome.html.includes(`href="${BASE_PATH}/en/"`),
  );
  record(
    'lang switch: EN home links to TH',
    enHome.html.includes('hreflang="th"') && enHome.html.includes(`href="${BASE_PATH}/"`),
  );

  // Internal links must carry the production base path.
  record(
    'internal links use base path',
    thHome.html.includes(`href="${BASE_PATH}/activities/"`),
    `base="${BASE_PATH || '/'}"`,
  );

  // Search payload (client-side search data is embedded)
  record(
    'search: TH payload present',
    thSearch.includes('id="search-data"') && thSearch.includes('biochar-brand'),
  );
  record(
    'search: EN payload present',
    enSearch.includes('id="search-data"') && enSearch.includes('biochar-brand'),
  );

  // 404 for unknown route
  const nf = await fetchHtml('/this-route-does-not-exist-xyz/');
  record('404 for unknown TH route', nf.status === 404, `status ${nf.status}`);
  const nfEn = await fetchHtml('/en/this-route-does-not-exist-xyz/');
  record('404 for unknown EN route', nfEn.status === 404, `status ${nfEn.status}`);
} catch (err) {
  console.error('\nSmoke test error:', err.message);
} finally {
  child.kill();
}

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} smoke checks passed.`);
process.exit(failed ? 1 : 0);
