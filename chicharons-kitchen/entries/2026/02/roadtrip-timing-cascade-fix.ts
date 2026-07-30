import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    id: 'roadtrip-timing-cascade-fix-feb-2026',
    date: 'Feb 27, 2026',
    sortDate: '2026-02-27T22:00:00',
    title: 'Two Bugs, Three Layers Deep, Two Lines to Fix',
    type: 'fix',
    emoji: '🕰️',
    tags: ['Roadtrip Planner', 'Bug Fix', 'Timezone', 'Simulation', 'TypeScript', 'DiZee'],
    modelId: 'dizee',
    summary: 'A printed trip itinerary (Winnipeg → Winnipeg, 8 days) showed cascading timing errors: Day 1 overnight appeared at 9 AM departure city instead of 5 PM overnight city, Day 2 fuel stops fired at 10:31 PM past the day\'s driving window, Day 3 events showed up before the stated departure time. The root cause was two independent bugs working together — one in the stop suggestion generator, one in the timeline clock advance. Neither was obvious alone. Fixed in two lines. TypeScript clean. 409 tests pass.',

    callout: {
        icon: '🕰️',
        title: 'The Cascade Pattern',
        text: 'Bug 1 displaced the Day 1 overnight to the wrong side of the drive. That shifted every Day 1 event into Day 2\'s filter. Bug 2 then caused the Day 2 clock advance to skip Day 3 entirely. The PDF showed three separate symptoms that looked like three separate bugs — but it was one cascade from two root causes, both triggered only by multi-day negative-UTC-offset trips arriving after 6 PM. Sneaky by design.'
    },

    highlights: [
        'Bug 1 — afterSegmentIndex: -1: splitLongSegments creates sub-segments that all share the same _originalIndex. Day 1 and Day 2 both end up with segmentIndices[0] = 0. drivingDayStartMap.set(0, Day 2) fires when index = 0, producing afterSegmentIndex = 0 - 1 = -1. buildTimedTimeline classifies it as boundaryBefore — the overnight emits BEFORE the drive at 9 AM Winnipeg instead of after the drive at ~5 PM Saint Paul.',
        'Bug 2 — UTC vs local date in overnight clock advance: arr.toISOString().slice(0, 10) returns the UTC calendar date. In CST (UTC-6), an 6:44 PM local arrival is midnight UTC the next calendar day. drivingDayDates.find(d => d > overnightDate) skips the actual next driving day and finds a day 3+ entries ahead. currentTime advances by 3 days instead of 1.',
        'Fix 1: Math.max(0, index - 1) in generate.ts — overnight always lands in boundaryAfter, correctly placed after the drive',
        'Fix 2: Local date from getFullYear()/getMonth()/getDate() in trip-timeline.ts — clock advance finds the correct next driving day regardless of timezone',
        '2 files changed, 7 insertions, 2 deletions. 409/409 tests pass. TypeScript clean.'
    ],

    technicalDetails: {
        title: 'The Two Bugs in Detail',
        sections: [
            {
                heading: 'Bug 1: The Segment Index Collision',
                content: `
The stop suggestion generator builds a map to detect day boundaries:

\`\`\`typescript
// generate.ts — drivingDayStartMap
drivingDays.slice(1).forEach(day => {
  if (day.segmentIndices.length > 0) {
    drivingDayStartMap.set(day.segmentIndices[0], day);
  }
});
\`\`\`

For a 7h14m leg, \`splitLongSegments\` splits the OSRM segment into two sub-segments. Both sub-segments get \`_originalIndex = 0\`. This means both Day 1 and Day 2 have \`segmentIndices[0] = 0\`. So \`drivingDayStartMap.set(0, Day 2)\` — Day 2 is mapped to the very first segment.

When the loop hits \`index = 0\`, \`incomingDay\` fires. It synthesizes an overnight for the previous driving day using \`afterSegmentIndex: index - 1 = -1\`.

In \`buildTimedTimeline\`, stops are classified as:
- \`boundaryBefore\`: \`Math.floor(afterSegmentIndex) === i - 1\` → emitted BEFORE segment i's drive
- \`boundaryAfter\`: \`Math.floor(afterSegmentIndex) === i\` → emitted AFTER segment i's drive

\`Math.floor(-1) === 0 - 1\` → \`boundaryBefore\` for segment 0. The overnight emits before ANY driving has happened, at 9:00 AM in Winnipeg (departure city) with no drive connector.

Fix:
\`\`\`typescript
afterSegmentIndex: Math.max(0, index - 1),  // was: index - 1
\`\`\`

With \`afterSegmentIndex = 0\`, it becomes \`boundaryAfter\` for segment 0 — correctly emitted AFTER the drive, at ~5 PM in Saint Paul.
`
            },
            {
                heading: 'Bug 2: The UTC Midnight Trap',
                content: `
When an overnight stop is emitted, \`buildTimedTimeline\` advances the clock to the next driving day's departure time:

\`\`\`typescript
// trip-timeline.ts — before fix
const overnightDate = arr.toISOString().slice(0, 10); // "YYYY-MM-DD"
const nextDrivingDate = drivingDayDates.find(d => d > overnightDate);
\`\`\`

\`toISOString()\` always returns UTC. In CST (UTC-6), a 6:44 PM local arrival is \`00:44 UTC\` on the NEXT calendar day. So \`overnightDate = "2026-03-03"\` even though the local date is still March 2.

\`drivingDayDates\` holds local date strings built from \`day.date\` (which ARE local dates). Day 3 is \`"2026-03-03"\`. The find condition is \`d > "2026-03-03"\` — so Day 3 is skipped. The next match is Day 6 (\`"2026-03-06"\`). \`daysToAdvance = 3\`. \`currentTime\` jumps to March 5. Every Day 3 event filters to March 5 — a date with no driving — and disappears from the PDF.

Fix:
\`\`\`typescript
// Use LOCAL date — toISOString() gives UTC which ticks forward a day
// in negative-UTC-offset timezones when overnight arrives after 6 PM local
const pad = (n: number) => String(n).padStart(2, '0');
const overnightDate = \`\${arr.getFullYear()}-\${pad(arr.getMonth() + 1)}-\${pad(arr.getDate())}\`;
\`\`\`

\`getFullYear\` / \`getMonth\` / \`getDate\` read local time. 6:44 PM CST returns March 2. \`drivingDayDates.find(d => d > "2026-03-02")\` matches Day 3 (\`"2026-03-03"\`). \`daysToAdvance = 1\`. Clock advances one night. Day 3 events appear at the correct times.
`
            }
        ]
    },

    lessonsLearned: [
        {
            icon: '🗺️',
            title: 'Shared Indices Are Silent Landmines',
            lesson: 'splitLongSegments works perfectly — sub-segments drive correctly, fuel math is right, everything looks fine in single-day trips. The collision only surfaces in multi-day trips where the day boundary map reads a key that two days both think they own. The bug is in the assumption that segmentIndices[0] is unique per driving day. It isn\'t when segments are split.'
        },
        {
            icon: '🌏',
            title: 'toISOString() Is a Bug Waiting to Happen',
            lesson: 'Any time you use toISOString().slice(0, 10) to get a date string and then compare it to a date string derived from local time — you have a latent timezone bug. It works fine in UTC+0 or UTC+positive timezones. It silently breaks for anyone west of Greenwich the moment an event crosses midnight UTC. Use getFullYear()/getMonth()/getDate() when you mean local date.'
        },
        {
            icon: '🔗',
            title: 'Cascading Bugs Look Like Many Bugs',
            lesson: 'The PDF showed wrong timing across three separate days, which looked like three separate bugs. It was one cascade: Bug 1 shifted Day 1\'s overnight from boundaryAfter to boundaryBefore, displacing the clock. Bug 2 then made the clock advance skip an entire day. Two root causes, three visible symptoms, one session to find and fix both. Always trace the first wrong event before diagnosing the downstream ones.'
        }
    ],

    crew: [
        {
            name: 'DiZee',
            contribution: 'Root cause analysis across three files, both fixes',
            icon: '👨‍🍳'
        }
    ],

    metrics: {
        title: 'Session Metrics',
        stats: [
            { label: 'Visible symptoms', value: 3 },
            { label: 'Root causes', value: 2 },
            { label: 'Files changed', value: 2 },
            { label: 'Lines changed (net)', value: 7 },
            { label: 'Tests', value: '409 / 409' },
            { label: 'TypeScript errors', value: 0 },
            { label: 'Trips that now print correctly', value: '∞' }
        ]
    },

    footer: {
        icon: '🕰️',
        text: 'Two lines of code. Seven hours of cascading wrong times fixed. The open road is calling — and now it knows what time it is. 💚🔥💀'
    }
};
