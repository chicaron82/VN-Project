import { EventBus } from './EventBus';
import { StateManager } from './StateManager';
import { TelemetryRecorder } from './Telemetry';
import { Logger } from '@utils/Logger';

interface MacroStep {
    id: string;
    action: 'wait' | 'click' | 'wait_for_text' | 'wait_for_scene' | 'click_route_start' | 'click_viewport';
    ms?: number;
    selector?: string;
    text?: string;
    sceneId?: string;
    route?: string;
    optional?: boolean;
    desc?: string;
}

/**
 * MacroRunner (V2)
 * Executes deterministic replay scripts for parity testing.
 */
export class MacroRunner {
    private eventBus: EventBus;
    private stateManager: StateManager;
    private telemetry: TelemetryRecorder;
    private isRunning: boolean;

    constructor(eventBus: EventBus, stateManager: StateManager, telemetry: TelemetryRecorder) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.telemetry = telemetry;
        this.isRunning = false;
    }

    async run(macroUrl: string) {
        if (this.isRunning) return;
        this.isRunning = true;

        Logger.system(`🤖 MacroRunner: Loading ${macroUrl}...`);

        try {
            const response = await fetch(macroUrl);
            const steps: MacroStep[] = await response.json();

            Logger.system(`🤖 MacroRunner: Starting execution (${steps.length} steps)`);
            this.telemetry.start();

            for (const step of steps) {
                Logger.system(`➡️ Step: ${step.id} (${step.desc || step.action})`);
                await this.executeStep(step);
            }

            Logger.system('✅ MacroRunner: Execution Complete');
            this.telemetry.stop();
            this.telemetry.download();

        } catch (error) {
            Logger.error('❌ MacroRunner Failed:', error);
            this.telemetry.stop();
        } finally {
            this.isRunning = false;
        }
    }

    private async executeStep(step: MacroStep): Promise<void> {
        switch (step.action) {
            case 'wait':
                await this.wait(step.ms || 1000);
                break;

            case 'click':
                await this.click(step.selector!);
                break;

            case 'click_viewport':
                // V2 specific: Viewport is usually #game-layout-viewport or just body click
                // We can simulate a click on the dialog box
                const dialogBox = document.getElementById('dialog-box') || document.body;
                dialogBox.click();
                break;

            case 'click_route_start':
                // V2: Might need to trigger EventBus event nicely if UI isn't easily clickable
                // Or actually click the DOM element if it exists
                // V2 RouteSelect creates buttons with specific text or IDs
                if (step.route === 'ronnie') {
                    const btn = document.querySelector('[data-route="ronnie"]') as HTMLElement;
                    if (btn) btn.click();
                    else this.eventBus.emit('ui:start_game', { route: 'ronnie' }); // Fallback
                } else {
                    const btn = document.querySelector('[data-route="tori"]') as HTMLElement;
                    if (btn) btn.click();
                    else this.eventBus.emit('ui:start_game', { route: 'tori' });
                }
                break;

            case 'wait_for_text':
                await this.waitForText(step.text!);
                break;

            case 'wait_for_scene':
                await this.waitForScene(step.sceneId!);
                break;
        }
    }

    private wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async click(selector: string): Promise<void> {
        const el = document.querySelector(selector) as HTMLElement;
        if (el) {
            el.click();
        } else {
            Logger.warn(`⚠️ Macro: Element ${selector} not found`);
        }
    }

    private waitForText(text: string): Promise<void> {
        return new Promise(resolve => {
            const check = () => {
                if (document.body.innerText.includes(text)) {
                    resolve();
                } else {
                    setTimeout(check, 200);
                }
            };
            check();
        });
    }

    private waitForScene(sceneId: string): Promise<void> {
        return new Promise(resolve => {
            // V2 State Check
            const check = () => {
                const current = this.stateManager.get('game.currentScene');
                if (current === sceneId) {
                    resolve();
                } else {
                    setTimeout(check, 200);
                }
            };
            check();
        });
    }
}
