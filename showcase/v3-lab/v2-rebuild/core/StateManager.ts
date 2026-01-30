import { EventBus } from './EventBus';

export type StateChangeCallback = (newValue: unknown, oldValue: unknown) => void;

interface HistoryEntry {
    path: string;
    oldValue: unknown;
    newValue: unknown;
    timestamp: number;
}

interface Snapshot {
    name: string;
    timestamp: number;
    state: Record<string, unknown>;
}

export class StateManager {
    private state: Record<string, unknown>;
    private subscribers: Map<string, Set<StateChangeCallback>>;
    private isDirty: boolean;
    private persistenceKey: string;
    private history: HistoryEntry[];
    private maxHistorySize: number;
    private historyEnabled: boolean;

    constructor(_eventBus?: EventBus, initialState: Record<string, unknown> = {}, persistenceKey = 'vn_state') {
        this.state = this.deepClone(initialState);
        this.subscribers = new Map();
        this.isDirty = false;
        this.persistenceKey = persistenceKey;
        this.history = [];
        this.maxHistorySize = 50;
        this.historyEnabled = true;

        console.log('💚 StateManager initialized');
    }

    get<T = unknown>(path: string): T | undefined {
        const value = this.getByPath(this.state, path);
        if (value !== undefined && value !== null && typeof value === 'object') {
            return this.deepClone(value) as T;
        }
        return value as T | undefined;
    }

    set(path: string, value: unknown): void {
        const clonedValue = this.deepClone(value);
        const oldValue = this.get(path);

        if (this.deepEqual(oldValue, clonedValue)) return;

        if (this.historyEnabled) {
            this.recordHistory(path, oldValue, clonedValue);
        }

        this.setByPath(this.state, path, clonedValue);
        this.isDirty = true;
        this.notifySubscribers(path, clonedValue, oldValue);
    }

    subscribe(path: string, callback: StateChangeCallback): () => void {
        if (!this.subscribers.has(path)) {
            this.subscribers.set(path, new Set());
        }
        this.subscribers.get(path)!.add(callback);

        return () => {
            const callbacks = this.subscribers.get(path);
            if (callbacks) callbacks.delete(callback);
        };
    }

    save(): void {
        if (!this.isDirty) return;
        try {
            localStorage.setItem(this.persistenceKey, JSON.stringify(this.state));
            this.isDirty = false;
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    }

    load(): boolean {
        try {
            const serialized = localStorage.getItem(this.persistenceKey);
            if (!serialized) return false;
            this.state = JSON.parse(serialized);
            this.isDirty = false;
            this.subscribers.forEach((callbacks, path) => {
                const value = this.get(path);
                callbacks.forEach(cb => cb(value, undefined));
            });
            return true;
        } catch (error) {
            console.error('Failed to load state:', error);
            return false;
        }
    }

    // Private Helpers
    private getByPath(obj: Record<string, unknown>, path: string): unknown {
        if (typeof path !== 'string') return undefined;
        const parts = path.split('.');
        let current: any = obj;
        for (const part of parts) {
            if (current === null || current === undefined) return undefined;
            current = current[part];
        }
        return current;
    }

    private setByPath(obj: Record<string, unknown>, path: string, value: unknown): void {
        const parts = path.split('.');
        const lastPart = parts.pop()!;
        let current: any = obj;
        for (const part of parts) {
            if (!(part in current) || typeof current[part] !== 'object') current[part] = {};
            current = current[part];
        }
        current[lastPart] = value;
    }

    private notifySubscribers(path: string, newValue: unknown, oldValue: unknown): void {
        const callbacks = this.subscribers.get(path);
        if (callbacks) callbacks.forEach(cb => cb(newValue, oldValue));
    }

    private deepClone<T>(value: T): T {
        if (value === null || typeof value !== 'object') return value;
        if (value instanceof Date) return new Date(value.getTime()) as any;
        if (Array.isArray(value)) return value.map(item => this.deepClone(item)) as any;
        const cloned = {} as any;
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                cloned[key] = this.deepClone((value as any)[key]);
            }
        }
        return cloned;
    }

    private deepEqual(a: unknown, b: unknown): boolean {
        if (a === b) return true;
        if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
        if (JSON.stringify(a) === JSON.stringify(b)) return true; // Simple check for now
        return false;
    }

    private recordHistory(path: string, oldValue: unknown, newValue: unknown): void {
        this.history.push({
            timestamp: Date.now(),
            path,
            oldValue: this.deepClone(oldValue),
            newValue: this.deepClone(newValue)
        });
        if (this.history.length > this.maxHistorySize) this.history.shift();
    }
}
