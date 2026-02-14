/**
 * DevCommentarySystem Tests
 *
 * Tests for Aaron's director's cut commentary system.
 * "The DVD commentary track for the game."
 *
 * 848 is sacred. 💚🔥💀
 */

import { DevCommentarySystem } from './DevCommentarySystem';
import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';
import { Logger } from '@utils/Logger';

describe('DevCommentarySystem', () => {
    let eventBus: EventBus;
    let stateManager: StateManager;
    let system: DevCommentarySystem;

    beforeEach(() => {
        localStorage.clear();

        eventBus = new EventBus();
        stateManager = new StateManager();
        system = new DevCommentarySystem(eventBus, stateManager);
    });

    afterEach(() => {
        system.destroy();
        localStorage.clear();
    });

    describe('Initialization', () => {
        it('should initialize without errors', () => {
            expect(system).toBeDefined();
        });

        it('should start locked by default', () => {
            expect(system.isUnlocked()).toBe(false);
        });

        it('should load commentary database', () => {
            // Unlock first
            system.unlockCommentary();
            const commentary = system.getCommentary('prologue_street_bump');
            expect(commentary).toBeDefined();
            expect(commentary?.title).toBe('The French Vanilla Detail');
        });
    });

    describe('Unlock Mechanics', () => {
        it('should unlock via CHICHARON secret code', () => {
            eventBus.emit('secret_code:unlocked', { code: 'CHICHARON', name: 'Chicharon' });
            expect(system.isUnlocked()).toBe(true);
        });

        it('should unlock via CHICHARON (case insensitive)', () => {
            eventBus.emit('secret_code:unlocked', { code: 'chicharon', name: 'Chicharon' });
            expect(system.isUnlocked()).toBe(true);
        });

        it('should persist unlock state to localStorage', () => {
            system.unlockCommentary();
            expect(localStorage.getItem('devCommentaryUnlocked')).toBe('true');
        });

        it('should sync unlock state to StateManager', () => {
            system.unlockCommentary();
            expect(stateManager.get('secrets.devCommentaryUnlocked')).toBe(true);
        });

        it('should emit achievement event on unlock', () => {
            const callback = vi.fn();
            eventBus.on('achievement:unlocked', callback);

            system.unlockCommentary();

            expect(callback).toHaveBeenCalled();
            expect(callback.mock.calls[0][0].id).toBe('dev_commentary');
        });

        it('should restore unlocked state from localStorage', () => {
            localStorage.setItem('devCommentaryUnlocked', 'true');

            // Create new instance
            const newSystem = new DevCommentarySystem(eventBus, stateManager);

            expect(newSystem.isUnlocked()).toBe(true);

            newSystem.destroy();
        });
    });

    describe('Commentary Access (Locked)', () => {
        it('should return null for getCommentary when locked', () => {
            const commentary = system.getCommentary('prologue_street_bump');
            expect(commentary).toBeNull();
        });

        it('should return empty array for getAllCommentary when locked', () => {
            const allCommentary = system.getAllCommentary();
            expect(allCommentary).toEqual([]);
        });
    });

    describe('Commentary Access (Unlocked)', () => {
        beforeEach(() => {
            system.unlockCommentary();
        });

        it('should return commentary for valid scene ID', () => {
            const commentary = system.getCommentary('prologue_street_bump');
            expect(commentary).toBeDefined();
            expect(commentary?.title).toBe('The French Vanilla Detail');
            expect(commentary?.scene).toBe('Street Bump (Prologue)');
            expect(commentary?.content).toContain('French Vanilla coffee');
        });

        it('should return null for invalid scene ID', () => {
            const commentary = system.getCommentary('nonexistent_scene');
            expect(commentary).toBeNull();
        });

        it('should return all commentary entries', () => {
            const allCommentary = system.getAllCommentary();
            expect(allCommentary.length).toBeGreaterThan(0);
            expect(allCommentary[0]).toHaveProperty('id');
            expect(allCommentary[0]).toHaveProperty('title');
            expect(allCommentary[0]).toHaveProperty('scene');
            expect(allCommentary[0]).toHaveProperty('content');
        });

        it('should have all expected commentary entries', () => {
            const allCommentary = system.getAllCommentary();
            const ids = allCommentary.map(entry => entry.id);

            // Prologue
            expect(ids).toContain('prologue_street_bump');

            // Route Selection
            expect(ids).toContain('route_selection_dual');
            expect(ids).toContain('route_selection_philosophy');

            // Tori Route
            expect(ids).toContain('tori_tether_intro');
            expect(ids).toContain('tori_echoes_first_appearance');
            expect(ids).toContain('tori_echo_merge');
            expect(ids).toContain('tori_save_blocked');

            // Endings
            expect(ids).toContain('bad_ending_retry');

            // Main Menu
            expect(ids).toContain('main_menu_carousel');
            expect(ids).toContain('main_menu_mobile');
            expect(ids).toContain('main_menu_loop');

            // Features
            expect(ids).toContain('backlog_time_machine');
        });
    });

    describe('Commentary Display (EventBus)', () => {
        beforeEach(() => {
            system.unlockCommentary();
        });

        it('should respond to commentary:show event', () => {
            const showSpy = vi.spyOn(system, 'showCommentary');

            (eventBus as any).emit('commentary:show', { sceneId: 'prologue_street_bump' });

            expect(showSpy).toHaveBeenCalledWith('prologue_street_bump');
        });

        it('should respond to commentary:showAll event', () => {
            const showAllSpy = vi.spyOn(system, 'showAllCommentary');

            (eventBus as any).emit('commentary:showAll', {});

            expect(showAllSpy).toHaveBeenCalled();
        });
    });

    describe('Commentary Content Validation', () => {
        beforeEach(() => {
            system.unlockCommentary();
        });

        it('should have French Vanilla detail in prologue', () => {
            const entry = system.getCommentary('prologue_street_bump');
            expect(entry?.content).toContain('French Vanilla');
            expect(entry?.content).toContain('Old Ronnie');
            expect(entry?.content).toContain('bootstrap paradox');
        });

        it('should have dual route explanation', () => {
            const entry = system.getCommentary('route_selection_dual');
            expect(entry?.content).toContain('Applebee\'s');
            expect(entry?.content).toContain('dual perspectives');
        });

        it('should have tether origin story', () => {
            const entry = system.getCommentary('tori_tether_intro');
            expect(entry?.content).toContain('Applebee');
            expect(entry?.content).toContain('press a button');
        });

        it('should have Despair height bug story', () => {
            const entry = system.getCommentary('tori_echoes_first_appearance');
            expect(entry?.content).toContain('bug');
            expect(entry?.content).toContain('Despair');
            expect(entry?.content).toContain('taller');
        });

        it('should have bootstrap paradox explanation', () => {
            const entry = system.getCommentary('bad_ending_retry');
            expect(entry?.content).toContain('CANON');
            expect(entry?.content).toContain('bootstrap paradox');
            expect(entry?.content).toContain('Tamagotchi');
        });

        it('should have Price is Right carousel story', () => {
            const entry = system.getCommentary('main_menu_carousel');
            expect(entry?.content).toContain('Price Is Right');
            expect(entry?.content).toContain('Zee');
        });

        it('should have Tinder swipe reference', () => {
            const entry = system.getCommentary('main_menu_mobile');
            expect(entry?.content).toContain('Tinder');
            expect(entry?.content).toContain('Bumble');
        });

        it('should have backlog time machine explanation', () => {
            const entry = system.getCommentary('backlog_time_machine');
            expect(entry?.content).toContain('time machine');
            expect(entry?.content).toContain('jump back');
        });
    });

    describe('Modal Display System', () => {
        beforeEach(() => {
            system.unlockCommentary();

            // Mock DOM
            document.body.innerHTML = '';
        });

        it('should warn when showing commentary for invalid scene', () => {
            const loggerSpy = vi.spyOn(Logger, 'warn');

            system.showCommentary('invalid_scene');

            expect(loggerSpy).toHaveBeenCalledWith(
                expect.stringContaining('No commentary found for scene')
            );

            loggerSpy.mockRestore();
        });

        it('should warn when showing all commentary while locked', () => {
            const loggerSpy = vi.spyOn(Logger, 'warn');

            // Clear localStorage to ensure system starts locked
            localStorage.clear();

            // Create new locked system with fresh state
            const freshEventBus = new EventBus();
            const freshStateManager = new StateManager();
            const lockedSystem = new DevCommentarySystem(freshEventBus, freshStateManager);

            lockedSystem.showAllCommentary();

            expect(loggerSpy).toHaveBeenCalledWith(
                expect.stringContaining('Dev Commentary is locked')
            );

            lockedSystem.destroy();
            loggerSpy.mockRestore();
        });
    });

    describe('Cleanup', () => {
        it('should cleanup without errors', () => {
            expect(() => system.destroy()).not.toThrow();
        });
    });
});
