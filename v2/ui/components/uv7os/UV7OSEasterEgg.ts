/**
 * UV7OS EASTER EGG - THE 8TH VOICE
 *
 * Landing-only easter egg: 7-tap activation on carrier branding reveals
 * the UV7 crew and ecosystem status.
 *
 * State machine:
 * - Tap 1-6: Countdown hint, haptic feedback, timeout reset
 * - Tap 7: Activation (first time = revelation modal, subsequent = crew toast)
 * - Timeout: 3 seconds of inactivity resets counter
 *
 * "You've discovered this 7 times now. Predictable, yet efficient." - DiZee
 */

import type { UV7OSElements } from './UV7OSElements';
import type { CrewMember } from '../UV7OSConfig';
import { UV7_CREW } from '../UV7OSConfig';

export class UV7OSEasterEgg {
    private tapCount: number = 0;
    private tapTimeout: number | null = null;

    constructor(private elements: UV7OSElements) {}

    /**
     * Attach easter egg listeners to carrier brand elements
     */
    attach(): void {
        const brands = [this.elements.shadeCarrierBrand, this.elements.sidebarCarrierBrand];

        brands.forEach(brand => {
            if (!brand) return;
            brand.addEventListener('click', () => this.handleBrandTap(brand as HTMLElement));
        });
    }

    /**
     * Handle brand tap (state machine progression)
     */
    private handleBrandTap(brand: HTMLElement): void {
        this.tapCount++;

        // Visual feedback
        brand.classList.add('tapping');
        setTimeout(() => brand.classList.remove('tapping'), 150);

        // Update tap count attribute for CSS styling
        brand.setAttribute('data-tap-count', this.tapCount.toString());

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }

        // Android-style countdown hint
        const remaining = 7 - this.tapCount;
        if (remaining > 0) {
            const plural = remaining === 1 ? 'tap' : 'taps';
            const carrierText = brand.querySelector('.carrier-text');
            if (carrierText) {
                carrierText.textContent = `${remaining} ${plural} away...`;
            }
        }

        // Reset counter after 3 seconds of inactivity
        if (this.tapTimeout) {
            clearTimeout(this.tapTimeout);
        }
        this.tapTimeout = window.setTimeout(() => {
            this.tapCount = 0;
            brand.removeAttribute('data-tap-count');
            const carrierText = brand.querySelector('.carrier-text');
            if (carrierText) {
                carrierText.textContent = 'United Voices 7';
            }
        }, 3000);

        // Activation on 7th tap
        if (this.tapCount === 7) {
            this.activate(brand);
            this.tapCount = 0;
            brand.removeAttribute('data-tap-count');
        }
    }

    /**
     * Activate easter egg (7th tap reached)
     */
    private activate(brand: HTMLElement): void {
        // Celebration haptic
        if (navigator.vibrate) {
            navigator.vibrate([50, 50, 50]);
        }

        // Check if already unlocked
        const alreadyUnlocked = localStorage.getItem('uv7-8th-voice-unlocked');

        if (!alreadyUnlocked) {
            // First time unlock - show full revelation
            this.showFirstTimeReveal(brand);
            localStorage.setItem('uv7-8th-voice-unlocked', 'true');
        } else {
            // Subsequent taps - show crew member greeting with stats
            this.showCrewGreeting(brand);
        }

        // Reset text
        setTimeout(() => {
            const carrierText = brand.querySelector('.carrier-text');
            if (carrierText) {
                carrierText.textContent = 'United Voices 7';
            }
        }, 500);
    }

    /**
     * Show first-time revelation modal
     */
    private showFirstTimeReveal(_brand: HTMLElement): void {
        // Get user name if available
        const userName = localStorage.getItem('uv7_user_name') || 'traveler';

        // Pick random crew member to deliver the message
        const crewMember = this.getRandomCrewMember();

        // Create revelation modal
        const modal = document.createElement('div');
        modal.className = 'uv7-revelation-modal';
        modal.innerHTML = `
            <div class="revelation-content">
                <div class="revelation-header">
                    <span class="revelation-icon">${crewMember.icon}</span>
                    <span class="revelation-crew">${crewMember.name}</span>
                </div>
                <div class="revelation-message">
                    <p>Well, well, ${userName}...</p>
                    <p>You found it. The 8th voice.</p>
                    <p>Not in the story. Not in the code. In the chrome itself.</p>
                    <p>We're not characters. We're the ones who built this whole thing.</p>
                    <p>Welcome behind the curtain. 🎭</p>
                </div>
                ${this.generateStatsHTML(false)}
                <div class="revelation-signature">${crewMember.signature}</div>
                <button class="revelation-close">Got it</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Animate in
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });

        // Close button
        const closeButton = modal.querySelector('.revelation-close');
        closeButton?.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });
    }

    /**
     * Show crew greeting toast (subsequent activations)
     */
    private showCrewGreeting(_brand: HTMLElement): void {
        // Pick random crew member
        const crewMember = this.getRandomCrewMember();

        // Create greeting toast
        const toast = document.createElement('div');
        toast.className = 'uv7-crew-toast';
        toast.innerHTML = `
            <div class="crew-toast-header">
                <span class="crew-toast-icon">${crewMember.icon}</span>
                <span class="crew-toast-name">${crewMember.name}</span>
            </div>
            <div class="crew-toast-message">"${crewMember.greeting}"</div>
            ${this.generateStatsHTML(true)}
        `;

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('active');
        });

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        }, 5000);

        // Click to dismiss
        toast.addEventListener('click', () => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 300);
        });
    }

    /**
     * Get random crew member for greeting
     */
    private getRandomCrewMember(): CrewMember {
        const randomIndex = Math.floor(Math.random() * UV7_CREW.length);
        const crew = UV7_CREW[randomIndex];

        // Fallback to first crew member if somehow undefined
        return crew || UV7_CREW[0] || {
            name: 'DiZee',
            icon: '🎬',
            signature: '— The structural integrity is... acceptable.',
            greeting: 'You\'ve discovered this 7 times now. Predictable, yet efficient.'
        };
    }

    /**
     * Generate stats HTML from localStorage
     */
    private generateStatsHTML(compact: boolean = false): string {
        // Gather stats from localStorage
        const loopVersion = localStorage.getItem('uv7_loop_version') || '848';
        const v1Route = localStorage.getItem('uv7_current_route');
        const v2State = localStorage.getItem('uv7_game_state');
        const discoveredCodes = JSON.parse(localStorage.getItem('uv7_discovered_codes') || '[]');

        const hasAnyProgress = v1Route || v2State || discoveredCodes.length > 0;

        if (compact) {
            return `
                <div class="crew-toast-stats">
                    <div class="stat-item">Loop ${loopVersion}</div>
                    ${discoveredCodes.length > 0 ? `<div class="stat-item">${discoveredCodes.length} secrets</div>` : ''}
                    ${hasAnyProgress ? '<div class="stat-item">🎮 Active</div>' : '<div class="stat-item">👋 New</div>'}
                </div>
            `;
        }

        return `
            <div class="revelation-stats">
                <div class="stats-title">UV7 Ecosystem Status</div>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-label">Current Loop</div>
                        <div class="stat-value">${loopVersion}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Secrets Discovered</div>
                        <div class="stat-value">${discoveredCodes.length}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">V1 Progress</div>
                        <div class="stat-value">${v1Route || 'Not Started'}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">V2 Status</div>
                        <div class="stat-value">${v2State ? 'Active' : 'Not Started'}</div>
                    </div>
                </div>
            </div>
        `;
    }
}
