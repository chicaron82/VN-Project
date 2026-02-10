import { StatusBar } from './StatusBar';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn(), contains: vi.fn() },
    style: { setProperty: vi.fn(), removeProperty: vi.fn() },
    innerHTML: '',
    textContent: '',
    appendChild: vi.fn(),
    prepend: vi.fn(),
    querySelector: vi.fn(),
    dataset: {},
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
};
mockElement.querySelector.mockReturnValue(mockElement);

(global as any).document.createElement = vi.fn().mockReturnValue({ ...mockElement });

// Spy on body.prepend instead of overwriting body
vi.spyOn(document.body, 'prepend').mockImplementation(vi.fn());
(global as any).document.getElementById = vi.fn().mockReturnValue(null);
(global as any).navigator = { vibrate: vi.fn() };

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

// Mock StateManager
const mockStateManager = {
    get: vi.fn(),
    set: vi.fn(),
    subscribe: vi.fn()
};

// Mock Context dependencies
vi.mock('./StatusBarContext', () => ({
    detectContext: vi.fn().mockReturnValue('game'),
    getFeatures: vi.fn().mockReturnValue({
        enableAdaptiveTint: true,
        glassIntensity: 'medium',
        showLoopVersion: true,
        showRoute: true,
        showNotes: true,
        showTether: true,
        showMail: true,
        showBreadcrumbs: true
    }),
    COLOR_TINTS: {
        neutral: { primary: '#fff', glow: '#fff', gradient: '' }
    }
}));

vi.mock('./StatusBarBreadcrumbs', () => ({
    buildBreadcrumbs: vi.fn().mockReturnValue([])
}));

describe('StatusBar', () => {
    let instance: StatusBar;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    describe('Initialization', () => {
        it('should create an instance', () => {
            expect(() => {
                instance = new StatusBar(mockEventBus as any, mockStateManager as any);
            }).not.toThrow();
            expect(instance).toBeDefined();
            expect(document.createElement).toHaveBeenCalledWith('div');
        });
    });

    describe('Core Functionality', () => {
        it('should update route on event', () => {
            instance = new StatusBar(mockEventBus as any, mockStateManager as any);

            const handler = mockEventBus.on.mock.calls.find((c: any) => c[0] === 'ui:route_changed')[1];
            handler({ route: 'tori' });
            expect(mockEventBus.on).toHaveBeenCalledWith('ui:route_changed', expect.any(Function));
        });

        it('should handle paused state', () => {
            instance = new StatusBar(mockEventBus as any, mockStateManager as any);
            instance.setPaused(true);
        });
    });
});
