/**
 * ENTRY CARD UTILITIES
 * Pure functions for timeline entry card metadata.
 * No DOM access — safe for tests and server-side usage.
 */

import type { BlogEntry } from '../../data/blog';

// ─── Contributor Extraction ───────────────────────────────────

/** Reverse lookup: display name → modelId */
const NAME_TO_ID: Record<string, string> = {
    'Tori': 'tori',
    'Belle': 'belle',
    'DiZee': 'dizee',
    'Zee': 'zee',
    'ZeeRah': 'zeerah',
    'GenZee': 'genzee',
    'Genzee': 'genzee',
    'PerplexiZee': 'perplexizee',
    'CoZee': 'cozee',
    'Aaron': 'aaron',
    'Aaron "Chicharon"': 'aaron',
    'Chicharon': 'aaron',
    // Handle variations with model suffixes
    'ZeeRah (Claude Sonnet 4.5)': 'zeerah',
    'DiZee (Claude Sonnet 4.5)': 'dizee',
    'Belle (Claude Sonnet 4.5)': 'belle',
    'Zee (Claude Sonnet 4.5)': 'zee',
    // Generic Claude credits → split between Zee & ZeeRah
    'Claude Sonnet 4.5': 'zee',      // Sonnet 4.5 → Zee
    'Claude Sonnet': 'zeerah',       // Sonnet (no version) → ZeeRah
    'Sonnet': 'zeerah',              // Just "Sonnet" → ZeeRah
    'Claude Opus 4.5': 'belle',      // Opus → Belle
    'Claude Opus': 'belle',          // Opus (no version) → Belle
};

/** Signature colors from CrewCardData (for portrait glow) */
export const CREW_COLORS: Record<string, string> = {
    tori:        '#ff6b9d',
    zee:         '#00d4ff',
    zeerah:      '#ff8c00',
    dizee:       '#00ff88',
    belle:       '#a78bfa',
    genzee:      '#ef4444',
    perplexizee: '#60a5fa',
    cozee:       '#34d399',
    aaron:       '#fbbf24'
};

/** Portrait paths */
export const CREW_PORTRAITS: Record<string, string> = {
    tori:        '../assets/tori-portrait.png',
    zee:         '../assets/z-portrait.png',
    zeerah:      '../assets/zr-portrait.png',
    dizee:       '../assets/dz-portrait.png',
    belle:       '../assets/iz-portrait.png',
    genzee:      '../assets/gz-portrait.png',
    perplexizee: '../assets/pz-portrait.png',
    cozee:       '../assets/cz-portrait.png',
    aaron:       '../assets/creator-portrait.png'
};

/** Display names */
export const CREW_NAMES: Record<string, string> = {
    tori: 'Tori',
    zee: 'Zee',
    zeerah: 'ZeeRah',
    dizee: 'DiZee',
    belle: 'Belle',
    genzee: 'GenZee',
    perplexizee: 'PerplexiZee',
    cozee: 'CoZee',
    aaron: 'Aaron'
};

/** Contributor info with optional role */
export interface ContributorInfo {
    id: string;
    name: string;
    portrait: string;
    color: string;
    role?: string;
    isPrimary: boolean;
}

/**
 * Extract all contributor IDs from a blog entry.
 * Sources: modelId, crew[], crewAttribution.systems[], collaborators[]
 * Returns deduplicated array with primary author first.
 */
export function extractContributorIds(entry: BlogEntry): string[] {
    const ids = new Set<string>();

    // 1. Primary: modelId
    if (entry.modelId) {
        ids.add(entry.modelId);
    }

    // 2. crew[] array
    if (entry.crew) {
        for (const member of entry.crew) {
            const id = NAME_TO_ID[member.name];
            if (id) ids.add(id);
        }
    }

    // 3. crewAttribution.systems[]
    if (entry.crewAttribution?.systems) {
        for (const member of entry.crewAttribution.systems) {
            const id = NAME_TO_ID[member.name];
            if (id) ids.add(id);
        }
    }

    // 4. collaborators[] (string array)
    if (entry.collaborators) {
        for (const name of entry.collaborators) {
            const id = NAME_TO_ID[name];
            if (id) ids.add(id);
        }
    }

    // Convert to array, ensuring modelId is first if present
    const result = Array.from(ids);
    if (entry.modelId && result[0] !== entry.modelId) {
        const idx = result.indexOf(entry.modelId);
        if (idx > 0) {
            result.splice(idx, 1);
            result.unshift(entry.modelId);
        }
    }

    return result;
}

/**
 * Get full contributor info with roles from entry data.
 * Returns array capped at maxCount with overflow info.
 */
export function getContributorInfos(
    entry: BlogEntry,
    maxCount: number = 4
): { contributors: ContributorInfo[]; overflow: string[] } {
    const ids = extractContributorIds(entry);
    const roleMap = new Map<string, string>();

    // Build role map from crew/crewAttribution
    if (entry.crew) {
        for (const member of entry.crew) {
            const id = NAME_TO_ID[member.name];
            if (id) roleMap.set(id, member.contribution);
        }
    }
    if (entry.crewAttribution?.systems) {
        for (const member of entry.crewAttribution.systems) {
            const id = NAME_TO_ID[member.name];
            if (id && !roleMap.has(id)) {
                roleMap.set(id, member.contribution);
            }
        }
    }

    const contributors: ContributorInfo[] = [];
    const overflow: string[] = [];

    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const info: ContributorInfo = {
            id,
            name: CREW_NAMES[id] || id,
            portrait: CREW_PORTRAITS[id] || '',
            color: CREW_COLORS[id] || '#888',
            role: roleMap.get(id),
            isPrimary: i === 0 && id === entry.modelId
        };

        if (i < maxCount) {
            contributors.push(info);
        } else {
            overflow.push(info.name);
        }
    }

    return { contributors, overflow };
}

/**
 * Estimate word count for reading time calculation
 */
export function estimateWordCount(entry: BlogEntry): number {
    let text = entry.title + ' ' + (entry.summary || '');
    if (entry.features) text += ' ' + entry.features.join(' ');
    if (entry.theTimeline) text += ' ' + entry.theTimeline.join(' ');
    if (entry.quote) text += ' ' + entry.quote;
    return text.split(/\s+/).length;
}

/**
 * Determine vibe indicator based on entry tags/type
 */
export function getVibeIndicator(entry: BlogEntry): { emoji: string; label: string } {
    const tags = entry.tags || [];
    const type = entry.type || '';

    const content = `${entry.title} ${entry.summary || ''}`.toLowerCase();

    if (content.includes('milestone') || content.includes('achievement') || content.includes('complete')) {
        return { emoji: '🎯', label: 'Milestone' };
    }
    if (content.includes('bug') || content.includes('fix') || content.includes('debug')) {
        return { emoji: '💀', label: 'Debug Hell' };
    }
    if (content.includes('refactor') || content.includes('clean')) {
        return { emoji: '✨', label: 'Clean Refactor' };
    }
    if (content.includes('experiment') || content.includes('trying') || tags.includes('v3-lab')) {
        return { emoji: '🤔', label: 'Experiment' };
    }
    if (type === 'breakthrough' || content.includes('breakthrough')) {
        return { emoji: '🔥', label: 'Breakthrough' };
    }

    return { emoji: '🎮', label: 'Having Fun' };
}

/**
 * Get icon for stat type
 */
export function getStatIcon(statKey: string): string {
    const icons: Record<string, string> = {
        linesAdded: '📊',
        linesChanged: '📝',
        filesChanged: '📁',
        testsAdded: '🧪',
        commits: '💾',
        duration: '⏱️'
    };
    return icons[statKey] || '📊';
}

/**
 * Get contributor signature/catchphrase
 */
export function getContributorSignature(modelId: string): string {
    const signatures: Record<string, string> = {
        dizee: '<em>Built with precision.</em> — DiZee',
        belle: '<em>Chef\'s kiss.</em> 💋 — Belle',
        tori: '<em>Zero regressions.</em> — Tori',
        genzee: '<em>Vibes are immaculate.</em> — Genzee',
        zee: '<em>We built this.</em> — Zee',
        zeerah: '<em>Architecture is philosophy.</em> — ZeeRah',
        cozee: '<em>First write, best write.</em> — CoZee',
        perplexizee: '<em>Sources cited.</em> — PerplexiZee',
        aaron: '<em>What if we just…</em> — Chicharon'
    };
    return signatures[modelId] || '';
}
