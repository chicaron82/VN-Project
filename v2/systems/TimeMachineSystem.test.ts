import { TimeMachineSystem } from './TimeMachineSystem';
import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';
import { GameEngine } from '../core/GameEngine';

/**
 * ════════════════════════════════════════════════════════════════
 * TIME MACHINE SYSTEM TESTS - Phase 15d
 *
 * Tests for timeline navigation & snapshot system
 * Built from Tori's architecture 💚
 * 🖤💚🔥💀 UV7 Crew
 * ════════════════════════════════════════════════════════════════
 */

describe('TimeMachineSystem', () => {
    let eventBus: EventBus;
    let stateManager: StateManager;
    let engine: GameEngine;
    let timeMachine: TimeMachineSystem;

    beforeEach(() => {
        eventBus = new EventBus();
        stateManager = new StateManager(eventBus);
        engine = new GameEngine(eventBus, stateManager);
        timeMachine = new TimeMachineSystem(eventBus, stateManager, engine, {
            maxEntries: 10, // Small for testing
            pruneStrategy: 'smart'
        });

        // Setup initial game state
        stateManager.set('game.currentRoute', 'tori');
        stateManager.set('game.currentScene', 'scene_1');
        stateManager.set('game.currentPageIndex', 0);
        stateManager.set('game.tether', 100);
        stateManager.set('game.flags', { testFlag: true });
    });

    // ════════════════════════════════════════════════════════════════
    // INITIALIZATION TESTS
    // ════════════════════════════════════════════════════════════════

    describe('initialization', () => {
        it('should initialize with empty entries', () => {
            expect(timeMachine.getEntries()).toHaveLength(0);
        });

        it('should initialize with default config', () => {
            const stats = timeMachine.getStats();
            expect(stats.max).toBe(10);
            expect(stats.total).toBe(0);
        });

        it('should use custom config when provided', () => {
            const customMachine = new TimeMachineSystem(eventBus, stateManager, engine, {
                maxEntries: 50,
                pruneStrategy: 'fifo'
            });
            expect(customMachine.getStats().max).toBe(50);
        });
    });

    // ════════════════════════════════════════════════════════════════
    // SNAPSHOT BUILDING TESTS
    // ════════════════════════════════════════════════════════════════

    describe('buildSnapshot', () => {
        it('should build snapshot with current state', () => {
            const snapshot = timeMachine.buildSnapshot('test snapshot', 'normal');

            expect(snapshot.label).toBe('test snapshot');
            expect(snapshot.priority).toBe('normal');
            expect(snapshot.routeId).toBe('tori');
            expect(snapshot.sceneId).toBe('scene_1');
            expect(snapshot.tether).toBe(100);
            expect(snapshot.corrupted).toBe(false);
            expect(snapshot.locked).toBe(false);
            expect(snapshot.burned).toBe(false);
        });

        it('should assign unique IDs to snapshots', () => {
            const snap1 = timeMachine.buildSnapshot();
            const snap2 = timeMachine.buildSnapshot();

            expect(snap1.id).not.toBe(snap2.id);
            expect(snap2.id).toBe(snap1.id + 1);
        });

        it('should include timestamp', () => {
            const before = Date.now();
            const snapshot = timeMachine.buildSnapshot();
            const after = Date.now();

            expect(snapshot.createdAt).toBeGreaterThanOrEqual(before);
            expect(snapshot.createdAt).toBeLessThanOrEqual(after);
        });
    });

    // ════════════════════════════════════════════════════════════════
    // ENTRY MANAGEMENT TESTS
    // ════════════════════════════════════════════════════════════════

    describe('addCurrentState', () => {
        it('should add snapshot to entries', () => {
            const snapshot = timeMachine.addCurrentState('test');

            expect(snapshot).not.toBeNull();
            expect(timeMachine.getEntries()).toHaveLength(1);
        });

        it('should skip snapshots with no route/scene', () => {
            stateManager.set('game.currentRoute', null);
            stateManager.set('game.currentScene', null);

            const snapshot = timeMachine.addCurrentState('empty');

            expect(snapshot).toBeNull();
            expect(timeMachine.getEntries()).toHaveLength(0);
        });

        it('should respect priority levels', () => {
            timeMachine.addCurrentState('low', 'low');
            timeMachine.addCurrentState('high', 'high');
            timeMachine.addCurrentState('anchor', 'anchor');

            const entries = timeMachine.getEntries();
            expect(entries[0].priority).toBe('low');
            expect(entries[1].priority).toBe('high');
            expect(entries[2].priority).toBe('anchor');
        });
    });

    describe('addEntry', () => {
        it('should add manual entry', () => {
            const entry = timeMachine.addEntry({
                label: 'manual',
                routeId: 'ronnie',
                sceneId: 'scene_2',
                priority: 'high'
            });

            expect(entry.label).toBe('manual');
            expect(entry.routeId).toBe('ronnie');
            expect(timeMachine.getEntries()).toHaveLength(1);
        });

        it('should assign ID if not provided', () => {
            const entry = timeMachine.addEntry({ label: 'no-id' });
            expect(entry.id).toBeDefined();
            expect(entry.id).toBeGreaterThan(0);
        });
    });

    // ════════════════════════════════════════════════════════════════
    // PRUNING TESTS
    // ════════════════════════════════════════════════════════════════

    describe('pruning', () => {
        it('should prune when exceeding maxEntries', () => {
            // Add 15 entries (max is 10)
            for (let i = 0; i < 15; i++) {
                stateManager.set('game.currentScene', `scene_${i}`);
                timeMachine.addCurrentState(`entry ${i}`, 'normal');
            }

            expect(timeMachine.getEntries().length).toBeLessThanOrEqual(10);
        });

        it('should preserve anchors during smart pruning', () => {
            // Add anchor first
            timeMachine.addCurrentState('anchor', 'anchor');

            // Add many low priority
            for (let i = 0; i < 15; i++) {
                stateManager.set('game.currentScene', `scene_${i}`);
                timeMachine.addCurrentState(`low ${i}`, 'low');
            }

            const entries = timeMachine.getEntries();
            const anchors = entries.filter(e => e.priority === 'anchor');
            expect(anchors.length).toBe(1);
        });

        it('should prefer pruning low priority over normal', () => {
            // Add some low and normal priority
            for (let i = 0; i < 6; i++) {
                stateManager.set('game.currentScene', `scene_low_${i}`);
                timeMachine.addCurrentState(`low ${i}`, 'low');
            }
            for (let i = 0; i < 6; i++) {
                stateManager.set('game.currentScene', `scene_normal_${i}`);
                timeMachine.addCurrentState(`normal ${i}`, 'normal');
            }

            const entries = timeMachine.getEntries();
            const lowCount = entries.filter(e => e.priority === 'low').length;
            const normalCount = entries.filter(e => e.priority === 'normal').length;

            // Should have fewer low priority entries
            expect(normalCount).toBeGreaterThanOrEqual(lowCount);
        });
    });

    // ════════════════════════════════════════════════════════════════
    // QUERY TESTS
    // ════════════════════════════════════════════════════════════════

    describe('queries', () => {
        it('should get entry by ID', () => {
            const snapshot = timeMachine.addCurrentState('test');
            if (!snapshot) throw new Error('Snapshot should exist');

            const found = timeMachine.getEntryById(snapshot.id);
            expect(found).not.toBeNull();
            expect(found?.label).toBe('test');
        });

        it('should return null for non-existent ID', () => {
            const found = timeMachine.getEntryById(9999);
            expect(found).toBeNull();
        });

        it('should get latest entry', () => {
            timeMachine.addCurrentState('first');
            timeMachine.addCurrentState('second');
            timeMachine.addCurrentState('third');

            const latest = timeMachine.getLatestEntry();
            expect(latest?.label).toBe('third');
        });

        it('should return null for latest when empty', () => {
            const latest = timeMachine.getLatestEntry();
            expect(latest).toBeNull();
        });
    });

    // ════════════════════════════════════════════════════════════════
    // NARRATIVE STATE MANIPULATION TESTS
    // ════════════════════════════════════════════════════════════════

    describe('narrative state', () => {
        it('should mark entry as corrupted', () => {
            const snapshot = timeMachine.addCurrentState('test');
            if (!snapshot) throw new Error('Snapshot should exist');

            timeMachine.markCorrupted(snapshot.id, 'despair');

            const entry = timeMachine.getEntryById(snapshot.id);
            expect(entry?.corrupted).toBe(true);
            expect(entry?.corruptionMode).toBe('despair');
        });

        it('should burn entry', () => {
            const snapshot = timeMachine.addCurrentState('test');
            if (!snapshot) throw new Error('Snapshot should exist');

            timeMachine.burnEntry(snapshot.id);

            const entry = timeMachine.getEntryById(snapshot.id);
            expect(entry?.burned).toBe(true);
        });

        it('should lock entry', () => {
            const snapshot = timeMachine.addCurrentState('test');
            if (!snapshot) throw new Error('Snapshot should exist');

            timeMachine.lockEntry(snapshot.id);

            const entry = timeMachine.getEntryById(snapshot.id);
            expect(entry?.locked).toBe(true);
        });

        it('should burn entries matching predicate', () => {
            timeMachine.addCurrentState('burn me', 'low');
            timeMachine.addCurrentState('keep me', 'high');
            timeMachine.addCurrentState('burn me too', 'low');

            timeMachine.burnEntriesWhere(e => e.priority === 'low');

            const entries = timeMachine.getEntries();
            expect(entries.filter(e => e.burned).length).toBe(2);
            expect(entries.find(e => e.label === 'keep me')?.burned).toBe(false);
        });

        it('should corrupt entries matching predicate', () => {
            timeMachine.addCurrentState('corrupt me', 'normal');
            timeMachine.addCurrentState('keep me', 'anchor');

            timeMachine.corruptEntriesWhere(e => e.priority === 'normal', 'echo');

            const entries = timeMachine.getEntries();
            expect(entries.find(e => e.label === 'corrupt me')?.corrupted).toBe(true);
            expect(entries.find(e => e.label === 'corrupt me')?.corruptionMode).toBe('echo');
        });
    });

    // ════════════════════════════════════════════════════════════════
    // JUMP VALIDATION TESTS
    // ════════════════════════════════════════════════════════════════

    describe('jump validation', () => {
        it('should allow jump to normal entry', () => {
            const snapshot = timeMachine.addCurrentState('test');
            if (!snapshot) throw new Error('Snapshot should exist');

            expect(timeMachine.canJumpTo(snapshot)).toBe(true);
        });

        it('should block jump to locked entry', () => {
            const snapshot = timeMachine.addCurrentState('test');
            if (!snapshot) throw new Error('Snapshot should exist');

            timeMachine.lockEntry(snapshot.id);

            expect(timeMachine.canJumpTo(snapshot)).toBe(false);
        });

        it('should block jump to burned entry', () => {
            const snapshot = timeMachine.addCurrentState('test');
            if (!snapshot) throw new Error('Snapshot should exist');

            timeMachine.burnEntry(snapshot.id);

            expect(timeMachine.canJumpTo(snapshot)).toBe(false);
        });

        it('should allow jump with ignoreRules option', () => {
            const snapshot = timeMachine.addCurrentState('test');
            if (!snapshot) throw new Error('Snapshot should exist');

            timeMachine.lockEntry(snapshot.id);

            expect(timeMachine.canJumpTo(snapshot, { ignoreRules: true })).toBe(true);
        });

        it('should restrict jumps in insane mode to last 2 entries', () => {
            // Add several entries
            for (let i = 0; i < 5; i++) {
                stateManager.set('game.currentScene', `scene_${i}`);
                timeMachine.addCurrentState(`entry ${i}`);
            }

            // Enable insane mode
            stateManager.set('game.flags', { insaneModeLocked: true });

            const entries = timeMachine.getEntries();
            const oldest = entries[0];
            const newest = entries[entries.length - 1];

            expect(timeMachine.canJumpTo(oldest)).toBe(false);
            expect(timeMachine.canJumpTo(newest)).toBe(true);
        });
    });

    describe('getBlockReason', () => {
        it('should return locked reason', () => {
            const snapshot = timeMachine.addCurrentState('test');
            if (!snapshot) throw new Error('Snapshot should exist');

            timeMachine.lockEntry(snapshot.id);

            const reason = timeMachine.getBlockReason(snapshot);
            expect(reason).toBe('This moment is locked');
        });

        it('should return burned reason', () => {
            const snapshot = timeMachine.addCurrentState('test');
            if (!snapshot) throw new Error('Snapshot should exist');

            timeMachine.burnEntry(snapshot.id);

            const reason = timeMachine.getBlockReason(snapshot);
            expect(reason).toBe('This moment has burned out of reach');
        });

        it('should return despair corruption reason', () => {
            const snapshot = timeMachine.addCurrentState('test');
            if (!snapshot) throw new Error('Snapshot should exist');

            timeMachine.markCorrupted(snapshot.id, 'despair');

            const reason = timeMachine.getBlockReason(snapshot);
            expect(reason).toBe('Despair has tainted this memory');
        });

        it('should return echo corruption reason', () => {
            const snapshot = timeMachine.addCurrentState('test');
            if (!snapshot) throw new Error('Snapshot should exist');

            timeMachine.markCorrupted(snapshot.id, 'echo');

            const reason = timeMachine.getBlockReason(snapshot);
            expect(reason).toBe('Echo interference detected');
        });

        it('should return null for normal entry', () => {
            const snapshot = timeMachine.addCurrentState('test');
            if (!snapshot) throw new Error('Snapshot should exist');

            const reason = timeMachine.getBlockReason(snapshot);
            expect(reason).toBeNull();
        });
    });

    // ════════════════════════════════════════════════════════════════
    // JUMP EXECUTION TESTS
    // ════════════════════════════════════════════════════════════════

    describe('jumpTo', () => {
        it('should execute successful jump', async () => {
            const snapshot = timeMachine.addCurrentState('test');
            if (!snapshot) throw new Error('Snapshot should exist');

            const result = await timeMachine.jumpTo(snapshot.id);
            expect(result).toBe(true);
        });

        it('should fail jump to non-existent entry', async () => {
            const result = await timeMachine.jumpTo(9999);
            expect(result).toBe(false);
        });

        it('should fail jump to locked entry', async () => {
            const snapshot = timeMachine.addCurrentState('test');
            if (!snapshot) throw new Error('Snapshot should exist');

            timeMachine.lockEntry(snapshot.id);

            const result = await timeMachine.jumpTo(snapshot.id);
            expect(result).toBe(false);
        });

        it('should emit visual cue on successful jump', async () => {
            const cueSpy = vi.fn();
            eventBus.on('visual:cue', cueSpy);

            const snapshot = timeMachine.addCurrentState('test');
            if (!snapshot) throw new Error('Snapshot should exist');

            await timeMachine.jumpTo(snapshot.id);

            expect(cueSpy).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'timelineGlitch' })
            );
        });

        it('should emit denial cue on blocked jump', async () => {
            const cueSpy = vi.fn();
            eventBus.on('visual:cue', cueSpy);

            const snapshot = timeMachine.addCurrentState('test');
            if (!snapshot) throw new Error('Snapshot should exist');

            timeMachine.lockEntry(snapshot.id);

            await timeMachine.jumpTo(snapshot.id);

            expect(cueSpy).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'denied', channel: 'critical' })
            );
        });
    });

    // ════════════════════════════════════════════════════════════════
    // STATS TESTS
    // ════════════════════════════════════════════════════════════════

    describe('getStats', () => {
        it('should return accurate stats', () => {
            timeMachine.addCurrentState('normal1', 'normal');
            timeMachine.addCurrentState('normal2', 'normal');
            timeMachine.addCurrentState('anchor', 'anchor');

            const stats = timeMachine.getStats();
            expect(stats.total).toBe(3);
            expect(stats.anchors).toBe(1);
            expect(stats.locked).toBe(0);
            expect(stats.burned).toBe(0);
            expect(stats.corrupted).toBe(0);
        });

        it('should count locked/burned/corrupted', () => {
            const snap1 = timeMachine.addCurrentState('1');
            const snap2 = timeMachine.addCurrentState('2');
            const snap3 = timeMachine.addCurrentState('3');

            if (!snap1 || !snap2 || !snap3) throw new Error('Snapshots should exist');

            timeMachine.lockEntry(snap1.id);
            timeMachine.burnEntry(snap2.id);
            timeMachine.markCorrupted(snap3.id, 'despair');

            const stats = timeMachine.getStats();
            expect(stats.locked).toBe(1);
            expect(stats.burned).toBe(1);
            expect(stats.corrupted).toBe(1);
        });
    });

    // ════════════════════════════════════════════════════════════════
    // PERSISTENCE TESTS
    // ════════════════════════════════════════════════════════════════

    describe('persistence', () => {
        it('should serialize entries', () => {
            timeMachine.addCurrentState('test1');
            timeMachine.addCurrentState('test2');

            const serialized = timeMachine.serialize();
            expect(serialized.entries).toHaveLength(2);
            expect(serialized.nextId).toBeGreaterThan(2);
        });

        it('should deserialize entries', () => {
            const data = {
                entries: [
                    {
                        id: 100,
                        label: 'restored',
                        priority: 'normal' as const,
                        routeId: 'tori',
                        sceneId: 'scene_1',
                        pageIndex: 0,
                        tether: 50,
                        flags: {},
                        bgKey: null,
                        spriteKey: null,
                        createdAt: Date.now(),
                        corrupted: false,
                        corruptionMode: null,
                        locked: false,
                        burned: false,
                        insaneBlocked: false
                    }
                ],
                nextId: 101
            };

            timeMachine.deserialize(data);

            const entries = timeMachine.getEntries();
            expect(entries).toHaveLength(1);
            expect(entries[0].label).toBe('restored');
        });

        it('should handle null deserialize gracefully', () => {
            timeMachine.addCurrentState('test');
            timeMachine.deserialize(null);

            // Should still have the original entry
            expect(timeMachine.getEntries()).toHaveLength(1);
        });
    });

    // ════════════════════════════════════════════════════════════════
    // CLEAR TESTS
    // ════════════════════════════════════════════════════════════════

    describe('clear', () => {
        it('should clear all entries', () => {
            timeMachine.addCurrentState('test1');
            timeMachine.addCurrentState('test2');

            timeMachine.clear();

            expect(timeMachine.getEntries()).toHaveLength(0);
        });

        it('should reset ID counter', () => {
            timeMachine.addCurrentState('test');
            timeMachine.clear();

            const newSnapshot = timeMachine.addCurrentState('new');
            expect(newSnapshot?.id).toBe(1);
        });
    });
});
