/**
 * SpotlightModal - Expandable modal overlay for Technical Spotlight cards
 * Displays detailed information with unique content per card
 */
class SpotlightModal {
    constructor() {
        this.modal = document.querySelector('.spotlight-modal');
        this.backdrop = document.querySelector('.modal-backdrop');
        this.content = document.querySelector('.modal-body');
        this.closeBtn = document.querySelector('.modal-close');
        this.prevBtn = document.querySelector('.modal-prev');
        this.nextBtn = document.querySelector('.modal-next');
        this.currentCardIndex = -1;
        this.totalCards = document.querySelectorAll('.technical-card').length;

        this.init();
    }

    init() {
        if (!this.modal) {
            console.warn('SpotlightModal: Modal element not found');
            return;
        }

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        // Backdrop click to close
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.close());
        }

        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.navigateModal(-1));
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.navigateModal(1));
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(event) {
        if (!this.modal.classList.contains('active')) return;

        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                this.close();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.navigateModal(-1);
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.navigateModal(1);
                break;
        }
    }

    open(cardIndex) {
        this.currentCardIndex = cardIndex;
        this.renderContent(cardIndex);

        // Show modal with animation
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll

        // Focus trap
        this.closeBtn?.focus();
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
        this.currentCardIndex = -1;
    }

    navigateModal(direction) {
        const newIndex = this.currentCardIndex + direction;
        if (newIndex >= 0 && newIndex < this.totalCards) {
            this.open(newIndex);
            // Also update the carousel
            window.spotlightCarousel?.navigateToCard(newIndex);
        }
    }

    renderContent(cardIndex) {
        const cardData = this.getCardData(cardIndex);
        if (!cardData) return;

        // Check if reduced motion is preferred
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.content.innerHTML = `
            <div class="modal-header">
                <div class="modal-icon">${cardData.icon}</div>
                <h2>${cardData.title}</h2>
                <span class="modal-badge">${cardData.badge}</span>
            </div>
            
            <div class="modal-challenge">
                <h3>The Challenge</h3>
                <p>${cardData.challenge}</p>
            </div>

            <div class="modal-solution">
                <h3>The Solution</h3>
                <ul>
                    ${cardData.fixes.map(fix => `<li>${fix}</li>`).join('')}
                </ul>
            </div>

            ${cardData.details ? `
                <div class="modal-details">
                    <h3>Technical Deep Dive</h3>
                    ${cardData.details}
                </div>
            ` : ''}

            ${cardData.demo && !prefersReducedMotion ? `
                <div class="modal-demo">
                    <h3>Interactive Demo</h3>
                    ${this.renderDemo(cardData.demo)}
                </div>
            ` : ''}

            ${cardData.codeSnippet ? `
                <div class="modal-code">
                    <h3>Code Example</h3>
                    <pre><code>${this.escapeHtml(cardData.codeSnippet)}</code></pre>
                </div>
            ` : ''}
        `;

        // Update navigation button states
        if (this.prevBtn) {
            this.prevBtn.disabled = cardIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = cardIndex === this.totalCards - 1;
        }
    }

    getCardData(index) {
        const cards = document.querySelectorAll('.technical-card');
        const card = cards[index];
        if (!card) return null;

        // Extract basic data from card
        const icon = card.querySelector('.tech-icon')?.textContent || '';
        const title = card.querySelector('h3')?.textContent || '';
        const badge = card.querySelector('.tech-badge')?.textContent || '';
        const challenge = card.querySelector('.tech-challenge')?.textContent.replace('Challenge:', '').trim() || '';
        const fixes = Array.from(card.querySelectorAll('.tech-fixes li')).map(li => li.textContent);

        // Enhanced content for specific cards
        const enhancedData = this.getEnhancedContent(title);

        return {
            icon,
            title,
            badge,
            challenge,
            fixes,
            ...enhancedData
        };
    }

    getEnhancedContent(title) {
        const enhancements = {
            'Echo Memory System': {
                details: `
                    <p>The Echo Memory System creates a persistent meta-narrative layer where the three Echoes (Hope, Gentle, Despair) 
                    gradually become aware of the player across multiple playthroughs.</p>
                    <p><strong>Awareness Levels:</strong></p>
                    <ul>
                        <li><strong>Level 0:</strong> No awareness - Echoes behave normally</li>
                        <li><strong>Level 1:</strong> Subtle hints - "Have we met before?"</li>
                        <li><strong>Level 2:</strong> Recognition - Echoes remember your choices</li>
                        <li><strong>Level 3:</strong> Fourth-wall breaking - Direct acknowledgment</li>
                        <li><strong>Level 4:</strong> Full awareness - Glitch text and meta-commentary</li>
                    </ul>
                `,
                demo: 'glitch-text'
            },
            'Time Machine Backlog': {
                details: `
                    <p>Unlike traditional VN backlogs that just show text history, the Time Machine Backlog preserves 
                    the complete game state at each dialogue point.</p>
                    <p><strong>What's Preserved:</strong></p>
                    <ul>
                        <li>Tether level and visual state</li>
                        <li>All story flags and variables</li>
                        <li>Character sprites and positions</li>
                        <li>Background and audio state</li>
                        <li>UI state (menu visibility, etc.)</li>
                    </ul>
                    <p>This allows true non-linear navigation through the story, not just text review.</p>
                `
            },
            'Cross-Game Communication': {
                details: `
                    <p>The VN and ToriGatchi mini-game share state through localStorage, creating a bidirectional 
                    meta-narrative where caring for Tori affects both games.</p>
                    <p><strong>State Flow:</strong></p>
                    <ul>
                        <li><strong>VN → ToriGatchi:</strong> Ending unlocks affect Tori's initial state</li>
                        <li><strong>ToriGatchi → VN:</strong> Tori's health influences dialogue and outcomes</li>
                        <li><strong>Persistent:</strong> State survives browser close and page refresh</li>
                    </ul>
                `
            },
            '50-Day Speedrun': {
                details: `
                    <p>UV7 was developed in 50 days through an innovative AI-human collaboration workflow.</p>
                    <p><strong>Development Techniques:</strong></p>
                    <ul>
                        <li><strong>Parallel AI Roles:</strong> Multiple AI instances with specialized personas (DiZee, crew members)</li>
                        <li><strong>Rate Limit Arbitrage:</strong> Smart cycling between AI providers to maintain momentum</li>
                        <li><strong>Blind Peer Review:</strong> Fresh AI instances review code without prior context</li>
                        <li><strong>Continuous Retrospectives:</strong> Daily reflection and iteration</li>
                    </ul>
                    <p>This created a "bootstrap paradox" where the game's meta-narrative mirrors its own creation process.</p>
                `
            },
            'Hybrid Carousel System': {
                details: `
                    <p>The menu carousel adapts its behavior based on device orientation and viewport size.</p>
                    <p><strong>Adaptive Modes:</strong></p>
                    <ul>
                        <li><strong>Portrait Mode:</strong> Simple card swiper with snap points</li>
                        <li><strong>Landscape Mode:</strong> Physics-based momentum scrolling with inertia</li>
                        <li><strong>Auto-Switching:</strong> Seamless transition on viewport change</li>
                        <li><strong>State Preservation:</strong> Current card index maintained across mode changes</li>
                    </ul>
                `
            },
            'Event-Driven Architecture': {
                codeSnippet: `// Before: Direct coupling
class TetherSystem {
    updateLevel(newLevel) {
        gameEngine.menu.updateDisplay(); // Direct dependency!
        gameEngine.audio.playSound('tether');
    }
}

// After: Event-driven decoupling
class TetherSystem {
    updateLevel(newLevel) {
        EventBus.emit('tether:changed', { level: newLevel });
        // No direct dependencies!
    }
}

// Listeners can be anywhere
EventBus.on('tether:changed', (data) => {
    menu.updateDisplay();
    audio.playSound('tether');
});`
            },
            'Accessibility-First Design': {
                details: `
                    <p>UV7 implements comprehensive accessibility features to ensure all players can enjoy the experience.</p>
                    <p><strong>Features:</strong></p>
                    <ul>
                        <li><strong>High Contrast Mode:</strong> Enhanced text visibility</li>
                        <li><strong>Font Scaling:</strong> Adjustable text size (80% - 150%)</li>
                        <li><strong>Reduced Motion:</strong> Respects prefers-reduced-motion</li>
                        <li><strong>Haptic Feedback:</strong> Granular vibration controls</li>
                        <li><strong>Screen Readers:</strong> ARIA labels and semantic HTML</li>
                        <li><strong>Keyboard Navigation:</strong> Full game playable without mouse</li>
                    </ul>
                `
            }
        };

        return enhancements[title] || {};
    }

    renderDemo(demoType) {
        switch (demoType) {
            case 'glitch-text':
                return `
                    <div class="glitch-demo">
                        <p class="glitch-text" data-text="I remember you...">I remember you...</p>
                        <p class="demo-note">This glitch effect appears when Echoes reach awareness level 4</p>
                    </div>
                `;
            default:
                return '<p>Interactive demo coming soon!</p>';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.spotlightModal = new SpotlightModal();
    });
} else {
    window.spotlightModal = new SpotlightModal();
}
