import { KeyboardController } from './KeyboardController';
import { EventBus } from './EventBus';

describe('KeyboardController', () => {
    let eventBus: EventBus;

    function dispatchKey(key: string, opts: Partial<KeyboardEventInit> = {}): void {
        document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...opts }));
    }

    beforeEach(() => {
        document.body.innerHTML = '';
        eventBus = new EventBus();
        // Constructor binds keydown listener immediately
        new KeyboardController(eventBus);
    });

    // ========================================
    // SINGLE KEY SHORTCUTS
    // ========================================

    describe('Single Key Shortcuts', () => {
        it('should emit ui:notes:open on N key', () => {
            const spy = vi.fn();
            eventBus.on('ui:notes:open', spy);

            dispatchKey('n');
            expect(spy).toHaveBeenCalled();
        });

        it('should emit ui:hide_hud on H key', () => {
            const spy = vi.fn();
            eventBus.on('ui:hide_hud', spy);

            dispatchKey('h');
            expect(spy).toHaveBeenCalled();
        });
    });

    // ========================================
    // CTRL SHORTCUTS
    // ========================================

    describe('Ctrl Shortcuts', () => {
        it('should emit save:quick on Ctrl+S', () => {
            const spy = vi.fn();
            eventBus.on('save:quick', spy);

            dispatchKey('s', { ctrlKey: true });
            expect(spy).toHaveBeenCalled();
        });

        it('should emit load:quick on Ctrl+L', () => {
            const spy = vi.fn();
            eventBus.on('load:quick', spy);

            dispatchKey('l', { ctrlKey: true });
            expect(spy).toHaveBeenCalled();
        });
    });

    // ========================================
    // OVERLAY BLOCKS SHORTCUTS
    // ========================================

    describe('Overlay Blocking', () => {
        it('should NOT emit shortcuts when an overlay is visible', () => {
            // Create a visible overlay
            const overlay = document.createElement('div');
            overlay.id = 'notes-overlay';
            overlay.style.display = 'block';
            document.body.appendChild(overlay);

            const spy = vi.fn();
            eventBus.on('ui:notes:open', spy);

            dispatchKey('n');
            expect(spy).not.toHaveBeenCalled();
        });

        it('should still handle Escape when overlays are open', () => {
            // Create a visible overlay
            const devConsole = document.createElement('div');
            devConsole.id = 'dev-console';
            devConsole.style.display = 'block';
            document.body.appendChild(devConsole);

            const spy = vi.fn();
            eventBus.on('ui:console:close', spy);

            dispatchKey('Escape');
            expect(spy).toHaveBeenCalled();
        });
    });

    // ========================================
    // ESCAPE PRIORITY STACK
    // ========================================

    describe('Escape Priority Stack', () => {
        it('should close dev console first (highest priority)', () => {
            const devConsole = document.createElement('div');
            devConsole.id = 'dev-console';
            devConsole.style.display = 'block';
            document.body.appendChild(devConsole);

            const notes = document.createElement('div');
            notes.id = 'notes-viewer-overlay';
            notes.style.display = 'block';
            document.body.appendChild(notes);

            const consoleSpy = vi.fn();
            const notesSpy = vi.fn();
            eventBus.on('ui:console:close', consoleSpy);
            eventBus.on('ui:notes:close', notesSpy);

            dispatchKey('Escape');

            expect(consoleSpy).toHaveBeenCalled();
            expect(notesSpy).not.toHaveBeenCalled();
        });

        it('should close notes overlay when dev console is not open', () => {
            const notes = document.createElement('div');
            notes.id = 'notes-viewer-overlay';
            notes.style.display = 'block';
            document.body.appendChild(notes);

            const spy = vi.fn();
            eventBus.on('ui:notes:close', spy);

            dispatchKey('Escape');
            expect(spy).toHaveBeenCalled();
        });

        it('should close backlog when higher priority overlays are not open', () => {
            const backlog = document.createElement('div');
            backlog.id = 'backlog-overlay';
            backlog.style.display = 'block';
            document.body.appendChild(backlog);

            const spy = vi.fn();
            eventBus.on('ui:backlog:close', spy);

            dispatchKey('Escape');
            expect(spy).toHaveBeenCalled();
        });

        it('should close settings when no higher priority overlays exist', () => {
            const settings = document.createElement('div');
            settings.id = 'settings-menu';
            settings.style.display = 'block';
            document.body.appendChild(settings);

            const spy = vi.fn();
            eventBus.on('settings:close', spy);

            dispatchKey('Escape');
            expect(spy).toHaveBeenCalled();
        });

        it('should toggle sidebar/shade when nothing else is open and in game', () => {
            const layout = document.createElement('div');
            layout.id = 'game-layout';
            document.body.appendChild(layout);

            const sidebarSpy = vi.fn();
            const shadeSpy = vi.fn();
            eventBus.on('ui:sidebar:toggle', sidebarSpy);
            eventBus.on('ui:shade:toggle', shadeSpy);

            // Mock landscape orientation
            Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
            Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });

            dispatchKey('Escape');
            expect(sidebarSpy).toHaveBeenCalled();
        });
    });

    // ========================================
    // EDGE CASES
    // ========================================

    describe('Edge Cases', () => {
        it('should not crash on unrecognized keys', () => {
            expect(() => dispatchKey('F13')).not.toThrow();
        });

        it('should ignore modified keys for single-key shortcuts', () => {
            const spy = vi.fn();
            eventBus.on('ui:notes:open', spy);

            // Alt+N should not trigger notes
            dispatchKey('n', { altKey: true });
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
