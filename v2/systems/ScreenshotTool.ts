import { DevSuite } from './DevSuite';
import { Logger } from '@utils/Logger';

/**
 * ScreenshotTool - Capture game state
 * Ported from V1 system/screenshot-tool.js
 * 
 * Features:
 * - Canvas fallback capture (Black placeholder per V1 parity when html2canvas is missing)
 * - visual flash feedback
 */
export class ScreenshotTool {
    // @ts-ignore - Reserved for future use
    private suite: DevSuite;
    private isCapturing: boolean = false;

    constructor(suite: DevSuite) {
        this.suite = suite;
    }

    public async download(): Promise<void> {
        const canvas = await this.captureScreen();
        if (!canvas) return;

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `v848-screenshot-${timestamp}.png`;

        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            Logger.ui(`📸 Screenshot saved: ${filename}`);
        });
    }

    public async copyToClipboard(): Promise<void> {
        const canvas = await this.captureScreen();
        if (!canvas) return;

        try {
            canvas.toBlob(async (blob) => {
                if (!blob) return;
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                alert('Screenshot copied to clipboard!');
                Logger.ui('📸 Screenshot copied to clipboard');
            });
        } catch (error) {
            Logger.error('Failed to copy to clipboard:', error);
            alert('Failed to copy to clipboard. Try downloading instead.');
        }
    }

    private async captureScreen(): Promise<HTMLCanvasElement | null> {
        if (this.isCapturing) {
            Logger.warn('Screenshot already in progress');
            return null;
        }

        this.isCapturing = true;
        this.showCaptureIndicator();

        try {
            // V1 Parity: Since we don't have html2canvas, use the V1 fallback
            // which draws a black screen with text.
            return await this.createPlaceholderCapture();
        } catch (error) {
            Logger.error('Screenshot failed:', error);
            alert('Screenshot failed. See console for details.');
            return null;
        } finally {
            this.isCapturing = false;
            // Indicator cleanup handled by animation end in showCaptureIndicator
        }
    }

    private async createPlaceholderCapture(): Promise<HTMLCanvasElement> {
        const gameContainer = document.getElementById('app') || document.body;
        const rect = gameContainer.getBoundingClientRect();

        const canvas = document.createElement('canvas');
        canvas.width = rect.width;
        canvas.height = rect.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        // Draw black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add text overlay
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Screenshot captured', canvas.width / 2, canvas.height / 2);

        ctx.font = '14px Arial';
        ctx.fillText('(Install html2canvas for full capture)', canvas.width / 2, canvas.height / 2 + 30);

        // Add timestamp
        ctx.font = '12px courier';
        ctx.fillStyle = '#00ffff';
        ctx.fillText(new Date().toLocaleString(), canvas.width / 2, canvas.height - 30);

        return canvas;
    }

    private showCaptureIndicator(): void {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            inset: 0;
            background: white;
            z-index: 99999;
            pointer-events: none;
            animation: screenshot-flash 0.3s ease-out;
        `;

        // Check if style already exists
        if (!document.getElementById('screenshot-flash-style')) {
            const style = document.createElement('style');
            style.id = 'screenshot-flash-style';
            style.textContent = `
                @keyframes screenshot-flash {
                    0% { opacity: 0.8; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(flash);

        // Auto remove
        setTimeout(() => {
            flash.remove();
        }, 300);
    }
}
