/**
 * ES Module Entry Point
 * Session 123: Full ES Module Conversion
 * 
 * This file imports all modules and makes them available via window assignments.
 * The window assignments in each individual file handle global exposure.
 */

// ========================================
// SYSTEM MODULES
// ========================================

// Core utilities (no dependencies)
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
import './bootstrap-tracker.js';
import './accessibility.js';
import './mobile-ux.js';

// Achievement system
import './achievement-manager.js';
import './achievement-hooks.js';

// Dev tools
import './dev-commentary.js';

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
import './credits-photo-controller.js';
import './loop-controller.js';
import './scene-progression-controller.js';
import './sprite-controller.js';
import './menu-controller.js';
import './insane-visuals-controller.js';
import './reset-controller.js';
import './gateway.js';

// Core engine (must load after controllers)
import './game-engine.js';
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
// MODULE LOAD CONFIRMATION
// ========================================

console.log('🚀 ES Modules loaded successfully!');
