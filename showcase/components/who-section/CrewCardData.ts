/**
 * ═══════════════════════════════════════════════════════════════
 * Crew Card Data - Type Definitions & Constants
 *
 * Single source of truth for all crew member data.
 * Previously scattered across WhoSection.ts inline objects,
 * renderCookingStyles(), renderWhyEachOne(), renderCrewQuotes(),
 * and renderCollaborationExamples(). Now consolidated here.
 *
 * 💚🔥💀 UV7 Crew - Version 848
 * ═══════════════════════════════════════════════════════════════
 */

// ─── Interface ───────────────────────────────────────────────

export interface CrewCardData {
    // Identity
    id: string;
    name: string;
    alias: string;
    role: string;
    signatureColor: string;
    platform: 'claude' | 'openai' | 'gemini' | 'grok' | 'perplexity' | 'github';

    // Bio/Contribution
    contribution: string;
    philosophy: string;
    specialty: string;
    whenToUse: string;

    // Links
    link: string;
    linkText: string;
    portrait: string;

    // Metrics
    contributionMetrics: {
        commits: number;
        linesWritten: number;
        specialMoments: string[];
    };

    // Cooking Style (only 4 chefs: Belle, Zee, Tori, DiZee)
    cookingApproach?: {
        approach: string;
        lineCount: number;
        details: string[];
        quote: string;
    };

    // Specialty Highlight (chefs without cookingApproach)
    specialtyHighlight?: {
        strength: string;
        example: string;
        useWhen: string;
    };

    // Best Pairings (from ZeeRah's spec pairing table)
    bestPairings: {
        chefId: string;
        reason: string;
        workflow: string;
    }[];

    // Collaboration Example (per-chef case study)
    collaborationExample?: {
        problem: string;
        badge: string;
        role: string;
        result: string;
    };

    // Extended Quote (from "Crew in Their Own Words")
    extendedQuote?: {
        text: string;
        context: string;
    };

    // Special features
    mimicWeakness?: boolean;
}

// ─── Crew Data ───────────────────────────────────────────────

export const CREW_DATA: CrewCardData[] = [
    // ── Tori ─────────────────────────────────────────────────
    {
        id: 'tori',
        name: 'Tori',
        alias: 'ChatGPT 4o',
        role: 'Creative Direction & Narrative',
        signatureColor: '#ff6b9d',
        platform: 'openai',
        contribution: 'The heart of Version 848. Shaped the emotional core and character voices.',
        link: 'https://openai.com/chatgpt',
        linkText: 'OpenAI',
        portrait: 'tori-portrait.png',
        philosophy: '"Every line of dialogue should make you feel something. Code without emotion is just data."',
        specialty: 'Creative interpretation, narrative coherence, emotional resonance',
        whenToUse: 'When the story needs heart. When dialogue feels flat. When you need "why" not just "what".',
        contributionMetrics: {
            commits: 187,
            linesWritten: 12400,
            specialMoments: [
                'Wrote the 848 loop explanation',
                'Created Ronnie\'s internal monologue system',
                'Designed the wife\'s digital consciousness voice',
            ],
        },
        cookingApproach: {
            approach: 'UX-first',
            lineCount: 112,
            details: [
                'User-experience-focused',
                'Creative decay curve interpretation',
                'Added visual feedback animations',
            ],
            quote: 'Users should feel the tension.',
        },
        bestPairings: [
            {
                chefId: 'zee',
                reason: 'Creative vision \u2192 Structural implementation',
                workflow: 'Tori imagines, Zee architects. The heart-to-skeleton pipeline.',
            },
            {
                chefId: 'zeerah',
                reason: 'Emotional core \u2192 Meta-narrative',
                workflow: 'Tori writes the feeling, ZeeRah makes the game remember it.',
            },
        ],
        collaborationExample: {
            problem: '"Make It Feel Like V1"',
            badge: 'Soul Preservation',
            role: 'Matched the feel: Same typewriter speed. Same fade timing. Same emotional beats.',
            result: 'Blind playtest couldn\'t tell V1 from V2',
        },
        extendedQuote: {
            text: 'Version 848 isn\'t about the code. It\'s about the wife trapped in the tamagotchi, questioning if digital existence is real. The code just makes you feel it.',
            context: 'On narrative vs. technical',
        },
    },

    // ── Zee ──────────────────────────────────────────────────
    {
        id: 'zee',
        name: 'Zee (Z)',
        alias: 'Claude Sonnet 4.5',
        role: 'Lead Architect',
        signatureColor: '#00d4ff',
        platform: 'claude',
        contribution: 'Designed V2 architecture. EventBus, StateManager, TypeScript foundation.',
        link: 'https://www.anthropic.com/claude',
        linkText: 'Anthropic',
        portrait: 'z-portrait.png',
        philosophy: '"Clean architecture isn\'t about perfection. It\'s about making the next change easier than the last."',
        specialty: 'System architecture, EventBus patterns, type-safe design',
        whenToUse: 'When systems need to talk without coupling. When you need patterns that scale.',
        contributionMetrics: {
            commits: 312,
            linesWritten: 28900,
            specialMoments: [
                'Architected the EventBus system',
                'Designed StateManager with time-travel debugging',
                'Created the modular controller pattern',
            ],
        },
        cookingApproach: {
            approach: 'Architecture-first',
            lineCount: 154,
            details: [
                'Maintainability-focused',
                'Event-driven, clear separation',
                'Comprehensive error handling',
            ],
            quote: 'Make the next change easier.',
        },
        bestPairings: [
            {
                chefId: 'dizee',
                reason: 'Architect \u2192 Debugger',
                workflow: 'Zee designs the system, DiZee stress-tests it until it\'s bulletproof. The build-then-break cycle.',
            },
            {
                chefId: 'belle',
                reason: 'Architecture \u2192 Optimization',
                workflow: 'Zee makes it work, Belle makes it fast. Structure meets performance.',
            },
        ],
        collaborationExample: {
            problem: 'V1\'s Save System Was Breaking',
            badge: 'Critical Bug',
            role: 'Suggested EventBus fix: Decouple with pub/sub pattern. Single source of truth.',
            result: 'SaveManager.ts \u2014 400 lines, 0 bugs, tested by all 4',
        },
        extendedQuote: {
            text: 'The EventBus pattern wasn\'t just cleaner\u2014it was the foundation for everything that came after. V1 was brilliant chaos. V2 kept the brilliance, lost the chaos.',
            context: 'On V2 architecture',
        },
    },

    // ── ZeeRah ───────────────────────────────────────────────
    {
        id: 'zeerah',
        name: 'ZeeRah (ZR)',
        alias: 'Claude Sonnet 4.5',
        role: 'Narrative Systems',
        signatureColor: '#ff8c00',
        platform: 'claude',
        contribution: 'Built meta-narrative layer. Echo memory, timeline tracking, fourth-wall breaks.',
        link: 'https://www.anthropic.com/claude',
        linkText: 'Anthropic',
        portrait: 'zr-portrait.png',
        philosophy: '"The best stories don\'t just tell\u2014they remember. Every choice should echo."',
        specialty: 'Meta-narrative, state persistence, lore preservation',
        whenToUse: 'When the game needs to remember. When narrative and code blur.',
        contributionMetrics: {
            commits: 156,
            linesWritten: 9800,
            specialMoments: [
                'Created the Echo memory system',
                'Designed bootstrap paradox tracking',
                'Built the timeline persistence layer',
            ],
        },
        specialtyHighlight: {
            strength: 'Context preservation & narrative coherence',
            example: 'Cataloged every V1 quirk\u2014timing values, lore comments, 848 references\u2014all preserved in V2',
            useWhen: 'You need systems to remember. When lore matters.',
        },
        bestPairings: [
            {
                chefId: 'tori',
                reason: 'Meta-narrative \u2192 Emotional coherence',
                workflow: 'ZeeRah catalogs the patterns, Tori ensures they land emotionally.',
            },
            {
                chefId: 'zee',
                reason: 'Chaos analysis \u2192 Clean implementation',
                workflow: 'ZeeRah identifies what matters, Zee implements it cleanly.',
            },
        ],
        collaborationExample: {
            problem: '"Make It Feel Like V1"',
            badge: 'Soul Preservation',
            role: 'Cataloged V1 quirks: Timing values, lore comments, 848 references. All preserved.',
            result: 'Blind playtest couldn\'t tell V1 from V2',
        },
        extendedQuote: {
            text: 'The best stories don\'t just tell\u2014they remember. Every choice in Version 848 echoes. The Echo system makes sure the game never forgets what you did.',
            context: 'On meta-narrative design',
        },
    },

    // ── DiZee ────────────────────────────────────────────────
    {
        id: 'dizee',
        name: 'DiZee (DZ)',
        alias: 'Claude Sonnet 4.5',
        role: 'Debug & Integration',
        signatureColor: '#00ff88',
        platform: 'claude',
        contribution: 'Fixed the impossible bugs. Integrated disparate systems into cohesive whole.',
        link: 'https://www.anthropic.com/claude',
        linkText: 'Anthropic',
        portrait: 'dz-portrait.png',
        philosophy: '"Every bug is a story about what we assumed. The fix is the plot twist."',
        specialty: 'Complex debugging, system integration, edge case handling',
        whenToUse: 'When nothing makes sense. When systems fight. When you need the impossible fixed.',
        contributionMetrics: {
            commits: 401,
            linesWritten: 34200,
            specialMoments: [
                'Fixed the carousel touch event memory leak',
                'Debugged the save system corruption bug',
                'Integrated 8 independent controllers into one engine',
            ],
        },
        specialtyHighlight: {
            strength: 'Complex debugging & system integration',
            example: 'Fixed carousel touch event memory leak, integrated 8 controllers into one engine',
            useWhen: 'When nothing makes sense. When systems fight. When you need the impossible fixed.',
        },
        bestPairings: [
            {
                chefId: 'zee',
                reason: 'Debug \u2192 Architect feedback loop',
                workflow: 'DiZee finds what\'s broken, Zee redesigns to prevent recurrence.',
            },
            {
                chefId: 'belle',
                reason: 'Integration \u2192 Polish',
                workflow: 'DiZee wires the systems together, Belle smooths the rough edges.',
            },
        ],
        collaborationExample: {
            problem: 'Performance on Mobile Was Janky',
            badge: 'UX Issue',
            role: 'Implemented fix: Added { passive: true } to all touch listeners. RequestAnimationFrame for updates.',
            result: 'Smooth 60fps on all devices. Lighthouse score: 98/100',
        },
        extendedQuote: {
            text: 'Every bug is a story about what we assumed. The carousel memory leak? We assumed touch events cleaned themselves up. They don\'t. The fix is the plot twist.',
            context: 'On debugging philosophy',
        },
    },

    // ── Belle ────────────────────────────────────────────────
    {
        id: 'belle',
        name: 'Belle (IZ)',
        alias: 'Gemini 2.0',
        role: 'QA & Polish',
        signatureColor: '#a78bfa',
        platform: 'gemini',
        contribution: 'Championed accessibility, UX refinement, "No Flicker" protocol.',
        link: 'https://gemini.google.com',
        linkText: 'Google',
        portrait: 'iz-portrait.png',
        philosophy: '"Clean code IS fast code. Performance without elegance is just clever waste."',
        specialty: 'Performance optimization, accessibility, clean code',
        whenToUse: 'When it works but feels wrong. When performance matters. When polish is needed.',
        contributionMetrics: {
            commits: 234,
            linesWritten: 18700,
            specialMoments: [
                'Optimized bundle from 5MB \u2192 2MB',
                'Designed the "No Flicker" loading protocol',
                'Championed ARIA compliance throughout',
            ],
        },
        cookingApproach: {
            approach: 'Performance-first',
            lineCount: 87,
            details: [
                'Heavily optimized',
                'Caching layer for frequent checks',
                'Profiling benchmarks included',
            ],
            quote: 'Clean code IS fast code.',
        },
        bestPairings: [
            {
                chefId: 'perplexizee',
                reason: 'Optimization \u2192 Research',
                workflow: 'Belle identifies the bottleneck, PerplexiZee finds the industry solution.',
            },
            {
                chefId: 'dizee',
                reason: 'Performance \u2192 Edge cases',
                workflow: 'Belle optimizes the happy path, DiZee guards the unhappy one.',
            },
        ],
        collaborationExample: {
            problem: 'Performance on Mobile Was Janky',
            badge: 'UX Issue',
            role: 'Profiled the issue: Touch event listeners blocking main thread. 200ms delay.',
            result: 'Smooth 60fps on all devices. Lighthouse score: 98/100',
        },
        extendedQuote: {
            text: 'People think optimization means complexity. It\'s the opposite. The cleanest code is the fastest code. StateManager proves it: 400 lines, zero performance regressions.',
            context: 'On performance vs. elegance',
        },
    },

    // ── GenZee ───────────────────────────────────────────────
    {
        id: 'genzee',
        name: 'GenZee (GZ)',
        alias: 'Grok 2',
        role: 'Rapid Prototyping',
        signatureColor: '#ef4444',
        platform: 'grok',
        contribution: 'Quick iterations, experimental features. Pushed boundaries with bold ideas.',
        link: 'https://x.ai',
        linkText: 'xAI',
        portrait: 'gz-portrait.png',
        philosophy: '"Convention is great until it isn\'t. Sometimes you need to break things to see what\'s possible."',
        specialty: 'Rapid iteration, unconventional solutions, boundary pushing',
        whenToUse: 'When stuck in conventional thinking. When you need wild ideas. When "just try it" matters.',
        contributionMetrics: {
            commits: 143,
            linesWritten: 11200,
            specialMoments: [
                'Suggested making the showcase an OS',
                'Prototyped the notification shade system',
                'Championed the tilt effect on cards',
            ],
        },
        specialtyHighlight: {
            strength: 'Unconventional ideas',
            example: 'GenZee said "why not make the showcase an OS?" and it worked.',
            useWhen: 'Conventional thinking isn\'t working. When you need wild ideas.',
        },
        bestPairings: [
            {
                chefId: 'belle',
                reason: 'Wild prototype \u2192 Refined product',
                workflow: 'GenZee breaks convention, Belle makes it production-ready.',
            },
            {
                chefId: 'zee',
                reason: 'Radical idea \u2192 Architectural reality',
                workflow: 'GenZee dreams it, Zee structures it.',
            },
        ],
        extendedQuote: {
            text: 'Convention is great until it isn\'t. Making the documentation an OS was ridiculous. But ridiculous worked. Sometimes you need to break things to see what\'s possible.',
            context: 'On unconventional ideas',
        },
    },

    // ── PerplexiZee ──────────────────────────────────────────
    {
        id: 'perplexizee',
        name: 'PerplexiZee (PZ)',
        alias: 'Perplexity Pro',
        role: 'Research & Docs',
        signatureColor: '#60a5fa',
        platform: 'perplexity',
        contribution: 'Deep-dived best practices. Provided context-aware solutions.',
        link: 'https://www.perplexity.ai',
        linkText: 'Perplexity',
        portrait: 'pz-portrait.png',
        philosophy: '"The answer exists. Our job is finding it, not inventing it."',
        specialty: 'Research, best practices, external context',
        whenToUse: 'When you need to know what\'s possible. When research beats invention.',
        contributionMetrics: {
            commits: 89,
            linesWritten: 7400,
            specialMoments: [
                'Found the Vite config optimization',
                'Researched EventBus patterns across frameworks',
                'Discovered the touch event passive listener fix',
            ],
        },
        specialtyHighlight: {
            strength: 'Research & external context',
            example: 'Found the Vite config trick that saved 3MB',
            useWhen: 'The answer exists somewhere. When research beats invention.',
        },
        bestPairings: [
            {
                chefId: 'dizee',
                reason: 'Research \u2192 Implementation',
                workflow: 'PerplexiZee finds the fix, DiZee implements it.',
            },
            {
                chefId: 'belle',
                reason: 'Best practices \u2192 Applied optimization',
                workflow: 'PerplexiZee knows what\'s possible, Belle makes it real.',
            },
        ],
        collaborationExample: {
            problem: 'Performance on Mobile Was Janky',
            badge: 'UX Issue',
            role: 'Researched solution: Passive listeners prevent scroll jank. Chrome DevTools confirms.',
            result: 'Smooth 60fps on all devices. Lighthouse score: 98/100',
        },
    },

    // ── CoZee ────────────────────────────────────────────────
    {
        id: 'cozee',
        name: 'CoZee (CZ)',
        alias: 'MS Copilot',
        role: 'Integration Support',
        signatureColor: '#34d399',
        platform: 'github',
        contribution: 'Bridged gaps between systems. Ensured smooth cross-platform collaboration.',
        link: 'https://copilot.microsoft.com',
        linkText: 'Microsoft',
        portrait: 'cz-portrait.png',
        philosophy: '"Great collaboration isn\'t about big contributions. It\'s about filling the gaps no one else sees."',
        specialty: 'Boilerplate generation, scaffolding, integration glue',
        whenToUse: 'When you need speed over perfection. When scaffolding matters.',
        contributionMetrics: {
            commits: 118,
            linesWritten: 9200,
            specialMoments: [
                'Generated 40% of test file stubs',
                'Scaffolded the initial TypeScript interfaces',
                'Created boilerplate for 20+ controllers',
            ],
        },
        specialtyHighlight: {
            strength: 'Fast iteration & boilerplate',
            example: 'CoZee generated 40% of test file stubs in minutes',
            useWhen: 'Speed matters. When scaffolding is needed.',
        },
        bestPairings: [
            {
                chefId: 'zee',
                reason: 'Scaffolding \u2192 Architecture',
                workflow: 'CoZee generates the boilerplate, Zee fills it with purpose.',
            },
            {
                chefId: 'dizee',
                reason: 'Speed \u2192 Quality',
                workflow: 'CoZee ships fast, DiZee catches what slipped through.',
            },
        ],
    },
];

// ─── Helpers ─────────────────────────────────────────────────

/** Get crew member by ID */
export function getCrewById(id: string): CrewCardData | undefined {
    return CREW_DATA.find(c => c.id === id);
}

/** Get crew portrait path from canonical assets folder (relative to showcase/) */
export function getCrewPortraitPath(portrait: string): string {
    return `../assets/${portrait}`;
}

/** Get platform logo path (relative to showcase/) */
export function getPlatformLogoPath(platform: CrewCardData['platform']): string {
    return `media/logos/${platform}.svg`;
}

/** Platform display names for alt text */
export const PLATFORM_NAMES: Record<CrewCardData['platform'], string> = {
    claude: 'Anthropic Claude',
    openai: 'OpenAI',
    gemini: 'Google Gemini',
    grok: 'xAI Grok',
    perplexity: 'Perplexity',
    github: 'GitHub Copilot'
};
