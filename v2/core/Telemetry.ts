import { EventBus } from './EventBus';
import { StateManager } from './StateManager';

/**
 * Telemetry Event Structure
 * Standardized format for V1/V2 comparison
 */
export interface TelemetryEvent {
    id: number;              // Sequence ID
    timestamp: number;       // Absolute timestamp
    delta: number;           // Time since startRecording
    type: string;            // Event name
    payload: any;            // Event data
    stateHash?: string;      // Simple hash of state (for quick divergence check)
    snapshot?: any;          // Full state snapshot (optional, heavy)
}

/**
 * Telemetry Recorder (V2)
 * 
 * "The Black Box" - Records every heartbeat of the engine to verify
 * parity against the V1 "Golden Master".
 */
export class TelemetryRecorder {
    private eventBus: EventBus;
    private stateManager: StateManager;
    private log: TelemetryEvent[];
    private startTime: number;
    private isRecording: boolean;
    private sequenceId: number;
    private cleanupSnooper: (() => void) | null;

    // Events that trigger a full state snapshot
    private readonly SNAPSHOT_TRIGGERS = new Set<string>([
        'scene:load',
        'choice:show',
        'choice:selected',
        'save:complete',
        'load:complete',
        'variable:changed' // (If exists, or similar)
    ]);

    constructor(eventBus: EventBus, stateManager: StateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.log = [];
        this.startTime = 0;
        this.isRecording = false;
        this.sequenceId = 0;
        this.cleanupSnooper = null;
    }

    /**
     * Start recording telemetry
     */
    start(): void {
        if (this.isRecording) return;

        this.isRecording = true;
        this.startTime = Date.now();
        this.log = [];
        this.sequenceId = 0;

        console.log('📼 Telemetry Recording Started');

        // Hook into EventBus
        this.cleanupSnooper = this.eventBus.snoop((event, data) => {
            this.recordEvent(event, data);
        });

        // Record initial state
        this.recordEvent('telemetry:start', { timestamp: this.startTime });
    }

    /**
     * Stop recording
     */
    stop(): void {
        if (!this.isRecording) return;

        this.isRecording = false;
        if (this.cleanupSnooper) {
            this.cleanupSnooper();
            this.cleanupSnooper = null;
        }

        console.log(`📼 Telemetry Recording Stopped (${this.log.length} events)`);
    }

    /**
     * Record a single event
     */
    private recordEvent(type: string, payload: any): void {
        const now = Date.now();
        const entry: TelemetryEvent = {
            id: this.sequenceId++,
            timestamp: now,
            delta: now - this.startTime,
            type,
            payload: JSON.parse(JSON.stringify(payload)) // Detach reference
        };

        // Snapshot state for critical events
        if (this.SNAPSHOT_TRIGGERS.has(type)) {
            entry.snapshot = this.stateManager.getAll();
        }

        // Add simple state hash to EVERYTHING for granular drift detection
        // (Using JSON string length + scene ID as a cheap "hash" proxy)
        const currentState = this.stateManager.getAll();
        const sceneId = this.stateManager.get('game.currentScene') || 'unknown';
        entry.stateHash = `${sceneId}_${JSON.stringify(currentState).length}`;

        this.log.push(entry);
    }

    /**
     * Get the full log
     */
    getLog(): TelemetryEvent[] {
        return this.log;
    }

    /**
     * Export log to JSON string
     */
    export(): string {
        return JSON.stringify({
            sessionStart: this.startTime,
            duration: Date.now() - this.startTime,
            events: this.log
        }, null, 2);
    }

    /**
     * Download the log as a file
     */
    download(filename = 'telemetry-v2.json'): void {
        const data = this.export();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log(`💾 Telemetry saved to ${filename}`);
    }
}
