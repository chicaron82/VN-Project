import { SettingsSystem } from '@systems/SettingsSystem';
import { EventBus } from '@core/EventBus';
import { GameConfig } from '@core/GameConfig';

export interface DialogState {
    fullText: string;
    currentText: string;
    isTyping: boolean;
    isComplete: boolean;
    pageIndex: number;
    totalPages: number;
}

export class DialogController {
    private settings: SettingsSystem;
    private eventBus: EventBus;

    private state: DialogState = {
        fullText: '',
        currentText: '',
        isTyping: false,
        isComplete: true,
        pageIndex: 0,
        totalPages: 1
    };

    private pages: string[] = [];
    private charIndex: number = 0;
    private timer: any = null;
    private onUpdate: ((text: string) => void) | null = null;

    // Typewriter settings
    private readonly TYPEWRITER_SPEED = GameConfig.TIMING.TYPEWRITER_SPEED_MS;

    constructor(settings: SettingsSystem, eventBus: EventBus) {
        this.settings = settings;
        this.eventBus = eventBus;
    }

    /**
     * Set callback for text updates (avoids EventBus spam)
     */
    onTextUpdate(callback: (text: string) => void) {
        this.onUpdate = callback;
    }

    /**
     * Start displaying text
     */
    show(text: string, reset: boolean = true) {
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
        this.state.fullText = this.pages[pageIndex];
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

        if (this.onUpdate) this.onUpdate(this.state.currentText);
        this.eventBus.emit('dialog:complete', {});
    }

    private clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    private calculateSpeed(): number {
        // V1 Logic: 
        // if (skipActive) return 5;
        // if (slowReveal) return 150;
        // return 30 * multiplier;

        // We need to fetch multiplier from settings
        const settingSpeed = this.settings.get('textSpeed') || this.TYPEWRITER_SPEED;

        // TODO: Implement "Skip Mode" flag check from GameEngine or StateManager
        // For now, just return setting speed
        return settingSpeed;
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
