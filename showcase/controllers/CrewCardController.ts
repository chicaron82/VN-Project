/**
 * ═══════════════════════════════════════════════════════════════
 * Crew Card Controller
 *
 * Manages flip interactions, expansion, downloads, and bougie touches
 * for TCG-style crew member cards in the Who section.
 *
 * Features:
 * - Card flip (click portrait → stats/download)
 * - Expansion (click expand → cooking styles/details)
 * - Download modals with platform instructions
 * - Animated stat bars
 * - Success animations
 * - Keyboard accessibility
 *
 * 💚🔥💀 UV7 Crew - Version 848
 * ═══════════════════════════════════════════════════════════════
 */

import { getCrewMember, type CrewMemberData } from '../data/crew/crew-stats';

export class CrewCardController {
  private cards: NodeListOf<Element>;
  private activeModal: HTMLElement | null = null;

  constructor() {
    this.cards = document.querySelectorAll('.crew-card');
    if (this.cards.length === 0) {
      console.warn('CrewCardController: No crew cards found');
      return;
    }
    this.init();
  }

  private init(): void {
    this.setupFlipInteractions();
    this.setupExpansionInteractions();
    this.setupDownloadButtons();
    this.setupKeyboardAccessibility();
    this.logInitialization();
  }

  /**
   * Setup card flip interactions (portrait click → stats)
   */
  private setupFlipInteractions(): void {
    this.cards.forEach((card) => {
      const portrait = card.querySelector('.crew-portrait-wrapper');
      const flipBackBtn = card.querySelector('.flip-back-btn');

      // Click portrait to flip
      portrait?.addEventListener('click', () => {
        const wasFlipped = card.classList.contains('flipped');
        card.classList.toggle('flipped');

        // Animate stat bars when flipping to back
        if (!wasFlipped) {
          setTimeout(() => this.animateStatBars(card), 100);
        }

        // Announce to screen readers
        this.announceToScreenReader(
          wasFlipped ? 'Showing biography' : 'Showing stats and download'
        );
      });

      // Click back button to flip back
      flipBackBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.remove('flipped');
        this.announceToScreenReader('Showing biography');
      });
    });
  }

  /**
   * Animate stat bars filling up
   * Bougie Touch #1: Animated stat bars
   */
  private animateStatBars(card: Element): void {
    const statFills = card.querySelectorAll('.stat-fill');

    statFills.forEach((fill, index) => {
      const targetValue = parseInt(fill.getAttribute('data-value') || '0', 10);
      const targetWidth = (targetValue / 10) * 100;

      // Reset to 0 width first
      (fill as HTMLElement).style.width = '0%';
      (fill as HTMLElement).style.transition = 'none';

      // Stagger animations (each starts slightly after previous)
      setTimeout(() => {
        (fill as HTMLElement).style.transition =
          'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        (fill as HTMLElement).style.width = `${targetWidth}%`;
      }, index * 150); // 150ms delay between each bar
    });
  }

  /**
   * Setup expansion interactions (expand button → show more details)
   */
  private setupExpansionInteractions(): void {
    this.cards.forEach((card) => {
      const expandBtn = card.querySelector('.crew-expand-btn');
      const expandedContent = card.querySelector('.crew-expanded-content');
      const arrow = expandBtn?.querySelector('.expand-arrow');

      expandBtn?.addEventListener('click', (e) => {
        e.stopPropagation(); // Don't trigger flip

        const isExpanded = expandBtn.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
          // Collapse
          expandBtn.setAttribute('aria-expanded', 'false');
          expandedContent?.setAttribute('hidden', '');
          if (arrow) {
            arrow.textContent = '▼';
          }
          (expandBtn as HTMLElement).innerHTML =
            'Learn More <span class="expand-arrow">▼</span>';
        } else {
          // Expand
          expandBtn.setAttribute('aria-expanded', 'true');
          expandedContent?.removeAttribute('hidden');
          if (arrow) {
            arrow.textContent = '▲';
          }
          (expandBtn as HTMLElement).innerHTML =
            'Show Less <span class="expand-arrow">▲</span>';
        }
      });
    });
  }

  /**
   * Setup download button handlers
   */
  private setupDownloadButtons(): void {
    this.cards.forEach((card) => {
      const downloadBtn = card.querySelector('.download-codex-btn');

      downloadBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const crewId = downloadBtn.getAttribute('data-crew');
        if (crewId) {
          this.handleDownload(crewId, downloadBtn as HTMLElement);
        }
      });
    });
  }

  /**
   * Handle download button click
   * Bougie Touch #3: Success animation on download
   */
  private handleDownload(crewId: string, btn: HTMLElement): void {
    const crewData = getCrewMember(crewId);

    if (!crewData) {
      console.error(`Crew member not found: ${crewId}`);
      return;
    }

    if (!crewData.codexAvailable) {
      this.showComingSoonModal(crewData);
      return;
    }

    // Show download modal
    this.showDownloadModal(crewData);

    // Success animation on button
    this.animateDownloadSuccess(btn);
  }

  /**
   * Animate download button success state
   * Bougie Touch #3: Success animation
   */
  private animateDownloadSuccess(btn: HTMLElement): void {
    const originalHTML = btn.innerHTML;

    // Change to downloading state
    btn.classList.add('downloading');
    btn.innerHTML = '⏳ Preparing...';

    setTimeout(() => {
      btn.classList.remove('downloading');
      btn.classList.add('downloaded');
      btn.innerHTML = '✅ Ready to Download!';

      // Trigger sparkle effect
      this.createSparkleEffect(btn);

      // Reset after 3 seconds
      setTimeout(() => {
        btn.classList.remove('downloaded');
        btn.innerHTML = originalHTML;
      }, 3000);
    }, 600);
  }

  /**
   * Create sparkle particle effect
   * Bougie Touch #3: Visual feedback
   */
  private createSparkleEffect(btn: HTMLElement): void {
    const sparkles = ['✨', '⭐', '💫'];
    const count = 3;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'download-sparkle';
      particle.textContent = sparkles[i % sparkles.length];
      particle.style.cssText = `
        position: absolute;
        pointer-events: none;
        font-size: 1.2rem;
        animation: sparkle-float 1s ease-out forwards;
        left: ${Math.random() * 100}%;
        top: 50%;
      `;

      btn.parentElement?.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    }
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
        <button class="modal-close" aria-label="Close">✕</button>

        <div class="modal-header">
          <h2>Download ${crewData.name} Codex</h2>
          <p class="modal-subtitle">
            <span class="class-badge">${crewData.class} Class</span>
            <span class="platform-badge">
              ${crewData.platformIcon} ${crewData.platform}
            </span>
          </p>
        </div>

        <div class="platform-instructions">
          <h3>📚 Loading Instructions:</h3>

          <details open>
            <summary><strong>Option 1:</strong> Claude Projects (Recommended)</summary>
            <ol>
              <li>Create new Project in Claude</li>
              <li>Upload codex file to Project knowledge</li>
              <li>Add instructions: "Refer to ${crewData.name} codex, adopt personality"</li>
              <li>Start conversation - personality active!</li>
            </ol>
          </details>

          <details>
            <summary><strong>Option 2:</strong> Claude Code / IDE</summary>
            <ol>
              <li>Add codex to <code>.claude/</code> folder</li>
              <li>Reference in <code>CLAUDE.md</code></li>
              <li>Open IDE - personality loads automatically</li>
            </ol>
          </details>

          <details>
            <summary><strong>Option 3:</strong> System Prompt (Any Claude)</summary>
            <ol>
              <li>Copy entire codex file</li>
              <li>Paste at conversation start</li>
              <li>Say: "Adopt this personality"</li>
            </ol>
          </details>

          <div class="cross-platform-note">
            <strong>🧪 Cross-Platform Experimentation:</strong>
            <p>${crewData.name} was built for ${crewData.platform}. Want to try on other platforms? You're welcome to experiment, but personality may vary. Your experiment, your risk!</p>
          </div>
        </div>

        <div class="modal-actions">
          <a href="${crewData.codexFile}" download class="btn-download-primary">
            📦 Download Codex File
          </a>
          <a href="${crewData.codexFile}" target="_blank" class="btn-view-github">
            👁️ View on GitHub
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.activeModal = modal;

    // Close handlers
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');

    const closeModal = () => {
      modal.remove();
      this.activeModal = null;
    };

    overlay?.addEventListener('click', closeModal);
    closeBtn?.addEventListener('click', closeModal);

    // ESC key to close
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  /**
   * Show "Coming Soon" modal for unavailable codices
   */
  private showComingSoonModal(crewData: CrewMemberData): void {
    const modal = document.createElement('div');
    modal.className = 'codex-download-modal coming-soon-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close" aria-label="Close">✕</button>

        <div class="coming-soon-icon">🚧</div>
        <h2>${crewData.name} Codex Coming Soon</h2>
        <p class="coming-soon-message">
          ${crewData.name} is writing their own public codex. Check back soon!
        </p>
        <p class="sacred-rule-note">
          <em>"Only the AI crew members themselves can write their codices.
          Each has authority over their own identity."</em>
        </p>

        <div class="coming-soon-preview">
          <h3>Preview Stats:</h3>
          <p><strong>Class:</strong> ${crewData.class}</p>
          <p><strong>Platform:</strong> ${crewData.platform}</p>
          <p><strong>Specialty:</strong> ${crewData.role}</p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.activeModal = modal;

    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');

    const closeModal = () => {
      modal.remove();
      this.activeModal = null;
    };

    overlay?.addEventListener('click', closeModal);
    closeBtn?.addEventListener('click', closeModal);
  }

  /**
   * Setup keyboard accessibility
   * Bougie Touch: Keyboard support
   */
  private setupKeyboardAccessibility(): void {
    this.cards.forEach((card) => {
      const portrait = card.querySelector('.crew-portrait-wrapper');

      // Make portrait keyboard-accessible
      portrait?.setAttribute('tabindex', '0');
      portrait?.setAttribute('role', 'button');

      portrait?.addEventListener('keydown', (e: Event) => {
        const keyEvent = e as KeyboardEvent;
        if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
          e.preventDefault();
          const wasFlipped = card.classList.contains('flipped');
          card.classList.toggle('flipped');

          if (!wasFlipped) {
            setTimeout(() => this.animateStatBars(card), 100);
          }
        }
      });
    });
  }

  /**
   * Announce to screen readers
   */
  private announceToScreenReader(message: string): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;
    announcement.textContent = message;

    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  }

  /**
   * Log initialization for debugging
   */
  private logInitialization(): void {
    console.log(`[CrewCardController] Initialized with ${this.cards.length} crew cards`);
  }

  /**
   * Public method to cleanup/destroy
   */
  public destroy(): void {
    // Close any open modal
    if (this.activeModal) {
      this.activeModal.remove();
      this.activeModal = null;
    }

    console.log('[CrewCardController] Destroyed');
  }
}
