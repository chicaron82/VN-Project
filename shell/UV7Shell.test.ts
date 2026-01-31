/**
 * UV7Shell Tests
 *
 * Tests for the UV7 OS shell controller.
 * Ensures app loading, navigation, and UI controls work correctly.
 *
 * 848 is sacred. 💚🔥💀
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UV7Shell } from './UV7Shell';
import type { BaseApp } from './apps/BaseApp';

// Mock BaseApp
class MockApp implements Partial<BaseApp> {
    shell: UV7Shell;
    id: string = 'mock';
    container: HTMLElement | null = null;
    mounted: boolean = false;
    gestureHandlers: any = null;

    constructor(shell: UV7Shell) {
        this.shell = shell;
    }

    async mount(container: HTMLElement, params: Record<string, any> = {}): Promise<void> {
        this.container = container;
        this.mounted = true;
        container.innerHTML = '<div>Mock App Content</div>';
    }

    async unmount(): Promise<void> {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.mounted = false;
    }

    onRouteChange(params: Record<string, any>): void {
        // Mock implementation
    }

    getStatusBarConfig() {
        return { title: 'Mock App', context: 'Mock Context' };
    }

    getSidebarConfig() {
        return null;
    }

    getState() {
        return {};
    }

    restoreState(state: Record<string, any>): void {
        // Mock implementation
    }
}

describe('UV7Shell', () => {
    let shell: UV7Shell;

    beforeEach(() => {
        // Set up DOM elements that UV7Shell expects
        document.body.innerHTML = `
            <div id="app-viewport"></div>
            <div id="uv7-status-bar"></div>
            <div id="uv7-context"></div>
            <div id="uv7-shade"></div>
            <div id="uv7-sidebar"></div>
            <div id="uv7-backdrop"></div>
            <div id="uv7-app-switcher">
                <div id="app-cards-grid"></div>
            </div>
            <div class="status-logo"></div>
            <div id="uv7-settings"></div>
        `;

        shell = new UV7Shell();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        window.location.hash = '';
    });

    describe('Constructor', () => {
        it('should create a shell instance with null currentApp', () => {
            expect(shell.currentApp).toBeNull();
        });

        it('should initialize gestureRouter', () => {
            expect(shell.gestureRouter).toBeDefined();
        });

        it('should initialize router', () => {
            expect(shell.router).toBeDefined();
        });

        it('should start with system as null', () => {
            expect(shell.system).toBeNull();
        });
    });

    describe('navigateTo', () => {
        it('should call router.navigate with correct params', () => {
            const navigateSpy = vi.spyOn(shell.router, 'navigate');

            shell.navigateTo('showcase');

            expect(navigateSpy).toHaveBeenCalledWith('showcase', {});
        });

        it('should pass parameters to router', () => {
            const navigateSpy = vi.spyOn(shell.router, 'navigate');

            shell.navigateTo('showcase', { phase: '42' });

            expect(navigateSpy).toHaveBeenCalledWith('showcase', { phase: '42' });
        });
    });

    describe('Shade Controls', () => {
        it('openShade should add open class to shade', () => {
            const shade = document.getElementById('uv7-shade');

            shell.openShade();

            expect(shade?.classList.contains('open')).toBe(true);
        });

        it('openShade should show backdrop', () => {
            const backdrop = document.getElementById('uv7-backdrop');

            shell.openShade();

            expect(backdrop?.classList.contains('visible')).toBe(true);
        });

        it('closeShade should remove open class from shade', () => {
            const shade = document.getElementById('uv7-shade');
            shade?.classList.add('open');

            shell.closeShade();

            expect(shade?.classList.contains('open')).toBe(false);
        });

        it('closeShade should hide backdrop', () => {
            const backdrop = document.getElementById('uv7-backdrop');
            backdrop?.classList.add('visible');

            shell.closeShade();

            expect(backdrop?.classList.contains('visible')).toBe(false);
        });
    });

    describe('Sidebar Controls', () => {
        it('openSidebar should add open class to sidebar', () => {
            const sidebar = document.getElementById('uv7-sidebar');

            shell.openSidebar();

            expect(sidebar?.classList.contains('open')).toBe(true);
        });

        it('closeSidebar should remove open class from sidebar', () => {
            const sidebar = document.getElementById('uv7-sidebar');
            sidebar?.classList.add('open');

            shell.closeSidebar();

            expect(sidebar?.classList.contains('open')).toBe(false);
        });

        it('toggleSidebar should toggle open class', () => {
            const sidebar = document.getElementById('uv7-sidebar');

            // First toggle - should open
            shell.toggleSidebar();
            expect(sidebar?.classList.contains('open')).toBe(true);

            // Second toggle - should close
            shell.toggleSidebar();
            expect(sidebar?.classList.contains('open')).toBe(false);
        });
    });

    describe('showToast', () => {
        it('should create a toast element', () => {
            shell.showToast('Test message');

            const toasts = document.querySelectorAll('div');
            const toastTexts = Array.from(toasts).map(t => t.textContent);

            expect(toastTexts).toContain('Test message');
        });

        it('should remove toast after timeout', async () => {
            vi.useFakeTimers();

            shell.showToast('Temporary message');

            // Fast-forward time past toast duration
            vi.advanceTimersByTime(2100);

            const toasts = document.querySelectorAll('div');
            const toastTexts = Array.from(toasts).map(t => t.textContent);

            expect(toastTexts).not.toContain('Temporary message');

            vi.useRealTimers();
        });
    });

    describe('App Switcher Controls', () => {
        it('toggleAppSwitcher should toggle open class', () => {
            const switcher = document.getElementById('uv7-app-switcher');

            shell.toggleAppSwitcher();
            expect(switcher?.classList.contains('open')).toBe(true);

            shell.toggleAppSwitcher();
            expect(switcher?.classList.contains('open')).toBe(false);
        });

        it('openAppSwitcher should add open class', () => {
            const switcher = document.getElementById('uv7-app-switcher');

            shell.openAppSwitcher();

            expect(switcher?.classList.contains('open')).toBe(true);
        });

        it('closeAppSwitcher should remove open class', () => {
            const switcher = document.getElementById('uv7-app-switcher');
            switcher?.classList.add('open');

            shell.closeAppSwitcher();

            expect(switcher?.classList.contains('open')).toBe(false);
        });
    });

    describe('loadApp', () => {
        it('should add transitioning class during load', async () => {
            const viewport = document.getElementById('app-viewport');

            // Start loading (this will fail because app doesn't exist, but we can check the class)
            const loadPromise = shell.loadApp('unknown');

            // Check immediately if transitioning class is added
            expect(viewport?.classList.contains('app-transitioning')).toBe(true);

            // Wait for load to complete (will error but that's okay)
            await loadPromise.catch(() => {});
        });

        it('should display loading state during app load', async () => {
            const viewport = document.getElementById('app-viewport');

            // Start loading
            const loadPromise = shell.loadApp('unknown');

            // Check if loading state is shown
            expect(viewport?.innerHTML).toContain('Loading');
            expect(viewport?.innerHTML).toContain('loading-spinner');

            // Wait for load to complete (will error)
            await loadPromise.catch(() => {});
        });

        it('should remove transitioning class after load', async () => {
            const viewport = document.getElementById('app-viewport');

            // Load unknown app (will fail)
            await shell.loadApp('unknown').catch(() => {});

            // Transitioning class should be removed
            expect(viewport?.classList.contains('app-transitioning')).toBe(false);
        });
    });

    describe('removeFromRecent', () => {
        it('should be callable without errors', () => {
            expect(() => {
                shell.removeFromRecent('v1');
            }).not.toThrow();
        });
    });
});
