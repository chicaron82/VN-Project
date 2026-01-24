/**
 * CodeComparisonModal Component
 * Interactive split-screen code viewer with slider control
 * Shows before/after code comparison for timeline entries
 */
export class CodeComparisonModal {
    constructor() {
        this.isOpen = false;
        this.currentData = null;
        this.sliderPosition = 50; // percentage
        this.isDragging = false;
        this.previouslyFocusedElement = null;
        
        this.init();
    }

    init() {
        // Create modal container
        this.createModal();
        
        // Bind event listeners
        this.bindEvents();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'code-comparison-modal';
        modal.className = 'code-comparison-modal';
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'code-modal-title');
        modal.innerHTML = `
            <div class="code-modal-backdrop"></div>
            <div class="code-modal-container">
                <div class="code-modal-header">
                    <h3 id="code-modal-title" class="code-modal-title">Code Comparison</h3>
                    <button class="code-modal-close" aria-label="Close">&times;</button>
                </div>
                
                <div class="code-modal-body">
                    <div class="code-comparison-viewer">
                        <!-- Before Code (Left) -->
                        <div class="code-panel code-before">
                            <div class="code-panel-header">
                                <span class="code-panel-title">Before</span>
                                <span class="code-panel-badge">V1</span>
                            </div>
                            <div class="code-panel-content">
                                <pre><code class="code-block"></code></pre>
                            </div>
                        </div>
                        
                        <!-- After Code (Right) -->
                        <div class="code-panel code-after">
                            <div class="code-panel-header">
                                <span class="code-panel-title">After</span>
                                <span class="code-panel-badge">V2</span>
                            </div>
                            <div class="code-panel-content">
                                <pre><code class="code-block"></code></pre>
                            </div>
                        </div>
                        
                        <!-- Slider Handle -->
                        <div class="code-slider-container">
                            <div class="code-slider-line"></div>
                            <div class="code-slider-handle" tabindex="0" role="slider" 
                                 aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"
                                 aria-label="Adjust comparison split">
                                <div class="code-slider-arrows">
                                    <span>◀</span>
                                    <span>▶</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="code-modal-hint">
                    <span>💡 Drag the slider or use arrow keys to compare</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modal = modal;
        this.slider = modal.querySelector('.code-slider-handle');
        this.sliderContainer = modal.querySelector('.code-slider-container');
        this.viewer = modal.querySelector('.code-comparison-viewer');
    }

    bindEvents() {
        // Close button
        const closeBtn = this.modal.querySelector('.code-modal-close');
        closeBtn.addEventListener('click', () => this.close());
        
        // Backdrop click
        const backdrop = this.modal.querySelector('.code-modal-backdrop');
        backdrop.addEventListener('click', () => this.close());
        
        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        // Slider drag
        this.slider.addEventListener('mousedown', (e) => this.startDrag(e));
        this.slider.addEventListener('touchstart', (e) => this.startDrag(e), { passive: true });
        
        document.addEventListener('mousemove', (e) => this.onDrag(e));
        document.addEventListener('touchmove', (e) => this.onDrag(e), { passive: false });
        
        document.addEventListener('mouseup', () => this.stopDrag());
        document.addEventListener('touchend', () => this.stopDrag());
        
        // Keyboard arrow keys
        this.slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.adjustSlider(-5);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.adjustSlider(5);
            }
        });
        
        // Click on viewer to move slider
        this.viewer.addEventListener('click', (e) => {
            if (e.target.closest('.code-slider-handle')) return;
            const rect = this.viewer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            this.setSliderPosition(percentage);
        });
    }

    open(data) {
        if (!data || !data.before || !data.after) {
            console.error('Invalid code comparison data');
            return;
        }
        
        this.currentData = data;
        this.isOpen = true;
        
        // Store previously focused element to restore later
        this.previouslyFocusedElement = document.activeElement;
        
        // Update content
        this.updateContent(data);
        
        // Show modal with animation
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Reset slider to center
        this.setSliderPosition(50);
        
        // Focus the slider for keyboard access
        setTimeout(() => this.slider.focus(), 100);
        
        console.log('[CodeComparisonModal] Opened successfully');
    }

    close() {
        this.isOpen = false;
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Restore focus to previously focused element
        if (this.previouslyFocusedElement && this.previouslyFocusedElement.focus) {
            this.previouslyFocusedElement.focus();
        }
        
        console.log('[CodeComparisonModal] Closed');
    }

    updateContent(data) {
        // Update titles and badges
        const beforeTitle = this.modal.querySelector('.code-before .code-panel-title');
        const afterTitle = this.modal.querySelector('.code-after .code-panel-title');
        const beforeBadge = this.modal.querySelector('.code-before .code-panel-badge');
        const afterBadge = this.modal.querySelector('.code-after .code-panel-badge');
        
        beforeTitle.textContent = data.before.title || 'Before';
        afterTitle.textContent = data.after.title || 'After';
        beforeBadge.textContent = data.before.badge || 'OLD';
        afterBadge.textContent = data.after.badge || 'NEW';
        
        // Update code blocks
        const beforeCode = this.modal.querySelector('.code-before .code-block');
        const afterCode = this.modal.querySelector('.code-after .code-block');
        
        beforeCode.textContent = data.before.code;
        afterCode.textContent = data.after.code;
        
        // Apply syntax highlighting if available
        if (window.Prism) {
            Prism.highlightElement(beforeCode);
            Prism.highlightElement(afterCode);
        }
    }

    startDrag(e) {
        this.isDragging = true;
        this.slider.classList.add('dragging');
        this.sliderContainer.classList.add('dragging');
        e.stopPropagation();
    }

    stopDrag() {
        if (this.isDragging) {
            this.isDragging = false;
            this.slider.classList.remove('dragging');
            this.sliderContainer.classList.remove('dragging');
        }
    }

    onDrag(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const rect = this.viewer.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        
        this.setSliderPosition(percentage);
    }

    adjustSlider(delta) {
        const newPosition = Math.max(0, Math.min(100, this.sliderPosition + delta));
        this.setSliderPosition(newPosition);
    }

    setSliderPosition(percentage) {
        this.sliderPosition = percentage;
        
        // Update slider visual position
        this.sliderContainer.style.left = `${percentage}%`;
        
        // Update clip-path for before panel (only clip the "before" panel)
        // The "after" panel is always fully visible underneath
        const beforePanel = this.modal.querySelector('.code-before');
        
        // Before panel shows from left edge to slider position
        beforePanel.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
        
        // Update ARIA value
        this.slider.setAttribute('aria-valuenow', Math.round(percentage));
    }
}

// Create global instance
window.codeComparisonModal = new CodeComparisonModal();
