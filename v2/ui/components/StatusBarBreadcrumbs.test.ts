import { BreadcrumbRenderer, buildBreadcrumbs } from './StatusBarBreadcrumbs';

// Mock DOM
const mockContainer = {
    innerHTML: '',
    appendChild: vi.fn()
};

// Mock EventBus
const mockEventBus = {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
};

const mockTint = {
    primary: '#fff',
    glow: 'rgba(255, 255, 255, 0.5)',
    gradient: 'linear-gradient(to right, #000, #fff)'
};

(global as any).document.createElement = vi.fn().mockReturnValue({
    className: '',
    textContent: '',
    dataset: {},
    addEventListener: vi.fn(),
    style: {}
});

describe('BreadcrumbRenderer', () => {
    let instance: BreadcrumbRenderer;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should create an instance', () => {
            expect(() => {
                instance = new BreadcrumbRenderer(mockContainer as any, mockEventBus as any, mockTint);
            }).not.toThrow();
            expect(instance).toBeDefined();
        });
    });

    describe('Core Functionality', () => {
        it('should render segments', () => {
            instance = new BreadcrumbRenderer(mockContainer as any, mockEventBus as any, mockTint);
            const segments = [
                { label: 'Root', id: 'root', clickable: false },
                { label: 'Child', id: 'child', clickable: true }
            ];

            instance.render(segments);

            expect(mockContainer.appendChild).toHaveBeenCalled();
            expect(instance.getSegments()).toEqual(segments);
        });
    });
});

describe('buildBreadcrumbs', () => {
    it('should build game breadcrumbs', () => {
        const result = buildBreadcrumbs('game', {
            loopVersion: 100,
            route: 'tori',
            act: 'Act 1',
            scene: 'Scene 1'
        });
        expect(result).toHaveLength(4);
        expect(result[0].label).toBe('v.100');
        expect(result[1].label).toBe('Tori');
    });

    it('should build showcase breadcrumbs', () => {
        const result = buildBreadcrumbs('showcase', {
            phase: '21',
            section: 'Login'
        });
        expect(result).toHaveLength(3); // Showcase root + Phase + Section
        expect(result[0].label).toBe('Showcase');
    });
});
