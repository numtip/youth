import { getCollection } from 'astro:content';
import type { Locale } from '../i18n';

export type LocalizableData = {
  title: string;
  title_en?: string;
  summary: string;
  summary_en?: string;
};

/**
 * Return the Thai value unless the current locale is English and an
 * approved English translation exists. Content currently exists only in
 * Thai, so this falls back to Thai until English fields are added.
 */
export function localizeText(locale: Locale, th: string, en?: string): string {
  return locale === 'en' && en ? en : th;
}

export function localizeEntry<T extends LocalizableData>(
  locale: Locale,
  data: T,
): { title: string; summary: string } {
  return {
    title: localizeText(locale, data.title, data.title_en),
    summary: localizeText(locale, data.summary, data.summary_en),
  };
}

export async function getPublishedProjects() {
  const projects = await getCollection('projects', ({ data }) => data.status === 'published');
  return projects.sort((a, b) => {
    if (a.data.year !== b.data.year) return b.data.year - a.data.year;
    return a.data.order - b.data.order;
  });
}

/** Published projects flagged `featured: true`, in the same year/order sort. */
export async function getFeaturedProjects() {
  const projects = await getPublishedProjects();
  return projects.filter((project) => project.data.featured === true);
}

export async function getPublishedActivities() {
  const activities = await getCollection('activities', ({ data }) => data.status === 'published');
  return activities.sort((a, b) => {
    if (a.data.year !== b.data.year) return b.data.year - a.data.year;
    if (a.data.project !== b.data.project) return a.data.project.localeCompare(b.data.project);
    return a.data.sequence - b.data.sequence;
  });
}

export type ImpactTotals = {
  projects: number;
  activities: number;
  years: number;
  media: number;
};

/**
 * Build-time aggregates from published collections only.
 * Never hard-code these numbers in templates — call this helper.
 */
export async function getImpactTotals(): Promise<ImpactTotals> {
  const projects = await getPublishedProjects();
  const activities = await getPublishedActivities();
  const years = new Set<number>();
  const media = new Set<string>();

  for (const project of projects) {
    years.add(project.data.year);
    media.add(project.data.cover);
  }
  for (const activity of activities) {
    years.add(activity.data.year);
    media.add(activity.data.cover);
    for (const src of activity.data.gallery) media.add(src);
  }

  return {
    projects: projects.length,
    activities: activities.length,
    years: years.size,
    media: media.size,
  };
}

export function formatEventDate(locale: Locale, date: Date): string {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
