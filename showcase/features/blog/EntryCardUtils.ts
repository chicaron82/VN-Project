/**
 * ENTRY CARD UTILITIES
 * Pure functions for timeline entry card metadata.
 * No DOM access — safe for tests and server-side usage.
 */

import type { BlogEntry } from '../../data/blog';

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
        genzee: '<em>Vibes are immaculate.</em> — Genzee'
    };
    return signatures[modelId] || '';
}
