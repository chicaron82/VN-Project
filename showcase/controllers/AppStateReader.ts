/**
 * APP STATE READER
 * Reads app state from localStorage/sessionStorage for banner preview cards.
 * No DOM dependencies — pure state reading logic.
 *
 * Extracted from BannerPreviewCard.ts
 * 💚🔥💀
 */

import { Logger } from '@utils/Logger';

export interface AppStateData {
    state: string[];
    hasSave: boolean;
    lastPlayed?: Date | null;
    progress?: number;
    mood?: string;
    isHangry?: boolean;
}

/**
 * Get app state from localStorage by app ID
 */
export function getAppState(appId: string): AppStateData {
    switch (appId) {
        case 'v1':
            return getV1State();
        case 'v2':
            return getV2State();
        case 'showcase':
            return getShowcaseState();
        case 'tg':
            return getTorigatchiState();
        default:
            return { state: ['Unknown App'], hasSave: false };
    }
}

/**
 * Get V1 app state from localStorage
 */
function getV1State(): AppStateData {
    const loopVersion = localStorage.getItem('uv7_loop_version') || '848';
    const route = localStorage.getItem('uv7_current_route') || '';
    const act = localStorage.getItem('uv7_current_act');
    const lastPlayed = localStorage.getItem('uv7_last_played_v1');

    if (!route || route === 'menu' || route === '') {
        return {
            state: [`Loop ${loopVersion}`, 'Main Menu'],
            hasSave: false
        };
    }

    const routeDisplay = route.charAt(0).toUpperCase() + route.slice(1);
    const actDisplay = act ? `Act ${act}` : '';

    return {
        state: [routeDisplay, actDisplay || `Loop ${loopVersion}`],
        hasSave: true,
        lastPlayed: lastPlayed ? new Date(parseInt(lastPlayed)) : null,
        progress: calculateV1Progress(route, act)
    };
}

/**
 * Calculate V1 progress percentage
 */
function calculateV1Progress(route: string, act: string | null): number {
    if (!route || route === 'menu') return 0;
    const actNum = act ? parseInt(act) : 1;
    return Math.min(100, Math.round((actNum / 3) * 100));
}

/**
 * Get V2 app state from localStorage
 */
function getV2State(): AppStateData {
    const stateJson = localStorage.getItem('uv7_game_state');
    const lastPlayed = localStorage.getItem('uv7_last_played_v2');

    if (stateJson) {
        try {
            const state = JSON.parse(stateJson);
            const route = state?.game?.currentRoute || 'menu';
            const act = state?.game?.currentAct;
            const tether = state?.tether?.level;

            if (route && route !== 'menu') {
                const routeDisplay = route.charAt(0).toUpperCase() + route.slice(1);
                return {
                    state: [
                        routeDisplay,
                        act ? `Act ${act}` : (typeof tether === 'number' ? `⚡${Math.round(tether)}%` : 'V2 Beta')
                    ],
                    hasSave: true,
                    lastPlayed: lastPlayed ? new Date(parseInt(lastPlayed)) : null,
                    progress: calculateV2Progress(state)
                };
            }
        } catch (e) {
            Logger.warn('Failed to parse V2 state:', e);
        }
    }

    const testCount = localStorage.getItem('uv7_test_count') || '435';
    return {
        state: ['V2 Beta', `${testCount} tests`],
        hasSave: false
    };
}

/**
 * Calculate V2 progress percentage
 */
function calculateV2Progress(state: { tether?: { level?: number } }): number {
    const tether = state?.tether?.level;
    if (typeof tether === 'number') {
        return Math.round(tether);
    }
    return 0;
}

/**
 * Get Showcase app state from localStorage
 */
function getShowcaseState(): AppStateData {
    const phase = sessionStorage.getItem('uv7-showcase-phase') || 'phase-1';
    const phaseNum = phase.replace('phase-', '');
    const codes = JSON.parse(localStorage.getItem('uv7_discovered_codes') || '[]');
    const codeCount = codes.length;
    const lastVisit = localStorage.getItem('uv7-showcase-last-visit');

    return {
        state: [`Phase ${phaseNum}`, codeCount > 0 ? `${codeCount} codes` : 'Exploring'],
        hasSave: codeCount > 0,
        lastPlayed: lastVisit ? new Date(parseInt(lastVisit)) : null,
        progress: Math.min(100, Math.round((parseInt(phaseNum) / 15) * 100))
    };
}

/**
 * Get Torigatchi app state from localStorage
 */
function getTorigatchiState(): AppStateData {
    const state = localStorage.getItem('torigatchi-state');
    if (!state) {
        return {
            state: ['Not Started', 'Ready to Play'],
            hasSave: false
        };
    }

    try {
        const data = JSON.parse(state);
        const lastFed = new Date(data.lastFed);
        const now = new Date();
        const hoursSince = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);

        let mood: string, moodEmoji: string, isHangry = false;
        if (hoursSince > 24) {
            mood = 'BEYOND HANGRY';
            moodEmoji = '💀';
            isHangry = true;
        } else if (hoursSince > 8) {
            mood = 'HANGRY';
            moodEmoji = '😡';
            isHangry = true;
        } else if (hoursSince > 5) {
            mood = 'Hungry';
            moodEmoji = '😤';
        } else if (hoursSince > 3) {
            mood = 'Content';
            moodEmoji = '😊';
        } else {
            mood = 'Happy';
            moodEmoji = '😄';
        }

        return {
            state: [`${moodEmoji} ${mood}`, `${Math.round(hoursSince)}h ago`],
            hasSave: true,
            lastPlayed: lastFed,
            mood: `${moodEmoji} ${mood}`,
            isHangry
        };
    } catch (e) {
        Logger.warn('Failed to parse Torigatchi state:', e);
        return {
            state: ['Error', 'Invalid State'],
            hasSave: false
        };
    }
}

/**
 * Format timestamp as "X ago" relative time
 */
export function formatTimestamp(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}
