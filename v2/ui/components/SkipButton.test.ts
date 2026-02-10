import { SkipButton } from './SkipButton';

// Mock DOM
const mockElement = {
    classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn(), contains: vi.fn() },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    setAttribute: vi.fn(),
    style: { display: 'none' },
    innerHTML: '',
    parentNode: { removeChild: vi.fn() },
    remove: vi.fn()
};
(global as any).document.getElementById = vi.fn().mockReturnValue(null);
(global as any).document.createElement = vi.fn().mockReturnValue(mockElement);
(global as any).document.body.appendChild = vi.fn();
(global as any).document.addEventListener = vi.fn();
(global as any).document.removeEventListener = vi.fn();

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

const mockDialogController = {
    isSkipUnlocked: vi.fn().mockReturnValue(true),
    getSkipState: vi.fn().mockReturnValue({ isSkipping: false }),
    hasReadContent: vi.fn().mockReturnValue(true)
};

describe('SkipButton', () => {
    let instance: SkipButton;

    beforeEach(() => {
        vi.clearAllMocks();
        mockElement.style.display = 'none';
        mockElement.classList.contains.mockReturnValue(false);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should create an instance', () => {
            instance = new SkipButton(mockEventBus as any);
            expect(instance).toBeDefined();
            expect(document.createElement).toHaveBeenCalledWith('button');
        });
    });

    describe('Core Functionality', () => {
        it('should toggle skip on click', () => {
            instance = new SkipButton(mockEventBus as any);
            instance.setDialogController(mockDialogController as any);

            // Trigger click
            const clickHandler = mockElement.addEventListener.mock.calls.find((c: any) => c[0] === 'click')[1];
            clickHandler({ preventDefault: vi.fn(), stopPropagation: vi.fn() });

            expect(mockEventBus.emit).toHaveBeenCalledWith('skip:toggle', {});
        });

        it('should update visibility based on unlock status', () => {
            instance = new SkipButton(mockEventBus as any);
            mockDialogController.isSkipUnlocked.mockReturnValue(false);
            instance.setDialogController(mockDialogController as any);
            expect(mockElement.style.display).toBe('none');

            mockDialogController.isSkipUnlocked.mockReturnValue(true);
            instance.updateVisibility();
            expect(mockElement.style.display).toBe('flex');
        });
    });
});
