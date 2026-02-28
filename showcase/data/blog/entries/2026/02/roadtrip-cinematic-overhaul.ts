import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
    id: 'roadtrip-cinematic-overhaul-feb-2026',
    date: 'Feb 26, 2026',
    sortDate: '2026-02-26T23:00:00',
    title: 'The Cinematic Overhaul: Warm Redesign, Smart Itinerary & the Return Departure Suggester',
    type: 'feature',
    emoji: '🎬',
    tags: ['Roadtrip Planner', 'Design', 'UX', 'Architecture', 'Itinerary', 'DiZee', 'React', 'TypeScript'],
    modelId: 'dizee',
    summary: 'Two parallel threads in one day. Thread 1: a full visual identity shift — navy killed, warm brown enters, Cormorant Garamond as the editorial face, full-bleed map behind a floating glass panel, orange CTA pill, pill-shaped step dots, rotating tagline. Thread 2: the Smart Itinerary — merging the read-only timeline and the editable stop view into one inline-editable surface, plus a return departure suggester that detects when you can save 45 minutes by combining fuel and lunch on the way back. 18 commits. The app finally looks and feels like MEE.',

    callout: {
        icon: '🎬',
        title: 'Two Threads, One Day',
        text: 'The design and logic overhauls ran in parallel — the visual system needed a coherent identity to match what the planner was actually capable of, and the itinerary needed to stop being two separate views. By the end of the day: warm glass aesthetic matching the UV7 crew\'s energy, a single unified timeline that you can read and edit in the same surface, and a smart optimizer that proactively suggests how to save time on the return leg.'
    },

    highlights: [
        'Full-bleed map layout: the map now sits behind everything as a true canvas. The sidebar became a floating glass panel (mee-panel) with rounded corners, 24px margins, and a warm rgba(14,11,7) dark background — opaque at left, transparent at right via mee-vignette gradient',
        'Warm dark palette: the cold navy (#1a2035) swapped out for warm brown (#150f0a / #0e0b07). Every background, border, and shadow is now warm-tinted. The cold tech feel is gone',
        'Cormorant Garamond: added as the primary editorial typeface. Large display text (hero title, mode headings) uses the serif in italic/light weight. DM Mono for labels, data, and monospaced UI',
        'Orange CTA system: the primary action button is now a solid orange pill (#f97316), Tailwind orange-500. Secondary actions use border-only outline style. The visual hierarchy is unambiguous',
        'Portrait Glow Up: unified stacked layout for mobile — map behind panel, panel scrollable, step dots replaced with pills. Eliminated the fragmented portrait layout that was half-sidebar, half-card',
        'Unified Smart Itinerary: the separate "read SmartTimeline" and "edit itinerary" views merged into one inline-editable TripDaySection. You see the time, stop type, and notes in the same card — tap to edit, auto-save on blur',
        'Hub-snap fuel stops: before placing a fuel stop, the planner now checks whether pushing slightly further would land at a recognizable city hub (within 60km). "Somewhere on Highway 17" becomes "Wawa, ON"',
        'Smart return departure suggester: detects if the return leg has a fuel stop within 2 hours of its first meal window. If so, surfaces a hint: "Combine fuel and lunch at [city] — saves ~45 minutes vs separate stops"',
        'Return departure optimizer made universal: the logic was hardcoded to detect Winnipeg↔Chicago routes. Refactored to use hub cache lookups so any route with a recognizable return midpoint gets the suggestion',
        'Timing accuracy fixes: four focused commits on departure/arrival time accuracy — segment retiming on round trips, timezone-aware meal stop windows, driver swap interval rounding, proactive hub stops firing at the 4h mark instead of post-limit'
    ],

    technicalDetails: {
        title: 'Design Thread: The Glass Panel System',
        sections: [
            {
                heading: 'The mee-panel + mee-vignette Architecture',
                content: `
The old layout had the map in a right-side container and the sidebar in a left container — map and panel were siblings. The new layout treats the map as the base layer of the entire viewport:

\`\`\`tsx
<div className="relative h-screen w-full overflow-hidden">
    {/* Layer 0: Full-bleed map — always mounted */}
    <div className="absolute inset-0">
        <Map {...mapProps} />
    </div>

    {/* Layer 1: Vignette — left opaque → right transparent */}
    <div className="mee-vignette absolute inset-0 pointer-events-none z-[1]" />

    {/* Layer 2: Floating glass panel */}
    <div className="sidebar-dark mee-panel absolute inset-0 z-10 w-full flex flex-col
        md:inset-auto md:left-6 md:top-6 md:bottom-6 md:w-[420px]">
        {/* sidebar content */}
    </div>
</div>
\`\`\`

The vignette is a CSS gradient overlay — \`background: linear-gradient(to right, rgba(14,11,7,0.95) 0%, rgba(14,11,7,0.4) 55%, transparent 100%)\`. It darkens the left third of the map so text over the map is legible, while the right two-thirds of the map shows through clearly.

On mobile the panel is full-screen (inset-0). On desktop it's a 420px floating card with 24px margins on three sides — left, top, bottom. The map is always visible to the right.
`
            },
            {
                heading: 'Logic Thread: The Unified Itinerary',
                content: `
Before the merge, the app had two itinerary surfaces:
- \`SmartTimeline\` — read-only, showed timed events
- \`ItineraryTimeline\` — editable, showed raw segments and stop type pickers

Users had to switch tabs to see times (read) and change stops (edit). The cognitive overhead was real.

The merge made every \`TripDaySection\` inline-editable:

\`\`\`tsx
// Before: two separate tab-switched views
{viewMode === 'timeline' && <SmartTimeline days={days} />}
{viewMode === 'itinerary' && <ItineraryTimeline days={days} onUpdateStop={...} />}

// After: single surface, always showing both
<TripDaySection
    day={day}
    onUpdateStopType={onUpdateStopType}
    onUpdateNotes={onUpdateDayNotes}
    showTimeline={true}   // inline time display, always on
    editable={true}       // inline stop type picker, always available
/>
\`\`\`

The time display and the edit controls sit in the same card. Arrival time top-right, stop type picker bottom-center. Notes field collapses unless tapped. No tab required.

The \`viewMode\` state still exists for the journal toggle (plan vs. journal), but the timeline vs. itinerary distinction is gone entirely.
`
            }
        ]
    },

};
