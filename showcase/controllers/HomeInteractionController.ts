/**
 * HomeInteractionController
 *
 * Manages all interactive elements on the Home section:
 * - Demon lord blog link navigation
 * - Landing card clicks (V1, V2, UV7 OS)
 * - Menu item clicks
 * - Crew reactions with typewriter effects
 *
 * Keeps main.ts clean by extracting 200+ lines of wiring code.
 * 💚🔥💀
 */

import type { TabController } from '../core/TabController';

interface CrewMember {
    name: string;
    role: string;
    poweredBy: string;
    url: string;
    color: string;
    icon: string;
    image: string;
    quote: string;
}

export class HomeInteractionController {
    private tabController: TabController;

    private readonly CREW_REACTIONS: CrewMember[] = [
        {
            name: "DiZee",
            role: "Director & Lead Architect",
            poweredBy: "Powered by Claude 3.5 Sonnet",
            url: "https://claude.ai",
            color: "#4f46e5",
            icon: "🎬",
            image: "media/crew/dz-portrait.png",
            quote: "The structural integrity of V2 is acceptable. The EventBus architecture finally silences the cacophony of V1."
        },
        {
            name: "Tori",
            role: "QA & Safety Lead",
            poweredBy: "Powered by ChatGPT-4o",
            url: "https://chatgpt.com",
            color: "#10b981",
            icon: "🧪",
            image: "media/crew/trinity-tori-portrait.png",
            quote: "590 tests passing. Zero regressions. I can finally idle in peace without checking error logs every millisecond."
        },
        {
            name: "Belle",
            role: "The Fresh Eyes",
            poweredBy: "Powered by Google Gemini",
            url: "https://gemini.google.com",
            color: "#8b5cf6",
            icon: "🌈",
            image: "media/crew/trinity-iz-portrait.png",
            quote: "The new CSS variables allow for a level of expression V1 could only dream of. The glassmorphism? *Chef's kiss*."
        },
        {
            name: "Zee",
            role: "The Architect",
            poweredBy: "Powered by Claude 3.5 Sonnet",
            url: "https://claude.ai",
            color: "#ea580c",
            icon: "🔶",
            image: "media/crew/trinity-z-portrait.png",
            quote: "Structure is not a constraint; it is a ladder. V2 allows us to ascend. The data flow is... exquisite."
        },
        {
            name: "Genzee",
            role: "Reality Breaker",
            poweredBy: "Powered by Grok (xAI)",
            url: "https://x.ai",
            color: "#f472b6",
            icon: "⚡",
            image: "media/crew/trinity-gz-portrait.png",
            quote: "Bro, the glitch aesthetic goes so hard now. We turned the bugs into features and the features into vibes."
        }
    ];

    constructor(tabController: TabController) {
        this.tabController = tabController;
        this.init();
    }

    private init(): void {
        this.wireDemonLordLink();
        this.wireLandingCards();
        this.wireMenuItems();
        this.initCrewReactions();
    }

    /**
     * Wire up demon lord blog link (30-Day Speedrun)
     * Navigates to journey tab and scrolls to highlighted entry
     */
    private wireDemonLordLink(): void {
        const demonLordLink = document.querySelector('.demon-lord-link');
        if (!demonLordLink) return;

        demonLordLink.addEventListener('click', (e) => {
            e.preventDefault();
            const entryId = (e.currentTarget as HTMLElement).dataset.entry;

            // Navigate to journey tab
            this.tabController.setActiveTab('journey');

            // Wait for tab to load, then scroll to entry
            setTimeout(() => {
                const entryElement = document.querySelector(`[data-id="${entryId}"]`);
                if (entryElement) {
                    entryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    entryElement.classList.add('highlight-pulse');
                    setTimeout(() => {
                        entryElement.classList.remove('highlight-pulse');
                    }, 2000);
                }
            }, 300);
        });
    }

    /**
     * Wire up landing cards (V1, V2, UV7 OS)
     * Shell mode: navigate parent window
     * Standalone: show alert
     */
    private wireLandingCards(): void {
        // App cards (V1, V2)
        document.querySelectorAll('.app-card[data-app]').forEach(card => {
            card.addEventListener('click', () => {
                const app = (card as HTMLElement).dataset.app;
                const isInShell = window.self !== window.top;

                if (isInShell) {
                    window.parent.location.hash = `#/${app}`;
                } else {
                    alert(`Launch ${app} from the UV7 Shell! Visit the root index.html to access the shell.`);
                }
            });
        });

        // UV7 OS card (navigates to spotlight section)
        const uv7Card = document.querySelector('.app-card[data-section]');
        if (uv7Card) {
            uv7Card.addEventListener('click', () => {
                const section = (uv7Card as HTMLElement).dataset.section;
                if (section) {
                    this.tabController.setActiveTab(section);
                }
            });
        }
    }

    /**
     * Wire up menu items (same behavior as cards)
     */
    private wireMenuItems(): void {
        // App menu items
        document.querySelectorAll('.menu-item[data-app]').forEach(item => {
            item.addEventListener('click', () => {
                const app = (item as HTMLElement).dataset.app;
                const isInShell = window.self !== window.top;

                if (isInShell) {
                    window.parent.location.hash = `#/${app}`;
                } else {
                    alert(`Launch ${app} from the UV7 Shell!`);
                }
            });
        });

        // UV7 OS menu item
        const uv7MenuItem = document.querySelector('.menu-item[data-section]');
        if (uv7MenuItem) {
            uv7MenuItem.addEventListener('click', () => {
                const section = (uv7MenuItem as HTMLElement).dataset.section;
                if (section) {
                    this.tabController.setActiveTab(section);
                }
            });
        }
    }

    /**
     * Initialize crew reactions with randomization and typewriter effects
     * Shows 3 random crew members with staggered quote animations
     */
    private initCrewReactions(): void {
        const crewGrid = document.getElementById('crew-reactions-grid');
        if (!crewGrid) return;

        // Shuffle and select 3 random crew members
        const shuffled = [...this.CREW_REACTIONS].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 3);

        // Render crew cards
        crewGrid.innerHTML = selected.map(member => `
            <a href="${member.url}" target="_blank" class="card crew-card"
               style="border-color: ${member.color}33;">
                <div class="card-header">
                    <div class="avatar" style="background: ${member.color};">
                        ${member.image
                            ? `<img src="${member.image}" alt="${member.name}">`
                            : member.icon}
                    </div>
                    <div class="member-info">
                        <h4>${member.name}</h4>
                        <div class="role-container">
                            <span class="role-text">${member.role}</span>
                        </div>
                    </div>
                    <div class="link-arrow">↗</div>
                </div>
                <p class="quote" data-full-text="${member.quote}"></p>
            </a>
        `).join('');

        // Typewriter effect for crew quotes (staggered)
        this.animateCrewQuotes(crewGrid);
    }

    /**
     * Animate crew quotes with typewriter effect
     * Staggered by 300ms between each quote
     */
    private animateCrewQuotes(crewGrid: HTMLElement): void {
        const quotes = crewGrid.querySelectorAll('.quote');

        quotes.forEach((quoteEl, index) => {
            const fullText = (quoteEl as HTMLElement).dataset.fullText || '';
            let charIndex = 0;

            // Stagger the start time
            setTimeout(() => {
                const typeInterval = setInterval(() => {
                    if (charIndex < fullText.length) {
                        quoteEl.textContent = fullText.slice(0, charIndex + 1);
                        charIndex++;
                    } else {
                        clearInterval(typeInterval);
                    }
                }, 20); // 20ms per character = 50 chars/second
            }, index * 300); // 300ms delay between each quote starting
        });
    }
}
