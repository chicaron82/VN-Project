/**
 * SYSTEM STATS WIDGET
 * Handles the "Organic Random Walk" animation for the Sidebar CPU/RAM stats.
 * 
 * Logic extracted from main.ts
 */

import { Logger } from '@utils/Logger';
export class SystemStatsWidget {
    private cpuVal: HTMLElement | null;
    private cpuBar: HTMLElement | null;
    private ramVal: HTMLElement | null;
    private ramBar: HTMLElement | null;
    private isRunning: boolean = false;

    // Organic Random Walk State
    private chaosLevel: number = 12;
    private chaosTarget: number = 12;
    private lastChaosUpdate: number = 0;

    private bougieLevel: number = 88;
    private bougieTarget: number = 92;
    private lastBougieUpdate: number = 0;

    constructor() {
        this.cpuVal = document.getElementById('sys-cpu');
        this.cpuBar = document.getElementById('sys-cpu-bar');
        this.ramVal = document.getElementById('sys-ram');
        this.ramBar = document.getElementById('sys-ram-bar');

        if (this.cpuVal && this.cpuBar && this.ramVal && this.ramBar) {
            this.isRunning = true;
            requestAnimationFrame(this.updateStats.bind(this));
            Logger.ui('✅ SystemStatsWidget initialized (Mode: Organic Walk)');
        } else {
            Logger.warn('⚠️ SystemStatsWidget: DOM elements not found');
        }
    }

    private updateStats(timestamp: number) {
        if (!this.isRunning) return;

        // Update targets occasionally (Chaos: jittery, Bougie: stable)
        if (timestamp - this.lastChaosUpdate > 800 + Math.random() * 1000) {
            // Chaos drifts between 5% and 45%, occasionally spiking
            this.chaosTarget = Math.max(5, Math.min(45, this.chaosTarget + (Math.random() - 0.5) * 30));
            this.lastChaosUpdate = timestamp;
        }

        if (timestamp - this.lastBougieUpdate > 2000 + Math.random() * 2000) {
            // Bougie Factor stays high (85-99%) because we ARE that fancy 💅
            this.bougieTarget = Math.max(85, Math.min(99, this.bougieTarget + (Math.random() - 0.5) * 10));
            this.lastBougieUpdate = timestamp;
        }

        // Smooth interpolation (Lerp)
        // Chaos moves snappier (0.05), Bougie moves elegantly slow (0.01)
        this.chaosLevel += (this.chaosTarget - this.chaosLevel) * 0.05;
        this.bougieLevel += (this.bougieTarget - this.bougieLevel) * 0.01;

        // Render
        const chaosDisplay = Math.round(this.chaosLevel);
        const bougieDisplay = Math.round(this.bougieLevel);

        if (this.cpuVal) this.cpuVal.textContent = `${chaosDisplay}%`;
        if (this.cpuBar) this.cpuBar.style.width = `${chaosDisplay}%`;

        if (this.ramVal) this.ramVal.textContent = `${bougieDisplay}%`;
        if (this.ramBar) this.ramBar.style.width = `${bougieDisplay}%`;

        requestAnimationFrame(this.updateStats.bind(this));
    }
}
