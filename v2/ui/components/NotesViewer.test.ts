import { NotesViewer } from './NotesViewer';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn(), contains: vi.fn() },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setAttribute: vi.fn(),
    style: {},
    innerHTML: '',
    textContent: '',
    appendChild: vi.fn(),
    querySelector: vi.fn(),
    querySelectorAll: vi.fn().mockReturnValue([]),
    remove: vi.fn(),
    offsetHeight: 100
};
// Circular for querySelector
mockElement.querySelector.mockReturnValue(mockElement);

(global as any).document.getElementById = vi.fn().mockReturnValue(null);
(global as any).document.createElement = vi.fn().mockReturnValue({ ...mockElement }); // unique per call
(global as any).document.body.appendChild = vi.fn();
(global as any).requestAnimationFrame = vi.fn((cb) => cb());

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

const mockCollectiblesSystem = {
    getNotes: vi.fn().mockReturnValue([
        { id: 'n1', title: 'Note 1', type: 'z', content: 'C1', sender: 'S1' }
    ]),
    isRead: vi.fn().mockReturnValue(false),
    getCollectionTimestamp: vi.fn().mockReturnValue(Date.now()),
    getViewCount: vi.fn().mockReturnValue(0),
    markAsRead: vi.fn(),
    incrementViewCount: vi.fn(),
    getRevealedCode: vi.fn().mockReturnValue(null)
};

describe('NotesViewer', () => {
    let instance: NotesViewer;

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
                instance = new NotesViewer(mockEventBus as any, mockCollectiblesSystem as any);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });
    });

    describe('Core Functionality', () => {
        it('should show overlay', () => {
            instance = new NotesViewer(mockEventBus as any, mockCollectiblesSystem as any);
            instance.show();
            // Checking one of the container mocks
            // We can check if any mockElement had 'visible' added
            // Since we clone mockElement on creation, it's hard to track strict equality unless we verify creation calls.
            expect(document.body.appendChild).toHaveBeenCalled();
        });

        it('should queue toast', () => {
            instance = new NotesViewer(mockEventBus as any, mockCollectiblesSystem as any);

            // Trigger note:collected
            const handler = mockEventBus.on.mock.calls.find((c: any) => c[0] === 'note:collected')[1];
            handler({ id: 'n1', title: 'Note 1' });

            expect(mockEventBus.emit).toHaveBeenCalledWith('note:toast', expect.any(Object));
        });
    });
});
