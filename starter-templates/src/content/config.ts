// Copy to src/content.config.ts (Astro 6+ content layer) when bootstrapping a project.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const buddhistYear = z.number().int().min(2500).max(2700);
const kebabCase = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const relativeMediaPath = z.string().regex(/^\/media\//, 'Media must use a /media/ path');
const relativeLegacyPath = z.string().regex(/^\/youth\/index\.php\//, 'Legacy URLs must be local Joomla paths');

const referenceUrl = z
  .string()
  .refine((value) => /^(https?:\/\/|\/)/.test(value), 'Reference URL must be absolute http(s) or site-relative');

const reference = z.object({
  title: z.string().min(1),
  url: referenceUrl,
});

const baseFields = {
  title: z.string().min(1),
  title_en: z.string().min(1).optional(),
  summary: z.string().min(1),
  summary_en: z.string().min(1).optional(),
  slug: kebabCase,
  year: buddhistYear,
  cover: relativeMediaPath,
  status: z.enum(['draft', 'published']),
  legacyUrls: z.array(relativeLegacyPath).default([]),
  sources: z.array(reference).default([]),
};

const publishedNeedsReference = {
  message: 'Published items require at least one structured source/reference record in "sources"',
  path: ['sources'],
};

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.replace(/\.[^.]*$/, ''),
  }),
  schema: z
    .object({
      ...baseFields,
      order: z.number().int().positive(),
    })
    .refine((data) => data.status !== 'published' || data.sources.length > 0, publishedNeedsReference),
});

const activities = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/activities',
    generateId: ({ entry }) => entry.replace(/\.[^.]*$/, ''),
  }),
  schema: z
    .object({
      ...baseFields,
      project: kebabCase,
      sequence: z.number().int().positive(),
      eventDate: z.coerce.date(),
      gallery: z.array(relativeMediaPath).min(1),
    })
    .refine((data) => data.status !== 'published' || data.sources.length > 0, publishedNeedsReference),
});

export const collections = { activities, projects };
