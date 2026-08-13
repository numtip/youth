# 03 — Migration Plan

## Principles

1. Copy, validate, and compare. Never migrate by deleting or editing the legacy Joomla data.
2. Use only approved content and images. Quarantine `.jpa`, `.rar`, executable files, old plug-ins, and database credentials.
3. Preserve public URLs via a reviewed redirect map.
4. Migrate in small batches and obtain content-owner approval before publish.

## Inventory to create first

| Asset | Legacy source | New target |
| --- | --- | --- |
| Categories | `yu_categories` | project Markdown collection |
| Articles | `yu_content` | activity Markdown collection |
| Article images | Joomla `images/` | `public/media/projects/` |
| Documents | Joomla media/download folders | `public/media/documents/` |
| Landing cards | Widgetkit records | project cards built from project content |
| URLs | menu/category/article aliases | `data/legacy-redirects.json` |

## Migration stages

### Stage A — Clean inventory

- Export category and article metadata to a CSV/JSON report.
- List each image/document with filename, dimensions, source path, owning project, and rights/approval status.
- Identify broken external links and remove/replace them instead of carrying them forward.

### Stage B — Content normalisation

- Convert HTML intro text and full text to semantic Markdown.
- Remove editor-specific shortcodes such as Widgetkit references.
- Convert image galleries to the `gallery` field.
- Correct titles, Thai spacing, publishing dates, and missing alternative text with content-owner review.

### Stage C — Media preparation

- Copy approved images to a deterministic path: `public/media/projects/<year>/<project>/<activity>/`.
- Generate WebP/AVIF derivatives and keep the original approved JPEG only when needed.
- Set a fixed responsive card aspect ratio (4:3) and preserve uncropped originals for activity galleries.
- Reject oversized images and files with unsupported MIME types.

### Stage D — Redirects and acceptance

- Build `legacy-redirects.json` from reviewed mappings.
- Test each redirect locally and in staging.
- Compare page title, activity text, number of gallery images, and document links against the legacy site.
- Receive sign-off before publishing and retain an immutable legacy backup.

## Initial 2569 mapping

| New route | Existing local URL |
| --- | --- |
| `/activities/2569/biochar-brand` | `/youth/index.php/activity/36-youth-biochar-2569` |
| `/activities/2569/aquatic-circular-economy` | `/youth/index.php/activity/37-youth-aquatic-2569` |
| `/activities/2569/biochar-brand/activity-1` | `/youth/index.php/activity/36-youth-biochar-2569/76-activity-biochar-2569-1` |
| `/activities/2569/aquatic-circular-economy/activity-1` | `/youth/index.php/activity/37-youth-aquatic-2569/79-activity-aquatic-2569-1` |

