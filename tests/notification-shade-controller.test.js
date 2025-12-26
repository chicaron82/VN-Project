import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotificationShadeController } from '../system/notification-shade-controller.js';

describe('NotificationShadeController', () => {
    let controller;
    let mockGame;

    beforeEach(() => {
        // Create DOM elements
        document.body.innerHTML = `
      <div id="status-bar">
        <div id="status-loop"></div>
        <div id="status-route"></div>
        <div id="status-progress"></div>
        <div id="status-tether"></div>
        <div id="status-tether-value"></div>
        <div class="tether-fill"></div>
      </div>
    `;

        // Mock game object
        mockGame = {
            currentRoute: {
                name: 'tori',
                constructor: { name: 'ToriRoute' }, // Fix: getRouteName checks constructor.name
                collectiblesManager: {
                    getCollectedCountForCurrentRoute: vi.fn(() => 3),
                    getTotalCountForCurrentRoute: vi.fn(() => 16)
                }
            },
            state: {
                get: vi.fn((path) => {
                    if (path === 'tether.level') return 85;
                    return null;
                }),
                subscribe: vi.fn(() => vi.fn()) // Return unsubscribe function
            }
        };

        controller = new NotificationShadeController(mockGame);
    });

    describe('Status bar updates', () => {
        it('should update route name', () => {
            controller.updateStatusBar();
            const routeEl = document.getElementById('status-route');
            expect(routeEl.textContent).toContain('Tori');
        });

        it('should update notes progress', () => {
            controller.updateStatusBar();
            const progressEl = document.getElementById('status-progress');
            expect(progressEl.textContent).toBe('🖤 3/16');
        });

        it('should update tether level for Tori route', () => {
            controller.updateStatusBar();
            const tetherValue = document.getElementById('status-tether-value');
            expect(tetherValue.textContent).toBe('85%');
        });

        it('should hide tether for non-Tori routes', () => {
            mockGame.currentRoute.name = 'ronnie';
            mockGame.currentRoute.constructor.name = 'RonnieRoute'; // Fix: Update constructor too
            controller.updateStatusBar();
            const tetherEl = document.getElementById('status-tether');
            expect(tetherEl.style.display).toBe('none');
        });
    });

    describe('Confirmation dialogs', () => {
        it('should create confirmation overlay', () => {
            controller.showConfirmation({
                title: 'Test Title',
                message: 'Test Message'
            });

            const overlay = document.querySelector('.confirmation-overlay');
            expect(overlay).toBeTruthy();
        });

        it('should display title and message', () => {
            controller.showConfirmation({
                title: 'Test Title',
                message: 'Test Message'
            });

            const title = document.querySelector('.confirmation-title');
            const message = document.querySelector('.confirmation-message');

            expect(title.textContent).toBe('Test Title');
            expect(message.textContent).toBe('Test Message');
        });

        it('should call onConfirm when confirm button clicked', () => {
            const onConfirm = vi.fn();

            controller.showConfirmation({
                title: 'Test',
                message: 'Test',
                onConfirm
            });

            const confirmBtn = document.querySelector('.confirmation-confirm');
            confirmBtn.click();

            expect(onConfirm).toHaveBeenCalled();
        });

        it('should call onCancel when cancel button clicked', () => {
            const onCancel = vi.fn();

            controller.showConfirmation({
                title: 'Test',
                message: 'Test',
                onCancel
            });

            const cancelBtn = document.querySelector('.confirmation-cancel');
            cancelBtn.click();

            expect(onCancel).toHaveBeenCalled();
        });

        it('should remove overlay after confirm', () => {
            controller.showConfirmation({
                title: 'Test',
                message: 'Test'
            });

            const confirmBtn = document.querySelector('.confirmation-confirm');
            confirmBtn.click();

            const overlay = document.querySelector('.confirmation-overlay');
            expect(overlay).toBeNull();
        });
    });

    describe('Note collection', () => {
        it('should add note to unread list', () => {
            const noteData = {
                id: 'z1',
                title: 'Test Note',
                content: 'Test content'
            };

            controller.onNoteCollected(noteData);

            expect(controller.unreadNotes.length).toBe(1);
            expect(controller.unreadNotes[0].id).toBe('z1');
        });

        it('should set timestamp on note', () => {
            const noteData = {
                id: 'z1',
                title: 'Test Note'
            };

            const before = Date.now();
            controller.onNoteCollected(noteData);
            const after = Date.now();

            expect(controller.unreadNotes[0].timestamp).toBeGreaterThanOrEqual(before);
            expect(controller.unreadNotes[0].timestamp).toBeLessThanOrEqual(after);
        });
    });
});
