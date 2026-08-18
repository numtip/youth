import { loadCollection } from './lib/content.mjs';

const errors = [];

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MEDIA = /^\/media\//;
const STATUSES = new Set(['draft', 'published']);

// Field names that must never appear in public content frontmatter.
const SECRET_KEYS = /(password|passwd|secret|token|api[_-]?key|apikey|access[_-]?key|private[_-]?key|credential|auth)/i;
const PII_KEYS = /(email|e-?mail|phone|telephone|mobile|national[_-]?id|citizen[_-]?id|ssn|passport|student[_-]?id|address|birthdate|birthday|id[_-]?card|line[_-]?id|contact[_-]?list)/i;

// Likely-secret / PII value shapes.
const SECRET_VALUE_RE = /(-----BEGIN [A-Z ]*PRIVATE KEY-----|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,})/;
const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_RE = /(\+66[\s-]?\d{1,2}[\s-]?\d{3}[\s-]?\d{3,4}|0[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{3,4})/;

const isString = (v) => typeof v === 'string';
const nonEmpty = (v) => isString(v) && v.trim().length > 0;
const REFERENCE_URL_RE = /^(https?:\/\/|\/)/;

function addError(file, msg) {
  errors.push(`${file}: ${msg}`);
}

function scanSensitive(file, data) {
  for (const [key, value] of Object.entries(data)) {
    if (SECRET_KEYS.test(key)) addError(file, `field "${key}" is a likely secret field`);
    if (PII_KEYS.test(key)) addError(file, `field "${key}" is a likely PII field (personally identifiable data)`);
    if (isString(value)) {
      if (SECRET_VALUE_RE.test(value)) addError(file, `field "${key}" contains a likely secret value`);
      if (EMAIL_RE.test(value)) addError(file, `field "${key}" contains an email address (PII)`);
      if (PHONE_RE.test(value)) addError(file, `field "${key}" contains a phone number (PII)`);
    }
  }
}

function checkCommon(entry, kind) {
  const file = `${kind} ${entry.rel}`;
  if (entry.error) {
    addError(file, entry.error);
    return undefined;
  }
  const d = entry.data;
  if (!d || typeof d !== 'object') {
    addError(file, 'no frontmatter data');
    return undefined;
  }

  for (const field of ['title', 'summary', 'cover', 'status', 'year', 'slug']) {
    if (!(field in d)) addError(file, `missing required field "${field}"`);
  }

  if ('title' in d && !nonEmpty(d.title)) addError(file, 'title must be a non-empty string');
  if ('summary' in d && !nonEmpty(d.summary)) addError(file, 'summary must be a non-empty string');

  if ('year' in d) {
    if (!Number.isInteger(d.year)) addError(file, `year must be an integer (Buddhist Era), got ${JSON.stringify(d.year)}`);
    else if (d.year < 2500 || d.year > 2700) addError(file, `year ${d.year} is outside the Buddhist Era range 2500–2700`);
  }

  if ('slug' in d && isString(d.slug) && !KEBAB.test(d.slug)) {
    addError(file, `slug "${d.slug}" is not lowercase kebab-case`);
  }

  if ('cover' in d && isString(d.cover) && !MEDIA.test(d.cover)) {
    addError(file, `cover "${d.cover}" must start with /media/`);
  }

  if ('status' in d && !STATUSES.has(d.status)) {
    addError(file, `status "${d.status}" must be "draft" or "published"`);
  }

  if ('legacyUrls' in d) {
    if (!Array.isArray(d.legacyUrls)) addError(file, 'legacyUrls must be an array');
    else {
      for (const u of d.legacyUrls) {
        if (!isString(u) || !u.startsWith('/')) {
          addError(file, `legacyUrls entry ${JSON.stringify(u)} must be a relative path (starting with /)`);
        }
      }
    }
  }

  // sources: an array of structured source/reference records ({ title, url }).
  if ('sources' in d) {
    if (!Array.isArray(d.sources)) {
      addError(file, 'sources must be an array of { title, url } records');
    } else {
      d.sources.forEach((s, i) => {
        if (!s || typeof s !== 'object' || Array.isArray(s)) {
          addError(file, `sources[${i}] must be an object with "title" and "url"`);
          return;
        }
        if (!nonEmpty(s.title)) addError(file, `sources[${i}].title must be a non-empty string`);
        if (!isString(s.url) || !REFERENCE_URL_RE.test(s.url)) {
          addError(file, `sources[${i}].url must be an absolute http(s) or site-relative (/) URL`);
        }
      });
    }
  }

  if (d.status === 'published') {
    // Blueprint: at least one *structured* source/reference record is required.
    // legacyUrls (relative redirect paths) do not satisfy this requirement.
    const hasSources = Array.isArray(d.sources) && d.sources.length > 0;
    if (!hasSources) {
      addError(file, 'published entry is missing required field "sources": at least one structured source/reference record ({ title, url }) is required');
    }
  }

  scanSensitive(file, d);
  return d;
}

function checkProject(entry) {
  const d = checkCommon(entry, 'project');
  if (!d) return;
  const file = `project ${entry.rel}`;
  if ('order' in d && (!Number.isInteger(d.order) || d.order <= 0)) {
    addError(file, `order must be a positive integer, got ${JSON.stringify(d.order)}`);
  }
  if ('featured' in d && typeof d.featured !== 'boolean') {
    addError(file, `featured must be a boolean, got ${JSON.stringify(d.featured)}`);
  }
}

function checkActivity(entry) {
  const d = checkCommon(entry, 'activity');
  if (!d) return;
  const file = `activity ${entry.rel}`;

  if (!nonEmpty(d.project)) addError(file, 'project must be a non-empty string');
  else if (!KEBAB.test(d.project)) addError(file, `project "${d.project}" is not lowercase kebab-case`);

  if ('sequence' in d && (!Number.isInteger(d.sequence) || d.sequence <= 0)) {
    addError(file, `sequence must be a positive integer, got ${JSON.stringify(d.sequence)}`);
  }

  if ('eventDate' in d) {
    if (!isString(d.eventDate) || Number.isNaN(new Date(d.eventDate).getTime())) {
      addError(file, `eventDate ${JSON.stringify(d.eventDate)} is not a valid date`);
    }
  }

  if ('gallery' in d) {
    if (!Array.isArray(d.gallery)) addError(file, 'gallery must be an array');
    else {
      const seen = new Set();
      for (const g of d.gallery) {
        if (!isString(g) || !MEDIA.test(g)) addError(file, `gallery entry ${JSON.stringify(g)} must start with /media/`);
        if (seen.has(g)) addError(file, `duplicate gallery path "${g}"`);
        seen.add(g);
      }
    }
  }
}

const projects = loadCollection('projects');
const activities = loadCollection('activities');

for (const p of projects) checkProject(p);
for (const a of activities) checkActivity(a);

// Slug uniqueness: projects are globally unique; activities are unique within (project, year).
const projectSlugs = new Map();
for (const p of projects) {
  const slug = p.data?.slug;
  if (typeof slug !== 'string') continue;
  if (projectSlugs.has(slug)) addError(`project ${p.rel}`, `duplicate project slug "${slug}"`);
  else projectSlugs.set(slug, p.rel);
}

const activitySlugs = new Map();
for (const a of activities) {
  const { project, year, slug } = a.data ?? {};
  if (typeof slug !== 'string' || typeof project !== 'string' || year === undefined) continue;
  const key = `${project}|${year}|${slug}`;
  if (activitySlugs.has(key)) {
    addError(`activity ${a.rel}`, `duplicate activity slug "${slug}" within project "${project}" year ${year}`);
  } else {
    activitySlugs.set(key, a.rel);
  }
}

console.log(`Content validation: ${projects.length} project(s), ${activities.length} activity/activities scanned.`);

if (errors.length) {
  console.error(`\nErrors (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('\nContent validation FAILED.');
  process.exit(1);
}

console.log('Content validation passed.');
