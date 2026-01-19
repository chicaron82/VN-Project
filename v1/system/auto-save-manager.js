// ========================================
// AUTO-SAVE MANAGER - Enhanced System
// Builds on existing SaveManager auto-save
// ========================================

/**
 * AutoSaveManager - Enhanced auto-save with time-based saves, 
 * visual feedback, and smart throttling
 * 
 * Features:
 * - Time-based auto-save (every 5 minutes)
 * - Event-based triggers (choices, route points, notes)
 * - Smart throttling (prevents spam)
 * - Visual save indicator
 * - Backup slot for recovery
 * - Corrupted save detection
 */

class AutoSaveManager {
    constructor(game) {
        this.game = game;
        this.saveManager = game.saveManager;

        // Configuration
        this.enabled = true;
        this.intervalDuration = 300000; // 5 minutes
        this.minSaveInterval = 30000; // 30 seconds minimum between saves

        // State tracking
        this.lastSaveTime = 0;
        this.isDirty = false;
        this.isSaving = false;
        this.saveQueue = [];

        // Backup system
        this.backupKey = 'v848_autosave_backup';
        this.maxBackups = 2;

        // Visual indicator
        this.indicator = null;
        this.indicatorTimeout = null;

        // Initialize
        this.init();
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    init() {
        this.createIndicator();
        this.startIntervalSave();
        this.setupEventListeners();
        console.log('⏱️ Auto-Save Manager initialized (5 min intervals)');
    }

    createIndicator() {
        this.indicator = document.createElement('div');
        this.indicator.id = 'auto-save-indicator';
        this.indicator.className = 'auto-save-indicator hidden';
        this.indicator.innerHTML = `
            <div class="auto-save-content">
                <span class="auto-save-icon">💾</span>
                <span class="auto-save-text">Auto-saving...</span>
            </div>
        `;
        document.body.appendChild(this.indicator);
    }

    setupEventListeners() {
        // Mark dirty on important events
        document.addEventListener('choice-made', () => this.markDirty('choice'));
        document.addEventListener('route-point-change', () => this.markDirty('route-point'));
        document.addEventListener('note-unlocked', () => this.markDirty('note'));
        document.addEventListener('tether-change', () => this.markDirty('tether'));
    }

    // ========================================
    // TIME-BASED AUTO-SAVE
    // ========================================

    startIntervalSave() {
        setInterval(() => {
            if (this.enabled && this.isDirty && this.canSave()) {
                this.triggerAutoSave('interval');
            }
        }, this.intervalDuration);
    }

    // ========================================
    // SAVE TRIGGERING
    // ========================================

    canSave() {
        const now = Date.now();
        const timeSinceLastSave = now - this.lastSaveTime;

        // Check if enough time has passed
        if (timeSinceLastSave < this.minSaveInterval) {
            return false;
        }

        // Don't save if already saving
        if (this.isSaving) {
            return false;
        }

        // Don't save if no route active
        if (!this.game.currentRoute) {
            return false;
        }

        // Don't save during animations or transitions
        if (this.game.isAnimating || this.game.isTransitioning) {
            return false;
        }

        return true;
    }

    markDirty(reason = 'unknown') {
        this.isDirty = true;
        console.log(`🔄 Auto-save marked dirty: ${reason}`);
    }

    async triggerAutoSave(reason = 'manual') {
        if (!this.canSave()) {
            console.log(`⏭️ Auto-save skipped (${reason}): conditions not met`);
            return false;
        }

        console.log(`💾 Auto-save triggered: ${reason}`);
        this.isSaving = true;
        this.showIndicator();

        try {
            // Create backup before saving
            await this.createBackup();

            // Perform the actual save
            this.saveManager.autoSave();

            // Update state
            this.lastSaveTime = Date.now();
            this.isDirty = false;

            console.log('✅ Auto-save completed successfully');
            this.updateIndicator('Saved!', 'success');

            return true;
        } catch (error) {
            console.error('❌ Auto-save failed:', error);
            this.updateIndicator('Save failed!', 'error');

            // Try to restore from backup
            await this.restoreFromBackup();

            return false;
        } finally {
            this.isSaving = false;
            this.hideIndicator(2000);
        }
    }

    // ========================================
    // BACKUP SYSTEM
    // ========================================

    async createBackup() {
        try {
            // Get current auto-save
            const currentSave = localStorage.getItem(this.saveManager.autoSaveKey);
            if (!currentSave) return;

            // Rotate backups
            const backup1 = localStorage.getItem(this.backupKey + '_1');
            if (backup1) {
                localStorage.setItem(this.backupKey + '_2', backup1);
            }

            // Save current as backup 1
            localStorage.setItem(this.backupKey + '_1', currentSave);

            console.log('📦 Backup created');
        } catch (error) {
            console.warn('⚠️ Backup creation failed:', error);
        }
    }

    async restoreFromBackup() {
        try {
            // Try backup 1 first
            let backup = localStorage.getItem(this.backupKey + '_1');

            if (!backup) {
                // Try backup 2
                backup = localStorage.getItem(this.backupKey + '_2');
            }

            if (backup) {
                // Validate backup
                const saveData = JSON.parse(backup);
                if (this.validateSaveData(saveData)) {
                    localStorage.setItem(this.saveManager.autoSaveKey, backup);
                    console.log('🔄 Restored from backup');
                    return true;
                }
            }

            console.warn('⚠️ No valid backup found');
            return false;
        } catch (error) {
            console.error('❌ Backup restore failed:', error);
            return false;
        }
    }

    validateSaveData(saveData) {
        // Basic validation
        if (!saveData || typeof saveData !== 'object') return false;
        if (!saveData.timestamp) return false;
        if (!saveData.currentScene) return false;

        // Check if save is not corrupted
        try {
            JSON.stringify(saveData);
            return true;
        } catch {
            return false;
        }
    }

    // ========================================
    // VISUAL INDICATOR
    // ========================================

    showIndicator() {
        if (!this.indicator) return;

        clearTimeout(this.indicatorTimeout);
        this.indicator.classList.remove('hidden', 'success', 'error');
        this.indicator.classList.add('visible');
    }

    updateIndicator(text, type = 'normal') {
        if (!this.indicator) return;

        const textEl = this.indicator.querySelector('.auto-save-text');
        if (textEl) {
            textEl.textContent = text;
        }

        if (type === 'success') {
            this.indicator.classList.add('success');
        } else if (type === 'error') {
            this.indicator.classList.add('error');
        }
    }

    hideIndicator(delay = 2000) {
        clearTimeout(this.indicatorTimeout);
        this.indicatorTimeout = setTimeout(() => {
            if (this.indicator) {
                this.indicator.classList.remove('visible');
                this.indicator.classList.add('hidden');
            }
        }, delay);
    }

    // ========================================
    // PUBLIC API
    // ========================================

    enable() {
        this.enabled = true;
        console.log('✅ Auto-save enabled');
    }

    disable() {
        this.enabled = false;
        console.log('⏸️ Auto-save disabled');
    }

    setInterval(minutes) {
        this.intervalDuration = minutes * 60000;
        console.log(`⏱️ Auto-save interval set to ${minutes} minutes`);
    }

    forceSave() {
        // Force a save regardless of throttling
        const originalMinInterval = this.minSaveInterval;
        this.minSaveInterval = 0;

        this.markDirty('forced');
        const result = this.triggerAutoSave('forced');

        this.minSaveInterval = originalMinInterval;
        return result;
    }

    getStatus() {
        return {
            enabled: this.enabled,
            isDirty: this.isDirty,
            isSaving: this.isSaving,
            lastSaveTime: this.lastSaveTime,
            timeSinceLastSave: Date.now() - this.lastSaveTime,
            canSave: this.canSave()
        };
    }
}

// ========================================
// GLOBAL EXPORT
// ========================================

if (typeof window !== 'undefined') {
    window.AutoSaveManager = AutoSaveManager;
}

export { AutoSaveManager };
