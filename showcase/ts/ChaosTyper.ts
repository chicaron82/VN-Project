/**
 * ChaosTyper - Background Code Typing Effects
 * Manages the background code typing effects for Chaos (V1) and Order (V2) backgrounds.
 */

// Default Chaos Snippets
const chaosSnippets: string[] = [
    "function forceUpdate() { while(true) { try { render() } catch(e) { ignore() } } }",
    "// TODO: Fix this later... maybe...",
    "if (user.isSad) { makeHappy(user); } else { breakStuff(); }",
    "box-shadow: 0 0 100px #f0f;",
    "$('body').on('click', function() { alert('Why?'); });",
    "return null; // I give up",
    "try { everything() } catch (nothing) {}",
    "// Logic is overrated",
    "width: calc(100% + 50px); /* Just to be safe */"
];

// Context-Aware Snippets (mapped by Phase ID keywords)
const contextSnippets: Record<string, string[]> = {
    'phase-1': ["// Structure? Where we're going we don't need structure."],
    'phase-8': ["// DialogController: Parsing corrupted text...", "if (tether < 0) { reality.collapse() }"],
    'phase-13': ["// Porting started...", "class UV7System { constructor() { this.chaos = false; } }"],
    'phase-26': ["// NotificationRail: BOUGIE EDITION", "StatusBar.unified = true;"],
    'phase-27': ["// Polishing pixels...", "requestAnimationFrame(renderRain);"]
};

// Clean Order Snippets
const orderSnippets: string[] = [
    'interface GameState { tethers: Map<string, number>; }',
    'class EventBus { emit<T>(event: GameEvent<T>): void; }',
    'const loadRoute = async (id: string): Promise<RouteData> => { ... }',
    'type Difficulty = "normal" | "hard" | "insane";',
    '// Strict null checks enabled',
    'if (tether.isStable()) { syncTimeline(); }',
    'export const V2_CORE = Object.freeze({ ...config });',
    '// 0 errors found. Compilation successful.',
    'implements ISerializable'
];

export function initChaosTyper(): void {
    const chaosCodeBlock = document.querySelector('.chaos-code-bg') as HTMLElement | null;
    const orderCodeBlock = document.querySelector('.order-code-bg') as HTMLElement | null;

    let currentContext: string[] | null = null;

    // --- Chaos Typing ---
    function typeChaosCode(): void {
        if (!chaosCodeBlock) return;

        let text = chaosCodeBlock.innerText;
        if (text.length > 500) text = text.substring(200); // trimming

        // Choose snippet: Context-aware priority
        const snippets = currentContext || chaosSnippets;
        const snippet = snippets[Math.floor(Math.random() * snippets.length)];

        text += "\n" + snippet;
        chaosCodeBlock.innerText = text;

        setTimeout(typeChaosCode, Math.random() * 500 + 100);
    }

    // --- Order Typing ---
    function typeOrderCode(): void {
        if (!orderCodeBlock) return;

        let text = orderCodeBlock.innerText;
        if (text.length > 500) text = text.substring(200);

        const snippet = orderSnippets[Math.floor(Math.random() * orderSnippets.length)];
        text += '\n' + snippet;
        orderCodeBlock.innerText = text;

        setTimeout(typeOrderCode, Math.random() * 2000 + 1000); // Slower, more deliberate
    }

    // Expose context updater globally so IntersectionObservers can use it
    window.updateBackgroundContext = function (phaseId: string): void {
        // Look for matching key in contextSnippets
        const match = Object.keys(contextSnippets).find(key => phaseId && phaseId.includes(key));
        currentContext = match ? contextSnippets[match] : null;
    };

    // Start effects
    if (chaosCodeBlock) typeChaosCode();
    if (orderCodeBlock) typeOrderCode();
}
