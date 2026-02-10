/**
 * ═══════════════════════════════════════════════════════════════
 * CHROME ARCHITECTURE PERFORMANCE BENCHMARKS
 * 
 * Measures performance of key chrome architecture components:
 * - Action routing latency
 * - Theme application speed
 * - FIFO message queue overhead
 * - Spec application performance
 * ═══════════════════════════════════════════════════════════════
 */

import { describe, bench, beforeEach } from 'vitest';
import { UV7System } from '../UV7System.js';
import type { StatusBarSpec, ChromeTheme } from '../../types/chrome.js';

describe('Chrome Architecture Performance', () => {
    let system: UV7System;
    let mockElements: {
        statusBar: { title: HTMLElement; context: HTMLElement; actions: HTMLElement };
        sidebar: HTMLElement;
        shade: HTMLElement;
    };

    beforeEach(() => {
        // Create mock DOM elements
        mockElements = {
            statusBar: {
                title: document.createElement('div'),
                context: document.createElement('div'),
                actions: document.createElement('div')
            },
            sidebar: document.createElement('div'),
            shade: document.createElement('div')
        };

        system = new UV7System(mockElements as unknown as ConstructorParameters<typeof UV7System>[0]);
    });

    describe('Action Routing', () => {
        bench('route single action (1 handler)', () => {
            system.getAPI().onAction('app:test', () => { });
            system['handleActionClick']('app:test');
        });

        bench('route action from 10 handlers', () => {
            // Register 10 handlers
            for (let i = 0; i < 10; i++) {
                system.getAPI().onAction(`app:action${i}`, () => { });
            }
            // Route the last one
            system['handleActionClick']('app:action9');
        });

        bench('route action from 100 handlers', () => {
            // Register 100 handlers
            for (let i = 0; i < 100; i++) {
                system.getAPI().onAction(`app:action${i}`, () => { });
            }
            // Route the last one
            system['handleActionClick']('app:action99');
        });

        bench('route action from 1000 handlers', () => {
            // Register 1000 handlers
            for (let i = 0; i < 1000; i++) {
                system.getAPI().onAction(`app:action${i}`, () => { });
            }
            // Route the last one
            system['handleActionClick']('app:action999');
        });
    });

    describe('Theme Application', () => {
        const theme: ChromeTheme = {
            primaryColor: '#6366f1',
            accentColor: '#818cf8',
            fontFamily: 'Inter, sans-serif',
            statusBarVariant: 'dark',
            transitionDuration: 350
        };

        bench('apply theme (CSS custom properties)', () => {
            system.applyTheme(theme);
        });

        bench('apply theme 10 times consecutively', () => {
            for (let i = 0; i < 10; i++) {
                system.applyTheme(theme);
            }
        });
    });

    describe('StatusBarSpec Application', () => {
        const simpleSpec: StatusBarSpec = {
            title: 'Test App',
            context: 'Testing'
        };

        const complexSpec: StatusBarSpec = {
            title: 'Test App',
            context: 'Testing',
            actions: [
                { id: 'app:action1', icon: '🎨', label: 'Action 1' },
                { id: 'app:action2', icon: '📤', label: 'Action 2' },
                { id: 'app:action3', icon: '⛶', label: 'Action 3' }
            ],
            theme: {
                primaryColor: '#6366f1',
                accentColor: '#818cf8'
            },
            mode: 'normal'
        };

        bench('apply simple spec (title + context only)', () => {
            system.applyStatusBarSpec(simpleSpec);
        });

        bench('apply complex spec (actions + theme)', () => {
            system.applyStatusBarSpec(complexSpec);
        });

        bench('apply spec with 10 actions', () => {
            const spec: StatusBarSpec = {
                title: 'Test',
                actions: Array.from({ length: 10 }, (_, i) => ({
                    id: `app:action${i}`,
                    icon: '🎨',
                    label: `Action ${i}`
                }))
            };
            system.applyStatusBarSpec(spec);
        });
    });

    describe('FIFO Message Queue', () => {
        bench('queue single message', async () => {
            await system.getAPI().statusBar.setTemporaryMessage('Test message', 100);
        });

        bench('queue 10 messages sequentially', async () => {
            const promises = [];
            for (let i = 0; i < 10; i++) {
                promises.push(system.getAPI().statusBar.setTemporaryMessage(`Message ${i}`, 10));
            }
            await Promise.all(promises);
        });

        bench('queue 100 messages sequentially', async () => {
            const promises = [];
            for (let i = 0; i < 100; i++) {
                promises.push(system.getAPI().statusBar.setTemporaryMessage(`Message ${i}`, 1));
            }
            await Promise.all(promises);
        });
    });

    describe('Spec Validation', () => {
        const validSpec: StatusBarSpec = {
            title: 'Test',
            actions: [
                { id: 'app:valid', icon: '🎨', label: 'Valid' }
            ]
        };

        bench('validate valid spec', () => {
            system['validateStatusBarSpec'](validSpec);
        });

        bench('validate spec with 10 actions', () => {
            const spec: StatusBarSpec = {
                title: 'Test',
                actions: Array.from({ length: 10 }, (_, i) => ({
                    id: `app:action${i}`,
                    icon: '🎨',
                    label: `Action ${i}`
                }))
            };
            system['validateStatusBarSpec'](spec);
        });
    });
});
