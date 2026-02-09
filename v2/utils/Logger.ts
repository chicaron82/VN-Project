/**
 * ════════════════════════════════════════════════════════════════
 * Logger - Production-grade Logging System
 *
 * Centralized, category-filtered logging with environment awareness.
 * Replaces raw console.log scattered throughout the codebase.
 *
 * Features:
 * - Category-based filtering (engine, state, scene, save, etc.)
 * - Log levels (debug, info, warn, error)
 * - Environment-aware: silent in production builds
 * - Structured prefix output for easy grepping
 * - Zero overhead when disabled (early return)
 *
 * Usage:
 * ```ts
 * import { Logger } from '@utils/Logger';
 *
 * Logger.engine('GameEngine initialized');
 * Logger.scene('Loaded scene:', sceneId);
 * Logger.warn('Tether critically low');
 * Logger.error('Failed to load asset', error);
 * ```
 *
 * 💚🔥💀 UV7 Crew - Version 848
 * ════════════════════════════════════════════════════════════════
 */

// ── Types ─────────────────────────────────────────────────────

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  /** Master switch — disables all output when false */
  enabled: boolean;
  /** Minimum log level to output */
  level: LogLevel;
  /** Per-category overrides (true = enabled, false = suppressed) */
  categories: Record<string, boolean>;
}

// ── Log level hierarchy ───────────────────────────────────────

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// ── Default configuration ─────────────────────────────────────

const config: LoggerConfig = {
  enabled: (import.meta.env?.DEV ?? true) && import.meta.env?.MODE !== 'test',
  level: 'debug',
  categories: {
    engine: true,
    scene: true,
    state: true,
    save: true,
    tether: true,
    input: true,
    ui: true,
    audio: true,
    effect: true,
    easter: true,
    achievement: true,
    system: true,
    perf: true,
  },
};

// ── Core output ───────────────────────────────────────────────

function shouldLog(level: LogLevel, category?: string): boolean {
  if (!config.enabled) return false;
  if (LOG_LEVELS[level] < LOG_LEVELS[config.level]) return false;
  if (category && config.categories[category] === false) return false;
  return true;
}

function formatPrefix(category: string): string {
  return `[${category.toUpperCase()}]`;
}

// ── Public API ────────────────────────────────────────────────

export const Logger = {
  // ── Category loggers (debug level) ────────────────────────
  engine(...args: unknown[]): void {
    if (!shouldLog('debug', 'engine')) return;
    console.info(formatPrefix('engine'), ...args);
  },

  scene(...args: unknown[]): void {
    if (!shouldLog('debug', 'scene')) return;
    console.info(formatPrefix('scene'), ...args);
  },

  state(...args: unknown[]): void {
    if (!shouldLog('debug', 'state')) return;
    console.info(formatPrefix('state'), ...args);
  },

  save(...args: unknown[]): void {
    if (!shouldLog('debug', 'save')) return;
    console.info(formatPrefix('save'), ...args);
  },

  tether(...args: unknown[]): void {
    if (!shouldLog('debug', 'tether')) return;
    console.info(formatPrefix('tether'), ...args);
  },

  input(...args: unknown[]): void {
    if (!shouldLog('debug', 'input')) return;
    console.info(formatPrefix('input'), ...args);
  },

  ui(...args: unknown[]): void {
    if (!shouldLog('debug', 'ui')) return;
    console.info(formatPrefix('ui'), ...args);
  },

  effect(...args: unknown[]): void {
    if (!shouldLog('debug', 'effect')) return;
    console.info(formatPrefix('effect'), ...args);
  },

  easter(...args: unknown[]): void {
    if (!shouldLog('debug', 'easter')) return;
    console.info(formatPrefix('easter'), ...args);
  },

  achievement(...args: unknown[]): void {
    if (!shouldLog('debug', 'achievement')) return;
    console.info(formatPrefix('achievement'), ...args);
  },

  system(...args: unknown[]): void {
    if (!shouldLog('debug', 'system')) return;
    console.info(formatPrefix('system'), ...args);
  },

  perf(...args: unknown[]): void {
    if (!shouldLog('debug', 'perf')) return;
    console.info(formatPrefix('perf'), ...args);
  },

  // ── Level loggers (always-on for warn/error) ──────────────

  /** General debug output — suppressed in production */
  debug(...args: unknown[]): void {
    if (!shouldLog('debug')) return;
    console.info('[DEBUG]', ...args);
  },

  /** Informational — important lifecycle events */
  info(...args: unknown[]): void {
    if (!shouldLog('info')) return;
    console.info('[INFO]', ...args);
  },

  /** Warning — something unexpected but recoverable */
  warn(...args: unknown[]): void {
    if (!shouldLog('warn')) return;
    console.warn('[WARN]', ...args);
  },

  /** Error — something broke (always logged) */
  error(...args: unknown[]): void {
    // Errors always log regardless of config
    console.error('[ERROR]', ...args);
  },

  // ── Configuration ─────────────────────────────────────────

  /** Enable or disable a specific category at runtime */
  setCategory(category: string, enabled: boolean): void {
    config.categories[category] = enabled;
  },

  /** Set minimum log level */
  setLevel(level: LogLevel): void {
    config.level = level;
  },

  /** Enable/disable all logging */
  setEnabled(enabled: boolean): void {
    config.enabled = enabled;
  },

  /** Get current config (for debugging the debugger) */
  getConfig(): Readonly<LoggerConfig> {
    return { ...config, categories: { ...config.categories } };
  },
} as const;
