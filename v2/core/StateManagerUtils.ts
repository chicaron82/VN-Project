/**
 * StateManager Utility Functions
 *
 * Pure helper functions for state management operations.
 * Extracted from StateManager to keep the orchestrator lean.
 * 💚🔥💀 UV7 Crew - Version 848
 */

/**
 * Navigate an object by dot-notation path and return the value.
 *
 * @param obj - Root object to navigate
 * @param path - Dot-notation path (e.g., 'game.currentScene')
 * @returns Value at path, or undefined if not found
 */
export function getByPath(obj: Record<string, unknown>, path: string): unknown {
  if (typeof path !== 'string') return undefined; // Fallback for invalid calls
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

/**
 * Set a value in an object by dot-notation path.
 * Creates intermediate objects as needed.
 *
 * @param obj - Root object to modify
 * @param path - Dot-notation path
 * @param value - Value to set
 */
export function setByPath(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.');
  const lastPart = parts.pop()!;

  let current: Record<string, unknown> = obj;

  for (const part of parts) {
    if (!(part in current) || typeof current[part] !== 'object' || current[part] === null) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }

  current[lastPart] = value;
}

/**
 * Deep clone a value to prevent external mutations.
 * Handles primitives, Date, Array, and plain objects.
 *
 * @param value - Value to clone
 * @returns Deep clone of the value
 */
export function deepClone<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as unknown as T;
  }

  if (value instanceof Array) {
    return value.map((item) => deepClone(item)) as unknown as T;
  }

  if (typeof value === 'object') {
    const cloned = {} as Record<string, unknown>;
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        cloned[key] = deepClone((value as Record<string, unknown>)[key]);
      }
    }
    return cloned as T;
  }

  return value;
}

/**
 * Deep equality comparison between two values.
 *
 * @param a - First value
 * @param b - Second value
 * @returns True if values are deeply equal
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  if (a instanceof Array && b instanceof Array) {
    if (a.length !== b.length) {
      return false;
    }
    return a.every((item, index) => deepEqual(item, b[index]));
  }

  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key) =>
    keysB.includes(key) &&
    deepEqual(
      (a as Record<string, unknown>)[key],
      (b as Record<string, unknown>)[key]
    )
  );
}
