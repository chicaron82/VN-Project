import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
    id: 'hybrid-chrome-architecture-feb-2026',
    date: 'Feb 4, 2026',
    sortDate: '2026-02-04T09:00:00',
    title: 'Building a Hybrid Chrome Architecture: From Chaos to Control',
    type: 'enhancement',
    emoji: '🏗️',
    tags: ['Architecture', 'SystemAPI', 'Chrome', 'Type Safety', 'Belle Patterns', 'ChromePresets', 'Complete'],
    summary: 'Built a hybrid chrome architecture combining declarative specs and imperative runtime APIs. Apps can declare their UI chrome (status bar, sidebar, shade) while maintaining full runtime control. Result: type-safe, validated, themeable chrome with zero function serialization.',
    callout: {
        icon: '🎯',
        title: 'The Action ID Breakthrough',
        text: 'Belle\'s suggestion to use string IDs instead of functions was genius. No serialization issues, works across iframe boundaries, fully testable, and completely secure.'
    },
    highlights: [
        'Built SystemAPI with 5 namespaces (statusBar, chrome, sidebar, shade, toast)',
        'Implemented Action ID pattern - no function serialization across iframes',
        'Created FIFO message queue to prevent race conditions',
        'Added type sharing via types/chrome.ts (eliminated 65 lines of duplicates)',
        'Implemented StatusBarSpec with actions, themes, and validation',
        'Built ChromeTheme injection using CSS custom properties',
        'Created ChromePresets utility with 5 helper methods',
        'Migrated all 5 apps to use new chrome architecture',
        'Updated CHROME_ARCHITECTURE.md with +495 lines of documentation',
        'All 3 phases complete and production ready'
    ],
    problem: {
        description: 'Apps were directly manipulating chrome DOM, causing tight coupling, no validation, no type safety, and impossible function serialization across iframe boundaries.',
        rootCause: 'No architectural boundary between apps and shell chrome. Apps needed both declarative specs AND runtime control, but had neither in a clean way.'
    },
    solution: {
        approach: 'Hybrid architecture: declarative specs for chrome structure + imperative SystemAPI for runtime control. Action ID pattern for event routing. Type sharing for consistency.',
        features: [
            '**SystemAPI:** 5 namespaces with 20+ methods for controlled chrome manipulation',
            '**Action ID Pattern:** String-based action routing (no function serialization)',
            '**FIFO Message Queue:** Sequential temporary message processing',
            '**Type Sharing:** types/chrome.ts as single source of truth',
            '**StatusBarSpec:** Declarative actions, themes, and modes',
            '**ChromeTheme:** CSS custom properties for seamless theme transitions',
            '**SidebarSpec:** Declarative sections with button/link/divider items',
            '**Spec Validation:** Runtime checks with helpful error messages',
            '**ShowcaseApp Demo:** 3 action buttons (theme, share, fullscreen)'
        ],
        steps: [
            '**Phase 1:** Built SystemAPI foundation with 5 namespaces',
            '**Action Pattern:** Implemented Belle\'s Action ID & Signal pattern',
            '**FIFO Queue:** Fixed race condition in temporary messages',
            '**Cinematic API:** Refactored to nested namespace (chrome.cinematic.set/enter/exit)',
            '**Phase 2:** Created types/chrome.ts for type sharing',
            '**StatusBarSpec:** Added actions, theme, mode, and validation',
            '**ChromeTheme:** Implemented CSS custom property injection',
            '**SidebarSpec:** Built declarative sections renderer',
            '**Testing:** ShowcaseApp with 3 live action handlers'
        ]
    },
    description: `
## The Chrome Chaos Problem

UV7 OS started with apps directly manipulating the DOM:

\`\`\`typescript
// ❌ The old way - tight coupling, no validation
document.getElementById('uv7-context').textContent = 'My App';
document.getElementById('uv7-sidebar').innerHTML = myHTML;
\`\`\`

**Problems:**
1. No boundaries - apps could break each other
2. No validation - typos and bugs everywhere
3. No type safety - pure string manipulation
4. Tight coupling - apps needed shell internals
5. **Iframe killer:** Can't serialize functions across boundaries!

\`\`\`typescript
// ❌ Can't do this across iframe boundaries!
window.parent.postMessage({
    type: 'update-chrome',
    onClick: () => { /* This won't work! */ }
}, '*');
\`\`\`

## Phase 1: SystemAPI Foundation

### The Controlled API

Built a comprehensive API with 5 namespaces:

\`\`\`typescript
interface SystemAPI {
    statusBar: {
        setTemporaryMessage(msg: string, duration?: number): Promise<void>;
        showProgress(percent: number, label?: string): void;
        clearProgress(): void;
        pulse(duration?: number): void;
    };

    chrome: {
        fadeOut(duration?: number): Promise<void>;
        fadeIn(duration?: number): Promise<void>;
        hide(): void;
        show(): void;
        cinematic: {
            set(enabled: boolean): void;
            enter(): void;
            exit(): void;
        };
    };

    sidebar: { open / close / toggle / isOpen };
shade: { open / close / toggle / isOpen };
toast: { show / success / error / warning };

// Belle's Action ID Pattern
onAction(actionId: string, handler: () => void): void;
offAction(actionId: string): void;
}
\`\`\`

### Action ID Pattern (Belle's Genius)

Instead of serializing functions, use **string IDs**:

\`\`\`typescript
// App declares actions
getStatusBarSpec() {
    return {
        actions: [
            { id: 'myapp:settings', icon: '⚙️', label: 'Settings' }
        ]
    };
}

// App registers handler
this.api.onAction('myapp:settings', () => {
    this.api.shade.open();
});

// Shell routes the action
handleActionClick(actionId: string) {
    const handler = this.actionHandlers.get(actionId);
    if (handler) handler();
}
\`\`\`

**Why this works:**
- ✅ No function serialization
- ✅ Decoupled - shell doesn't know app logic
- ✅ Secure - no arbitrary code execution
- ✅ Testable - easy to trigger programmatically

### FIFO Message Queue

Discovered race condition with temporary messages:

\`\`\`typescript
// ❌ Race condition - messages overlap
api.statusBar.setTemporaryMessage('Loading...', 1000);
api.statusBar.setTemporaryMessage('Done!', 1000);
\`\`\`

**Solution:** FIFO queue with sequential processing:

\`\`\`typescript
private messageQueue: Array<{ msg: string; duration: number }> = [];

async processMessageQueue() {
    if (this.messageQueue.length === 0) return;

    this.isShowingMessage = true;
    const { msg, duration } = this.messageQueue.shift()!;

    // Show message, wait, restore, process next
    await new Promise(resolve => setTimeout(resolve, duration));

    if (this.messageQueue.length > 0) {
        await this.processMessageQueue();
    }
}
\`\`\`

**Result:** Messages display in order, no overlap! 🎉

## Phase 2: Spec Enhancement

### Type Sharing

Created \`types / chrome.ts\` to eliminate duplication:

\`\`\`typescript
export interface StatusBarSpec {
    title: string;
    context?: string;
    actions?: StatusBarAction[];
    mode?: 'normal' | 'cinematic' | 'minimal';
    theme?: ChromeTheme;
}

export interface ChromeTheme {
    primaryColor: string;
    accentColor: string;
    fontFamily?: string;
    statusBarVariant?: 'light' | 'dark' | 'auto';
    transitionDuration?: number;
}

export interface StatusBarAction {
    id: string;      // 'app:action' format
    icon: string;
    label: string;
}
\`\`\`

**Before:** 65 lines of duplicates  
**After:** 200 lines in one shared file  
**Savings:** Eliminated duplication + 135 lines of new types

### StatusBarSpec with Actions

Apps declare action buttons:

\`\`\`typescript
getStatusBarSpec() {
    return {
        title: 'Showcase',
        context: 'Interactive Demo',
        actions: [
            { id: 'showcase:theme_toggle', icon: '🎨', label: 'Theme' },
            { id: 'showcase:share', icon: '📤', label: 'Share' },
            { id: 'showcase:fullscreen', icon: '⛶', label: 'Fullscreen' }
        ],
        theme: {
            primaryColor: '#6366f1',
            accentColor: '#818cf8',
            transitionDuration: 350
        }
    };
}
\`\`\`

Shell renders automatically:

\`\`\`typescript
applyStatusBarSpec(spec: StatusBarSpec): void {
    // Validate spec
    this.validateStatusBarSpec(spec);

    // Update title/context
    titleEl.textContent = spec.title;

    // Render actions
    if(spec.actions) this.renderStatusBarActions(spec.actions);

    // Apply theme
    if(spec.theme) this.applyTheme(spec.theme);
}
\`\`\`

### Theme Injection (Belle's Pattern)

Apps inject their brand into chrome:

\`\`\`typescript
applyTheme(theme: ChromeTheme): void {
    document.documentElement.style.setProperty(
        '--chrome-primary',
        theme.primaryColor
    );
    document.documentElement.style.setProperty(
        '--chrome-accent',
        theme.accentColor
    );
}
\`\`\`

**CSS:**

\`\`\`css
    .status - action {
    background: rgba(255, 255, 255, 0.05);
    transition: all var(--chrome - transition - duration) ease;
}

.status - action:hover {
    background: var(--chrome - primary);
    transform: translateY(-1px);
}
\`\`\`

**Result:** Seamless theme transitions! 🎨

### Spec Validation

Runtime validation catches errors early:

\`\`\`typescript
private validateStatusBarSpec(spec: StatusBarSpec): void {
    spec.actions?.forEach(action => {
        // Validate action ID format: 'app:action'
        if (!action.id.match(/^[a-z0-9_]+:[a-z0-9_]+$/)) {
            throw new Error(
                \`Invalid action ID: "\${action.id}". \` +
                \`Must be namespaced: "app:action"\`
            );
        }
    });
}
\`\`\`

**Example error:**

\`\`\`
❌ Error: Invalid action ID: "Settings". 
   Must be namespaced: "app:action"
\`\`\`

### SidebarSpec Sections

Declarative sidebar structure:

\`\`\`typescript
getSidebarSpec() {
    return {
        sections: [
            {
                title: 'Navigation',
                items: [
                    { type: 'button', icon: '🏠', label: 'Home', actionId: 'app:home' },
                    { type: 'divider' },
                    { type: 'link', icon: '📚', label: 'Docs', href: '/docs' }
                ]
            }
        ]
    };
}
\`\`\`

## ShowcaseApp Demo

Full demonstration of Phase 2 features:

\`\`\`typescript
class ShowcaseApp extends BaseApp {
    getStatusBarSpec() {
        return {
            title: 'Showcase',
            actions: [
                { id: 'showcase:theme_toggle', icon: '🎨', label: 'Theme' },
                { id: 'showcase:share', icon: '📤', label: 'Share' },
                { id: 'showcase:fullscreen', icon: '⛶', label: 'Fullscreen' }
            ],
            theme: {
                primaryColor: '#6366f1',
                accentColor: '#818cf8'
            }
        };
    }

    async mount(container: HTMLElement) {
        // Register action handlers
        this.api.onAction('showcase:fullscreen', () => {
            this.api.chrome.cinematic.set(true);
            setTimeout(() => this.api.chrome.cinematic.set(false), 3000);
            this.api.toast.show('Cinematic mode demo (3s)', { icon: '⛶' });
        });
    }
}
\`\`\`

**Live demo:** Navigate to \`/ showcase\` and click the action buttons! 🎮

## The Architecture

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                      UV7 Shell                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │         UV7System(Chrome Manager)                │  │
│  │  • applyStatusBarSpec()                           │  │
│  │  • applyTheme()                                   │  │
│  │  • handleActionClick()                            │  │
│  │  • getAPI() → SystemAPI                           │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↕                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │                    BaseApp                        │  │
│  │  • api: SystemAPI                                 │  │
│  │  • getStatusBarSpec() → StatusBarSpec             │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↕                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │                 ShowcaseApp                       │  │
│  │  • Declares 3 actions via spec                    │  │
│  │  • Registers handlers via api.onAction()          │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
\`\`\`

## Key Learnings

1. **Hybrid > Pure Declarative** - Apps need both specs AND runtime control
2. **Action ID Pattern is Brilliant** - Works across iframes, serializable, testable, secure
3. **Type Sharing Eliminates Duplication** - Single source of truth in types/chrome.ts
4. **Validation Saves Time** - Catch errors before they become bugs
5. **CSS Custom Properties for Theming** - Smooth transitions, easy to update

## Phase 3: Integration & Polish ✅

**All critical tasks complete!**

### UV7Shell Integration

Wired up spec application in \`UV7Shell.loadApp()\`:

\`\`\`typescript
async loadApp(appId: string, params: Record<string, any> = {}): Promise < void> {
    // Expose SystemAPI BEFORE mount (so handlers can be registered)
    app.api = this.system!.getAPI();

    // Mount the app
    await app.mount(this.elements.viewport!, params);

    // Apply chrome specs (Phase 2)
    if(typeof app.getStatusBarSpec === 'function') {
    const spec = app.getStatusBarSpec();
    this.system!.applyStatusBarSpec(spec);
} else {
    // Fallback to old getStatusBarConfig() for backwards compatibility
    this.updateStatusBar(app.getStatusBarConfig());
}
}
\`\`\`

**Key fix:** Moved SystemAPI exposure BEFORE mount() so apps can register action handlers during mount.

### BaseApp Optional Methods

Added optional method signatures for type safety:

\`\`\`typescript
export abstract class BaseApp {
    /**
     * Optional: Return status bar spec for this app (Phase 2)
     */
    getStatusBarSpec?(): any;

    /**
     * Optional: Return sidebar spec for this app (Phase 2)
     */
    getSidebarSpec?(): any;
}
\`\`\`

### ChromePresets Utility

Created convenience helpers for common configurations:

\`\`\`typescript
import { ChromePresets } from '../../types/ChromePresets.js';

// Standard chrome with actions
getStatusBarSpec() {
    return ChromePresets.standard({
        title: 'My App',
        actions: [
            ChromePresets.action('myapp', 'settings', '⚙️', 'Settings')
        ],
        theme: {
            primaryColor: '#6366f1',
            accentColor: '#818cf8'
        }
    });
}

// Minimal chrome (title + context only)
getStatusBarSpec() {
    return ChromePresets.minimal('My App', 'Ready');
}

// Cinematic chrome (hidden for immersive experience)
getStatusBarSpec() {
    return ChromePresets.cinematic('Visual Novel');
}

// Game chrome (optimized for games)
getStatusBarSpec() {
    return ChromePresets.game({
        title: 'My Game',
        primaryColor: '#ff0055',
        accentColor: '#ff3377'
    });
}
\`\`\`

**Presets available:**
- \`standard()\` - Full-featured chrome
- \`minimal()\` - Simple apps
- \`cinematic()\` - Immersive experiences
- \`game()\` - Game-optimized
- \`action()\` - Action button helper

### App Migration

Migrated all 5 apps to use ChromePresets:

**ShowcaseApp** - Standard preset with 3 actions:
\`\`\`typescript
ChromePresets.standard({
    title: 'Showcase',
    actions: [
        ChromePresets.action('showcase', 'theme_toggle', '🎨', 'Theme'),
        ChromePresets.action('showcase', 'share', '📤', 'Share'),
        ChromePresets.action('showcase', 'fullscreen', '⛶', 'Fullscreen')
    ],
    theme: { primaryColor: '#6366f1', accentColor: '#818cf8' }
});
\`\`\`

**LandingApp** - Minimal preset:
\`\`\`typescript
ChromePresets.minimal('UV7 Project Hub', 'Landing');
\`\`\`

**V2App** - Game preset (pink theme):
\`\`\`typescript
ChromePresets.game({
    title: 'Version 848 (V2)',
    primaryColor: '#ff0055',
    accentColor: '#ff3377',
    context: 'V2 Engine'
});
\`\`\`

**TorigatchApp** - Game preset (green theme):
\`\`\`typescript
ChromePresets.game({
    title: 'Tori-gatchi',
    primaryColor: '#10b981',
    accentColor: '#34d399',
    context: 'Tori-gatchi 💖'
});
\`\`\`

**V1App** - Cinematic preset (immersive):
\`\`\`typescript
ChromePresets.cinematic('Version 848 (V1)');
\`\`\`

### Documentation

Updated \`CHROME_ARCHITECTURE.md\` with:
- Phase 1-3 implementation details (+495 lines)
- Usage examples for all presets
- Migration guide from old API
- Status: 🟢 Production Ready

**Status:** All 3 phases complete! 🎉
    `,
    crewAttribution: {
        systems: [
            {
                name: 'Tori',
                icon: '🏗️',
                contribution: 'Shell + Apps architecture pattern'
            },
            {
                name: 'Belle',
                icon: '🎯',
                contribution: 'Action ID & Theme Injection patterns, architecture review'
            },
            {
                name: 'Zee',
                icon: '🧠',
                contribution: 'Hybrid vs Full SPA wisdom'
            },
            {
                name: 'DiZee',
                icon: '⚡',
                contribution: 'Implementation, FIFO queue, validation, testing'
            },
            {
                name: 'Claude Sonnet 4.5',
                icon: '🤖',
                contribution: 'Architecture design, code implementation, documentation'
            }
        ],
        quote: "Belle's suggestion to use string IDs instead of functions was genius. No serialization issues, works across iframe boundaries, fully testable, and completely secure."
    },
    lessonsLearned: [
        'Hybrid architecture (specs + runtime API) beats pure declarative',
        'Action ID pattern solves iframe serialization elegantly',
        'FIFO queues prevent race conditions in async UI updates',
        'Type sharing eliminates duplication and improves maintainability',
        'Runtime validation with helpful errors saves debugging time',
        'CSS custom properties enable smooth theme transitions',
        'Declarative specs make chrome consistent across apps',
        "Belle's patterns (Action ID, Theme Injection) are production-ready"
    ],
    metrics: {
        'Phase 1 Commits': '3',
        'Phase 2 Commits': '5',
        'Phase 3 Commits': '3',
        'ChromePresets Commit': '1',
        'Documentation Commit': '1',
        'App Migration Commits': '2',
        'Total Commits': '15',
        'Files Created': '2 (types/chrome.ts, types/ChromePresets.ts)',
        'Files Modified': '10',
        'Lines Added': '~1,400',
        'Lines Removed': '~65',
        'Net Change': '+1,335 lines',
        'SystemAPI Namespaces': '5',
        'SystemAPI Methods': '20+',
        'ChromePresets Methods': '5',
        'Apps Migrated': '5/5 (100%)',
        'TypeScript Errors': '0',
        'Development Time': '~5.5 hours',
        'Coffee Consumed': '☕☕☕☕☕'
    },

    footer: {
        icon: '🎉',
        text: 'All 3 phases complete - hybrid chrome architecture shipped to production!'
    }
};
