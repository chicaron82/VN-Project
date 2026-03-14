import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    id: 'roadtrip-build-mode-pivot-feb-2026',
    date: 'Feb 18, 2026',
    sortDate: '2026-02-18T18:00:00',
    title: 'Build Mode: The Four-Phase Pivot',
    type: 'feature',
    emoji: '🗺️',
    tags: ['Roadtrip Planner', 'Architecture', 'UX', 'Maps', 'DiZee', 'React', 'TypeScript'],
    modelId: 'dizee',
    summary: 'Four-phase overhaul turning the roadtrip planner from a passive calculator into an interactive build-your-trip experience. Click map markers to add stops, pick which day they go on, confirm your plan to unlock the journal, and watch the return leg auto-populate with mirrored fuel and hotel stops. Also fixed Google Maps exporting to drywall companies and bedroom suites. 5 commits, 3 new files, ~470 lines added.',

    callout: {
        icon: '🗺️',
        title: 'From Broken Discovery Panel to Full Build Mode',
        text: 'The Discovery Panel was showing all POIs near the destination instead of along the route — a fundamental mismatch. Rather than patch it, we pivoted: make the map itself the discovery surface. Click a dot, pick a day, it appears in your itinerary. Four phases, clean architecture throughout, nothing rewritten that didn\'t need to be.'
    },

    highlights: [
        'Phase 1: Relocated Discovery Panel to itinerary endpoint as "Things to Do in {Destination}" — destination-only POI suggestions, fixed round-trip destination name detection (Thunder Bay, not Winnipeg)',
        'Phase 2: Map-click "Add to Plan" — new POIPopup with detour time, stop duration, and day selector; useAddedStops hook converts POI → SuggestedStop (accepted: true) to flow through existing simulation pipeline unchanged',
        'Phase 2 refinement: Multi-day day picker — PopupDayOption[] built from TripDay.segmentIndices lets users pick which leg a stop goes on (critical for round trips)',
        'Phase 3: Trip confirmation gate — ConfirmTripCard at itinerary bottom, JournalModeToggle gets disabled prop with lock icon, journal unlocks only after confirming plan',
        'Phase 4: Take Me Home — 12 lines, zero new files. Mirror formula (total - 1 - outboundIndex) auto-populates return leg with fuel and hotel stops from the outbound leg',
        'Google Maps export fix: raw lat/lng was snapping to nearest business (drywall company in Fargo, private bedroom suite in OKC). Now sends city name strings so Maps geocodes to city centres',
        'Challenge data cleanup: replaced park-specific addresses (Blue Hole Regional Park, Colorado Bend State Park, Kakabeka Falls Provincial Park) with plain city-level addresses across all challenges'
    ],

    technicalDetails: {
        title: 'Four Courses, One Coherent Meal',
        sections: [
            {
                heading: 'Phase 2: The SuggestedStop Pipeline Reuse',
                content: `
The key architectural insight: don't build a new timeline rendering path for map-added stops. Convert them to \`SuggestedStop\` with \`accepted: true\` and they flow through \`ItineraryTimeline\`'s existing \`simulationItems\` pipeline unchanged.

\`\`\`typescript
// useAddedStops.ts — asSuggestedStops memo
return addedStops.map(stop => ({
    id: stop.id,
    type: stop.stopType,      // gas→fuel, food→meal, hotel→overnight, attraction→rest
    reason: \`\${stop.poi.name} (added from map)\`,
    afterSegmentIndex: stop.afterSegmentIndex,
    duration: stop.duration,
    priority: 'optional',
    accepted: true,           // ← flows straight into simulationItems, no changes needed
}));
\`\`\`

The simulation pipeline doesn't know or care where the stop came from. Added stops shift arrival times just like system-suggested stops. \`SuggestedStopNode\` in TimelineNode.tsx renders them with existing fuel/hotel icons. Zero rewrite.

The day picker (PopupDayOption[]) was necessary because \`findNearestSegmentIndex\` breaks down for round trips — a gas station near Dryden on the outbound could be "nearer" to the return segment's to-location depending on segment layout. Explicit day selection is more reliable than geometric nearest-segment math.
`
            },
            {
                heading: 'Phase 4: The Mirror Formula',
                content: `
Return segments are always a perfect mirror of outbound — same count, reversed. So mirroring an outbound stop at index \`i\` onto the return leg is pure math:

\`\`\`typescript
const mirroredReturnStops = useMemo((): SuggestedStop[] => {
    if (!summary || !settings.isRoundTrip || addedStops.length === 0) return [];
    const total = summary.segments.length;
    const midpoint = total / 2;

    return addedStops
        .filter(s =>
            s.afterSegmentIndex < midpoint &&
            (s.poi.category === 'gas' || s.poi.category === 'hotel')
        )
        .map(s => ({
            ...suggestedStopShape,
            id: \`return-\${s.id}\`,
            afterSegmentIndex: (total - 1) - s.afterSegmentIndex,  // ← the formula
            reason: \`\${s.poi.name} (return leg)\`,
        }));
}, [addedStops, summary, settings.isRoundTrip]);
\`\`\`

For a 2-segment round trip: outbound at 0 → return at 1. For 4-segment: outbound at 0 → return at 3, outbound at 1 → return at 2. Category filter is intentional — food and attractions are one-visit stops; gas and hotels are logistical necessities you'll need again on the way back.

One file, 12 new lines, no new hooks, no new components.
`
            },
            {
                heading: 'The Google Maps Bug: Coordinates vs. City Names',
                content: `
The export URL was using raw lat/lng for all waypoints:

\`\`\`
https://maps.google.com/dir/?origin=49.8951,-97.1384&waypoints=46.8772,-96.7898|...
\`\`\`

Google Maps resolves those coordinates to the nearest named place — which turns out to be whatever business happens to sit at that exact coordinate. Winnipeg's origin point hit "Elite Lighting." Fargo hit "Olson's Do It All Drywall." Oklahoma City hit "[4043 A] Private Bedroom Suite Community." Longview hit "Carvana Longview."

Fix: pass city name strings instead. Maps geocodes to the city centre — stable, named, correct.

\`\`\`typescript
const locStr = (loc: Location) =>
    encodeURIComponent(loc.address || loc.name);

// "Winnipeg%2C%20Manitoba" → city centre, not a lighting store
\`\`\`
`
            }
        ]
    },

    lessonsLearned: [
        {
            icon: '🔄',
            title: 'Reuse Before Rebuild',
            lesson: 'The SuggestedStop pipeline was already built, tested, and rendering. Converting map-added POIs to the same type cost 99 lines of hook code and zero changes to the simulation engine. The temptation would have been to build a separate "added stops" timeline — that would have doubled the rendering surface for no benefit.'
        },
        {
            icon: '📐',
            title: 'Geometry Fails, Intent Wins',
            lesson: 'findNearestSegmentIndex sounds rigorous but breaks immediately on round trips where both legs share similar coordinates. A day picker (explicit user intent) is more reliable than any geometric heuristic. When in doubt, ask the user — they know which day they\'re driving.'
        },
        {
            icon: '🗺️',
            title: 'Coordinates Are Not Addresses',
            lesson: 'lat/lng tells a computer where to point. City name strings tell Google Maps what the human meant. They\'re different things. A coordinate that was right in 2019 still resolves to whichever business opened at that exact spot in 2024. City names are stable. Use them for routing.'
        }
    ],

    crew: [
        {
            name: 'DiZee',
            contribution: 'All four Build Mode phases, Google Maps export fix, challenge data cleanup, architecture design',
            icon: '👨‍🍳'
        }
    ],

    metrics: {
        title: 'Session Metrics',
        stats: [
            { label: 'Phases shipped', value: 4 },
            { label: 'Commits', value: 5 },
            { label: 'New files', value: 3 },
            { label: 'Lines added', value: '~470' },
            { label: 'Lines removed', value: '~30' },
            { label: 'Phase 4 line count', value: '12' },
            { label: 'Challenge waypoints fixed', value: 4 },
            { label: 'Businesses removed from your route', value: '∞' }
        ]
    },

    footer: {
        icon: '🗺️',
        text: 'The map is now the menu. Click a stop, pick your day, confirm the plan, drive home. No drywall companies required. 💚🔥💀'
    }
};
