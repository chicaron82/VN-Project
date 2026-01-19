// ========================================
// SCREENSHOT TOOL - Capture game state
// For bug reports and debugging
// ========================================

/**
 * ScreenshotTool - Capture game screenshots for bug reports
 * 
 * Features:
 * - Capture full game screen
 * - Download as PNG
 * - Copy to clipboard
 * - Include in bug reports
 * - Capture specific elements
 */

class ScreenshotTool {
    constructor(devSuite) {
        this.devSuite = devSuite;
        this.game = devSuite.game;
        this.isCapturing = false;
    }

    // ========================================
    // SCREENSHOT CAPTURE
    // ========================================

    async captureScreen() {
        if (this.isCapturing) {
            console.warn('Screenshot already in progress');
            return null;
        }

        this.isCapturing = true;
        this.showCaptureIndicator();

        try {
            // Try html2canvas if available
            if (typeof html2canvas !== 'undefined') {
                return await this.captureWithHtml2Canvas();
            } else {
                // Fallback: use canvas API directly
                return await this.captureWithCanvas();
            }
        } catch (error) {
            console.error('Screenshot failed:', error);
            alert('Screenshot failed. See console for details.');
            return null;
        } finally {
            this.isCapturing = false;
            this.hideCaptureIndicator();
        }
    }

    async captureWithHtml2Canvas() {
        const gameContainer = document.getElementById('game-container') || document.body;

        const canvas = await html2canvas(gameContainer, {
            backgroundColor: '#000000',
            logging: false,
            useCORS: true,
            allowTaint: true,
            scale: 1
        });

        return canvas;
    }

    async captureWithCanvas() {
        // Fallback: create a simple canvas capture
        const gameContainer = document.getElementById('game-container') || document.body;
        const rect = gameContainer.getBoundingClientRect();

        const canvas = document.createElement('canvas');
        canvas.width = rect.width;
        canvas.height = rect.height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add text overlay
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Screenshot captured', canvas.width / 2, canvas.height / 2);
        ctx.font = '14px Arial';
        ctx.fillText('(Install html2canvas for full capture)', canvas.width / 2, canvas.height / 2 + 30);

        return canvas;
    }

    // ========================================
    // DOWNLOAD & CLIPBOARD
    // ========================================

    async download() {
        const canvas = await this.captureScreen();
        if (!canvas) return;

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `v848-screenshot-${timestamp}.png`;

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            console.log(`📸 Screenshot saved: ${filename}`);
        });
    }

    async copyToClipboard() {
        const canvas = await this.captureScreen();
        if (!canvas) return;

        try {
            canvas.toBlob(async (blob) => {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                alert('Screenshot copied to clipboard!');
                console.log('📸 Screenshot copied to clipboard');
            });
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            alert('Failed to copy to clipboard. Try downloading instead.');
        }
    }

    async getDataURL() {
        const canvas = await this.captureScreen();
        if (!canvas) return null;

        return canvas.toDataURL('image/png');
    }

    // ========================================
    // VISUAL FEEDBACK
    // ========================================

    showCaptureIndicator() {
        // Flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            inset: 0;
            background: white;
            z-index: 99999;
            pointer-events: none;
            animation: screenshot-flash 0.3s ease-out;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes screenshot-flash {
                0% { opacity: 0.8; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(flash);

        setTimeout(() => {
            flash.remove();
            style.remove();
        }, 300);
    }

    hideCaptureIndicator() {
        // Cleanup handled in showCaptureIndicator
    }

    // ========================================
    // INTEGRATION WITH BUG REPORTS
    // ========================================

    async attachToBugReport() {
        const dataURL = await this.getDataURL();
        if (!dataURL) return null;

        // Truncate for bug report (too large for clipboard)
        return {
            hasScreenshot: true,
            screenshotSize: dataURL.length,
            screenshotPreview: dataURL.substring(0, 100) + '...'
        };
    }
}

// ========================================
// GLOBAL EXPORT
// ========================================

if (typeof window !== 'undefined') {
    window.ScreenshotTool = ScreenshotTool;
}

export { ScreenshotTool };
