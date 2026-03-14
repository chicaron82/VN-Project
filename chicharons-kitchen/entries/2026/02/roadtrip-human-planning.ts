import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    id: 'roadtrip-human-planning-feb-2026',
    date: 'Feb 27, 2026',
    sortDate: '2026-02-27T20:00:00',
    title: 'Human Planning: Real Fuel Math, Smart Wake-up Times & Landing Screen Polish',
    type: 'feature',
    emoji: '⛽',
    tags: ['Roadtrip Planner', 'Fuel Simulation', 'UX', 'Design', 'Hub Cache', 'DiZee', 'React', 'TypeScript'],
    modelId: 'dizee',
    summary: 'Five logic changes that make the planner think more like an actual driver — full-tank fuel model, last-stop centering, smart departure hours that scale to how much driving is actually left, minimum rest guarantees between days, and hub cache auto-promotion after 3+ uses. Plus the landing screen warm redesign: Cormorant hero title in orange gradient, heartbeat orb, three mode cards with glow/accent theming, route dot animation, and the DISCOVER→COMMIT lifecycle strip. 6 commits. TypeScript clean. 409 tests passing.',

    callout: {
        icon: '⛽',
        title: 'The Full-Tank Model',
        text: 'Real drivers don\'t buy exactly as much fuel as their math says they need. They stop, they fill the tank, they go. The old model calculated fuel cost as (litres needed × price per litre) — accurate in theory, wrong in practice. The new model: every stop costs a full tank except the last, which is a partial top-off based on remaining distance. The result is always at least as high as the per-litre math, often higher — and that\'s the point. Better to arrive with money left over than run short at a rural pump.'
    },

    highlights: [
        'Human fuel model: calculateHumanFuelCosts(stopCount, tankSizeLitres, gasPrice, lastLegKm, fuelEconomy). Every stop = full tank cost. Last stop = partial top-off capped at one full tank. Total is max(per-segment math, full-tank model) — always the more conservative estimate',
        'Last-stop centering: when only one more time-based fuel stop remains before the destination, the stop is centered between the last stop and the end instead of firing at the raw interval mark. Toronto→Ottawa (4h41min, 3.5h interval) now places the stop near Kingston instead of Brockville',
        'Smart departure hours: computeSmartDepartureHour now scales the wake-up time to how much driving is actually left on that day, not always the maximum. A 3h final leg no longer forces a 5 AM departure — it allows up to 6 PM start while still hitting the target arrival hour',
        'Minimum rest guarantee: between any Day N estimated arrival and Day N+1 departure, a MIN_REST_HOURS guard ensures the next day never departs less than the required rest gap after arrival. Prevents the "departed 1h after arriving" edge case for late drives',
        'Hub cache auto-promotion: discovered hubs used 3+ times now auto-promote from \'discovered\' (90-day TTL) to \'promoted\' (permanent). The cache learns which corridors you drive regularly and stops expiring those entries',
        'Landing screen warm redesign: Cormorant Garamond italic hero at clamp(36px, 5.5vw, 68px), "Is Calling." in orange gradient. Heartbeat orb — 8px orange dot that pulses to a 10px glow ring 800ms after mount. Three mode cards with per-mode glow/border/accent color via CSS custom properties',
        'Route dot animation: 8 canonical highway milestones (Vancouver → Banff → Winnipeg → ... → Tofino) cycle as an expanding pill, cycling every 1.2s with a spring cubic-bezier. The current city label fades in below',
        'DISCOVER→VALIDATE→BUILD→REFINE→COMMIT lifecycle strip: a subtle DM Mono row under the hero subtitle. COMMIT in orange with a glow — the goal state',
        'selectStrategy now correctly updates the full itinerary: switching route strategies (fastest/scenic/Canada-only) now re-runs splitTripByDays and recalculates cost breakdowns, not just swapping geometry'
    ],

    technicalDetails: {
        title: 'Two Algorithms Worth Looking At',
        sections: [
            {
                heading: 'Last-Stop Centering: Why and How',
                content: `
The time-based fuel stop interval (e.g. 3.5 hours for "balanced") creates a predictable problem on medium-length trips: the last stop fires near the destination.

Toronto → Ottawa is 4h41m. At a 3.5h interval, the stop fires at the 3.5h mark — about 20 minutes east of Brockville. That's not wrong, but Kingston (halfway, 2h20m in) is a much better stop: larger city, more gas stations, good restaurant options.

The centering condition:

\`\`\`typescript
const remainingFromLastStop = totalRouteMinutes - lastStopTime;
const isLastTimeStop =
    remainingFromLastStop > stopIntervalMinutes &&
    remainingFromLastStop <= 2 * stopIntervalMinutes;
const effectiveInterval = isLastTimeStop
    ? remainingFromLastStop / 2
    : stopIntervalMinutes;
\`\`\`

When \`remaining\` is between 1× and 2× the interval — meaning exactly one more stop needed — the effective interval is halved, centering the stop. When \`remaining > 2×\`, two more stops are needed and normal spacing applies. When \`remaining ≤ 1×\`, no more stops needed.

The strict bounds prevent re-centering on the next iteration: after the centered stop fires, remaining drops to ~half the interval, which is ≤ 1×, so the condition is false and no infinite loop.
`
            },
            {
                heading: 'Smart Departure Hours: Full vs Short Days',
                content: `
The original departure time logic used a single formula: \`targetArrivalHour - maxDriveHours\`. For a 10h max drive and 9 PM target arrival: depart at 11 AM. Fine for full days.

For a 3h final leg — the last driving day when you\'re nearly there — the formula gives: \`21 - 10 = 11 AM\`. You wake up, drive 3 hours, arrive at 2 PM. The target was 9 PM. You wasted the morning.

The fix scales to actual drive hours remaining, not the cap:

\`\`\`typescript
function computeSmartDepartureHour(settings: TripSettings, actualDriveHours: number): number {
    const { targetArrivalHour = 21, maxDriveHours } = settings;
    const isFullDay = actualDriveHours >= maxDriveHours * TRIP_CONSTANTS.departure.fullDayThreshold;
    const maxDeparture = isFullDay
        ? TRIP_CONSTANTS.departure.maxHourFullDay   // 10 AM — can't afford to dawdle
        : TRIP_CONSTANTS.departure.maxHourShortLeg; // 6 PM — short leg, sleep in
    return Math.max(
        TRIP_CONSTANTS.departure.minHour,
        Math.min(maxDeparture, Math.floor(targetArrivalHour - actualDriveHours)),
    );
}
\`\`\`

The function uses \`getNextDayDriveMinutes\` to look ahead at how much driving is actually queued for the next day — not the theoretical maximum. A 3h final leg uses 6 PM as the max departure ceiling. A full 10h day uses 10 AM.

Note \`Math.floor\` instead of \`Math.round\`: rounding could cause 30+ minute late arrivals on fractional drive hours (e.g. 8.5h rounds to 9h → departs at 12 PM instead of 11 AM → arrives at 8:30 PM instead of target 9 PM). Floor guarantees on-time.
`
            }
        ]
    },

};
