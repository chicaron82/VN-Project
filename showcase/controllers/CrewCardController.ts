import { Logger } from '@utils/Logger';
import { getCrewMember, type CrewMemberData } from '../data/crew/crew-stats';

/**
 * CrewCardController
 * 
 * Manages TCG-style crew card interactions:
 * - Flip cards (portrait click → show stats)
 * - Animated stat bars (staggered fill animation)
 * - Expansion interactions (Learn More button)
 * - Download/Coming Soon modals
 * - Success animations with sparkle particles
 * - Keyboard accessibility (Enter/Space to flip)
 * 
 * BOUGIE TOUCHES:
 * 1. ✅ Animated stat bars - fill from 0% with stagger
 * 2. ✅ Micro-interactions - portrait zoom, card shadow shift
 * 3. ✅ Success animations - button state changes with sparkles
 * 4. ✅ Platform badges - visual indicators
 * 5. ��� QR codes - planned
 */
export class CrewCardController {
    private cards: NodeListOf<Element>;

    constructor() {
        this.cards = document.querySelectorAll('.crew-card');

        if (this.cards.length === 0) {
            Logger.warn('[CrewCardController] No crew cards found');
            return;
        }

        this.setupFlipInteractions();
        this.setupExpansionInteractions();
        this.setupDownloadButtons();
        this.setupKeyboardAccessibility();

        Logger.system(`[CrewCardController] Initialized with ${this.cards.length} crew cards`);
    }

    /**
     * BOUGIE TOUCH #1 & #2: Flip cards + animate stat bars
     */
    private setupFlipInteractions(): void {
        this.cards.forEach(card => {
            const portraitWrapper = card.querySelector('.crew-portrait-wrapper');
            const flipBackBtn = card.querySelector('.flip-back-btn');

            if (!portraitWrapper) return;

            // Portrait click → flip to stats
            portraitWrapper.addEventListener('click', () => {
                card.classList.toggle('flipped');

                // Animate stat bars when flipping to back
                if (card.classList.contains('flipped')) {
                    this.animateStatBars(card);
                    this.announceToScreenReader('Showing crew stats');
                } else {
                    this.announceToScreenReader('Showing crew bio');
                }
            });

            // Flip back button
            if (flipBackBtn) {
                flipBackBtn.addEventListener('click', () => {
                    card.classList.remove('flipped');
                    this.announceToScreenReader('Showing crew bio');
                });
            }
        });
    }

    /**
     * BOUGIE TOUCH #1: Animated stat bars with staggered fill
     */
    private animateStatBars(card: Element): void {
        const statBars = card.querySelectorAll('.stat-fill');

        statBars.forEach((bar, index) => {
            const targetValue = parseInt((bar as HTMLElement).dataset.value || '0', 10);
            const targetWidth = (targetValue / 10) * 100; // Convert 1-10 to percentage

            // Reset width
            (bar as HTMLElement).style.width = '0%';
            (bar as HTMLElement).style.transition = 'none';

            // Staggered animation (150ms delay between bars)
            setTimeout(() => {
                (bar as HTMLElement).style.transition = 'width 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)';
                (bar as HTMLElement).style.width = `${targetWidth}%`;
            }, index * 150);
        });
    }

    /**
     * Expansion button interactions (Learn More)
     */
    private setupExpansionInteractions(): void {
        this.cards.forEach(card => {
            const expandBtn = card.querySelector('.crew-expand-btn');
            const expandedContent = card.querySelector('.crew-expanded-content');

            if (!expandBtn || !expandedContent) return;

            expandBtn.addEventListener('click', () => {
                const isExpanded = !expandedContent.hasAttribute('hidden');

                // Toggle expanded state
                if (isExpanded) {
                    expandedContent.setAttribute('hidden', '');
                    expandBtn.setAttribute('aria-expanded', 'false');
                    (expandBtn.querySelector('.expand-text') as HTMLElement).textContent = 'Learn More';
                    (expandBtn.querySelector('.expand-icon') as HTMLElement).textContent = '▼';
                } else {
                    expandedContent.removeAttribute('hidden');
                    expandBtn.setAttribute('aria-expanded', 'true');
                    (expandBtn.querySelector('.expand-text') as HTMLElement).textContent = 'Show Less';
                    (expandBtn.querySelector('.expand-icon') as HTMLElement).textContent = '▲';
                }
            });
        });
    }

    /**
     * Download button click handlers
     */
    private setupDownloadButtons(): void {
        // Download codex buttons (available codices)
        const downloadBtns = document.querySelectorAll('.download-codex-btn');
        downloadBtns.forEach(btn => {
            btn.addEventListener('click', (_e) => {
                const crewId = (btn as HTMLElement).dataset.crew;
                if (!crewId) return;

                this.handleDownload(crewId, btn as HTMLElement);
            });
        });

        // Coming soon buttons (not yet available)
        const comingSoonBtns = document.querySelectorAll('.coming-soon-btn');
        comingSoonBtns.forEach(btn => {
            btn.addEventListener('click', (_e) => {
                const crewId = (btn as HTMLElement).dataset.crew;
                if (!crewId) return;

                const crewData = getCrewMember(crewId);
                if (crewData) {
                    this.showComingSoonModal(crewData);
                }
            });
        });
    }

    /**
     * BOUGIE TOUCH #3: Download with success animation
     */
    private handleDownload(crewId: string, _btn: HTMLElement): void {
        const crewData = getCrewMember(crewId);
        if (!crewData || !crewData.codexAvailable) return;

        // Show download modal with instructions
        this.showDownloadModal(crewData);
    }

    /**
     * BOUGIE TOUCH #3: Button success animation with sparkle particles
     */
    private animateDownloadSuccess(btn: HTMLElement): void {
        Logger.system('[CrewCardController] Triggering download sparkle animation');
        const originalHTML = btn.innerHTML;

        // Change to "Preparing..." state
        btn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Preparing...</span>';
        btn.classList.add('success');

        // Create sparkle effect
        this.createSparkleEffect(btn);

        // After animation, change to "Ready!" state
        setTimeout(() => {
            btn.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">Ready!</span>';

            // Reset after 2 seconds
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('success');
            }, 2000);
        }, 600);
    }

    /**
     * BOUGIE TOUCH #3: Sparkle particle effect (✨⭐💫)
     */
    private createSparkleEffect(btn: HTMLElement): void {
        const sparkles = ['✨', '⭐', '💫', '✨', '⭐'];
        const btnRect = btn.getBoundingClientRect();

        sparkles.forEach((emoji, index) => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.textContent = emoji;
            sparkle.style.position = 'fixed';  // Use fixed for viewport positioning
            sparkle.style.left = `${btnRect.left + btnRect.width / 2}px`;
            sparkle.style.top = `${btnRect.top + btnRect.height / 2}px`;
            sparkle.style.zIndex = '10000';  // Above modal

            // Random trajectory
            const angle = (index / sparkles.length) * Math.PI * 2;
            const distance = 60 + Math.random() * 40;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            sparkle.style.setProperty('--tx', `${tx}px`);
            sparkle.style.setProperty('--ty', `${ty}px`);

            document.body.appendChild(sparkle);

            // Remove after animation
            setTimeout(() => sparkle.remove(), 1000);
        });
    }



    /**
     * Show download modal with platform instructions
     */
    private showDownloadModal(crewData: CrewMemberData): void {
        const modal = document.createElement('div');
        modal.className = 'codex-download-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Close">×</button>
                <div class="modal-header">
                    <h2>Download ${crewData.name} Codex</h2>
                    <div class="modal-subtitle">
                        <span class="class-badge">${crewData.class}</span>
                        <span class="platform-badge">
                            ${crewData.platformIcon} ${crewData.platform}
                        </span>
                    </div>
                </div>

                <div class="platform-instructions">
                    <h3>How to Load ${crewData.name}</h3>
                    
                    <details>
                        <summary>Option 1: Claude Projects (Recommended)</summary>
                        <ol>
                            <li>Download the codex file below</li>
                            <li>Open your Claude Project</li>
                            <li>Go to Project Knowledge</li>
                            <li>Upload <code>${crewData.codexFile}</code></li>
                            <li>Add custom instructions: "Load ${crewData.name}'s personality from the uploaded codex"</li>
                        </ol>
                    </details>

                    <details>
                        <summary>Option 2: Claude Code / IDE Integration</summary>
                        <ol>
                            <li>Download the codex file</li>
                            <li>Copy to <code>.claude/</code> folder in your project root</li>
                            <li>Claude will auto-load on next conversation</li>
                        </ol>
                    </details>

                    <details>
                        <summary>Option 3: System Prompt Injection</summary>
                        <ol>
                            <li>Download and open the codex file</li>
                            <li>Copy entire contents</li>
                            <li>Paste at start of conversation or in custom instructions</li>
                        </ol>
                    </details>

                    <details>
                        <summary>Option 4: Conversation Upload</summary>
                        <ol>
                            <li>Download the codex file</li>
                            <li>Start a conversation with Claude</li>
                            <li>Attach the file using the upload button ���</li>
                            <li>Ask Claude to "load your personality from the attached codex"</li>
                        </ol>
                    </details>

                    <div class="cross-platform-note">
                        <strong>Platform Note:</strong> ${crewData.name} was built for ${crewData.platform}. 
                        Cross-platform experimentation is allowed, but results may vary. You've been warned! ���
                    </div>

                    <a href="crew-codices/${crewData.codexFile}" 
                       download="${crewData.codexFile}"
                       class="download-codex-btn"
                       style="display: block; text-align: center; text-decoration: none; margin-top: 2rem;">
                        <span class="btn-icon">���</span>
                        <span class="btn-text">Download ${crewData.name} Codex</span>
                    </a>
                </div>
            </div>
        `;

        // Close handlers
        const overlay = modal.querySelector('.modal-overlay');
        const closeBtn = modal.querySelector('.modal-close');

        const closeModal = (): void => {
            modal.remove();
        };

        overlay?.addEventListener('click', closeModal);
        closeBtn?.addEventListener('click', closeModal);

        // ESC to close
        const handleEsc = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);

        // Wire up sparkle effect to download link
        const downloadLink = modal.querySelector('a.download-codex-btn');
        if (downloadLink) {
            downloadLink.addEventListener('click', () => {
                this.animateDownloadSuccess(downloadLink as HTMLElement);
            });
        }

        document.body.appendChild(modal);
    }

    /**
     * Show "coming soon" message for codices not yet available
     */
    private showComingSoonModal(crewData: CrewMemberData): void {
        const modal = document.createElement('div');
        modal.className = 'codex-download-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Close">×</button>
                <div class="modal-header">
                    <h2>${crewData.name} Codex</h2>
                    <div class="modal-subtitle">
                        <span class="class-badge">${crewData.class}</span>
                        <span class="platform-badge">
                            ${crewData.platformIcon} ${crewData.platform}
                        </span>
                    </div>
                </div>

                <div class="platform-instructions" style="text-align: center; padding: 3rem 1rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">���</div>
                    <h3 style="margin-bottom: 1rem;">Coming Soon!</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                        ${crewData.name}'s personality codex is currently being self-authored. 
                        Remember: only the AI crew members themselves can write their own codices.
                    </p>
                    <p style="color: var(--text-tertiary); font-size: 0.9rem; font-style: italic;">
                        Check back soon! ✨
                    </p>
                </div>
            </div>
        `;

        // Close handlers
        const overlay = modal.querySelector('.modal-overlay');
        const closeBtn = modal.querySelector('.modal-close');

        const closeModal = (): void => {
            modal.remove();
        };

        overlay?.addEventListener('click', closeModal);
        closeBtn?.addEventListener('click', closeModal);

        document.addEventListener('keydown', (e: KeyboardEvent): void => {
            if (e.key === 'Escape') closeModal();
        }, { once: true });

        document.body.appendChild(modal);
    }

    /**
     * BOUGIE TOUCH: Keyboard accessibility
     */
    private setupKeyboardAccessibility(): void {
        this.cards.forEach(card => {
            const portraitWrapper = card.querySelector('.crew-portrait-wrapper');

            if (!portraitWrapper) return;

            portraitWrapper.addEventListener('keydown', (e) => {
                const keyEvent = e as KeyboardEvent;
                if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
                    keyEvent.preventDefault();
                    (portraitWrapper as HTMLElement).click();
                }
            });
        });
    }

    /**
     * Screen reader announcements
     */
    private announceToScreenReader(message: string): void {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;

        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }
}
