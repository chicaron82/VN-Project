/**
 * GentleNudges - Your friendly guide through the showcase
 *
 * Think of this like a thoughtful server at a restaurant who notices
 * you've been reading the current page for a while and gently suggests
 * the next course. Not pushy, just helpful.
 *
 * 💚🔥💀 Built with love.
 */

interface CourseSuggestion {
    section: string;
    emoji: string;
    message: string;
    nextSection?: string;
}

export class GentleNudges {
    private suggestionTimer: number | null = null;
    private readonly TIME_TO_SUGGEST = 8000; // 8 seconds of quiet
    private readonly SUGGESTION_DURATION = 4000; // Show for 4 seconds
    private readonly MEMORY_KEY = 'uv7-suggestions-shown'; // Remember what we've suggested
    private currentSection: string = 'home';
    private nudgeElement: HTMLElement | null = null;

    // Our menu of gentle suggestions
    private suggestions: CourseSuggestion[] = [
        {
            section: 'home',
            emoji: '✨',
            message: 'Ready for the next course? Swipe to',
            nextSection: 'journey'
        },
        {
            section: 'journey',
            emoji: '👨‍🍳',
            message: 'Curious about the kitchen? Swipe to',
            nextSection: 'workflow'
        },
        {
            section: 'workflow',
            emoji: '🔬',
            message: 'Want to see the secret ingredients? Swipe to',
            nextSection: 'spotlight'
        },
        {
            section: 'spotlight',
            emoji: '🎭',
            message: 'Watch the transformation? Swipe to',
            nextSection: 'evolution'
        },
        {
            section: 'evolution',
            emoji: '🧪',
            message: 'See the mad science? Swipe to',
            nextSection: 'experiment'
        },
        {
            section: 'experiment',
            emoji: '👥',
            message: 'Meet the crew? Swipe to',
            nextSection: 'who'
        },
    ];

    constructor() {
        this.init();
    }

    private init(): void {
        // Listen for guest activity
        window.addEventListener('scroll', () => this.resetSuggestionTimer(), { passive: true });

        // Listen for course changes
        window.addEventListener('uv7:section:changed', (e: Event) => {
            const customEvent = e as CustomEvent;
            this.currentSection = customEvent.detail.section;
            this.resetSuggestionTimer();
        });

        // Clear nudge on any interaction (guest is active)
        ['click', 'touchstart', 'keydown'].forEach(event => {
            window.addEventListener(event, () => this.clearNudge(), { passive: true });
        });

        // Start watching
        this.resetSuggestionTimer();
    }

    private resetSuggestionTimer(): void {
        this.clearSuggestionTimer();

        this.suggestionTimer = window.setTimeout(() => {
            this.offerSuggestion();
        }, this.TIME_TO_SUGGEST);
    }

    private clearSuggestionTimer(): void {
        if (this.suggestionTimer) {
            clearTimeout(this.suggestionTimer);
            this.suggestionTimer = null;
        }
    }

    private offerSuggestion(): void {
        // Don't repeat ourselves - we're polite servers
        if (this.alreadySuggested(this.currentSection)) {
            return;
        }

        const suggestion = this.suggestions.find(s => s.section === this.currentSection);
        if (!suggestion) return;

        // Create the nudge
        this.nudgeElement = document.createElement('div');
        this.nudgeElement.className = 'gentle-nudge';
        this.nudgeElement.innerHTML = `
            <span class="nudge-emoji">${suggestion.emoji}</span>
            <span class="nudge-text">
                ${suggestion.message}
                ${suggestion.nextSection ? ` <strong>${this.capitalize(suggestion.nextSection)}</strong>` : ''}
            </span>
            <span class="nudge-arrow">→</span>
        `;

        // Present it
        document.body.appendChild(this.nudgeElement);

        // Gentle haptic (if the device supports it)
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }

        // Clear after a bit (don't linger)
        setTimeout(() => this.clearNudge(), this.SUGGESTION_DURATION);

        // Remember we suggested this
        this.rememberSuggestion(this.currentSection);
    }

    private clearNudge(): void {
        if (!this.nudgeElement) return;

        // Fade out gracefully
        this.nudgeElement.style.animation = 'nudgeOut 0.3s ease forwards';

        setTimeout(() => {
            this.nudgeElement?.remove();
            this.nudgeElement = null;
        }, 300);
    }

    private alreadySuggested(section: string): boolean {
        const memory = JSON.parse(localStorage.getItem(this.MEMORY_KEY) || '{}');
        return memory[section] === true;
    }

    private rememberSuggestion(section: string): void {
        const memory = JSON.parse(localStorage.getItem(this.MEMORY_KEY) || '{}');
        memory[section] = true;
        localStorage.setItem(this.MEMORY_KEY, JSON.stringify(memory));
    }

    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // For testing or if the guest wants a fresh experience
    public forgetEverything(): void {
        localStorage.removeItem(this.MEMORY_KEY);
    }

    // DEBUG: Force show a nudge (bypass all checks)
    public debugShowNudge(section: string = this.currentSection): void {
        const suggestion = this.suggestions.find(s => s.section === section);
        if (!suggestion) return;

        // Create the nudge
        this.nudgeElement = document.createElement('div');
        this.nudgeElement.className = 'gentle-nudge';
        this.nudgeElement.innerHTML = `
            <span class="nudge-emoji">${suggestion.emoji}</span>
            <span class="nudge-text">
                ${suggestion.message}
                ${suggestion.nextSection ? ` <strong>${this.capitalize(suggestion.nextSection)}</strong>` : ''}
            </span>
            <span class="nudge-arrow">→</span>
        `;

        // Present it
        document.body.appendChild(this.nudgeElement);

        // Gentle haptic (if the device supports it)
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }

        // Clear after 4 seconds
        setTimeout(() => this.clearNudge(), this.SUGGESTION_DURATION);
    }
}
