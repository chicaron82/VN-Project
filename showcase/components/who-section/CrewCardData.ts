/**
 * ═══════════════════════════════════════════════════════════════
 * Crew Card Data - Type Definitions
 *
 * Defines the data structure for crew member cards in the Who section.
 * Combines biographical info (WhoSection data) with stats (crew-stats data).
 *
 * 💚🔥💀 UV7 Crew - Version 848
 * ═══════════════════════════════════════════════════════════════
 */

export interface CrewCardData {
    // Identity
    id: string;
    name: string;
    alias: string;
    role: string;

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

    // Special features
    mimicWeakness?: boolean;
}
