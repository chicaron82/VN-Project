/**
 * ToriBridge - Tori-gatchi Status Bar Integration
 *
 * Extracted from UV7Shell.ts (~100 lines → dedicated module)
 *
 * Handles:
 * - Status bar Tori indicator creation
 * - localStorage monitoring for Tori state
 * - Status updates with mood indicators
 * - Click-to-launch integration
 */

interface ShellInterface {
    navigateTo(appId: string): void;
}

export class ToriBridge {
    private shell: ShellInterface;
    private toriStatusElement: HTMLElement | null = null;

    constructor(shell: ShellInterface) {
        this.shell = shell;
    }

    /**
     * Initialize Tori-gatchi Status Bridge
     * Monitors localStorage for Tori's state and updates status bar
     */
    public init(): void {
        console.log('[ToriBridge] init() called');

        const statusRight = document.querySelector('.status-right');
        if (!statusRight) {
            console.error('[ToriBridge] .status-right not found! Cannot add Tori status');
            return;
        }

        console.log('[ToriBridge] .status-right found, creating Tori status element');

        // Create status item
        const toriStatus = document.createElement('span');
        toriStatus.id = 'tori-status';
        toriStatus.className = 'tori-status'; // See shell.css
        toriStatus.title = "Tori's Status";
        this.toriStatusElement = toriStatus;

        // Add click to launch app
        toriStatus.addEventListener('click', () => {
            this.shell.navigateTo('torigatchi');
        });

        // Insert before settings icon
        const settingsIcon = document.getElementById('uv7-settings');
        if (settingsIcon) {
            console.log('[ToriBridge] Inserting Tori status before settings icon');
            statusRight.insertBefore(toriStatus, settingsIcon);
        } else {
            console.warn('[ToriBridge] Settings icon not found, appending Tori status to end');
            statusRight.appendChild(toriStatus);
        }

        // Listen for Tori status change events (event-based, not polling)
        window.addEventListener('uv7:tori-status-changed', (e: Event) => {
            const customEvent = e as CustomEvent;
            this.update(customEvent.detail);
        });

        // Listen for storage events (if multiple tabs/windows)
        window.addEventListener('storage', (e) => {
            if (e.key === 'toriGatchiState') {
                this.update();
            }
        });

        // Note: No initial update() call needed - ToriService.tick() will
        // emit the status change event immediately after this bridge is set up

        console.log('[ToriBridge] Initialized successfully');
    }

    /**
     * Update Tori status display
     * @param projectedState - Optional pre-computed state from ToriService
     */
    public update(projectedState?: any): void {
        if (!this.toriStatusElement) {
            console.warn('[ToriBridge] update() called but status element not initialized');
            return;
        }

        let state = projectedState;

        // If no projected state, read from localStorage
        if (!state) {
            const stateJson = localStorage.getItem('toriGatchiState');
            if (!stateJson) {
                this.toriStatusElement.textContent = '💖';
                this.toriStatusElement.title = "Tori isn't here yet";
                return;
            }

            try {
                state = JSON.parse(stateJson);
            } catch (e) {
                console.error('[ToriBridge] Failed to parse Tori state', e);
                return;
            }
        }

        // Calculate hunger level (hours since last fed)
        const lastFed = new Date(state.lastFed);
        const now = new Date();
        const hoursSince = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);

        // Determine mood emoji
        let emoji = '💖';
        let title = "Tori's Status: ";

        if (hoursSince > 24) {
            emoji = '💀';
            title += 'BEYOND HANGRY (Feed me NOW!)';
        } else if (hoursSince > 8) {
            emoji = '😡';
            title += 'HANGRY (Really need food...)';
        } else if (hoursSince > 5) {
            emoji = '😤';
            title += 'Hungry (Could use a snack)';
        } else if (hoursSince > 3) {
            emoji = '😊';
            title += 'Content (Doing okay)';
        } else {
            emoji = '💚';
            title += 'Happy (Well fed!)';
        }

        // Add level info
        title += ` • Level ${state.level || 1}`;

        // Update element
        this.toriStatusElement.textContent = emoji;
        this.toriStatusElement.title = title;

        // Add pulsing class for extreme hunger
        if (hoursSince > 24) {
            this.toriStatusElement.classList.add('pulse-urgent');
        } else if (hoursSince > 8) {
            this.toriStatusElement.classList.add('pulse');
            this.toriStatusElement.classList.remove('pulse-urgent');
        } else {
            this.toriStatusElement.classList.remove('pulse', 'pulse-urgent');
        }
    }
}
