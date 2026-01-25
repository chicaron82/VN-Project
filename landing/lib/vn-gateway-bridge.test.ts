import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VNGatewayBridge } from './vn-gateway-bridge';

describe('VNGatewayBridge', () => {
    beforeEach(() => {
        // Reset URL params
        window.history.pushState({}, 'Test', '/');
        vi.restoreAllMocks();
    });

    it('should initialize without parameters', () => {
        const consoleSpy = vi.spyOn(console, 'log');
        new VNGatewayBridge();
        
        // Should not log initialization messages if no params
        expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('Applying start condition'));
    });

    it('should parse start condition and unlocks from URL', () => {
        // Set up URL params
        const url = new URL('http://localhost/?start=phase-9&unlocks=5');
        // JSDOM way to set location
        Object.defineProperty(window, 'location', {
            value: url,
            writable: true
        });
        
        const consoleSpy = vi.spyOn(console, 'log');
        new VNGatewayBridge();
        
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('phase-9'));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Unlock count from ToriGatchi: 5'));
    });
    
    it('should handle malformed unlock counts', () => {
         const url = new URL('http://localhost/?start=phase-9&unlocks=garbage');
        Object.defineProperty(window, 'location', {
            value: url,
            writable: true
        });
        
        const consoleSpy = vi.spyOn(console, 'log');
        new VNGatewayBridge();
        
        // parseInt('garbage') || 0 -> 0
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Unlock count from ToriGatchi: 0'));
    });
});
