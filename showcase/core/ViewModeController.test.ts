import { initViewMode } from './ViewModeController';

// Mock Logger to avoid import issues
vi.mock('@utils/Logger', () => ({
    Logger: {
        ui: vi.fn(),
        system: vi.fn(),
    }
}));

describe('ViewModeController', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        document.body.innerHTML = '';
        delete document.body.dataset.viewMode;
    });

    it('should initialize with story mode by default', () => {
        initViewMode();
        expect(document.body.dataset.viewMode).toBe('story');
    });

    it('should restore saved mode from localStorage', () => {
        localStorage.setItem('uv7-view-mode', 'dev');
        initViewMode();
        expect(document.body.dataset.viewMode).toBe('dev');
    });

    it('should persist mode to localStorage', () => {
        initViewMode();
        expect(localStorage.getItem('uv7-view-mode')).toBe('story');
    });

    it('should toggle mode on button click', () => {
        document.body.innerHTML = '<button data-action="toggle-mode"><span class="quick-action-label">Switch to Dev</span></button>';
        initViewMode();

        expect(document.body.dataset.viewMode).toBe('story');

        const btn = document.querySelector('[data-action="toggle-mode"]') as HTMLElement;
        btn.click();

        expect(document.body.dataset.viewMode).toBe('dev');
    });

    it('should update button label on toggle', () => {
        document.body.innerHTML = '<button data-action="toggle-mode"><span class="quick-action-label">Switch to Dev</span></button>';
        initViewMode();

        const label = document.querySelector('.quick-action-label');
        expect(label?.textContent).toBe('Switch to Dev');

        const btn = document.querySelector('[data-action="toggle-mode"]') as HTMLElement;
        btn.click();

        expect(label?.textContent).toBe('Switch to Story');
    });

    it('should expose toggleViewMode on window for keyboard-driven toggling', () => {
        initViewMode();
        expect(document.body.dataset.viewMode).toBe('story');

        // Use the exposed function directly (keyboard handler is hard to test in jsdom)
        (window as any).toggleViewMode();
        expect(document.body.dataset.viewMode).toBe('dev');

        (window as any).toggleViewMode();
        expect(document.body.dataset.viewMode).toBe('story');
    });

    it('should handle dedicated mode buttons', () => {
        document.body.innerHTML = `
            <button class="mode-btn" data-mode="dev">Dev</button>
            <button class="mode-btn" data-mode="story">Story</button>
        `;
        initViewMode();

        const devBtn = document.querySelector('[data-mode="dev"]') as HTMLElement;
        devBtn.click();
        expect(document.body.dataset.viewMode).toBe('dev');

        const storyBtn = document.querySelector('[data-mode="story"]') as HTMLElement;
        storyBtn.click();
        expect(document.body.dataset.viewMode).toBe('story');
    });

    it('should set window.toggleViewMode function', () => {
        initViewMode();
        expect((window as any).toggleViewMode).toBeDefined();
        expect(typeof (window as any).toggleViewMode).toBe('function');
    });
});
