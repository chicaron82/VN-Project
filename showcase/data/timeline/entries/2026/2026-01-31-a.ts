import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    "id": "2026-01-31-a",
    "date": "January 31, 2026",
    "emoji": "🗂️",
    "title": "Timeline Architecture Refactoring: From Monolith to Modules",
    "type": "milestone",
    "sortDate": "2026-01-31T18:00:00",
    "summary": "Refactored the 3,500+ line timeline.ts monolith into individual entry files. Inspired by how real blogs handle scalability—each entry is now its own file, organized by year. Much easier to maintain and add new entries.",
    "features": [
        "📂 <strong>Individual Entry Files:</strong> Split 68 timeline entries into separate files (63 from 2026, 5 from 2025)",
        "🗓️ <strong>Year-Based Organization:</strong> Automatic folder structure by year (entries/2026/, entries/2025/)",
        "🔍 <strong>Type Safety Preserved:</strong> All TypeScript interfaces extracted to centralized types.ts",
        "🎯 <strong>Zero Breaking Changes:</strong> Consuming code requires no modifications—imports automatically resolve",
        "📝 <strong>Smart Filename Generation:</strong> Format: YYYY-MM-DD-slug.ts with duplicate date handling",
        "🔄 <strong>Backward Compatible:</strong> All exports preserved (TIMELINE_DATA, timelineData, types)"
    ],
    "metrics": {
        "Original File Size": "3,557 lines (225 KB)",
        "New Structure": "70 files",
        "Total Entries": "68 entries",
        "Core Files": "index.ts (148 lines), types.ts (171 lines)",
        "Build Status": "✅ 0 TypeScript errors"
    },
    "callout": {
        "icon": "💡",
        "title": "Inspired by Real Blogs",
        "text": "After noticing the timeline file was getting massive, asked: 'How do blog sites handle entries?' Modern static site generators (Gatsby, Next.js, Astro) use individual files per entry. Applied the same pattern here.",
        "type": "info"
    },
    "problem": {
        "description": "The showcase/data/timeline.ts file had grown to 3,557 lines and 225 KB. Adding new entries meant navigating through a massive file, and git diffs were becoming unwieldy.",
        "rootCause": "Started with a single-file approach (common for prototypes), but as the timeline grew from a few entries to 68 entries with rich metadata, the monolithic structure became a maintenance burden."
    },
    "solution": {
        "approach": "Refactored into a modular structure following static site generator patterns: individual entry files organized by year, centralized types, and an aggregating index.ts that maintains backward compatibility.",
        "features": [
            "Created entries/2026/ and entries/2025/ folders with one file per entry",
            "Extracted all TypeScript interfaces to shared types.ts",
            "Built index.ts to aggregate all entries in correct order",
            "Generated README.md documenting the new structure",
            "Preserved original timeline.ts as .backup file"
        ]
    },
    "quote": "Now when I add a new timeline entry, I just create a new file—no more scrolling through 3,500 lines. This is what real blogs do for a reason.",
    "crew": {
        "title": "Timeline Refactoring Team",
        "members": [
            {
                "name": "Aaron (Architect)",
                "icon": "🧠",
                "contribution": "Identified the scalability issue and researched blog architecture patterns"
            },
            {
                "name": "Claude Sonnet 4.5 (Implementation)",
                "icon": "🤖",
                "contribution": "Automated the refactoring: split 68 entries into individual files, created smart filename generation, preserved all data and types"
            }
        ]
    }
};
