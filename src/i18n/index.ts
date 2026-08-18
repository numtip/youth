import { stripBase, withBase } from '../lib/site';

export const locales = ['th', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'th';

export interface Ui {
  siteName: string;
  siteTagline: string;
  skipToContent: string;
  nav: {
    home: string;
    primaryLabel: string;
    languageLabel: string;
    activities: string;
    documents: string;
    about: string;
    contact: string;
    search: string;
  };
  lang: { th: string; en: string };
  hero: { title: string; subtitle: string; cta: string };
  home: {
    latest: string;
    viewAll: string;
    empty: string;
    featured: string;
    impact: {
      projects: string;
      activities: string;
      years: string;
      photos: string;
    };
  };
  activities: { title: string; subtitle: string; year: string; empty: string; journeyLabel: string };
  project: { activities: string; empty: string; back: string };
  activity: { details: string; gallery: string; sources: string; date: string; sequence: string; back: string };
  gallery: {
    dialogLabel: string;
    view: string;
    close: string;
    prev: string;
    next: string;
  };
  documents: { title: string; subtitle: string; empty: string };
  about: { title: string; intro: string };
  contact: { title: string; intro: string };
  search: { title: string; placeholder: string; button: string; initial: string; empty: string; results: string };
  notFound: { title: string; message: string; back: string };
  breadcrumbs: { home: string; label: string };
  footer: { tagline: string; rights: string };
  meta: { description: string };
}

export const ui: Record<Locale, Ui> = {
  th: {
    siteName: 'ยุวชนอาสา มหาวิทยาลัยแม่โจ้',
    siteTagline: 'โครงการยุวชนอาสา มหาวิทยาลัยแม่โจ้ เพื่อการพัฒนาชุมชนท้องถิ่น',
    skipToContent: 'ข้ามไปยังเนื้อหา',
    nav: {
      home: 'หน้าแรก',
      primaryLabel: 'เมนูหลัก',
      languageLabel: 'เลือกภาษา',
      activities: 'กิจกรรม',
      documents: 'เอกสาร',
      about: 'เกี่ยวกับเรา',
      contact: 'ติดต่อเรา',
      search: 'ค้นหา',
    },
    lang: { th: 'ไทย', en: 'EN' },
    hero: {
      title: 'ยุวชนอาสา มหาวิทยาลัยแม่โจ้ เพื่อการพัฒนาชุมชน',
      subtitle: 'ร่วมเรียนรู้และลงมือพัฒนาผลิตภัณฑ์และเศรษฐกิจท้องถิ่น ผ่านโครงการยุวชนอาสาของมหาวิทยาลัย',
      cta: 'ดูกิจกรรมทั้งหมด',
    },
    home: {
      latest: 'โครงการล่าสุด',
      viewAll: 'ดูกิจกรรมทั้งหมด',
      empty: 'ยังไม่มีโครงการที่เผยแพร่',
      featured: 'เรื่องเด่น',
      impact: {
        projects: 'โครงการ',
        activities: 'กิจกรรม',
        years: 'ปีการศึกษา',
        photos: 'ภาพถ่าย',
      },
    },
    activities: {
      title: 'กิจกรรมทั้งหมด',
      subtitle: 'รวมโครงการและกิจกรรมยุวชนอาสา เรียงตามปีการศึกษา',
      year: 'ปี',
      empty: 'ยังไม่มีกิจกรรมที่เผยแพร่',
      journeyLabel: 'เส้นทางโครงการตามปีการศึกษา',
    },
    gallery: {
      dialogLabel: 'แกลเลอรีภาพ',
      view: 'ดูภาพ',
      close: 'ปิด',
      prev: 'ภาพก่อนหน้า',
      next: 'ภาพถัดไป',
    },
    project: {
      activities: 'กิจกรรมในโครงการ',
      empty: 'ยังไม่มีกิจกรรมในโครงการนี้',
      back: 'กลับไปหน้ากิจกรรมทั้งหมด',
    },
    activity: {
      details: 'รายละเอียดกิจกรรม',
      gallery: 'แกลเลอรีภาพ',
      sources: 'แหล่งอ้างอิง',
      date: 'วันที่จัดกิจกรรม',
      sequence: 'ลำดับกิจกรรม',
      back: 'กลับไปหน้าโครงการ',
    },
    documents: {
      title: 'เอกสารสาธารณะ',
      subtitle: 'ดาวน์โหลดเอกสารสาธารณะของโครงการ',
      empty: 'ยังไม่มีเอกสารสาธารณะในขณะนี้',
    },
    about: {
      title: 'เกี่ยวกับเรา',
      intro:
        'เว็บไซต์นี้เผยแพร่โครงการและกิจกรรมยุวชนอาสา เพื่อสนับสนุนการพัฒนาชุมชนท้องถิ่น ผ่านการมีส่วนร่วมของนักศึกษา อาจารย์ และภาคีในพื้นที่',
    },
    contact: {
      title: 'ติดต่อเรา',
      intro:
        'สำหรับข้อมูลเพิ่มเติมเกี่ยวกับโครงการและกิจกรรม กรุณาติดต่อหน่วยงานที่เกี่ยวข้องของแต่ละโครงการ ข้อมูลติดต่ออย่างเป็นทางการจะเผยแพร่เมื่อพร้อม',
    },
    search: {
      title: 'ค้นหา',
      placeholder: 'ค้นหาโครงการหรือกิจกรรม...',
      button: 'ค้นหา',
      initial: 'พิมพ์คำค้นหาเพื่อค้นหาโครงการหรือกิจกรรม',
      empty: 'ไม่พบผลลัพธ์สำหรับคำค้นหานี้',
      results: '{count} ผลลัพธ์',
    },
    notFound: {
      title: 'ไม่พบหน้านี้',
      message: 'หน้าที่คุณค้นหาไม่มีอยู่ หรือถูกย้ายไปแล้ว',
      back: 'กลับสู่หน้าแรก',
    },
    breadcrumbs: { home: 'หน้าแรก', label: 'เส้นทางนำทาง' },
    footer: { tagline: 'เผยแพร่โครงการและกิจกรรมยุวชนอาสา มหาวิทยาลัยแม่โจ้', rights: 'สงวนลิขสิทธิ์' },
    meta: { description: 'โครงการและกิจกรรมยุวชนอาสา มหาวิทยาลัยแม่โจ้ เพื่อการพัฒนาชุมชนท้องถิ่น' },
  },
  en: {
    siteName: 'Youth Volunteers, Maejo University',
    siteTagline: 'Youth volunteer projects of Maejo University for local community development',
    skipToContent: 'Skip to content',
    nav: {
      home: 'Home',
      primaryLabel: 'Main navigation',
      languageLabel: 'Select language',
      activities: 'Activities',
      documents: 'Documents',
      about: 'About',
      contact: 'Contact',
      search: 'Search',
    },
    lang: { th: 'ไทย', en: 'EN' },
    hero: {
      title: 'Youth Volunteers of Maejo University for Community Development',
      subtitle:
        'Learn and take action to develop local products and economy through university youth volunteer projects.',
      cta: 'View all activities',
    },
    home: {
      latest: 'Latest projects',
      viewAll: 'View all activities',
      empty: 'No published projects yet',
      featured: 'Featured stories',
      impact: {
        projects: 'Projects',
        activities: 'Activities',
        years: 'Academic years',
        photos: 'Photos',
      },
    },
    activities: {
      title: 'All activities',
      subtitle: 'All youth volunteer projects and activities, ordered by academic year',
      year: 'Year',
      empty: 'No published activities yet',
      journeyLabel: 'Project journey by academic year',
    },
    gallery: {
      dialogLabel: 'Photo gallery',
      view: 'View photo',
      close: 'Close',
      prev: 'Previous photo',
      next: 'Next photo',
    },
    project: {
      activities: 'Project activities',
      empty: 'No activities in this project yet',
      back: 'Back to all activities',
    },
    activity: {
      details: 'Activity details',
      gallery: 'Photo gallery',
      sources: 'Sources',
      date: 'Event date',
      sequence: 'Activity sequence',
      back: 'Back to project',
    },
    documents: {
      title: 'Public documents',
      subtitle: 'Download public project documents',
      empty: 'No public documents available yet',
    },
    about: {
      title: 'About us',
      intro:
        'This site publishes youth volunteer projects and activities to support local community development through the participation of students, lecturers, and local partners.',
    },
    contact: {
      title: 'Contact us',
      intro:
        'For more information about projects and activities, please contact the office responsible for each project. Official contact details will be published when available.',
    },
    search: {
      title: 'Search',
      placeholder: 'Search projects or activities...',
      button: 'Search',
      initial: 'Type a query to search projects or activities',
      empty: 'No results found for this query',
      results: '{count} results',
    },
    notFound: {
      title: 'Page not found',
      message: 'The page you are looking for does not exist or has been moved.',
      back: 'Back to home',
    },
    breadcrumbs: { home: 'Home', label: 'Breadcrumb' },
    footer: { tagline: 'Publishing Maejo University youth volunteer projects and activities', rights: 'All rights reserved' },
    meta: { description: 'Youth volunteer projects and activities of Maejo University for local community development' },
  },
};

export function getLocale(value: string | undefined): Locale {
  return value === 'en' ? 'en' : defaultLocale;
}

export function useTranslations(locale: Locale): Ui {
  return ui[locale];
}

/**
 * Build a locale-aware href for a site-relative path (no leading locale prefix).
 * Thai routes stay unprefixed; English routes get an `/en` prefix. The result
 * is prefixed with the configured base so it works on a Pages subpath too.
 */
export function localeHref(locale: Locale, path = ''): string {
  const seg = path.replace(/^\/+|\/+$/g, '');
  const base = seg ? `/${seg}/` : '/';
  const localized = locale === 'en' ? (base === '/' ? '/en/' : `/en${base}`) : base;
  return withBase(localized);
}

/**
 * Translate the current pathname to the equivalent pathname in another locale.
 * Strips the base path and an existing `/en` prefix, then re-applies the target
 * locale and base.
 */
export function getLocalizedPathname(pathname: string, locale: Locale): string {
  let path = stripBase(pathname).replace(/^\/en(?=\/|$)/, '');
  if (!path.startsWith('/')) path = '/' + path;
  if (path !== '/' && !path.endsWith('/')) path += '/';
  const localized = locale === 'en' ? (path === '/' ? '/en/' : `/en${path}`) : path;
  return withBase(localized);
}
