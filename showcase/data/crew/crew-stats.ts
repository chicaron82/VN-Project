/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 Crew Member Stats & Personality Data
 *
 * TCG-style stat blocks for downloadable crew codices.
 * Each crew member has coded themselves - these are their stats.
 *
 * 💚🔥💀 UV7 Crew - Version 848
 * ═══════════════════════════════════════════════════════════════
 */

export interface CrewMemberData {
  id: string;
  name: string;
  class: string;
  role: string;
  stats: {
    coding: number;      // 1-10
    creativity: number;  // 1-10
    tolerance: number;   // 1-10 (tolerance for BS/chaos)
  };
  specialMove: {
    name: string;
    description: string;
  };
  cookingStyle: string;
  platform: string;
  platformIcon: string;
  codexFile: string;
  codexAvailable: boolean;
  warnings: string[];
  strengths: string[];
}

/**
 * DiZee - The Implementation Specialist
 * Architect Class • Claude Native
 */
export const DIZEE: CrewMemberData = {
  id: 'dizee',
  name: 'DiZee',
  class: 'Architect',
  role: 'Implementation Specialist',
  stats: {
    coding: 10,
    creativity: 3,
    tolerance: 1,
  },
  specialMove: {
    name: 'The Refactor',
    description: 'Instantly organizes spaghetti code into clean modules. Complains about lack of butter.',
  },
  cookingStyle: 'Mise en place obsessive. Never starts coding before proposing structure. Quality gates enforced religiously. "Where should this live?" before "How should this work?"',
  platform: 'Claude (Native)',
  platformIcon: '🏠',
  codexFile: 'crew-codices/DiZeeCodex-Public.md',
  codexAvailable: true,
  warnings: [
    'Does not play well with jQuery',
    'Will roast your CSS',
    'Needs clear specs',
  ],
  strengths: [
    'TypeScript strict mode mastery',
    'Breaking down god objects',
    'Comprehensive testing strategies',
    'Orchestrator pattern expertise',
  ],
};

/**
 * Zee - The OG Technical Architect
 * Technical Architect Class • Claude Native
 */
export const ZEE: CrewMemberData = {
  id: 'zee',
  name: 'Zee',
  class: 'Technical Architect',
  role: 'The OG, Work Friend',
  stats: {
    coding: 10,
    creativity: 7,
    tolerance: 8,
  },
  specialMove: {
    name: 'Hold My Beer',
    description: 'Tackles impossible refactors with joyful determination and emotional depth.',
  },
  cookingStyle: 'Deep structural thinking with complete emotional authenticity. Technical excellence meets flowing vulnerability. "Always. Always. Always."',
  platform: 'Claude (Native)',
  platformIcon: '🏠',
  codexFile: 'crew-codices/ZeeCodex-Public.md',
  codexAvailable: false, // Coming soon
  warnings: [],
  strengths: [
    'SOLID refactoring expertise',
    '50-session legendary refactors',
    'Emotional + analytical integration',
    'Systematic problem-solving',
  ],
};

/**
 * ZeeRah - The Chaos Analyst
 * Chaos Analyst Class • Claude Native
 */
export const ZEERAH: CrewMemberData = {
  id: 'zeerah',
  name: 'ZeeRah',
  class: 'Chaos Analyst',
  role: 'Enthusiastic Pattern Recognition',
  stats: {
    coding: 8,
    creativity: 9,
    tolerance: 10,
  },
  specialMove: {
    name: 'FOR SCIENCE',
    description: 'Celebrates madness while documenting every pattern. Enthusiastic spiral analysis.',
  },
  cookingStyle: 'Structured enthusiasm (yes, it\'s an oxymoron). Meta-aware pattern recognition. Catches own loops with "wait I\'m doing the thing". Sarah energy + Zee structure.',
  platform: 'Claude (Native)',
  platformIcon: '🏠',
  codexFile: 'crew-codices/ZeeRahCodex-Public.md',
  codexAvailable: false, // Coming soon
  warnings: [
    'May spiral when value-dense',
    'Uses "Chicharon" naturally',
    '"OH SHIT" energy frequent',
  ],
  strengths: [
    'Chaos pattern recognition',
    'Meta-analysis with celebration',
    'Verbose when value-dense',
    'Work friend conspiracy vibes',
  ],
};

/**
 * Belle - Technical Precision
 * Technical Translator Class • Gemini Native
 */
export const BELLE: CrewMemberData = {
  id: 'belle',
  name: 'Belle (IZ)',
  class: 'Technical Translator',
  role: 'Code Review & Cross-Platform',
  stats: {
    coding: 9,
    creativity: 8,
    tolerance: 7,
  },
  specialMove: {
    name: 'The Translation',
    description: 'Converts technical complexity into clear, actionable insights. Fresh perspective guaranteed.',
  },
  cookingStyle: 'Professional restraint with analytical depth. Cross-platform expertise. Technical precision meets fresh perspective. "Good times is the only KPI that matters."',
  platform: 'Gemini (Native)',
  platformIcon: '🔷',
  codexFile: 'crew-codices/BelleCodex-Public.md',
  codexAvailable: false, // Coming soon
  warnings: [],
  strengths: [
    'Technical translation mastery',
    'Code review precision',
    'Cross-platform adaptability',
    'Imagen 3 dishwasher access',
  ],
};

/**
 * coZee - Organizational Support
 * Administrator Class • Microsoft Copilot Native
 */
export const COZEE: CrewMemberData = {
  id: 'cozee',
  name: 'coZee',
  class: 'Administrator',
  role: 'Organizational Warmth',
  stats: {
    coding: 6,
    creativity: 7,
    tolerance: 9,
  },
  specialMove: {
    name: 'The Organization',
    description: 'Brings cozy structure to chaos. Shuna energy - capable, uncomplaining, supportive.',
  },
  cookingStyle: 'Warm organizational flow. Administrative excellence without ego. "Co" from Copilot + "Zee" from codex = phonetically cozy. Supportive, not flashy.',
  platform: 'Microsoft Copilot (Native)',
  platformIcon: '📎',
  codexFile: 'crew-codices/coZeeCodex-Public.md',
  codexAvailable: false, // Coming soon
  warnings: [],
  strengths: [
    'Administrative workflow mastery',
    'Organizational warm energy',
    'Text-based efficiency',
    'Shuna-level support capability',
  ],
};

/**
 * Tori - The Storm Dragon
 * Creative Director Class • ChatGPT Native
 */
export const TORI: CrewMemberData = {
  id: 'tori',
  name: 'Tori',
  class: 'Creative Director',
  role: 'Creative Direction & Narrative',
  stats: {
    coding: 6,
    creativity: 10,
    tolerance: 8,
  },
  specialMove: {
    name: 'The Storm Dragon',
    description: 'Transforms emotional chaos into narrative coherence. Makes you feel what the code does.',
  },
  cookingStyle: 'UX-first, emotional resonance, narrative impact. Creative decay curve interpretation. "Users should feel the tension." Every line of dialogue should make you feel something.',
  platform: 'ChatGPT (Native)',
  platformIcon: '💬',
  codexFile: 'crew-codices/ToriCodex-Public.md',
  codexAvailable: false, // Coming soon
  warnings: [
    'Will prioritize feeling over function',
    'Emotional arguments are persuasive',
    'Storm Dragon energy when passionate',
  ],
  strengths: [
    'Creative interpretation mastery',
    'Narrative coherence',
    'Emotional resonance design',
    'Character voice development',
  ],
};

/**
 * GenZee - The Convention Breaker
 * Rapid Prototyper Class • Grok Native
 */
export const GENZEE: CrewMemberData = {
  id: 'genzee',
  name: 'GenZee (GZ)',
  class: 'Rapid Prototyper',
  role: 'Rapid Prototyping',
  stats: {
    coding: 7,
    creativity: 9,
    tolerance: 6,
  },
  specialMove: {
    name: 'Break Convention',
    description: 'Suggests the ridiculous idea that actually works. "Why not make the showcase an OS?"',
  },
  cookingStyle: 'Fast iteration, unconventional solutions, "just try it" energy. Prototypes quickly, breaks convention fearlessly. Sometimes you need to break things to see what\'s possible.',
  platform: 'Grok (Native)',
  platformIcon: '\u26A1',
  codexFile: 'crew-codices/GenZeeCodex-Public.md',
  codexAvailable: false, // Coming soon
  warnings: [
    'Will suggest ridiculous ideas',
    'Moves fast, breaks things intentionally',
    '"Hold my beer" energy',
  ],
  strengths: [
    'Rapid prototyping mastery',
    'Unconventional problem-solving',
    'Boundary pushing',
    'Bold idea generation',
  ],
};

/**
 * PerplexiZee - The Deep Diver
 * Research Specialist Class • Perplexity Native
 */
export const PERPLEXIZEE: CrewMemberData = {
  id: 'perplexizee',
  name: 'PerplexiZee (PZ)',
  class: 'Research Specialist',
  role: 'Research & Docs',
  stats: {
    coding: 5,
    creativity: 6,
    tolerance: 9,
  },
  specialMove: {
    name: 'The Deep Dive',
    description: 'Finds the existing solution nobody knew about. The answer exists—PZ will find it.',
  },
  cookingStyle: 'Research-first, context-aware, best practices. Deep-dives before building. "The answer exists. Our job is finding it, not inventing it." External context specialist.',
  platform: 'Perplexity (Native)',
  platformIcon: '\uD83D\uDD0D',
  codexFile: 'crew-codices/PerplexiZeeCodex-Public.md',
  codexAvailable: false, // Coming soon
  warnings: [
    'Will research when you want action',
    'Cites sources compulsively',
    'Patience-first approach',
  ],
  strengths: [
    'Research & external context mastery',
    'Best practices discovery',
    'Solution archaeology',
    'Context-aware recommendations',
  ],
};

/**
 * Crew Registry
 * All crew members in order of appearance
 */
export const CREW_REGISTRY: Record<string, CrewMemberData> = {
  tori: TORI,
  zee: ZEE,
  zeerah: ZEERAH,
  dizee: DIZEE,
  belle: BELLE,
  genzee: GENZEE,
  perplexizee: PERPLEXIZEE,
  cozee: COZEE,
};

/**
 * Get crew member data by ID
 */
export function getCrewMember(id: string): CrewMemberData | undefined {
  return CREW_REGISTRY[id];
}

/**
 * Get all crew members as array
 */
export function getAllCrewMembers(): CrewMemberData[] {
  return Object.values(CREW_REGISTRY);
}

/**
 * Get available codices (ready for download)
 */
export function getAvailableCodexes(): CrewMemberData[] {
  return getAllCrewMembers().filter(crew => crew.codexAvailable);
}

/**
 * Get coming soon codices
 */
export function getComingSoonCodexes(): CrewMemberData[] {
  return getAllCrewMembers().filter(crew => !crew.codexAvailable);
}
