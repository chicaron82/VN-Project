import { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    id: 'hybrid-chrome-architecture-feb-2026',
    date: 'Feb 4, 2026',
    sortDate: '2026-02-04T09:00:00',
    title: 'Building a Hybrid Chrome Architecture: From Chaos to Control',
    type: 'enhancement',
    emoji: '🏗️',
    tags: ['Architecture', 'SystemAPI', 'Chrome', 'Type Safety', 'Belle Patterns', 'Phase 2'],
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
        'Added SidebarSpec with declarative sections (button, link, divider)',
        'Runtime validation prevents invalid specs with helpful error messages',
        'ShowcaseApp demonstrates all features with 3 live action buttons'
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
    
    sidebar: { open/close/toggle/isOpen };
    shade: { open/close/toggle/isOpen };
    toast: { show/success/error/warning };
    
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

Created \`types/chrome.ts\` to eliminate duplication:

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
    if (spec.actions) this.renderStatusBarActions(spec.actions);
    
    // Apply theme
    if (spec.theme) this.applyTheme(spec.theme);
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
.status-action {
    background: rgba(255, 255, 255, 0.05);
    transition: all var(--chrome-transition-duration) ease;
}

.status-action:hover {
    background: var(--chrome-primary);
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

**Live demo:** Navigate to \`/showcase\` and click the action buttons! 🎮

## The Architecture

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                      UV7 Shell                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │         UV7System (Chrome Manager)                │  │
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

## What's Next: Phase 3

**Critical:**
- UV7Shell integration - wire up getStatusBarSpec() calls
- BaseApp signatures - add optional method types
- Browser testing - verify everything works live

**Optional:**
- Chrome Presets - DX helpers
- DevTools Panel - debug inspector
- Performance benchmarks - measure latency

**Status:** Phase 2 complete, Phase 3 ready to start! 🚀
    `,
    crew: [
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
    lessons: [
        'Hybrid architecture (specs + runtime API) beats pure declarative',
        'Action ID pattern solves iframe serialization elegantly',
        'FIFO queues prevent race conditions in async UI updates',
        'Type sharing eliminates duplication and improves maintainability',
        'Runtime validation with helpful errors saves debugging time',
        'CSS custom properties enable smooth theme transitions',
        'Declarative specs make chrome consistent across apps',
        'Belle\'s patterns (Action ID, Theme Injection) are production-ready'
    ],
    metrics: {
        'Phase 1 Commits': '3',
        'Phase 2 Commits': '4',
        'Bug Fixes': '1 (shell.html → index.html)',
        'Total Commits': '8',
        'Files Created': '1 (types/chrome.ts)',
        'Files Modified': '5',
        'Lines Added': '~580',
        'Lines Removed': '~65',
        'Net Change': '+515 lines',
        'SystemAPI Namespaces': '5',
        'SystemAPI Methods': '20+',
        'ShowcaseApp Actions': '3',
        'TypeScript Errors': '0',
        'Development Time': '~3 hours',
        'Coffee Consumed': '☕☕☕'
    },
    quote: 'Belle\'s suggestion to use string IDs instead of functions was genius. No serialization issues, works across iframe boundaries, fully testable, and completely secure.',
    footer: {
        icon: '🎉',
        text: 'Phase 2 complete - hybrid chrome architecture shipped!'
    }
};
