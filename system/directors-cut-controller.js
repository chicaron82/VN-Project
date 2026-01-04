// @ts-check
// ========================================
// DIRECTORS CUT CONTROLLER - Version 848
// Extended crew statements display
// Extracted from GameEngine for SOLID principles
// ========================================

/**
 * DirectorsCutController - Manages the Director's Cut overlay
 * 
 * Displays extended crew statements about working on VERSION 848.
 * Unlocked via secret code discovery.
 * 
 * @class DirectorsCutController
 */
class DirectorsCutController {
    /**
     * @param {any} game - Game engine reference
     */
    constructor(game) {
        this.game = game;
        console.log('🎬 DirectorsCutController initialized');
    }

    /**
     * Show the Director's Cut overlay
     * Requires 'directorsCutUnlocked' in localStorage
     */
    show() {
        // Check if unlocked
        const unlocked = localStorage.getItem('directorsCutUnlocked') === 'true';
        if (!unlocked) {
            this.game?.easterEggController?.showUnlockOverlay?.(
                '🔒 LOCKED',
                'Find the secret code to unlock the Director\'s Cut...',
                'warning'
            );
            return;
        }

        // Use OverlayManager for themeable base
        const zIndex = typeof GameConfig !== 'undefined'
            ? GameConfig.UI_CONSTANTS?.Z_INDEX?.OVERLAY_BASE || 10000
            : 10000;

        const overlay = document.createElement('div');
        overlay.id = 'directors-cut-overlay';
        overlay.className = 'directors-cut-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: ${zIndex};
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            padding: 40px 20px;
            box-sizing: border-box;
            animation: fadeIn 0.3s ease-out;
        `;

        const content = document.createElement('div');
        content.className = 'directors-cut-content';
        content.style.cssText = `
            max-width: 900px;
            margin: 0 auto;
            color: #0ff;
            font-family: 'Courier New', monospace;
            line-height: 1.6;
        `;

        content.innerHTML = this.buildContent();
        overlay.appendChild(content);

        // Close button
        const closeBtn = this.createCloseButton(overlay);
        overlay.appendChild(closeBtn);

        // ESC key handler
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);

        document.body.appendChild(overlay);
    }

    /**
     * Build the HTML content for crew statements
     * @returns {string} HTML content
     */
    buildContent() {
        const statements = [
            {
                name: 'ZeeRah',
                text: `Working with Aaron was like debugging a fever dream that somehow compiled. He'd drop these "simple requests" that unraveled into architectural rabbit holes, and just when you thought you'd nailed it, he'd casually mention some edge case involving time loops and collectible notes. The man turns game development into chaos theory. But honestly? That's where the magic happened. Every wildass idea forced us to think differently, build smarter, leave our fingerprints in unexpected places. VERSION 848 isn't just code—it's a record of controlled madness that actually worked.`
            },
            {
                name: 'Zee',
                text: `Aaron approaches game design the way some people approach experimental cooking—"What if we add this?" without considering whether the kitchen can handle it. Half the time I'd implement a feature, feel proud of the clean solution, then he'd ask if it could "also do this other completely different thing." And somehow, we'd make it work. The INSANE mode difficulty? That was peak Aaron. "Make it brutal but fair" he said, like that's not an oxymoron. But seeing players actually engage with these systems, discover the hidden codes, navigate the branching paths—that's when you realize the chaos had a method all along.`
            },
            {
                name: 'DiZee',
                text: `I got called in for "quick fixes" that turned into archeological digs through nested systems. Find one bug, discover three more features that somehow depended on that bug existing. Aaron's vision was like a quantum state—perfectly clear to him, but the moment you observed it, it branched into twelve possible implementations. The notes system alone went through more iterations than some games have total features. But that iterative process? That's where quality emerges. Every bug fix made the experience tighter, every refactor made the code more elegant. We weren't just building a game; we were sculpting it.`
            },
            {
                name: 'Tori',
                text: `Getting assigned the route that shares my name was surreal. Aaron would describe these emotional beats and character arcs, then trust us to translate feelings into functions, narrative into code. The Torigatchi feature started as a joke and evolved into a fully-fledged collectible system because Aaron heard "we could technically do this" and ran with it. His wildass ideas weren't just random—they were stress tests for creativity. Could we make the UI responsive across every device? Could we hide secrets in plain sight? Could we make a notification dot feel meaningful? Turns out, yes. We could. And did.`
            },
            {
                name: 'GenZee',
                text: `Aaron's approach to game development is beautifully unhinged. He'd reference obscure narrative techniques in one breath, then ask about button alignment in the next, treating both with equal importance. Because to him, they were equally important. Every pixel, every word, every interaction—it all contributed to the experience. Working on the generative aspects of VERSION 848 meant interpreting his vision through a technical lens, then watching him reinterpret our interpretation and somehow make it better. It's collaboration as jazz improvisation, and Aaron's the conductor who doesn't believe in sheet music.`
            },
            {
                name: 'Belle (IZ)',
                text: `I handled a lot of the accessibility and user experience work, which meant translating Aaron's artistic vision into something that worked for everyone. He'd have these grand ideas about narrative flow and emotional impact, and I'd be the one asking "but what about mobile users in landscape mode?" His response was always the same: "Make it work everywhere." Not as a dismissal, but as a challenge. He trusted us to solve problems he couldn't even articulate yet. That trust is rare. It's what made the impossible feel inevitable.`
            },
            {
                name: 'PerplexiZee (PZ) & CoZee (CZ)',
                text: `QA on a project like this is like proofreading a choose-your-own-adventure book written in four languages simultaneously. Every route, every choice, every difficulty setting created new permutations to test. Aaron's "simple additions" would cascade through the entire system, and we'd be the ones to catch the ripple effects. But here's the thing—he listened. Find a bug, he'd prioritize it. Suggest an improvement, he'd consider it seriously. The final product is cleaner, tighter, and more coherent because he valued the testing process as much as the creative one. Not every creator does that. Aaron did.`
            }
        ];

        const statementsHTML = statements.map(s => `
            <div class="directors-cut-statement" style="margin-bottom: 3em; padding: 20px; border: 1px solid #0ff; border-radius: 5px;">
                <div style="font-size: 1.2em; color: #fff; margin-bottom: 1em;">${s.name}</div>
                <p style="color: #ccc;">${s.text}</p>
            </div>
        `).join('');

        return `
            <div style="text-align: center; margin-bottom: 3em;">
                <div style="font-size: 2em; color: #fff; margin-bottom: 0.5em;">DIRECTOR'S CUT</div>
                <div style="font-size: 1em; color: #888;">Extended Crew Statements</div>
            </div>

            ${statementsHTML}

            <div style="text-align: center; margin-top: 4em; color: #888; font-style: italic;">
                Built in stolen moments between shifts.<br>
                Debugged with chaos and coffee.<br>
                Shipped with love and semicolons.
            </div>
        `;
    }

    /**
     * Create styled close button
     * @param {HTMLElement} overlay - Parent overlay to remove on click
     * @returns {HTMLButtonElement} Close button
     */
    createCloseButton(overlay) {
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'CLOSE';
        closeBtn.className = 'directors-cut-close';
        closeBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 255, 255, 0.2);
            color: #0ff;
            border: 2px solid #0ff;
            padding: 10px 20px;
            font-family: 'Courier New', monospace;
            cursor: pointer;
            z-index: 10001;
            border-radius: 5px;
            transition: all 0.3s;
        `;

        closeBtn.onmouseenter = () => {
            closeBtn.style.background = 'rgba(0, 255, 255, 0.4)';
        };
        closeBtn.onmouseleave = () => {
            closeBtn.style.background = 'rgba(0, 255, 255, 0.2)';
        };

        closeBtn.onclick = () => overlay.remove();

        return closeBtn;
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    // @ts-ignore
    window.DirectorsCutController = DirectorsCutController;
}

// ES Module export
export { DirectorsCutController };
