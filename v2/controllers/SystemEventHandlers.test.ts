/**
 * SystemEventHandlers Tests
 * Tests for game event routing and handler setup
 */
import { SystemEventHandlers } from './SystemEventHandlers';

// Mock Logger
vi.mock('@utils/Logger', () => ({
    Logger: { scene: vi.fn(), effect: vi.fn(), input: vi.fn(), system: vi.fn(), ui: vi.fn() }
}));

describe('SystemEventHandlers', () => {
    let eventBus: any;
    let gameEngine: any;
    let dialogController: any;
    let spriteController: any;
    let dialogBubble: any;
    let mockGameLayout: any;
    let updateBackground: ReturnType<typeof vi.fn>;
    let updateSprites: ReturnType<typeof vi.fn>;
    let showChoices: ReturnType<typeof vi.fn>;
    let showMainMenu: ReturnType<typeof vi.fn>;
    let handlers: SystemEventHandlers;

    beforeEach(() => {
        const eventHandlers: Record<string, Function[]> = {};
        eventBus = {
            on: vi.fn((event: string, handler: Function) => {
                if (!eventHandlers[event]) eventHandlers[event] = [];
                eventHandlers[event].push(handler);
            }),
            emit: vi.fn((event: string, data: any) => {
                (eventHandlers[event] || []).forEach(h => h(data));
            }),
        };

        gameEngine = {
            getCurrentScene: vi.fn().mockReturnValue({
                character: 'Ronnie',
                background: 'bg_school.png',
                sprites: [{ position: 'left', variant: 'ronnie_happy' }],
                effects: [],
            }),
        };

        dialogController = {
            show: vi.fn(),
        };

        spriteController = {
            highlightSpeaker: vi.fn(),
            fadeSpritesSequence: vi.fn(),
        };

        dialogBubble = {
            show: vi.fn(),
            hide: vi.fn(),
        };

        mockGameLayout = {
            dialogBox: { style: { display: '' } },
            dialogName: { textContent: '', style: { color: '' } },
            dialogText: { textContent: '' },
            viewport: {},
            updateTether: vi.fn(),
        };

        updateBackground = vi.fn();
        updateSprites = vi.fn();
        showChoices = vi.fn();
        showMainMenu = vi.fn();

        handlers = new SystemEventHandlers(
            eventBus,
            gameEngine,
            dialogController,
            spriteController,
            dialogBubble,
            () => mockGameLayout,
            updateBackground,
            updateSprites,
            showChoices,
            showMainMenu
        );
    });

    it('should setup all handler groups', () => {
        handlers.setup();

        // Should register handlers for scene, dialog, tether, and echo events
        expect(eventBus.on).toHaveBeenCalledWith('scene:load', expect.any(Function));
        expect(eventBus.on).toHaveBeenCalledWith('scene:complete', expect.any(Function));
        expect(eventBus.on).toHaveBeenCalledWith('dialog:show', expect.any(Function));
        expect(eventBus.on).toHaveBeenCalledWith('dialog:complete', expect.any(Function));
        expect(eventBus.on).toHaveBeenCalledWith('tether:change', expect.any(Function));
        expect(eventBus.on).toHaveBeenCalledWith('echo:comment', expect.any(Function));
    });

    it('should update speaker name on scene:load', () => {
        handlers.setup();

        eventBus.emit('scene:load', { sceneId: 'scene1' });

        expect(mockGameLayout.dialogName.textContent).toBe('Ronnie');
    });

    it('should set cyan color for Ronnie speaker', () => {
        handlers.setup();

        eventBus.emit('scene:load', { sceneId: 'scene1' });

        expect(mockGameLayout.dialogName.style.color).toBe('#0ff');
    });

    it('should set magenta color for Tori speaker', () => {
        gameEngine.getCurrentScene.mockReturnValue({
            character: 'Tori',
            effects: [],
        });

        handlers.setup();
        eventBus.emit('scene:load', { sceneId: 'scene2' });

        expect(mockGameLayout.dialogName.style.color).toBe('#f0f');
    });

    it('should call updateBackground when scene has background', () => {
        handlers.setup();

        eventBus.emit('scene:load', { sceneId: 'scene1' });

        expect(updateBackground).toHaveBeenCalledWith('bg_school.png');
    });

    it('should call updateSprites when scene has sprites', () => {
        handlers.setup();

        eventBus.emit('scene:load', { sceneId: 'scene1' });

        expect(updateSprites).toHaveBeenCalledWith([{ position: 'left', variant: 'ronnie_happy' }]);
    });

    it('should highlight speaker on scene:load', () => {
        handlers.setup();

        eventBus.emit('scene:load', { sceneId: 'scene1' });

        expect(spriteController.highlightSpeaker).toHaveBeenCalledWith('Ronnie');
    });

    it('should hide dialog box for internal scenes', () => {
        gameEngine.getCurrentScene.mockReturnValue({
            isInternal: true,
            character: 'Tori',
            effects: [],
        });

        handlers.setup();
        eventBus.emit('scene:load', { sceneId: 'internal1' });

        expect(mockGameLayout.dialogBox.style.display).toBe('none');
    });

    it('should use typewriter for standard dialog', () => {
        handlers.setup();

        eventBus.emit('dialog:show', { entry: { character: 'Ronnie', text: 'Hello!' } });

        expect(dialogController.show).toHaveBeenCalledWith('Hello!');
    });

    it('should use bubble for internal dialog', () => {
        gameEngine.getCurrentScene.mockReturnValue({
            isInternal: true,
            sprites: [{ position: 'left' }],
            effects: [],
        });

        handlers.setup();
        eventBus.emit('dialog:show', { entry: { character: 'Tori', text: 'Thinking...' } });

        expect(dialogBubble.show).toHaveBeenCalledWith(
            expect.objectContaining({ text: 'Thinking...' })
        );
    });

    it('should update tether display on tether:change', () => {
        handlers.setup();

        eventBus.emit('tether:change', { level: 75 });

        expect(mockGameLayout.updateTether).toHaveBeenCalledWith(75);
    });

    it('should map echo comments to notification:show', () => {
        handlers.setup();

        eventBus.emit('echo:comment', {
            echo: 'hope',
            message: 'The light is there...',
            icon: '💫',
        });

        expect(eventBus.emit).toHaveBeenCalledWith('notification:show', expect.objectContaining({
            title: 'ECHO: HOPE',
            message: 'The light is there...',
            category: 'system',
        }));
    });
});
