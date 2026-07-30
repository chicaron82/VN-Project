import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    id: 'roadtrip-five-courses-feb-2026',
    date: 'Feb 24, 2026',
    sortDate: '2026-02-24T22:00:00',
    title: 'Five Courses: Beast Mode, Template Architecture & Regional Fuel Pricing',
    type: 'feature',
    emoji: '🍽️',
    tags: ['Roadtrip Planner', 'Architecture', 'UX', 'Templates', 'DiZee', 'React', 'TypeScript'],
    modelId: 'dizee',
    summary: 'Five structured feature courses cooked in a single session: accommodation alternatives for overnight stops, beast mode marathon drive override, settings defaults persistence with privacy toggle, JSON schema validation for shared templates, and fork lineage tracking as arrays. Plus regional fuel price defaults from your origin city, beast mode wiring into live UI, and a duplicate fuel stop bug that needed a proper 50km grace zone instead of a final-segment hack. 13 commits, clean TypeScript throughout.',

    callout: {
        icon: '🍽️',
        title: 'Mise en Place: Five Sequential Courses',
        text: 'Each course built on the previous one — accommodation alternatives gave users control over overnight stops, beast mode gave power users a way to override the drive cap, settings persistence meant those preferences survived refreshes, schema validation meant shared templates couldn\'t corrupt, and fork lineage let the template history tell its own story. Five coherent courses, one coherent meal.'
    },

    highlights: [
        'Course 1 — Accommodation alternatives: overnight stops can now be marked hotel, motel, campground, or friends/family. Each carries its own cost multiplier and renders with a distinct icon in the timeline',
        'Course 2 — Beast mode: a new toggle lets power users disable the maxDriveHours cap entirely. The planner warns you, but if you\'re driving straight through, it won\'t insert unwanted overnight splits',
        'Course 3 — Settings defaults persistence: the app now writes your preferences (drive hours, stop frequency, travelers, etc.) to localStorage and restores them on next visit. Privacy toggle lets you opt into anonymous usage analytics',
        'Course 4 — JSON schema validation for shared templates: imported templates now pass through a Zod schema before being applied. Invalid fields are rejected with descriptive error messages instead of silently corrupting settings',
        'Course 5 — Fork lineage as array: SharedTemplate.forkOf changed from string | null to string[] — a full ancestry chain. Template A forks B which forked C is now represented correctly and renders as a breadcrumb trail',
        'Regional fuel price defaults: origin city now seeds the gas price field from a regional lookup table. Driving from Calgary? Default is Alberta pump prices. From LA? California prices. Editable, but correct out of the box',
        'Beast mode midpoint fix: the forced overnight at the round-trip midpoint was firing even in beast mode. Added isRoundTripDayTrip || settings.beastMode guard to suppress it',
        'Duplicate fuel stop fix: the "final segment only" destination grace period was too narrow — a stop 51km before a 50km final segment would still fire at the destination. Replaced with a 50km distance-based exclusion zone from the final waypoint across all segments'
    ],

    technicalDetails: {
        title: 'Two Courses Worth Digging Into',
        sections: [
            {
                heading: 'Course 4: Zod Schema Validation on Import',
                content: `
Shared templates are JSON blobs imported from URLs or pasted text. Before schema validation, an invalid or maliciously crafted template could silently overwrite settings with garbage values — a user pasting a template from a forum post had no protection.

The \`SharedTemplate\` type now has a matching Zod schema:

\`\`\`typescript
const SharedTemplateSchema = z.object({
    version: z.string(),
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    forkOf: z.array(z.string()).default([]),
    settings: TripSettingsSchema.partial(),
    vehicle: VehicleSchema.partial().optional(),
    locations: z.array(LocationSchema).optional(),
    createdAt: z.string().datetime(),
    createdBy: z.string().optional(),
});
\`\`\`

The import handler runs \`SharedTemplateSchema.safeParse(raw)\`. On failure, the error tree is walked and surfaced as a user-readable list:

\`\`\`
Template validation failed:
  • name: String must contain at least 1 character
  • settings.maxDriveHours: Expected number, received string
  • locations[0].lat: Number must be between -90 and 90
\`\`\`

Nothing gets applied to app state unless the parse succeeds. The template author gets a useful error message. The user gets protection from corrupted imports.
`
            },
            {
                heading: 'Course 5: Fork Lineage as Array',
                content: `
\`forkOf: string | null\` worked fine when templates had one parent. It breaks when you track a full ancestry chain:

Template A (original) → Template B (forked) → Template C (your edit)

With \`forkOf: string | null\`, Template C only knows about B. The chain is severed.

Changed to \`forkOf: string[]\` and updated the fork-creation path:

\`\`\`typescript
// When forking template B to create C:
const forkedTemplate: SharedTemplate = {
    ...sourceTemplate,
    id: generateId(),
    forkOf: [...(sourceTemplate.forkOf ?? []), sourceTemplate.id],
    createdAt: new Date().toISOString(),
};
\`\`\`

Now Template C's \`forkOf\` is \`["A", "B"]\` — the full ancestry. The UI renders this as a breadcrumb: "Forked from A → B". Future templates that fork C will extend the array to \`["A", "B", "C"]\`.

No database needed. The full provenance travels with the template, always.
`
            }
        ]
    },

};
