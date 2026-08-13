# 02 — Content Model

## Collections

### Project

One project represents a category of activities for a year.

```yaml
title: "ยุวชนอาสาพัฒนาแบรนด์คนเอาถ่าน"
slug: "biochar-brand"
year: 2569
summary: "ยกระดับผลิตภัณฑ์ชีวภาพอินทรีย์สันนาเม็ง ด้วยนวัตกรรมแบรนด์และตลาดดิจิทัล"
cover: "/media/projects/2569/biochar-brand/cover.jpg"
status: "published"
legacyUrls:
  - "/youth/index.php/activity/36-youth-biochar-2569"
order: 10
```

### Activity

Every activity belongs to exactly one project.

```yaml
title: "ประชาสัมพันธ์และรับสมัครนักศึกษา พร้อมศึกษาข้อมูลวิสาหกิจชุมชนคนเอาถ่าน"
slug: "activity-1"
project: "biochar-brand"
year: 2569
sequence: 1
eventDate: "2026-07-05"
summary: "ประชาสัมพันธ์การเข้าร่วมโครงการและศึกษาข้อมูลเบื้องต้นของวิสาหกิจชุมชนคนเอาถ่าน"
cover: "/media/projects/2569/biochar-brand/activity-1/1.jpg"
gallery:
  - "/media/projects/2569/biochar-brand/activity-1/1.jpg"
  - "/media/projects/2569/biochar-brand/activity-1/2.jpg"
status: "published"
legacyUrls:
  - "/youth/index.php/activity/36-youth-biochar-2569/76-activity-biochar-2569-1"
```

### Document

Public documents must have a category, title, publishing date, file path, description, and optional project association. Private/internal documents must never be added to the static public repository.

## Required validation

- `year` is a Buddhist Era year between 2500 and 2700.
- `slug` is lowercase kebab-case and unique within its collection.
- Every published project/activity has a title, summary, cover, status, and at least one source/reference record.
- Every image path starts with `/media/` and exists before a production build.
- `gallery` contains no duplicate paths.
- `legacyUrls` are relative paths only; never accept arbitrary redirect targets.
- No frontmatter may contain passwords, access tokens, personally identifiable student data, or internal contact lists.

## Source of truth

The new content files become the source of truth after acceptance. Joomla remains read-only as a migration source until the cutover is complete.

