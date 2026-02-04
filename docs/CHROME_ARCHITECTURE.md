# UV7 Chrome Architecture - Hybrid Spec + Runtime API

> **Design Philosophy**: "Declarative by default, imperative when it matters"
>
> Apps provide specs for structure and consistency, with controlled runtime API for cinematic moments and personality.

---

## 🎯 Vision

A chrome system that:

- **Scales cleanly** - Adding new apps is just providing specs
- **Prevents drift** - Single source of truth for each app's chrome
- **Enables creativity** - Controlled API for narrative moments
- **Works everywhere** - Edit once, reflects in standalone AND shell modes

---

## 📐 Current State (As of Checkpoint 21)

### What We Have ✅

**1. Spec-Driven Configuration**

```typescript
interface StatusBarConfig {
    title?: string;
    context?: string;
    showBreadcrumb?: boolean;
    breadcrumbPath?: string[];
}

interface SidebarConfig {
    title: string;
    content: string | HTMLElement;
    init?: () => void;
}
```

**2. UV7System as Chrome Controller**

- Manages status bar, sidebar, notification shade
- Apps provide config via `getStatusBarConfig()` and `getSidebarConfig()`
- Shell calls `system.updateStatusBar()` and `system.updateSidebar()`

**3. Mode Detection**

- Standalone: Apps initialize their own `UV7System`
- Shell: Apps provide specs, shell's `UV7System` renders them

### What's Missing ⚠️

1. **No controlled runtime API** - Apps call `system` methods directly (soft coupling)
2. **No shade spec** - Notification shade isn't configurable per-app
3. **No standalone → shell sync** - Editing standalone doesn't auto-update shell mode
4. **No cinematic API** - Boot sequences, transitions are ad-hoc

---

## 🏗️ Target Architecture (Hybrid)

### Core Principles

1. **Specs are the source of truth** - Apps declare their chrome needs
2. **Runtime API is controlled** - No direct system manipulation
3. **Standalone owns chrome** - Apps define chrome in their own code
4. **Shell renders from specs** - Shell receives specs and renders chrome

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         APP (Showcase)                       │
│                                                              │
│  ┌────────────────────┐      ┌─────────────────────────┐   │
│  │  Chrome Specs      │      │  Runtime Events         │   │
│  │  (Declarative)     │      │  (Controlled Imperative)│   │
│  ├────────────────────┤      ├─────────────────────────┤   │
│  │ • StatusBarSpec    │      │ • Boot sequence         │   │
│  │ • SidebarSpec      │      │ • Progress updates      │   │
│  │ • ShadeSpec        │      │ • Temporary messages    │   │
│  └────────┬───────────┘      └──────────┬──────────────┘   │
│           │                             │                   │
└───────────┼─────────────────────────────┼───────────────────┘
            │                             │
            ▼                             ▼
┌───────────────────────────────────────────────────────────┐
│                    SHELL / UV7SYSTEM                       │
│                                                            │
│  ┌──────────────────┐         ┌────────────────────────┐ │
│  │  Spec Renderer   │         │  Controlled API        │ │
│  │                  │         │                        │ │
│  │ • Render sidebar │         │ • statusBar.setTemp()  │ │
│  │ • Render shade   │         │ • chrome.fadeOut()     │ │
│  │ • Render status  │         │ • sidebar.toggle()     │ │
│  └────────┬─────────┘         └──────────┬─────────────┘ │
│           │                              │               │
│           ▼                              ▼               │
│  ┌─────────────────────────────────────────────────┐    │
│  │           DOM (Status Bar, Sidebar, Shade)      │    │
│  └─────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────┘
```

---

## 📋 Spec Definitions (Declarative Layer)

### StatusBarSpec

```typescript
interface StatusBarSpec {
    // Basic info
    title: string;
    context?: string;
    
    // Breadcrumb navigation
    showBreadcrumb?: boolean;
    breadcrumbPath?: string[];
    
    // Actions (buttons in status bar)
    actions?: StatusBarAction[];
    
    // Display mode
    mode?: 'normal' | 'cinematic' | 'minimal';
    
    // Custom styling
    theme?: 'default' | 'dark' | 'accent';
}

interface StatusBarAction {
    id: string;
    icon: string;
    label: string;
    onClick: () => void;
}
```

### SidebarSpec

```typescript
interface SidebarSpec {
    // Header
    title: string;
    icon?: string;
    
    // Content (declarative)
    sections?: SidebarSection[];
    
    // OR: Content (imperative - for complex UIs)
    content?: string | HTMLElement;
    init?: () => void;
    
    // Behavior
    defaultOpen?: boolean;
    pinnable?: boolean;
}

interface SidebarSection {
    title: string;
    items: SidebarItem[];
}

interface SidebarItem {
    type: 'button' | 'link' | 'divider' | 'custom';
    icon?: string;
    label?: string;
    action?: () => void;
    href?: string;
    customContent?: HTMLElement;
}
```

### ShadeSpec (NEW)

```typescript
interface ShadeSpec {
    // Header
    title: string;
    icon?: string;
    
    // Settings sections
    sections?: ShadeSection[];
    
    // OR: Custom content
    content?: string | HTMLElement;
    init?: () => void;
}

interface ShadeSection {
    title: string;
    settings: ShadeSetting[];
}

interface ShadeSetting {
    type: 'toggle' | 'slider' | 'select' | 'custom';
    id: string;
    label: string;
    value?: any;
    onChange?: (value: any) => void;
    options?: { label: string; value: any }[];
}
```

---

## 🎮 Runtime API (Controlled Imperative Layer)

### SystemAPI Interface

```typescript
interface SystemAPI {
    // Status Bar Runtime Control
    statusBar: {
        // Temporary messages (auto-revert to spec)
        setTemporaryMessage(msg: string, duration?: number): Promise<void>;
        
        // Progress indication
        showProgress(percent: number, label?: string): void;
        clearProgress(): void;
        
        // Pulsing/attention
        pulse(duration?: number): void;
    };
    
    // Chrome Visibility & Transitions
    chrome: {
        // Fade transitions
        fadeOut(duration?: number): Promise<void>;
        fadeIn(duration?: number): Promise<void>;
        
        // Visibility
        hide(): void;
        show(): void;
        
        // Cinematic mode (hides all chrome)
        enterCinematicMode(): void;
        exitCinematicMode(): void;
    };
    
    // Sidebar Control
    sidebar: {
        open(): void;
        close(): void;
        toggle(): void;
        isOpen(): boolean;
        
        // Dynamic updates (within spec constraints)
        updateSection(sectionId: string, items: SidebarItem[]): void;
    };
    
    // Shade Control
    shade: {
        open(): void;
        close(): void;
        toggle(): void;
        isOpen(): boolean;
    };
    
    // Toast Notifications
    toast: {
        show(message: string, options?: ToastOptions): void;
        success(message: string): void;
        error(message: string): void;
        warning(message: string): void;
    };
}

interface ToastOptions {
    duration?: number;
    icon?: string;
    action?: { label: string; onClick: () => void };
}
```

---

## 🔄 App Lifecycle & Chrome Management

### Standalone Mode

```typescript
// showcase/core/main.ts

document.addEventListener('DOMContentLoaded', async () => {
    const isInShell = window.self !== window.top;
    
    if (isInShell) {
        // Running in shell - send specs to parent
        await registerChromeWithShell();
    } else {
        // Standalone mode - initialize own chrome
        await initStandaloneChrome();
    }
    
    // Initialize app content (same in both modes)
    await initShowcaseContent();
});

async function initStandaloneChrome() {
    const { default: UV7System } = await import('../../shell/UV7System');
    
    const uv7System = new UV7System({
        mode: 'standalone',
        appName: 'Showcase',
        prefix: 'showcase',
        
        // Provide specs
        statusBarSpec: getShowcaseStatusBarSpec(),
        sidebarSpec: getShowcaseSidebarSpec(),
        shadeSpec: getShowcaseShadeSpec()
    });
    
    await uv7System.init();
    
    // Expose controlled API
    window.showcaseAPI = uv7System.getAPI();
}

async function registerChromeWithShell() {
    // Hide own chrome elements
    hideOwnChrome();
    
    // Send specs to parent shell
    window.parent.postMessage({
        type: 'uv7:register-chrome',
        appId: 'showcase',
        specs: {
            statusBar: getShowcaseStatusBarSpec(),
            sidebar: getShowcaseSidebarSpec(),
            shade: getShowcaseShadeSpec()
        }
    }, '*');
    
    // Listen for API bridge from shell
    window.addEventListener('message', (e) => {
        if (e.data.type === 'uv7:api-ready') {
            window.showcaseAPI = createAPIBridge(e.data.apiPort);
        }
    });
}
```

### Shell Mode

```typescript
// shell/UV7Shell.ts

async loadApp(appId: string, params: Record<string, any> = {}): Promise<void> {
    // ... existing load logic ...
    
    // Listen for chrome registration from iframe
    this.listenForChromeRegistration(appId);
    
    // Mount the app
    await app.mount(this.elements.viewport!, params);
    
    // If app provides specs directly (not iframe), use them
    const specs = app.getChromeSpecs?.();
    if (specs) {
        this.applyChromeSpecs(specs);
    }
    
    // Expose API to app
    app.api = this.system.getAPI();
}

private listenForChromeRegistration(appId: string): void {
    const handler = (e: MessageEvent) => {
        if (e.data.type === 'uv7:register-chrome' && e.data.appId === appId) {
            this.applyChromeSpecs(e.data.specs);
            
            // Send API bridge to iframe
            e.source?.postMessage({
                type: 'uv7:api-ready',
                apiPort: this.createAPIBridge()
            }, '*');
            
            window.removeEventListener('message', handler);
        }
    };
    
    window.addEventListener('message', handler);
}

private applyChromeSpecs(specs: ChromeSpecs): void {
    if (specs.statusBar) {
        this.system.applyStatusBarSpec(specs.statusBar);
    }
    if (specs.sidebar) {
        this.system.applySidebarSpec(specs.sidebar);
    }
    if (specs.shade) {
        this.system.applyShadeSpec(specs.shade);
    }
}
```

---

## 🎬 Usage Examples

### Example 1: Simple App (Spec-Only)

```typescript
class SimpleApp extends BaseApp {
    getChromeSpecs(): ChromeSpecs {
        return {
            statusBar: {
                title: 'Simple App',
                context: 'Welcome',
                mode: 'normal'
            },
            sidebar: {
                title: '📱 Simple',
                sections: [
                    {
                        title: 'Navigation',
                        items: [
                            { type: 'button', icon: '🏠', label: 'Home', action: () => this.goHome() },
                            { type: 'button', icon: '⚙️', label: 'Settings', action: () => this.openSettings() }
                        ]
                    }
                ]
            }
        };
    }
}
```

### Example 2: Cinematic App (Spec + Runtime API)

```typescript
class LandingApp extends BaseApp {
    getChromeSpecs(): ChromeSpecs {
        return {
            statusBar: {
                title: 'UV7 OS',
                mode: 'cinematic', // Starts hidden
                theme: 'accent'
            },
            sidebar: {
                title: '🏠 UV7 OS',
                sections: [/* ... */]
            }
        };
    }
    
    async mount(container: HTMLElement, params: Record<string, any>): Promise<void> {
        await super.mount(container, params);
        
        // Play boot sequence using runtime API
        await this.playBootSequence();
    }
    
    private async playBootSequence(): Promise<void> {
        const api = this.shell.api;
        
        // Hide chrome initially
        await api.chrome.enterCinematicMode();
        
        // Show boot animation
        await this.showBootAnimation();
        
        // Gradually reveal chrome
        await api.statusBar.setTemporaryMessage('Initializing...', 1000);
        await api.chrome.fadeIn(500);
        
        // Show welcome toast
        api.toast.success('Welcome to UV7 OS');
    }
}
```

### Example 3: Dynamic App (Runtime Updates)

```typescript
class ShowcaseApp extends BaseApp {
    private currentPhase: number = 0;
    
    getChromeSpecs(): ChromeSpecs {
        return {
            statusBar: {
                title: 'Showcase',
                breadcrumbPath: ['Showcase', 'Home'],
                actions: [
                    { id: 'theme', icon: '🌙', label: 'Toggle Theme', onClick: () => this.toggleTheme() }
                ]
            },
            sidebar: {
                title: '📖 SHOWCASE',
                sections: this.generateSidebarSections()
            }
        };
    }
    
    async navigateToPhase(phase: number): Promise<void> {
        this.currentPhase = phase;
        
        const api = this.shell.api;
        
        // Update status bar temporarily
        await api.statusBar.setTemporaryMessage(`Loading Phase ${phase}...`, 1000);
        
        // Update sidebar section
        api.sidebar.updateSection('navigation', this.generatePhaseNavigation());
        
        // Load phase content
        await this.loadPhaseContent(phase);
        
        // Show completion toast
        api.toast.show(`Phase ${phase} loaded`);
    }
}
```

---

## 🚀 Migration Path

### Phase 1: Foundation (Week 1)

- [ ] Create `SystemAPI` interface in `UV7System.ts`
- [ ] Implement basic runtime methods:
  - `statusBar.setTemporaryMessage()`
  - `chrome.fadeIn()` / `fadeOut()`
  - `sidebar.open()` / `close()` / `toggle()`
  - `toast.show()`
- [ ] Expose API via `system.getAPI()`
- [ ] Update `BaseApp` to receive `api` reference

### Phase 2: Spec Enhancement (Week 2)

- [ ] Add `ShadeSpec` interface
- [ ] Enhance `StatusBarSpec` with actions and modes
- [ ] Enhance `SidebarSpec` with sections
- [ ] Create spec renderer methods in `UV7System`

### Phase 3: Showcase Migration (Week 3)

- [ ] Refactor showcase to use specs + runtime API
- [ ] Extract chrome definitions to `showcase/chrome/`
- [ ] Implement chrome registration for shell mode
- [ ] Test standalone and shell modes

### Phase 4: Other Apps (Week 4+)

- [ ] Migrate landing page (cinematic focus)
- [ ] Migrate V1/V2 apps (simple specs)
- [ ] Migrate Torigatchi (dynamic updates)
- [ ] Document patterns and best practices

---

## 📊 Success Metrics

### Developer Experience

- ✅ Adding new app requires only providing specs
- ✅ Chrome changes in standalone auto-reflect in shell
- ✅ No direct `system` method calls (all via `api`)

### Code Quality

- ✅ Zero chrome duplication between modes
- ✅ All chrome logic in app's own directory
- ✅ Clear separation: specs (what) vs API (how)

### User Experience

- ✅ Consistent chrome behavior across all apps
- ✅ Smooth transitions and cinematic moments
- ✅ No visual glitches between standalone/shell

---

## ✅ Solved Patterns (Belle's Contributions)

### 1. Action ID & Signal Pattern (Function Serialization SOLVED)

**The Challenge**: Cannot send `onClick: () => this.doStuff()` via `postMessage`.

**The Solution**: Treat chrome as a **Remote Control** - send action IDs, not functions.

#### How It Works

**Step 1: Apps declare action IDs in specs**

```typescript
interface StatusBarAction {
    id: string;  // e.g., 'showcase:theme_toggle', 'v1:save_game'
    icon: string;
    label: string;
    // NO onClick function!
}

// In app spec
actions: [
    { id: 'showcase:theme_toggle', icon: '🌙', label: 'Toggle Theme' },
    { id: 'showcase:save_progress', icon: '💾', label: 'Save Progress' }
]
```

**Step 2: Shell emits events when user clicks**

```typescript
// In UV7System when action button is clicked
private handleActionClick(actionId: string): void {
    // Emit event to app
    window.dispatchEvent(new CustomEvent('uv7:action-triggered', {
        detail: { actionId }
    }));
    
    // For iframe apps, send via postMessage
    if (this.currentAppIsIframe) {
        this.currentAppIframe.contentWindow.postMessage({
            type: 'uv7:action-triggered',
            actionId
        }, '*');
    }
}
```

**Step 3: Apps register action handlers (The "Router")**

```typescript
// In app initialization
class ShowcaseApp extends BaseApp {
    async mount(container: HTMLElement, params: Record<string, any>): Promise<void> {
        await super.mount(container, params);
        
        // Register action handlers
        this.api.onAction('showcase:theme_toggle', () => this.toggleTheme());
        this.api.onAction('showcase:save_progress', () => this.saveProgress());
    }
}

// SystemAPI includes:
interface SystemAPI {
    // ... other methods ...
    
    // Action handler registration
    onAction(actionId: string, handler: () => void): void;
    offAction(actionId: string): void;
}
```

#### Benefits ✅

- **Secure**: No `eval()`, no function serialization
- **Decoupled**: Shell doesn't care what `'save_game'` does
- **Bidirectional**: Works over `postMessage` seamlessly
- **Namespaced**: Use `'appId:actionName'` to prevent collisions

#### Updated Interfaces

```typescript
interface StatusBarSpec {
    title: string;
    context?: string;
    showBreadcrumb?: boolean;
    breadcrumbPath?: string[];
    actions?: StatusBarAction[];  // Now uses action IDs!
    mode?: 'normal' | 'cinematic' | 'minimal';
    theme?: ChromeTheme;  // NEW: See Theme Injection below
}

interface StatusBarAction {
    id: string;  // Namespaced: 'appId:actionName'
    icon: string;
    label: string;
    // NO onClick - handled via onAction() registration
}

interface SidebarItem {
    type: 'button' | 'link' | 'divider' | 'custom';
    icon?: string;
    label?: string;
    actionId?: string;  // NEW: Instead of action: () => void
    href?: string;
    customContent?: HTMLElement;
}
```

---

### 2. Theme Injection (Seamless App Transitions)

**The Vision**: The OS "chameleons" into the app it's running. When you load V1, the entire chrome morphs to V1's aesthetic. When you switch to V2, it smoothly transitions to V2's palette.

**The Result**: Users feel like the entire computer has changed modes, not just the iframe.

#### ChromeTheme Interface

```typescript
interface ChromeTheme {
    // Core colors
    primaryColor: string;    // e.g., "#ff0055" for V1, "#00ff88" for V2
    accentColor: string;     // Secondary/highlight color
    
    // Typography
    fontFamily?: string;     // "Courier New" vs "Inter"
    
    // Status bar appearance
    statusBarVariant?: 'light' | 'dark' | 'auto';
    
    // Transition behavior
    transitionDuration?: number;  // How fast to chameleon (ms), default 300
}
```

#### Usage in Specs

```typescript
class V1App extends BaseApp {
    getChromeSpecs(): ChromeSpecs {
        return {
            statusBar: {
                title: 'V1 Game',
                theme: {
                    primaryColor: '#ff0055',
                    accentColor: '#ff66aa',
                    fontFamily: 'Courier New, monospace',
                    statusBarVariant: 'dark',
                    transitionDuration: 500  // Slower, dramatic transition
                }
            },
            // ... sidebar, shade ...
        };
    }
}

class V2App extends BaseApp {
    getChromeSpecs(): ChromeSpecs {
        return {
            statusBar: {
                title: 'V2 Engine',
                theme: {
                    primaryColor: '#00ff88',
                    accentColor: '#00ccff',
                    fontFamily: 'Inter, sans-serif',
                    statusBarVariant: 'dark',
                    transitionDuration: 300  // Snappy, modern
                }
            },
            // ... sidebar, shade ...
        };
    }
}
```

#### Implementation in UV7System

```typescript
class UV7System {
    private applyTheme(theme: ChromeTheme): void {
        const duration = theme.transitionDuration || 300;
        
        // Set CSS custom properties with transition
        document.documentElement.style.setProperty('--transition-duration', `${duration}ms`);
        document.documentElement.style.setProperty('--chrome-primary', theme.primaryColor);
        document.documentElement.style.setProperty('--chrome-accent', theme.accentColor);
        
        if (theme.fontFamily) {
            document.documentElement.style.setProperty('--chrome-font', theme.fontFamily);
        }
        
        // Apply variant class
        if (theme.statusBarVariant) {
            document.body.classList.remove('status-light', 'status-dark', 'status-auto');
            document.body.classList.add(`status-${theme.statusBarVariant}`);
        }
    }
}
```

#### CSS Support

```css
/* In shell.css or uv7-os.css */
:root {
    --transition-duration: 300ms;
    --chrome-primary: #00ff88;
    --chrome-accent: #00ccff;
    --chrome-font: 'Inter', sans-serif;
}

#uv7-status-bar,
#uv7-sidebar,
#uv7-shade {
    transition: 
        background-color var(--transition-duration) ease,
        color var(--transition-duration) ease,
        border-color var(--transition-duration) ease;
    
    background-color: var(--chrome-primary);
    font-family: var(--chrome-font);
}

/* Accent elements */
.status-bar-action:hover,
.sidebar-item:hover {
    background-color: var(--chrome-accent);
}
```

#### Benefits ✅

- **Seamless Transitions**: No jarring color changes
- **App Identity**: Each app feels unique
- **User Delight**: The OS feels alive and responsive
- **Easy to Implement**: Just CSS custom properties + transitions

---

## 🤔 Remaining Open Questions

1. **Spec Versioning**: How to handle spec evolution?
   - Add `specVersion` field?
   - Maintain backward compatibility?

2. **Performance**: Does message passing add noticeable latency?
   - Benchmark chrome registration time
   - Consider caching rendered specs

3. **TypeScript**: How to share types between app and shell?
   - Shared `types/` directory?
   - Publish as internal package?

---

## 📚 Related Documents

- [UV7 Shell Architecture](./SHELL_ARCHITECTURE.md) *(to be created)*
- [BaseApp Lifecycle](./BASE_APP_LIFECYCLE.md) *(to be created)*
- [Chrome Components](./CHROME_COMPONENTS.md) *(to be created)*

---

## 💬 Feedback & Iteration

This is a **living document**. As we implement and learn, we'll update this design.

**Key Principle**: "Always. Always. Always." - Tori's wisdom applies here too. We iterate, we refine, we perfect.

---

*Last Updated: 2026-02-04*
*Status: 🟡 Design Phase - Ready for Implementation*
