// ========================================
// LOOP CONTROLLER - Version 848
// Loop/Version system and title screen management
// V2 Port: Faithful transcription from V1
// ========================================
//
// ⚠️ VERSION 848 - THE SACRED NUMBER ⚠️
//
// 848 is NOT a build number.
// It's the loop iteration counter (847 failures + 1 success).
//
// The story is: Ronnie has tried to save Tori 847 times.
// Each attempt failed. The timeline reset.
// Version 848 is the FIRST successful iteration.
//
// There is no v849.
// Because 848 is the timeline where she came home.
//
// 848 is sacred. 💚🔥💀
//
// - Chicharon (Aaron)
//   Built with the UV7 crew
// ========================================

import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';
import { GameConfig } from '../core/GameConfig';
import { Logger } from '../utils/Logger';

// ========================================
// TYPES
// ========================================

/**
 * Loop status states
 * - 'attempting': Currently playing, hasn't reached an ending
 * - 'succeeded': TRUE ENDING achieved - the loop is broken
 * - 'accepted': DIGITAL FOREVER ending - eternal digital union chosen
 */
export type LoopStatus = 'attempting' | 'succeeded' | 'accepted';

/**
 * Loop state persisted to localStorage and StateManager
 */
export interface LoopState {
    version: number;
    status: LoopStatus;
}

// ========================================
// LOOP CONTROLLER
// ========================================

/**
 * LoopController
 *
 * Manages the loop version system and title screen visual updates.
 * Tracks player journey through failed timelines.
 *
 * The version number IS the narrative:
 * - 848 = The timeline that finally worked
 * - 849+ = Failed attempts after the player got a bad ending
 * - [FINAL] = TRUE ENDING achieved
 * - [ETERNAL] = DIGITAL FOREVER chosen
 *
 * ZEE'S ADDITION: Dynamic subtitle and footer updates 🖤
 * Makes the version number feel weighted and reactive.
 *
 * @class LoopController
 */
export class LoopController {
    private eventBus: EventBus;
    private stateManager: StateManager;

    // Current loop state (also mirrored in StateManager for reactive updates)
    private loopVersion: number = GameConfig.VERSION.DEFAULT_START;
    private loopStatus: LoopStatus = 'attempting';

    // ========================================
    // STORAGE KEYS
    // ========================================
    private static readonly STORAGE_KEY_VERSION = 'loopVersion';
    private static readonly STORAGE_KEY_STATUS = 'loopStatus';

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;

        // Load persisted state
        this.loadFromStorage();

        // Sync to StateManager for reactive UI updates
        this.syncToStateManager();

        // Listen for game events that affect loop state
        this.setupEventListeners();

        Logger.system(`🔄 LoopController initialized - VERSION ${this.loopVersion} (${this.loopStatus})`);
    }

    // ========================================
    // STORAGE & PERSISTENCE
    // ========================================

    /**
     * Load loop state from localStorage
     * DiZee: Persistent across browser sessions
     */
    private loadFromStorage(): void {
        try {
            const savedVersion = localStorage.getItem(LoopController.STORAGE_KEY_VERSION);
            const savedStatus = localStorage.getItem(LoopController.STORAGE_KEY_STATUS);

            if (savedVersion) {
                this.loopVersion = parseInt(savedVersion, 10);
                // Sanity check - never go below 848
                if (this.loopVersion < GameConfig.VERSION.DEFAULT_START) {
                    this.loopVersion = GameConfig.VERSION.DEFAULT_START;
                }
            }

            if (savedStatus && this.isValidStatus(savedStatus)) {
                this.loopStatus = savedStatus as LoopStatus;
            }

            Logger.system(`📂 Loop state loaded: v${this.loopVersion} (${this.loopStatus})`);
        } catch (error) {
            Logger.warn('⚠️ Failed to load loop state from storage:', error);
            // Fall back to defaults (already set in property initializers)
        }
    }

    /**
     * Save loop state to localStorage
     */
    private saveToStorage(): void {
        try {
            localStorage.setItem(LoopController.STORAGE_KEY_VERSION, this.loopVersion.toString());
            localStorage.setItem(LoopController.STORAGE_KEY_STATUS, this.loopStatus);
        } catch (error) {
            Logger.warn('⚠️ Failed to save loop state to storage:', error);
        }
    }

    /**
     * Sync loop state to StateManager for reactive UI
     */
    private syncToStateManager(): void {
        this.stateManager.set('game.loopVersion', this.loopVersion);
        this.stateManager.set('game.loopStatus', this.loopStatus);
    }

    /**
     * Type guard for LoopStatus
     */
    private isValidStatus(status: string): status is LoopStatus {
        return ['attempting', 'succeeded', 'accepted'].includes(status);
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    private setupEventListeners(): void {
        // Listen for ending events to trigger appropriate loop state changes
        this.eventBus.on('ending:true', () => this.break());
        this.eventBus.on('ending:digitalForever', () => this.accept());
        this.eventBus.on('ending:bad', () => this.increment());

        // Listen for retry requests
        this.eventBus.on('loop:retry', () => this.increment());
    }

    // ========================================
    // VERSION MANAGEMENT
    // ========================================

    /**
     * Increment version on failure (bad ending or retry)
     * RETRY - increment version, reset to attempting
     */
    public increment(): number {
        this.loopVersion++;
        this.loopStatus = 'attempting';

        // Persist
        this.saveToStorage();
        this.syncToStateManager();

        // Emit event for UI updates
        this.eventBus.emit('loop:updated', this.getState());

        Logger.system(`🔄 Loop incremented to VERSION ${this.loopVersion}`);

        return this.loopVersion;
    }

    /**
     * TRUE ENDING - lock version as succeeded
     * The loop is broken. Ronnie saved Tori.
     */
    public break(): void {
        this.loopStatus = 'succeeded';

        // Persist (version doesn't change, just status)
        this.saveToStorage();
        this.syncToStateManager();

        // Emit event for UI updates
        this.eventBus.emit('loop:updated', this.getState());
        this.eventBus.emit('loop:broken', this.getState());

        Logger.system(`✨ Loop broken! VERSION ${this.loopVersion} SUCCEEDED`);
    }

    /**
     * DIGITAL FOREVER - lock version as accepted
     * Player chose eternal digital union.
     */
    public accept(): void {
        this.loopStatus = 'accepted';

        // Persist
        this.saveToStorage();
        this.syncToStateManager();

        // Emit event for UI updates
        this.eventBus.emit('loop:updated', this.getState());
        this.eventBus.emit('loop:accepted', this.getState());

        Logger.system(`💫 Ending accepted. VERSION ${this.loopVersion} locked.`);
    }

    // ========================================
    // TITLE SCREEN UPDATE
    // ZEE'S ADDITION: Dynamic subtitle and footer 🖤
    // ========================================

    /**
     * Update all title screen elements based on current loop state
     * Call this when showing the main menu
     */
    public updateTitleScreen(): void {
        // Update browser tab title
        document.title = `VERSION ${this.loopVersion}`;

        // Update main menu H1
        this.updateMainTitle();

        // Update subtitle and footer (Zee's addition)
        this.updateSubtitleAndFooter();

        // Emit event so other UI components can react
        this.eventBus.emit('loop:titleUpdated', this.getState());
    }

    /**
     * Update the main title (H1) with version and visual effects
     */
    private updateMainTitle(): void {
        const mainMenuTitle = document.querySelector('#main-menu-content h1');
        if (!mainMenuTitle) {
            Logger.warn('⚠️ Main menu title element not found');
            return;
        }

        const titleEl = mainMenuTitle as HTMLElement;

        // Base title text
        titleEl.textContent = `VERSION ${this.loopVersion}`;

        // ========================================
        // VISUAL DEGRADATION SYSTEM
        // As version climbs, the system shows strain
        // ========================================

        if (this.loopStatus === 'succeeded') {
            // TRUE ENDING: Gold/Stable
            titleEl.classList.remove('version-glitch');
            titleEl.style.color = '#ffd700';
            titleEl.textContent += ' [FINAL]';

        } else if (this.loopStatus === 'accepted') {
            // DIGITAL FOREVER: Cyan/Stable
            titleEl.classList.remove('version-glitch');
            titleEl.style.color = '#0ff';
            titleEl.textContent += ' [ETERNAL]';

        } else if (this.loopVersion > GameConfig.VERSION.DEFAULT_START) {
            // FAILED LOOPS: Red glitch + intensity based on attempts
            titleEl.classList.add('version-glitch');

            // Color degradation as attempts climb
            const failureCount = this.loopVersion - GameConfig.VERSION.DEFAULT_START;
            if (failureCount < 5) {
                titleEl.style.color = '#ff6b6b'; // Light red
            } else if (failureCount < 10) {
                titleEl.style.color = '#ff4444'; // Medium red
            } else {
                titleEl.style.color = '#ff0000'; // Deep red - desperate
            }

        } else {
            // DEFAULT 848: Clean cyan
            titleEl.classList.remove('version-glitch');
            titleEl.style.color = '#0ff';
        }
    }

    /**
     * Update subtitle and footer dynamically
     * ZEE'S ADDITION: Makes version number feel weighted and reactive 🖤
     */
    private updateSubtitleAndFooter(): void {
        const subtitle = document.querySelector('.subtitle') as HTMLElement | null;
        const footer = document.querySelector('.menu-footer') as HTMLElement | null;

        if (!subtitle || !footer) {
            if (!subtitle) Logger.warn('⚠️ .subtitle element not found in DOM');
            if (!footer) Logger.warn('⚠️ .menu-footer element not found in DOM');
            return;
        }

        // Remove any existing state classes
        footer.classList.remove('succeeded', 'failed');

        if (this.loopStatus === 'succeeded') {
            // ========================================
            // TRUE ENDING STATE - Player broke the loop
            // ========================================
            subtitle.textContent = 'The Timeline That Succeeded';
            footer.textContent = `[Version ${this.loopVersion} - The loop that closed]`;
            footer.classList.add('succeeded');

            Logger.system('✨ Main menu updated: TRUE ENDING state');

        } else if (this.loopStatus === 'accepted') {
            // ========================================
            // DIGITAL FOREVER STATE - Eternal digital union
            // ========================================
            subtitle.textContent = 'Forever Frozen, Forever Together';
            footer.textContent = `[Version ${this.loopVersion} - Digital permanence achieved]`;
            footer.classList.add('succeeded'); // Same glow as true ending

            Logger.system('💫 Main menu updated: DIGITAL FOREVER state');

        } else if (this.loopVersion > GameConfig.VERSION.DEFAULT_START) {
            // ========================================
            // FAILED AND INCREMENTED - Bad ending occurred
            // ========================================
            subtitle.textContent = 'My Wife Is in a Coma... and in the Code';
            footer.textContent = `[Version ${this.loopVersion} - Attempt in progress]`;
            footer.classList.add('failed');

            Logger.system(`🔄 Main menu updated: FAILED state (v${this.loopVersion})`);

        } else {
            // ========================================
            // DEFAULT STATE - First playthrough (v848)
            // ========================================
            subtitle.textContent = 'My Wife Is in a Coma... and in the Code';
            footer.textContent = `[Version ${this.loopVersion} - 847 previous failures]`;

            Logger.system('📍 Main menu updated: DEFAULT state (v848)');
        }
    }

    // ========================================
    // PUBLIC GETTERS
    // ========================================

    /**
     * Get current loop state
     */
    public getState(): LoopState {
        return {
            version: this.loopVersion,
            status: this.loopStatus
        };
    }

    /**
     * Get current version number
     */
    public getVersion(): number {
        return this.loopVersion;
    }

    /**
     * Get current status
     */
    public getStatus(): LoopStatus {
        return this.loopStatus;
    }

    /**
     * Check if the loop has been broken (true ending achieved)
     */
    public isBroken(): boolean {
        return this.loopStatus === 'succeeded';
    }

    /**
     * Check if digital forever was accepted
     */
    public isAccepted(): boolean {
        return this.loopStatus === 'accepted';
    }

    /**
     * Check if still attempting (no ending achieved yet)
     */
    public isAttempting(): boolean {
        return this.loopStatus === 'attempting';
    }

    /**
     * Get failure count (how many times past 848)
     */
    public getFailureCount(): number {
        return Math.max(0, this.loopVersion - GameConfig.VERSION.DEFAULT_START);
    }

    // ========================================
    // DEV / DEBUG TOOLS
    // ========================================

    /**
     * Reset loop state to defaults (for testing/dev commands)
     * WARNING: This resets the player's progress!
     */
    public reset(): void {
        this.loopVersion = GameConfig.VERSION.DEFAULT_START;
        this.loopStatus = 'attempting';

        this.saveToStorage();
        this.syncToStateManager();

        this.eventBus.emit('loop:updated', this.getState());
        this.eventBus.emit('loop:reset', this.getState());

        Logger.system('🔄 Loop state reset to v848 (attempting)');
    }

    /**
     * Force set version (for dev commands like RESET849)
     */
    public setVersion(version: number): void {
        this.loopVersion = Math.max(GameConfig.VERSION.DEFAULT_START, version);
        this.loopStatus = 'attempting';

        this.saveToStorage();
        this.syncToStateManager();

        this.eventBus.emit('loop:updated', this.getState());

        Logger.system(`🔧 Loop version set to ${this.loopVersion}`);
    }
}
