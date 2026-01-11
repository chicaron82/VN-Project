/**
 * Prologue Scene Migration Tests
 *
 * MICRO-MIGRATION VALIDATION (Tori's Phase 2 recommendation)
 *
 * These tests validate that:
 * 1. Migrated scene JSON is valid against schema
 * 2. Scene data loads correctly
 * 3. Flags are set properly
 * 4. Notes unlock as expected
 * 5. Save/load roundtrip preserves state
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { validateScene, formatValidationErrors } from '../../../utils/validation.ts';
import { StateManager } from '../../../core/StateManager.ts';
import { EventBus } from '../../../core/EventBus.ts';
import { SaveSystem } from '../../../systems/SaveSystem.ts';

// Import scene JSONs
import prologueScene1 from './prologue-scene1.json';
import prologueOldMan from './prologue-old-man.json';

describe('Prologue Scene Migration', () => {
  describe('Scene Validation', () => {
    it('prologue-scene1.json should be valid', () => {
      const result = validateScene(prologueScene1);

      if (!result.valid) {
        console.error('Validation errors:', formatValidationErrors(result.errors));
      }

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('prologue-old-man.json should be valid', () => {
      const result = validateScene(prologueOldMan);

      if (!result.valid) {
        console.error('Validation errors:', formatValidationErrors(result.errors));
      }

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('scene1 should have required fields', () => {
      expect(prologueScene1.id).toBe('prologue-street-bump');
      expect(prologueScene1.background).toBeDefined();
      expect(prologueScene1.dialog).toBeInstanceOf(Array);
      expect(prologueScene1.dialog.length).toBeGreaterThan(0);
    });

    it('scene1 should have proper dialog structure', () => {
      for (const entry of prologueScene1.dialog) {
        expect(entry.speaker).toBeDefined();
        expect(entry.text).toBeDefined();
        expect(entry.text.length).toBeGreaterThan(0);
      }
    });

    it('scene1 should set flag for picking up tamagotchi', () => {
      expect(prologueScene1.flags).toBeDefined();
      expect(prologueScene1.flags).toContainEqual({
        name: 'picked_up_modified_tamagotchi',
        value: true,
      });
    });

    it('scene1 should unlock dev commentary note', () => {
      expect(prologueScene1.unlockNote).toBe('dev-commentary-street-bump');
    });

    it('scenes should link correctly', () => {
      expect(prologueScene1.next).toBe('prologue-old-man');
      expect(prologueOldMan.next).toBe('prologue-home-arrival');
    });
  });

  describe('State Integration', () => {
    let bus: EventBus;
    let state: StateManager;

    beforeEach(() => {
      bus = new EventBus();
      state = new StateManager(undefined, bus);
    });

    it('should apply scene flags to state', () => {
      // Simulate entering scene1
      if (prologueScene1.flags) {
        for (const flag of prologueScene1.flags) {
          const value = flag.value as boolean | 'toggle';
          if (value === 'toggle') {
            state.toggleFlag(flag.name);
          } else {
            state.setFlag(flag.name, value);
          }
        }
      }

      expect(state.hasFlag('picked_up_modified_tamagotchi')).toBe(true);
    });

    it('should unlock note when entering scene', () => {
      const noteUnlocked = { id: '' };
      bus.on('note:unlock', ({ id }) => {
        noteUnlocked.id = id;
      });

      if (prologueScene1.unlockNote) {
        state.unlockNote(prologueScene1.unlockNote);
      }

      expect(noteUnlocked.id).toBe('dev-commentary-street-bump');
      expect(state.get('notesUnlocked')).toContain('dev-commentary-street-bump');
    });

    it('should track visited scenes', () => {
      state.markSceneVisited(prologueScene1.id);
      state.markSceneVisited(prologueOldMan.id);

      expect(state.hasVisitedScene('prologue-street-bump')).toBe(true);
      expect(state.hasVisitedScene('prologue-old-man')).toBe(true);
      expect(state.hasVisitedScene('nonexistent')).toBe(false);
    });
  });

  describe('Save/Load Roundtrip', () => {
    let bus: EventBus;
    let state: StateManager;
    let saveSystem: SaveSystem;

    beforeEach(() => {
      bus = new EventBus();
      state = new StateManager(undefined, bus);
      saveSystem = new SaveSystem({
        eventBus: bus,
        stateManager: state,
        storagePrefix: 'uv7-v2-test-',
      });

      // Clean up test saves
      for (let i = 0; i < 10; i++) {
        localStorage.removeItem(`uv7-v2-test-${i}`);
      }
    });

    it('should save and load state correctly', () => {
      // Set up state as if we played through scene1
      state.set('currentScene', prologueScene1.id);
      state.set('currentRoute', null);
      state.setFlag('picked_up_modified_tamagotchi', true);
      state.unlockNote('dev-commentary-street-bump');
      state.markSceneVisited(prologueScene1.id);

      // Save
      const saved = saveSystem.save(0);
      expect(saved).toBe(true);

      // Clear state
      state.reset();
      expect(state.hasFlag('picked_up_modified_tamagotchi')).toBe(false);

      // Load
      const loaded = saveSystem.load(0);
      expect(loaded).toBe(true);

      // Verify state restored
      expect(state.get('currentScene')).toBe('prologue-street-bump');
      expect(state.hasFlag('picked_up_modified_tamagotchi')).toBe(true);
      expect(state.get('notesUnlocked')).toContain('dev-commentary-street-bump');
      expect(state.hasVisitedScene(prologueScene1.id)).toBe(true);
    });

    it('should handle choice with tether cost', () => {
      // Simulate a choice that costs tether
      const mockChoice = {
        text: 'Investigate the Tamagotchi',
        next: 'prologue-old-man',
        tetherCost: -5,
        flags: [{ name: 'investigated_tamagotchi', value: true as boolean }],
      };

      // Apply choice effects
      state.adjustTether(mockChoice.tetherCost);
      for (const flag of mockChoice.flags) {
        state.setFlag(flag.name, flag.value);
      }

      expect(state.get('tetherLevel')).toBe(95);
      expect(state.hasFlag('investigated_tamagotchi')).toBe(true);

      // Save and restore
      saveSystem.save(1);
      state.reset();
      saveSystem.load(1);

      expect(state.get('tetherLevel')).toBe(95);
      expect(state.hasFlag('investigated_tamagotchi')).toBe(true);
    });
  });
});
