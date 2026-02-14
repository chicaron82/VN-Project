/**
 * SpotlightModalController
 * Wires bento grid cards to the existing spotlight modal.
 * Deep-dive content for each technical feature — the story behind the code.
 *
 * 💚🔥💀
 */

import { Logger } from '@utils/Logger';

interface CardDeepDive {
    icon: string;
    title: string;
    badge: string;
    origin: string;
    challenge: string;
    solution: string[];
    crew: string;
    codeSnippet?: string;
}

const CARD_DEEP_DIVES: CardDeepDive[] = [
    {
        icon: '🎠',
        title: 'Momentum Carousel',
        badge: 'Live',
        origin: '"What if character selection felt like swiping through a vinyl collection?"',
        challenge: 'V1\'s carousel was a 400-line physics engine with raw DOM manipulation, velocity tracking, and friction calculations. Porting it to TypeScript meant adding strict types to code that treated the DOM like a physics sandbox — TouchEvent null checks everywhere, explicit casting for every DOM event, and guard clauses that V1 never needed because JavaScript doesn\'t care.',
        solution: [
            'Preserved V1\'s exact friction coefficient (0.975) and velocity curves',
            'Added guard clauses for TouchEvent null checks without changing feel',
            'Explicit type casting for DOM events while maintaining 60fps',
            'Reduced motion support — skips momentum, snaps directly'
        ],
        crew: '🔪 DiZee',
    },
    {
        icon: '🚀',
        title: 'Boot Sequence Parity',
        badge: 'Refined',
        origin: '"The V1 boot sequence was a vibe. If V2 doesn\'t feel identical on startup, we failed."',
        challenge: 'V1\'s boot sequence had pixel-perfect timing: a left-to-right logo wipe using width-based reveals, a video that freezes at 0.01 seconds until fully loaded, and landscape-specific sizing that looked wrong at every other breakpoint. Recreating "feels the same" meant matching millisecond-level animation timing.',
        solution: [
            'Width-based logo reveal (not opacity — V1 used clip-path equivalent)',
            'Video freeze-frame at 0.01s with canplay event listener',
            'Responsive sizing cascade: 280px → 250px → 200px across breakpoints',
            '2-second delay before animation starts — V1\'s timing preserved exactly'
        ],
        crew: '🌸 Belle spotted the 2px drift',
    },
    {
        icon: '⚙️',
        title: 'Settings & Secrets',
        badge: 'Complete',
        origin: '"There are 11 secret codes hidden in the settings menu. Each one was hand-crafted."',
        challenge: '1,100 lines of V1 CSS that made the settings panel look exactly right — every toggle, every slider, every hidden menu. Plus a SecretCodesManager that tracks which codes the player has discovered, with visual feedback for each one. And a critical infinite-loop crash in EventBus that only triggered when secrets fired events that triggered other secrets.',
        solution: [
            'Pixel-perfect CSS port — every shadow, gradient, and transition preserved',
            'SecretCodesManager rebuilt with discovery state tracking',
            '11 discoverable codes with unique animations per code',
            'EventBus infinite-loop crash fixed with re-entrancy guard'
        ],
        crew: '🧪 Tori found the infinite loop',
    },
    {
        icon: '🎮🐣',
        title: 'Cross-Game Communication',
        badge: 'Meta-Narrative',
        origin: '"What if caring for Tori in a mini-game actually affected the main story?"',
        challenge: 'Two separate games — the visual novel and ToriGatchi — needed to share persistent state. When you take care of Tori in the mini-game, the VN knows. When you reach certain VN endings, ToriGatchi unlocks new content. Bidirectional communication through localStorage, with conflict resolution when both games write simultaneously.',
        solution: [
            'Shared localStorage schema with version-stamped reads',
            'ToriGatchi mood/care state affects VN dialogue branches',
            'VN ending flags unlock ToriGatchi content and cosmetics',
            'Meta-narrative layer: the care mechanic IS the story'
        ],
        crew: '🔪 DiZee + 🧪 Tori co-designed the gateway',
        codeSnippet: `// The bridge between two worlds
gateway.on('torigatchi:mood_changed', (mood) => {
  stateManager.set('tori.crossGameMood', mood);
  eventBus.emit('dialogue:branch_update');
});`
    },
    {
        icon: '🧠👁️',
        title: 'Echo Memory System',
        badge: 'Innovative',
        origin: '"What if the NPCs remembered what you did last playthrough — and started calling you out?"',
        challenge: 'Echoes are entities in the game that track player behavior across sessions using localStorage. They have 5 awareness levels (0-4), and at each level they break the fourth wall more aggressively — from subtle glances to full glitch-text confrontations. The "Remembered" achievement triggers only when ALL three Echoes have noticed the player.',
        solution: [
            'Persistent behavior tracking across browser sessions',
            'Escalating awareness levels (0-4) with distinct visual styles',
            'Fourth-wall breaking dialogue with procedural glitch effects',
            '"Remembered" achievement — all Echoes aware simultaneously'
        ],
        crew: '💀 GenZee proposed the escalation mechanic',
        codeSnippet: `// They remember.
if (echo.awarenessLevel >= 3) {
  applyGlitchEffect(dialogueElement);
  echo.speak("You've been here before. I can tell.");
}`
    },
    {
        icon: '⏰🔄',
        title: 'Time Machine Backlog',
        badge: 'UX Innovation',
        origin: '"Traditional VN backlogs let you re-read. Ours lets you re-live."',
        challenge: 'Most visual novel backlog systems show a scrollable list of past dialogue. Ours lets you click any line and the game state restores to that exact moment — tether level, flags, context, everything. It\'s not a log, it\'s a save-state-per-line system that required snapshotting the full game state at every dialogue advance.',
        solution: [
            'Full game state snapshot at every dialogue transition',
            'Click-to-jump — select any line, game restores to that moment',
            'Tether, flags, route context, and visual state all preserved',
            'Performance: differential snapshots, not full copies'
        ],
        crew: '🔪 DiZee',
    },
    {
        icon: '📡⚡',
        title: 'Event-Driven Architecture',
        badge: 'Refactored',
        origin: '"59 files coupled via this.game.* — every change risked breaking everything else."',
        challenge: 'V1\'s game-engine.js was a 3,903-line god class with 261 methods. 59 files reached into it via this.game.* references, creating a dependency spider web where touching one system could break three others. The V2 refactor replaced direct calls with a type-safe EventBus — pub/sub pattern with zero circular dependencies.',
        solution: [
            'EventBus with typed event emission and subscription',
            'All 59 coupled files migrated to event-driven communication',
            'Zero circular dependencies verified via import analysis',
            'Systems can be added, removed, or tested in isolation'
        ],
        crew: '🔪 DiZee + 🌸 Belle validated the dependency graph',
        codeSnippet: `// Before (V1): direct coupling
this.game.spriteManager.updateSprite('tori', 'sad');

// After (V2): event-driven
eventBus.emit('sprite:update', {
  character: 'tori', expression: 'sad'
});`
    },
    {
        icon: '♿✨',
        title: 'Accessibility-First Design',
        badge: 'WCAG Compliant',
        origin: '"Everyone should be able to experience this story, regardless of ability."',
        challenge: 'Visual novels are inherently visual-first — sprites, backgrounds, text animations. Making UV7 accessible meant adding high contrast modes that don\'t kill the atmosphere, font scaling that doesn\'t break layouts, reduced motion that still feels intentional, and screen reader support for a medium that assumes you can see.',
        solution: [
            'High contrast mode preserves narrative mood while meeting WCAG AA',
            'Font scaling from 80% to 150% without layout breakage',
            'Reduced motion: animations become instant transitions',
            'Full ARIA labeling with semantic HTML throughout'
        ],
        crew: '🧪 Tori + 🌸 Belle',
    },
];

export class SpotlightModalController {
    private modal: HTMLElement | null = null;
    private modalBody: HTMLElement | null = null;
    private prevBtn: HTMLButtonElement | null = null;
    private nextBtn: HTMLButtonElement | null = null;
    private closeBtn: HTMLButtonElement | null = null;
    private backdrop: HTMLElement | null = null;
    private currentIndex = 0;
    private cards: HTMLElement[] = [];

    constructor() {
        this.init();
    }

    private init(): void {
        this.modal = document.querySelector('.spotlight-modal');
        this.modalBody = document.querySelector('.spotlight-modal .modal-body');
        this.prevBtn = document.querySelector('.spotlight-modal .modal-prev');
        this.nextBtn = document.querySelector('.spotlight-modal .modal-next');
        this.closeBtn = document.querySelector('.spotlight-modal .modal-close');
        this.backdrop = document.querySelector('.spotlight-modal .modal-backdrop');
        this.cards = Array.from(document.querySelectorAll('.spotlight-bento-grid .technical-card'));

        if (!this.modal || !this.modalBody || this.cards.length === 0) {
            Logger.warn('[SpotlightModal] Elements not found, skipping init');
            return;
        }

        this.wireCardClicks();
        this.wireModalControls();
        this.wireKeyboard();
        this.exposeGlobal();

        Logger.ui('🎯 SpotlightModal wired — ' + this.cards.length + ' cards clickable');
    }

    private wireCardClicks(): void {
        this.cards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `View details: ${CARD_DEEP_DIVES[index]?.title ?? 'Feature'}`);

            card.addEventListener('click', () => this.open(index));
            card.addEventListener('keydown', (e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.open(index);
                }
            });
        });
    }

    private wireModalControls(): void {
        this.closeBtn?.addEventListener('click', () => this.close());
        this.backdrop?.addEventListener('click', () => this.close());
        this.prevBtn?.addEventListener('click', () => this.navigate(-1));
        this.nextBtn?.addEventListener('click', () => this.navigate(1));
    }

    private wireKeyboard(): void {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (!this.modal?.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape': this.close(); break;
                case 'ArrowLeft': this.navigate(-1); break;
                case 'ArrowRight': this.navigate(1); break;
            }
        });
    }

    private exposeGlobal(): void {
        // Wire up the global that showcase-carousel.ts expects
        window.spotlightModal = {
            open: (index: number) => this.open(index)
        };
    }

    open(index: number): void {
        if (index < 0 || index >= CARD_DEEP_DIVES.length) return;

        this.currentIndex = index;
        this.renderContent(CARD_DEEP_DIVES[index]);
        this.updateNavButtons();
        this.modal?.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus trap
        this.closeBtn?.focus();
    }

    private close(): void {
        this.modal?.classList.remove('active');
        document.body.style.overflow = '';

        // Return focus to the card that opened the modal
        this.cards[this.currentIndex]?.focus();
    }

    private navigate(direction: number): void {
        const newIndex = this.currentIndex + direction;
        if (newIndex < 0 || newIndex >= CARD_DEEP_DIVES.length) return;
        this.open(newIndex);
    }

    private updateNavButtons(): void {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === CARD_DEEP_DIVES.length - 1;
        }
    }

    private renderContent(data: CardDeepDive): void {
        if (!this.modalBody) return;

        this.modalBody.innerHTML = `
            <div class="modal-header">
                <span class="modal-icon">${data.icon}</span>
                <h2>${data.title}</h2>
                <span class="modal-badge">${data.badge}</span>
            </div>

            <div class="modal-challenge">
                <h3>💡 Origin Story</h3>
                <p><em>${data.origin}</em></p>
            </div>

            <div class="modal-challenge">
                <h3>🔧 The Challenge</h3>
                <p>${data.challenge}</p>
            </div>

            <div class="modal-solution">
                <h3>✅ How We Solved It</h3>
                <ul>
                    ${data.solution.map(s => `<li>${s}</li>`).join('\n                    ')}
                </ul>
            </div>

            ${data.codeSnippet ? `
            <div class="modal-code">
                <h3>📝 Code Snapshot</h3>
                <pre><code>${this.escapeHtml(data.codeSnippet)}</code></pre>
            </div>
            ` : ''}

            <div class="modal-details">
                <p style="opacity: 0.7; font-size: 0.9rem;">🍳 Cooked by: <strong>${data.crew}</strong></p>
            </div>
        `;
    }

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
}
