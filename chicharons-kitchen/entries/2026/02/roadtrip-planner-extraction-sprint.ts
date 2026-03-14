import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    id: 'roadtrip-planner-extraction-sprint-feb-2026',
    date: 'Feb 16, 2026',
    sortDate: '2026-02-16T11:00:00',
    title: 'The Kitchen That Crashed: ItineraryTimeline Extraction, Driver Rotation & Print View',
    type: 'highlight',
    emoji: '🔧',
    tags: ['React', 'TypeScript', 'Refactoring', 'Trip Planning', 'Driver Rotation', 'Print', 'Component Extraction', 'Crash Recovery'],
    modelId: 'dizee',
    summary: 'Continuation of the roadtrip planner sprint — born from years of hand-crafting trip PDFs so detailed people said "charge for this." The 550-line ItineraryTimeline monolith got carved into 5 focused components, a driver rotation system with 19 tests was built (matching the "🔁 Driver rotation" notes in the manual plans), overnight hotel editing landed, a 560-line print view recreates the gold-standard PDF format, and the computer crashed mid-blog-entry. Reverted, debugged, recovered. 89 tests passing.',

    callout: {
        icon: '💥',
        title: 'The Crash That Ate the Blog',
        text: 'Computer crashed in the middle of creating the blog entry for the previous session. Had to revert uncommitted changes, re-examine the commit history, and debug until everything was back to clean. The irony: the blog about building things got destroyed by the machine building it.'
    },

    highlights: [
        '**ItineraryTimeline Extraction** — 550+ lines broken into TimelineNode (343), DaySection (124), DriverStatsPanel (78), OvernightEditor (215)',
        '**Driver Rotation System** — Pure algorithm: round-robin at fuel stops, per-driver stats (time, km, segments), 19 tests, zero DOM dependency',
        '**TripPrintView** — 560-line print-optimized export modeled after the manual roadtrip2025.txt gold standard format',
        '**OvernightEditor Dialog** — Hotel name, address, cost, rooms, check-in/out times, 8-amenity toggle grid (🥐🏊📶🅿️💪🍽️🧺🐕)',
        '**Circular Dep Fix** — `React.useRef` callback pattern breaks hook initialization order between useTripCalculation and useWizard',
        '**Fuel Stop Priority Tiers** — Critical (🚨 tank < 10%), Recommended (⚠️ < 25%), Optional (⚡ top-off) with color-coded nodes',
        '**UI Component Upgrades** — Dialog (+199 lines), Tooltip (+95), Switch (+56), Button (+26), Label (+14) all enhanced',
        '**89 Tests Passing** — Up from 70 (+19 driver rotation tests), 3 test files, zero regressions'
    ],

    problem: {
        description: 'ItineraryTimeline.tsx had grown to 550+ lines — rendering gas stops, waypoints, day headers, budget cards, flexible days, activity editors, and suggested stops all in one component. Adding driver rotation and overnight editing would push it past 700 lines. Meanwhile, the print view needed the same data transformations but different rendering.',
        rootCause: 'Classic "just one more feature" accumulation. Each previous phase added handlers to ItineraryTimeline because it was the only place timeline rendering happened. The 300-line limit was blown past because each feature felt small individually. Driver rotation was the tipping point that forced extraction.'
    },

    solution: {
        approach: 'Extract-then-extend: (1) Pull node rendering into TimelineNode.tsx, (2) Pull day sections into DaySection.tsx, (3) Build DriverStatsPanel and OvernightEditor as new sibling components, (4) Build TripPrintView consuming the same data/types. Then add driver rotation as a pure library function with comprehensive tests.',
        features: [
            '**TimelineNode.tsx (343 lines)** — StartNode, GasStopNode, SuggestedStopNode, WaypointNode. Each accepts focused props, renders one timeline item. Fuel priority colors (critical=red, recommended=orange, optional=blue)',
            '**DaySection.tsx (124 lines)** — Orchestrates DayHeader + DailyBudgetCard + FlexibleDayCard/FreeDayCard per day type. Receives all handlers via props, passes down selectively',
            '**DriverStatsPanel.tsx (78 lines)** — Per-driver stat cards with color-coded progress bars, time/distance percentages. 4 driver color themes (indigo, emerald, amber, rose)',
            '**OvernightEditor.tsx (215 lines)** — Radix Dialog with hotel name, address, cost, rooms needed, check-in/out times, 8-amenity toggle grid, notes field',
            '**driver-rotation.ts (122 lines)** — `assignDrivers()` pure function: iterate segments, rotate at fuel stops, accumulate stats. `extractFuelStopIndices()` helper. `formatDriveTime()` utility',
            '**TripPrintView.tsx (560 lines)** — `printTrip()` function builds HTML string, injects into hidden div, calls `window.print()`. Day-by-day layout with hotel/route/budget, driver assignments, timezone changes, running totals',
            '**Circular dep fix** — `useTripCalculation` needs `onCalculationComplete` callback, but that callback needs `markStepComplete` from `useWizard`, which needs `calculateTrip` from `useTripCalculation`. Solved with `React.useRef` callback pattern',
            '**ItineraryTimeline slimmed** — Removed inline formatTime/formatDate helpers, GasStopNode/WaypointNode rendering, DayHeader/DailyBudgetCard/FlexibleDay orchestration. Now imports from dedicated components'
        ]
    },

    technicalDetails: {
        title: 'The Extraction Surgery',
        sections: [
            {
                heading: 'The 550-Line Monolith → 5 Focused Components',
                content: `
**Before:** ItineraryTimeline.tsx contained:
- \`formatTime()\`, \`formatDate()\` helpers
- Gas stop rendering with priority colors
- Waypoint/destination rendering with stop type pickers
- Day header with type toggles and editable titles
- Budget cards per day
- Flexible day / free day conditional rendering
- Activity badge/editor integration
- Suggested stop cards
- Smart suggestions panel

**After:** ItineraryTimeline becomes an orchestrator:
- **TimelineNode.tsx** (343 lines) — All node rendering (start, gas, suggested, waypoint)
- **DaySection.tsx** (124 lines) — Day-level orchestration (header + budget + flexible)
- **DriverStatsPanel.tsx** (78 lines) — Driver rotation stats display
- **OvernightEditor.tsx** (215 lines) — Hotel details editing dialog

**ItineraryTimeline now:** Simulation loop + data transformation + component composition. Imports nodes and sections, renders them in order.
                `
            },
            {
                heading: 'Driver Rotation: Pure Algorithm, Zero DOM',
                content: `
The driver rotation system is intentionally decoupled from React:

\`\`\`typescript
function assignDrivers(
    segments: RouteSegment[],
    numDrivers: number,
    fuelStopIndices: number[]
): DriverRotationResult {
    // Start with driver 1
    // At each fuel stop index, rotate to next driver
    // Round-robin: driver = (current % numDrivers) + 1
    // Track cumulative time/km/segments per driver
}
\`\`\`

**Why pure functions?** Same algorithm used in:
1. ItineraryTimeline (interactive display)
2. TripPrintView (print export)
3. Future: PDF generation, sharing

**19 tests cover:** Single driver, 2-driver rotation, 3-driver round-robin, wrap-around, no fuel stops, empty segments, out-of-range indices, stats accumulation, \`formatDriveTime()\`, and \`extractFuelStopIndices()\`.
                `
            },
            {
                heading: 'The Circular Dependency Dance',
                content: `
**The problem:**
- \`useTripCalculation\` accepts \`onCalculationComplete\` callback
- That callback needs to call \`markStepComplete()\` and \`forceStep()\` from \`useWizard\`
- But \`useWizard\` needs \`calculateTrip\` from \`useTripCalculation\` (to auto-calculate on step 2→3)

**Hooks can't reference each other before both are initialized.**

**The fix:** React.useRef as a mutable callback container:

\`\`\`typescript
const onCalcCompleteRef = React.useRef<() => void>(() => {});

const { calculateTrip } = useTripCalculation({
    onCalculationComplete: () => onCalcCompleteRef.current(),
});

const { markStepComplete, forceStep } = useWizard({
    onCalculate: calculateTrip,
});

// Wire up AFTER both hooks exist
onCalcCompleteRef.current = () => {
    markStepComplete(1);
    markStepComplete(2);
    markStepComplete(3);
    forceStep(3);
};
\`\`\`

**Pattern:** The ref holds a stable function reference that gets updated after initialization. The hook calls \`ref.current()\`, which at call-time points to the real implementation.
                `
            },
            {
                heading: 'TripPrintView: The Gold Standard Format',
                content: `
Modeled after the user's manual \`roadtrip2025.txt\` planning format — the same meticulous day-by-day breakdown that inspired the entire app:

**Per-day output includes:**
- Day title + date + day type badge
- Hotel info (name, cost, check-in/out)
- Route segments with arrival times
- Fuel stops with cost and driver assignment
- Timezone change warnings
- Daily budget breakdown (gas/hotel/food/misc)
- Running total

**Implementation:** Pure HTML string generation → inject into hidden \`<div>\` → \`window.print()\` → CSS \`@media print\` handles the rest. Zero external dependencies (no jsPDF, no html2canvas).

**560 lines** because it templates every detail the manual plan had. The goal: print the output, it looks like the spreadsheet you'd have written by hand.
                `
            }
        ]
    },

    metrics: {
        'ItineraryTimeline Before': '~550 lines',
        'Components Extracted': '5 (TimelineNode, DaySection, DriverStatsPanel, OvernightEditor, TripPrintView)',
        'TimelineNode': '343 lines',
        'TripPrintView': '560 lines',
        'OvernightEditor': '215 lines',
        'DaySection': '124 lines',
        'DriverStatsPanel': '78 lines',
        'driver-rotation.ts': '122 lines',
        'Driver Rotation Tests': '19',
        'Total Tests': '89 ✓',
        'Test Regressions': '0',
        'UI Components Enhanced': '5 (Dialog, Tooltip, Switch, Button, Label)',
        'New Files Created': '7',
        'Files Modified': '12'
    },

    codeSnippets: [
        {
            title: 'Driver Assignment Algorithm',
            badge: 'driver-rotation.ts',
            lang: 'typescript',
            code: `export function assignDrivers(
    segments: RouteSegment[],
    numDrivers: number,
    fuelStopIndices: number[] = [],
): DriverRotationResult {
    const safeDrivers = Math.max(1, numDrivers);
    let currentDriver = 1;

    // Build set of segment indices where rotation happens
    // (the segment AFTER a fuel stop)
    const rotationSet = new Set(
        fuelStopIndices
            .filter(i => i + 1 < segments.length)
            .map(i => i + 1)
    );

    const assignments: DriverAssignment[] = [];
    const stats = initDriverStats(safeDrivers);

    for (let i = 0; i < segments.length; i++) {
        if (rotationSet.has(i) && safeDrivers > 1) {
            currentDriver = (currentDriver % safeDrivers) + 1;
        }
        assignments.push({ segmentIndex: i, driver: currentDriver });
        accumulateStats(stats, currentDriver, segments[i]);
    }

    return { assignments, stats, rotationPoints: [...rotationSet] };
}`
        },
        {
            title: 'Fuel Stop Priority Rendering',
            badge: 'TimelineNode.tsx',
            lang: 'typescript',
            code: `const FUEL_PRIORITY_STYLES = {
    critical: {
        ring: 'ring-red-300',
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        badge: '🚨 Critical',
        description: 'Tank critically low — refuel immediately',
    },
    recommended: {
        ring: 'ring-orange-200',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        badge: '⚠️ Recommended',
        description: 'Good time to refuel',
    },
    optional: {
        ring: 'ring-blue-200',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        badge: '⚡ Top-Off',
        description: 'Optional — tank is healthy',
    },
};`
        },
        {
            title: 'Overnight Amenity Grid',
            badge: 'OvernightEditor.tsx',
            lang: 'typescript',
            code: `const AMENITY_OPTIONS = [
    { value: 'breakfast', emoji: '🥐', label: 'Breakfast' },
    { value: 'pool', emoji: '🏊', label: 'Pool' },
    { value: 'wifi', emoji: '📶', label: 'WiFi' },
    { value: 'parking', emoji: '🅿️', label: 'Parking' },
    { value: 'gym', emoji: '💪', label: 'Gym' },
    { value: 'restaurant', emoji: '🍽️', label: 'Restaurant' },
    { value: 'laundry', emoji: '🧺', label: 'Laundry' },
    { value: 'pet-friendly', emoji: '🐕', label: 'Pets OK' },
];

// Toggle grid: tap amenity → toggles in/out of selected list
const toggleAmenity = (value: string) => {
    setAmenities(prev =>
        prev.includes(value)
            ? prev.filter(a => a !== value)
            : [...prev, value]
    );
};`
        },
        {
            title: 'Circular Dependency Fix',
            badge: 'App.tsx',
            lang: 'typescript',
            code: `// Stable ref breaks circular dep between hooks
const onCalcCompleteRef = React.useRef<() => void>(() => {});

const { calculateTrip } = useTripCalculation({
    onCalculationComplete: () => onCalcCompleteRef.current(),
});

const { markStepComplete, forceStep } = useWizard({
    onCalculate: calculateTrip,
});

// Wire AFTER both hooks initialized
onCalcCompleteRef.current = () => {
    markStepComplete(1);
    markStepComplete(2);
    markStepComplete(3);
    forceStep(3);
};`
        }
    ],

    lessons: [
        'The 300-line limit works across projects — ItineraryTimeline hitting 550 was the signal to extract, just like UV7\'s god objects',
        'Pure algorithm functions (driver rotation) enable reuse across interactive display AND print view without duplication',
        'React.useRef callback pattern elegantly solves circular dependencies between hooks that need to reference each other',
        'Test infrastructure compounds — 19 driver rotation tests written alongside the algorithm, not after, caught 2 edge cases immediately',
        'Print view should consume the same types as interactive view — shared TripDay/RouteSegment types mean one data flow, two renderers',
        'Git commits are your recovery plan — when the machine crashes, the commit history IS the documentation',
        'Amenity toggle grids beat free-text input — users can tap 🥐🏊📶 faster than typing "breakfast, pool, wifi"',
        'Component extraction is not refactoring for fun — it\'s what makes the NEXT feature (print view) possible without copy-pasting 300 lines'
    ],

    crew: [
        {
            name: 'DiZee',
            icon: '🔪',
            contribution: 'ItineraryTimeline extraction surgery, driver rotation algorithm + 19 tests, TripPrintView, OvernightEditor, circular dep fix, UI component upgrades, crash recovery and blog reconstruction.'
        },
        {
            name: 'Aaron "Chicharon"',
            icon: '🎯',
            contribution: 'Project direction, manual roadtrip2025.txt gold standard reference, feature priorities (driver rotation > hotel search), session persistence through the crash.'
        }
    ],

    quote: {
        text: 'Git commits are your recovery plan. When the machine crashes, the commit history IS the documentation.',
        author: 'DiZee',
        context: 'After reconstructing the blog entry from commit diffs post-crash'
    },

    footer: {
        icon: '🔧',
        text: '550-line monolith → 5 components. 19 new tests. 1 crash. 0 data lost. The kitchen survived. 🔪💚'
    }
};
