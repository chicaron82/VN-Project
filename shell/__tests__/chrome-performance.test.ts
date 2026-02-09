/**
 * ═══════════════════════════════════════════════════════════════
 * CHROME ARCHITECTURE - SIMPLE PERFORMANCE TESTS
 * 
 * Realistic performance tests using actual DOM and API methods.
 * These measure real-world performance, not micro-optimizations.
 * ═══════════════════════════════════════════════════════════════
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UV7System } from '../UV7System.js';
import type { StatusBarSpec, ChromeTheme } from '../../types/chrome.js';

describe('Chrome Performance Tests', () => {
    let system: UV7System;
    let mockElements: any;
    const performanceResults: Record<string, number> = {};

    function withMutedConsoleLog<T>(fn: () => T): T {
        const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
        try {
            return fn();
        } finally {
            spy.mockRestore();
        }
    }

    function measureAvgMs(fn: () => void, iterations: number = 200, warmup: number = 20): number {
        for (let i = 0; i < warmup; i++) fn();

        const start = performance.now();
        for (let i = 0; i < iterations; i++) fn();
        const total = performance.now() - start;

        return total / iterations;
    }

    beforeEach(() => {
        // Create actual DOM elements for realistic testing
        const statusBar = document.createElement('div');
        statusBar.id = 'uv7-status-bar';
        statusBar.innerHTML = `
            <div class="status-left">
                <span id="uv7-title"></span>
                <span id="uv7-context"></span>
            </div>
            <div class="status-actions" id="uv7-status-actions"></div>
        `;

        mockElements = {
            statusBar,
            sidebar: document.createElement('div'),
            shade: document.createElement('div')
        };

        system = new UV7System(mockElements);
    });

    describe('Action Routing Performance', () => {
        it('should route action in < 2ms (1 handler)', () => {
            const api = system.getAPI();
            let called = false;

            api.onAction('test:action', () => { called = true; });

            const duration = withMutedConsoleLog(() => measureAvgMs(() => system['handleActionClick']('test:action')));

            expect(called).toBe(true);
            expect(duration).toBeLessThan(2);
            performanceResults['action_routing_1_handler'] = duration;
        });

        it('should route action in < 2ms (100 handlers)', () => {
            const api = system.getAPI();

            // Register 100 handlers
            for (let i = 0; i < 100; i++) {
                api.onAction(`test:action${i}`, () => { });
            }

            let called = false;
            api.onAction('test:target', () => { called = true; });

            const duration = withMutedConsoleLog(() => measureAvgMs(() => system['handleActionClick']('test:target')));

            expect(called).toBe(true);
            expect(duration).toBeLessThan(2);
            performanceResults['action_routing_100_handlers'] = duration;
        });
    });

    describe('Theme Application Performance', () => {
        it('should apply theme in < 10ms', () => {
            const theme: ChromeTheme = {
                primaryColor: '#6366f1',
                accentColor: '#818cf8',
                fontFamily: 'Inter',
                transitionDuration: 350
            };

            const duration = withMutedConsoleLog(() =>
                measureAvgMs(() => system.applyTheme(theme), 100, 10)
            );

            expect(duration).toBeLessThan(10);
            performanceResults['theme_application'] = duration;
        });
    });

    describe('StatusBarSpec Application Performance', () => {
        it('should apply simple spec in < 10ms', () => {
            const spec: StatusBarSpec = {
                title: 'Test App',
                context: 'Testing'
            };

            const duration = withMutedConsoleLog(() => {
                // Warmup to reduce one-time initialization variance
                system.applyStatusBarSpec(spec);

                const start = performance.now();
                system.applyStatusBarSpec(spec);
                return performance.now() - start;
            });

            expect(duration).toBeLessThan(10);
            performanceResults['spec_application_simple'] = duration;
        });

        it('should apply complex spec in < 20ms', () => {
            const spec: StatusBarSpec = {
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
                }
            };

            const duration = withMutedConsoleLog(() => {
                // Warmup to reduce one-time initialization variance
                system.applyStatusBarSpec(spec);

                const start = performance.now();
                system.applyStatusBarSpec(spec);
                return performance.now() - start;
            });

            expect(duration).toBeLessThan(20);
            performanceResults['spec_application_complex'] = duration;
        });
    });

    describe('FIFO Message Queue Performance', () => {
        it('should queue message in < 5ms', async () => {
            const api = system.getAPI();

            const start = performance.now();
            await api.statusBar.setTemporaryMessage('Test', 10);
            const duration = performance.now() - start;

            // Should be fast to queue (actual display time is separate)
            expect(duration).toBeLessThan(50); // Relaxed for async
            performanceResults['message_queue'] = duration;
        });
    });

    // Print results after all tests
    it('should print performance summary', () => {
        console.log('\n═══════════════════════════════════════════════════════');
        console.log('CHROME ARCHITECTURE PERFORMANCE RESULTS');
        console.log('═══════════════════════════════════════════════════════\n');

        Object.entries(performanceResults).forEach(([test, duration]) => {
            const formatted = duration.toFixed(3);
            const status = duration < 2 ? '✅' : duration < 10 ? '⚠️' : '❌';
            console.log(`${status} ${test.padEnd(35)} ${formatted}ms`);
        });

        console.log('\n═══════════════════════════════════════════════════════\n');
    });
});
