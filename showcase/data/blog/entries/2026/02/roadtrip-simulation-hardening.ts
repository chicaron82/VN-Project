import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
    id: 'roadtrip-simulation-hardening-feb-2026',
    date: 'Feb 19, 2026',
    sortDate: '2026-02-19T20:00:00',
    title: 'Simulation Deep Dive: Bugs, Bad Math, and Better Architecture',
    type: 'fix',
    emoji: '⛽',
    tags: ['Roadtrip Planner', 'Bug Fix', 'Architecture', 'Fuel Simulation', 'React', 'TypeScript', 'DiZee'],
    modelId: 'dizee',
    summary: 'A debugging sprint on the roadtrip planner\'s fuel simulation that started with three visible display bugs and surfaced four quieter architectural issues underneath. Fixed duplicate fuel stops, missing free day headers, wrong Day 3 departure times, and day-boundary state resets — then kept going: stale suggestion state on recalculate, a gallons-as-litres unit bug silently breaking imperial users, en-route fuel advisories for legs too long for one tank, and a safety-net comment that finally says what it does. Eight fixes. Zero new files. TypeScript clean.',

    callout: {
        icon: '⛽',
        title: 'The Bug That Kept Going',
        text: 'What started as "duplicate fuel stops in the timeline" turned into a full audit of the simulation pipeline. Each fix revealed the next issue underneath — wrong departure times led to stale state, stale state led to unit conversion bugs, unit bugs led to en-route advisory gaps. By the end we had fixed the display layer, the computation layer, and the state management layer. The kind of session that makes the codebase genuinely more correct.'
    },

    highlights: [
        'Duplicate fuel stops: simulationItems was rendering accepted stops twice — once as "before segment i" and again as "after segment i-1". Fixed by removing the stopsBeforeSegment pass; each stop renders exactly once as stopsAfterSegment at its target index',
        'Missing free day headers: Thunder Bay free day (Day 2) had no DaySection header. Added freeDaysAfterSegment useMemo mapping last-segment-of-driving-day → free TripDay[], rendered as DaySection nodes after each arrival waypoint with a gap following',
        'Wrong Day 3 departure time: after a free-day gap, currentTime in simulationItems wasn\'t jumping to the next morning. Added nextDrivingDayAfterGap() helper to detect gaps and jump the clock to the correct departure time',
        'Day-boundary state reset in generateSmartStops: fuel/rest/meal accumulators carried over from Day 1 into Day 3. Added drivingDayStartMap + per-day reset block so each driving day starts with a full tank and fresh counters',
        'Issue 1 — Stale suggestions on recalculate: useState initializer only fires on mount; recalculating the route left suggestions unchanged. Replaced with baseSuggestions (useMemo, regenerates on trip change) + userOverrides (useState Record) — user decisions survive recalculates, stale base suggestions cannot',
        'Issue 2 — En-route fuel advisories: if a single leg exceeds safeRangeKm, the tank can\'t cover it. Now pushes fuel-enroute-{index}-{s} suggestions (advisory, not auto-accepted) for each required mid-leg stop, pushed after meal/overnight to avoid consolidateStops merging them with the start-of-leg stop',
        'Issue 3 — VIRTUAL_TANK_CAPACITY unit bug: vehicle.tankSize is in the user\'s chosen unit — gallons for imperial users. The simulation was treating it as litres, making fuel math completely wrong for anyone not metric. Fixed with tankSize * 3.78541 for imperial; added settings.units to simulationItems deps',
        'Issue 4 — Legacy check comment: the inline gas check in simulationItems looked like dead code. It\'s not — it\'s an intentional safety net for when the user dismisses a required fuel suggestion or vehicle is null. Comment now says so clearly'
    ],

    technicalDetails: {
        title: 'Two Fixes Worth Looking At Closely',
        sections: [
            {
                heading: 'useMemo + userOverrides: Decoupling State from Computation',
                content: `
The original pattern:

\`\`\`typescript
const [stopSuggestions, setStopSuggestions] = useState<SuggestedStop[]>(() => {
    if (!vehicle) return [];
    const config = createStopConfig(vehicle, settings);
    return generateSmartStops(summary.segments, config, days);
});
\`\`\`

The initializer \`() => generateSmartStops(...)\` only runs once — at mount. Recalculate the trip, get a new summary, and the suggestions never update. The component re-renders but the old suggestions stay frozen.

The fix separates what should be two different things:

\`\`\`typescript
// Base suggestions — pure computation, regenerates on every trip change
const baseSuggestions = useMemo(() => {
    if (!vehicle) return [];
    const config = createStopConfig(vehicle, settings);
    return generateSmartStops(summary.segments, config, days);
}, [summary.segments, vehicle, settings, days]);

// User decisions — persists across recalculates
const [userOverrides, setUserOverrides] = useState<
    Record<string, { accepted?: boolean; dismissed?: boolean; duration?: number }>
>({});

// Merged read-only view
const stopSuggestions = useMemo(() =>
    baseSuggestions.map(s => {
        const o = userOverrides[s.id];
        if (!o) return s;
        return { ...s, accepted: o.accepted ?? s.accepted, dismissed: o.dismissed ?? s.dismissed, duration: o.duration ?? s.duration };
    }),
    [baseSuggestions, userOverrides]
);
\`\`\`

The key insight: base suggestions are a function of the trip. User decisions are a function of user interaction. Mixing them in the same useState meant one had to win — and useState always picked the trip-at-mount. Now they're separate and can both be correct.
`
            },
            {
                heading: 'The VIRTUAL_TANK_CAPACITY Unit Bug',
                content: `
The simulation in \`simulationItems\` tracked a virtual fuel level to show gas stop arrival times correctly. Tank capacity was set as:

\`\`\`typescript
const VIRTUAL_TANK_CAPACITY = vehicle?.tankSize || 55;
\`\`\`

Looks fine. The problem: \`vehicle.tankSize\` is stored in the user's chosen unit. For a metric user with a 55 L tank — correct. For an imperial user with a 15-gallon tank — \`VIRTUAL_TANK_CAPACITY = 15\`, treated as 15 litres, which is about a quarter of the actual capacity.

Meanwhile \`generateSmartStops\` had already handled this correctly via \`createStopConfig\`:

\`\`\`typescript
const tankSizeLitres = settings.units === 'metric'
    ? vehicle.tankSize
    : vehicle.tankSize * 3.78541;
\`\`\`

The simulationItems was just missing the same conversion. Fix:

\`\`\`typescript
const VIRTUAL_TANK_CAPACITY = vehicle
    ? (settings.units === 'metric' ? vehicle.tankSize : vehicle.tankSize * 3.78541)
    : 55;
\`\`\`

Also added \`settings.units\` to the \`simulationItems\` dependency array — without it, switching units mid-session wouldn't trigger a recompute and the wrong value would persist.

The bug was silent: imperial users would see the safety-net gas stop fire almost immediately (since the virtual tank drained in 15 "litres"), but it looked like aggressive fuel suggestions rather than a unit conversion error.
`
            }
        ]
    },

    lessonsLearned: [
        {
            icon: '🔍',
            title: 'Display Bugs Are Often Symptom, Not Cause',
            lesson: 'The duplicate fuel stop looked like a rendering bug. It was — but tracing it through simulationItems revealed the stale-state issue, which revealed the unit conversion bug. None of those three were related, but fixing one forced reading the code closely enough to find the next. A display bug is sometimes an invitation to audit the whole layer.'
        },
        {
            icon: '⚖️',
            title: 'State Shape Should Match Mental Model',
            lesson: 'We had one useState trying to represent both "what the algorithm computed" and "what the user decided." Those are different things with different lifecycles. When state shape doesn\'t match the mental model, one concern always silently wins. The useMemo+userOverrides split isn\'t clever — it\'s just correct.'
        },
        {
            icon: '🌍',
            title: 'Unit Bugs Hide in Plain Sight',
            lesson: 'The unit conversion was done correctly in generateSmartStops and wrong in simulationItems. Both were written at different times, both looked reasonable in isolation. Unit bugs are dangerous precisely because the value is plausible — 15 is a valid number for a tank, it\'s just in the wrong unit. Test with imperial settings.'
        }
    ],

    crew: [
        {
            name: 'DiZee',
            contribution: 'Full simulation audit — display bugs, state architecture, unit conversion, en-route fuel advisories',
            icon: '👨‍🍳'
        }
    ],

    metrics: {
        title: 'Session Metrics',
        stats: [
            { label: 'Display bugs fixed', value: 4 },
            { label: 'Architectural improvements', value: 4 },
            { label: 'New files', value: 0 },
            { label: 'Files modified', value: 2 },
            { label: 'Lines changed', value: '~80' },
            { label: 'TypeScript errors', value: 0 },
            { label: 'Imperial users whose fuel math now works', value: '∞' }
        ]
    },

    footer: {
        icon: '⛽',
        text: 'Eight fixes, two files, zero new abstractions. The simulation now knows what unit it\'s in, what trip it\'s on, and what the user decided. That\'s all it ever needed to know. 💚🔥💀'
    }
};
