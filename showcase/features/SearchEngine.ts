/**
 * SEARCH ENGINE - Pure search logic for GlobalSearch
 *
 * Fuzzy matching, index building, and match highlighting.
 * No DOM dependencies - purely functional search operations.
 */

import { TIMELINE_DATA, type BlogEntry } from '../data/blog';
import { UV7_CREW, type CrewMember } from '../../v2/ui/components/UV7OSConfig';
import { Logger } from '@utils/Logger';

export interface SectionData {
    id: string;
    title: string;
    icon: string;
    description: string;
}

export interface SearchResultBase {
    title: string;
    subtitle: string;
    icon: string;
    score: number;
    titleHighlight?: string;
    subtitleHighlight?: string;
}

export type SearchResult =
    | (SearchResultBase & { type: 'blog'; data: BlogEntry })
    | (SearchResultBase & { type: 'section'; data: SectionData })
    | (SearchResultBase & { type: 'crew'; data: CrewMember });

export interface FuzzyMatchResult {
    matched: boolean;
    distance: number;
    indices: number[];
}

/** Showcase sections available for search */
const SECTIONS: SectionData[] = [
    { id: 'home', title: 'Home', icon: '🌐', description: 'UV7 OS Ecosystem overview' },
    { id: 'journal', title: 'The Journal', icon: '🗺️', description: 'Development timeline and blog entries' },
    { id: 'workflow', title: 'Workflow', icon: '⚙️', description: 'Development methodology and tools' },
    { id: 'spotlight', title: 'Tech Spotlight', icon: '💡', description: 'Technical deep dives and code examples' },
    { id: 'evolution', title: 'Evolution', icon: '🔄', description: 'V1 to V2 transformation story' },
    { id: 'experiment', title: 'V3 Experiment', icon: '🧪', description: 'Autonomous AI refactoring experiment' },
    { id: 'who', title: 'The Crew', icon: '👥', description: 'Meet the AI crew members' }
];

/**
 * Build search index from all showcase content
 */
export function buildSearchIndex(): SearchResult[] {
    const index: SearchResult[] = [];

    // Index blog entries
    TIMELINE_DATA.entries.forEach(entry => {
        index.push({
            type: 'blog',
            title: entry.title,
            subtitle: `${entry.date} • ${entry.tags?.slice(0, 2).join(', ') || ''}`,
            icon: entry.emoji || '📝',
            data: entry,
            score: 0
        });
    });

    // Index sections
    SECTIONS.forEach(section => {
        index.push({
            type: 'section',
            title: section.title,
            subtitle: section.description,
            icon: section.icon,
            data: section,
            score: 0
        });
    });

    // Index crew members
    UV7_CREW.forEach(member => {
        index.push({
            type: 'crew',
            title: member.name,
            subtitle: member.greeting || 'UV7 Crew Member',
            icon: member.icon,
            data: member,
            score: 0
        });
    });

    Logger.ui(`🔍 Search index built: ${index.length} items`);
    return index;
}

/**
 * Fuzzy matching with character-level tracking
 */
export function fuzzyMatch(text: string, query: string): FuzzyMatchResult {
    const indices: number[] = [];
    let queryIndex = 0;
    let textIndex = 0;

    while (queryIndex < query.length && textIndex < text.length) {
        if (query[queryIndex] === text[textIndex]) {
            indices.push(textIndex);
            queryIndex++;
        }
        textIndex++;
    }

    const matched = queryIndex === query.length;
    const distance = matched ? textIndex - queryIndex : Infinity;

    return { matched, distance, indices };
}

/**
 * Highlight matched characters with <mark> tags
 */
export function highlightMatches(text: string, indices: number[]): string {
    if (indices.length === 0) return text;

    let result = '';
    for (let i = 0; i < text.length; i++) {
        if (indices.includes(i)) {
            result += `<mark class="search-highlight">${text[i]}</mark>`;
        } else {
            result += text[i];
        }
    }
    return result;
}

/**
 * Execute a fuzzy search against the index
 */
export function executeSearch(searchIndex: SearchResult[], query: string): SearchResult[] {
    const lowerQuery = query.toLowerCase();

    return searchIndex
        .map(item => {
            const titleMatch = fuzzyMatch(item.title.toLowerCase(), lowerQuery);
            const subtitleMatch = fuzzyMatch(item.subtitle.toLowerCase(), lowerQuery);

            // Calculate score
            let score = 0;
            if (titleMatch.matched) score += 100 - titleMatch.distance;
            if (subtitleMatch.matched) score += 50 - subtitleMatch.distance;

            // Boost recent blog entries
            if (item.type === 'blog' && item.data.sortDate) {
                const date = new Date(item.data.sortDate);
                const daysSince = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
                if (daysSince < 7) score += 20;
            }

            return {
                ...item,
                score,
                titleHighlight: titleMatch.matched ? highlightMatches(item.title, titleMatch.indices) : item.title,
                subtitleHighlight: subtitleMatch.matched ? highlightMatches(item.subtitle, subtitleMatch.indices) : item.subtitle
            };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
}
