import { EventBus } from './EventBus';
import { SettingsSystem } from '../systems/SettingsSystem';
import { Logger } from '../utils/Logger';

export class AutoReadController {
    private eventBus: EventBus;
    private settingsSystem: SettingsSystem;
    private timer: number | null = null;
    private isPaused: boolean = false;

    constructor(eventBus: EventBus, settingsSystem: SettingsSystem) {
        this.eventBus = eventBus;
        this.settingsSystem = settingsSystem;
        this.setupListeners();
    }

    private setupListeners(): void {
        // Start timer when typewriter finishes
        this.eventBus.on('dialog:complete', () => {
            this.startTimer();
        });

        // Cancel timer when new dialog starts (user manually advanced)
        this.eventBus.on('dialog:show', () => {
            this.cancelTimer();
        });

        // Cancel timer on choice menu (don't auto-pick)
        this.eventBus.on('choice:show', () => {
            this.cancelTimer();
            this.isPaused = true;
        });

        // Resume auto-read after choice
        this.eventBus.on('choice:selected', () => {
            this.isPaused = false;
        });

        // Handle settings changes
        this.eventBus.on('settings:changed', () => {
            if (!this.settingsSystem.get('autoAdvance')) {
                this.cancelTimer();
            }
        });
    }

    private startTimer(): void {
        if (this.isPaused) return;

        const isEnabled = this.settingsSystem.get('autoAdvance');
        const delay = this.settingsSystem.get('autoAdvanceDelay');

        if (!isEnabled || !delay) return;

        this.cancelTimer();

        Logger.system(`[AutoRead] Starting timer: ${delay}ms`);
        this.timer = window.setTimeout(() => {
            Logger.system('[AutoRead] Timer fired - advancing');
            this.eventBus.emit('dialog:advance', { source: 'auto-read' });
        }, delay);
    }

    private cancelTimer(): void {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}
