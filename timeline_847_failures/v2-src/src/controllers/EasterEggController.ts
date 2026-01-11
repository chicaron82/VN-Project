/**
 * UV7 V2 EasterEggController
 *
 * Handles secret code input detection and easter egg activation.
 *
 * Features:
 * - Konami code detection (keyboard + gamepad)
 * - Secret code text input matching
 * - Dev command execution
 * - Code discovery tracking
 */

import type { GameSystem } from '../core/index.ts';
import { EventBus, eventBus } from '../core/EventBus.ts';
import { StateManager, stateManager } from '../core/StateManager.ts';
import {
  SECRET_CODES,
  DEV_COMMANDS,
  getSecretCode,
  getDevCommand,
  getRandomInvalidResponse,
  type SecretCode,
  type DevCommand,
} from '../content/secrets/codes.ts';

// Konami code sequence
const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
];

// How long before Konami sequence resets (ms)
const KONAMI_TIMEOUT = 2000;

export interface EasterEggControllerConfig {
  eventBus?: EventBus;
  stateManager?: StateManager;
  /** Enable Konami code detection (default: true) */
  enableKonami?: boolean;
  /** Enable dev commands (default: DEV mode only) */
  enableDevCommands?: boolean;
}

export interface CodeResult {
  success: boolean;
  code?: SecretCode | DevCommand;
  message: string;
  isNew?: boolean;
}

export class EasterEggController implements GameSystem {
  readonly name = 'EasterEggController';

  private eventBus: EventBus;
  private stateManager: StateManager;
  private enableKonami: boolean;
  private enableDevCommands: boolean;

  // Konami code state
  private konamiProgress: number = 0;
  private konamiTimeout: ReturnType<typeof setTimeout> | null = null;

  // Code input state
  private codeInputActive: boolean = false;
  private currentCodeInput: string = '';

  // For random invalid responses
  private lastInvalidResponseIndex: number = -1;

  constructor(config: EasterEggControllerConfig = {}) {
    this.eventBus = config.eventBus ?? eventBus;
    this.stateManager = config.stateManager ?? stateManager;
    this.enableKonami = config.enableKonami ?? true;
    this.enableDevCommands = config.enableDevCommands ?? import.meta.env.DEV;
  }

  // =========================================================================
  // LIFECYCLE
  // =========================================================================

  init(): void {
    if (this.enableKonami) {
      this.setupKonamiListener();
    }
    this.setupEventListeners();
  }

  destroy(): void {
    if (this.konamiTimeout) {
      clearTimeout(this.konamiTimeout);
    }
    this.konamiProgress = 0;
    this.codeInputActive = false;
    this.currentCodeInput = '';
  }

  // =========================================================================
  // KONAMI CODE DETECTION
  // =========================================================================

  private setupKonamiListener(): void {
    document.addEventListener('keydown', this.handleKonamiKey);
  }

  private handleKonamiKey = (event: KeyboardEvent): void => {
    // Skip if user is typing in an input field
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    const expectedKey = KONAMI_SEQUENCE[this.konamiProgress];

    if (event.code === expectedKey) {
      this.konamiProgress++;

      // Reset timeout
      if (this.konamiTimeout) {
        clearTimeout(this.konamiTimeout);
      }
      this.konamiTimeout = setTimeout(() => {
        this.konamiProgress = 0;
      }, KONAMI_TIMEOUT);

      // Check if complete
      if (this.konamiProgress === KONAMI_SEQUENCE.length) {
        this.konamiProgress = 0;
        if (this.konamiTimeout) {
          clearTimeout(this.konamiTimeout);
          this.konamiTimeout = null;
        }
        this.activateKonamiCode();
      }
    } else if (event.code !== expectedKey && KONAMI_SEQUENCE.includes(event.code)) {
      // Wrong key in sequence - reset
      this.konamiProgress = event.code === KONAMI_SEQUENCE[0] ? 1 : 0;
    }
  };

  private activateKonamiCode(): void {
    const result = this.tryCode('konami');
    if (result.success) {
      this.eventBus.emit('ui:notification', {
        message: 'Konami Code activated!',
        type: 'success',
      });
    }
  }

  // =========================================================================
  // CODE INPUT
  // =========================================================================

  /**
   * Open code input mode (typically from menu)
   */
  openCodeInput(): void {
    this.codeInputActive = true;
    this.currentCodeInput = '';
    this.eventBus.emit('code:input:open');
  }

  /**
   * Close code input mode
   */
  closeCodeInput(): void {
    this.codeInputActive = false;
    this.currentCodeInput = '';
    this.eventBus.emit('code:input:close');
  }

  /**
   * Update current code input
   */
  updateCodeInput(input: string): void {
    this.currentCodeInput = input.toLowerCase().trim();
  }

  /**
   * Submit current code input
   */
  submitCodeInput(): CodeResult {
    const result = this.tryCode(this.currentCodeInput);
    this.currentCodeInput = '';
    return result;
  }

  /**
   * Try to activate a code
   */
  tryCode(codeId: string): CodeResult {
    const normalizedCode = codeId.toLowerCase().trim();

    // Check discoverable codes first
    const secretCode = getSecretCode(normalizedCode);
    if (secretCode) {
      return this.activateSecretCode(secretCode);
    }

    // Check dev commands
    if (this.enableDevCommands) {
      const devCommand = getDevCommand(normalizedCode);
      if (devCommand) {
        return this.executeDevCommand(devCommand);
      }
    }

    // Invalid code
    const { message, index } = getRandomInvalidResponse(this.lastInvalidResponseIndex);
    this.lastInvalidResponseIndex = index;

    this.eventBus.emit('code:invalid', { code: normalizedCode, message });

    return {
      success: false,
      message,
    };
  }

  // =========================================================================
  // CODE ACTIVATION
  // =========================================================================

  private activateSecretCode(code: SecretCode): CodeResult {
    // Check if already discovered
    const discoveredCodes = this.stateManager.get('discoveredCodes');
    const isNew = !discoveredCodes.includes(code.id);

    // Mark as discovered
    if (isNew) {
      this.stateManager.discoverCode(code.id);
    }

    // Emit activation event
    this.eventBus.emit('code:activated', {
      code,
      isNew,
    });

    // Execute reward based on type
    this.executeCodeReward(code);

    return {
      success: true,
      code,
      message: isNew ? `Discovered: ${code.name}` : `${code.name} activated`,
      isNew,
    };
  }

  private executeCodeReward(code: SecretCode): void {
    switch (code.rewardType) {
      case 'easter_egg':
        this.eventBus.emit('easter_egg:trigger', { codeId: code.id });
        break;

      case 'overlay':
        this.eventBus.emit('overlay:show', { type: code.id });
        break;

      case 'toggle':
        this.handleToggleCode(code.id);
        break;

      case 'unlock':
        this.eventBus.emit('content:unlock', { contentId: code.id });
        break;

      case 'action':
        this.eventBus.emit('action:execute', { actionId: code.id });
        break;
    }
  }

  private handleToggleCode(codeId: string): void {
    // Toggle specific game flags based on code
    switch (codeId) {
      case 'echobreak':
        this.stateManager.toggleFlag('echo_disabled');
        break;
      case 'tetherlock':
        this.stateManager.toggleFlag('tether_locked');
        break;
      case 'saveanywhere':
        this.stateManager.toggleFlag('save_anywhere');
        break;
    }

    const isActive = this.stateManager.hasFlag(`${codeId}_active`)
      || (codeId === 'echobreak' && this.stateManager.hasFlag('echo_disabled'))
      || (codeId === 'tetherlock' && this.stateManager.hasFlag('tether_locked'))
      || (codeId === 'saveanywhere' && this.stateManager.hasFlag('save_anywhere'));

    this.eventBus.emit('toggle:changed', {
      toggleId: codeId,
      active: isActive,
    });
  }

  // =========================================================================
  // DEV COMMANDS
  // =========================================================================

  private executeDevCommand(command: DevCommand): CodeResult {
    this.eventBus.emit('dev:command', { command });

    // Execute command based on category
    switch (command.id) {
      // Console
      case 'openconsole':
        this.eventBus.emit('dev:console:open');
        break;
      case 'hideconsole':
        this.eventBus.emit('dev:console:close');
        break;
      case 'devhud':
        this.eventBus.emit('dev:hud:toggle');
        break;
      case 'devhelp':
        this.showDevHelp();
        break;

      // Reset
      case 'clearnotes':
        this.stateManager.set('notesUnlocked', []);
        break;
      case 'reset848':
        this.stateManager.set('playthrough', 848);
        break;
      case 'reset849':
        this.stateManager.set('playthrough', 849);
        break;
      case 'clearall':
        this.eventBus.emit('dev:confirm', {
          action: 'clearall',
          message: 'Clear all save data?',
        });
        break;
      case 'nuke':
        this.eventBus.emit('dev:confirm', {
          action: 'nuke',
          message: 'Nuclear reset - factory reset everything?',
        });
        break;

      // Tether
      case 'freezetether':
        this.stateManager.setFlag('tether_locked', true);
        break;
      case 'resumetether':
        this.stateManager.setFlag('tether_locked', false);
        break;
      case 'settethermax':
        this.stateManager.set('tetherLevel', 100);
        break;
      case 'settether50':
        this.stateManager.set('tetherLevel', 50);
        break;

      // Testing
      case 'unlockact1saves':
        this.stateManager.setFlag('save_anywhere', true);
        break;
      case 'enableinsane':
        this.stateManager.setFlag('insane_mode', true);
        break;
      case 'disableinsane':
        this.stateManager.setFlag('insane_mode', false);
        break;
      case 'succeeding':
        this.stateManager.setFlag('true_ending_state', true);
        break;
      case 'accepting':
        this.stateManager.setFlag('digital_forever_state', true);
        break;

      // General
      case 'unlockskip':
        this.stateManager.setFlag('skip_unlocked', true);
        break;
      case 'skipintro':
        this.stateManager.setFlag('skip_prologue', true);
        break;
      case 'unlockcodes':
        this.stateManager.setFlag('codes_section_unlocked', true);
        break;
      case 'revealcodes':
        // Discover all codes
        for (const code of SECRET_CODES) {
          if (code.discoverable) {
            this.stateManager.discoverCode(code.id);
          }
        }
        break;
    }

    return {
      success: true,
      code: command,
      message: `Dev: ${command.description}`,
    };
  }

  private showDevHelp(): void {
    console.group('%c UV7 Dev Commands', 'color: #4ecdc4; font-weight: bold;');
    for (const cmd of DEV_COMMANDS) {
      console.log(`  ${cmd.id}: ${cmd.description}`);
    }
    console.groupEnd();

    this.eventBus.emit('ui:notification', {
      message: 'Dev commands logged to console',
      type: 'info',
    });
  }

  // =========================================================================
  // QUERIES
  // =========================================================================

  /**
   * Check if a code has been discovered
   */
  isCodeDiscovered(codeId: string): boolean {
    const discoveredCodes = this.stateManager.get('discoveredCodes');
    return discoveredCodes.includes(codeId);
  }

  /**
   * Get all discovered codes
   */
  getDiscoveredCodes(): string[] {
    return [...this.stateManager.get('discoveredCodes')];
  }

  /**
   * Get discovery progress
   */
  getDiscoveryProgress(): { discovered: number; total: number } {
    const discovered = this.stateManager.get('discoveredCodes').length;
    const total = SECRET_CODES.filter((c) => c.discoverable).length;
    return { discovered, total };
  }

  /**
   * Check if code input is active
   */
  isCodeInputActive(): boolean {
    return this.codeInputActive;
  }

  // =========================================================================
  // PRIVATE
  // =========================================================================

  private setupEventListeners(): void {
    // Listen for menu opening code input
    this.eventBus.on('menu:codes:open', () => {
      this.openCodeInput();
    });
  }
}

// Singleton instance
export const easterEggController = new EasterEggController();
