/**
 * EasterEggController Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EasterEggController } from './EasterEggController.ts';
import { EventBus } from '../core/EventBus.ts';
import { StateManager } from '../core/StateManager.ts';

describe('EasterEggController', () => {
  let controller: EasterEggController;
  let eventBus: EventBus;
  let stateManager: StateManager;

  beforeEach(() => {
    eventBus = new EventBus();
    stateManager = new StateManager(undefined, eventBus);
    controller = new EasterEggController({
      eventBus,
      stateManager,
      enableKonami: false, // Disable for most tests to avoid DOM events
      enableDevCommands: true,
    });
    controller.init();
  });

  afterEach(() => {
    controller.destroy();
  });

  describe('Secret Code Activation', () => {
    it('should activate a discoverable code', () => {
      const events: unknown[] = [];
      eventBus.on('code:activated', (payload) => events.push(payload));

      const result = controller.tryCode('konami');

      expect(result.success).toBe(true);
      expect(result.isNew).toBe(true);
      expect(events.length).toBe(1);
    });

    it('should mark code as discovered', () => {
      controller.tryCode('konami');

      expect(controller.isCodeDiscovered('konami')).toBe(true);
      expect(stateManager.hasDiscoveredCode('konami')).toBe(true);
    });

    it('should return isNew: false for already discovered code', () => {
      controller.tryCode('konami');
      const result = controller.tryCode('konami');

      expect(result.success).toBe(true);
      expect(result.isNew).toBe(false);
    });

    it('should emit invalid code event for unknown codes', () => {
      const events: unknown[] = [];
      eventBus.on('code:invalid', (payload) => events.push(payload));

      const result = controller.tryCode('not-a-real-code');

      expect(result.success).toBe(false);
      expect(events.length).toBe(1);
    });

    it('should normalize code input to lowercase', () => {
      const result = controller.tryCode('KONAMI');
      expect(result.success).toBe(true);
    });
  });

  describe('Code Discovery Progress', () => {
    it('should track discovery progress', () => {
      expect(controller.getDiscoveryProgress().discovered).toBe(0);

      controller.tryCode('konami');
      expect(controller.getDiscoveryProgress().discovered).toBe(1);

      controller.tryCode('echo');
      expect(controller.getDiscoveryProgress().discovered).toBe(2);
    });

    it('should return all discovered codes', () => {
      controller.tryCode('konami');
      controller.tryCode('echo');

      const discovered = controller.getDiscoveredCodes();
      expect(discovered).toContain('konami');
      expect(discovered).toContain('echo');
      expect(discovered.length).toBe(2);
    });
  });

  describe('Toggle Codes', () => {
    it('should toggle flags for utility codes', () => {
      const events: unknown[] = [];
      eventBus.on('toggle:changed', (payload) => events.push(payload));

      controller.tryCode('echobreak');

      expect(stateManager.hasFlag('echo_disabled')).toBe(true);
      expect(events.length).toBe(1);
    });

    it('should toggle tether lock', () => {
      controller.tryCode('tetherlock');
      expect(stateManager.hasFlag('tether_locked')).toBe(true);
    });

    it('should toggle save anywhere', () => {
      controller.tryCode('saveanywhere');
      expect(stateManager.hasFlag('save_anywhere')).toBe(true);
    });
  });

  describe('Dev Commands', () => {
    it('should execute dev commands when enabled', () => {
      const events: unknown[] = [];
      eventBus.on('dev:command', (payload) => events.push(payload));

      const result = controller.tryCode('settethermax');

      expect(result.success).toBe(true);
      expect(stateManager.get('tetherLevel')).toBe(100);
      expect(events.length).toBe(1);
    });

    it('should clear notes with clearnotes command', () => {
      stateManager.unlockNote('test-note');
      expect(stateManager.get('notesUnlocked').length).toBe(1);

      controller.tryCode('clearnotes');
      expect(stateManager.get('notesUnlocked').length).toBe(0);
    });

    it('should set playthrough number', () => {
      controller.tryCode('reset848');
      expect(stateManager.get('playthrough')).toBe(848);

      controller.tryCode('reset849');
      expect(stateManager.get('playthrough')).toBe(849);
    });

    it('should toggle tether lock with dev command', () => {
      controller.tryCode('freezetether');
      expect(stateManager.hasFlag('tether_locked')).toBe(true);

      controller.tryCode('resumetether');
      expect(stateManager.hasFlag('tether_locked')).toBe(false);
    });

    it('should not execute dev commands when disabled', () => {
      const restrictedController = new EasterEggController({
        eventBus,
        stateManager,
        enableDevCommands: false,
      });
      restrictedController.init();

      const result = restrictedController.tryCode('settethermax');
      expect(result.success).toBe(false);

      restrictedController.destroy();
    });

    it('should reveal all codes with revealcodes command', () => {
      controller.tryCode('revealcodes');

      const progress = controller.getDiscoveryProgress();
      expect(progress.discovered).toBe(progress.total);
    });
  });

  describe('Code Input Mode', () => {
    it('should track code input active state', () => {
      expect(controller.isCodeInputActive()).toBe(false);

      controller.openCodeInput();
      expect(controller.isCodeInputActive()).toBe(true);

      controller.closeCodeInput();
      expect(controller.isCodeInputActive()).toBe(false);
    });

    it('should emit events for code input open/close', () => {
      const openEvents: unknown[] = [];
      const closeEvents: unknown[] = [];
      eventBus.on('code:input:open', () => openEvents.push(true));
      eventBus.on('code:input:close', () => closeEvents.push(true));

      controller.openCodeInput();
      expect(openEvents.length).toBe(1);

      controller.closeCodeInput();
      expect(closeEvents.length).toBe(1);
    });

    it('should handle code input submission', () => {
      controller.openCodeInput();
      controller.updateCodeInput('konami');
      const result = controller.submitCodeInput();

      expect(result.success).toBe(true);
    });
  });

  describe('Konami Code Detection', () => {
    it('should detect konami code sequence', () => {
      // Create controller with Konami enabled
      const konamiController = new EasterEggController({
        eventBus,
        stateManager,
        enableKonami: true,
      });
      konamiController.init();

      const sequence = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA',
      ];

      const events: unknown[] = [];
      eventBus.on('code:activated', (payload) => events.push(payload));

      // Simulate key events
      for (const code of sequence) {
        const event = new KeyboardEvent('keydown', { code });
        document.dispatchEvent(event);
      }

      expect(events.length).toBe(1);
      expect(controller.isCodeDiscovered('konami')).toBe(true);

      konamiController.destroy();
    });

    it('should reset on wrong key', () => {
      const konamiController = new EasterEggController({
        eventBus,
        stateManager,
        enableKonami: true,
      });
      konamiController.init();

      // Start sequence
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
      // Wrong key
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
      // Complete sequence (should fail since reset)
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown' }));

      expect(controller.isCodeDiscovered('konami')).toBe(false);

      konamiController.destroy();
    });
  });

  describe('Easter Egg Events', () => {
    it('should emit easter_egg:trigger for easter egg codes', () => {
      const events: { codeId: string }[] = [];
      eventBus.on('easter_egg:trigger', (payload) => events.push(payload));

      controller.tryCode('konami'); // rewardType: 'easter_egg'

      expect(events.length).toBe(1);
      expect(events[0].codeId).toBe('konami');
    });

    it('should emit overlay:show for overlay codes', () => {
      const events: { type: string }[] = [];
      eventBus.on('overlay:show', (payload) => events.push(payload));

      controller.tryCode('848'); // rewardType: 'overlay'

      expect(events.length).toBe(1);
      expect(events[0].type).toBe('848');
    });

    it('should emit content:unlock for unlock codes', () => {
      const events: { contentId: string }[] = [];
      eventBus.on('content:unlock', (payload) => events.push(payload));

      controller.tryCode('uv7crew'); // rewardType: 'unlock'

      expect(events.length).toBe(1);
      expect(events[0].contentId).toBe('uv7crew');
    });
  });
});
