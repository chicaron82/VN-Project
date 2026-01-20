/**
 * UV7 OS - App Switcher (V2 TypeScript Wrapper)
 * Wraps the vanilla JS app switcher for use in V2's TypeScript environment
 */


// Declare the UV7AppSwitcher class from the vanilla JS file
declare class UV7AppSwitcher {
    constructor();
    toggle(): void;
    open(): void;
    close(): void;
    isOpen(): boolean;
}

// Load the vanilla JS app switcher script
const script = document.createElement('script');
script.src = '../showcase/uv7-app-switcher.js';
script.async = true;
document.head.appendChild(script);

// Export a promise that resolves when the app switcher is ready
export const appSwitcherReady = new Promise<UV7AppSwitcher>((resolve) => {
    script.onload = () => {
        // Wait for the class to be available
        const checkReady = setInterval(() => {
            if (typeof (window as any).UV7AppSwitcher !== 'undefined') {
                clearInterval(checkReady);
                const switcher = new (window as any).UV7AppSwitcher();
                resolve(switcher);
            }
        }, 50);
    };
});

// Export a function to initialize the app switcher
export async function initializeAppSwitcher(): Promise<UV7AppSwitcher> {
    return appSwitcherReady;
}
