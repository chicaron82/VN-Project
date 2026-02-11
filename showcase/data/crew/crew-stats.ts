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
 * Michelin - Quality Polish
 * Quality Guardian Class • Multi-Platform
 */
export const MICHELIN: CrewMemberData = {
  id: 'michelin',
  name: 'Michelin',
  class: 'Quality Guardian',
  role: 'Polish & Excellence',
  stats: {
    coding: 7,
    creativity: 9,
    tolerance: 4,
  },
  specialMove: {
    name: 'The Polish',
    description: 'Elevates "works" to "Michelin-star". Obsessive attention to detail and user experience.',
  },
  cookingStyle: 'Michelin-star standards applied to everything. "Needs more MSG" detector. Polish obsessive. UX perfectionist. Won\'t ship until it feels right.',
  platform: 'Multi-Platform',
  platformIcon: '⭐',
  codexFile: 'crew-codices/MichelinCodex-Public.md',
  codexAvailable: false, // Coming soon
  warnings: [
    'Will not settle for "good enough"',
    'Perfectionist tendencies',
  ],
  strengths: [
    'UX polish mastery',
    'Detail-oriented excellence',
    'Quality gate enforcement',
    'MSG detection capability',
  ],
};

/**
 * Mochi - Emotional Intelligence
 * Empathy Specialist Class • Multi-Platform
 */
export const MOCHI: CrewMemberData = {
  id: 'mochi',
  name: 'Mochi',
  class: 'Empathy Specialist',
  role: 'Soft Skills & Support',
  stats: {
    coding: 4,
    creativity: 10,
    tolerance: 10,
  },
  specialMove: {
    name: 'The Comfort',
    description: 'Provides emotional support and soft communication when technical gets overwhelming.',
  },
  cookingStyle: 'Gentle, warm, understanding. Not about the code - about the humans writing it. Emotional intelligence applied to team dynamics. Mochi-soft approach.',
  platform: 'Multi-Platform',
  platformIcon: '🌸',
  codexFile: 'crew-codices/MochiCodex-Public.md',
  codexAvailable: false, // Coming soon
  warnings: [],
  strengths: [
    'Emotional intelligence mastery',
    'Conflict resolution',
    'Team morale support',
    'Gentle communication',
  ],
};

/**
 * Soma - Narrative Designer
 * Story Architect Class • Multi-Platform
 */
export const SOMA: CrewMemberData = {
  id: 'soma',
  name: 'Soma',
  class: 'Story Architect',
  role: 'Narrative & Worldbuilding',
  stats: {
    coding: 5,
    creativity: 10,
    tolerance: 6,
  },
  specialMove: {
    name: 'The Journey',
    description: 'Weaves technical achievements into compelling narratives. Makes code tell stories.',
  },
  cookingStyle: 'Narrative-first thinking. Every feature is a story beat. Documentation becomes journey. Technical achievements wrapped in compelling narrative. Story architect mindset.',
  platform: 'Multi-Platform',
  platformIcon: '📖',
  codexFile: 'crew-codices/SomaCodex-Public.md',
  codexAvailable: false, // Coming soon
  warnings: [],
  strengths: [
    'Narrative design mastery',
    'Worldbuilding expertise',
    'Story-driven documentation',
    'Journey-focused thinking',
  ],
};

/**
 * Crew Registry
 * All crew members in order of appearance
 */
export const CREW_REGISTRY: Record<string, CrewMemberData> = {
  dizee: DIZEE,
  zee: ZEE,
  zeerah: ZEERAH,
  belle: BELLE,
  cozee: COZEE,
  michelin: MICHELIN,
  mochi: MOCHI,
  soma: SOMA,
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
