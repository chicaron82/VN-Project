import { DialogBubble } from './DialogBubble';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn() },
    style: {},
    innerHTML: '',
    textContent: '',
    appendChild: vi.fn(),
    remove: vi.fn(),
    parentNode: { removeChild: vi.fn() }, // to satisfy isVisible check
    addEventListener: vi.fn()
};
(global as any).document.createElement = vi.fn().mockReturnValue(mockElement);
(global as any).document.body.appendChild = vi.fn();
(global as any).document.querySelectorAll = vi.fn().mockReturnValue([]);

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

describe('DialogBubble', () => {
    let instance: DialogBubble;

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
            instance = new DialogBubble(mockEventBus as any);
            expect(instance).toBeDefined();
        });
    });

    describe('Core Functionality', () => {
        it('should show bubble', () => {
            instance = new DialogBubble(mockEventBus as any);
            instance.show({ text: 'Hello', position: 'center' });

            expect(document.createElement).toHaveBeenCalledWith('div');
            expect(document.body.appendChild).toHaveBeenCalled(); // with mockElement
            expect(mockElement.textContent).toBe('Hello');
            expect(mockEventBus.emit).toHaveBeenCalledWith('dialog:bubble:shown', expect.any(Object));
        });

        it('should auto-dismiss', () => {
            instance = new DialogBubble(mockEventBus as any);
            instance.show({ text: 'Hi', duration: 1000 });

            expect(mockElement.remove).not.toHaveBeenCalled();
            vi.advanceTimersByTime(1000 + 50);
            expect(mockElement.remove).toHaveBeenCalled();
        });
    });
});
