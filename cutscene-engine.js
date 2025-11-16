// ========================================
// CUTSCENE ENGINE FOR VERSION 848
// CSS + JS Animation System
// FIXED: Properly hides canvas when not playing
// ========================================

class CutsceneEngine {
    constructor(game) {
        this.game = game;
        this.isPlaying = false;
        this.currentCutscene = null;
        this.skipEnabled = false;
        
        // Create cutscene container
        this.createCutsceneContainer();
        
        // Bind skip handler
        this.setupSkipHandler();
    }
    
    createCutsceneContainer() {
        // Use existing cutscene-container from HTML or create if missing
        let container = document.getElementById('cutscene-container');
        
        if (!container) {
            // Create the cutscene overlay if it doesn't exist
            container = document.createElement('div');
            container.id = 'cutscene-container';
            container.innerHTML = `
                <div id="cutscene-canvas"></div>
                <div id="cutscene-skip-hint">Press SPACE to skip</div>
            `;
            document.body.appendChild(container);
        }
        
        // CRITICAL: Ensure container is hidden by default
        container.style.display = 'none';
        container.style.pointerEvents = 'none';
        
        // CRITICAL: Ensure canvas is hidden by default
        const canvas = document.getElementById('cutscene-canvas');
        if (canvas) {
            canvas.style.display = 'none';
            canvas.style.pointerEvents = 'none';
        }
    }
    
    setupSkipHandler() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.isPlaying && this.skipEnabled) {
                this.skipCutscene();
            }
        });
    }
    
    // ========================================
    // CUTSCENE 1: THE FALL (Prologue Opening)
    // ========================================
    
    playTheFall(onComplete) {
        this.startCutscene();
        const canvas = document.getElementById('cutscene-canvas');
        
        canvas.innerHTML = `
            <div class="cutscene-bg hospital-hallway"></div>
            <div class="cs-tori standing" id="cs-tori"></div>
            <div class="cs-tamagotchi" id="cs-tama"></div>
            <div class="cs-flash" id="cs-flash"></div>
            <div class="cs-glitch-overlay" id="cs-glitch"></div>
        `;
        
        const tori = document.getElementById('cs-tori');
        const tama = document.getElementById('cs-tama');
        const flash = document.getElementById('cs-flash');
        const glitch = document.getElementById('cs-glitch');
        const bg = canvas.querySelector('.cutscene-bg');
        
        // Animation sequence
        const sequence = [
            // 1. Slow zoom on background
            { time: 0, action: () => bg.classList.add('zoom-slow') },
            
            // 2. Tori standing (already visible)
            { time: 1000, action: () => tori.classList.add('visible') },
            
            // 3. Tori falls (swap sprite class)
            { time: 3000, action: () => {
                tori.classList.remove('standing');
                tori.classList.add('falling');
            }},
            
            // 4. Tamagotchi drops and spins
            { time: 3200, action: () => {
                tama.classList.add('dropping', 'spinning');
            }},
            
            // 5. Flash effect on impact
            { time: 4500, action: () => {
                flash.classList.add('impact-flash');
            }},
            
            // 6. Glitch transition to void
            { time: 5000, action: () => {
                glitch.classList.add('active');
                bg.classList.add('fade-to-void');
            }},
            
            // 7. Complete
            { time: 6500, action: () => {
                this.endCutscene(onComplete);
            }}
        ];
        
        this.runSequence(sequence);
        this.enableSkipAfter(2000); // Allow skip after 2 seconds
    }
    
    // ========================================
    // CUTSCENE 2: FIRST CONTACT (Act 1)
    // ========================================
    
    playFirstContact(onComplete) {
        this.startCutscene();
        const canvas = document.getElementById('cutscene-canvas');
        
        canvas.innerHTML = `
            <div class="cutscene-bg black-screen"></div>
            <div class="cs-text-line" id="cs-text">System initializing...</div>
            <div class="cs-ronnie-face pixelated" id="cs-ronnie"></div>
            <div class="cs-tether-vis" id="cs-tether"></div>
        `;
        
        const bg = canvas.querySelector('.cutscene-bg');
        const text = document.getElementById('cs-text');
        const ronnie = document.getElementById('cs-ronnie');
        const tether = document.getElementById('cs-tether');
        
        // Animation sequence
        const sequence = [
            // 1. Black screen (already set)
            { time: 0, action: () => {} },
            
            // 2. Text appearing letter-by-letter
            { time: 1000, action: () => {
                this.typewriterText(text, 'Connection established...', 50);
            }},
            
            // 3. Screen flickers to life
            { time: 3000, action: () => {
                bg.classList.add('flicker');
            }},
            
            // 4. Ronnie's face appears pixelated
            { time: 4000, action: () => {
                ronnie.classList.add('visible');
            }},
            
            // 5. Gradually sharpens into focus
            { time: 5000, action: () => {
                ronnie.classList.remove('pixelated');
                ronnie.classList.add('sharpening');
            }},
            
            // 6. Tether visualization appears
            { time: 6500, action: () => {
                tether.classList.add('visible', 'pulsing');
            }},
            
            // 7. Complete
            { time: 8000, action: () => {
                this.endCutscene(onComplete);
            }}
        ];
        
        this.runSequence(sequence);
        this.enableSkipAfter(2000);
    }
    
    // ========================================
    // CUTSCENE 3: BODY ANCHOR DISCOVERY (Act 2)
    // ========================================
    
    playBodyAnchorDiscovery(onComplete) {
        this.startCutscene();
        const canvas = document.getElementById('cutscene-canvas');
        
        canvas.innerHTML = `
            <div class="cs-split-screen">
                <div class="cs-split-left">
                    <div class="cs-physical-tori" id="cs-physical"></div>
                    <div class="cs-heartbeat-pulse" id="cs-pulse"></div>
                </div>
                <div class="cs-split-right">
                    <div class="cs-digital-tori" id="cs-digital"></div>
                    <div class="cs-echo-voices" id="cs-echoes">
                        <div class="echo-particle"></div>
                        <div class="echo-particle"></div>
                        <div class="echo-particle"></div>
                    </div>
                </div>
            </div>
            <div class="cs-tamagotchi center" id="cs-tama"></div>
            <div class="cs-light-beam" id="cs-beam"></div>
            <div class="cs-realization-flash" id="cs-realize"></div>
        `;
        
        const physical = document.getElementById('cs-physical');
        const digital = document.getElementById('cs-digital');
        const pulse = document.getElementById('cs-pulse');
        const tama = document.getElementById('cs-tama');
        const beam = document.getElementById('cs-beam');
        const echoes = document.getElementById('cs-echoes');
        const realize = document.getElementById('cs-realize');
        
        // Animation sequence
        const sequence = [
            // 1. Split screen appears
            { time: 0, action: () => {
                physical.classList.add('visible');
                digital.classList.add('visible');
            }},
            
            // 2. Heartbeat pulse animation
            { time: 1000, action: () => {
                pulse.classList.add('pulsing');
            }},
            
            // 3. Tamagotchi syncs to pulse
            { time: 2500, action: () => {
                tama.classList.add('visible', 'syncing');
            }},
            
            // 4. Light beam connecting body to device
            { time: 4000, action: () => {
                beam.classList.add('visible', 'connecting');
            }},
            
            // 5. Echo voices swirling around
            { time: 5000, action: () => {
                echoes.classList.add('swirling');
            }},
            
            // 6. Realization flash
            { time: 6500, action: () => {
                realize.classList.add('flash');
            }},
            
            // 7. Complete
            { time: 8000, action: () => {
                this.endCutscene(onComplete);
            }}
        ];
        
        this.runSequence(sequence);
        this.enableSkipAfter(2000);
    }
    
    // ========================================
    // CUTSCENE 4: THE TRANSFER (True Ending)
    // ========================================
    
    playTheTransfer(onComplete) {
        this.startCutscene();
        const canvas = document.getElementById('cutscene-canvas');
        
        canvas.innerHTML = `
            <div class="cutscene-bg digital-void"></div>
            <div class="cs-fragments-container" id="cs-fragments"></div>
            <div class="cs-particle-stream" id="cs-stream"></div>
            <div class="cs-tamagotchi center" id="cs-tama"></div>
            <div class="cs-tori-body" id="cs-body"></div>
            <div class="cs-tether-meter" id="cs-meter">
                <div class="meter-fill" id="cs-meter-fill"></div>
            </div>
            <div class="cs-glitch-overlay decreasing" id="cs-glitch"></div>
            <div class="cs-white-flash" id="cs-white"></div>
            <div class="cs-eyes" id="cs-eyes">
                <div class="eye left"></div>
                <div class="eye right"></div>
            </div>
        `;
        
        const fragments = document.getElementById('cs-fragments');
        const stream = document.getElementById('cs-stream');
        const tama = document.getElementById('cs-tama');
        const body = document.getElementById('cs-body');
        const meter = document.getElementById('cs-meter');
        const meterFill = document.getElementById('cs-meter-fill');
        const glitch = document.getElementById('cs-glitch');
        const whiteFlash = document.getElementById('cs-white');
        const eyes = document.getElementById('cs-eyes');
        
        // Create fragment particles
        for (let i = 0; i < 20; i++) {
            const fragment = document.createElement('div');
            fragment.className = 'cs-fragment';
            fragments.appendChild(fragment);
        }
        
        // Animation sequence
        const sequence = [
            // 1. Digital fragments appear and flow
            { time: 0, action: () => {
                fragments.classList.add('flowing');
            }},
            
            // 2. Device and body visible
            { time: 500, action: () => {
                tama.classList.add('visible', 'active');
                body.classList.add('visible');
            }},
            
            // 3. Particle stream from device to body
            { time: 1500, action: () => {
                stream.classList.add('visible', 'transferring');
            }},
            
            // 4. Tether meter rising
            { time: 2000, action: () => {
                meter.classList.add('visible');
                this.animateMeterFill(meterFill, 0, 100, 3000);
            }},
            
            // 5. Glitch effects decreasing
            { time: 2500, action: () => {
                glitch.classList.add('fading');
            }},
            
            // 6. Final flash of white
            { time: 5500, action: () => {
                whiteFlash.classList.add('flash');
            }},
            
            // 7. Eyes opening with blink
            { time: 6500, action: () => {
                eyes.classList.add('visible');
                setTimeout(() => eyes.classList.add('blink'), 500);
            }},
            
            // 8. Complete
            { time: 8000, action: () => {
                this.endCutscene(onComplete);
            }}
        ];
        
        this.runSequence(sequence);
        this.enableSkipAfter(3000); // Longer skip delay for ending
    }
    
    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    
    startCutscene() {
        this.isPlaying = true;
        this.skipEnabled = false;
        
        const container = document.getElementById('cutscene-container');
        const canvas = document.getElementById('cutscene-canvas');
        
        // Show both container and canvas
        container.classList.add('active');
        container.style.display = 'block';
        container.style.pointerEvents = 'auto';
        
        canvas.style.display = 'block';
        canvas.style.pointerEvents = 'auto';
        
        // Hide game UI
        if (this.game.gameView) {
            this.game.gameView.style.opacity = '0';
        }
    }
    
    endCutscene(onComplete) {
        this.isPlaying = false;
        this.skipEnabled = false;
        
        const container = document.getElementById('cutscene-container');
        const canvas = document.getElementById('cutscene-canvas');
        
        container.classList.add('fade-out');
        
        setTimeout(() => {
            // CRITICAL: Hide both container and canvas
            container.classList.remove('active', 'fade-out');
            container.style.display = 'none';
            container.style.pointerEvents = 'none';
            
            canvas.style.display = 'none';
            canvas.style.pointerEvents = 'none';
            canvas.innerHTML = ''; // Clear content
            
            // Restore game UI
            if (this.game.gameView) {
                this.game.gameView.style.opacity = '1';
            }
            
            if (onComplete) onComplete();
        }, 1000);
    }
    
    skipCutscene() {
        if (!this.skipEnabled || !this.isPlaying) return;
        
        // Clear all timeouts
        if (this.currentSequence) {
            this.currentSequence.forEach(timeout => clearTimeout(timeout));
        }
        
        // Jump to end
        this.endCutscene(this.currentCallback);
    }
    
    enableSkipAfter(delay) {
        setTimeout(() => {
            this.skipEnabled = true;
            const skipHint = document.getElementById('cutscene-skip-hint');
            if (skipHint) {
                skipHint.classList.add('visible');
            }
        }, delay);
    }
    
    runSequence(sequence) {
        this.currentSequence = [];
        this.currentCallback = sequence[sequence.length - 1].action;
        
        sequence.forEach(step => {
            const timeout = setTimeout(step.action, step.time);
            this.currentSequence.push(timeout);
        });
    }
    
    typewriterText(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }
    
    animateMeterFill(element, start, end, duration) {
        const startTime = Date.now();
        
        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const value = start + (end - start) * progress;
            
            element.style.width = value + '%';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
}

// ========================================
// INTEGRATION HELPERS
// ========================================

// Add to GameEngine initialization:
// this.cutsceneEngine = new CutsceneEngine(this);

// Usage in routes:
// this.game.cutsceneEngine.playTheFall(() => this.continueStory());
