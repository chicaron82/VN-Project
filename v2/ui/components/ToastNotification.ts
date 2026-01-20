
import { EventBus } from '@core/EventBus';



export interface ToastOptions {
    title: string;
    message: string;
    icon?: string;
    color?: string;
    duration?: number;
}

export class ToastNotification {
    private container: HTMLElement;

    constructor(_eventBus: EventBus) {
        // Reuse existing container if present (singleton pattern)
        const existing = document.getElementById('toast-container');
        if (existing) {
            this.container = existing;
        } else {
            this.container = this.createContainer();
        }
    }

    private createContainer(): HTMLElement {
        const div = document.createElement('div');
        div.id = 'toast-container';
        div.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 20000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(div);
        return div;
    }

    public show(options: ToastOptions) {
        const toast = document.createElement('div');
        toast.className = 'ui-toast';
        const color = options.color || '#0ff';

        toast.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid ${color};
            color: #fff;
            padding: 15px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            gap: 15px;
            min-width: 300px;
            font-family: 'Courier New', monospace;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
            transform: translateX(120%);
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        `;

        const iconHtml = options.icon ? `<div style="font-size: 2em;">${options.icon}</div>` : '';

        toast.innerHTML = `
            ${iconHtml}
            <div>
                <div style="color: ${color}; font-size: 0.8em; font-weight: bold; margin-bottom: 2px;">${options.title}</div>
                <div style="font-size: 1.1em; font-weight: bold;">${options.message}</div>
            </div>
        `;

        this.container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });

        // Remove after delay
        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, options.duration || 4000);
    }
}
