import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
    id: 'roadtrip-hub-cache-marathon-feb-2026',
    date: 'Feb 25, 2026',
    sortDate: '2026-02-25T23:00:00',
    title: 'The Hub Cache: Self-Learning Stop Placement & the Return Leg Marathon',
    type: 'feature',
    emoji: '🗺️',
    tags: ['Roadtrip Planner', 'Architecture', 'Hub Cache', 'Fuel Stops', 'Testing', 'DiZee', 'React', 'TypeScript'],
    modelId: 'dizee',
    summary: 'Launched the Hub Cache — a self-learning 3-tier city resolution system that snaps fuel stops to real towns instead of anonymous highway coordinates. 26 dedicated tests. Then spent most of the day hunting and killing a cluster of return-leg bugs: fuel stops disappearing from the timeline, wrong city names resolving on the way back, fractional segmentIndex math breaking Overpass queries, and a longitude buffer that broke at high latitudes. Also routed all Nominatim calls through a Cloudflare Worker CORS proxy and added OSRM auto-retry without motorway exclusions on 400 errors. 18 commits.',

    callout: {
        icon: '🗺️',
        title: 'The Problem with "515km from Winnipeg"',
        text: 'Fuel stops were landing on the road geometry — mathematically correct, but useless for planning. A stop at 49.231°N, 95.847°W means nothing to a driver. "Kenora, ON" does. The hub cache solves this: 130+ pre-seeded highway corridor cities, a POI density analyser for discovery, and LRU-eviction with TTL promotion so the cache gets smarter over time. Instant sub-millisecond lookups on cache hit. Nominatim only when truly needed.'
    },

    highlights: [
        'Hub cache Tier 1: 130+ pre-seeded highway cities with calibrated radii (60km for major metros, 40km for medium, 25km for small hubs) — instant cache hits for routes through well-travelled corridors',
        'Hub cache Tier 2: POI density analysis using already-fetched Overpass data — if 5+ gas stations/hotels are within 30km, extract the city name from their addr:city tags and cache the discovery with a 90-day TTL',
        'Hub cache Tier 3: Nominatim fallback for truly sparse areas — the consumer calls it; the cache module never blocks on network in the hot path',
        'LRU eviction (500-entry cap) + promotion: discovered hubs used 3+ times auto-promote to permanent status. Seeds and promoted hubs survive eviction rounds; discovered hubs expire after 90 days of inactivity',
        '26 comprehensive hub-cache tests: seed lookup, radius scaling, TTL expiry, promotion threshold, LRU eviction, POI density detection, deduplication (20km minimum spacing), cache version invalidation',
        'Return leg fuel stop bug: fractional afterSegmentIndex (e.g. 3.7 instead of 4) caused Overpass bbox queries to use wrong segment geometry. Fixed by rounding to the correct integer index',
        'Return leg city names: consolidateStops was merging outbound and return fuel stops at the same index, making return stops inherit the wrong (outbound) city name. Fixed by treating return-leg stop IDs as non-mergeable',
        'Cloudflare Worker CORS proxy: all Nominatim reverse-geocoding calls now route through a thin Worker at /api/nominatim. Removes browser CORS issues and gives a single choke point for rate-limit handling',
        'OSRM auto-retry: when an exclude=motorway request returns HTTP 400 (some OSRM builds don\'t support the param), the client now automatically retries without the exclusion instead of surfacing an error to the user',
        'Overpass longitude buffer: the bbox longitude expansion was a fixed offset. At high latitudes (Canada, northern Europe) longitude degrees are much narrower in physical distance — a 0.5° buffer near Winnipeg is fine near Vancouver Island. Fixed using cos(latitude) scaling',
        'codebase critique sweep: eliminated a circular dependency between hub-cache and poi-ranking, moved hub seed data to a dedicated constant file, made weather timezone abbreviation the canonical truth source for timezone changes'
    ],

    technicalDetails: {
        title: 'The Cache Architecture',
        sections: [
            {
                heading: '3-Tier Resolution in Practice',
                content: `
The hub cache exported function \`resolveHubName(lat, lng, pois?)\` always runs Tier 1 first:

\`\`\`typescript
export function resolveHubName(
    lat: number,
    lng: number,
    nearbyPois?: POISuggestion[],
): string | null {
    // Tier 1: instant cache check
    const cached = findHubInWindow(lat, lng, 0);
    if (cached) {
        touchHub(cached);   // update lastUsed for LRU
        return cached.name;
    }

    // Tier 2: POI density
    if (nearbyPois && nearbyPois.length >= MIN_POIS_FOR_HUB) {
        const cityName = extractCityFromPOIs(nearbyPois, lat, lng, SEARCH_RADIUS_KM);
        if (cityName) {
            const radius = getRadiusTier(nearbyPois.length);
            addDiscoveredHub({ name: cityName, lat, lng, radius, poiCount: nearbyPois.length });
            return cityName;
        }
    }

    // Tier 3: caller handles Nominatim
    return null;
}
\`\`\`

The in-memory singleton (\`memoryCache\`) means Tier 1 is a pure array scan — no JSON.parse, no localStorage read per call. On a 2000km route with 10 fuel checks, that's <1ms total versus 3-5 seconds of blocking Nominatim calls.

Writes to localStorage are debounced 500ms so rapid discovery events don't thrash storage.
`
            },
            {
                heading: 'The Fractional segmentIndex Bug',
                content: `
Return-leg fuel stops were disappearing from the Smart Timeline. The root cause was subtle.

When \`generateSmartStops\` calculates a stop mid-segment, it interpolates the \`afterSegmentIndex\` as a float (e.g. \`3.7\` means "70% through segment 3"). That's fine for distance math.

The problem: \`ItineraryTimeline\`'s render loop used the float directly when deciding which day section a stop belongs to. Overpass bbox queries used the float to look up a segment's geometry — which meant \`segments[3.7]\` was \`undefined\`.

Fix applied in two places:

\`\`\`typescript
// In stop placement — snap to nearest integer index for timeline positioning
const segmentIndex = Math.round(stop.afterSegmentIndex);

// In Overpass bbox construction — floor to the segment the stop physically sits in  
const segIdx = Math.floor(stop.afterSegmentIndex);
const seg = segments[segIdx];
\`\`\`

The float is still the right model internally (ordering stops within a segment depends on the fractional value). But anything that treats the index as an array key needs to be integer. Two different rounding strategies: Math.round for display position, Math.floor for geometry lookup.
`
            }
        ]
    },

};
