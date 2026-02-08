/**
 * EventBus - Centralized Event System
 * 
 * Type-safe pub/sub event system for decoupled communication.
 */

export type GameEvents = {
    'scene:load': { sceneId: string };
    'scene:complete': { sceneId: string };
    'dialog:show': { entry: { character: string; text: string } };
    'choice:show': { choices: Array<{ text: string; next: string | null }> };
    'choice:selected': { index: number; choiceId: string; text: string };
    'tether:start': {};
    'tether:change': { level: number; delta: number };
    'tether:critical': { level: number };
    'save:complete': { slot: number };
    'load:complete': { slot: number };
    'achievement:unlock': { id: string };
    'status:update': { context: string; detail?: string };
    'notification:show': {
        id?: string;
        title: string;
        message: string;
        icon?: string;
        category?: 'system' | 'torigatchi' | 'achievement' | 'autosave' | 'tether' | 'note' | 'app';
        priority?: 'urgent' | 'high' | 'normal' | 'low';
        duration?: number;
    };
    'effect:code_rain': { duration: number };
    'effect:glitch': { intensity: number };
    'ui:route_select': {};
    'ui:main_menu': {};
    'ui:start_game': { route: 'ronnie' | 'tori' };
    'ui:start_prologue': {};
    'loop:reset': { version: number; status: string };
    'secret_code:discovered': { code: string; name: string };
    // Visual Effects Layer Events
    'dialog:advance': {};
    'tether:boost': { amount: number };
    'tether:death': {};
    'settings:changed': { key: string; value: any };
    'insane:activate': {};
    'insane:deactivate': {};
    'insane:corrupt': {};
    'effect:shake': { intensity: string };
    'ui:notification': { type: string; message: string };
    'visual:cue': { type: string | null; channel: string; sceneId?: string };
    'visual:background': { image: string };
};

export type EventName = keyof GameEvents;
export type EventCallback<T extends EventName> = (data: GameEvents[T]) => void;

interface EventHistoryEntry<T extends EventName = EventName> {
    event: T;
    data: GameEvents[T];
    timestamp: number;
}

export class EventBus {
    private subscribers: Map<EventName, Set<EventCallback<EventName>>>;
    private snoopers: Set<(event: EventName, data: any) => void>;
    private history: EventHistoryEntry[];
    private maxHistorySize: number;
    private historyEnabled: boolean;

    constructor(maxHistorySize = 100, historyEnabled = true) {
        this.subscribers = new Map();
        this.snoopers = new Set();
        this.history = [];
        this.maxHistorySize = maxHistorySize;
        this.historyEnabled = historyEnabled;
    }

    snoop(callback: (event: EventName, data: any) => void): () => void {
        this.snoopers.add(callback);
        return () => this.snoopers.delete(callback);
    }

    on<T extends EventName>(
        event: T,
        callback: EventCallback<T>
    ): () => void {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, new Set());
        }

        const callbacks = this.subscribers.get(event)!;
        callbacks.add(callback as EventCallback<EventName>);

        return () => {
            const callbacks = this.subscribers.get(event);
            if (callbacks) {
                callbacks.delete(callback as EventCallback<EventName>);
            }
        };
    }

    emit<T extends EventName>(event: T, data: GameEvents[T]): void {
        if (this.historyEnabled) {
            this.history.push({
                event,
                data,
                timestamp: Date.now(),
            });

            if (this.history.length > this.maxHistorySize) {
                this.history.shift();
            }
        }

        this.snoopers.forEach(snooper => {
            try {
                snooper(event, data);
            } catch (error) {
                console.error('Error in event snooper:', error);
            }
        });

        const callbacks = this.subscribers.get(event);
        if (callbacks) {
            callbacks.forEach((callback) => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event callback for ${event}:`, error);
                }
            });
        }
    }

    off<T extends EventName>(event: T, callback: EventCallback<T>): void {
        const callbacks = this.subscribers.get(event);
        if (callbacks) {
            callbacks.delete(callback as EventCallback<EventName>);
        }
    }

    clear(event?: EventName): void {
        if (event) {
            this.subscribers.delete(event);
        } else {
            this.subscribers.clear();
        }
    }
}
