/**
 * UV7Shell Tests
 *
 * Tests for the UV7 OS shell controller.
 * Ensures app loading, navigation, and UI controls work correctly.
 *
 * 848 is sacred. 💚🔥💀
 */

import { UV7Shell } from './UV7Shell';
import { AppSwitcherController } from './controllers/AppSwitcherController';
import type { BaseApp } from './apps/BaseApp';

// Mock BaseApp
class _MockApp implements Partial<BaseApp> {
    shell: UV7Shell;
    id: string = 'mock';
    container: HTMLElement | null = null;
    mounted: boolean = false;
    gestureHandlers: any = null;

    constructor(shell: UV7Shell) {
        this.shell = shell;
    }

    async mount(container: HTMLElement, _params: Record<string, string> = {}): Promise<void> {
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

    onRouteChange(_params: Record<string, string>): void {
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

    restoreState(_state: Record<string, unknown>): void {
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

        // Populate elements cache (private) so shade/sidebar/appSwitcher methods work
        // without calling the full init() which bootstraps UV7System, ToriService, etc.
        (shell as any)['cacheElements']();

        // Create AppSwitcherController with cached elements so app-switcher tests work
        const elements = (shell as any)['elements'];
        shell.appSwitcher = new AppSwitcherController(
            { currentApp: null, navigateTo: () => {} },
            elements
        );
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
        it('should delegate to system toast API', () => {
            // showToast delegates to this.system?.getAPI().toast.show()
            // Mock the system API chain
            const mockShow = vi.fn();
            shell.system = {
                getAPI: () => ({ toast: { show: mockShow } })
            } as any;

            shell.showToast('Test message');

            expect(mockShow).toHaveBeenCalledWith('Test message');
        });

        it('should not throw when system is null', () => {
            // system is null by default (init not called)
            expect(() => shell.showToast('Safe call')).not.toThrow();
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

            // Register a fake app that hangs so we can inspect mid-load state
            let resolveMount!: () => void;
            const mountPromise = new Promise<void>(r => { resolveMount = r; });
            (shell as any).appRegistry.set('test-app', () => Promise.resolve({
                default: class {
                    id = 'test-app';
                    async mount(container: HTMLElement) {
                        await mountPromise;
                        container.innerHTML = '<div>Test</div>';
                    }
                    async unmount() {}
                    onRouteChange() {}
                    getStatusBarConfig() { return { title: 'Test' }; }
                    getSidebarConfig() { return null; }
                }
            }));

            // Start loading
            const loadPromise = shell.loadApp('test-app');

            // Check immediately if transitioning class is added
            expect(viewport?.classList.contains('app-transitioning')).toBe(true);

            // Let mount complete
            resolveMount();
            await loadPromise.catch(() => {});
        });

        it('should display loading state during app load', async () => {
            const viewport = document.getElementById('app-viewport');

            // Register a fake app that hangs
            let resolveMount!: () => void;
            const mountPromise = new Promise<void>(r => { resolveMount = r; });
            (shell as any).appRegistry.set('test-app', () => Promise.resolve({
                default: class {
                    id = 'test-app';
                    async mount(container: HTMLElement) {
                        await mountPromise;
                        container.innerHTML = '<div>Test</div>';
                    }
                    async unmount() {}
                    onRouteChange() {}
                    getStatusBarConfig() { return { title: 'Test' }; }
                    getSidebarConfig() { return null; }
                }
            }));

            // Start loading
            const loadPromise = shell.loadApp('test-app');

            // Check if loading state is shown
            expect(viewport?.innerHTML).toContain('Loading');
            expect(viewport?.innerHTML).toContain('loading-spinner');

            // Let mount complete
            resolveMount();
            await loadPromise.catch(() => {});
        });

        it('should remove transitioning class after load', async () => {
            const viewport = document.getElementById('app-viewport');

            // Register a fake app that resolves immediately
            (shell as any).appRegistry.set('test-app', () => Promise.resolve({
                default: class {
                    id = 'test-app';
                    async mount(container: HTMLElement) {
                        container.innerHTML = '<div>Test</div>';
                    }
                    async unmount() {}
                    onRouteChange() {}
                    getStatusBarConfig() { return { title: 'Test' }; }
                    getSidebarConfig() { return null; }
                }
            }));

            // Load and wait for completion
            await shell.loadApp('test-app').catch(() => {});

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
