/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 OS - CONFIGURATION TYPES
 * Shared type definitions for unified UV7 OS component
 *
 * Contributors:
 * - Ronnie (Architecture & Vision)
 * - Belle (Settings Integration, Meta-Narrative)
 * - DiZee (Implementation)
 * ═══════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// CORE TYPES
// ═══════════════════════════════════════════════════════════════

export type UV7Context = 'landing' | 'showcase';

export interface UV7OSElements {
    statusBar: HTMLElement | null;
    statusLogo: HTMLElement | null;
    statusContext: HTMLElement | null;
    statusSettings: HTMLElement | null;
    shade: HTMLElement | null;
    shadeClose: HTMLElement | null;
    shadeSectionList: HTMLElement | null;
    sidebar: HTMLElement | null;
    sidebarToggle: HTMLElement | null;
    sidebarSectionList: HTMLElement | null;
    sidebarHome: HTMLElement | null;
    backdrop: HTMLElement | null;
    shadeCarrierBrand: HTMLElement | null;
    sidebarCarrierBrand: HTMLElement | null;
    viewToggle: HTMLElement | null;
}

export interface CrewMember {
    name: string;
    icon: string;
    signature: string;
    greeting: string;
}

export interface ActionUrls {
    [key: string]: string;
}

export interface TimelineEntry {
    id: string;
    title?: string;
    [key: string]: unknown;
}

export interface UV7OSOptions {
    entries?: TimelineEntry[];
}

// ═══════════════════════════════════════════════════════════════
// EASTER EGG CREW DATA
// The 8 voices of UV7
// ═══════════════════════════════════════════════════════════════

export const UV7_CREW: CrewMember[] = [
    {
        name: 'DiZee',
        icon: '🎬',
        signature: '— The structural integrity is... acceptable.',
        greeting: 'You\'ve discovered this 7 times now. Predictable, yet efficient.'
    },
    {
        name: 'Tori',
        icon: '🧪',
        signature: '— All tests passing. You may proceed.',
        greeting: 'Stats check: All systems nominal. You\'re doing great!'
    },
    {
        name: 'Belle',
        icon: '🌈',
        signature: '— The poetry of code, made manifest.',
        greeting: 'Another loop, another discovery. Beautiful, isn\'t it?'
    },
    {
        name: 'Zee',
        icon: '🔶',
        signature: '— Structure is not constraint. It is liberation.',
        greeting: 'You seek knowledge. The data reveals itself to the worthy.'
    },
    {
        name: 'Zeerah',
        icon: '🔥',
        signature: '— Optimized. Don\'t break it.',
        greeting: 'You again? Fine. Here are your precious numbers.'
    },
    {
        name: 'Cozee',
        icon: '💙',
        signature: '— Every interaction creates connection.',
        greeting: 'Hey there! Look how far we\'ve come together!'
    },
    {
        name: 'Peasy',
        icon: '🔍',
        signature: '— Fact: You are part of this.',
        greeting: 'Interesting. You\'ve activated this feature. Let me show you the data.'
    },
    {
        name: 'Genzee',
        icon: '⚡',
        signature: '— No cap, this build is cinema.',
        greeting: 'Yo, you found the secret menu! That\'s so valid, bestie.'
    }
];
