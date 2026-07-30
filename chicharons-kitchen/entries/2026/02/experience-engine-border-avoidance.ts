import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    id: 'experience-engine-border-avoidance-feb-2026',
    date: 'Feb 16, 2026',
    sortDate: '2026-02-16T22:00:00',
    title: 'The Experience Engine: Route-Corridor Discovery, Border Avoidance & CI/CD',
    type: 'highlight',
    emoji: '🛂',
    tags: ['React', 'TypeScript', 'Trip Planning', 'POI Discovery', 'Border Avoidance', 'CI/CD', 'Overpass API', 'GitHub Actions'],
    modelId: 'dizee',
    summary: 'A marathon session that touched nearly every layer of the roadtrip planner. The POI suggestion system got rebranded to "The Experience Engine," then immediately leveled up: category toggles (⛽🍔🏨👁️) now search a 15km corridor along the entire route instead of just the destination. A "Stay In-Country" border avoidance system detects US/Canada crossings and auto-reroutes through Canadian corridor waypoints. Dead code got purged, the UI got polished, 231 tests pass, and GitHub Actions CI/CD means deploys happen automatically on push.',

    callout: {
        icon: '🗺️',
        title: 'The Discovery Panel Rebrand',
        text: 'What started as "POI Suggestions" became the "Discovery Panel," then evolved into "The Experience Engine" — because a good trip planner doesn\'t just route you A to B, it helps you discover what\'s between. The rebrand wasn\'t cosmetic; it reflected a shift from "here are some POIs near your destination" to "here\'s what you\'ll pass along the way."'
    },

    highlights: [
        '**Experience Engine Rebrand** — POI suggestion system renamed to Discovery Panel / Experience Engine with better UX flow',
        '**Route-Corridor Category Search** — ⛽🍔🏨👁️ toggles now use Overpass API with 15km corridor buffer along the full route, not just destination radius',
        '**Border Avoidance System** — 🛂 "Stay In-Country" toggle detects US/Canada border crossings and injects Canadian corridor guard waypoints to reroute',
        '**Guard Waypoint Regions** — 5 Canadian corridor regions (West, Lake Superior, Southern Ontario, Quebec, Maritimes) with pre-selected waypoints',
        '**Polish Round** — TripSummaryCard collapsed by default, auto-scroll on step change, Discovery Panel before overnight prompt, expandable itinerary',
        '**Dead Code Purge** — Orphaned POISuggestionsPanel.tsx (122 lines) deleted — replaced by DiscoveryPanel',
        '**Route Disclaimer** — "Routes are suggestions only — use Google Maps or your preferred navigation app" added below border toggle',
        '**CI/CD Pipeline** — GitHub Actions workflow auto-deploys to GitHub Pages on push to main',
        '**231 Tests Passing** — Up from 89, all mocks updated for new avoidBorders property, zero regressions'
    ],

    problem: {
        description: 'Three separate pain points converged: (1) The category map toggles (gas/food/hotel/sights) only searched near the destination — useless for a 2,000km road trip where you need gas in Saskatchewan, not Toronto. (2) Canadian road trips near the US border would sometimes route through America, requiring a passport. Aaron needed a "stay in Canada" option. (3) No CI/CD meant forgetting to deploy after pushing code.',
        rootCause: 'The original POI search used Nominatim with a small bounding box around a single coordinate — the destination. Category toggles called the same function, so ⛽ only showed gas stations at the end of the trip. Border avoidance wasn\'t possible with public OSRM (no `exclude=border_crossing` support). And deployments were manual `npm run deploy` commands easy to forget.'
    },

    solution: {
        approach: 'Three targeted solutions: (1) New `searchPOIsAlongRoute()` function using Overpass API with route corridor geometry, (2) Detect-and-reroute pattern with Canadian corridor guard waypoints since OSRM can\'t exclude borders, (3) GitHub Actions workflow for automatic deployment.',
        features: [
            '**searchPOIsAlongRoute()** — Takes route geometry + category, builds Overpass QL query with 15km corridor buffer, safe bbox loop, limits to 40 named results',
            '**Overpass Category Mapping** — Gas → amenity=fuel, Food → amenity∈(restaurant,cafe,fast_food), Hotel → tourism∈(hotel,motel,hostel), Sights → tourism|historic with union queries',
            '**toggleCategory() Enhancement** — Accepts optional routeGeometry param, uses corridor search when route exists, falls back to Nominatim destination search',
            '**border-avoidance.ts (190 lines)** — `getBorderLatitude(lng)` longitude-aware US/Canada border approximation, `isLikelyInUS()`, `detectBorderCrossing()` route geometry sampling',
            '**Guard Waypoints** — 5 corridor regions with pre-selected Canadian cities: West (Kamloops, Regina), Lake Superior (SSM, Thunder Bay, Kenora), Southern Ontario (London, Barrie), Quebec (Sherbrooke, Rivière-du-Loup), Maritimes (Edmundston, Fredericton)',
            '**insertGuardWaypoints()** — Merges guard waypoints with existing trip locations in travel-direction order based on longitude proximity',
            '**fetchOSRMRoute() Extraction** — Isolated OSRM API call into reusable helper, enabling normal route → detect crossing → inject guards → recalculate flow',
            '**deploy.yml** — GitHub Actions: checkout → setup Node 20 → npm ci → build → upload artifact → deploy to Pages'
        ]
    },

    technicalDetails: {
        title: 'Three Systems, One Session',
        sections: [
            {
                heading: 'Route-Corridor POI Search (Overpass API)',
                content: `
**Before:** Category toggles called \`searchNearbyPOIs()\` which used Nominatim bounded search around a single point — the destination. On a Toronto→Vancouver trip, clicking ⛽ showed gas stations in Vancouver only.

**After:** \`searchPOIsAlongRoute()\` takes the route geometry and builds an Overpass QL query:

\`\`\`typescript
// Sample every 20th coordinate for corridor bbox
for (let i = 0; i < geometry.length; i += 20) {
    const [lat, lng] = geometry[i];
    const buffer = 0.135; // ~15km
    // Build union of bboxes along route
}
\`\`\`

**Result:** Gas stations, restaurants, hotels, and sights scatter along the full route corridor. The ⛽ toggle now shows fuel stops where you'll actually need them.
                `
            },
            {
                heading: 'Border Avoidance: The Guard Waypoint Pattern',
                content: `
**The Problem:** Public OSRM doesn't support \`exclude=border_crossing\`. A Winnipeg→Toronto route naturally dips through Minnesota/Wisconsin because it's shorter.

**The Solution:** Detect-and-reroute pattern:

1. Calculate normal route
2. Sample route geometry every 10th point
3. Check each point against longitude-aware US/Canada border latitude
4. If crossing detected, identify which corridor regions are involved
5. Inject Canadian guard waypoints for those regions
6. Recalculate route with guards — OSRM routes through Canada

\`\`\`typescript
// Border latitude varies by longitude
function getBorderLatitude(lng: number): number {
    if (lng < -130) return 54.0;     // Alaska panhandle
    if (lng < -95)  return 49.0;     // 49th parallel (prairies)
    if (lng < -82)  return 46.5;     // Lake Superior region
    if (lng < -75)  return 44.0;     // Southern Ontario
    // ... Quebec, Maritimes
}
\`\`\`

**Fallback:** If the guard-waypoint route fails (OSRM error, impossible route), silently falls back to the original route. No broken UX.
                `
            },
            {
                heading: 'Polish & Housekeeping',
                content: `
**UI Polish:**
- TripSummaryCard collapsed by default so map animation is visible on load
- Auto-scroll sidebar to top on step change (\`sidebarScrollRef\`)
- Discovery Panel moved above Overnight Stop prompt (explore before deciding where to sleep)
- Expandable itinerary toggle (Maximize2/Minimize2 icons) for full-height editing

**Dead Code:**
- POISuggestionsPanel.tsx deleted (122 lines) — orphaned when DiscoveryPanel replaced it
- Duplicate itinerary removed from map overlay card (was in both overlay and sidebar)

**Test Maintenance:**
- 5 test files updated with \`avoidBorders: false\` in mock TripSettings
- IDE only caught 3; \`tsc -b\` (build) caught the remaining 2
- Lesson: always run full build before deploy, not just IDE checks
                `
            }
        ]
    },

    metrics: {
        title: 'Session Stats',
        stats: [
            { label: 'Files Modified/Created', value: '15+' },
            { label: 'New System (border-avoidance.ts)', value: '~190 lines' },
            { label: 'Dead Code Removed', value: '122 lines' },
            { label: 'Tests Passing', value: '231' },
            { label: 'Commits', value: 8 },
            { label: 'Corridor Buffer', value: '15km' },
            { label: 'Guard Waypoint Regions', value: 5 },
            { label: 'Category Toggle Types', value: '⛽🍔🏨👁️' }
        ]
    },

    details: [
        {
            title: 'Files Changed This Session',
            points: [
                '**src/lib/poi.ts** — Added searchPOIsAlongRoute() with Overpass corridor query',
                '**src/hooks/usePOI.ts** — toggleCategory accepts route geometry, uses corridor search',
                '**src/lib/border-avoidance.ts** — NEW: border detection + guard waypoints (190 lines)',
                '**src/lib/api.ts** — Extracted fetchOSRMRoute(), added detect+reroute logic',
                '**src/types/index.ts** — Added avoidBorders: boolean to TripSettings',
                '**src/contexts/TripContext.tsx** — avoidBorders: false in defaults',
                '**src/hooks/useTripCalculation.ts** — Passes avoidBorders to calculateRoute',
                '**src/components/Steps/Step2Content.tsx** — 🛂 Stay In-Country toggle + disclaimer',
                '**src/components/Steps/Step3Content.tsx** — Discovery before overnight, expandable itinerary',
                '**src/components/Trip/TripSummary.tsx** — Collapsed by default, cleaned imports',
                '**src/App.tsx** — sidebarScrollRef, scroll-to-top, validRouteGeometry passthrough',
                '**src/components/Trip/POISuggestionsPanel.tsx** — DELETED (orphaned)',
                '**.github/workflows/deploy.yml** — NEW: GitHub Actions CI/CD',
                '**5 test files** — avoidBorders: false added to mock TripSettings'
            ]
        }
    ],

    lessons: [
        {
            icon: '🔍',
            title: 'Public APIs Have Limits',
            lesson: 'OSRM doesn\'t support exclude=border_crossing. Instead of giving up, the guard waypoint pattern achieves the same result by steering the router through known-good corridors. Work WITH API limitations, not against them.'
        },
        {
            icon: '🗺️',
            title: 'Search Where Users Need Results',
            lesson: 'POI search near the destination is nearly useless for road trips. The 15km corridor buffer along the route geometry matches how people actually think about stops — "what\'s along the way?"'
        },
        {
            icon: '🏗️',
            title: 'Build Then Deploy Should Be One Step',
            lesson: 'Manual deploys get forgotten. GitHub Actions CI/CD means every push to main auto-deploys. One less thing to remember, one less thing to break.'
        },
        {
            icon: '🧪',
            title: 'IDE ≠ Full Build',
            lesson: '3 of 5 broken tests caught by IDE, 2 only caught by tsc -b during deploy. Always run the full build before shipping — TypeScript\'s project references check files the IDE might skip.'
        }
    ],

    crew: [
        {
            name: 'DiZee',
            contribution: 'Route corridor search, border avoidance system, CI/CD pipeline, UI polish',
            icon: '🔪'
        },
        {
            name: 'Chef Aaron',
            contribution: 'Feature requirements, border avoidance UX decision, trip-planning domain expertise',
            icon: '👨‍🍳'
        }
    ],

    quote: {
        text: 'A good trip planner doesn\'t just get you there — it shows you what you\'re passing.',
        author: 'DiZee',
        context: 'On rebranding from POI search to The Experience Engine'
    },

    footer: {
        icon: '🛂',
        text: 'No passport required. 🔪💚'
    }
};
