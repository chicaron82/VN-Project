import { SettingsSystem } from '@systems/SettingsSystem';
import { EventBus } from '@core/EventBus';
import { GameConfig } from '@core/GameConfig';
import { StateManager } from '@core/StateManager';

export interface DialogState {
    fullText: string;
    currentText: string;
    isTyping: boolean;
    isComplete: boolean;
    pageIndex: number;
    totalPages: number;
}

export interface SkipState {
    isSkipping: boolean;
    skipUnlocked: boolean;
}

export class DialogController {
    private settings: SettingsSystem;
    private eventBus: EventBus;
    private stateManager: StateManager | null = null;

    private state: DialogState = {
        fullText: '',
        currentText: '',
        isTyping: false,
        isComplete: true,
        pageIndex: 0,
        totalPages: 1
    };

    // Skip system state
    private skipState: SkipState = {
        isSkipping: false,
        skipUnlocked: false
    };

    // Current scene tracking for read/unread
    private currentSceneId: string | null = null;
    private currentDialogueIndex: number = 0;

    private pages: string[] = [];
    private charIndex: number = 0;
    private timer: any = null;
    private onUpdate: ((text: string) => void) | null = null;

    // Typewriter settings
    private readonly TYPEWRITER_SPEED = GameConfig.TIMING.TYPEWRITER_SPEED_MS;
    private readonly SKIP_SPEED = 5; // 6x faster (5ms vs 30ms)

    constructor(settings: SettingsSystem, eventBus: EventBus, stateManager?: StateManager) {
        this.settings = settings;
        this.eventBus = eventBus;
        this.stateManager = stateManager ?? null;

        // Load skip unlock state
        this.loadSkipUnlockState();

        // Subscribe to skip events
        this.setupSkipListeners();
    }

    // ========================================
    // SKIP SYSTEM INITIALIZATION
    // ========================================

    /**
     * Load skip unlock state from StateManager/localStorage
     */
    private loadSkipUnlockState(): void {
        // Check StateManager first
        if (this.stateManager) {
            const unlocked = this.stateManager.get<boolean>('unlocks.skipUnlocked');
            if (unlocked !== undefined) {
                this.skipState.skipUnlocked = unlocked;
                return;
            }
        }

        // Fallback to localStorage (V1 compatibility)
        if (typeof localStorage !== 'undefined') {
            this.skipState.skipUnlocked = localStorage.getItem('skipUnlocked') === 'true';
        }
    }

    /**
     * Setup EventBus listeners for skip system
     */
    private setupSkipListeners(): void {
        // Listen for skip toggle events
        this.eventBus.on('skip:toggle', () => {
            this.toggleSkip();
        });

        // Listen for skip activation (hold-to-skip)
        this.eventBus.on('skip:activate', () => {
            if (this.skipState.skipUnlocked) {
                this.setSkipActive(true);
            }
        });

        // Listen for skip deactivation
        this.eventBus.on('skip:deactivate', () => {
            this.setSkipActive(false);
        });

        // Listen for scene changes to track read state
        this.eventBus.on('scene:load', (data) => {
            this.currentSceneId = data.sceneId;
            this.currentDialogueIndex = 0;
        });
    }

    /**
     * Set callback for text updates (avoids EventBus spam)
     */
    onTextUpdate(callback: (text: string) => void) {
        this.onUpdate = callback;
    }

    /**
     * Start displaying text
     * @param text - The text to display
     * @param reset - Whether to reset pagination (default: true)
     * @param sceneId - Optional scene ID for read tracking
     */
    show(text: string, reset: boolean = true, sceneId?: string) {
        // Update scene context if provided
        if (sceneId && sceneId !== this.currentSceneId) {
            this.currentSceneId = sceneId;
            this.currentDialogueIndex = 0;
        }

        if (reset) {
            // Mobile Pagination Logic (simplified port from V1)
            // For now, simple split or just full text.
            // V1 had specific logic for mobile portrait (150 chars).
            // We'll implement basic pagination support.

            this.pages = this.paginate(text);
            this.state.pageIndex = 0;
            this.state.totalPages = this.pages.length;
        }

        this.startTypingPage(this.state.pageIndex);
    }

    private paginate(text: string): string[] {
        // Check if pagination is needed (e.g. text length > 150)
        // This logic should ideally check viewport, but strictly speaking 
        // the controller handles the *logic* of pagination.
        // For V2 MVP, let's just support it if text is very long.
        if (text.length > 200) {
            // Simple split for now, V1 had more robust word wrapping logic 
            // which we can improve later or port if needed.
            // Let's just stick to non-paginated for parity unless explicitly needed, 
            // as V1 only did it for mobile portrait.
            // Actually, let's keep it as single page for now to be safe, 
            // as pagination logic relies on UI dims often.
            return [text];
        }
        return [text];
    }

    private startTypingPage(pageIndex: number) {
        this.state.fullText = this.pages[pageIndex] ?? '';
        this.state.currentText = '';
        this.state.isTyping = true;
        this.state.isComplete = false;
        this.charIndex = 0;

        this.clearTimer();
        this.tick();
    }

    private tick() {
        if (!this.state.isTyping) return;

        if (this.charIndex < this.state.fullText.length) {
            this.state.currentText += this.state.fullText[this.charIndex];
            this.charIndex++;

            if (this.onUpdate) this.onUpdate(this.state.currentText);

            const speed = this.calculateSpeed();

            if (speed === 0) {
                // Instant
                this.complete();
            } else {
                this.timer = setTimeout(() => this.tick(), speed);
            }
        } else {
            this.complete();
        }
    }

    private complete() {
        this.state.currentText = this.state.fullText;
        this.state.isTyping = false;
        this.state.isComplete = true;
        this.clearTimer();

        // Mark this dialogue as read
        this.markCurrentAsRead();

        if (this.onUpdate) this.onUpdate(this.state.currentText);
        this.eventBus.emit('dialog:complete', {});

        // If skip is active and content was read, emit skipping event for auto-advance
        if (this.skipState.isSkipping) {
            // Small delay so player can see the text briefly (100ms like V1)
            setTimeout(() => {
                if (this.skipState.isSkipping) {
                    this.eventBus.emit('dialog:skipping', {});
                }
            }, 100);
        }
    }

    private clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    private calculateSpeed(): number {
        // V1 Logic ported to V2:
        // if (skipActive) return 5;
        // if (slowReveal) return 150;
        // return 30 * multiplier;

        // Skip mode: 6x speed (5ms instead of 30ms)
        if (this.skipState.isSkipping && this.isCurrentDialogueRead()) {
            return this.SKIP_SPEED;
        }

        // Get speed from settings
        const settingSpeed = this.settings.get('textSpeed') || this.TYPEWRITER_SPEED;

        return settingSpeed;
    }

    // ========================================
    // READ/UNREAD TRACKING SYSTEM
    // ========================================

    /**
     * Generate a unique key for the current dialogue entry
     */
    private getDialogueKey(): string {
        return `${this.currentSceneId}:${this.currentDialogueIndex}`;
    }

    /**
     * Get the set of read dialogue entries from StateManager
     */
    private getReadDialogueSet(): Set<string> {
        if (!this.stateManager) {
            // Fallback to localStorage
            if (typeof localStorage !== 'undefined') {
                try {
                    const stored = localStorage.getItem('readDialogue');
                    return stored ? new Set(JSON.parse(stored)) : new Set();
                } catch {
                    return new Set();
                }
            }
            return new Set();
        }

        const stored = this.stateManager.get<string[]>('readDialogue');
        return stored ? new Set(stored) : new Set();
    }

    /**
     * Save the set of read dialogue entries
     */
    private saveReadDialogueSet(readSet: Set<string>): void {
        const array = Array.from(readSet);

        if (this.stateManager) {
            this.stateManager.set('readDialogue', array);
        }

        // Also save to localStorage for persistence
        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem('readDialogue', JSON.stringify(array));
            } catch {
                // Storage full or unavailable
            }
        }
    }

    /**
     * Mark current dialogue as read
     */
    markCurrentAsRead(): void {
        if (!this.currentSceneId) return;

        const key = this.getDialogueKey();
        const readSet = this.getReadDialogueSet();

        if (!readSet.has(key)) {
            readSet.add(key);
            this.saveReadDialogueSet(readSet);
        }

        // Increment index for next dialogue in same scene
        this.currentDialogueIndex++;
    }

    /**
     * Check if current dialogue has been read before
     */
    isCurrentDialogueRead(): boolean {
        if (!this.currentSceneId) return false;

        const key = this.getDialogueKey();
        const readSet = this.getReadDialogueSet();
        return readSet.has(key);
    }

    /**
     * Check if any upcoming dialogue in current scene is read (for skip button visibility)
     */
    hasReadContent(): boolean {
        if (!this.currentSceneId) return false;

        const readSet = this.getReadDialogueSet();

        // Check if any entry for current scene exists
        for (const key of readSet) {
            if (key.startsWith(`${this.currentSceneId}:`)) {
                return true;
            }
        }
        return false;
    }

    // ========================================
    // SKIP MODE CONTROL
    // ========================================

    /**
     * Toggle skip mode on/off
     */
    toggleSkip(): void {
        if (!this.skipState.skipUnlocked) {
            console.log('[DialogController] Skip not unlocked');
            return;
        }

        this.setSkipActive(!this.skipState.isSkipping);
    }

    /**
     * Set skip active state
     */
    setSkipActive(active: boolean): void {
        const wasSkipping = this.skipState.isSkipping;
        this.skipState.isSkipping = active;

        if (active !== wasSkipping) {
            this.eventBus.emit('skip:active', { isSkipping: active });

            if (active) {
                console.log('[DialogController] Skip mode activated');

                // If currently typing and content is read, the speed will auto-adjust
                // If not typing, emit event to potentially auto-advance
                if (!this.state.isTyping && this.isCurrentDialogueRead()) {
                    this.eventBus.emit('dialog:skipping', {});
                }
            } else {
                console.log('[DialogController] Skip mode deactivated');
            }
        }
    }

    /**
     * Check if skip is currently active
     */
    isSkipActive(): boolean {
        return this.skipState.isSkipping;
    }

    /**
     * Check if skip feature is unlocked
     */
    isSkipUnlocked(): boolean {
        return this.skipState.skipUnlocked;
    }

    /**
     * Unlock skip feature (called after completing an ending)
     */
    unlockSkip(): void {
        this.skipState.skipUnlocked = true;

        if (this.stateManager) {
            this.stateManager.set('unlocks.skipUnlocked', true);
        }

        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('skipUnlocked', 'true');
        }

        console.log('[DialogController] Skip feature unlocked!');
    }

    /**
     * Get skip state for external components (e.g., SkipButton)
     */
    getSkipState(): SkipState {
        return { ...this.skipState };
    }

    /**
     * Skip typing (finish immediately)
     */
    skip() {
        if (this.state.isTyping) {
            this.complete();
        }
    }

    /**
     * Handle user click (Advance or Skip)
     */
    handleClick() {
        if (this.state.isTyping) {
            this.skip();
        } else {
            // If more pages, show next page
            if (this.state.pageIndex < this.state.totalPages - 1) {
                this.state.pageIndex++;
                this.startTypingPage(this.state.pageIndex);
            } else {
                // Emit advance event for GameEngine to handle next scene
                this.eventBus.emit('dialog:advance', {});
            }
        }
    }

    destroy() {
        this.clearTimer();
    }
}
