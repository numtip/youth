# Youth Next — Daily Report 2026-08-17

Status: **prepared** (2567+2564 batch validated locally; PR pending owner review).

## 1. Summary

Migrated the remaining legacy years (**2567** and **2564**) from the read-only
legacy Joomla site into the Youth Next content collections. Everything passes
local validation; the batch is ready for owner acceptance via PR.

## 2. What was migrated

| Year | Projects | Activities | Media files |
| --- | --- | --- | --- |
| 2567 | 2 | 10 | 83 |
| 2564 | 5 | 25 | 261 |
| **Total** | **7** | **35** | **344** |

Projects:
- 2567: `livestock-farmers`, `local-herbs` (each merged from two legacy
  category pages that split the same project)
- 2564: `eco-tourism-route`, `fish-hen-farming`, `smoke-haze-media`,
  `agri-innovation-nongyaeng`, `tourism-baophudin`

## 3. Process

- Read-only crawler over `researchex.mju.ac.th/youth/` (listing → category →
  sub-article pages), preserving verbatim Thai text and original image files.
- Widgetkit gallery-number junk stripped; leading `N.` numbering removed from
  activity titles; phone-like media filenames renamed to satisfy the PII check.
- Redirect map extended to **204 entries** (project + activity level, incl.
  previously missing 2568 mappings).
- Event dates parsed from Thai dates inside article text where available.

## 4. Validation (exit code 0)

| Command | Result |
| --- | --- |
| `npm run validate` | PASS — 13 projects + 53 activities |
| `npm run check` | PASS — 0 errors / 0 warnings / 0 hints |
| `npm run build` | PASS — 146 pages |
| `npm run test:smoke` | PASS — 23/23 |

## 5. Flags for owner

1. `livestock-farmers/activity-4` date corrected `2021-05-20` → `2024-05-20`.
2. Several 2564 activities carry the batch import date `2021-05-20` — confirm
   real event dates where it matters.
3. 2567 merge of legacy pages 28+30 / 29+31 into 2 projects — confirm.

## 6. Safety boundaries

- Legacy Joomla site untouched.
- No production/Apache/VPS changes.
- Deploy only on merge to `main`.
