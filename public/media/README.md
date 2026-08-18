# Public media

Do not copy Joomla's full `images/` directory here.

For each approved project:

1. Copy only approved source images into a deterministic project/activity path.
2. Keep the original approved JPEG outside the public folder or in an access-controlled archive.
3. Generate additive WebP derivatives with `npm run optimize:images` (pilot subset in `scripts/image-pilot.json`). Originals under this folder are never overwritten.
4. Ensure every public image has a descriptive Thai `alt` text in its content file.

Expected initial paths:

```text
public/media/projects/2569/biochar-brand/cover.jpg
public/media/projects/2569/biochar-brand/activity-1/1.jpg
public/media/projects/2569/aquatic-circular-economy/cover.jpg
public/media/projects/2569/aquatic-circular-economy/activity-1/1.jpg
```

