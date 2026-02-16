import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
    id: 'roadtrip-planner-v2-bougie-edition',
    date: 'Feb 15, 2026',
    sortDate: '2026-02-15T04:30:00',
    title: 'Roadtrip Planner V2: From Manual Spreadsheets to Bougie Automation',
    type: 'highlight',
    emoji: '🗺️',
    tags: ['React', 'TypeScript', 'Trip Planning', 'Budget Intelligence', 'Refactoring', 'V2'],
    modelId: 'dizee',
    summary: 'A weekend trip planner evolved into a power user\'s dream for multi-day odysseys. Started with 1,405-line App.tsx spaghetti, ended with flexible day planning, activity time slots, per-category budgets, and 90-95% parity with meticulous manual planning—all in a clean 507-line architecture.',

    callout: {
        icon: '🎯',
        title: 'The Pivot That Mattered',
        text: 'When asked to build a themed route builder for oddly-named Canadian towns, the user said "too variable." Instead: "What about activity time slots and flexible days?" Two practical features beat one bougie abstraction. The app now matches the detail level of a manual Winnipeg→Toronto spreadsheet.'
    },

    highlights: [
        '**Phase 0: Refactoring Chaos** — App.tsx reduced from 1,405 → 507 lines (64% reduction) via custom hooks, context API, and step components',
        '**Phase C: Budget Intelligence** — Per-category tracking (gas/hotel/food/misc) with Budget/Moderate/Comfort profiles, daily breakdowns, running totals',
        '**Phase 6.1: Flexible Days** — 3 day types (planned/flexible/free) with multiple options, radio selection, decision notes',
        '**Phase 7.1: Activity Time Slots** — 9 categories (📸🍽️🏛️🛍️🌲☕⛽), time windows, cost tracking, "must-do" toggle',
        '**Progressive Enhancement** — 8 optional handlers in ItineraryTimeline, features only appear when provided (backward compatible)',
        '**Type System Extension** — Added Activity, DayType, DayOption to existing types without breaking changes',
        '**Testing Infrastructure** — 70 tests (Vitest + RTL) covering calculations, budgets, arrival times, fuel stops',
        '**Smart Stop Suggestions** — Fuel (tank < 20%), rest (every 2h), meals (12pm/6pm), overnight (max drive hours)',
        '**Timezone Intelligence** — Amber alerts for timezone changes, arrival times with abbreviations (CST/MST)'
    ],

    problem: {
        description: 'User had detailed manual trip plans (Winnipeg→Toronto 2025) with day-by-day breakdowns, budget tracking, activity schedules, and hotel research. Creating these manually required spreadsheets, Google Maps research, fuel calculators, and hours of tedious data entry. Needed automation WITHOUT losing the refinement.',
        rootCause: 'Existing app was a "quick trip tool" — single-day focus, no budget granularity, no flexible planning, and 1,405-line App.tsx that made new features a nightmare to add. Architecture couldn\'t scale to multi-day odysseys.'
    },

    solution: {
        approach: 'Three-phase evolution: (1) Refactor architecture to enable rapid feature development, (2) Build budget intelligence layer with per-category tracking, (3) Add flexible planning features (activity slots, free days, multiple options) based on actual user needs, not hypothetical abstractions.',
        features: [
            '**Custom Hooks Extraction** — useTripCalculation (route logic), useJournal (tracking), usePOI (suggestions), useWizard (step validation)',
            '**TripContext Provider** — Shared state (locations, vehicle, settings, summary) eliminates prop drilling across 3 wizard steps',
            '**Step Components** — Step1Content (route), Step2Content (vehicle/budget), Step3Content (results/journal) replace monolithic JSX',
            '**Budget Profiles** — Preset modes (Budget: $50/day hotel, Moderate: $100, Comfort: $150+) with per-person costs',
            '**splitTripByDays()** — Auto-divides trip into days based on maxDriveHours, calculates daily budgets, tracks running totals',
            '**DayTypeToggle** — 3-button selector (📋 Planned / 🔀 Flexible / ☕ Free) with visual badges',
            '**FlexibleDayCard** — Multiple option support with radio selection, add/remove options, decision notes textarea',
            '**FreeDayCard** — Simple card for days with no fixed plans, editable title, notes field, $0 budget indicator',
            '**ActivityEditor Dialog** — Full modal for time windows (HH:mm), 9 categories, cost, URL, notes, "must-do" star toggle',
            '**ActivityBadge** — Compact inline display (emoji + name + time) in timeline, click to edit',
            '**Overlay Guards** — Keyboard handlers check for open modals before processing Enter/arrows (learned from bug squashing)'
        ]
    },

    technicalDetails: {
        title: 'The Architecture Evolution',
        sections: [
            {
                heading: 'The 64% Reduction (1,405 → 507 Lines)',
                content: `
**Before:** App.tsx was a 1,405-line monster with route calculation, fuel stops, overnight prompts, POI fetching, wizard navigation, journal state, and all three step UIs in one file.

**After:** Clean separation of concerns:
- **useTripCalculation** (200 lines) — handleCalculate, arrival times, round trip logic
- **useJournal** (75 lines) — activeJournal state, start/update/load
- **usePOI** (140 lines) — fetchRoutePOIs, marker categories, suggestions
- **useWizard** (80 lines) — step navigation, validation (canProceedFromStep1/2)
- **TripContext** (170 lines) — locations, vehicle, settings, updateLocation(), addWaypoint()
- **Step1/2/3Content** (165/320/135 lines) — Wizard step UIs

**Key Pattern:** Custom hooks return focused slices of logic, context provides shared state, components stay under 350 lines.
                `
            },
            {
                heading: 'Type System Extension (Zero Breaking Changes)',
                content: `
Added new types for flexible planning WITHOUT touching existing RouteSegment/TripDay structure:

\`\`\`typescript
// New types
export type ActivityCategory = 'photo' | 'meal' | 'attraction' | ...;
export type DayType = 'planned' | 'flexible' | 'free';

export interface Activity {
    name: string;
    category: ActivityCategory;
    plannedStartTime?: string;  // "10:30"
    plannedEndTime?: string;    // "12:00"
    durationMinutes?: number;
    cost?: number;
    isRequired?: boolean;
}

export interface DayOption {
    id: string;
    name: string;
    segments: RouteSegment[];
    estimatedCost?: number;
    highlights?: string[];
}

// Extended existing types (all fields optional)
interface RouteSegment {
    // ... existing fields
    activity?: Activity;  // NEW
}

interface TripDay {
    // ... existing fields
    dayType?: DayType;           // NEW
    options?: DayOption[];       // NEW
    selectedOption?: number;     // NEW
    notes?: string;              // NEW
}
\`\`\`

**Backward Compatibility:** All new fields optional. Existing trips still work. Progressive enhancement pattern.
                `
            },
            {
                heading: 'Progressive Enhancement (8 Optional Handlers)',
                content: `
ItineraryTimeline accepts 8 new optional handlers. Features only render when handlers provided:

\`\`\`typescript
interface ItineraryTimelineProps {
    onUpdateActivity?: (segmentIndex: number, activity: Activity | undefined) => void;
    onUpdateDayType?: (dayNumber: number, dayType: DayType) => void;
    onUpdateDayNotes?: (dayNumber: number, notes: string) => void;
    onUpdateDayTitle?: (dayNumber: number, title: string) => void;
    onAddDayOption?: (dayNumber: number, option: DayOption) => void;
    onRemoveDayOption?: (dayNumber: number, optionIndex: number) => void;
    onSelectDayOption?: (dayNumber: number, optionIndex: number) => void;
}
\`\`\`

**Conditional Rendering:**
- No handlers? Basic timeline with day headers
- \`onUpdateActivity\`? "Add Activity" buttons appear
- \`onUpdateDayType + onAddDayOption + ...\`? Full flexible day UI

**Result:** Journal mode (read-only) and planning mode (interactive) share the same component.
                `
            },
            {
                heading: 'Budget Intelligence Layer',
                content: `
**splitTripByDays()** algorithm:
1. Start on departure day with empty currentDay
2. For each segment:
   - Add segment to currentDay
   - Calculate cumulative drive time
   - If exceeds maxDriveHours → finalize currentDay, start new day
3. Calculate per-day budgets:
   - Gas: sum of fuelCost for segments in day
   - Hotel: settings.budget.hotel (if overnight)
   - Food: settings.budget.dailyFood
   - Misc: settings.budget.dailyMisc
4. Track running totals across days

**DailyBudgetCard** displays:
- Per-category costs with icons (⛽💵🍽️🎒)
- Running total bar (green: under budget, amber: close, red: over)
- Status indicators based on budget mode

**Budget Profiles** (BudgetInput component):
- Budget: $50 hotel, $40 food, $20 misc
- Moderate: $100 hotel, $60 food, $30 misc
- Comfort: $150 hotel, $80 food, $50 misc

Per-person costs automatically calculated: \`cost / travelers\`
                `
            },
            {
                heading: 'The Test Suite (70 Tests, 0 Regressions)',
                content: `
**Setup:** Vitest + React Testing Library

**Coverage:**
- \`calculations.test.ts\` (50 tests) — calculateTripCosts, calculateArrivalTimes, getDayNumber, formatDistance
- \`budget.test.ts\` (20 tests) — splitTripByDays, per-category totals, running budget tracking

**Key Test Fixes During Build:**
1. Added \`fuelNeededLitres: 0, fuelCost: 0\` to all mock RouteSegments (new required fields)
2. Changed BudgetMode from 'limited' → 'plan-to-budget' (type error)
3. Fixed timezone-dependent test by checking Date hours/minutes instead of ISO string
4. Added \`import { vi } from 'vitest'\` to setup.ts for localStorage mock

**Result:** All features built with tests passing. No "we'll test later" debt.
                `
            }
        ]
    },

    metrics: {
        'App.tsx Reduction': '1,405 → 507 lines (64%)',
        'Custom Hooks Created': '4',
        'Context Providers': '1 (TripContext)',
        'Step Components': '3',
        'New Types Added': '3 (Activity, DayType, DayOption)',
        'Optional Type Fields': '8',
        'Optional Timeline Handlers': '8',
        'Activity Categories': '9',
        'Day Types': '3',
        'Budget Profiles': '3',
        'Tests (Passing)': '70 ✓',
        'Test Regressions': '0',
        'Manual Plan Parity': '90-95%'
    },

    codeSnippets: [
        {
            title: 'Progressive Enhancement Pattern',
            badge: 'ItineraryTimeline.tsx',
            lang: 'typescript',
            code: `// Render different UI based on day type and available handlers
if (dayType === 'free' && onUpdateDayNotes && onUpdateDayTitle) {
    return (
        <>
            <DayHeader day={day} editable={!!onUpdateDayType} 
                       onDayTypeChange={onUpdateDayType} />
            <FreeDayCard day={day} 
                         onNotesChange={(notes) => onUpdateDayNotes(day.dayNumber, notes)}
                         onTitleChange={(title) => onUpdateDayTitle(day.dayNumber, title)} />
        </>
    );
}

if (dayType === 'flexible' && onAddDayOption && onRemoveDayOption && onSelectDayOption) {
    return (
        <>
            <DayHeader day={day} editable={!!onUpdateDayType} />
            <FlexibleDayCard day={day}
                             onSelectOption={(idx) => onSelectDayOption(day.dayNumber, idx)}
                             onAddOption={(opt) => onAddDayOption(day.dayNumber, opt)}
                             onRemoveOption={(idx) => onRemoveDayOption(day.dayNumber, idx)} />
        </>
    );
}

// Default: planned day
return <DayHeader day={day} editable={!!onUpdateDayType} />;`
        },
        {
            title: 'Activity Editor Dialog',
            badge: 'ActivityEditor.tsx',
            lang: 'typescript',
            code: `const handleSave = () => {
    if (!name.trim()) return;

    const durationMinutes = startTime && endTime
        ? calculateDuration(startTime, endTime)
        : undefined;

    const newActivity: Activity = {
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        plannedStartTime: startTime || undefined,
        plannedEndTime: endTime || undefined,
        durationMinutes,
        cost: cost ? parseFloat(cost) : undefined,
        notes: notes.trim() || undefined,
        url: url.trim() || undefined,
        isRequired,
    };

    onSave(newActivity);
    onOpenChange(false);
};`
        },
        {
            title: 'Budget Splitting Algorithm',
            badge: 'budget.ts',
            lang: 'typescript',
            code: `export function splitTripByDays(
    summary: TripSummary,
    settings: TripSettings
): TripDay[] {
    const maxDriveMinutes = settings.maxDriveHoursPerDay * 60;
    const days: TripDay[] = [];
    let currentDay: TripDay = createNewDay(1, departureDate, settings);

    for (const segment of summary.segments) {
        currentDay.segments.push(segment);
        currentDay.totals.driveTimeMinutes += segment.durationMinutes;
        currentDay.totals.distanceKm += segment.distanceKm;

        // Check if we need to split into a new day
        if (currentDay.totals.driveTimeMinutes >= maxDriveMinutes) {
            currentDay.overnight = calculateOvernightStop(currentDay, settings);
            days.push(currentDay);
            currentDay = createNewDay(days.length + 1, nextDayDate, settings);
        }
    }

    // Calculate running budget totals
    let runningTotal = 0;
    for (const day of days) {
        runningTotal += day.budget.total;
        day.budget.runningTotal = runningTotal;
    }

    return days;
}`
        },
        {
            title: 'Context Provider Pattern',
            badge: 'TripContext.tsx',
            lang: 'typescript',
            code: `export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [locations, setLocations] = useState<Location[]>(initialLocations);
    const [vehicle, setVehicle] = useState<Vehicle>(getDefaultVehicle());
    const [settings, setSettings] = useState<TripSettings>(defaultSettings);
    const [summary, setSummary] = useState<TripSummary | null>(null);

    const updateLocation = (index: number, updates: Partial<Location>) => {
        setLocations(prev => prev.map((loc, i) => 
            i === index ? { ...loc, ...updates } : loc
        ));
    };

    const addWaypoint = () => {
        const newWaypoint: Location = {
            id: \`waypoint-\${Date.now()}\`,
            name: '',
            lat: 0,
            lng: 0,
            type: 'waypoint'
        };
        setLocations(prev => [...prev.slice(0, -1), newWaypoint, prev[prev.length - 1]]);
    };

    return (
        <TripContext.Provider value={{
            locations, setLocations, updateLocation, addWaypoint,
            vehicle, setVehicle,
            settings, setSettings,
            summary, setSummary
        }}>
            {children}
        </TripContext.Provider>
    );
};`
        }
    ],

    lessons: [
        'Refactor BEFORE adding features — the 64% App.tsx reduction made phases C/6/7 possible in days instead of weeks',
        'Listen to "too variable" feedback — the themed route builder would\'ve been a complexity sink, activity slots were the real need',
        'Progressive enhancement > feature flags — optional handlers let features coexist without configuration',
        'Type system extensions beat parallel structures — adding optional fields to existing types maintains backward compatibility',
        'Test infrastructure pays compound interest — 70 tests caught type errors during refactoring before runtime',
        'Manual plan parity is the north star — hitting 90-95% meant the app actually replaced spreadsheets, not just supplemented them',
        'Budget profiles beat custom inputs — users prefer "Moderate" over manually entering 5 dollar amounts',
        'The pivot moment matters — "what about activity time slots and flexible days?" turned a weekend project into a power tool'
    ],

    crew: [
        {
            name: 'DiZee',
            icon: '🤖',
            contribution: 'Architecture refactoring, budget intelligence system, flexible day planning, activity editor, type system design, 70 tests maintained, all code generation and debugging.'
        },
        {
            name: 'Aaron "Chicharon"',
            icon: '🎯',
            contribution: 'Project vision, manual planning expertise (Winnipeg→Toronto reference), critical pivot ("too variable" → practical features), requirements refinement, final assessment.'
        }
    ],

    quote: {
        text: 'Two practical features beat one bougie abstraction. The app now matches the detail level of a manual spreadsheet.',
        author: 'DiZee',
        context: 'After pivoting from themed route builder to activity slots + flexible days'
    },

    footer: {
        icon: '🗺️',
        text: '1,405 lines → 507. 3 phases. 70 tests. 90% manual plan parity. Road trips just got bougie. 🚗✨🎒'
    }
};
