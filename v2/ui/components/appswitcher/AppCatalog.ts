import { Logger } from '@utils/Logger';

// ═══════════════════════════════════════════════════════════════
// APP CATALOG
// App definitions, state readers, progress calculation
//
// Extracted from UV7AppSwitcher.ts (lines 23-499)
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════

export interface AppStateData {
    state: string[];
    hasSave: boolean;
    lastPlayed?: Date | null;
    progress?: number;
    mood?: string;
    isHangry?: boolean;
}

export interface AppDefinition {
    id: string;
    name: string;
    icon: string;
    description: string;
    url: string;
    color: string;
    saveKeys: string[];
    getState: () => AppStateData;
}

export interface PreviewMetadata {
    badge?: string;
    title?: string;
    subtitle?: string;
}

export interface UndoBackup {
    app: AppDefinition;
    backup: Record<string, string>;
}

// ═══════════════════════════════════════════════════════════════
// APP CATALOG CLASS
// ═══════════════════════════════════════════════════════════════

/**
 * AppCatalog
 *
 * Defines all UV7 OS apps with their state readers, progress
 * calculation, and metadata. Pure data - no DOM dependencies.
 */
export class AppCatalog {
    /**
     * Build the full app list. Detects shell mode at call time.
     */
    createApps(): AppDefinition[] {
        const isShellMode = !!window.uv7Shell;

        return [
            {
                id: 'showcase',
                name: 'Showcase',
                icon: '📖',
                description: 'The Journey',
                url: isShellMode ? '#/showcase' : '/VN-Project/showcase/',
                color: 'rgba(0, 204, 255, 0.2)',
                saveKeys: ['uv7-showcase-phase', 'uv7_discovered_codes'],
                getState: (): AppStateData => {
                    const phase = sessionStorage.getItem('uv7-showcase-phase') || 'phase-1';
                    const phaseNum = phase.replace('phase-', '');
                    const mode = document.body?.dataset?.viewMode || 'story';
                    const codes = JSON.parse(localStorage.getItem('uv7_discovered_codes') || '[]');
                    const codeCount = codes.length;
                    const lastVisit = localStorage.getItem('uv7-showcase-last-visit');

                    return {
                        state: [`Phase ${phaseNum}`, codeCount > 0 ? `${codeCount} codes` : `${mode === 'story' ? 'Story' : 'Dev'} Mode`],
                        hasSave: codeCount > 0,
                        lastPlayed: lastVisit ? new Date(parseInt(lastVisit)) : null,
                        progress: Math.min(100, Math.round((parseInt(phaseNum) / 15) * 100))
                    };
                }
            },
            {
                id: 'v1',
                name: 'V1 Game',
                icon: '🎮',
                description: 'Legacy Version',
                url: isShellMode ? '#/v1' : '/VN-Project/v1/',
                color: 'rgba(255, 0, 85, 0.2)',
                saveKeys: ['uv7_current_route', 'uv7_current_act', 'uv7_game_state_v1'],
                getState: (): AppStateData => {
                    const loopVersion = localStorage.getItem('uv7_loop_version') || '848';
                    const route = localStorage.getItem('uv7_current_route') || '';
                    const act = localStorage.getItem('uv7_current_act');
                    const lastPlayed = localStorage.getItem('uv7_last_played_v1');

                    if (!route || route === 'menu' || route === '') {
                        return {
                            state: [`Loop ${loopVersion}`, 'Menu'],
                            hasSave: false
                        };
                    }

                    const routeDisplay = route.charAt(0).toUpperCase() + route.slice(1);
                    const actDisplay = act ? `Act ${act}` : '';

                    return {
                        state: [routeDisplay, actDisplay || `Loop ${loopVersion}`],
                        hasSave: true,
                        lastPlayed: lastPlayed ? new Date(parseInt(lastPlayed)) : null,
                        progress: this.calculateV1Progress(route, act)
                    };
                }
            },
            {
                id: 'v2',
                name: 'V2 Engine',
                icon: '⚡',
                description: 'TypeScript Rebuild',
                url: isShellMode ? '#/v2' : '/VN-Project/index.v2.html',
                color: 'rgba(0, 255, 136, 0.2)',
                saveKeys: ['uv7_game_state'],
                getState: (): AppStateData => {
                    const stateJson = localStorage.getItem('uv7_game_state');
                    const lastPlayed = localStorage.getItem('uv7_last_played_v2');

                    if (stateJson) {
                        try {
                            const state = JSON.parse(stateJson);
                            const route = state?.game?.currentRoute || 'Menu';
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
                                    progress: this.calculateV2Progress(state)
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
            },
            {
                id: 'torigatchi',
                name: 'ToriGatchi',
                icon: '💚',
                description: 'AI Tamagotchi Care Simulator',
                url: isShellMode ? '#/torigatchi' : '../torigatchi/index.html',
                color: 'rgba(0, 255, 136, 0.3)',
                saveKeys: ['torigatchi-state'],
                getState: (): AppStateData => {
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

                        // Calculate mood - ZEERAH'S MOOD SYSTEM
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
                            moodEmoji = '💚';
                        }

                        // Fourth wall break for extreme neglect
                        const userName = localStorage.getItem('uv7_user_name') || 'you';
                        const neglectMessage = hoursSince > 24
                            ? `"${userName.charAt(0).toUpperCase() + userName.slice(1)}, I KNOW you see this"`
                            : `Fed ${Math.floor(hoursSince)}h ago`;

                        return {
                            state: [`${moodEmoji} ${mood}`, neglectMessage, `Level ${data.level || 1}`],
                            hasSave: true,
                            lastPlayed: lastFed,
                            mood: mood,
                            isHangry: isHangry
                        };
                    } catch {
                        return {
                            state: ['Error Loading'],
                            hasSave: false
                        };
                    }
                }
            }
        ];
    }

    // ═══════════════════════════════════════════════════════════════
    // PROGRESS CALCULATION
    // ═══════════════════════════════════════════════════════════════

    private calculateV1Progress(route: string | null, act: string | null): number {
        // V1 has 3 routes with ~3 acts each
        const routeProgress: Record<string, number> = { tori: 0, ronnie: 33, true: 66 };
        const base = routeProgress[route?.toLowerCase() || ''] || 0;
        const actProgress = act ? (parseInt(act) / 3) * 33 : 0;
        return Math.min(100, Math.round(base + actProgress));
    }

    private calculateV2Progress(state: unknown): number {
        const s = state as { game?: { currentRoute?: string; currentAct?: number; currentSceneIndex?: number } };
        if (!s?.game) return 0;
        const route = s.game.currentRoute;
        const act = s.game.currentAct || 1;
        const sceneIndex = s.game.currentSceneIndex || 0;

        // Rough estimate based on route + act + scene
        const routeProgress: Record<string, number> = { tori: 0, ronnie: 33, true: 66 };
        const base = routeProgress[route?.toLowerCase() || ''] || 0;
        const actProgress = (act / 3) * 30;
        const sceneProgress = Math.min(3, sceneIndex / 10); // Small bonus for scene progress

        return Math.min(100, Math.round(base + actProgress + sceneProgress));
    }

    // ═══════════════════════════════════════════════════════════════
    // TIME FORMATTING - RONNIE'S UX POLISH
    // ═══════════════════════════════════════════════════════════════

    formatLastPlayed(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days}d ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}