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

export async function getPublishedActivities() {
  const activities = await getCollection('activities', ({ data }) => data.status === 'published');
  return activities.sort((a, b) => {
    if (a.data.year !== b.data.year) return b.data.year - a.data.year;
    if (a.data.project !== b.data.project) return a.data.project.localeCompare(b.data.project);
    return a.data.sequence - b.data.sequence;
  });
}

export function formatEventDate(locale: Locale, date: Date): string {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
