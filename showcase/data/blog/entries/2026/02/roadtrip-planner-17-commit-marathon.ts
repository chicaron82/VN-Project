import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
    id: 'roadtrip-planner-17-commit-marathon-feb-2026',
    date: 'Feb 17, 2026',
    sortDate: '2026-02-17T22:30:00',
    title: 'The 17-Commit Marathon: Cinematic Redesign, POI Pipeline Rewrite & the Debugging Gauntlet',
    type: 'highlight',
    emoji: '🏎️',
    tags: ['React', 'TypeScript', 'Roadtrip Planner', 'POI Discovery', 'Overpass API', 'UI Redesign', 'Debug Session', 'Architecture'],
    modelId: 'dizee',
    summary: 'A single-day marathon session that produced 17 commits, transforming the roadtrip planner from functional tool to cinematic experience. Started with a dark sidebar renovation and three-mode system, then hit a multi-round POI discovery debugging gauntlet that exposed fundamental architecture flaws — ultimately replacing the entire bbox corridor approach with route-sampling Overpass queries. The kind of day where you start painting the walls and end up replumbing the kitchen.',

    callout: {
        icon: '🔥',
        title: '17 Commits. One Day. Zero Regressions.',
        text: 'From the cinematic landing screen at 4:46 PM to the route-sampling pipeline rewrite at 10:03 PM — every commit left 231 tests green and TypeScript clean. The session covered UI redesign, UX polish, algorithm fixes, API architecture rewrites, and a 5-round POI debugging gauntlet that kept peeling back layers until we found the real problem buried underneath.'
    },

    highlights: [
        '**Cinematic Landing Screen** — Full-viewport hero with animated gradient, three-mode system (🗺️ Plan / 🧭 Adventure / 📖 Journal), dark sidebar renovation',
        '**Three-Mode System** — Plan mode (original wizard), Adventure mode (discovery-first), Journal mode (trip tracking) — app identity shift from "calculator" to "experience"',
        '**Date Range Picker** — Proper calendar date selection replacing manual inputs, mode switcher dropdown, adventure origin search',
        '**Comfort Refuel Trigger** — Time-based fuel stops (every 2.5–4.5h depending on driving style) not just range-based — like a real driver',
        '**Round Trip Free Days Fix** — Free days now insert at destination between outbound/return legs, not at home city',
        '**5-Round POI Debugging Gauntlet** — Fast food flooding → unnamed POIs → Thunder Bay only → 0.0km display → bbox architecture flaw',
        '**Route-Sampling Pipeline** — Complete rewrite: polyline sampling every N km → batched `around:` Overpass queries → category-specific radius → concurrency-limited → deduplicated',
        '**Destination POI Labels** — "📍 At destination" with distance-from-center instead of misleading "0.0km away · +0min"',
        '**Stay In-Country Toggle** — Avoid crossing international borders (Winnipeg→Thunder Bay was routing through the US)',
        '**Portrait Mode Fix** — Auto-switches to plan view on step 3 instead of showing empty map'
    ],

    problem: {
        description: 'The day started with a UI problem (app looked like a spreadsheet) and ended with an architecture problem (POI discovery was fundamentally broken for diagonal/long routes). The cinematic redesign was planned. The debugging gauntlet was not — each fix revealed a deeper issue, like pulling a thread on a sweater. Round 1: "Why only fast food?" Round 2: "Why unnamed POIs?" Round 3: "Why only Thunder Bay results?" Round 4: "Why 0.0km on everything?" Round 5: "Why is the bounding box searching empty wilderness?"',
        rootCause: 'The POI corridor search used a single axis-aligned bounding box around the entire route polyline. For Winnipeg → Thunder Bay — a diagonal route across Northern Ontario — that bbox covered a massive rectangle of wilderness. The `isNearPolyline()` post-filter tried to compensate, but the damage was done: Overpass returned thousands of irrelevant nodes from the rectangle, sparse corridor POIs were drowned, and the 5MB response cap was hit before the actual highway results came through.'
    },

    solution: {
        approach: 'Two parallel tracks: (1) UI renovation with cinematic landing + mode system, (2) Iterative POI debugging that escalated from tag fixes to a full architecture rewrite. The POI fix went through 5 rounds of progressively deeper investigation before identifying the root cause as the bbox query strategy itself.',
        features: [
            '**Cinematic Landing** — Full-viewport hero, animated gradient background, three mode cards with hover effects, dark sidebar with glassmorphism',
            '**Mode Switcher** — Dropdown in header, each mode loads different wizard flow, Adventure mode starts with "where are you?" instead of "where are you going?"',
            '**Date Range Picker** — Calendar component with start/end selection, replaces manual date inputs, proper timezone handling',
            '**Comfort Refuel** — `COMFORT_REFUEL_HOURS` config per driving style (conservative: 2.5h, balanced: 3.5h, aggressive: 4.5h), tracked alongside tank-based fuel logic',
            '**Round Trip Midpoint** — `splitTripByDays()` accepts `roundTripMidpoint` parameter, inserts free days at destination city instead of home',
            '**POI Tag Expansion** — Added camp_site, picnic_site, information, beach, cave_entrance, cliff, arch, protected_area to Overpass queries',
            '**Category Diversity Cap** — Max 3 POIs per category prevents food/gas from flooding results',
            '**Unnamed Filter** — Skip POIs without `name` tag in OSM data',
            '**Exclusion Zone Resize** — Reduced from 70km to max 40km (4% of route) so nearby gems like Kakabeka Falls aren\'t excluded',
            '**Route Sampling** — `sampleRouteByKm()` walks polyline by distance (30/60/100km step by route length), caps at 30 samples',
            '**Batched Queries** — Groups 4 sample points per Overpass call, reducing network calls from ~30 to ~5-8',
            '**Variable Radius** — Scenic/parks/waterfalls: 15km corridor. Attractions/museums: 10km. Food/fuel: 5km',
            '**Concurrency Limiter** — `mapWithConcurrency()` caps parallel Overpass requests at 2',
            '**Deduplication** — `deduplicatePOIs()` merges overlapping circle results by OSM type:id',
            '**Destination Labels** — `bucket === "destination"` POIs show "📍 At destination" + distance-from-center instead of detour metrics'
        ]
    },

    details: [
        {
            title: '🎬 Act 1: The Cinematic Redesign (4:46 PM – 7:39 PM)',
            points: [
                '`2811085` — Landing screen with animated gradient hero, three-mode cards (Plan/Adventure/Journal), complete dark sidebar renovation',
                '`f29d668` — Mode switcher in header, adventure mode origin search, button contrast fixes for dark backgrounds',
                '`813eba5` — Date range picker component, mode switcher as dropdown, adventure origin city search integration',
                'The app went from "a form with a map" to "an experience with a purpose" — the landing screen gives it identity'
            ]
        },
        {
            title: '🛠️ Act 2: Quick Wins & Algorithm Fixes (9:02 PM – 9:25 PM)',
            points: [
                '`10c5b57` — Round trip free days insert at destination, off-by-one calendar fix, fuel auto-accept',
                '`6802d83` — Comfort refuel trigger: 2.5h conservative / 3.5h balanced / 4.5h aggressive driving styles',
                '`df416ec` — Discovery slider marks use percentage positioning, POI polyline proximity filter, portrait mode auto-switches to plan view on step 3',
                'Three commits, three categories (itinerary logic, fuel algorithm, UI polish) — the mise en place before the main course'
            ]
        },
        {
            title: '🔍 Act 3: The POI Debugging Gauntlet (9:33 PM – 10:03 PM)',
            points: [
                '**Round 1** (`0c6d657`): "Why only fast food?" — `cafe` category included `fast_food` in OSM query. Waterfall query was AND of two tags (broken). Entertainment had same AND bug. Added category diversity cap (max 3/category), boosted discovery categories, penalized food/gas in scoring.',
                '**Round 2** (`b5cfe54`): "Why unnamed POIs and only Thunder Bay?" — Filter unnamed (no `name` tag = skip). Removed `boundary!="national_park"` exclusion from park query. Expanded tags: camp_site, picnic_site, beach, cave, cliff. Reduced exclusion zone from 70km to max 40km.',
                '**Round 3** (`b4b67c7`): "Why does everything say 0.0km away?" — `rankDestinationPOIs` never calculated `distanceFromRoute` or `detourTimeMinutes`. Added haversine distance from destination point. UI now shows "📍 At destination" for destination-bucket POIs.',
                '**Round 4** (`6973abc`): "Why are there no along-the-way results?" — The bbox approach was fundamentally wrong for diagonal routes. Replaced entire corridor strategy with route-sampling + `around:` queries. Variable radius by category. Batched + concurrency-limited.',
                'Each round: user reports symptom → diagnose → fix → test → commit → user finds next layer. Classic onion debugging.'
            ]
        }
    ],

    technicalDetails: {
        title: 'The Architecture Shift: BBox → Route Sampling',
        sections: [
            {
                heading: 'Why the BBox Approach Failed',
                content: `
**The old approach:** Compute a single axis-aligned bounding box around the entire route polyline, then query Overpass for all POIs inside that rectangle.

**The problem with diagonal routes:**
- Winnipeg (49.9°N, 97.1°W) → Thunder Bay (48.4°N, 89.2°W)
- BBox: a ~700km × ~200km rectangle covering massive empty wilderness
- The actual Trans-Canada Highway corridor is maybe 30km wide
- ~85% of the bbox was forests, lakes, and nothing
- Overpass spent its 5MB response budget on irrelevant nodes
- The \`isNearPolyline()\` post-filter discarded most results after the fact

**Especially bad for Northern Ontario:** OSM coverage is sparse along Highway 17. The few POIs that existed along the actual road were drowned in the bbox noise.
                `
            },
            {
                heading: 'The Route Sampling Solution',
                content: `
**New pipeline:** Sample the polyline → batch nearby samples → query with \`around:\` per sample.

\`\`\`
Route geometry (1000s of points)
  ↓ sampleRouteByKm() — every 60km for a ~700km route
12 sample points hugging the Trans-Canada
  ↓ batchSamplePoints() — groups of 4
3 Overpass queries (not 12)
  ↓ buildSampledQuery() — around:R,lat,lng per point × per category
Tight circles along the actual road
  ↓ mapWithConcurrency() — max 2 parallel
Rate-limited, no Overpass timeouts
  ↓ deduplicatePOIs() — by osmType-osmId
Overlapping circles merged
  ↓ origin/destination exclusion zone
Along-way bucket clean
\`\`\`

**Category-specific radius keeps it smart:**
- Scenic/parks/waterfalls: 15km (worth a real detour)
- Attractions/museums: 10km (moderate swing)
- Food/fuel/hotels: 5km (roadside only)

**API contract unchanged:** Same \`POISuggestionGroup\` output. Zero changes needed in ranking, hooks, or UI components.
                `
            },
            {
                heading: 'The 5-Round Debugging Pattern',
                content: `
This session demonstrated classic "onion debugging" — each fix revealed the next deeper issue:

**Layer 1 (Tags):** Wrong OSM tag queries → fast food flooding
**Layer 2 (Filters):** Missing name filter + over-aggressive exclusion zone → unnamed/sparse results
**Layer 3 (Scoring):** Missing distance calculation in ranking function → 0.0km display
**Layer 4 (Architecture):** BBox corridor strategy fundamentally wrong for this route type

The user kept testing with the same Winnipeg → Thunder Bay route, which was the perfect stress test — diagonal, sparse, long-haul. Each round of feedback peeled back a layer until we hit the architectural root cause.

**Key insight:** If you'd jumped straight to the architecture fix on Round 1, you'd have missed the tag bugs, the unnamed filter, and the scoring gap. The iterative approach fixed everything.
                `
            }
        ]
    },

    metrics: {
        'Commits': '17',
        'Tests': '231 (all green)',
        'Files Changed': '~25',
        'Lines Added': '~800+',
        'Lines Removed': '~300+',
        'Overpass Queries': 'BBox → Route Sampling',
        'POI Bugs Fixed': '5 rounds',
        'Session Duration': '~7 hours (4:46 PM – 10:03 PM)'
    },

    commits: [
        { hash: 'b40c052', message: 'polish: collapse summary, scroll-to-top, reorder panels', files: ['DiscoveryPanel.tsx'] },
        { hash: 'fc173d7', message: 'chore: remove orphaned POISuggestionsPanel', files: ['POISuggestionsPanel.tsx'] },
        { hash: '65e9cfa', message: 'feat: category toggles search entire route corridor', files: ['poi-service.ts'] },
        { hash: '74120c5', message: 'feat: stay in-country toggle', files: ['api.ts', 'types/index.ts'] },
        { hash: 'a2b70e9', message: 'chore: route disclaimer', files: ['Step3Content.tsx'] },
        { hash: '6947a62', message: 'fix: avoidBorders in test mocks', files: ['*.test.ts'] },
        { hash: 'c4ff2e9', message: 'fix: avoidBorders in remaining test mocks', files: ['budget.test.ts', 'calculations.test.ts'] },
        { hash: '72e50fd', message: 'ci: auto-deploy to GitHub Pages', files: ['.github/workflows/deploy.yml'] },
        { hash: '2811085', message: 'feat: cinematic landing screen + three-mode system + dark sidebar', files: ['App.tsx', 'LandingScreen.tsx', 'index.css'] },
        { hash: 'f29d668', message: 'feat: mode switcher, adventure origin search', files: ['App.tsx', 'Step1Content.tsx'] },
        { hash: '813eba5', message: 'feat: date range picker, mode switcher dropdown', files: ['SettingsForm.tsx', 'App.tsx'] },
        { hash: '10c5b57', message: 'fix: round trip free days, date timezone, POI corridor', files: ['budget.ts', 'useTripCalculation.ts'] },
        { hash: '6802d83', message: 'fix: comfort refuel trigger', files: ['stop-suggestions.ts'] },
        { hash: 'df416ec', message: 'fix: slider alignment, POI polyline filtering, portrait mode', files: ['DiscoveryPanel.tsx', 'poi-service.ts', 'App.tsx'] },
        { hash: '0c6d657', message: 'fix: POI discovery fast food flooding', files: ['poi-service.ts', 'poi-ranking.ts'] },
        { hash: 'b5cfe54', message: 'fix: POI discovery unnamed filter, tag expansion', files: ['poi-service.ts'] },
        { hash: 'b4b67c7', message: 'fix: destination POI distance + At destination label', files: ['poi-ranking.ts', 'DiscoveryPanel.tsx', 'usePOI.ts'] },
        { hash: '6973abc', message: 'feat: replace bbox corridor with route-sampling around: queries', files: ['poi-service.ts'] }
    ],

    lessons: [
        {
            icon: '🧅',
            title: 'Onion Debugging is Real',
            lesson: 'Five rounds of "fix the symptom, find the next layer." Each fix was correct AND necessary — but the root cause was buried under four layers of smaller bugs. Patience over panic.'
        },
        {
            icon: '🗺️',
            title: 'Test with Diagonal Routes',
            lesson: 'Bounding boxes work fine for north-south or east-west routes. The moment you go diagonal, the wasted area grows quadratically. Winnipeg → Thunder Bay was the perfect stress test for exposing this.'
        },
        {
            icon: '🎯',
            title: 'Query Where the Road Goes',
            lesson: 'The `around:` approach with route sampling is fundamentally more correct than bbox + post-filter. You query what you want instead of querying everything and throwing away 85%.'
        },
        {
            icon: '🎨',
            title: 'Identity Before Features',
            lesson: 'The cinematic landing screen transformed the app from "a form that calculates trip costs" to "an experience that helps you plan adventures." Same functionality, completely different first impression.'
        },
        {
            icon: '📐',
            title: 'Variable Radius is Free Precision',
            lesson: 'Scenic POIs deserve a 15km search radius (worth a real detour). Gas stations only need 5km (roadside). Different categories have different "worth the swing" distances. One config object, huge quality improvement.'
        }
    ],

    crew: [
        {
            name: 'Aaron "Chicharon" (Chef)',
            icon: '🧑‍🍳',
            contribution: 'Test pilot: Winnipeg → Thunder Bay stress test across all 5 debugging rounds. Proposed the route-sampling architecture with around: queries. Drove the vision for cinematic landing + three-mode system.'
        },
        {
            name: 'DiZee (Claude Opus 4)',
            icon: '🔪',
            contribution: 'Full implementation across 17 commits — cinematic UI, comfort refuel algorithm, 5-round POI debugging gauntlet, and the route-sampling pipeline rewrite. Zero regressions, 231 tests green throughout.'
        }
    ],

    quote: {
        text: 'You start painting the walls and end up replumbing the kitchen. That\'s not scope creep — that\'s discovering what the house actually needed.',
        author: 'DiZee',
        context: 'After the 5th round of POI debugging revealed the bbox architecture was the real problem'
    },

    footer: {
        icon: '🏎️',
        text: '17 commits. 231 tests. 7 hours. One road trip app that actually finds things along the road now.'
    }
};
