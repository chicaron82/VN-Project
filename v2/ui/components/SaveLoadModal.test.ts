import { SaveLoadModal } from './SaveLoadModal';

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
    dataset: {}
};
mockElement.querySelector.mockReturnValue(mockElement);

(global as any).document.createElement = vi.fn().mockReturnValue({ ...mockElement });
(global as any).document.body.appendChild = vi.fn();
(global as any).document.addEventListener = vi.fn();

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

const mockSaveSystem = {
    getSlotMetadata: vi.fn().mockReturnValue(null), // Empty slots by default
    saveGame: vi.fn().mockResolvedValue(true),
    loadGame: vi.fn().mockResolvedValue(true),
    deleteSlot: vi.fn()
};

const mockStateManager = {
    get: vi.fn((key) => {
        if (key === 'currentRoute') return 'ronnie';
        return null;
    }),
    set: vi.fn()
};

describe('SaveLoadModal', () => {
    let instance: SaveLoadModal;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should create an instance', () => {
            expect(() => {
                instance = new SaveLoadModal(mockEventBus as any, mockSaveSystem as any, mockStateManager as any);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });
    });

    describe('Core Functionality', () => {
        it('should open in save mode', () => {
            instance = new SaveLoadModal(mockEventBus as any, mockSaveSystem as any, mockStateManager as any);
            instance.open('save');

            expect(mockElement.classList.add).toHaveBeenCalledWith('mode-save');
            expect(mockSaveSystem.getSlotMetadata).toHaveBeenCalledTimes(4); // 0 (auto) + 1-3
        });

        it('should open in load mode', () => {
            instance = new SaveLoadModal(mockEventBus as any, mockSaveSystem as any, mockStateManager as any);
            instance.open('load');

            expect(mockElement.classList.add).toHaveBeenCalledWith('mode-load');
        });

        it('should handle save action', async () => {
            instance = new SaveLoadModal(mockEventBus as any, mockSaveSystem as any, mockStateManager as any);
            instance.open('save');

            await (instance as any).handleSlotAction('save', 1);
            expect(mockSaveSystem.saveGame).toHaveBeenCalledWith(1, expect.stringContaining('Ronnie'));
            expect(mockEventBus.emit).toHaveBeenCalledWith('save:complete', expect.anything());
        });

        it('should handle load action', async () => {
            instance = new SaveLoadModal(mockEventBus as any, mockSaveSystem as any, mockStateManager as any);
            instance.open('load');

            await (instance as any).handleSlotAction('load', 1);
            expect(mockSaveSystem.loadGame).toHaveBeenCalledWith(1);
            expect(mockEventBus.emit).toHaveBeenCalledWith('load:complete', expect.anything());
        });
    });
});
