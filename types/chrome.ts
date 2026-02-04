/**
 * ═══════════════════════════════════════════════════════════════
 * UV7 CHROME - SHARED TYPE DEFINITIONS
 * 
 * Shared types for chrome specs and SystemAPI.
 * Used by both shell and apps to ensure type consistency.
 * 
 * PHILOSOPHY:
 * - Declarative specs define chrome structure
 * - Runtime API provides controlled imperative actions
 * - Action ID pattern for serializable event handling
 * ═══════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// CHROME SPECS (Declarative Layer)
// ═══════════════════════════════════════════════════════════════

/**
 * Chrome theme for seamless app transitions
 * Apps can inject their visual identity into the OS chrome
 */
export interface ChromeTheme {
    primaryColor: string;       // Main chrome color (e.g., "#ff0055" for V1)
    accentColor: string;        // Highlight/hover color
    fontFamily?: string;        // Typography (e.g., "Courier New" vs "Inter")
    statusBarVariant?: 'light' | 'dark' | 'auto';
    transitionDuration?: number; // Transition speed in ms (default 300)
}

/**
 * Status bar action button (uses Action ID pattern)
 */
export interface StatusBarAction {
    id: string;      // Namespaced: 'appId:actionName' (e.g., 'showcase:theme_toggle')
    icon: string;    // Emoji or icon character
    label: string;   // Accessible label
}

/**
 * Status bar specification
 */
export interface StatusBarSpec {
    title: string;
    context?: string;
    showBreadcrumb?: boolean;
    breadcrumbPath?: string[];
    actions?: StatusBarAction[];
    mode?: 'normal' | 'cinematic' | 'minimal';
    theme?: ChromeTheme;
}

/**
 * Sidebar item types
 */
export interface SidebarItem {
    type: 'button' | 'link' | 'divider' | 'custom';
    icon?: string;
    label?: string;
    actionId?: string;           // For buttons: 'app:action'
    href?: string;               // For links
    customContent?: HTMLElement; // For custom items
}

/**
 * Sidebar section
 */
export interface SidebarSection {
    title?: string;
    items: SidebarItem[];
}

/**
 * Sidebar specification
 */
export interface SidebarSpec {
    title: string;
    sections?: SidebarSection[];
    content?: string | HTMLElement; // Escape hatch for custom content
    init?: () => void;
}

/**
 * Shade setting types
 */
export interface ShadeSetting {
    type: 'toggle' | 'slider' | 'select' | 'custom';
    id: string;
    label: string;
    value?: any;
    onChange?: (value: any) => void;
    options?: { label: string; value: any }[];
    customContent?: HTMLElement;
}

/**
 * Shade section
 */
export interface ShadeSection {
    title?: string;
    settings: ShadeSetting[];
}

/**
 * Shade specification
 */
export interface ShadeSpec {
    title: string;
    sections?: ShadeSection[];
    content?: string | HTMLElement; // Escape hatch
}

/**
 * Complete chrome specs for an app
 */
export interface ChromeSpecs {
    statusBar?: StatusBarSpec;
    sidebar?: SidebarSpec;
    shade?: ShadeSpec;
}

// ═══════════════════════════════════════════════════════════════
// SYSTEM API (Runtime Layer)
// ═══════════════════════════════════════════════════════════════

/**
 * Toast notification options
 */
export interface ToastOptions {
    duration?: number;
    icon?: string;
    action?: { label: string; onClick: () => void };
}

/**
 * System API - Controlled runtime interface for chrome manipulation
 * Apps use this instead of calling system methods directly
 */
export interface SystemAPI {
    // Status Bar Runtime Control
    statusBar: {
        setTemporaryMessage(msg: string, duration?: number): Promise<void>;
        showProgress(percent: number, label?: string): void;
        clearProgress(): void;
        pulse(duration?: number): void;
    };

    // Chrome Visibility & Transitions
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

    // Sidebar Control
    sidebar: {
        open(): void;
        close(): void;
        toggle(): void;
        isOpen(): boolean;
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

    // Action Handler Registration (Belle's Action ID Pattern)
    onAction(actionId: string, handler: () => void): void;
    offAction(actionId: string): void;
}
