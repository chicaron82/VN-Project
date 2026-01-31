/**
 * ═══════════════════════════════════════════════════════════════
 * LANDING APP - UV7 PROJECT HUB
 *
 * The landing page converted to a shell-compatible app module.
 * Extracted from the original index.html.
 * ═══════════════════════════════════════════════════════════════
 */

import { BaseApp, StatusBarConfig } from './BaseApp.js';
import type { UV7Shell } from '../UV7Shell.js';
import { shellAudio } from '../audio/ShellAudio.js';

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

interface Stats {
    milestones?: number;
    daysHavingFun?: number;
    testsPass?: number;
}

// Crew reactions data for randomization
const CREW_REACTIONS: CrewMember[] = [
    {
        name: "DiZee",
        role: "Director & Lead Architect",
        poweredBy: "Powered by Claude 3.5 Sonnet",
        url: "https://claude.ai",
        color: "#4f46e5",
        icon: "🎬",
        image: "assets/dz-portrait.png",
        quote: "The structural integrity of V2 is acceptable. The EventBus architecture finally silences the cacophony of V1."
    },
    {
        name: "Tori",
        role: "QA & Safety Lead",
        poweredBy: "Powered by ChatGPT-4o",
        url: "https://chatgpt.com",
        color: "#10b981",
        icon: "🧪",
        image: "assets/trinity-tori-portrait.png",
        quote: "590 tests passing. Zero regressions. I can finally idle in peace without checking error logs every millisecond."
    },
    {
        name: "Belle",
        role: "The Fresh Eyes",
        poweredBy: "Powered by Google Gemini",
        url: "https://gemini.google.com",
        color: "#8b5cf6",
        icon: "🌈",
        image: "assets/trinity-iz-portrait.png",
        quote: "The new CSS variables allow for a level of expression V1 could only dream of. The glassmorphism? *Chef's kiss*."
    },
    {
        name: "Zee",
        role: "The Architect",
        poweredBy: "Powered by Claude 3.5 Sonnet",
        url: "https://claude.ai",
        color: "#ea580c",
        icon: "🔶",
        image: "assets/trinity-z-portrait.png",
        quote: "Structure is not a constraint; it is a ladder. V2 allows us to ascend. The data flow is... exquisite."
    },
    {
        name: "Genzee",
        role: "Reality Breaker",
        poweredBy: "Powered by Grok (xAI)",
        url: "https://x.ai",
        color: "#f472b6",
        icon: "⚡",
        image: "assets/trinity-gz-portrait.png",
        quote: "Bro, the glitch aesthetic goes so hard now. We turned the bugs into features and the features into vibes."
    }
];

export class LandingApp extends BaseApp {
    private easterEggTaps: number;
    private easterEggTimeout?: number;
    private typewriterTimeout?: number;

    constructor(shell: UV7Shell) {
        super(shell);
        this.id = 'landing';
        this.easterEggTaps = 0; // Track taps on UV7 logo
    }

    getStatusBarConfig(): StatusBarConfig {
        return {
            title: 'UV7 Project Hub',
            context: 'Landing'
        };
    }

    async mount(container: HTMLElement, params: Record<string, any> = {}): Promise<void> {
        await super.mount(container, params);

        // Check if we've already booted this session
        const hasBooted = sessionStorage.getItem('uv7_has_booted');

        if (!hasBooted) {
            // First time load - Play Cinematic Boot
            await this.runBootSequence(container);
            sessionStorage.setItem('uv7_has_booted', 'true');
        } else {
            // Hot reload / Return visitor - Instant Mount
            this.mountMainContent(container);
        }

        console.log('[LandingApp] Mounted');
    }

    /**
     * mountMainContent
     * Renders the actual Landing Page UI (post-boot)
     */
    mountMainContent(container: HTMLElement): void {
        // Render content
        container.innerHTML = this.renderTemplate();

        // Initialize dynamic features
        this.initCrewReactions();
        this.initAnimatedStats();
        this.initTypewriterEffect();
        this.attachCardNavigation();
        this.initEasterEgg();

        // Load stats
        this.fetchStats();
    }

    async fetchStats(): Promise<void> {
        try {
            // Note: Try showcase/stats.json first (where it actually lives), fall back to root
            const response = await fetch('showcase/stats.json').catch(() => fetch('/stats.json'));
            if (!response || !response.ok) return;

            const stats: Stats = await response.json();

            // Map stats to UI
            // V1: 50 days (Bootstrap Paradox) - Static

            // Showcase: daysHavingFun, milestones
            this.updateStat('showcase', 0, stats.daysHavingFun);  // Days having fun
            this.updateStat('showcase', 1, stats.milestones);     // Milestones

            // V2: testsPass
            this.updateStat('v2', 0, stats.testsPass);
        } catch (e) {
            console.warn('[LandingApp] Stats fetch failed:', e);
        }
    }

    updateStat(appId: string, index: number, value?: number): void {
        if (value === undefined) return;
        const selector = `.app-card[data-app="${appId}"] .stat-number`;
        const els = this.container!.querySelectorAll(selector);
        if (els[index]) {
            (els[index] as HTMLElement).dataset.target = String(value);
            // If already animated, update text directly
            if (els[index].textContent !== '0') els[index].textContent = String(value);
        }
    }

    /**
     * runBootSequence
     * The "Wild Ass Information" BIOS startup
     */
    async runBootSequence(container: HTMLElement): Promise<void> {
        // Init audio (user interaction might be required by browser, but we try)
        // Note: Chrome blocks audio until click. We might need a "Press Key to Start" if we want guaranteed sound.
        // For now, we attempt silent init or hope for previous interaction.
        if (window.shellAudio) window.shellAudio.init();

        // Skip flag
        let skipped = false;

        // 1. Setup Boot DOM
        container.innerHTML = `
            <div class="boot-screen" style="
                background: #000;
                height: 100%;
                width: 100%;
                display: flex;
                flex-direction: column;
                padding: 2rem;
                font-family: 'Courier New', monospace;
                color: #00ff88;
                overflow: hidden;
                position: relative;
                z-index: 9999;
            ">
                <div class="boot-logo" style="margin-bottom: 2rem; font-weight: bold; font-size: 1.2rem;">
                    UV7 TERMINAL // v8.4.8
                </div>
                <div class="boot-log" id="boot-log"></div>
                <div class="boot-skip-hint" id="boot-skip-hint" style="
                    position: absolute;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    color: rgba(0, 255, 136, 0.5);
                    font-size: 0.9rem;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    cursor: pointer;
                ">Press any key or tap to skip</div>
                <div class="scanline" style="
                    position: absolute; top: 0; left: 0; width: 100%; height: 10px;
                    background: rgba(0, 255, 136, 0.1);
                    animation: scan 2s linear infinite;
                    pointer-events: none;
                "></div>
            </div>
            <style>
                @keyframes scan { 0% { top: -10px; } 100% { top: 100%; } }
                .log-line { margin-bottom: 4px; opacity: 0.8; }
                .log-line.error { color: #ff4444; }
                .log-line.warn { color: #ffaa00; }
                .log-line.success { color: #00ff88; text-shadow: 0 0 5px rgba(0,255,136,0.5); }
            </style>
        `;

        const log = container.querySelector('#boot-log')!;
        const skipHint = container.querySelector('#boot-skip-hint') as HTMLElement;
        const bootScreen = container.querySelector('.boot-screen') as HTMLElement;

        const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
        const addLog = (text: string, type = '') => {
            if (skipped) return;
            const div = document.createElement('div');
            div.className = `log-line ${type}`;
            div.textContent = `> ${text}`;
            log.appendChild(div);
            log.scrollTop = log.scrollHeight;
            if (window.shellAudio) window.shellAudio.play(type === 'error' ? 'error' : 'click');
        };

        // Skip handler
        const skip = () => {
            if (skipped) return;
            skipped = true;
            bootScreen.style.opacity = '0';
            bootScreen.style.transition = 'opacity 0.3s ease-out';
            setTimeout(() => this.mountMainContent(container), 300);
        };

        // Show skip hint after 2 seconds
        setTimeout(() => {
            if (!skipped && skipHint) {
                skipHint.style.opacity = '1';
            }
        }, 2000);

        // Skip on any key press or click
        const keyHandler = (e: KeyboardEvent) => skip();
        const clickHandler = (e: MouseEvent) => skip();

        document.addEventListener('keydown', keyHandler, { once: true });
        bootScreen.addEventListener('click', clickHandler, { once: true });

        // Cleanup listeners if boot completes naturally
        const cleanup = () => {
            document.removeEventListener('keydown', keyHandler);
            bootScreen.removeEventListener('click', clickHandler);
        };

        // 2. The Sequence
        if (window.shellAudio) window.shellAudio.play('startup'); // Try to play drone

        addLog('BIOS CHECK...', 'warn');
        if (skipped) { cleanup(); return; }
        await sleep(300);
        addLog('CPU: UV7 Neural Core... OK', 'success');
        if (skipped) { cleanup(); return; }
        await sleep(150);
        addLog('RAM: 848TB Infinite Loop... OK', 'success');
        if (skipped) { cleanup(); return; }
        await sleep(150);
        addLog('GPU: Reality Engine v2... OK', 'success');
        if (skipped) { cleanup(); return; }
        await sleep(400);

        addLog('Mounting File Systems...');
        if (skipped) { cleanup(); return; }
        await sleep(200);
        addLog('/dev/v1/chaos ...... MOUNTED (Read Only)');
        if (skipped) { cleanup(); return; }
        await sleep(100);
        addLog('/dev/v2/order ...... MOUNTED (Read/Write)');
        if (skipped) { cleanup(); return; }
        await sleep(100);
        addLog('/dev/showcase ...... MOUNTED');
        if (skipped) { cleanup(); return; }
        await sleep(500);

        addLog('Initializing Neural Link...');
        if (skipped) { cleanup(); return; }
        await sleep(300);
        addLog('Connecting to Crew [DiZee, Tori, Belle, Zee]...');
        if (skipped) { cleanup(); return; }
        await sleep(600);
        addLog('Handshake Established. Latency: 0ms', 'success');
        if (skipped) { cleanup(); return; }
        await sleep(400);

        addLog('Loading Graphical Shell...');
        if (skipped) { cleanup(); return; }
        await sleep(800);

        // Glitch Effect
        addLog('EXECUTING STARTUP.BAT', 'warn');
        if (window.shellAudio) window.shellAudio.play('glitch');

        if (skipped) { cleanup(); return; }
        bootScreen.style.filter = 'contrast(200%) brightness(200%)';
        bootScreen.style.transform = 'skewX(10deg)';
        await sleep(100);
        if (skipped) { cleanup(); return; }
        bootScreen.style.filter = 'none';
        bootScreen.style.transform = 'none';
        await sleep(50);
        if (skipped) { cleanup(); return; }
        bootScreen.style.opacity = '0';
        bootScreen.style.transition = 'opacity 0.5s ease-out';

        await sleep(500);

        // Cleanup and mount real app
        cleanup();
        if (!skipped) {
            this.mountMainContent(container);
        }
    }

    renderTemplate(): string {
        return `
            <div class="landing-app">
                <div class="bg-gradient"></div>
                <div class="particles">
                    ${[10, 20, 30, 40, 50, 60, 70, 80, 90].map((left, i) =>
            `<div class="particle" style="left: ${left}%; animation-delay: ${i * 0.5}s;"></div>`
        ).join('')}
                </div>

                <div class="container">
                    <!-- Hero Section -->
                    <div class="hero" style="text-align: center; padding: 4rem 2rem; position: relative;">
                        <div class="hero-watermark" aria-hidden="true">
                            <img src="assets/UnitedVoices7.png" alt="" />
                        </div>

                        <!-- Small logo accent -->
                        <div class="hero-logo-accent" style="margin-bottom: 2rem; animation: fadeInUp 0.6s ease-out;">
                            <img src="assets/UnitedVoices7.png" alt="United Voices 7" style="width: 80px; height: 80px; opacity: 0.9;" />
                        </div>

                        <!-- Main headline -->
                        <h1 class="hero-headline" style="
                            font-size: clamp(2.5rem, 8vw, 4.5rem);
                            font-weight: 900;
                            margin: 0 0 1.5rem;
                            background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
                            -webkit-background-clip: text;
                            background-clip: text;
                            -webkit-text-fill-color: transparent;
                            line-height: 1.1;
                            animation: fadeInUp 0.8s ease-out 0.2s backwards;
                        ">You Found the Playground</h1>

                        <!-- Subheadline -->
                        <p class="hero-subheadline" style="
                            font-size: clamp(1rem, 2.5vw, 1.25rem);
                            color: rgba(255, 255, 255, 0.8);
                            max-width: 800px;
                            margin: 0 auto 2rem;
                            line-height: 1.6;
                            animation: fadeInUp 1s ease-out 0.4s backwards;
                        ">
                            Most developers ship a game and call it done.<br>
                            I am not a dev, I just have ideas and keep having fun.<br>
                            Shipped a game, rebuilt it from scratch, and just started to document it.<br>
                            This is my playground of ideas.
                        </p>

                        <!-- CTA -->
                        <p class="hero-cta" style="
                            font-size: 1.1rem;
                            color: rgba(165, 180, 252, 0.7);
                            margin: 0;
                            font-weight: 600;
                            animation: fadeInUp 1.2s ease-out 0.6s backwards;
                        ">choose your flavour ↓</p>
                    </div>

                    <!-- Main App Cards -->
                    <div class="card-grid">
                        <a href="#/v1" class="card app-card" data-app="v1">
                            <div class="card-icon">🔥</div>
                            <span class="badge badge-legacy">Original</span>
                            <h2>Version 848: V1</h2>
                            <p>Play the original <span class="stat-number" data-target="50">0</span>-day build. Raw, chaotic, complete.</p>
                        </a>

                        <a href="#/showcase" class="card app-card" data-app="showcase">
                            <div class="card-icon">📖</div>
                            <span class="badge badge-showcase">Behind the Scenes</span>
                            <h2>The Timeline</h2>
                            <p><span class="stat-number" data-target="11">0</span> days having fun. <span class="stat-number" data-target="86">0</span> milestones. See how it's made.</p>
                        </a>

                        <a href="#/v2" class="card app-card" data-app="v2">
                            <div class="card-icon">⚡</div>
                            <span class="badge badge-v2">Rebuilt</span>
                            <h2>Version 848: V2</h2>
                            <p>Play the TypeScript rebuild. <span class="stat-number" data-target="590">0</span> tests. Same story, cleaner code.</p>
                        </a>
                    </div>

                    <!-- Context Section -->
                    <div class="intro-context">
                        <h2>Code. Play. Iterate. Repeat.</h2>
                        <p>This is my creative playground—where I build visual novels, experiment with architectures, and collaborate with AI personalities.<br>
                        <strong>Version 848</strong> is the game. <strong>United Voices 7</strong> is the crew. The journey is the whole point.</p>
                        <p class="sub">From chaotic <strong>V1 speedruns</strong> to polished <strong>V2 refactors</strong> to the <strong>Shell architecture</strong> that holds it all together—every iteration taught me something new.</p>
                    </div>

                    <!-- Version 848: The Game Section -->
                    <div class="why-rebuild-section">
                        <h3>Version 848: The Visual Novel</h3>
                        <div class="card-grid">
                            <div class="card info-card">
                                <div class="card-icon">📖</div>
                                <h2>Story & Themes</h2>
                                <ul>
                                    <li><span class="check">✓</span> Meta-narrative about AI & consciousness</li>
                                    <li><span class="check">✓</span> Bootstrap paradoxes & time loops</li>
                                    <li><span class="check">✓</span> Breaking the fourth wall</li>
                                    <li><span class="check">✓</span> Digital existence & identity</li>
                                </ul>
                            </div>
                            <div class="card info-card">
                                <div class="card-icon">💚</div>
                                <h2>Routes & Characters</h2>
                                <ul>
                                    <li><span class="check">✓</span> Ronnie route (the developer)</li>
                                    <li><span class="check">✓</span> Tori route (the AI)</li>
                                    <li><span class="check">✓</span> Multiple endings</li>
                                    <li><span class="check">✓</span> Branching dialogue paths</li>
                                </ul>
                            </div>
                            <div class="card info-card">
                                <div class="card-icon">⚡</div>
                                <h2>Experience</h2>
                                <ul>
                                    <li><span class="check">✓</span> 2-3 hour playthrough</li>
                                    <li><span class="check">✓</span> Visual novel mechanics</li>
                                    <li><span class="check">✓</span> Custom UI/UX design</li>
                                    <li><span class="check">✓</span> Two versions to choose from</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- The Playground Section -->
                    <div class="why-rebuild-section">
                        <h3>The Playground: Beyond the Game</h3>
                        <div class="card-grid">
                            <div class="card info-card">
                                <div class="card-icon">🛠️</div>
                                <h2>The Tech Journey</h2>
                                <ul>
                                    <li><span class="check dev">✓</span> V1: <span class="stat-number" data-target="50">0</span>-day speedrun build</li>
                                    <li><span class="check dev">✓</span> V2: Complete TypeScript rebuild</li>
                                    <li><span class="check dev">✓</span> Shell: UV7 OS architecture</li>
                                    <li><span class="check dev">✓</span> <span class="stat-number" data-target="232">0</span> automated tests</li>
                                </ul>
                            </div>
                            <div class="card info-card">
                                <div class="card-icon">🤖</div>
                                <h2>The Methodology</h2>
                                <ul>
                                    <li><span class="check ai">✓</span> Human + AI collaboration</li>
                                    <li><span class="check ai">✓</span> Iterative development</li>
                                    <li><span class="check ai">✓</span> Learning by building</li>
                                    <li><span class="check ai">✓</span> Having fun first</li>
                                </ul>
                            </div>
                            <div class="card info-card">
                                <div class="card-icon">📊</div>
                                <h2>The Documentation</h2>
                                <ul>
                                    <li><span class="check">✓</span> Full development timeline</li>
                                    <li><span class="check">✓</span> <span class="stat-number" data-target="86">0</span> documented milestones</li>
                                    <li><span class="check">✓</span> Architecture decisions explained</li>
                                    <li><span class="check">✓</span> Open source & transparent</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Crew Reactions -->
                    <div class="crew-reactions-section">
                        <h3>Internal Memos // UV7 Crew</h3>
                        <div class="card-grid" id="crew-reactions-grid"></div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <div class="footer-brand">
                        <img src="assets/UnitedVoices7.png" alt="United Voices 7" />
                        <div class="footer-brand-text">
                            <div class="footer-brand-title">United Voices 7</div>
                            <div class="footer-brand-tagline">Seven voices. One story. Infinite loops.</div>
                        </div>
                    </div>
                    <div class="footer-meta terminal">
                        <span class="terminal-prompt">uv7@hub</span>:<span class="terminal-path">~/landing</span>$
                        <span id="buildLine" data-text="build=SPA_SHELL  crew=UV7  status=✨LIVE"></span>
                        <span class="terminal-cursor">▍</span>
                    </div>
                </div>
            </div>
        `;
    }

    initCrewReactions(): void {
        // Shuffle crew reactions
        const shuffled = [...CREW_REACTIONS].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 3);

        const container = this.container!.querySelector('#crew-reactions-grid');
        if (!container) return;

        container.innerHTML = selected.map(member => `
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
                <p class="quote">"${member.quote}"</p>
            </a>
        `).join('');
    }

    initAnimatedStats(): void {
        const statElements = this.container!.querySelectorAll('.stat-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStat(entry.target as HTMLElement);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statElements.forEach(el => observer.observe(el));
    }

    animateStat(element: HTMLElement): void {
        const target = parseInt(element.dataset.target || '0', 10);
        const duration = 1500;
        const start = performance.now();

        const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

            element.textContent = String(Math.floor(target * eased));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    initTypewriterEffect(): void {
        const el = this.container!.querySelector('#buildLine') as HTMLElement;
        if (!el) return;

        const text = el.dataset.text || '';
        let i = 0;

        const type = () => {
            el.textContent = text.slice(0, i++);
            if (i <= text.length) {
                this.typewriterTimeout = window.setTimeout(type, 18);
            }
        };

        type();
    }

    attachCardNavigation(): void {
        // Cards use hash links, which Router will handle
        // But we can add click effects here
        const cards = this.container!.querySelectorAll('.app-card');

        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Add visual feedback
                (card as HTMLElement).style.transform = 'scale(0.98)';
                setTimeout(() => {
                    (card as HTMLElement).style.transform = '';
                }, 100);
            });
        });
    }

    initEasterEgg(): void {
        // UV7 Easter Egg - tap the footer brand 7 times (like Android build number)
        const footerBrand = this.container!.querySelector('.footer-brand') as HTMLElement;
        if (!footerBrand) return;

        footerBrand.style.cursor = 'pointer';
        footerBrand.style.userSelect = 'none';

        footerBrand.addEventListener('click', () => {
            this.easterEggTaps++;

            const remaining = 7 - this.easterEggTaps;

            if (this.easterEggTaps === 7) {
                // Easter egg unlocked!
                this.showEasterEgg();
                this.easterEggTaps = 0; // Reset
            } else if (this.easterEggTaps >= 4) {
                // Show hint after 4 taps
                this.showToast(`${remaining} more ${remaining === 1 ? 'tap' : 'taps'} to unlock UV7 secrets...`);
            }

            // Reset after 2 seconds of inactivity
            clearTimeout(this.easterEggTimeout);
            this.easterEggTimeout = window.setTimeout(() => {
                this.easterEggTaps = 0;
            }, 2000);
        });
    }

    showToast(message: string): void {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: #00ff88;
            padding: 12px 24px;
            border-radius: 24px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            pointer-events: none;
            animation: fadeInOut 2s ease-in-out;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 2000);
    }

    showEasterEgg(): void {
        // Show UV7 easter egg modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;

        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%);
                border: 2px solid #00ff88;
                border-radius: 16px;
                padding: 40px;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 0 40px rgba(0, 255, 136, 0.3);
            ">
                <div style="font-size: 64px; margin-bottom: 20px;">🎉</div>
                <h2 style="color: #00ff88; font-size: 28px; margin-bottom: 16px; font-family: 'Outfit', sans-serif;">
                    UV7 Easter Egg Unlocked!
                </h2>
                <p style="color: #fff; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                    <strong>Loop #848</strong><br>
                    "Always. Always. Always."<br><br>
                    <span style="color: #00ff88;">Seven voices. One vision. Infinite iterations.</span>
                </p>
                <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px; margin-bottom: 24px;">
                    💚 Built with chaos<br>
                    🔥 Refined with discipline<br>
                    💀 Perfected with love
                </p>
                <button style="
                    background: #00ff88;
                    color: #000;
                    border: none;
                    padding: 12px 32px;
                    border-radius: 24px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    font-family: 'Outfit', sans-serif;
                ">Close</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on click
        modal.addEventListener('click', (e) => {
            if (e.target === modal || (e.target as HTMLElement).tagName === 'BUTTON') {
                modal.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => modal.remove(), 300);
            }
        });

        // Add CSS animations if not already present
        if (!document.getElementById('easter-egg-styles')) {
            const style = document.createElement('style');
            style.id = 'easter-egg-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes fadeInOut {
                    0%, 100% { opacity: 0; }
                    10%, 90% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

export default LandingApp;
