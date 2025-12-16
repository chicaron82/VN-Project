// ========================================
// TIME MACHINE MANAGER
// Centralized timeline navigation & snapshot system
// Built from Tori's architecture 💚
// 🖤💚🔥💀 UV7 Crew - Version 848
// ========================================

class TimeMachineManager {
    constructor(game, options = {}) {
        this.game = game;

        // Config
        this.maxEntries = options.maxEntries || 200; // cap to prevent bloat
        this.pruneStrategy = options.pruneStrategy || 'smart'; // 'fifo' | 'smart'

        // In-memory list of snapshots
        this.entries = [];

        // For assigning unique IDs
        this._nextId = 1;

        console.log('⏰ Time Machine Manager initialized');
    }

    // ========================================
    // SNAPSHOT BUILDING
    // ========================================

    // Build a canonical snapshot of the *current* state
    buildSnapshot(label = '', priority = 'normal') {
        const position = this.game.getScenePosition ? this.game.getScenePosition() : {};
        const { currentRouteId, currentSceneId, currentPageIndex } = position;

        const tether = this.game.tetherSystem?.getTetherValue?.() ?? null;
        const flags = this.game.getSerializableFlags ? this.game.getSerializableFlags() : {};
        const bgKey = this.game.getCurrentBackgroundKey ? this.game.getCurrentBackgroundKey() : null;
        const spriteKey = this.game.getCurrentSpriteKey ? this.game.getCurrentSpriteKey() : null;

        const snapshot = {
            id: this._nextId++,
            label,                         // optional human-readable name or debug note
            priority,                      // 'low' | 'normal' | 'high' | 'anchor'
            routeId: currentRouteId,
            sceneId: currentSceneId,
            pageIndex: currentPageIndex,
            tether,
            flags,
            bgKey,
            spriteKey,
            createdAt: Date.now(),

            // State for narrative rules
            corrupted: false,
            corruptionMode: null,          // 'despair' | 'echo' | 'timeline-break'
            locked: false,                 // hard lock: never jumpable
            burned: false,                 // "you can never return here"
            insaneBlocked: false,          // blocked only under insane mode rules
        };

        return snapshot;
    }

    // ========================================
    // ENTRY MANAGEMENT
    // ========================================

    // Add a snapshot to the backlog
    addCurrentState(label = '', priority = 'normal') {
        const snapshot = this.buildSnapshot(label, priority);

        // Don't save snapshots with no meaningful state (e.g., during initialization)
        if (!snapshot.routeId && !snapshot.sceneId) {
            console.log(`⏰ Skipping snapshot (no route/scene): ${label || `#${snapshot.id}`}`);
            return null;
        }

        this.entries.push(snapshot);
        this.pruneIfNeeded();
        console.log(`⏰ Snapshot added: ${label || `#${snapshot.id}`} [${priority}]`);

        // DIZEE: Show optional commentary hint instead of auto-popup
        if (this.entries.length === 1 && this.game.devCommentary && this.game.devCommentary.isUnlocked()) {
            setTimeout(() => {
                this.showCommentaryHint('backlog_time_machine');
            }, 1000);
        }

        return snapshot;
    }

    addEntry(snapshot) {
        // For manual injection if needed
        snapshot.id = snapshot.id || this._nextId++;
        this.entries.push(snapshot);
        this.pruneIfNeeded();
        return snapshot;
    }

    pruneIfNeeded() {
        if (this.entries.length <= this.maxEntries) return;

        if (this.pruneStrategy === 'smart') {
            // Smart pruning: never prune anchors, prefer pruning low priority
            const anchors = this.entries.filter(e => e.priority === 'anchor');
            const high = this.entries.filter(e => e.priority === 'high');
            const normal = this.entries.filter(e => e.priority === 'normal');
            const low = this.entries.filter(e => e.priority === 'low');

            // Calculate how many we need to remove
            const toRemove = this.entries.length - this.maxEntries;

            // Remove from low priority first, then normal (FIFO within priority)
            const removed = [];

            // Remove low priority
            while (removed.length < toRemove && low.length > 0) {
                removed.push(low.shift());
            }

            // Remove normal priority if needed
            while (removed.length < toRemove && normal.length > 0) {
                removed.push(normal.shift());
            }

            // Rebuild entries (keeping anchors and high priority)
            this.entries = [...anchors, ...high, ...normal, ...low];

            console.log(`⏰ Pruned ${removed.length} snapshots (smart strategy)`);
        } else {
            // Simple FIFO
            while (this.entries.length > this.maxEntries) {
                const removed = this.entries.shift();
                console.log(`⏰ Pruned snapshot #${removed.id} (FIFO)`);
            }
        }
    }

    // ========================================
    // QUERY & ACCESS
    // ========================================

    getEntries() {
        return this.entries.slice(); // shallow copy to avoid external mutation
    }

    getEntryById(id) {
        return this.entries.find(e => e.id === id) || null;
    }

    getLatestEntry() {
        return this.entries[this.entries.length - 1] || null;
    }

    // ========================================
    // NARRATIVE STATE MANIPULATION
    // ========================================

    markCorrupted(id, mode = 'soft') {
        const entry = this.getEntryById(id);
        if (!entry) return;

        entry.corrupted = true;
        entry.corruptionMode = mode; // could affect how UI renders it later
        console.log(`⚠️ Snapshot #${id} corrupted (${mode})`);
    }

    burnEntry(id) {
        const entry = this.getEntryById(id);
        if (!entry) return;
        entry.burned = true;
        console.log(`🔥 Snapshot #${id} burned - unreachable`);
    }

    lockEntry(id) {
        const entry = this.getEntryById(id);
        if (!entry) return;
        entry.locked = true;
        console.log(`🔒 Snapshot #${id} locked`);
    }

    // Burn all entries matching criteria
    burnEntriesWhere(predicate) {
        let count = 0;
        this.entries.forEach(entry => {
            if (predicate(entry)) {
                entry.burned = true;
                count++;
            }
        });
        console.log(`🔥 Burned ${count} snapshots`);
    }

    // Corrupt all entries matching criteria
    corruptEntriesWhere(predicate, mode = 'despair') {
        let count = 0;
        this.entries.forEach(entry => {
            if (predicate(entry)) {
                entry.corrupted = true;
                entry.corruptionMode = mode;
                count++;
            }
        });
        console.log(`⚠️ Corrupted ${count} snapshots (${mode})`);
    }

    // ========================================
    // JUMP RULES & VALIDATION
    // ========================================

    // Core rule check — can we jump to this entry right now?
    canJumpTo(entry, { ignoreRules = false } = {}) {
        if (!entry) return false;
        if (ignoreRules) return true;

        const insane = this.game.isInsaneModeActive?.() ?? false;

        // Hard locks
        if (entry.locked) return false;
        if (entry.burned) return false;

        // Insane mode special rules
        if (insane) {
            // Only allow jumps to the last 2 entries
            const latest = this.getLatestEntry();
            if (latest) {
                const diff = latest.id - entry.id;
                if (diff > 2) {
                    entry.insaneBlocked = true;
                    return false;
                }
            }
        }

        return true;
    }

    // Get human-readable reason for why jump is blocked
    getBlockReason(entry) {
        if (!entry) return 'Entry not found';
        if (entry.locked) return 'This moment is locked';
        if (entry.burned) return 'This moment has burned out of reach';
        if (entry.insaneBlocked) return 'Madness won\'t let you go back that far';
        if (entry.corrupted) {
            if (entry.corruptionMode === 'despair') return 'Despair has tainted this memory';
            if (entry.corruptionMode === 'echo') return 'Echo interference detected';
            return 'This moment is corrupted';
        }
        return null; // No block
    }

    // ========================================
    // TIME JUMP EXECUTION
    // ========================================

    // Attempt a jump — returns true if it succeeded
    async jumpTo(entryId, { ignoreRules = false } = {}) {
        const entry = this.getEntryById(entryId);
        if (!entry) {
            console.warn(`⏰ Jump failed: Entry #${entryId} not found`);
            return false;
        }

        if (!this.canJumpTo(entry, { ignoreRules })) {
            const reason = this.getBlockReason(entry);
            console.log(`⏰ Jump blocked: ${reason}`);

            // Sensory denial cue
            if (this.game.triggerSensoryFeedback) {
                const insane = this.game.isInsaneModeActive?.() ?? false;
                const cueType = insane ? 'harshDenial' : 'denied';
                this.game.triggerSensoryFeedback(cueType, null, 'Time Machine jump denied');
            }

            // Show message to player
            if (this.game.showMessage) {
                this.game.showMessage(reason);
            } else if (this.game.showWarningOverlay) {
                this.game.showWarningOverlay('⏰ JUMP BLOCKED', reason);
            }

            return false;
        }

        // Perform actual restore
        console.log(`⏰ Jumping to snapshot #${entry.id}: ${entry.label || '(unlabeled)'}`);
        await this.restoreSnapshot(entry);
        return true;
    }

    // ========================================
    // SNAPSHOT RESTORATION
    // ========================================

    // This is the glue between snapshot → engine
    async restoreSnapshot(entry) {
        // 1) Tell the game to load the right route/scene/page
        if (this.game.loadSceneFromSnapshot) {
            await this.game.loadSceneFromSnapshot(entry);
        } else {
            console.warn('⏰ loadSceneFromSnapshot not implemented - cannot restore position');
        }

        // 2) Restore tether
        if (this.game.tetherSystem && typeof entry.tether === 'number') {
            this.game.tetherSystem.setTetherValue(entry.tether);
            console.log(`⏰ Tether restored: ${entry.tether}`);
        }

        // 3) Restore flags
        if (this.game.applySerializableFlags && entry.flags) {
            this.game.applySerializableFlags(entry.flags);
            console.log('⏰ Flags restored');
        }

        // 4) Restore visual state (background, sprites)
        if (this.game.setBackgroundByKey && entry.bgKey) {
            this.game.setBackgroundByKey(entry.bgKey);
            console.log(`⏰ Background restored: ${entry.bgKey}`);
        }

        if (this.game.setSpriteByKey && entry.spriteKey) {
            this.game.setSpriteByKey(entry.spriteKey);
            console.log(`⏰ Sprite restored: ${entry.spriteKey}`);
        }

        // Optional: sensory feedback for successful jump
        if (this.game.triggerSensoryFeedback) {
            this.game.triggerSensoryFeedback('timelineGlitch', null, 'Time Machine jump');
        }

        console.log('⏰ Snapshot restoration complete');
    }

    // ========================================
    // DEV TOOLS & DEBUGGING
    // ========================================

    // Print all entries to console for debugging
    inspect() {
        console.group('⏰ TIME MACHINE INSPECTOR');
        console.log(`Total entries: ${this.entries.length}/${this.maxEntries}`);
        console.log(`Prune strategy: ${this.pruneStrategy}`);
        console.log('');

        this.entries.forEach((entry, index) => {
            const flags = [];
            if (entry.locked) flags.push('🔒 LOCKED');
            if (entry.burned) flags.push('🔥 BURNED');
            if (entry.corrupted) flags.push(`⚠️ CORRUPTED (${entry.corruptionMode})`);
            if (entry.insaneBlocked) flags.push('💀 INSANE-BLOCKED');

            console.group(`#${entry.id} [${entry.priority}] ${entry.label || '(unlabeled)'}`);
            console.log(`Route: ${entry.routeId} | Scene: ${entry.sceneId} | Page: ${entry.pageIndex}`);
            console.log(`Tether: ${entry.tether ?? 'N/A'}`);
            console.log(`Created: ${new Date(entry.createdAt).toLocaleTimeString()}`);
            if (flags.length > 0) {
                console.log(`Status: ${flags.join(', ')}`);
            }
            console.groupEnd();
        });

        console.groupEnd();
    }

    // Get stats for UI display
    getStats() {
        return {
            total: this.entries.length,
            max: this.maxEntries,
            locked: this.entries.filter(e => e.locked).length,
            burned: this.entries.filter(e => e.burned).length,
            corrupted: this.entries.filter(e => e.corrupted).length,
            anchors: this.entries.filter(e => e.priority === 'anchor').length,
        };
    }

    // ========================================
    // DEV COMMENTARY HINT
    // ========================================

    // Show optional commentary icon instead of auto-popup
    showCommentaryHint(sceneId) {
        // Check if hint button already exists
        let hintBtn = document.getElementById('commentary-hint-backlog');

        if (!hintBtn) {
            // Create hint button
            hintBtn = document.createElement('button');
            hintBtn.id = 'commentary-hint-backlog';
            hintBtn.className = 'commentary-hint-button';
            hintBtn.innerHTML = '💬 Dev Commentary';
            hintBtn.title = 'Click to read behind-the-scenes notes';

            // Click to show commentary
            hintBtn.addEventListener('click', () => {
                this.game.devCommentary.showCommentary(sceneId);
                hintBtn.remove(); // Remove after showing
            });

            document.body.appendChild(hintBtn);

            // Auto-remove after 10 seconds if not clicked
            setTimeout(() => {
                if (hintBtn && hintBtn.parentNode) {
                    hintBtn.style.opacity = '0';
                    setTimeout(() => hintBtn.remove(), 300);
                }
            }, 10000);
        }
    }

    // ========================================
    // PERSISTENCE (FUTURE)
    // ========================================

    // Serialize for save file
    serialize() {
        return {
            entries: this.entries,
            nextId: this._nextId,
        };
    }

    // Restore from save file
    deserialize(data) {
        if (!data) return;
        this.entries = data.entries || [];
        this._nextId = data.nextId || 1;
        console.log(`⏰ Restored ${this.entries.length} snapshots from save`);
    }
}

// Export for game engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimeMachineManager;
}
