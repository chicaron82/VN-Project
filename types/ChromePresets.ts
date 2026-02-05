/**
 * ═══════════════════════════════════════════════════════════════
 * CHROME PRESETS - CONVENIENCE HELPERS
 * 
 * Provides pre-configured chrome specs for common use cases.
 * Makes it easy for apps to use standard configurations without
 * manually constructing StatusBarSpec objects.
 * ═══════════════════════════════════════════════════════════════
 */

import type { StatusBarSpec, StatusBarAction, ChromeTheme } from './chrome.js';

export class ChromePresets {
    /**
     * Standard chrome configuration
     * 
     * Full-featured chrome with title, context, actions, and optional theme.
     * Best for most apps that need action buttons and branding.
     * 
     * @param opts - Configuration options
     * @returns StatusBarSpec with all features
     * 
     * @example
     * getStatusBarSpec() {
     *   return ChromePresets.standard({
     *     title: 'My App',
     *     context: 'Ready',
     *     actions: [
     *       { id: 'myapp:settings', icon: '⚙️', label: 'Settings' },
     *       { id: 'myapp:share', icon: '📤', label: 'Share' }
     *     ],
     *     theme: {
     *       primaryColor: '#6366f1',
     *       accentColor: '#818cf8'
     *     }
     *   });
     * }
     */
    static standard(opts: {
        title: string;
        context?: string;
        actions?: StatusBarAction[];
        theme?: ChromeTheme;
    }): StatusBarSpec {
        return {
            title: opts.title,
            context: opts.context,
            actions: opts.actions,
            theme: opts.theme,
            mode: 'normal'
        };
    }

    /**
     * Minimal chrome configuration
     * 
     * Just title and context, no action buttons.
     * Best for simple apps or content-focused experiences.
     * 
     * @param title - App title
     * @param context - Optional context text
     * @returns StatusBarSpec in minimal mode
     * 
     * @example
     * getStatusBarSpec() {
     *   return ChromePresets.minimal('My App', 'Reading mode');
     * }
     */
    static minimal(title: string, context?: string): StatusBarSpec {
        return {
            title,
            context,
            mode: 'minimal'
        };
    }

    /**
     * Cinematic chrome configuration
     * 
     * Hidden chrome for immersive, full-screen experiences.
     * Chrome fades out automatically. Best for games, videos, or story modes.
     * 
     * @param title - App title (for when chrome is briefly visible)
     * @returns StatusBarSpec in cinematic mode
     * 
     * @example
     * getStatusBarSpec() {
     *   return ChromePresets.cinematic('Visual Novel');
     * }
     */
    static cinematic(title: string): StatusBarSpec {
        return {
            title,
            mode: 'cinematic'
        };
    }

    /**
     * Game chrome configuration
     * 
     * Optimized for games with custom branding and minimal distractions.
     * Includes theme colors but no action buttons by default.
     * 
     * @param opts - Game configuration
     * @returns StatusBarSpec with game-optimized settings
     * 
     * @example
     * getStatusBarSpec() {
     *   return ChromePresets.game({
     *     title: 'Version 848',
     *     primaryColor: '#ff0055',
     *     accentColor: '#ff3377',
     *     context: 'Chapter 1'
     *   });
     * }
     */
    static game(opts: {
        title: string;
        primaryColor: string;
        accentColor: string;
        context?: string;
        actions?: StatusBarAction[];
    }): StatusBarSpec {
        return {
            title: opts.title,
            context: opts.context,
            actions: opts.actions,
            mode: 'minimal',
            theme: {
                primaryColor: opts.primaryColor,
                accentColor: opts.accentColor,
                transitionDuration: 200 // Fast transitions for games
            }
        };
    }

    /**
     * Custom chrome with theme
     * 
     * Full control over all chrome properties with theme injection.
     * Best when you need fine-grained control but want theme helpers.
     * 
     * @param spec - Base StatusBarSpec
     * @param theme - ChromeTheme to inject
     * @returns StatusBarSpec with theme applied
     * 
     * @example
     * getStatusBarSpec() {
     *   return ChromePresets.withTheme(
     *     {
     *       title: 'My App',
     *       actions: [...]
     *     },
     *     {
     *       primaryColor: '#6366f1',
     *       accentColor: '#818cf8',
     *       fontFamily: 'Inter, sans-serif'
     *     }
     *   );
     * }
     */
    static withTheme(spec: StatusBarSpec, theme: ChromeTheme): StatusBarSpec {
        return {
            ...spec,
            theme
        };
    }

    /**
     * Quick action helper
     * 
     * Creates a properly formatted action object with validation.
     * Ensures action ID follows the 'app:action' pattern.
     * 
     * @param appId - App identifier (lowercase, alphanumeric + underscore)
     * @param actionName - Action name (lowercase, alphanumeric + underscore)
     * @param icon - Emoji or icon character
     * @param label - Human-readable label
     * @returns StatusBarAction
     * 
     * @example
     * const actions = [
     *   ChromePresets.action('myapp', 'settings', '⚙️', 'Settings'),
     *   ChromePresets.action('myapp', 'share', '📤', 'Share')
     * ];
     */
    static action(
        appId: string,
        actionName: string,
        icon: string,
        label: string
    ): StatusBarAction {
        // Validate format
        if (!appId.match(/^[a-z0-9_]+$/)) {
            throw new Error(
                `Invalid appId: "${appId}". ` +
                `Must be lowercase alphanumeric + underscore`
            );
        }
        if (!actionName.match(/^[a-z0-9_]+$/)) {
            throw new Error(
                `Invalid actionName: "${actionName}". ` +
                `Must be lowercase alphanumeric + underscore`
            );
        }

        return {
            id: `${appId}:${actionName}`,
            icon,
            label
        };
    }
}

export default ChromePresets;
