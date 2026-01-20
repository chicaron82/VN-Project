import { EventBus } from '@core/EventBus';
import type { StateManager } from '@core/StateManager';

// SaveManager will be ported in a future phase
// For now, we'll use a minimal interface
interface SaveManager {
    autoSave(): Promise<void>;
}

/**
 * AutoSaveManager - Background auto-save system with backup/recovery
 * V1 Parity Port from auto-save-manager.js (323 lines)
 *
 * SOLID Refactor: Extracted from GameEngine
 *
 * Responsibilities:
 * - Time-based auto-save (every 5 minutes)
 * - Event-based triggers (choices, route points, notes)
 * - Smart throttling (30 seconds minimum between saves)
 * - Visual save indicator with success/error states
 * - Backup system (2 rotating backups)
 * - Corrupted save detection and recovery
 *
 * ZEE'S BACKUP SYSTEM: Never lose progress again 🖤
 * DIZEE'S THROTTLE: Don't spam localStorage 🔧
 * TORI'S RECOVERY: Phoenix from the ashes 💚🔥
 *
 * 848 is sacred. 💚🔥💀
 */

interface AutoSaveOptions {
    enabled?: boolean;
    intervalDuration?: number;
    minSaveInterval?: number;
    maxBackups?: number;
}

interface SaveBackup {
    timestamp: number;
    data: string;
    reason: string;
}

export class AutoSaveManager {
    private eventBus: EventBus;
    private stateManager: StateManager;
    private saveManager: SaveManager;

    // Auto-save configuration
    private enabled: boolean = true;
    private intervalDuration: number = 300000; // 5 minutes (V1 Parity)
    private minSaveInterval: number = 30000; // 30 seconds throttle (DIZEE'S THROTTLE)
    private maxBackups: number = 2;

    // State tracking
    private intervalId: number | null = null;
    private lastSaveTime: number = 0;
    private isDirty: boolean = false;

    // Backup system (ZEE'S BACKUP SYSTEM)
    private backupKey: string = 'v848_autosave_backup';
    private backups: SaveBackup[] = [];

    // Visual indicator
    private indicator: HTMLElement | null = null;
    private indicatorTimeout: number | null = null;

    constructor(
        eventBus: EventBus,
        stateManager: StateManager,
        saveManager: SaveManager,
        options: AutoSaveOptions = {}
    ) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.saveManager = saveManager;

        // Apply options
        if (options.enabled !== undefined) this.enabled = options.enabled;
        if (options.intervalDuration) this.intervalDuration = options.intervalDuration;
        if (options.minSaveInterval) this.minSaveInterval = options.minSaveInterval;
        if (options.maxBackups) this.maxBackups = options.maxBackups;

        // Load existing backups from localStorage
        this.loadBackups();

        // Create save indicator
        this.createIndicator();

        // Listen for events that should trigger auto-save
        this.setupEventListeners();

        console.log('✅ AutoSaveManager initialized');
    }

    // ========================================
    // INITIALIZATION
    // V1 Parity: auto-save-manager.js lines 35-67
    // ========================================

    /**
     * Create save indicator element
     * V1 Parity: Uses inline styles (no CSS dependencies)
     */
    private createIndicator(): void {
        this.indicator = document.createElement('div');
        this.indicator.className = 'auto-save-indicator';
        this.indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid rgba(0, 255, 255, 0.5);
            border-radius: 8px;
            color: #00ffff;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            font-weight: bold;
            z-index: 9000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(this.indicator);
    }

    /**
     * Setup event listeners for auto-save triggers
     * V1 Parity: lines 69-92
     */
    private setupEventListeners(): void {
        // Mark dirty on important game events
        // Note: These events will be added to GameEvents type as systems are ported
        // @ts-expect-error - scene:loaded event will be added in future phase
        this.eventBus.on('scene:loaded', () => {
            this.isDirty = true;
        });

        this.eventBus.on('choice:selected', () => {
            this.isDirty = true;
            this.triggerAutoSave('choice');
        });

        // @ts-expect-error - route:changed event will be added in future phase
        this.eventBus.on('route:changed', () => {
            this.isDirty = true;
            this.triggerAutoSave('route');
        });

        // @ts-expect-error - note:added event will be added in future phase
        this.eventBus.on('note:added', () => {
            this.isDirty = true;
            this.triggerAutoSave('note');
        });

        // Listen for settings changes
        this.eventBus.on('settings:changed', (data: { key: string; value: unknown }) => {
            if (data.key === 'autoSave') {
                this.enabled = data.value as boolean;
                if (this.enabled) {
                    this.start();
                } else {
                    this.stop();
                }
            }
        });
    }

    // ========================================
    // AUTO-SAVE CONTROL
    // V1 Parity: auto-save-manager.js lines 98-126
    // ========================================

    /**
     * Start auto-save interval
     * V1 Parity: 5 minute intervals by default
     */
    public start(): void {
        if (!this.enabled) {
            console.log('⏸️ Auto-save disabled');
            return;
        }

        // Clear any existing interval
        this.stop();

        // Start interval timer
        this.intervalId = window.setInterval(() => {
            if (this.isDirty) {
                this.triggerAutoSave('interval');
            }
        }, this.intervalDuration);

        console.log(`🔄 Auto-save started (interval: ${this.intervalDuration / 1000}s)`);
    }

    /**
     * Stop auto-save interval
     */
    public stop(): void {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Enable/disable auto-save
     */
    public setEnabled(enabled: boolean): void {
        this.enabled = enabled;
        if (enabled) {
            this.start();
        } else {
            this.stop();
        }
    }

    // ========================================
    // SAVE EXECUTION
    // V1 Parity: auto-save-manager.js lines 132-194
    // ========================================

    /**
     * Trigger auto-save with throttling
     * V1 Parity: Smart throttling prevents spam
     */
    public async triggerAutoSave(reason: string = 'manual'): Promise<boolean> {
        if (!this.enabled) {
            console.log('⏸️ Auto-save disabled, skipping');
            return false;
        }

        // DIZEE'S THROTTLE: Don't spam localStorage 🔧
        const now = Date.now();
        const timeSinceLastSave = now - this.lastSaveTime;
        if (timeSinceLastSave < this.minSaveInterval) {
            console.log(`⏱️ Auto-save throttled (${timeSinceLastSave}ms < ${this.minSaveInterval}ms)`);
            return false;
        }

        console.log(`💾 Triggering auto-save (reason: ${reason})`);

        try {
            // ZEE'S BACKUP SYSTEM: Create backup before saving 🖤
            await this.createBackup(reason);

            // Perform the save
            await this.saveManager.autoSave();

            // Update state
            this.lastSaveTime = now;
            this.isDirty = false;

            // Show success indicator
            this.updateIndicator('Saved!', 'success');

            console.log('✅ Auto-save completed');
            return true;

        } catch (error) {
            console.error('❌ Auto-save failed:', error);

            // TORI'S RECOVERY: Attempt to restore from backup 💚🔥
            await this.restoreFromBackup();

            // Show error indicator
            this.updateIndicator('Save failed!', 'error');

            return false;
        }
    }

    /**
     * Force immediate save (bypasses throttle)
     * V1 Parity: lines 196-205
     */
    public async forceSave(reason: string = 'force'): Promise<boolean> {
        console.log(`💾 Force saving (reason: ${reason})`);

        // Temporarily disable throttle
        const originalMinInterval = this.minSaveInterval;
        this.minSaveInterval = 0;

        const result = await this.triggerAutoSave(reason);

        // Restore throttle
        this.minSaveInterval = originalMinInterval;

        return result;
    }

    // ========================================
    // BACKUP SYSTEM
    // V1 Parity: auto-save-manager.js lines 211-268
    // ZEE'S BACKUP SYSTEM: Never lose progress again 🖤
    // ========================================

    /**
     * Create backup before saving
     * V1 Parity: Rotating backups (max 2)
     */
    private async createBackup(reason: string): Promise<void> {
        try {
            // Get current save data
            const currentData = this.stateManager.exportState();

            // Create backup entry
            const backup: SaveBackup = {
                timestamp: Date.now(),
                data: JSON.stringify(currentData),
                reason
            };

            // Add to backups array
            this.backups.push(backup);

            // Rotate backups (keep only maxBackups)
            if (this.backups.length > this.maxBackups) {
                this.backups.shift(); // Remove oldest
            }

            // Save backups to localStorage
            this.saveBackups();

            console.log(`💾 Backup created (${this.backups.length}/${this.maxBackups})`);

        } catch (error) {
            console.error('❌ Backup creation failed:', error);
        }
    }

    /**
     * Restore from most recent backup
     * TORI'S RECOVERY: Phoenix from the ashes 💚🔥
     */
    private async restoreFromBackup(): Promise<boolean> {
        if (this.backups.length === 0) {
            console.warn('⚠️ No backups available for recovery');
            return false;
        }

        try {
            // Get most recent backup
            const backup = this.backups[this.backups.length - 1];
            if (!backup) {
                console.warn('⚠️ Backup is undefined');
                return false;
            }

            console.log(`🔄 Restoring from backup (${new Date(backup.timestamp).toLocaleString()})`);

            // Parse and restore data
            const data = JSON.parse(backup.data);
            this.stateManager.importState(data);

            console.log('✅ Backup restored successfully');
            this.updateIndicator('Backup restored', 'success');

            return true;

        } catch (error) {
            console.error('❌ Backup restoration failed:', error);
            return false;
        }
    }

    /**
     * Save backups to localStorage
     */
    private saveBackups(): void {
        try {
            localStorage.setItem(this.backupKey, JSON.stringify(this.backups));
        } catch (error) {
            console.error('❌ Failed to save backups to localStorage:', error);
        }
    }

    /**
     * Load backups from localStorage
     */
    private loadBackups(): void {
        try {
            const stored = localStorage.getItem(this.backupKey);
            if (stored) {
                this.backups = JSON.parse(stored);
                console.log(`💾 Loaded ${this.backups.length} backup(s)`);
            }
        } catch (error) {
            console.error('❌ Failed to load backups:', error);
            this.backups = [];
        }
    }

    /**
     * Clear all backups
     */
    public clearBackups(): void {
        this.backups = [];
        localStorage.removeItem(this.backupKey);
        console.log('🗑️ Backups cleared');
    }

    // ========================================
    // VISUAL INDICATOR
    // V1 Parity: auto-save-manager.js lines 274-306
    // ========================================

    /**
     * Update save indicator with status message
     * V1 Parity: Success (cyan) / Error (red) states
     */
    private updateIndicator(message: string, type: 'success' | 'error'): void {
        if (!this.indicator) return;

        // Clear existing timeout
        if (this.indicatorTimeout) {
            clearTimeout(this.indicatorTimeout);
        }

        // Set message and color
        this.indicator.textContent = message;
        this.indicator.style.borderColor = type === 'success'
            ? 'rgba(0, 255, 255, 0.5)'
            : 'rgba(255, 0, 85, 0.5)';
        this.indicator.style.color = type === 'success'
            ? '#00ffff'
            : '#ff0055';

        // Show indicator
        this.indicator.style.opacity = '1';

        // Auto-hide after 2 seconds
        this.indicatorTimeout = window.setTimeout(() => {
            if (this.indicator) {
                this.indicator.style.opacity = '0';
            }
        }, 2000);
    }

    // ========================================
    // STATE ACCESSORS
    // V1 Parity: auto-save-manager.js lines 312-323
    // ========================================

    /**
     * Check if auto-save is enabled
     */
    public isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * Get time since last save (in milliseconds)
     */
    public getTimeSinceLastSave(): number {
        return Date.now() - this.lastSaveTime;
    }

    /**
     * Check if there are unsaved changes
     */
    public isDirtyState(): boolean {
        return this.isDirty;
    }

    /**
     * Get backup count
     */
    public getBackupCount(): number {
        return this.backups.length;
    }

    /**
     * Get backup history
     */
    public getBackups(): SaveBackup[] {
        return [...this.backups]; // Return copy
    }

    // ========================================
    // CLEANUP
    // ========================================

    /**
     * Clean up intervals and indicator
     * Call this when destroying the manager
     */
    public destroy(): void {
        // Stop interval
        this.stop();

        // Clear indicator timeout
        if (this.indicatorTimeout) {
            clearTimeout(this.indicatorTimeout);
        }

        // Remove indicator
        if (this.indicator) {
            this.indicator.remove();
            this.indicator = null;
        }

        console.log('🗑️ AutoSaveManager destroyed');
    }
}
