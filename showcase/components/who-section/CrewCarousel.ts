/**
 * ═══════════════════════════════════════════════════════════════
 * Crew Carousel - "Choose Your Chef" Navigation
 *
 * Portrait strip navigation with active chef spotlight.
 * Features random featured chef on load (weighted random with
 * localStorage recency bias), crossfade transitions, keyboard
 * navigation, and mobile swipe support.
 *
 * 💚🔥💀 UV7 Crew - Version 848
 * ═══════════════════════════════════════════════════════════════
 */

import type { CrewCardData } from './CrewCardData';
import { getCrewPortraitPath } from './CrewCardData';
import { ChefSpotlight } from './ChefSpotlight';
import { CrewCardController } from '../../controllers/CrewCardController';

const STORAGE_KEY = 'uv7-last-featured-chef';
const SWEEP_PLAYED_KEY = 'uv7-spotlight-sweep-played';

export class CrewCarousel {
    private crewData: CrewCardData[];
    private activeChefId: string;
    private spotlight: ChefSpotlight;
    private container: HTMLElement | null = null;

    constructor(crewData: CrewCardData[]) {
        // Randomize crew order to avoid implied hierarchy
        this.crewData = this.shuffleArray([...crewData]);
        this.activeChefId = this.getChefFromUrlOrRandom();
        this.spotlight = new ChefSpotlight({
            onNavigate: (chefId: string) => this.setActiveChef(chefId),
        });
    }

    /** Fisher-Yates shuffle to randomize crew order */
    private shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /** Render the carousel: portrait strip + spotlight container */
    public render(): string {
        return `
            <div class="crew-carousel" role="region" aria-label="Crew member spotlight">
                <div class="carousel-header">
                    <h3 class="crew-title">Choose Your Chef</h3>
                    <p class="crew-subtitle">Eight chefs. One kitchen. Choose who cooks tonight.</p>
                </div>

                <div class="carousel-portrait-strip" role="tablist" aria-label="Crew members">
                    ${this.renderPortraitStrip()}
                </div>

                <div class="carousel-spotlight-container" role="tabpanel" aria-live="polite">
                    ${this.renderActiveSpotlight()}
                </div>
            </div>
        `;
    }

    /** Attach all event listeners after DOM mount */
    public attachEventListeners(): void {
        this.container = document.querySelector('.crew-carousel');
        if (!this.container) return;

        this.attachPortraitListeners();
        this.attachKeyboardNav();

        // Initialize flip card interactions for initial render
        new CrewCardController();

        this.attachSpotlightListeners();
        this.playEntranceAnimation();
    }

    /** Switch active chef with crossfade */
    public setActiveChef(id: string): void {
        if (id === this.activeChefId) return;

        const chef = this.crewData.find(c => c.id === id);
        if (!chef || !this.container) return;

        // Update state
        this.activeChefId = id;

        // Update URL hash for deep linking (shareable chef URLs)
        window.history.replaceState(null, '', `#chef=${id}`);

        // Update portrait strip active state
        this.container.querySelectorAll<HTMLElement>('.carousel-portrait').forEach(p => {
            const isActive = p.dataset.chef === id;
            p.classList.toggle('active', isActive);
            p.setAttribute('aria-selected', String(isActive));
        });

        // Crossfade spotlight content
        const spotlightContainer = this.container.querySelector('.carousel-spotlight-container');
        if (spotlightContainer) {
            spotlightContainer.classList.add('crossfading');

            setTimeout(() => {
                spotlightContainer.innerHTML = this.renderActiveSpotlight();
                spotlightContainer.classList.remove('crossfading');

                // Re-initialize flip card interactions for new content
                new CrewCardController();
                this.attachSpotlightListeners();
            }, 200); // Match CSS transition duration
        }

        // Scroll portrait into view on mobile
        const activePortrait = this.container.querySelector(`.carousel-portrait[data-chef="${id}"]`);
        if (activePortrait) {
            activePortrait.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    /** Clean up event listeners */
    public destroy(): void {
        // Keyboard listener is on the container, will be GC'd with DOM removal
        this.container = null;
    }

    // ─── Private Render Methods ──────────────────────────────

    private renderPortraitStrip(): string {
        return this.crewData.map(chef => {
            const isActive = chef.id === this.activeChefId;
            return `
                <button
                    class="carousel-portrait${isActive ? ' active' : ''}"
                    data-chef="${chef.id}"
                    role="tab"
                    aria-selected="${isActive}"
                    aria-label="View ${chef.name}'s profile"
                    style="--glow-color: ${chef.signatureColor}"
                >
                    <img
                        src="${getCrewPortraitPath(chef.portrait)}"
                        alt="${chef.name}"
                        class="portrait-img"
                        loading="lazy"
                    />
                    <span class="portrait-glow"></span>
                    <span class="portrait-name">${chef.name.split(' ')[0]}</span>
                </button>
            `;
        }).join('');
    }

    private renderActiveSpotlight(): string {
        const chef = this.crewData.find(c => c.id === this.activeChefId);
        if (!chef) return '';
        return this.spotlight.render(chef);
    }

    // ─── Event Listeners ─────────────────────────────────────

    private attachPortraitListeners(): void {
        if (!this.container) return;

        this.container.querySelectorAll<HTMLButtonElement>('.carousel-portrait').forEach(btn => {
            btn.addEventListener('click', () => {
                const chefId = btn.dataset.chef;
                if (chefId) this.setActiveChef(chefId);
            });
        });
    }

    private attachKeyboardNav(): void {
        if (!this.container) return;

        this.container.addEventListener('keydown', (e: KeyboardEvent) => {
            const ids = this.crewData.map(c => c.id);
            const currentIndex = ids.indexOf(this.activeChefId);

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const next = ids[(currentIndex + 1) % ids.length];
                this.setActiveChef(next);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = ids[(currentIndex - 1 + ids.length) % ids.length];
                this.setActiveChef(prev);
            }
        });
    }

    private attachSpotlightListeners(): void {
        if (!this.container) return;

        const spotlightContainer = this.container.querySelector('.carousel-spotlight-container');
        if (spotlightContainer) {
            this.spotlight.attachEventListeners(spotlightContainer as HTMLElement);
        }
    }

    // ─── Chef Selection ───────────────────────────────────────

    /** Get chef from URL hash (#chef=dizee) or weighted random */
    private getChefFromUrlOrRandom(): string {
        const ids = this.crewData.map(c => c.id);

        // Check URL hash for deep link (#chef=dizee)
        const hashMatch = window.location.hash.match(/#chef=(\w+)/);
        if (hashMatch) {
            const chefId = hashMatch[1];
            if (ids.includes(chefId)) {
                return chefId;
            }
        }

        // Fallback to weighted random
        return this.getWeightedRandomChef();
    }

    /** Weighted random: never repeat last-featured chef */
    private getWeightedRandomChef(): string {
        const ids = this.crewData.map(c => c.id);

        try {
            const lastFeatured = localStorage.getItem(STORAGE_KEY);
            const candidates = lastFeatured
                ? ids.filter(id => id !== lastFeatured)
                : ids;

            const selected = candidates[Math.floor(Math.random() * candidates.length)];
            localStorage.setItem(STORAGE_KEY, selected);
            return selected;
        } catch {
            // localStorage unavailable (private browsing) — pure random fallback
            return ids[Math.floor(Math.random() * ids.length)];
        }
    }

    // ─── Entrance Animation ──────────────────────────────────

    private playEntranceAnimation(): void {
        if (!this.container) return;

        // Check if sweep already played this session
        try {
            if (sessionStorage.getItem(SWEEP_PLAYED_KEY)) return;
            sessionStorage.setItem(SWEEP_PLAYED_KEY, 'true');
        } catch {
            return; // Skip animation if storage unavailable
        }

        // Check reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Staggered portrait entrance
        const portraits = this.container.querySelectorAll<HTMLElement>('.carousel-portrait');
        portraits.forEach((portrait, index) => {
            portrait.style.opacity = '0';
            portrait.style.transform = 'translateY(10px) scale(0.9)';

            setTimeout(() => {
                portrait.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                portrait.style.opacity = '1';
                portrait.style.transform = '';

                // Active portrait gets the spotlight glow after all portraits are visible
                if (portrait.dataset.chef === this.activeChefId) {
                    setTimeout(() => {
                        portrait.classList.add('spotlight-reveal');
                    }, portraits.length * 60);
                }
            }, index * 60);
        });
    }
}
