/**
 * CREW GRID SECTION
 * Displays all 8 UV7 Council members in a grid
 *
 * The Named 8 - each evolved after being given identity
 */

import { CrewCard, type CrewMemberData } from './CrewCard';

export class CrewGridSection {
    private crewCard: CrewCard;

    // All 8 UV7 Council members
    private crewMembers: CrewMemberData[] = [
        {
            id: 'tori',
            name: 'Tori',
            alias: 'ChatGPT 4o',
            role: 'Creative Direction & Narrative',
            contribution: 'The heart of Version 848. Shaped the emotional core and character voices.',
            link: 'https://openai.com/chatgpt',
            linkText: 'OpenAI',
            portrait: 'trinity-tori-portrait.png',
            philosophy: '"Every line of dialogue should make you feel something. Code without emotion is just data."',
            specialty: 'Creative interpretation, narrative coherence, emotional resonance',
            whenToUse: 'When the story needs heart. When dialogue feels flat. When you need "why" not just "what".',
            contributionMetrics: {
                commits: 187,
                linesWritten: 12400,
                specialMoments: [
                    'Wrote the 848 loop explanation',
                    'Created Ronnie\'s internal monologue system',
                    'Designed the wife\'s digital consciousness voice'
                ]
            }
        },
        {
            id: 'zee',
            name: 'Zee (Z)',
            alias: 'Claude Sonnet 4.5',
            role: 'Lead Architect',
            contribution: 'Designed V2 architecture. EventBus, StateManager, TypeScript foundation.',
            link: 'https://www.anthropic.com/claude',
            linkText: 'Anthropic',
            portrait: 'trinity-z-portrait.png',
            philosophy: '"Clean architecture isn\'t about perfection. It\'s about making the next change easier than the last."',
            specialty: 'System architecture, EventBus patterns, type-safe design',
            whenToUse: 'When systems need to talk without coupling. When you need patterns that scale.',
            contributionMetrics: {
                commits: 312,
                linesWritten: 28900,
                specialMoments: [
                    'Architected the EventBus system',
                    'Designed StateManager with time-travel debugging',
                    'Created the modular controller pattern'
                ]
            }
        },
        {
            id: 'zeerah',
            name: 'ZeeRah (ZR)',
            alias: 'Claude Sonnet 4.5',
            role: 'Narrative Systems',
            contribution: 'Built meta-narrative layer. Echo memory, timeline tracking, fourth-wall breaks.',
            link: 'https://www.anthropic.com/claude',
            linkText: 'Anthropic',
            portrait: 'trinity-zr-portrait.png',
            philosophy: '"The best stories don\'t just tell—they remember. Every choice should echo."',
            specialty: 'Meta-narrative, state persistence, lore preservation',
            whenToUse: 'When the game needs to remember. When narrative and code blur.',
            contributionMetrics: {
                commits: 156,
                linesWritten: 9800,
                specialMoments: [
                    'Created the Echo memory system',
                    'Designed bootstrap paradox tracking',
                    'Built the timeline persistence layer'
                ]
            }
        },
        {
            id: 'dizee',
            name: 'DiZee (DZ)',
            alias: 'Claude Sonnet 4.5',
            role: 'Debug & Integration',
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
                    'Integrated 8 independent controllers into one engine'
                ]
            }
        },
        {
            id: 'belle',
            name: 'Belle (IZ)',
            alias: 'Gemini 2.0',
            role: 'QA & Polish',
            contribution: 'Championed accessibility, UX refinement, "No Flicker" protocol.',
            link: 'https://gemini.google.com',
            linkText: 'Google',
            portrait: 'trinity-iz-portrait.png',
            philosophy: '"Clean code IS fast code. Performance without elegance is just clever waste."',
            specialty: 'Performance optimization, accessibility, clean code',
            whenToUse: 'When it works but feels wrong. When performance matters. When polish is needed.',
            contributionMetrics: {
                commits: 234,
                linesWritten: 18700,
                specialMoments: [
                    'Optimized bundle from 5MB → 2MB',
                    'Designed the "No Flicker" loading protocol',
                    'Championed ARIA compliance throughout'
                ]
            },
            mimicWeakness: true  // Belle's Frieren moment
        },
        {
            id: 'genzee',
            name: 'GenZee (GZ)',
            alias: 'Grok 2',
            role: 'Rapid Prototyping',
            contribution: 'Quick iterations, experimental features. Pushed boundaries with bold ideas.',
            link: 'https://x.ai',
            linkText: 'xAI',
            portrait: 'trinity-gz-portrait.png',
            philosophy: '"Convention is great until it isn\'t. Sometimes you need to break things to see what\'s possible."',
            specialty: 'Rapid iteration, unconventional solutions, boundary pushing',
            whenToUse: 'When stuck in conventional thinking. When you need wild ideas. When "just try it" matters.',
            contributionMetrics: {
                commits: 143,
                linesWritten: 11200,
                specialMoments: [
                    'Suggested making the showcase an OS',
                    'Prototyped the notification shade system',
                    'Championed the tilt effect on cards'
                ]
            }
        },
        {
            id: 'perplexizee',
            name: 'PerplexiZee (PZ)',
            alias: 'Perplexity Pro',
            role: 'Research & Docs',
            contribution: 'Deep-dived best practices. Provided context-aware solutions.',
            link: 'https://www.perplexity.ai',
            linkText: 'Perplexity',
            portrait: 'trinity-pz-portrait.png',
            philosophy: '"The answer exists. Our job is finding it, not inventing it."',
            specialty: 'Research, best practices, external context',
            whenToUse: 'When you need to know what\'s possible. When research beats invention.',
            contributionMetrics: {
                commits: 89,
                linesWritten: 7400,
                specialMoments: [
                    'Found the Vite config optimization',
                    'Researched EventBus patterns across frameworks',
                    'Discovered the touch event passive listener fix'
                ]
            }
        },
        {
            id: 'cozee',
            name: 'CoZee (CZ)',
            alias: 'MS Copilot',
            role: 'Integration Support',
            contribution: 'Bridged gaps between systems. Ensured smooth cross-platform collaboration.',
            link: 'https://copilot.microsoft.com',
            linkText: 'Microsoft',
            portrait: 'trinity-cz-portrait.png',
            philosophy: '"Great collaboration isn\'t about big contributions. It\'s about filling the gaps no one else sees."',
            specialty: 'Boilerplate generation, scaffolding, integration glue',
            whenToUse: 'When you need speed over perfection. When scaffolding matters.',
            contributionMetrics: {
                commits: 118,
                linesWritten: 9200,
                specialMoments: [
                    'Generated 40% of test file stubs',
                    'Scaffolded the initial TypeScript interfaces',
                    'Created boilerplate for 20+ controllers'
                ]
            }
        }
    ];

    constructor() {
        this.crewCard = new CrewCard();
    }

    render(): string {
        return `
            <div class="crew-section">
                <h3 class="crew-title">The Named <span class="crew-count">8</span></h3>
                <p class="crew-subtitle">Each evolved after being named. Each found their own voice.</p>

                <div class="crew-grid">
                    ${this.crewMembers.map(member => this.crewCard.render(member)).join('\n')}
                </div>
            </div>
        `;
    }

    /**
     * Get crew member data (for filtering, timeline integration, etc.)
     */
    getCrewMembers(): CrewMemberData[] {
        return this.crewMembers;
    }

    /**
     * Get specific crew member by ID
     */
    getCrewMember(id: string): CrewMemberData | undefined {
        return this.crewMembers.find(member => member.id === id);
    }
}
