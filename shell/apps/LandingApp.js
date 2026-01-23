/**
 * ═══════════════════════════════════════════════════════════════
 * LANDING APP - UV7 PROJECT HUB
 * 
 * The landing page converted to a shell-compatible app module.
 * Extracted from the original index.html.
 * ═══════════════════════════════════════════════════════════════
 */

import { BaseApp } from './BaseApp.js';

// Crew reactions data for randomization
const CREW_REACTIONS = [
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
    constructor(shell) {
        super(shell);
        this.id = 'landing';
    }

    getStatusBarConfig() {
        return {
            title: 'UV7 Project Hub',
            context: 'Landing'
        };
    }

    async mount(container, params = {}) {
        await super.mount(container, params);

        // Render content
        container.innerHTML = this.renderTemplate();

        // Initialize dynamic features
        this.initCrewReactions();
        this.initAnimatedStats();
        this.initTypewriterEffect();
        this.attachCardNavigation();

        console.log('[LandingApp] Mounted');
    }

    async unmount() {
        // Clean up any intervals/timeouts
        if (this.typewriterTimeout) {
            clearTimeout(this.typewriterTimeout);
        }
        await super.unmount();
    }

    renderTemplate() {
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
                    <div class="hero">
                        <div class="hero-watermark" aria-hidden="true">
                            <img src="assets/UnitedVoices7.png" alt="" />
                        </div>
                        
                        <div class="brand-hero-container">
                            <div class="brand-glow"></div>
                            <img src="assets/UnitedVoices7.png" alt="United Voices 7" class="main-brand-logo">
                        </div>
                        
                        <p class="brand-tagline">Where chaos meets harmony. Choose your experience.</p>
                    </div>
                    
                    <!-- Main App Cards -->
                    <div class="card-grid">
                        <a href="#/v1" class="card app-card" data-app="v1">
                            <div class="card-icon">🔥</div>
                            <span class="badge badge-legacy">Legacy V1</span>
                            <h2>Play Original</h2>
                            <p>A <span class="stat-number" data-target="50">0</span>-day speedrun from concept to complete game. Version 848.</p>
                        </a>
                        
                        <a href="#/showcase" class="card app-card" data-app="showcase">
                            <div class="card-icon">📖</div>
                            <span class="badge badge-showcase">Documentation</span>
                            <h2>View Showcase</h2>
                            <p>The journey from chaos to order. <span class="stat-number" data-target="86">0</span> phases. <span class="stat-number" data-target="11">0</span> days. AI collaboration.</p>
                        </a>
                        
                        <a href="#/v2" class="card app-card" data-app="v2">
                            <div class="card-icon">⚡</div>
                            <span class="badge badge-v2">V2 Engine</span>
                            <h2>Launch V2</h2>
                            <p>TypeScript rebuild. EventBus architecture. <span class="stat-number" data-target="590">0</span> tests passing. Zero errors.</p>
                        </a>
                    </div>
                    
                    <!-- Context Section -->
                    <div class="intro-context">
                        <h2>United Voices 7 presents: Version 848</h2>
                        <p><strong>United Voices 7</strong> is the mock production studio—a collective of AI personalities collaborating with one human developer.<br>
                        <strong>Version 848</strong> is the visual novel itself.</p>
                        <p class="sub">This hub documents the journey from the chaotic <strong>V1 Speedrun</strong> to the refined architectural dish that is <strong>V2</strong>.</p>
                    </div>
                    
                    <!-- Why Rebuild Section -->
                    <div class="why-rebuild-section">
                        <h3>Why Rebuild from Scratch?</h3>
                        <div class="card-grid">
                            <div class="card info-card">
                                <div class="card-icon">🚀</div>
                                <h2>For Players</h2>
                                <ul>
                                    <li><span class="check">✓</span> <span class="stat-number" data-target="3">0</span>x faster loading</li>
                                    <li><span class="check">✓</span> Smoother animations</li>
                                    <li><span class="check">✓</span> Mobile-optimized</li>
                                    <li><span class="check">✓</span> Fewer bugs</li>
                                </ul>
                            </div>
                            <div class="card info-card">
                                <div class="card-icon">🛠️</div>
                                <h2>For Developers</h2>
                                <ul>
                                    <li><span class="check dev">✓</span> TypeScript safety</li>
                                    <li><span class="check dev">✓</span> <span class="stat-number" data-target="232">0</span> automated tests</li>
                                    <li><span class="check dev">✓</span> Clean architecture</li>
                                    <li><span class="check dev">✓</span> Easy to maintain</li>
                                </ul>
                            </div>
                            <div class="card info-card">
                                <div class="card-icon">📚</div>
                                <h2>For AI Collaboration</h2>
                                <ul>
                                    <li><span class="check ai">✓</span> Proof of concept</li>
                                    <li><span class="check ai">✓</span> Documented process</li>
                                    <li><span class="check ai">✓</span> Replicable workflow</li>
                                    <li><span class="check ai">✓</span> Open source</li>
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

    initCrewReactions() {
        // Shuffle crew reactions
        const shuffled = [...CREW_REACTIONS].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 3);

        const container = this.container.querySelector('#crew-reactions-grid');
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

    initAnimatedStats() {
        const statElements = this.container.querySelectorAll('.stat-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStat(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statElements.forEach(el => observer.observe(el));
    }

    animateStat(element) {
        const target = parseInt(element.dataset.target, 10);
        const duration = 1500;
        const start = performance.now();

        const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

            element.textContent = Math.floor(target * eased);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    initTypewriterEffect() {
        const el = this.container.querySelector('#buildLine');
        if (!el) return;

        const text = el.dataset.text || '';
        let i = 0;

        const type = () => {
            el.textContent = text.slice(0, i++);
            if (i <= text.length) {
                this.typewriterTimeout = setTimeout(type, 18);
            }
        };

        type();
    }

    attachCardNavigation() {
        // Cards use hash links, which Router will handle
        // But we can add click effects here
        const cards = this.container.querySelectorAll('.app-card');

        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Add visual feedback
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 100);
            });
        });
    }
}

export default LandingApp;
