import { EventBus } from '../core/EventBus';

interface CodeDefinition {
    name: string;
    icon: string;
    description: string;
    code: string;
}

export class SecretCodesManager {
    private eventBus: EventBus;
    private discoveredCodes: Set<string>;
    private invalidResponses: string[];
    private lastResponseIndex: number = -1;

    // All discoverable codes (shown in UI)
    private readonly allCodes: CodeDefinition[] = [
        { code: 'torigatchi', name: 'The Reverse Door', icon: '🚪', description: 'Two versions of Tori. Choose your peace.' },
        { code: 'always3', name: 'Storm Dragon Signature', icon: '💚', description: '"Always. Always. Always." - Every time it appears.' },
        { code: 'uv7crew', name: 'Director\'s Cut', icon: '🎬', description: 'Extended crew statements. Behind the chaos.' },
        { code: 'chicharon', name: 'Dev Commentary', icon: '🎙️', description: 'Behind-the-scenes notes from the creator.' },
        { code: 'bootstrap', name: 'Loop Timeline', icon: '🔄', description: 'Visualize every attempt that led here.' },
        { code: 'echo', name: 'Voices of 847', icon: '👻', description: 'Compilation of all echo voice lines.' },
        { code: '848', name: 'True Attempt Number', icon: '🔢', description: 'Your actual loop count (including failures).' },
        { code: 'echobreak', name: 'Echo Silence', icon: '🔇', description: 'Disable Echo interruptions. The observers fall silent.' },
        { code: 'tetherlock', name: 'Tether Freeze', icon: '🔗', description: 'Lock tether at current level. Stop the decay.' },
        { code: 'saveanywhere', name: 'Cage Breaker', icon: '⚡', description: 'Bypass Act 1 save restriction. Despair\'s cage broken.' },
        { code: 'dizee', name: 'The Architect\'s Signature', icon: '🖤', description: 'Recognition for the one who built this world.' }
    ];

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.discoveredCodes = new Set();

        // Flavored invalid code responses
        this.invalidResponses = [
            "No signal on that frequency.",
            "Tori doesn't recognize that pattern.",
            "Echo not found.",
            "Connection failed. Try another sequence.",
            "Code corrupted. Signal unclear.",
            "That door remains locked.",
            "Access denied. Pattern unknown.",
            "The device stays silent.",
            "System doesn't respond to that input.",
            "Unknown cipher detected."
        ];

        // Load discovered codes from localStorage
        this.loadDiscoveredCodes();

        // Listen for code submissions
        this.eventBus.on('secret_code:submit', (data) => {
            this.submitCode(data.code);
        });
    }

    // ========================================
    // DISCOVERY TRACKING
    // ========================================

    private loadDiscoveredCodes() {
        const saved = localStorage.getItem('discoveredCodes');
        if (saved) {
            try {
                this.discoveredCodes = new Set(JSON.parse(saved));
                console.log(`Loaded ${this.discoveredCodes.size} discovered codes`);
            } catch (e) {
                console.error('Failed to load discovered codes:', e);
                this.discoveredCodes = new Set();
            }
        }
    }

    private saveDiscoveredCodes() {
        try {
            localStorage.setItem('discoveredCodes', JSON.stringify([...this.discoveredCodes]));
        } catch (e) {
            console.error('Failed to save discovered codes:', e);
        }
    }

    public hasDiscoveredCode(code: string): boolean {
        return this.discoveredCodes.has(code.toLowerCase());
    }

    private discoverCode(code: string) {
        if (this.discoveredCodes.has(code.toLowerCase())) {
            return; // Already discovered
        }

        this.discoveredCodes.add(code.toLowerCase());
        this.saveDiscoveredCodes();
        this.updateCodesUI();
        console.log(`🔓 Code discovered: ${code}`);
    }

    public getCodeCount(): number {
        return this.discoveredCodes.size;
    }

    // ========================================
    // CODE SUBMISSION & VALIDATION
    // ========================================

    public submitCode(code: string) {
        if (!code || code.trim() === '') {
            this.showMessage('Enter a code first.', 'error');
            return;
        }

        const normalizedCode = code.toLowerCase().trim();

        // Check if code is valid
        const codeData = this.allCodes.find(c => c.code === normalizedCode);

        if (codeData) {
            // Valid code!
            this.showCodeSuccess();
            this.discoverCode(normalizedCode);
            this.showMessage(`✨ CODE UNLOCKED: ${codeData.name}\n\n${codeData.description}`, 'success');

            // Emit event for code unlock (other systems can listen)
            this.eventBus.emit('secret_code:unlocked', { code: normalizedCode, name: codeData.name });
        } else {
            // Invalid code
            this.showInvalidCodeResponse();
        }
    }

    // ========================================
    // UI UPDATES
    // ========================================

    public updateCodesUI() {
        // Update the codes discovered count
        const codeCountEl = document.getElementById('codes-count');
        if (codeCountEl) {
            codeCountEl.textContent = this.discoveredCodes.size.toString();
        }

        // Update discovered codes list
        this.renderDiscoveredCodes();
    }

    private renderDiscoveredCodes() {
        const listEl = document.getElementById('codes-list');
        if (!listEl) return;

        // Render ALL codes (discovered + locked)
        listEl.innerHTML = this.allCodes.map(item => {
            const discovered = this.discoveredCodes.has(item.code);
            return `
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 12px;
                    margin-bottom: 8px;
                    background: ${discovered ? 'rgba(0, 255, 170, 0.1)' : 'rgba(100, 100, 100, 0.1)'};
                    border-left: 3px solid ${discovered ? '#00ffaa' : '#444'};
                    border-radius: 3px;
                    ${discovered ? 'cursor: pointer;' : ''}
                    transition: all 0.2s ease;
                "
                ${discovered ? `onclick="window.secretCodesManager?.showCodeInfo('${item.code}')" onmouseover="this.style.background='rgba(0, 255, 170, 0.2)'" onmouseout="this.style.background='rgba(0, 255, 170, 0.1)'"` : ''}>
                    <span style="font-size: 1.2em;">${discovered ? item.icon : '🔒'}</span>
                    <span style="flex: 1; color: ${discovered ? '#00ffaa' : '#666'};">
                        ${discovered ? item.name : '?????'}
                    </span>
                    ${discovered ? '<span style="color: #00ffaa; font-size: 0.8em;">✓ UNLOCKED</span>' : ''}
                </div>
            `;
        }).join('');
    }

    public showCodeInfo(code: string) {
        // Re-show the code's description
        const codeData = this.allCodes.find(c => c.code === code);
        if (codeData) {
            this.showMessage(`${codeData.icon} ${codeData.name}\n\n${codeData.description}`, 'success');
        }
    }

    // ========================================
    // UX ENHANCEMENTS
    // ========================================

    private showCodeSuccess() {
        const indicator = document.getElementById('code-success-indicator');
        if (!indicator) return;

        // Show animation
        indicator.style.display = 'block';

        // Hide after animation completes
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 1000);
    }

    private showInvalidCodeResponse() {
        // Get random response (avoid repeating last one)
        let responseIndex;
        do {
            responseIndex = Math.floor(Math.random() * this.invalidResponses.length);
        } while (responseIndex === this.lastResponseIndex && this.invalidResponses.length > 1);

        this.lastResponseIndex = responseIndex;
        const response = this.invalidResponses[responseIndex] || 'Invalid code.';

        this.showMessage(response, 'error');
    }

    private showMessage(message: string, type: 'success' | 'error') {
        const resultEl = document.getElementById('code-result-message');
        if (resultEl) {
            resultEl.textContent = message;
            resultEl.className = type;

            // Clear after 3 seconds
            setTimeout(() => {
                resultEl.textContent = '';
                resultEl.className = '';
            }, 3000);
        }
    }
}

// Make available globally for onclick handlers
declare global {
    interface Window {
        secretCodesManager?: SecretCodesManager;
    }
}
