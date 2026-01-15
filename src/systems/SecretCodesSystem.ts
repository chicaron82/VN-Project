
import { EventBus } from '@core/EventBus';
import { StateManager } from '@core/StateManager';
import { BootstrapTracker } from '@systems/BootstrapTracker';
import { DevCommentarySystem } from '@systems/DevCommentarySystem';

interface CodeDefinition {
    name: string;
    description: string;
    icon?: string;
    reward: () => void;
    isDev?: boolean;
}

export class SecretCodesSystem {
    private eventBus: EventBus;
    private stateManager: StateManager;
    private bootstrapTracker: BootstrapTracker;
    private devCommentarySystem?: DevCommentarySystem; // Optional for now until fully wired
    private discoveredCodes: Set<string>;
    private readonly STORAGE_KEY = 'uv7_discovered_codes';

    // Codes Registry
    private codes: Record<string, CodeDefinition>;

    constructor(
        eventBus: EventBus,
        stateManager: StateManager,
        bootstrapTracker: BootstrapTracker,
        devCommentarySystem?: DevCommentarySystem
    ) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.bootstrapTracker = bootstrapTracker;
        this.devCommentarySystem = devCommentarySystem;
        this.discoveredCodes = this.loadDiscoveredCodes();

        // Bind events
        this.eventBus.on('ui:code_submit', this.handleCodeSubmit.bind(this));

        // Initialize Codes Registry
        this.codes = this.initializeCodes();
    }

    private loadDiscoveredCodes(): Set<string> {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch {
            return new Set();
        }
    }

    private saveDiscoveredCodes(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...this.discoveredCodes]));
        } catch (e) {
            console.error('Failed to save discovered codes', e);
        }
    }

    private initializeCodes(): Record<string, CodeDefinition> {
        return {
            'konami': {
                name: 'Konami Code',
                description: 'Enter the legendary code. Some knowledge transcends timelines.',
                icon: '🎮',
                reward: () => {
                    console.log('🎮 Konami Code Activated!');
                    this.stateManager.set('game.easterEggs.konami', true);
                    this.eventBus.emit('ui:screen_change', { screen: 'secret_konami' });
                }
            },
            'bootstrap': {
                name: 'Loop Timeline',
                description: 'Visualize every attempt that led here.',
                icon: '🔄',
                reward: () => {
                    console.log('🔄 Bootstrap Timeline - Opening timeline modal');
                    this.bootstrapTracker.showTimelineModal();
                }
            },
            '848': {
                name: 'True Attempt Number',
                description: 'Your actual loop count.',
                icon: '🔢',
                reward: () => {
                    const attempt = this.bootstrapTracker.getCurrentAttempt();
                    console.log(`🔢 True Attempt Number: ${attempt}`);
                }
            },
            // DEV COMMANDS
            'reset848': {
                name: 'Reset 848',
                description: 'Dev Command: Reset Version',
                isDev: true,
                reward: () => {
                    this.bootstrapTracker.reset();
                    window.location.reload();
                }
            },
            'nuke': {
                name: 'Nuclear Reset',
                description: 'Clear ALL Data',
                isDev: true,
                reward: () => {
                    localStorage.clear();
                    window.location.reload();
                }
            },
            'chicharon': {
                name: 'Dev Commentary',
                description: 'Unlock behind-the-scenes notes.',
                icon: '🎙️',
                reward: () => {
                    if (this.devCommentarySystem) {
                        this.devCommentarySystem.unlockCommentary();
                        console.log('🎙️ Dev Commentary Unlocked');
                    }
                }
            },
            'uv7crew': {
                name: 'Directors Cut',
                description: 'Unlock extended crew statements.',
                icon: '🎬',
                reward: () => {
                    localStorage.setItem('directorsCutUnlocked', 'true');
                    console.log('🎬 Directors Cut Unlocked');
                }
            }
        };
    }

    private handleCodeSubmit(data: { code: string }): void {
        const normalized = data.code.trim().toLowerCase();
        const codeDef = this.codes[normalized];

        if (codeDef) {
            // Execute Reward
            codeDef.reward();

            // Track Discovery (if not dev command)
            if (!codeDef.isDev && !this.discoveredCodes.has(normalized)) {
                this.discoveredCodes.add(normalized);
                this.saveDiscoveredCodes();
                // Emit discovery event if needed (e.g. 'ui:code_discovered')
            }

            // Haptic/Visual Feedback for Success
            this.eventBus.emit('visual:cue', { type: 'success', channel: 'ui' });
            this.eventBus.emit('tether:boost', { amount: 5 }); // Tiny boost for fun
        } else {
            // Failure Feedback
            this.eventBus.emit('ui:denied', {});
        }
    }

    /**
     * Get list of discovered codes for UI Settings display
     */
    public getDiscoveredCodes(): Array<{ code: string } & CodeDefinition> {
        return Array.from(this.discoveredCodes)
            .filter(code => this.codes[code] !== undefined)
            .map(code => ({
                code,
                ...this.codes[code]!
            }));
    }
}
