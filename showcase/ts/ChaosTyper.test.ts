import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initChaosTyper } from './ChaosTyper';

// Add global declaration for updateBackgroundContext
declare global {
    interface Window {
        updateBackgroundContext: (phaseId: string) => void;
    }
}

describe('ChaosTyper', () => {
    let chaosContainer: HTMLElement;
    let orderContainer: HTMLElement;

    beforeEach(() => {
        vi.useFakeTimers();
        document.body.innerHTML = '';
        
        chaosContainer = document.createElement('div');
        chaosContainer.className = 'chaos-code-bg';
        document.body.appendChild(chaosContainer);
        
        orderContainer = document.createElement('div');
        orderContainer.className = 'order-code-bg';
        document.body.appendChild(orderContainer);
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.restoreAllMocks();
        // Clean up global function
        delete (window as any).updateBackgroundContext;
    });

    it('should initialize and start typing loops', () => {
        initChaosTyper();

        // Check if global function exposed
        expect(typeof window.updateBackgroundContext).toBe('function');

        // Initial state should be empty
        const initialChaos = chaosContainer.textContent;
        const initialOrder = orderContainer.textContent;
        
        // Fast forward time
        vi.advanceTimersByTime(2000);

        // Content should have changed
        expect(chaosContainer.textContent).not.toBe(initialChaos);
        expect(orderContainer.textContent).not.toBe(initialOrder);
    });

    it('should respect context updates', () => {
        initChaosTyper();
        
        // Trigger a specific phase context
        window.updateBackgroundContext('phase-13'); // "Porting started..."

        // Advance time enough for typing to happen
        // We can't easily deterministic test random selection, but we can verify it doesn't crash
        vi.advanceTimersByTime(5000);
        
        // At minimum, should still be typing
        expect(chaosContainer.textContent!.length).toBeGreaterThan(0);
    });

    it('should handle missing elements gracefully', () => {
        document.body.innerHTML = ''; // Remove containers
        
        expect(() => initChaosTyper()).not.toThrow();
    });
    
    it('should trim text when it gets too long', () => {
        // Pre-fill with long text
        chaosContainer.textContent = 'x'.repeat(600);
        
        initChaosTyper();
        vi.advanceTimersByTime(2000);
        
        // Should have trimmed it (logic says if > 500, substring(200))
        // So length should be roughly 300 + new snippet
        expect(chaosContainer.textContent!.length).toBeLessThan(600);
    });
});
