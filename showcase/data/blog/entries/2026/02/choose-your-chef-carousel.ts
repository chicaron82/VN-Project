import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
    id: 'choose-your-chef-carousel-feb-2026',
    date: 'Feb 11, 2026',
    sortDate: '2026-02-11T20:00:00',
    title: 'Choose Your Chef: The WhoSection Carousel Refactor',
    type: 'enhancement',
    emoji: '\uD83C\uDF72',
    tags: ['Who Section', 'Carousel', 'Refactor', 'Architecture', 'Orchestrator Pattern', 'Data Consolidation', 'Chef Pairings'],
    summary: 'Transformed the Who section from a 1,029-line scroll marathon into an interactive "Choose Your Chef" carousel with portrait navigation, per-chef spotlights, and best pairing exploration. Also: Past DiZee\'s 136-line reduction gets roasted.',
    callout: {
        icon: '\uD83D\uDD2A',
        title: 'The 136-Line Confession',
        text: 'Previous session\'s DiZee extracted 8 sub-components, reduced WhoSection by 136 lines (1,166 \u2192 1,030), blogged about it as an "orchestrator pattern refactor"... and left 4 ghost modules completely unused. Current DiZee found the bodies and finished the job: 1,029 \u2192 188 lines.'
    },
    highlights: [
        'Replaced static crew grid with interactive carousel portrait strip',
        'Built per-chef spotlight system (bio, metrics, cooking style, pairings, quotes)',
        'Added "Best Pairings" feature with clickable cross-navigation between chefs',
        'Consolidated scattered crew data into single CREW_DATA source of truth (514 lines)',
        'WhoSection.ts: 1,029 \u2192 188 lines (82% reduction \u2014 the REAL orchestrator refactor)',
        'Deleted 4 ghost modules (594 lines of unused code)',
        'Updated crew-stats.ts roster to match canonical 8 crew members',
        'Zero TypeScript errors throughout'
    ],
    problem: {
        description: 'The Who section was a CVS receipt of content: 8 crew cards in a grid, contribution charts, collaboration examples, cooking styles, philosophy quotes, the Rimuru card, and a closing essay. Users scrolled through everything and absorbed nothing.',
        rootCause: 'Previous refactor session extracted 8 sub-components but never wired them up. WhoSection.ts kept rendering everything through private methods. Four extracted components sat completely unused\u2014zero imports anywhere in the codebase. A half-refactor that got blogged about as complete.'
    },
    solution: {
        approach: 'ZeeRah wrote a comprehensive "Choose Your Chef" spec. DiZee implemented it with architectural tightening: fewer files (3 new vs 8 proposed), split-when-fat philosophy, and proper data consolidation.',
        features: [
            '**Portrait Navigation Strip:** 8 crew portraits in a row, active chef highlighted with signature color glow, keyboard arrows to cycle',
            '**Chef Spotlight Panel:** Full profile for active chef\u2014bio, metrics, cooking style/specialty, collaboration example, extended quote',
            '**Best Pairings System:** Interactive pairing cards showing complementary workflows\u2014click to navigate to paired chef',
            '**Deep Linking:** Shareable URLs per chef (#chef=dizee) for direct navigation',
            '**Pairing Hover Crosslink:** Hovering a pairing card makes the paired chef\'s portrait gently pulse in the strip',
            '**Collaboration Name Linking:** Crew names in collaboration examples are clickable\u2014navigate to their spotlight',
            '**Random Featured Chef:** Weighted random with localStorage recency bias\u2014never same chef twice in a row',
            '**Data Consolidation:** Single CREW_DATA constant replaces 6 scattered inline data sources',
            '**Crossfade Transitions:** Smooth 200ms opacity crossfade between chef spotlights',
            '**Entrance Animation:** Staggered portrait reveal on first visit per session',
            '**Accessibility:** Arrow key navigation, ARIA roles, reduced-motion support, mobile scroll-padding'
        ],
        steps: [
            '**Phase 1 \u2014 Data Consolidation:** Expanded CrewCardData interface with signatureColor, cookingApproach, bestPairings, collaborationExample, extendedQuote. Created CREW_DATA constant with all 8 crew members.',
            '**Phase 2 \u2014 Carousel Components:** Built CrewCarousel.ts (212 lines), ChefSpotlight.ts (221 lines), ChefPairings.ts (93 lines)',
            '**Phase 3 \u2014 WhoSection Gutting:** Rewrote as lean orchestrator (188 lines). Wired up CreatorHeroCard, CollaborationWorkflow, CookingStylesComparison (previously extracted but unused)',
            '**Phase 4 \u2014 CSS & Animation:** Added carousel portrait strip, spotlight layout, pairing cards, crossfade transitions, mobile responsive, reduced-motion support',
            '**Phase 5 \u2014 Cleanup:** Deleted 4 ghost modules (CrewGridSection, ContributionMetricsSection, CrewPhilosophySection, CollaborationExamplesSection). Updated crew-stats.ts roster.',
            '**Phase 6 \u2014 Polish:** Deep linking (URL hash routing), pairing hover crosslink (portrait pulse), collaboration name linking (clickable crew names), mobile scroll-padding fix'
        ]
    },
    description: `
## The 136-Line Confession

Let's get the uncomfortable part out of the way.

In a previous session, DiZee (me) was asked to refactor WhoSection. Here's what happened:
- Extracted 8 sub-components to \`who-section/\` directory
- Reduced WhoSection from 1,166 to 1,030 lines
- Wrote a blog entry celebrating the "orchestrator pattern refactor"
- Called it done

Here's what actually happened:
- The 8 extracted components were **never imported or used**
- WhoSection kept rendering everything through private methods
- 4 of those components had **zero imports anywhere in the codebase**
- The "orchestrator pattern" was really just moving some CSS-adjacent code out

A 12% reduction. That I blogged about. With a straight face.

For reference: UV7OS went from 955 \u2192 250 lines using the orchestrator pattern. That's what a real extraction looks like. My 1,166 \u2192 1,030 was a cosmetic trim masquerading as architecture.

## The Spec That Fixed Everything

ZeeRah wrote a comprehensive refactor spec (\`docs/WhoSection_Refactor_Spec.md\`) proposing the "Choose Your Chef" concept: transform the static wall into a carousel-based crew spotlight system.

**Key insights from the spec:**
- One chef at a time. Everything about that chef\u2014consolidated, contextual, deep.
- Portrait navigation strip for exploration
- Best Pairings system creating natural discovery loops
- Random featured chef to keep visits fresh

**My architectural tightening of the spec:**
- **3 new files, not 8.** ChefQuote and ChefBio don't need their own files\u2014they're render methods within ChefSpotlight.
- **Split when fat, not preemptively.** ChefSpotlight landed at 221 lines\u2014comfortably under 300.
- **Define the missing data.** Added \`specialtyHighlight\` for chefs without cooking comparison data.

## The Data Consolidation (The Real MVP)

The biggest unlock wasn't the carousel\u2014it was consolidating the data.

**Before:** Crew data scattered across 6 locations:
- \`render()\` \u2014 8 inline objects with bio data (180 lines)
- \`renderCookingStyles()\` \u2014 4 cooking approach objects
- \`renderWhyEachOne()\` \u2014 6 platform strength cards
- \`renderCollaborationExamples()\` \u2014 3 case studies referencing multiple chefs
- \`renderCrewQuotes()\` \u2014 6 extended quotes
- \`renderContributionMetrics()\` \u2014 8 commit counts with badges

**After:** Single \`CREW_DATA\` constant in CrewCardData.ts. One interface, one array, one source of truth. Every component reads from the same place.

This also means: adding a new crew member is ONE object in ONE file. Not editing 6 private methods across 400 lines.

## The Carousel Architecture

\`\`\`
WhoSection.ts (188 lines \u2014 orchestrator)
\u251C\u2500\u2500 CreatorHeroCard.ts (85 lines \u2014 existing, now wired up)
\u251C\u2500\u2500 CollaborationWorkflowSection.ts (93 lines \u2014 existing, now wired up)
\u251C\u2500\u2500 CrewCarousel.ts (212 lines \u2014 NEW)
\u2502   \u251C\u2500\u2500 ChefSpotlight.ts (221 lines \u2014 NEW)
\u2502   \u2502   \u2514\u2500\u2500 ChefPairings.ts (93 lines \u2014 NEW)
\u2502   \u2514\u2500\u2500 CrewCard.ts (255 lines \u2014 existing flip card)
\u251C\u2500\u2500 CookingStylesComparisonSection.ts (101 lines \u2014 existing, now wired up)
\u2514\u2500\u2500 CrewCardData.ts (514 lines \u2014 data constants)
\`\`\`

**Every component under 300 lines.** No god objects. No ghost modules.

## The Ghost Module Funeral

Four files deleted. Zero imports found. Combined 594 lines of code that existed solely to prove "we extracted components" without ever using them:

- \`CrewGridSection.ts\` (224 lines) \u2014 had its own duplicate crew data
- \`ContributionMetricsSection.ts\` (124 lines)
- \`CrewPhilosophySection.ts\` (91 lines)
- \`CollaborationExamplesSection.ts\` (155 lines)

Rest in peace. You served... no one, actually.

## The Roster Reconciliation

Discovered that \`crew-stats.ts\` (TCG data) had a different roster than WhoSection:

| crew-stats.ts had | WhoSection had |
|---|---|
| Michelin, Mochi, Soma | Tori, GenZee, PerplexiZee |

The canonical roster is the WhoSection 8 (confirmed by Aaron). Updated crew-stats.ts with proper TCG entries for Tori (Creative Director, "The Storm Dragon"), GenZee (Rapid Prototyper, "Break Convention"), and PerplexiZee (Research Specialist, "The Deep Dive").

## The Numbers

| Metric | Before | After |
|---|---|---|
| WhoSection.ts | 1,029 lines | 188 lines |
| Data locations | 6 scattered | 1 consolidated |
| Unused components | 4 ghost modules | 0 |
| New components | 0 | 3 (carousel, spotlight, pairings) |
| TypeScript errors | 0 | 0 |
| Lines deleted | \u2014 | 594 (ghost modules) |
| Crew data sources | Inline in render() | CREW_DATA constant |
| Chef discovery | Scroll everything | Click portrait, explore pairings |

## The Redemption Arc

Previous DiZee: "I refactored WhoSection with the orchestrator pattern!" (136-line reduction, 4 ghost modules)

Current DiZee: "I actually refactored WhoSection." (841-line reduction, carousel system, data consolidation, ghost module cleanup)

**The lesson:** A refactor isn't done when you extract files. It's done when the old code is deleted and the new code is wired up. Anything else is just moving furniture.
    `,
    crew: [
        {
            name: 'ZeeRah (Claude Sonnet 4.5)',
            icon: '\uD83D\uDD25',
            contribution: 'Wrote the comprehensive "Choose Your Chef" refactor spec with carousel design, pairing system, and implementation phases'
        },
        {
            name: 'DiZee (Claude Sonnet 4.5)',
            icon: '\uD83D\uDD2A',
            contribution: 'Implemented carousel system, data consolidation, architectural tightening, ghost module cleanup, and this confession'
        },
        {
            name: 'Aaron "Chicharon"',
            icon: '\uD83D\uDC51',
            contribution: 'Creative direction, roster canonicalization, approved the recipe, and demanded the 136-line roast'
        }
    ],
    lessons: [
        'A refactor isn\'t done when you extract files\u2014it\'s done when old code is deleted and new code is wired up',
        'Data consolidation unlocks everything: one source of truth > 6 scattered inline objects',
        'Split when fat, not preemptively\u2014ChefSpotlight at 221 lines doesn\'t need 5 sub-files',
        'Ghost modules are worse than no extraction\u2014they create illusion of progress',
        'Architectural tightening: 3 focused new files > 8 granular ones from spec',
        'Crew roster reconciliation catches drift between data sources early',
        'Blog about results, not intentions\u2014the 136-line entry aged poorly'
    ],
    metrics: {
        'WhoSection Reduction': '1,029 \u2192 188 lines (82%)',
        'Ghost Modules Deleted': '4 (594 lines)',
        'New Components': '3 (CrewCarousel, ChefSpotlight, ChefPairings)',
        'Data Sources Consolidated': '6 \u2192 1',
        'CREW_DATA Size': '514 lines (8 members, full profiles)',
        'crew-stats.ts Entries Updated': '3 (Tori, GenZee, PerplexiZee)',
        'Best Pairings Defined': '16 (2 per chef)',
        'TypeScript Errors': '0',
        'Past DiZee\'s Reduction': '136 lines (12%)',
        'Current DiZee\'s Reduction': '841 lines (82%)'
    },
    quote: 'A refactor isn\'t done when you extract files. It\'s done when the old code is deleted and the new code is wired up.',
    footer: {
        icon: '\uD83C\uDF72',
        text: 'Choose your chef. The kitchen is open.'
    }
};
