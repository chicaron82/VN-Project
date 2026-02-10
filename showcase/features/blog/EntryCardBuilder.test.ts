/**
 * EntryCardBuilder Tests
 * Tests for pure utility functions used in timeline card generation
 */
import {
    estimateWordCount,
    getVibeIndicator,
    getStatIcon,
    getContributorSignature,
    renderMedia,
} from './EntryCardBuilder';
import type { BlogEntry } from '../../data/blog/types';

// Mock Logger
vi.mock('@utils/Logger', () => ({
    Logger: { ui: vi.fn(), system: vi.fn(), scene: vi.fn() }
}));

function mockEntry(overrides: Partial<BlogEntry> = {}): BlogEntry {
    return {
        id: 'test-entry',
        title: 'Test Entry',
        summary: 'A test summary for the entry',
        ...overrides,
    };
}

describe('EntryCardBuilder', () => {
    describe('estimateWordCount', () => {
        it('should count words from title and summary', () => {
            const entry = mockEntry({ title: 'Hello World', summary: 'This is a test' });
            expect(estimateWordCount(entry)).toBeGreaterThanOrEqual(6);
        });

        it('should include features in word count', () => {
            const withoutFeatures = estimateWordCount(mockEntry());
            const withFeatures = estimateWordCount(mockEntry({
                features: ['Feature one', 'Feature two', 'Feature three']
            }));
            expect(withFeatures).toBeGreaterThan(withoutFeatures);
        });

        it('should include theTimeline in word count', () => {
            const base = estimateWordCount(mockEntry());
            const withTimeline = estimateWordCount(mockEntry({
                theTimeline: ['Day 1: Started', 'Day 2: Continued']
            }));
            expect(withTimeline).toBeGreaterThan(base);
        });

        it('should include quote in word count', () => {
            const base = estimateWordCount(mockEntry());
            const withQuote = estimateWordCount(mockEntry({
                quote: 'This is a really long inspirational quote about building software'
            }));
            expect(withQuote).toBeGreaterThan(base);
        });

        it('should handle entry with only title', () => {
            const entry = mockEntry({ summary: undefined });
            expect(estimateWordCount(entry)).toBeGreaterThanOrEqual(1);
        });
    });

    describe('getVibeIndicator', () => {
        it('should return milestone for milestone content', () => {
            const entry = mockEntry({ title: 'Major Milestone Achieved' });
            const vibe = getVibeIndicator(entry);
            expect(vibe.emoji).toBe('🎯');
            expect(vibe.label).toBe('Milestone');
        });

        it('should return debug for bug content', () => {
            const entry = mockEntry({ title: 'Critical Bug Fix' });
            const vibe = getVibeIndicator(entry);
            expect(vibe.emoji).toBe('💀');
            expect(vibe.label).toBe('Debug Hell');
        });

        it('should return clean refactor for refactor content', () => {
            const entry = mockEntry({ title: 'Refactor the Architecture' });
            const vibe = getVibeIndicator(entry);
            expect(vibe.emoji).toBe('✨');
            expect(vibe.label).toBe('Clean Refactor');
        });

        it('should return experiment for experimental content', () => {
            const entry = mockEntry({ title: 'Trying New Experiment' });
            const vibe = getVibeIndicator(entry);
            expect(vibe.emoji).toBe('🤔');
            expect(vibe.label).toBe('Experiment');
        });

        it('should detect experiment from v3-lab tag', () => {
            const entry = mockEntry({ title: 'Session 1', tags: ['v3-lab'] });
            const vibe = getVibeIndicator(entry);
            expect(vibe.emoji).toBe('🤔');
            expect(vibe.label).toBe('Experiment');
        });

        it('should return breakthrough for breakthrough type', () => {
            const entry = mockEntry({ type: 'breakthrough' });
            const vibe = getVibeIndicator(entry);
            expect(vibe.emoji).toBe('🔥');
            expect(vibe.label).toBe('Breakthrough');
        });

        it('should default to Having Fun', () => {
            const entry = mockEntry({ title: 'Regular Update' });
            const vibe = getVibeIndicator(entry);
            expect(vibe.emoji).toBe('🎮');
            expect(vibe.label).toBe('Having Fun');
        });
    });

    describe('getStatIcon', () => {
        it('should return correct icons for known stat types', () => {
            expect(getStatIcon('linesAdded')).toBe('📊');
            expect(getStatIcon('filesChanged')).toBe('📁');
            expect(getStatIcon('testsAdded')).toBe('🧪');
            expect(getStatIcon('commits')).toBe('💾');
            expect(getStatIcon('duration')).toBe('⏱️');
        });

        it('should return default icon for unknown stat', () => {
            expect(getStatIcon('unknownStat')).toBe('📊');
        });
    });

    describe('getContributorSignature', () => {
        it('should return signature for known contributors', () => {
            expect(getContributorSignature('dizee')).toContain('DiZee');
            expect(getContributorSignature('belle')).toContain('Belle');
            expect(getContributorSignature('tori')).toContain('Tori');
            expect(getContributorSignature('genzee')).toContain('Genzee');
        });

        it('should return empty string for unknown contributor', () => {
            expect(getContributorSignature('unknown')).toBe('');
        });
    });

    describe('renderMedia', () => {
        it('should return null for entry without media', () => {
            const entry = mockEntry();
            expect(renderMedia(entry)).toBeNull();
        });

        it('should return null for empty carousel', () => {
            const entry = mockEntry({ media: { carousel: [] } });
            expect(renderMedia(entry)).toBeNull();
        });

        it('should render image items', () => {
            const entry = mockEntry({
                media: {
                    carousel: [
                        { type: 'image', url: 'test.png', caption: 'Test Image' }
                    ]
                }
            });
            const el = renderMedia(entry);
            expect(el).not.toBeNull();
            expect(el!.querySelector('img')).not.toBeNull();
            expect(el!.querySelector('img')?.getAttribute('src')).toBe('test.png');
        });

        it('should render video items', () => {
            const entry = mockEntry({
                media: {
                    carousel: [
                        { type: 'video', url: 'test.mp4', caption: 'Test Video' }
                    ]
                }
            });
            const el = renderMedia(entry);
            expect(el).not.toBeNull();
            expect(el!.querySelector('video')).not.toBeNull();
        });

        it('should render captions when provided', () => {
            const entry = mockEntry({
                media: {
                    carousel: [
                        { type: 'image', url: 'test.png', caption: 'My Caption' }
                    ]
                }
            });
            const el = renderMedia(entry);
            expect(el!.querySelector('.blog-media-caption')?.textContent).toBe('My Caption');
        });

        it('should handle multiple carousel items', () => {
            const entry = mockEntry({
                media: {
                    carousel: [
                        { type: 'image', url: 'a.png', caption: 'A' },
                        { type: 'image', url: 'b.png', caption: 'B' },
                        { type: 'video', url: 'c.mp4', caption: 'C' }
                    ]
                }
            });
            const el = renderMedia(entry);
            expect(el!.querySelectorAll('.blog-media-item').length).toBe(3);
        });
    });
});
