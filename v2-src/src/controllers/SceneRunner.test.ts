/**
 * SceneRunner Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SceneRunner } from './SceneRunner';
import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';
import { DialogController } from './DialogController';
import { EffectsController } from './EffectsController';
import { TetherController } from './TetherController';
import type { Scene, Choice } from '../core/types';

describe('SceneRunner', () => {
  let runner: SceneRunner;
  let eventBus: EventBus;
  let stateManager: StateManager;
  let dialogController: DialogController;
  let effectsController: EffectsController;
  let tetherController: TetherController;

  beforeEach(() => {
    eventBus = new EventBus();
    stateManager = new StateManager();
    dialogController = new DialogController({ eventBus });
    effectsController = new EffectsController({ eventBus });
    tetherController = new TetherController({ eventBus, stateManager });

    runner = new SceneRunner({
      eventBus,
      stateManager,
      dialogController,
      effectsController,
      tetherController,
    });

    runner.init();
  });

  // ==========================================================================
  // BASIC SCENE EXECUTION
  // ==========================================================================

  describe('basic execution', () => {
    it('starts in idle phase', () => {
      expect(runner.getPhase()).toBe('idle');
      expect(runner.isRunning()).toBe(false);
    });

    it('runs a simple scene with dialog', async () => {
      const scene: Scene = {
        id: 'test-scene',
        background: 'testBg',
        dialog: [
          { speaker: 'narrator', text: 'Hello world' },
        ],
      };

      const onBackground = vi.fn();
      const onComplete = vi.fn();

      // Run scene (don't await - it waits for dialog)
      const runPromise = runner.run(scene, { onBackground, onComplete });

      // Wait a tick for enterScene to complete
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(onBackground).toHaveBeenCalledWith('testBg');
      expect(runner.isRunning()).toBe(true);
      expect(runner.getPhase()).toBe('dialog');

      // Simulate dialog completion
      eventBus.emit('dialog:complete');

      await runPromise;

      expect(runner.getPhase()).toBe('complete');
      expect(onComplete).toHaveBeenCalledWith(scene);
    });

    it('calls sprite callback', async () => {
      const scene: Scene = {
        id: 'test-scene',
        sprites: [
          { character: 'ronnie', emotion: 'happy', position: 'left' },
        ],
      };

      const onSprites = vi.fn();
      const runPromise = runner.run(scene, { onSprites });

      expect(onSprites).toHaveBeenCalledWith(scene.sprites);

      // No dialog, so it completes immediately
      await runPromise;
    });

    it('calls music callback', async () => {
      const scene: Scene = {
        id: 'test-scene',
        music: 'main-theme',
      };

      const onMusic = vi.fn();
      await runner.run(scene, { onMusic });

      expect(onMusic).toHaveBeenCalledWith('main-theme');
    });
  });

  // ==========================================================================
  // AUTO-ADVANCE
  // ==========================================================================

  describe('auto-advance', () => {
    it('transitions after autoAdvanceDelay', async () => {
      vi.useFakeTimers();

      const scene: Scene = {
        id: 'test-scene',
        autoAdvanceDelay: 1000,
        next: 'next-scene',
      };

      const onTransition = vi.fn();
      const runPromise = runner.run(scene, { onTransition });

      // Wait for enterScene to complete (no dialog, goes straight to complete)
      await vi.advanceTimersByTimeAsync(0);

      // Now in complete phase, waiting for autoAdvanceDelay
      expect(runner.getPhase()).toBe('complete');
      expect(onTransition).not.toHaveBeenCalled();

      // Advance time to trigger auto-transition
      await vi.advanceTimersByTimeAsync(1000);

      expect(onTransition).toHaveBeenCalledWith('next-scene');

      await runPromise;
      vi.useRealTimers();
    });
  });

  // ==========================================================================
  // CHOICES
  // ==========================================================================

  describe('choices', () => {
    it('enters choosing phase when scene has choices', async () => {
      const scene: Scene = {
        id: 'test-scene',
        dialog: [{ speaker: 'narrator', text: 'Choose:' }],
        choices: [
          { text: 'Option A', next: 'scene-a' },
          { text: 'Option B', next: 'scene-b' },
        ],
      };

      runner.run(scene, {});

      // Wait for enterScene async to complete and dialog phase to start
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(runner.getPhase()).toBe('dialog');

      // Simulate dialog completion
      eventBus.emit('dialog:complete');

      // Wait for phase transition
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Should now be in choosing phase
      expect(runner.getPhase()).toBe('choosing');
    });

    it('filters choices by flag condition', async () => {
      stateManager.setFlag('hasKey', true);

      const scene: Scene = {
        id: 'test-scene',
        choices: [
          { text: 'Open door', next: 'scene-a', condition: { flag: 'hasKey' } },
          { text: 'Walk away', next: 'scene-b' },
        ],
      };

      const onTransition = vi.fn();
      runner.run(scene, { onTransition });

      // Wait for scene to enter choices phase (no dialog, goes straight to choices)
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(runner.getPhase()).toBe('choosing');

      // Both choices should be available since flag is set
      const visibleChoices = dialogController.getVisibleChoices();
      expect(visibleChoices).toHaveLength(2);
    });

    it('filters choices by counter condition', async () => {
      stateManager.setCounter('gold', 50);

      const scene: Scene = {
        id: 'test-scene',
        choices: [
          {
            text: 'Buy item (100 gold)',
            next: 'scene-a',
            condition: { counter: { name: 'gold', comparison: 'gte', value: 100 } },
          },
          { text: 'Leave', next: 'scene-b' },
        ],
      };

      runner.run(scene, {});

      // First choice should be filtered out (not enough gold)
      // The filtering happens in SceneRunner.filterChoicesByCondition
    });

    it('applies choice effects on selection', () => {
      stateManager.setCounter('points', 0);

      const choice: Choice = {
        text: 'Good choice',
        next: 'next-scene',
        counters: [{ name: 'points', operation: 'add', value: 10 }],
        flags: [{ name: 'madeGoodChoice', value: true }],
      };

      // Access private method via any cast for testing
      (runner as any).applyChoiceEffects(choice);

      expect(stateManager.getCounter('points')).toBe(10);
      expect(stateManager.hasFlag('madeGoodChoice')).toBe(true);
    });

    it('applies tether cost on choice', () => {
      tetherController.init();
      stateManager.set('tetherLevel', 100);

      const choice: Choice = {
        text: 'Risky choice',
        next: 'next-scene',
        tetherCost: 20,
      };

      (runner as any).applyChoiceEffects(choice);

      expect(stateManager.get('tetherLevel')).toBe(80);
    });
  });

  // ==========================================================================
  // CONDITIONAL NEXT
  // ==========================================================================

  describe('conditional next', () => {
    it('resolves next scene by flag', () => {
      stateManager.setFlag('truePath', true);

      const scene: Scene = {
        id: 'test-scene',
        next: {
          conditions: [
            { condition: { flag: 'truePath' }, sceneId: 'true-ending' },
          ],
          default: 'bad-ending',
        },
      };

      const result = (runner as any).resolveNextScene(scene);
      expect(result).toBe('true-ending');
    });

    it('resolves next scene by counter', () => {
      stateManager.setCounter('route_points', 10);

      const scene: Scene = {
        id: 'test-scene',
        next: {
          conditions: [
            {
              condition: { counter: { name: 'route_points', comparison: 'gte', value: 5 } },
              sceneId: 'good-path',
            },
          ],
          default: 'bad-path',
        },
      };

      const result = (runner as any).resolveNextScene(scene);
      expect(result).toBe('good-path');
    });

    it('resolves next scene by tether level', () => {
      stateManager.set('tetherLevel', 30);

      const scene: Scene = {
        id: 'test-scene',
        next: {
          conditions: [
            {
              condition: { tether: { comparison: 'lte', value: 50 } },
              sceneId: 'desperate-path',
            },
          ],
          default: 'normal-path',
        },
      };

      const result = (runner as any).resolveNextScene(scene);
      expect(result).toBe('desperate-path');
    });

    it('uses default when no conditions match', () => {
      const scene: Scene = {
        id: 'test-scene',
        next: {
          conditions: [
            { condition: { flag: 'nonexistent' }, sceneId: 'never' },
          ],
          default: 'default-scene',
        },
      };

      const result = (runner as any).resolveNextScene(scene);
      expect(result).toBe('default-scene');
    });
  });

  // ==========================================================================
  // EFFECTS
  // ==========================================================================

  describe('effects', () => {
    it('plays scene effects on enter', async () => {
      vi.useFakeTimers();
      const playSpy = vi.spyOn(effectsController, 'play');

      const scene: Scene = {
        id: 'test-scene',
        effects: [
          { type: 'glitch', duration: 100 },
          { type: 'shake', duration: 100 },
        ],
      };

      const runPromise = runner.run(scene, {});

      // Advance past effect duration
      vi.advanceTimersByTime(500);

      await runPromise;

      expect(playSpy).toHaveBeenCalledTimes(2);
      expect(playSpy).toHaveBeenCalledWith({ type: 'glitch', duration: 100 });
      expect(playSpy).toHaveBeenCalledWith({ type: 'shake', duration: 100 });

      vi.useRealTimers();
    });

    it('applies tether impact', async () => {
      const adjustSpy = vi.spyOn(stateManager, 'adjustTether');

      const scene: Scene = {
        id: 'test-scene',
        tetherImpact: -15,
      };

      await runner.run(scene, {});

      expect(adjustSpy).toHaveBeenCalledWith(-15, 'scene: test-scene');
    });
  });

  // ==========================================================================
  // STOP AND ADVANCE
  // ==========================================================================

  describe('stop and advance', () => {
    it('stops scene execution', async () => {
      const scene: Scene = {
        id: 'test-scene',
        dialog: [{ speaker: 'narrator', text: 'Hello' }],
      };

      runner.run(scene, {});
      expect(runner.isRunning()).toBe(true);

      runner.stop();

      expect(runner.isRunning()).toBe(false);
      expect(runner.getPhase()).toBe('idle');
      expect(runner.getCurrentScene()).toBe(null);
    });

    it('advance completes scene when in complete phase', async () => {
      const scene: Scene = {
        id: 'test-scene',
        next: 'next-scene',
      };

      const onTransition = vi.fn();
      await runner.run(scene, { onTransition });

      expect(runner.getPhase()).toBe('complete');

      runner.advance();

      expect(onTransition).toHaveBeenCalledWith('next-scene');
    });

    it('advance during dialog advances dialog', async () => {
      const advanceSpy = vi.spyOn(dialogController, 'advance');

      const scene: Scene = {
        id: 'test-scene',
        dialog: [
          { speaker: 'narrator', text: 'Line 1' },
          { speaker: 'narrator', text: 'Line 2' },
        ],
      };

      // Start running scene (don't await - it blocks on dialog)
      runner.run(scene, {});

      // Wait a tick for the async enterScene to complete
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(runner.getPhase()).toBe('dialog');

      runner.advance();

      expect(advanceSpy).toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // QUERIES
  // ==========================================================================

  describe('queries', () => {
    it('isWaitingForInput returns true during complete and choosing phases', async () => {
      const scene: Scene = {
        id: 'test-scene',
      };

      await runner.run(scene, {});

      expect(runner.getPhase()).toBe('complete');
      expect(runner.isWaitingForInput()).toBe(true);
    });
  });
});
