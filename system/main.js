/**
 * ========================================
 * ES Module Entry Point & Bootstrap
 * ========================================
 * 
 * REFACTORED: Tori's Take Phase 2
 * 
 * This file:
 * 1. Imports all modules (making classes available via window assignments)
 * 2. Provides an explicit bootstrap() export for documentation/testing
 * 3. Does NOT auto-initialize - index.html handles that
 * 
 * The bootstrap pattern documents the construction order:
 * - Classes are imported and assigned to window
 * - index.html's DOMContentLoaded constructs GameEngine
 * - GameEngine constructor handles sub-system instantiation
 */

// ========================================
// SYSTEM MODULES - Imports Only
// These register classes to window but don't construct instances
// ========================================

// Foundation (no dependencies)
import { PauseManager } from './pause-manager.js';
import './input-binder.js';
import './game-config.js';
import './logger.js';

// Difficulty and settings
import './difficulty-profiles.js';
import './settings-manager.js';

// State and UI core
import './state-manager.js';
import './scene-renderer.js';
import './ui-controller.js';
import './overlay-manager.js';
import './theme-manager.js';

// Controllers
import './secret-codes-manager.js';
import './visual-cue-manager.js';
import './time-machine-manager.js';
import './tether-system.js';
import './collectibles-manager.js';
import './dev-console.js';
import './dev-suite.js';
import './auto-save-manager.js';
import './error-boundary.js';
import './accessibility-manager.js';
import './swipe-handler.js';
import './analytics.js';
import './bootstrap-tracker.js';
import './accessibility.js';
import './mobile-ux.js';

// Achievement system
import './achievement-manager.js';
import './achievement-hooks.js';

// Dev tools
import './dev-commentary.js';
import './error-handler.js';

// Effects and visual controllers
import './effects-controller.js';
import './easter-egg-controller.js';
import './credits-controller.js';
import './keyboard-controller.js';
import './typewriter-controller.js';
import './route-controller.js';
import './ending-dialog-controller.js';
import './tips-controller.js';
import './dev-hud-controller.js';
import './notification-shade-controller.js';
import './status-notification-controller.js';
import './grab-handle-repositioner.js';
import './tutorial-manager.js';
import './loading-overlay.js';
import './credits-photo-controller.js';
import './loop-controller.js';
import './scene-progression-controller.js';
import './sprite-controller.js';
import './menu-controller.js';
import './insane-visuals-controller.js';
import './reset-controller.js';
import './gateway.js';

// Core engine (must load after controllers)
import { GameEngine } from './game-engine.js';
import './save-manager.js';
import './cutscene-engine.js';

// ========================================
// UI MODULES
// ========================================

import '../ui/carousel-momentum.js';
import '../ui/simple-carousel.js';
import '../ui/momentum-adapter.js';
import '../ui/menu-carousel.js';
import '../ui/achievement-viewer.js';
import '../ui/standalone-notes-viewer.js';
import '../ui/save-load-ui.js';

// ========================================
// GATEWAY BRIDGE
// ========================================

import '../vn-gateway-bridge.js';

// ========================================
// ROUTE MODULES
// ========================================

import '../routes/shared-prologue.js';
import '../routes/ronnie-route.js';
import '../routes/ronnie-route-act2.js';
import '../routes/ronnie-route-act3.js';
import '../routes/tori-route-main.js';
import '../routes/tori-route-act1.js';
import '../routes/tori-route-act2.js';
import '../routes/tori-route-act3.js';
import '../routes/tori-route-endings.js';
import '../routes/epilogue.js';

// ========================================
// BOOTSTRAP DOCUMENTATION
// ========================================

/**
 * App construction order (for documentation/reference):
 * 
 * 1. main.js loads (this file)
 *    - All modules imported, classes assigned to window
 *    - PauseManager, GameConfig, etc. are now available
 * 
 * 2. index.html DOMContentLoaded fires
 *    - UV7 splash starts
 *    - game = new GameEngine() called
 * 
 * 3. GameEngine constructor runs
 *    - Creates StateManager, TetherSystem, SaveManager, etc.
 *    - Creates PauseManager instance (game.pauseManager)
 *    - All sub-systems stored as game.* properties
 *    - Calls game.init() to bind events
 * 
 * 4. Post-init
 *    - window.game available for debugging
 *    - DevConsole initialized with game reference
 * 
 * This explicit documentation replaces the need for a bootstrap() function
 * since index.html already handles construction correctly.
 */

// ========================================
// EXPLICIT EXPORTS (for testing/future use)
// ========================================

export { GameEngine, PauseManager };

// ========================================
// MODULE LOAD CONFIRMATION
// ========================================

console.log('🚀 ES Modules loaded successfully!');
