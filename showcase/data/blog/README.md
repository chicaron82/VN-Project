# Timeline Data Structure

This directory contains the refactored timeline data for the UV7 Showcase, split into individual entry files for better maintainability.

## Structure

```text
timeline/
├── entries/
│   ├── 2026/          # Timeline entries from 2026
│   │   ├── 2026-01-30-phase-85.ts
│   │   ├── 2026-01-29-shell-routing.ts
│   │   └── ... (63 total files)
│   └── 2025/          # Timeline entries from 2025
│       ├── 2025-11-25-post-launch-polish.ts
│       ├── 2025-10-15-applebees-tether.ts
│       └── ... (5 total files)
├── types.ts           # All TypeScript interfaces (TimelineEntry, MediaCarouselItem, etc.)
└── index.ts           # Aggregates all entries and exports timelineData array
```

## Usage

Import from the timeline directory (not individual files):

```typescript
import { TIMELINE_DATA, timelineData, type TimelineEntry } from '../../data/timeline';
```

This imports from `index.ts`, which re-exports all types and provides the combined timeline data.

## Adding New Entries

### Manual Method

1. Create a new file in the appropriate year folder (e.g., `entries/2026/2026-02-01-my-new-entry.ts`)
2. Use this template:

```typescript
import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    "id": "2026-02-01-a",
    "date": "February 1, 2026",
    "emoji": "🎯",
    "title": "My New Entry",
    "type": "highlight",
    "summary": "Brief description...",
    "features": [
        "Feature 1",
        "Feature 2"
    ],
    "sortDate": "2026-02-01T10:00:00"
};
```

1. Add the import and entry to `index.ts`:

```typescript
// Add to imports section
import { entry as entry68 } from './entries/2026/2026-02-01-my-new-entry';

// Add to timelineData array (at the top for newest entries)
export const timelineData: TimelineEntry[] = [
    entry68,  // <- Add here
    entry0,
    entry1,
    // ...
];
```

### Automated Method (Future)

A script can be created to:

- Parse a new entry from JSON
- Generate the filename based on date and title
- Create the `.ts` file
- Update `index.ts` automatically

## File Naming Convention

- **Dated entries**: `YYYY-MM-DD-slug.ts` (e.g., `2026-01-25-a.ts`)
- **Duplicate dates**: Append `-1`, `-2`, etc. (e.g., `2026-01-12-a-1.ts`)
- **Non-dated entries**: Use the `id` as filename (e.g., `uv7-system-architecture.ts`)

## Statistics

- **Total entries**: 68
- **2026 entries**: 63
- **2025 entries**: 5
- **Original file size**: 225 KB (3,557 lines)
- **New structure**: 70 files
  - `index.ts`: 5.5 KB (148 lines)
  - `types.ts`: 3.7 KB (171 lines)
  - Individual entries: ~1-25 KB each

## Benefits

1. **Maintainability**: Each entry is isolated, making it easier to edit without scrolling through 3,500+ lines
2. **Git History**: Changes to individual entries are clearer in diffs
3. **Type Safety**: All types are centralized in `types.ts`
4. **Scalability**: Adding new entries doesn't make any single file unwieldy
5. **Organization**: Chronological folder structure (2025/, 2026/)

## Consuming Code

The following files import from the timeline:

- `showcase/features/timeline/TimelineRenderer.ts`
- `showcase/features/timeline/TimelineStats.ts`
- `showcase/data/v3-lab-entries.ts`

All imports continue to work unchanged because they import from `'../../data/timeline'`, which now resolves to `index.ts`.
