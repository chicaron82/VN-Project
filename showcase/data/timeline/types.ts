// Timeline data for UV7 Showcase
// Converted to ES module for Vite integration

/**
 * Media carousel item (image or video)
 */
export interface MediaCarouselItem {
    type: 'image' | 'video';
    url: string;
    caption: string;
}

/**
 * Media attachments for timeline entries
 */
export interface TimelineMedia {
    carousel: MediaCarouselItem[];
}

/**
 * Code snippet for comparison views
 */
export interface CodeSnippet {
    title: string;
    badge: string;
    lang: string;
    code: string;
}

/**
 * Before/after code comparison
 */
export interface CodeComparison {
    before: CodeSnippet;
    after: CodeSnippet;
}

/**
 * Crew member attribution
 */
export interface CrewMember {
    name: string;
    contribution: string;
    icon: string;
}

/**
 * Crew attribution block with quote
 */
export interface CrewAttribution {
    systems: CrewMember[];
    quote: string;
}

/**
 * Main timeline entry interface
 */
export interface V3Judgement {
    verdict: 'understood' | 'rogue' | 'failed';
    notes: string;
}

export interface V3Scorecard {
    velocity: 'Fast' | 'Average' | 'Slow';
    adherence: 'Strict' | 'Loose' | 'Rogue';
    creativity: number; // 1-10
    funFactor: number;  // 1-10
    sensitivity: number; // MSG Sensitivity
    aggression: number;  // Refactor Aggression
}

export interface V3Stats {
    commits: number;
    corrections: number;
    notesDetected: number;
    archInsights: number;
}

export interface TimelineEntry {
    id: string;
    date?: string;
    emoji?: string;
    title: string;
    type?: string;
    tags?: string[];
    sortDate?: string;
    summary?: string;
    description?: string;
    linesOfCode?: number;
    highlights?: string[];
    features?: string[];
    theTimeline?: string[];
    investigation?: string[];
    problem?: string | {
        description: string;
        rootCause: string;
    };
    solution?: string | {
        approach: string;
        features?: string[];
        steps?: string[];
        code?: string;
    };
    media?: TimelineMedia;
    codeComparison?: CodeComparison;
    subEntries?: TimelineEntry[];
    subPhases?: TimelineEntry[];
    lessons?: string[];
    crew?: CrewMember[];
    crewAttribution?: CrewAttribution;
    metrics?: Record<string, string | number>;
    callout?: {
        icon?: string;
        title: string;
        text?: string;
        type?: string;
        content?: string;
    };
    footer?: {
        icon: string;
        text: string;
    };
    quote?: string;
    legacyPhase?: string;

    // V3 Lab Specific
    isV3Entry?: boolean;
    modelId?: 'belle' | 'dizee' | 'tori' | 'genzee';
    scorecard?: V3Scorecard;
    stats?: V3Stats;
    judgement?: V3Judgement;

    // V3 Session Detailed Reporting
    timestamp?: Date;
    agent?: string;
    agentAlias?: string;
    sessionType?: string;
    primaryFocus?: string;
    approach?: {
        title: string;
        description: string;
        keyInsights: string[];
    };
    implementation?: {
        directory: string;
        strategy: string;
        files: string[];
        whatPreserved: string[];
        futureEnhancements: string[];
    };
    outcomeCode?: {
        linesChanged: number;
        linesAdded: string | number;
        systemsIntegrated: string[];
    };
    machineReflection?: {
        whatWentRight: string[];
        challenges: string[];
        nextSteps: string[];
    };
    effort?: {
        duration: string;
        complexity: string;
        iterations: number;
    };
}

export interface TimelineData {
    entries: TimelineEntry[];
}