/**
 * UV7 V2 Validation Utilities
 *
 * Runtime validation for game data.
 * Uses TypeScript type guards for compile-time safety
 * and runtime checks for data integrity.
 */

import type { Scene } from '../core/types.ts';

// Valid values for enums
const VALID_CHARACTERS = ['ronnie', 'tori', 'kai', 'echo', 'player'] as const;
const VALID_EMOTIONS = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'worried', 'smirk', 'blush', 'hurt', 'determined'] as const;
const VALID_POSITIONS = ['left', 'center', 'right'] as const;
const VALID_EFFECTS = ['glitch', 'fade', 'shake', 'flash', 'static', 'vhs', 'redpulse', 'tetherdrain'] as const;
const VALID_INTENSITIES = ['low', 'medium', 'high'] as const;
const VALID_OPERATIONS = ['set', 'add', 'subtract'] as const;

export interface ValidationError {
  path: string;
  message: string;
  expected?: string;
  got?: unknown;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate a scene object
 */
export function validateScene(data: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: [{ path: '', message: 'Scene must be an object', got: typeof data }],
    };
  }

  const scene = data as Record<string, unknown>;

  // Required: id
  if (typeof scene.id !== 'string' || scene.id.length === 0) {
    errors.push({
      path: 'id',
      message: 'Scene id is required and must be a non-empty string',
      got: scene.id,
    });
  } else if (!/^[a-z0-9-]+$/.test(scene.id)) {
    errors.push({
      path: 'id',
      message: 'Scene id must contain only lowercase letters, numbers, and hyphens',
      expected: 'pattern: ^[a-z0-9-]+$',
      got: scene.id,
    });
  }

  // Optional: background
  if (scene.background !== undefined && typeof scene.background !== 'string') {
    errors.push({
      path: 'background',
      message: 'Background must be a string',
      got: typeof scene.background,
    });
  }

  // Optional: music
  if (scene.music !== undefined && typeof scene.music !== 'string') {
    errors.push({
      path: 'music',
      message: 'Music must be a string',
      got: typeof scene.music,
    });
  }

  // Optional: sprites
  if (scene.sprites !== undefined) {
    if (!Array.isArray(scene.sprites)) {
      errors.push({
        path: 'sprites',
        message: 'Sprites must be an array',
        got: typeof scene.sprites,
      });
    } else {
      scene.sprites.forEach((sprite, i) => {
        errors.push(...validateSprite(sprite, `sprites[${i}]`));
      });
    }
  }

  // Optional: dialog
  if (scene.dialog !== undefined) {
    if (!Array.isArray(scene.dialog)) {
      errors.push({
        path: 'dialog',
        message: 'Dialog must be an array',
        got: typeof scene.dialog,
      });
    } else {
      scene.dialog.forEach((entry, i) => {
        errors.push(...validateDialogEntry(entry, `dialog[${i}]`));
      });
    }
  }

  // Optional: choices
  if (scene.choices !== undefined) {
    if (!Array.isArray(scene.choices)) {
      errors.push({
        path: 'choices',
        message: 'Choices must be an array',
        got: typeof scene.choices,
      });
    } else {
      scene.choices.forEach((choice, i) => {
        errors.push(...validateChoice(choice, `choices[${i}]`));
      });
    }
  }

  // Optional: effects
  if (scene.effects !== undefined) {
    if (!Array.isArray(scene.effects)) {
      errors.push({
        path: 'effects',
        message: 'Effects must be an array',
        got: typeof scene.effects,
      });
    } else {
      scene.effects.forEach((effect, i) => {
        errors.push(...validateEffect(effect, `effects[${i}]`));
      });
    }
  }

  // Optional: tetherImpact
  if (scene.tetherImpact !== undefined && typeof scene.tetherImpact !== 'number') {
    errors.push({
      path: 'tetherImpact',
      message: 'tetherImpact must be a number',
      got: typeof scene.tetherImpact,
    });
  }

  // Optional: next
  if (scene.next !== undefined) {
    if (typeof scene.next !== 'string' && typeof scene.next !== 'object') {
      errors.push({
        path: 'next',
        message: 'next must be a string or conditional object',
        got: typeof scene.next,
      });
    }
  }

  // Optional: flags
  if (scene.flags !== undefined) {
    if (!Array.isArray(scene.flags)) {
      errors.push({
        path: 'flags',
        message: 'flags must be an array',
        got: typeof scene.flags,
      });
    } else {
      scene.flags.forEach((flag, i) => {
        errors.push(...validateFlagChange(flag, `flags[${i}]`));
      });
    }
  }

  // Optional: counters
  if (scene.counters !== undefined) {
    if (!Array.isArray(scene.counters)) {
      errors.push({
        path: 'counters',
        message: 'counters must be an array',
        got: typeof scene.counters,
      });
    } else {
      scene.counters.forEach((counter, i) => {
        errors.push(...validateCounterChange(counter, `counters[${i}]`));
      });
    }
  }

  // Optional: unlockNote, unlockAchievement
  if (scene.unlockNote !== undefined && typeof scene.unlockNote !== 'string') {
    errors.push({
      path: 'unlockNote',
      message: 'unlockNote must be a string',
      got: typeof scene.unlockNote,
    });
  }

  if (scene.unlockAchievement !== undefined && typeof scene.unlockAchievement !== 'string') {
    errors.push({
      path: 'unlockAchievement',
      message: 'unlockAchievement must be a string',
      got: typeof scene.unlockAchievement,
    });
  }

  return { valid: errors.length === 0, errors };
}

function validateSprite(data: unknown, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    return [{ path, message: 'Sprite must be an object', got: typeof data }];
  }

  const sprite = data as Record<string, unknown>;

  if (!VALID_CHARACTERS.includes(sprite.character as typeof VALID_CHARACTERS[number])) {
    errors.push({
      path: `${path}.character`,
      message: 'Invalid character',
      expected: VALID_CHARACTERS.join(', '),
      got: sprite.character,
    });
  }

  if (!VALID_EMOTIONS.includes(sprite.emotion as typeof VALID_EMOTIONS[number])) {
    errors.push({
      path: `${path}.emotion`,
      message: 'Invalid emotion',
      expected: VALID_EMOTIONS.join(', '),
      got: sprite.emotion,
    });
  }

  if (!VALID_POSITIONS.includes(sprite.position as typeof VALID_POSITIONS[number])) {
    errors.push({
      path: `${path}.position`,
      message: 'Invalid position',
      expected: VALID_POSITIONS.join(', '),
      got: sprite.position,
    });
  }

  if (sprite.flip !== undefined && typeof sprite.flip !== 'boolean') {
    errors.push({
      path: `${path}.flip`,
      message: 'flip must be a boolean',
      got: typeof sprite.flip,
    });
  }

  return errors;
}

function validateDialogEntry(data: unknown, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    return [{ path, message: 'Dialog entry must be an object', got: typeof data }];
  }

  const entry = data as Record<string, unknown>;

  // speaker can be a character or 'narrator'
  const validSpeakers = [...VALID_CHARACTERS, 'narrator'];
  if (!validSpeakers.includes(entry.speaker as string)) {
    errors.push({
      path: `${path}.speaker`,
      message: 'Invalid speaker',
      expected: validSpeakers.join(', '),
      got: entry.speaker,
    });
  }

  if (typeof entry.text !== 'string' || entry.text.length === 0) {
    errors.push({
      path: `${path}.text`,
      message: 'text is required and must be a non-empty string',
      got: entry.text,
    });
  }

  if (entry.emotion !== undefined && !VALID_EMOTIONS.includes(entry.emotion as typeof VALID_EMOTIONS[number])) {
    errors.push({
      path: `${path}.emotion`,
      message: 'Invalid emotion',
      expected: VALID_EMOTIONS.join(', '),
      got: entry.emotion,
    });
  }

  if (entry.sound !== undefined && typeof entry.sound !== 'string') {
    errors.push({
      path: `${path}.sound`,
      message: 'sound must be a string',
      got: typeof entry.sound,
    });
  }

  return errors;
}

function validateChoice(data: unknown, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    return [{ path, message: 'Choice must be an object', got: typeof data }];
  }

  const choice = data as Record<string, unknown>;

  if (typeof choice.text !== 'string' || choice.text.length === 0) {
    errors.push({
      path: `${path}.text`,
      message: 'text is required and must be a non-empty string',
      got: choice.text,
    });
  }

  if (typeof choice.next !== 'string') {
    errors.push({
      path: `${path}.next`,
      message: 'next is required and must be a string',
      got: choice.next,
    });
  }

  if (choice.tetherCost !== undefined && typeof choice.tetherCost !== 'number') {
    errors.push({
      path: `${path}.tetherCost`,
      message: 'tetherCost must be a number',
      got: typeof choice.tetherCost,
    });
  }

  return errors;
}

function validateEffect(data: unknown, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    return [{ path, message: 'Effect must be an object', got: typeof data }];
  }

  const effect = data as Record<string, unknown>;

  if (!VALID_EFFECTS.includes(effect.type as typeof VALID_EFFECTS[number])) {
    errors.push({
      path: `${path}.type`,
      message: 'Invalid effect type',
      expected: VALID_EFFECTS.join(', '),
      got: effect.type,
    });
  }

  if (effect.duration !== undefined && typeof effect.duration !== 'number') {
    errors.push({
      path: `${path}.duration`,
      message: 'duration must be a number',
      got: typeof effect.duration,
    });
  }

  if (effect.intensity !== undefined && !VALID_INTENSITIES.includes(effect.intensity as typeof VALID_INTENSITIES[number])) {
    errors.push({
      path: `${path}.intensity`,
      message: 'Invalid intensity',
      expected: VALID_INTENSITIES.join(', '),
      got: effect.intensity,
    });
  }

  return errors;
}

function validateFlagChange(data: unknown, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    return [{ path, message: 'FlagChange must be an object', got: typeof data }];
  }

  const flag = data as Record<string, unknown>;

  if (typeof flag.name !== 'string') {
    errors.push({
      path: `${path}.name`,
      message: 'name is required and must be a string',
      got: flag.name,
    });
  }

  if (typeof flag.value !== 'boolean' && flag.value !== 'toggle') {
    errors.push({
      path: `${path}.value`,
      message: 'value must be boolean or "toggle"',
      got: flag.value,
    });
  }

  return errors;
}

function validateCounterChange(data: unknown, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    return [{ path, message: 'CounterChange must be an object', got: typeof data }];
  }

  const counter = data as Record<string, unknown>;

  if (typeof counter.name !== 'string') {
    errors.push({
      path: `${path}.name`,
      message: 'name is required and must be a string',
      got: counter.name,
    });
  }

  if (!VALID_OPERATIONS.includes(counter.operation as typeof VALID_OPERATIONS[number])) {
    errors.push({
      path: `${path}.operation`,
      message: 'Invalid operation',
      expected: VALID_OPERATIONS.join(', '),
      got: counter.operation,
    });
  }

  if (typeof counter.value !== 'number') {
    errors.push({
      path: `${path}.value`,
      message: 'value must be a number',
      got: counter.value,
    });
  }

  return errors;
}

/**
 * Type guard: Check if data is a valid Scene
 */
export function isValidScene(data: unknown): data is Scene {
  return validateScene(data).valid;
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  return errors
    .map((e) => {
      let msg = `${e.path}: ${e.message}`;
      if (e.expected) msg += ` (expected: ${e.expected})`;
      if (e.got !== undefined) msg += ` (got: ${JSON.stringify(e.got)})`;
      return msg;
    })
    .join('\n');
}
