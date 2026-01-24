(function () {
  "use strict";
  class EventBus {
    constructor(maxHistorySize = 100, historyEnabled = true) {
      this.subscribers = /* @__PURE__ */ new Map();
      this.snoopers = /* @__PURE__ */ new Set();
      this.history = [];
      this.maxHistorySize = maxHistorySize;
      this.historyEnabled = historyEnabled;
    }
    /**
     * Register a global event listener (snooper) that receives ALL events.
     * Used for Telemetry and Debugging.
     */
    snoop(callback) {
      this.snoopers.add(callback);
      return () => this.snoopers.delete(callback);
    }
    /**
     * Subscribe to an event
     * 
     * @param event - Event name
     * @param callback - Callback function
     * @returns Unsubscribe function
     * 
     * @example
     * const unsubscribe = eventBus.on('scene:load', (data) => {
     *   console.log(`Scene loaded: ${data.sceneId}`);
     * });
     * 
     * // Later:
     * unsubscribe();
     */
    on(event, callback) {
      if (!this.subscribers.has(event)) {
        this.subscribers.set(event, /* @__PURE__ */ new Set());
      }
      const callbacks = this.subscribers.get(event);
      callbacks.add(callback);
      return () => {
        const callbacks2 = this.subscribers.get(event);
        if (callbacks2) {
          callbacks2.delete(callback);
        }
      };
    }
    /**
     * Emit an event
     * 
     * @param event - Event name
     * @param data - Event data (must match event type)
     * 
     * @example
     * eventBus.emit('scene:load', { sceneId: 'scene1_coffee' });
     */
    emit(event, data) {
      if (this.historyEnabled) {
        this.history.push({
          event,
          data,
          timestamp: Date.now()
        });
        if (this.history.length > this.maxHistorySize) {
          this.history.shift();
        }
      }
      this.snoopers.forEach((snooper) => {
        try {
          snooper(event, data);
        } catch (error) {
          console.error("Error in event snooper:", error);
        }
      });
      const callbacks = this.subscribers.get(event);
      if (callbacks) {
        callbacks.forEach((callback) => {
          try {
            callback(data);
          } catch (error) {
            console.error(`Error in event callback for ${event}:`, error);
          }
        });
      }
    }
    /**
     * Unsubscribe from an event (alternative to using returned function)
     * 
     * @param event - Event name
     * @param callback - Callback to remove
     */
    off(event, callback) {
      const callbacks = this.subscribers.get(event);
      if (callbacks) {
        callbacks.delete(callback);
      }
    }
    /**
     * Remove all subscribers for an event (or all events if no event specified)
     * 
     * @param event - Optional event name. If not provided, clears all subscribers
     */
    clear(event) {
      if (event) {
        this.subscribers.delete(event);
      } else {
        this.subscribers.clear();
      }
    }
    /**
     * Get event history
     * 
     * @returns Array of event history entries
     */
    getHistory() {
      return [...this.history];
    }
    /**
     * Clear event history
     */
    clearHistory() {
      this.history = [];
    }
    /**
     * Enable/disable event history
     * 
     * @param enabled - Whether to enable history
     */
    setHistoryEnabled(enabled) {
      this.historyEnabled = enabled;
    }
  }
  function detectContext() {
    const bodyContext = document.body.dataset.context;
    if (bodyContext && ["game", "showcase", "landing"].includes(bodyContext)) {
      return bodyContext;
    }
    if (window.__UV7_CONTEXT__) {
      return window.__UV7_CONTEXT__;
    }
    const pathname = window.location.pathname.toLowerCase();
    if (pathname.includes("showcase")) return "showcase";
    if (pathname.includes("index.html") && !pathname.includes("v2")) return "landing";
    return "game";
  }
  function getFeatures(context) {
    switch (context) {
      case "game":
        return {
          showLoopVersion: true,
          showRoute: true,
          showBreadcrumbs: true,
          showNotes: true,
          showTether: true,
          showMail: true,
          showPhaseIndicator: false,
          showStoryDevToggle: false,
          enableAppSwitcher: true,
          enableGestures: true,
          enableAdaptiveTint: true,
          glassIntensity: "medium"
        };
      case "showcase":
        return {
          showLoopVersion: false,
          showRoute: false,
          showBreadcrumbs: true,
          showNotes: false,
          showTether: false,
          showMail: false,
          showPhaseIndicator: true,
          showStoryDevToggle: true,
          showThemeToggle: true,
          showSettingsCog: true,
          enableAppSwitcher: true,
          enableGestures: false,
          // Showcase doesn't need swipe gestures
          enableAdaptiveTint: true,
          glassIntensity: "subtle"
        };
      case "landing":
        return {
          showLoopVersion: true,
          showRoute: false,
          showBreadcrumbs: false,
          showNotes: false,
          showTether: false,
          showMail: false,
          showPhaseIndicator: false,
          showStoryDevToggle: false,
          enableAppSwitcher: true,
          enableGestures: false,
          enableAdaptiveTint: false,
          glassIntensity: "heavy"
        };
    }
  }
  const NEUTRAL_TINT = {
    primary: "rgba(255, 255, 255, 0.9)",
    glow: "rgba(255, 255, 255, 0.2)",
    gradient: "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(200, 200, 200, 0.02))"
  };
  const COLOR_TINTS = {
    // Context tints (non-game)
    showcase: {
      primary: "rgba(255, 165, 0, 0.9)",
      // Dev orange
      glow: "rgba(255, 140, 0, 0.3)",
      gradient: "linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 140, 0, 0.05))"
    },
    landing: {
      primary: "rgba(147, 112, 219, 0.9)",
      // UV7 purple
      glow: "rgba(138, 43, 226, 0.3)",
      gradient: "linear-gradient(135deg, rgba(147, 112, 219, 0.1), rgba(138, 43, 226, 0.05))"
    },
    neutral: NEUTRAL_TINT
  };
  function buildBreadcrumbs(context, state) {
    const segments = [];
    if (context === "game") {
      segments.push({
        label: `v.${state.loopVersion || 848}`,
        id: "loop",
        clickable: false
      });
      if (state.route && state.route !== "menu") {
        segments.push({
          label: state.route.charAt(0).toUpperCase() + state.route.slice(1),
          id: "route",
          clickable: true
        });
      }
      if (state.act) {
        segments.push({
          label: state.act,
          id: "act",
          clickable: true
        });
      }
      if (state.scene) {
        const shortScene = state.scene.replace(/^act\d+_/, "").substring(0, 12);
        segments.push({
          label: shortScene,
          id: "scene",
          clickable: false
        });
      }
    } else if (context === "showcase") {
      segments.push({
        label: "Showcase",
        id: "showcase",
        clickable: true
      });
      if (state.phase) {
        segments.push({
          label: `Phase ${state.phase}`,
          id: "phase",
          clickable: true
        });
      }
      if (state.section) {
        segments.push({
          label: state.section,
          id: "section",
          clickable: false
        });
      }
    }
    return segments;
  }
  const DEFAULT_CONFIG = {
    loopVersion: "v848",
    totalNotes: {
      ronnie: 13,
      tori: 16
    }
  };
  class StatusBar {
    constructor(eventBus, stateManager, config) {
      this.currentBreadcrumbs = [];
      this.currentRoute = "menu";
      this.notesCollected = 0;
      this.tetherLevel = 100;
      this._currentAct = "";
      this._currentScene = "";
      this._currentAct = "";
      this._currentScene = "";
      this._currentPhase = "";
      this._currentSection = "";
      this.idleTimer = null;
      this.idleDelay = 3e3;
      this.unreadNotes = /* @__PURE__ */ new Map();
      this.hasShownFirstNoteTutorial = false;
      this.unsubscribers = [];
      this.previewTooltip = null;
      this.previewTimeout = null;
      this.isScreenshotMode = false;
      this.orientationHandler = null;
      this.gestureState = {
        touchStartY: 0,
        touchStartX: 0,
        touchStartTime: 0,
        longPressTimer: null,
        lastTapTime: 0,
        isLongPress: false
      };
      this.SWIPE_THRESHOLD = 50;
      this.LONG_PRESS_DELAY = 500;
      this.DOUBLE_TAP_DELAY = 300;
      this.eventBus = eventBus;
      this.stateManager = stateManager || null;
      this.config = { ...DEFAULT_CONFIG, ...config };
      this.context = detectContext();
      this.features = getFeatures(this.context);
      this.currentTint = this.context === "showcase" ? COLOR_TINTS.showcase : this.context === "landing" ? COLOR_TINTS.landing : COLOR_TINTS.neutral;
      console.log(`🎨 StatusBar initialized in ${this.context} context`);
      this.createDOM();
      this.setupEventListeners();
      this.setupStateSubscriptions();
      this.setupIdleTimer();
      this.loadInitialState();
      this.setupAppSwitcher();
      if (this.features.enableAdaptiveTint && this.context !== "game") {
        this.applyColorTint(this.currentTint);
      }
      this.applyGlassEffect(this.features.glassIntensity);
      this.setupGestures();
    }
    // ========================================
    // PHASE 26: CONTEXT & TINT METHODS
    // ========================================
    /**
     * Get current UV7 context
     */
    getContext() {
      return this.context;
    }
    /**
     * Get current feature flags
     */
    getFeatures() {
      return this.features;
    }
    /**
     * Apply color tint to status bar (adaptive theming)
     */
    applyColorTint(tint) {
      if (!this.container) return;
      this.container.style.setProperty("--status-accent", tint.primary);
      this.container.style.setProperty("--status-glow", tint.glow);
      this.container.style.backgroundImage = tint.gradient;
      this.container.style.transition = "background 0.5s ease, box-shadow 0.5s ease";
      this.container.style.boxShadow = `0 2px 20px ${tint.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`;
      this.currentTint = tint;
    }
    /**
     * Apply glassmorphism effect based on intensity
     */
    applyGlassEffect(intensity) {
      if (!this.container) return;
      const blurValues = {
        subtle: "8px",
        medium: "12px",
        heavy: "20px"
      };
      const saturateValues = {
        subtle: "150%",
        medium: "180%",
        heavy: "200%"
      };
      this.container.style.backdropFilter = `blur(${blurValues[intensity]}) saturate(${saturateValues[intensity]})`;
      this.container.style.webkitBackdropFilter = `blur(${blurValues[intensity]}) saturate(${saturateValues[intensity]})`;
    }
    /**
     * Update tint based on current route/context
     * Called when route changes
     *
     * GAME MODE: CSS class-based theming handles route colors (.ronnie-route, .tori-route)
     * - Ronnie: cyan (#00ffff)
     * - Tori: green (#00ff88)
     *
     * SHOWCASE/LANDING: Inline tints via applyColorTint()
     */
    updateAdaptiveTint() {
      if (!this.features.enableAdaptiveTint) return;
      if (this.context === "game") {
        this.clearInlineTint();
        return;
      }
      let newTint = COLOR_TINTS.neutral;
      if (this.context === "showcase") {
        newTint = COLOR_TINTS.showcase;
      } else if (this.context === "landing") {
        newTint = COLOR_TINTS.landing;
      }
      this.applyColorTint(newTint);
    }
    /**
     * Clear inline tint styles (let CSS classes handle theming)
     */
    clearInlineTint() {
      if (!this.container) return;
      this.container.style.removeProperty("--status-accent");
      this.container.style.removeProperty("--status-glow");
      this.container.style.background = "";
      this.container.style.boxShadow = "";
    }
    // ========================================
    // PHASE 26: BREADCRUMB METHODS
    // ========================================
    /**
     * Update breadcrumb navigation display
     */
    updateBreadcrumbs() {
      if (!this.features.showBreadcrumbs || !this.breadcrumbsEl) return;
      const segments = buildBreadcrumbs(this.context, {
        loopVersion: 848,
        route: this.currentRoute,
        act: this._currentAct,
        scene: this._currentScene,
        act: this._currentAct,
        scene: this._currentScene,
        phase: this._currentPhase,
        section: this._currentSection
      });
      this.currentBreadcrumbs = segments;
      this.renderBreadcrumbs();
    }
    /**
     * Render breadcrumb segments to DOM
     */
    renderBreadcrumbs() {
      if (!this.breadcrumbsEl) return;
      this.breadcrumbsEl.innerHTML = "";
      this.currentBreadcrumbs.forEach((segment, index) => {
        const segmentEl = document.createElement("span");
        segmentEl.className = `breadcrumb-segment ${segment.clickable ? "clickable" : ""}`;
        segmentEl.textContent = segment.label;
        segmentEl.dataset.id = segment.id;
        if (segment.clickable) {
          segmentEl.addEventListener("click", () => {
            this.handleBreadcrumbClick(segment);
          });
        }
        segmentEl.addEventListener("mouseenter", () => {
          if (segment.clickable) {
            segmentEl.style.transform = "scale(1.05)";
            segmentEl.style.color = this.currentTint.primary;
          }
        });
        segmentEl.addEventListener("mouseleave", () => {
          segmentEl.style.transform = "";
          segmentEl.style.color = "";
        });
        this.breadcrumbsEl.appendChild(segmentEl);
        if (index < this.currentBreadcrumbs.length - 1) {
          const separator = document.createElement("span");
          separator.className = "breadcrumb-separator";
          separator.textContent = " → ";
          separator.style.opacity = "0.5";
          separator.style.margin = "0 4px";
          this.breadcrumbsEl.appendChild(separator);
        }
      });
    }
    /**
     * Handle breadcrumb segment click
     * Tori's recommendation: Emit events, don't do actions directly
     */
    handleBreadcrumbClick(segment) {
      console.log(`🍞 Breadcrumb clicked: ${segment.id} (${segment.label})`);
      this.eventBus.emit("ui:screen_change", { screen: `breadcrumb:${segment.id}` });
      if (navigator.vibrate) navigator.vibrate(10);
    }
    /**
     * Set current scene (for breadcrumb display)
     */
    setScene(sceneId) {
      this._currentScene = sceneId;
      this.updateBreadcrumbs();
    }
    /**
     * Set current phase (showcase breadcrumbs)
     */
    setPhase(phase) {
      this._currentPhase = phase;
      this.updateBreadcrumbs();
      if (this.phaseEl) {
        this.phaseEl.textContent = `Phase ${phase}`;
      }
    }

    /**
     * Set current section (showcase breadcrumbs)
     */
    setSection(section) {
      this._currentSection = section;
      this.updateBreadcrumbs();
    }
    /**
     * Set up UV7 App Switcher
     * DIZEE: Enhanced with mini-preview on hover
     */
    async setupAppSwitcher() {
      try {
        const { initializeAppSwitcher: initializeAppSwitcher2 } = await Promise.resolve().then(() => UV7AppSwitcher);
        const appSwitcher = await initializeAppSwitcher2();
        const logoTrigger = document.getElementById("uv7-logo-trigger");
        if (logoTrigger) {
          logoTrigger.addEventListener("click", () => {
            appSwitcher.toggle();
          });
          this.setupAppSwitcherPreview(logoTrigger);
        }
        console.log("🚀 UV7 App Switcher ready (V2)");
      } catch (error) {
        console.warn("⚠️ UV7 App Switcher failed to load:", error);
      }
    }
    /**
     * Set up mini-preview tooltip for UV7 logo hover
     * Shows current states of all apps before opening full switcher
     */
    setupAppSwitcherPreview(logoTrigger) {
      this.previewTooltip = document.createElement("div");
      this.previewTooltip.className = "uv7-app-preview-tooltip";
      this.previewTooltip.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            margin-top: 8px;
            background: linear-gradient(145deg, rgba(26, 26, 46, 0.98), rgba(15, 15, 26, 0.98));
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 12px;
            padding: 12px 16px;
            min-width: 200px;
            max-width: 280px;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-8px);
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            font-family: 'Courier New', monospace;
            pointer-events: none;
        `;
      logoTrigger.style.position = "relative";
      logoTrigger.appendChild(this.previewTooltip);
      logoTrigger.addEventListener("mouseenter", () => this.showAppPreview());
      logoTrigger.addEventListener("mouseleave", () => this.hideAppPreview());
    }
    /**
     * Show the mini-preview tooltip with current app states
     */
    showAppPreview() {
      if (!this.previewTooltip) return;
      this.previewTimeout = setTimeout(() => {
        const apps = this.getAppStates();
        let content = `
                <div style="font-size: 10px; color: rgba(0, 255, 255, 0.7); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">
                    UV7 OS • Tap to switch
                </div>
            `;
        apps.forEach((app) => {
          const isActive = app.isActive;
          content += `
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 6px 0;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                        ${isActive ? "color: #00ffff;" : "color: rgba(255, 255, 255, 0.7);"}
                    ">
                        <span style="font-size: 14px;">${app.icon}</span>
                        <div style="flex: 1;">
                            <div style="font-size: 11px; font-weight: bold;">
                                ${app.name}
                                ${isActive ? '<span style="font-size: 9px; background: rgba(0, 255, 255, 0.2); padding: 1px 4px; border-radius: 3px; margin-left: 4px;">ACTIVE</span>' : ""}
                            </div>
                            <div style="font-size: 10px; opacity: 0.7;">${app.state}</div>
                        </div>
                    </div>
                `;
        });
        if (this.previewTooltip) {
          this.previewTooltip.innerHTML = content;
          this.previewTooltip.style.opacity = "1";
          this.previewTooltip.style.visibility = "visible";
          this.previewTooltip.style.transform = "translateY(0)";
        }
      }, 300);
    }
    /**
     * Hide the mini-preview tooltip
     */
    hideAppPreview() {
      if (this.previewTimeout) {
        clearTimeout(this.previewTimeout);
        this.previewTimeout = null;
      }
      if (this.previewTooltip) {
        this.previewTooltip.style.opacity = "0";
        this.previewTooltip.style.visibility = "hidden";
        this.previewTooltip.style.transform = "translateY(-8px)";
      }
    }
    /**
     * Get current states of all UV7 apps for preview
     * DIZEE: Pull live data from localStorage/sessionStorage
     */
    getAppStates() {
      const currentPath = window.location.pathname;
      const detectCurrentApp = () => {
        if (currentPath.includes("showcase")) return "showcase";
        if (currentPath.includes("v1")) return "v1";
        if (currentPath.includes("v2") || currentPath.includes("index.v2")) return "v2";
        return "landing";
      };
      const activeApp = detectCurrentApp();
      return [
        {
          name: "Landing",
          icon: "🏠",
          state: (() => {
            const loopVersion = localStorage.getItem("uv7_loop_version") || "848";
            return `VERSION ${loopVersion}`;
          })(),
          isActive: activeApp === "landing"
        },
        {
          name: "Showcase",
          icon: "📖",
          state: (() => {
            const phase = sessionStorage.getItem("uv7-showcase-phase") || "phase-1";
            const phaseNum = phase.replace("phase-", "");
            return `Phase ${phaseNum}`;
          })(),
          isActive: activeApp === "showcase"
        },
        {
          name: "V1 Game",
          icon: "🎮",
          state: (() => {
            const route = localStorage.getItem("uv7_current_route") || "Menu";
            return route.charAt(0).toUpperCase() + route.slice(1);
          })(),
          isActive: activeApp === "v1"
        },
        {
          name: "V2 Engine",
          icon: "⚡",
          state: (() => {
            const stateJson = localStorage.getItem("uv7_game_state");
            if (stateJson) {
              try {
                const state = JSON.parse(stateJson);
                const route = state?.game?.currentRoute || "Menu";
                const tether = state?.tether?.level;
                if (route === "tori" && typeof tether === "number") {
                  return `${route.charAt(0).toUpperCase() + route.slice(1)} ⚡${Math.round(tether)}%`;
                }
                return route.charAt(0).toUpperCase() + route.slice(1);
              } catch (_e) {
              }
            }
            return "V2 Beta";
          })(),
          isActive: activeApp === "v2"
        }
      ];
    }
    /**
     * Create the status bar DOM structure
     * Phase 26: Feature-flag-based rendering for context-aware display
     */
    createDOM() {
      this.container = document.createElement("div");
      this.container.id = "status-bar";
      this.container.className = "uv7-status-bar"; // Added class for styling
      document.body.classList.add("uv7-os-enabled"); // Added body padding
      this.container.dataset.context = this.context;
      this.container.innerHTML = `
            <!-- Left Section: Logo + Breadcrumbs -->
            <div class="status-section status-left">
                <!-- UV7 OS Logo (App Switcher Trigger) -->
                ${this.features.enableAppSwitcher ? `
                <span id="uv7-logo-trigger" class="status-item uv7-logo-trigger" style="cursor: pointer; margin-right: 12px;" title="UV7 OS - Tap to switch apps">
                    <img src="./UnitedVoices7.png" alt="UV7" style="height: 16px; width: auto; vertical-align: middle;">
                </span>
                ` : ""}
                ${this.features.showBreadcrumbs ? `
                <div id="status-breadcrumbs" class="status-item breadcrumbs" style="display: flex; align-items: center; gap: 4px; font-size: 11px;"></div>
                ` : ""}
                ${this.features.showLoopVersion ? `
                <span id="status-loop" class="status-item">${this.config.loopVersion}</span>
                ` : ""}
                ${this.features.showRoute ? `
                <span id="status-route" class="status-item route-indicator">MENU</span>
                ` : ""}
                ${this.features.showPhaseIndicator ? `
                <span id="status-phase" class="status-item phase-indicator" style="display: none;"></span>
                ` : ""}
            </div>

            <!-- Center Section: Act / Auto -->
            <div class="status-section status-center">
                <span id="status-act" class="status-item act-indicator" style="display: none;"></span>
                <span id="status-auto" class="status-item auto-indicator" style="display: none;">AUTO ▶</span>
            </div>

            <!-- Right Section: Mail + Notes + Tether -->
            <div class="status-section status-right">
                ${this.features.showMail ? `
                <!-- DIZEE: Mail icon with unread badge (V1 parity) -->
                <span id="status-mail" class="status-item mail-indicator" title="Unread Notes" style="display: none;">
                    <span class="mail-icon">✉️</span>
                    <span class="unread-badge" style="display: none;">0</span>
                </span>
                ` : ""}
                ${this.features.showNotes ? `
                <span id="status-notes" class="status-item notes-indicator" title="Collected Notes">
                    <span class="notes-icon">&#x1F4E7;</span>
                    <span class="notes-count">0/0</span>
                </span>
                ` : ""}
                ${this.features.showTether ? `
                <div id="status-tether" class="status-item tether-indicator">
                    <div class="tether-lightning">
                        <span class="tether-icon">&#x26A1;</span>
                        <div class="tether-fill"></div>
                    </div>
                    <span id="status-tether-value" class="tether-value">100%</span>
                </div>
                ` : ""}
                ${this.features.showThemeToggle ? `
                <button id="status-theme-toggle" class="status-item icon-btn" title="Toggle Dark/Light Mode" style="background:none; border:none; cursor:pointer; font-size:14px;">
                    🌙
                </button>
                ` : ""}
                ${this.features.showSettingsCog ? `
                <button id="status-settings" class="status-item icon-btn" title="Settings" style="background:none; border:none; cursor:pointer; font-size:14px;">
                    ⚙️
                </button>
                ` : ""}
            </div>
        `;
      this.loopEl = this.container.querySelector("#status-loop") || this.createPlaceholder();
      this.routeEl = this.container.querySelector("#status-route") || this.createPlaceholder();
      this.actEl = this.container.querySelector("#status-act") || this.createPlaceholder();
      this.autoEl = this.container.querySelector("#status-auto") || this.createPlaceholder();
      this.notesEl = this.container.querySelector("#status-notes") || this.createPlaceholder();
      this.tetherEl = this.container.querySelector("#status-tether") || this.createPlaceholder();
      this.tetherValueEl = this.container.querySelector("#status-tether-value") || this.createPlaceholder();
      this.tetherFillEl = this.container.querySelector(".tether-fill") || this.createPlaceholder();
      this.mailEl = this.container.querySelector("#status-mail") || this.createPlaceholder();
      this.unreadBadgeEl = this.container.querySelector(".unread-badge") || this.createPlaceholder();
      this.breadcrumbsEl = this.container.querySelector("#status-breadcrumbs") || this.createPlaceholder();
      this.phaseEl = this.container.querySelector("#status-phase") || this.createPlaceholder();
      this.storyDevToggleEl = this.container.querySelector("#status-story-dev-toggle") || this.createPlaceholder();
      this.themeToggleEl = this.container.querySelector("#status-theme-toggle") || this.createPlaceholder();
      this.settingsCogEl = this.container.querySelector("#status-settings") || this.createPlaceholder();
      document.body.prepend(this.container);
      if (this.features.showMail) {
        this.setupMailIconHandler();
      }
      if (this.features.showStoryDevToggle) {
        this.setupStoryDevToggle();
      }
      if (this.features.showBreadcrumbs) {
        this.updateBreadcrumbs();
      }
      if (this.features.showThemeToggle) {
        this.setupThemeToggle();
      }
      if (this.features.showSettingsCog) {
        this.setupSettingsCog();
      }
    }
    /**
     * Create a placeholder element for feature-flagged missing elements
     * Prevents null reference errors when elements are disabled
     */
    createPlaceholder() {
      const placeholder = document.createElement("span");
      placeholder.style.display = "none";
      return placeholder;
    }
    /**
     * Set up story/dev mode toggle for Showcase
     */
    setupStoryDevToggle() {
      if (!this.storyDevToggleEl) return;
      let isStoryMode = true;
      this.storyDevToggleEl.addEventListener("click", () => {
        isStoryMode = !isStoryMode;
        this.storyDevToggleEl.innerHTML = isStoryMode ? "📖 Story" : "🔧 Dev";
        if (navigator.vibrate) navigator.vibrate(10);
        this.eventBus.emit("settings:changed", {
          key: "viewMode",
          value: isStoryMode ? "story" : "dev"
        });
        console.log(`📖 View mode: ${isStoryMode ? "Story" : "Dev"}`);
      });
      this.storyDevToggleEl.addEventListener("mouseenter", () => {
        this.storyDevToggleEl.style.transform = "scale(1.05)";
        this.storyDevToggleEl.style.background = "rgba(255, 255, 255, 0.2)";
      });
      this.storyDevToggleEl.addEventListener("mouseleave", () => {
        this.storyDevToggleEl.style.transform = "";
        this.storyDevToggleEl.style.background = "rgba(255, 255, 255, 0.1)";
      });
    }

    /**
     * Setup Theme Toggle
     */
    setupThemeToggle() {
      if (!this.themeToggleEl) return;
      
      // Initialize theme from localStorage or system preference
      const savedTheme = localStorage.getItem('uv7-theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const initialTheme = savedTheme || systemTheme;
      
      document.body.dataset.theme = initialTheme;
      this.themeToggleEl.textContent = initialTheme === 'dark' ? '🌙' : '☀️';
      
      this.themeToggleEl.addEventListener('click', () => {
        const isDark = document.body.dataset.theme === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        document.body.dataset.theme = newTheme;
        localStorage.setItem('uv7-theme', newTheme);
        this.themeToggleEl.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        if (navigator.vibrate) navigator.vibrate(10);

        // Emit event for other components
        this.eventBus.emit('settings:changed', { key: 'theme', value: newTheme });
      });
    }

    /**
     * Setup Settings Cog
     */
    setupSettingsCog() {
      if (!this.settingsCogEl) return;
      this.settingsCogEl.addEventListener('click', () => {
        if (navigator.vibrate) navigator.vibrate(10);
        // Toggle Settings Shade or Modal
        // For now, emit event
        this.eventBus.emit('ui:settings:toggle', {});
        console.log('⚙️ Settings clicked');
      });
    }
    /**
     * DIZEE: Set up mail icon click handler (V1 parity)
     * Clicking the mail icon opens the sidebar to notes tab
     */
    setupMailIconHandler() {
      if (this.mailEl) {
        this.mailEl.addEventListener("click", () => {
          if (navigator.vibrate) navigator.vibrate(20);
          this.eventBus.emit("ui:sidebar:open", {});
          this.eventBus.emit("ui:notes:open", {});
        });
      }
    }
    /**
     * Set up EventBus listeners
     */
    setupEventListeners() {
      const unsubRoute = this.eventBus.on("ui:route_changed", (data) => {
        this.setRoute(data.route);
      });
      this.unsubscribers.push(unsubRoute);
      const unsubNote = this.eventBus.on("note:collected", (data) => {
        this.setNotesCollected(data.count);
        this.pulseNotes();
      });
      this.unsubscribers.push(unsubNote);
      const unsubTether = this.eventBus.on("tether:change", (data) => {
        this.setTetherLevel(data.level);
      });
      this.unsubscribers.push(unsubTether);
      const unsubScene = this.eventBus.on("scene:load", (data) => {
        this.updateActFromScene(data.sceneId);
      });
      this.unsubscribers.push(unsubScene);
      const unsubShow = this.eventBus.on("ui:show_status_bar", () => this.show());
      const unsubHide = this.eventBus.on("ui:hide_status_bar", () => this.hide());
      this.unsubscribers.push(unsubShow, unsubHide);
      const unsubStatus = this.eventBus.on("ui:status_update", (data) => {
        if (this.phaseEl) {
          this.phaseEl.textContent = data.context;
        } else if (this.routeEl) {
          this.routeEl.textContent = data.context;
        }
      });
      this.unsubscribers.push(unsubStatus);
      const unsubSettings = this.eventBus.on("settings:changed", (data) => {
        if (data.key === "autoAdvance") {
          this.setAutoIndicator(data.value);
        }
      });
      this.unsubscribers.push(unsubSettings);
    }
    /**
     * Set up StateManager subscriptions for reactive updates
     */
    setupStateSubscriptions() {
      if (!this.stateManager) return;
      const unsubTether = this.stateManager.subscribe("tether.level", (newLevel) => {
        if (typeof newLevel === "number") {
          this.setTetherLevel(newLevel);
        }
      });
      this.unsubscribers.push(unsubTether);
      const unsubRoute = this.stateManager.subscribe("game.currentRoute", (route) => {
        if (typeof route === "string") {
          this.setRoute(route);
        }
      });
      this.unsubscribers.push(unsubRoute);
      const unsubNotes = this.stateManager.subscribe("notes.collected", (count) => {
        if (typeof count === "number") {
          this.setNotesCollected(count);
        }
      });
      this.unsubscribers.push(unsubNotes);
    }
    /**
     * Load initial state from StateManager
     */
    loadInitialState() {
      if (!this.stateManager) return;
      const route = this.stateManager.get("game.currentRoute");
      if (route) {
        this.setRoute(route);
      }
      const tetherLevel = this.stateManager.get("tether.level");
      if (typeof tetherLevel === "number") {
        this.setTetherLevel(tetherLevel);
      }
      const notesCollected = this.stateManager.get("notes.collected");
      if (typeof notesCollected === "number") {
        this.setNotesCollected(notesCollected);
      }
      const autoAdvance = this.stateManager.get("settings.autoAdvance");
      this.setAutoIndicator(!!autoAdvance);
    }
    /**
     * Set up idle timer for auto-dimming
     */
    setupIdleTimer() {
      const resetIdle = () => this.resetIdleTimer();
      document.addEventListener("mousemove", resetIdle);
      document.addEventListener("touchstart", resetIdle);
      document.addEventListener("keydown", resetIdle);
      this.resetIdleTimer();
    }
    /**
     * Reset idle timer - shows status bar and starts countdown
     */
    resetIdleTimer() {
      if (this.idleTimer) {
        clearTimeout(this.idleTimer);
      }
      this.container.classList.remove("idle");
      this.idleTimer = setTimeout(() => {
        this.container.classList.add("idle");
      }, this.idleDelay);
    }
    // ========================================
    // PUBLIC API
    // ========================================
    /**
     * Set the current route
     */
    setRoute(route) {
      this.currentRoute = route;
      const routeDisplayNames = {
        "ronnie": "RONNIE",
        "tori": "TORI",
        "menu": "MENU",
        "prologue": "PROLOGUE"
      };
      this.routeEl.textContent = routeDisplayNames[route] || route.toUpperCase();
      this.container.classList.remove("ronnie-route", "tori-route");
      if (route === "ronnie") {
        this.container.classList.add("ronnie-route");
      } else if (route === "tori") {
        this.container.classList.add("tori-route");
      }
      this.updateTetherVisibility();
      this.updateNotesDisplay();
      this.updateBreadcrumbs();
      this.updateAdaptiveTint();
    }
    /**
     * Set notes collected count
     */
    setNotesCollected(count) {
      this.notesCollected = count;
      this.updateNotesDisplay();
    }
    /**
     * Set tether level (0-100)
     */
    setTetherLevel(level) {
      this.tetherLevel = Math.max(0, Math.min(100, level));
      this.tetherValueEl.textContent = `${Math.round(this.tetherLevel)}%`;
      this.tetherFillEl.style.height = `${this.tetherLevel}%`;
      this.tetherEl.classList.remove("healthy", "warning", "critical");
      if (this.tetherLevel < 20) {
        this.tetherEl.classList.add("critical");
      } else if (this.tetherLevel < 50) {
        this.tetherEl.classList.add("warning");
      } else {
        this.tetherEl.classList.add("healthy");
      }
    }
    /**
     * Set the current act/scene indicator
     */
    setAct(act) {
      this._currentAct = act;
      this.actEl.textContent = act;
      this.actEl.style.display = act ? "inline" : "none";
      this.updateBreadcrumbs();
    }
    setAutoIndicator(enabled) {
      this.autoEl.style.display = enabled ? "inline" : "none";
      if (enabled) {
        this.autoEl.classList.add("pulse");
      }
    }
    /**
     * Get the current act
     */
    getAct() {
      return this._currentAct;
    }
    /**
     * Update loop version display
     */
    setLoopVersion(version) {
      this.loopEl.textContent = version;
    }
    /**
     * Show the status bar
     */
    show() {
      this.container.classList.add("visible");
    }
    /**
     * Hide the status bar
     */
    hide() {
      this.container.classList.remove("visible");
    }
    /**
     * Pulse the loop number (for loop increment events)
     */
    pulseLoop() {
      this.loopEl.classList.add("pulse");
      setTimeout(() => {
        this.loopEl.classList.remove("pulse");
      }, 600);
    }
    /**
     * Glitch effect on loop number (Ronnie route)
     */
    glitchLoop() {
      if (this.currentRoute === "ronnie") {
        this.loopEl.classList.add("glitch");
        setTimeout(() => {
          this.loopEl.classList.remove("glitch");
        }, 300);
      }
    }
    /**
     * Pulse the notes indicator (when note collected)
     */
    pulseNotes() {
      this.notesEl.classList.add("pulse");
      setTimeout(() => {
        this.notesEl.classList.remove("pulse");
      }, 600);
    }
    // ========================================
    // DIZEE: UNREAD NOTES SYSTEM (V1 Parity)
    // Email-style mail icon with badge counter
    // ========================================
    /**
     * Add an unread note - shows mail icon with badge
     * V1 Parity: notification-shade-controller.js addUnreadNote()
     */
    addUnreadNote(id, title, sender, content = "") {
      this.unreadNotes.set(id, {
        id,
        title,
        sender,
        content,
        timestamp: Date.now()
      });
      this.updateMailIcon();
      this.pulseMail();
      if (!this.hasShownFirstNoteTutorial && this.currentRoute === "tori") {
        this.hasShownFirstNoteTutorial = true;
        this.eventBus.emit("ui:notification", {
          type: "info",
          message: "Tap the mail icon to read notes"
        });
      }
      console.log(`📬 New unread note: ${sender} - ${title}`);
    }
    /**
     * Mark a note as read - removes from unread count
     * V1 Parity: notification-shade-controller.js markNoteAsRead()
     */
    markNoteAsRead(id) {
      if (this.unreadNotes.has(id)) {
        this.unreadNotes.delete(id);
        this.updateMailIcon();
        console.log(`📭 Note marked as read: ${id}`);
      }
    }
    /**
     * Mark all notes as read
     */
    markAllNotesAsRead() {
      this.unreadNotes.clear();
      this.updateMailIcon();
      console.log("📭 All notes marked as read");
    }
    /**
     * Get unread count
     */
    getUnreadCount() {
      return this.unreadNotes.size;
    }
    /**
     * Get most recent unread note (for preview)
     */
    getMostRecentUnread() {
      if (this.unreadNotes.size === 0) return null;
      let mostRecent = null;
      this.unreadNotes.forEach((note) => {
        if (!mostRecent || note.timestamp > mostRecent.timestamp) {
          mostRecent = note;
        }
      });
      return mostRecent;
    }
    /**
     * Update mail icon visibility and badge count
     * V1 Parity: notification-shade-controller.js updateMailIcon()
     */
    updateMailIcon() {
      const count = this.unreadNotes.size;
      if (count > 0) {
        this.mailEl.style.display = "flex";
        this.unreadBadgeEl.textContent = count > 9 ? "9+" : String(count);
        this.unreadBadgeEl.style.display = "flex";
        this.mailEl.classList.add("has-unread");
      } else {
        this.mailEl.style.display = "none";
        this.unreadBadgeEl.style.display = "none";
        this.mailEl.classList.remove("has-unread");
      }
    }
    /**
     * Pulse mail icon animation
     */
    pulseMail() {
      if (!this.mailEl) return;
      this.mailEl.classList.add("pulse");
      setTimeout(() => {
        this.mailEl.classList.remove("pulse");
      }, 600);
    }
    /**
     * Clean up and destroy the status bar
     */
    destroy() {
      this.unsubscribers.forEach((unsub) => unsub());
      this.unsubscribers = [];
      if (this.idleTimer) {
        clearTimeout(this.idleTimer);
        this.idleTimer = null;
      }
      if (this.previewTimeout) {
        clearTimeout(this.previewTimeout);
        this.previewTimeout = null;
      }
      this.removeOrientationHandler();
      this.cleanupGestures();
      this.container.remove();
    }
    // ========================================
    // PRIVATE HELPERS
    // ========================================
    /**
     * Update notes display with current count and route-specific total
     */
    updateNotesDisplay() {
      const total = this.getTotalNotes();
      const notesCountEl = this.notesEl.querySelector(".notes-count");
      if (notesCountEl) {
        notesCountEl.textContent = `${this.notesCollected}/${total}`;
      }
      const hideInRoutes = ["menu", "prologue"];
      this.notesEl.style.display = hideInRoutes.includes(this.currentRoute) ? "none" : "flex";
    }
    /**
     * Get total notes for current route
     */
    getTotalNotes() {
      if (this.currentRoute === "ronnie") {
        return this.config.totalNotes.ronnie;
      } else if (this.currentRoute === "tori") {
        return this.config.totalNotes.tori;
      }
      return 0;
    }
    /**
     * Show/hide tether indicator based on route (only Tori has tether)
     */
    updateTetherVisibility() {
      this.tetherEl.style.display = this.currentRoute === "tori" ? "flex" : "none";
    }
    /**
     * Extract act from scene ID and update display
     * Scene IDs follow pattern: act1_scene_name, act2_scene_name, etc.
     */
    updateActFromScene(sceneId) {
      const actMatch = sceneId.match(/^(act\d+)/i);
      if (actMatch && actMatch[1]) {
        const actNumber = actMatch[1].replace("act", "");
        this.setAct(`Act ${actNumber}`);
      }
    }
    /**
     * Toggle screenshot mode - hides all UI
     * V1 Parity: notification-shade-controller.js toggleScreenshotMode()
     */
    toggleScreenshotMode() {
      this.isScreenshotMode = !this.isScreenshotMode;
      if (this.isScreenshotMode) {
        document.body.classList.add("screenshot-mode");
        this.container.style.display = "none";
        this.eventBus.emit("ui:hide_hud", {});
        console.log("📸 Screenshot mode ON - All UI hidden");
      } else {
        document.body.classList.remove("screenshot-mode");
        if (this.container.classList.contains("visible")) {
          this.container.style.display = "flex";
        }
        this.eventBus.emit("ui:show_status_bar", {});
        console.log("📸 Screenshot mode OFF - UI restored");
      }
    }
    /**
     * Check if screenshot mode is active
     */
    isInScreenshotMode() {
      return this.isScreenshotMode;
    }
    /**
     * Set up orientation change handler
     * V1 Parity: Closes sidebar when rotating to portrait
     */
    setupOrientationHandler() {
      this.orientationHandler = () => {
        const isPortrait = window.matchMedia("(orientation: portrait)").matches;
        const isNarrow = window.innerWidth < 769;
        if (isPortrait || isNarrow) {
          this.eventBus.emit("ui:sidebar:close", {});
          console.log("📱 Portrait mode detected - Sidebar closed");
        }
        this.container.classList.toggle("portrait", isPortrait);
        this.container.classList.toggle("landscape", !isPortrait);
      };
      window.addEventListener("orientationchange", this.orientationHandler);
      window.addEventListener("resize", this.orientationHandler);
      this.orientationHandler();
    }
    /**
     * Remove orientation handler (cleanup)
     */
    removeOrientationHandler() {
      if (this.orientationHandler) {
        window.removeEventListener("orientationchange", this.orientationHandler);
        window.removeEventListener("resize", this.orientationHandler);
        this.orientationHandler = null;
      }
    }
    // ms between taps
    /**
     * Set up gesture handlers on the status bar
     * Tori's rule: gestures only on explicit hit zones, not whole bar
     */
    setupGestures() {
      if (!this.features.enableGestures) return;
      this.container.addEventListener("touchstart", (e) => this.handleTouchStart(e), { passive: true });
      this.container.addEventListener("touchend", (e) => this.handleTouchEnd(e), { passive: false });
      this.container.addEventListener("touchmove", (e) => this.handleTouchMove(e), { passive: true });
      this.container.addEventListener("contextmenu", (e) => this.handleContextMenu(e));
      const logoTrigger = this.container.querySelector("#uv7-logo-trigger");
      if (logoTrigger) {
        this.setupLogoLongPress(logoTrigger);
      }
      console.log("👆 StatusBar gestures initialized");
    }
    /**
     * Handle touch start - record position and start long-press timer
     */
    handleTouchStart(e) {
      const touch = e.touches[0];
      if (!touch) return;
      this.gestureState.touchStartX = touch.clientX;
      this.gestureState.touchStartY = touch.clientY;
      this.gestureState.touchStartTime = Date.now();
      this.gestureState.isLongPress = false;
      const touchX = touch.clientX;
      const touchY = touch.clientY;
      this.gestureState.longPressTimer = setTimeout(() => {
        this.gestureState.isLongPress = true;
        this.showQuickActionsMenu(touchX, touchY);
        if (navigator.vibrate) navigator.vibrate([30, 20, 30]);
      }, this.LONG_PRESS_DELAY);
    }
    /**
     * Handle touch move - cancel long-press if moved too much
     */
    handleTouchMove(e) {
      const touch = e.touches[0];
      if (!touch) return;
      const deltaX = Math.abs(touch.clientX - this.gestureState.touchStartX);
      const deltaY = Math.abs(touch.clientY - this.gestureState.touchStartY);
      if (deltaX > 10 || deltaY > 10) {
        if (this.gestureState.longPressTimer) {
          clearTimeout(this.gestureState.longPressTimer);
          this.gestureState.longPressTimer = null;
        }
      }
    }
    /**
     * Handle touch end - detect swipes and double-taps
     */
    handleTouchEnd(e) {
      if (this.gestureState.longPressTimer) {
        clearTimeout(this.gestureState.longPressTimer);
        this.gestureState.longPressTimer = null;
      }
      if (this.gestureState.isLongPress) {
        this.gestureState.isLongPress = false;
        return;
      }
      const touch = e.changedTouches[0];
      if (!touch) return;
      const deltaX = touch.clientX - this.gestureState.touchStartX;
      const deltaY = touch.clientY - this.gestureState.touchStartY;
      const elapsed = Date.now() - this.gestureState.touchStartTime;
      if (deltaY > this.SWIPE_THRESHOLD && Math.abs(deltaX) < this.SWIPE_THRESHOLD && elapsed < 500) {
        e.preventDefault();
        this.handleSwipeDown();
        return;
      }
      const now = Date.now();
      if (now - this.gestureState.lastTapTime < this.DOUBLE_TAP_DELAY) {
        const target = e.target;
        if (target === this.container || target.classList.contains("status-section")) {
          e.preventDefault();
          this.toggleScreenshotMode();
          if (navigator.vibrate) navigator.vibrate(20);
        }
      }
      this.gestureState.lastTapTime = now;
    }
    /**
     * Handle swipe down on status bar - show quick actions
     */
    handleSwipeDown() {
      console.log("👇 Swipe down detected - showing quick actions");
      if (navigator.vibrate) navigator.vibrate(15);
      this.eventBus.emit("ui:shade:toggle", {});
    }
    /**
     * Set up long-press handler specifically for UV7 logo
     * Long-press logo → App Switcher (with haptic)
     */
    setupLogoLongPress(logo) {
      let longPressTimer = null;
      let isLongPress = false;
      logo.addEventListener("touchstart", () => {
        isLongPress = false;
        longPressTimer = setTimeout(async () => {
          isLongPress = true;
          if (navigator.vibrate) navigator.vibrate([20, 50, 40]);
          try {
            const { initializeAppSwitcher: initializeAppSwitcher2 } = await Promise.resolve().then(() => UV7AppSwitcher);
            const appSwitcher = await initializeAppSwitcher2();
            appSwitcher.toggle();
            console.log("🚀 Long-press → App Switcher opened");
          } catch (error) {
            console.warn("⚠️ App Switcher failed:", error);
          }
        }, this.LONG_PRESS_DELAY);
      }, { passive: true });
      logo.addEventListener("touchend", (e) => {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }
        if (isLongPress) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
      logo.addEventListener("touchmove", () => {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }
      }, { passive: true });
    }
    /**
     * Handle right-click context menu on status bar
     */
    handleContextMenu(e) {
      e.preventDefault();
      const target = e.target;
      const targetId = target.id || target.closest("[id]")?.id || "";
      this.showContextMenu(e.clientX, e.clientY, targetId);
    }
    /**
     * Show context menu at position with options based on target
     */
    showContextMenu(x, y, targetId) {
      this.hideContextMenu();
      const menu = document.createElement("div");
      menu.className = "status-bar-context-menu";
      menu.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            background: linear-gradient(145deg, rgba(26, 26, 46, 0.98), rgba(15, 15, 26, 0.98));
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 8px;
            padding: 8px 0;
            min-width: 160px;
            z-index: 10001;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.9);
            opacity: 0;
            transform: scale(0.95) translateY(-5px);
            transition: all 0.15s ease;
        `;
      const items = this.getContextMenuItems(targetId);
      items.forEach((item) => {
        const menuItem = document.createElement("div");
        menuItem.style.cssText = `
                padding: 8px 16px;
                cursor: pointer;
                transition: all 0.15s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
        menuItem.innerHTML = `<span style="width: 16px;">${item.icon}</span> ${item.label}`;
        menuItem.addEventListener("mouseenter", () => {
          menuItem.style.background = "rgba(0, 255, 255, 0.1)";
          menuItem.style.color = "#00ffff";
        });
        menuItem.addEventListener("mouseleave", () => {
          menuItem.style.background = "";
          menuItem.style.color = "rgba(255, 255, 255, 0.9)";
        });
        menuItem.addEventListener("click", () => {
          item.action();
          this.hideContextMenu();
        });
        menu.appendChild(menuItem);
      });
      document.body.appendChild(menu);
      requestAnimationFrame(() => {
        menu.style.opacity = "1";
        menu.style.transform = "scale(1) translateY(0)";
      });
      const closeHandler = (e) => {
        if (!menu.contains(e.target)) {
          this.hideContextMenu();
          document.removeEventListener("click", closeHandler);
        }
      };
      setTimeout(() => document.addEventListener("click", closeHandler), 10);
    }
    /**
     * Get context menu items based on what was clicked
     */
    getContextMenuItems(targetId) {
      const baseItems = [
        {
          icon: "📸",
          label: "Screenshot Mode",
          action: () => this.toggleScreenshotMode()
        },
        {
          icon: "🔄",
          label: "Refresh View",
          action: () => this.eventBus.emit("game:reset_view", {})
        }
      ];
      if (targetId === "status-loop" || targetId.includes("loop")) {
        return [
          {
            icon: "🔢",
            label: `Loop v.${this.stateManager?.get("game.loopVersion") || 848}`,
            action: () => this.pulseLoop()
          },
          {
            icon: "📜",
            label: "View Loop History",
            action: () => this.eventBus.emit("ui:backlog:toggle", {})
          },
          ...baseItems
        ];
      }
      if (targetId === "status-route" || targetId.includes("route")) {
        return [
          {
            icon: "🔀",
            label: "Switch Route",
            action: () => this.eventBus.emit("ui:show_route_select", {})
          },
          {
            icon: "🏠",
            label: "Return to Menu",
            action: () => this.eventBus.emit("ui:main_menu", {})
          },
          ...baseItems
        ];
      }
      if (targetId === "status-tether" || targetId.includes("tether")) {
        return [
          {
            icon: "⚡",
            label: `Tether: ${Math.round(this.tetherLevel)}%`,
            action: () => {
            }
            // Info only
          },
          {
            icon: "💉",
            label: "Boost Tether (+10)",
            action: () => this.eventBus.emit("tether:boost", { amount: 10 })
          },
          ...baseItems
        ];
      }
      if (targetId === "status-notes" || targetId.includes("notes")) {
        return [
          {
            icon: "📬",
            label: "Open Notes",
            action: () => this.eventBus.emit("ui:notes:open", {})
          },
          {
            icon: "✅",
            label: "Mark All Read",
            action: () => this.markAllNotesAsRead()
          },
          ...baseItems
        ];
      }
      return [
        {
          icon: "🚀",
          label: "App Switcher",
          action: async () => {
            try {
              const { initializeAppSwitcher: initializeAppSwitcher2 } = await Promise.resolve().then(() => UV7AppSwitcher);
              const appSwitcher = await initializeAppSwitcher2();
              appSwitcher.toggle();
            } catch (e) {
              console.warn("App Switcher failed:", e);
            }
          }
        },
        ...baseItems,
        {
          icon: "⚙️",
          label: "Settings",
          action: () => this.eventBus.emit("settings:open", {})
        }
      ];
    }
    /**
     * Hide and remove context menu
     */
    hideContextMenu() {
      const existing = document.querySelector(".status-bar-context-menu");
      if (existing) {
        existing.remove();
      }
    }
    /**
     * Show quick actions menu (swipe down or long-press)
     */
    showQuickActionsMenu(x, y) {
      console.log("⚡ Quick Actions triggered at", x, y);
      this.eventBus.emit("ui:shade:toggle", {});
    }
    /**
     * Clean up gesture state
     */
    cleanupGestures() {
      if (this.gestureState.longPressTimer) {
        clearTimeout(this.gestureState.longPressTimer);
        this.gestureState.longPressTimer = null;
      }
      this.hideContextMenu();
    }
  }
  const DEFAULT_DURATIONS = {
    urgent: 0,
    // Persistent until dismissed
    high: 1e4,
    // 10 seconds
    normal: 5e3,
    // 5 seconds
    low: 3e3
    // 3 seconds
  };
  const PRIORITY_COLORS = {
    urgent: {
      border: "rgba(255, 68, 68, 0.8)",
      glow: "rgba(255, 68, 68, 0.4)",
      bg: "linear-gradient(145deg, rgba(80, 20, 20, 0.95), rgba(40, 10, 10, 0.98))"
    },
    high: {
      border: "rgba(255, 165, 0, 0.7)",
      glow: "rgba(255, 165, 0, 0.3)",
      bg: "linear-gradient(145deg, rgba(60, 40, 10, 0.95), rgba(30, 20, 5, 0.98))"
    },
    normal: {
      border: "rgba(0, 255, 255, 0.5)",
      glow: "rgba(0, 255, 255, 0.2)",
      bg: "linear-gradient(145deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 26, 0.98))"
    },
    low: {
      border: "rgba(255, 255, 255, 0.3)",
      glow: "rgba(255, 255, 255, 0.1)",
      bg: "linear-gradient(145deg, rgba(30, 30, 40, 0.9), rgba(20, 20, 30, 0.95))"
    }
  };
  const CATEGORY_ICONS = {
    system: "⚙️",
    torigatchi: "🐱",
    achievement: "🏆",
    autosave: "💾",
    tether: "⚡",
    note: "📬",
    app: "📱"
  };
  class NotificationRail {
    constructor(eventBus) {
      this.notifications = /* @__PURE__ */ new Map();
      this.notificationElements = /* @__PURE__ */ new Map();
      this.dismissTimers = /* @__PURE__ */ new Map();
      this.badgeCounts = /* @__PURE__ */ new Map();
      this.unsubscribers = [];
      this.swipeState = {
        startX: 0,
        startY: 0,
        currentX: 0,
        isDragging: false,
        targetId: null
      };
      this.SWIPE_THRESHOLD = 80;
      this.ANIMATION_DURATION = 300;
      this.eventBus = eventBus;
      this.createDOM();
      this.setupEventListeners();
      this.injectStyles();
      console.log("🔔 NotificationRail initialized (Phase 26d)");
    }
    // ========================================
    // DOM CREATION
    // ========================================
    createDOM() {
      this.container = document.createElement("div");
      this.container.id = "notification-rail-container";
      this.container.style.cssText = `
            position: fixed;
            top: 36px;
            right: 12px;
            z-index: 9998;
            pointer-events: none;
            max-height: calc(100vh - 60px);
            overflow: visible;
        `;
      this.railElement = document.createElement("div");
      this.railElement.id = "notification-rail";
      this.railElement.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
            pointer-events: auto;
            max-height: calc(100vh - 80px);
            overflow-y: auto;
            overflow-x: visible;
            padding: 4px;
            scrollbar-width: none;
            -ms-overflow-style: none;
        `;
      this.railElement.style.cssText += `
            &::-webkit-scrollbar { display: none; }
        `;
      this.container.appendChild(this.railElement);
      document.body.appendChild(this.container);
    }
    // ========================================
    // STYLE INJECTION
    // ========================================
    injectStyles() {
      if (document.getElementById("notification-rail-styles")) return;
      const styles = document.createElement("style");
      styles.id = "notification-rail-styles";
      styles.textContent = `
            /* Notification card base */
            .notification-card {
                position: relative;
                width: 280px;
                padding: 12px 16px;
                border-radius: 12px;
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                font-family: 'Courier New', monospace;
                cursor: pointer;
                transform-origin: right center;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                opacity: 0;
                transform: translateX(100%) scale(0.9);
                touch-action: pan-y;
            }

            .notification-card.visible {
                opacity: 1;
                transform: translateX(0) scale(1);
            }

            .notification-card.dismissing {
                opacity: 0;
                transform: translateX(120%) scale(0.8);
            }

            .notification-card.stacked {
                position: absolute;
                right: 0;
            }

            /* Hover effect */
            .notification-card:hover {
                transform: translateX(-4px) scale(1.02);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            }

            .notification-card.swiping {
                transition: none !important;
            }

            /* Priority pulse animation for urgent */
            .notification-card.priority-urgent {
                animation: urgentPulse 2s ease-in-out infinite;
            }

            @keyframes urgentPulse {
                0%, 100% { box-shadow: 0 4px 20px rgba(255, 68, 68, 0.3); }
                50% { box-shadow: 0 4px 30px rgba(255, 68, 68, 0.6); }
            }

            /* Notification content layout */
            .notification-header {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 6px;
            }

            .notification-icon {
                font-size: 16px;
                flex-shrink: 0;
            }

            .notification-title {
                font-size: 12px;
                font-weight: bold;
                color: rgba(255, 255, 255, 0.95);
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .notification-time {
                font-size: 10px;
                color: rgba(255, 255, 255, 0.5);
                flex-shrink: 0;
            }

            .notification-message {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.8);
                line-height: 1.4;
                max-height: 2.8em;
                overflow: hidden;
            }

            .notification-actions {
                display: flex;
                gap: 8px;
                margin-top: 8px;
            }

            .notification-action-btn {
                flex: 1;
                padding: 6px 12px;
                border: 1px solid rgba(0, 255, 255, 0.4);
                border-radius: 6px;
                background: rgba(0, 255, 255, 0.1);
                color: #00ffff;
                font-size: 10px;
                font-family: inherit;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .notification-action-btn:hover {
                background: rgba(0, 255, 255, 0.2);
                border-color: rgba(0, 255, 255, 0.6);
            }

            .notification-dismiss-btn {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.2);
                color: rgba(255, 255, 255, 0.7);
            }

            .notification-dismiss-btn:hover {
                background: rgba(255, 100, 100, 0.2);
                border-color: rgba(255, 100, 100, 0.4);
                color: rgba(255, 150, 150, 0.9);
            }

            /* Swipe indicator */
            .notification-swipe-indicator {
                position: absolute;
                right: -30px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 14px;
                opacity: 0;
                transition: opacity 0.2s ease;
            }

            .notification-card.swiping .notification-swipe-indicator {
                opacity: 1;
            }

            /* Stack counter badge */
            .notification-stack-badge {
                position: absolute;
                top: -6px;
                right: -6px;
                background: linear-gradient(135deg, #ff6b9d, #ff4444);
                color: white;
                font-size: 10px;
                font-weight: bold;
                padding: 2px 6px;
                border-radius: 10px;
                min-width: 16px;
                text-align: center;
                box-shadow: 0 2px 8px rgba(255, 68, 68, 0.4);
            }

            /* Clear all button */
            .notification-clear-all {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                padding: 8px 16px;
                margin-top: 8px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 8px;
                color: rgba(255, 255, 255, 0.6);
                font-size: 11px;
                font-family: 'Courier New', monospace;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .notification-clear-all:hover {
                background: rgba(255, 100, 100, 0.1);
                border-color: rgba(255, 100, 100, 0.3);
                color: rgba(255, 150, 150, 0.9);
            }

            /* Category-specific styles */
            .notification-card.category-torigatchi .notification-icon {
                animation: bounce 1s ease infinite;
            }

            .notification-card.category-achievement {
                background: linear-gradient(145deg, rgba(50, 40, 10, 0.95), rgba(30, 25, 5, 0.98)) !important;
                border-color: rgba(255, 215, 0, 0.6) !important;
            }

            .notification-card.category-achievement .notification-icon {
                animation: shine 2s ease-in-out infinite;
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-3px); }
            }

            @keyframes shine {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.3); }
            }

            /* Slide-in animation for rail itself */
            #notification-rail-container.collapsed {
                transform: translateX(calc(100% + 20px));
            }

            #notification-rail-container {
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
        `;
      document.head.appendChild(styles);
    }
    // ========================================
    // EVENT LISTENERS
    // ========================================
    setupEventListeners() {
      const unsubNotify = this.eventBus.on("notification:show", (data) => {
        this.show({
          id: data.id || `notif-${Date.now()}`,
          title: data.title || "Notification",
          message: data.message || "",
          icon: data.icon || CATEGORY_ICONS[data.category] || "📌",
          category: data.category || "system",
          priority: data.priority || "normal",
          timestamp: Date.now(),
          duration: data.duration,
          actionLabel: data.actionLabel,
          actionCallback: data.actionCallback,
          appId: data.appId,
          dismissible: data.dismissible !== false
        });
      });
      this.unsubscribers.push(unsubNotify);
      const unsubDismiss = this.eventBus.on("notification:dismiss", (data) => {
        if (data.id) {
          this.dismiss(data.id);
        }
      });
      this.unsubscribers.push(unsubDismiss);
      const unsubClear = this.eventBus.on("notification:clear_all", () => {
        this.clearAll();
      });
      this.unsubscribers.push(unsubClear);
      this.setupAppSpecificListeners();
    }
    /**
     * Set up listeners for app-specific events
     * ToriGatchi hunger, auto-save, achievements, tether warnings
     */
    setupAppSpecificListeners() {
      const unsubHunger = this.eventBus.on("torigatchi:hunger_warning", (data) => {
        this.show({
          id: "torigatchi-hunger",
          title: "ToriGatchi is Hungry!",
          message: data.message || "Your pet needs attention soon...",
          icon: "🐱",
          category: "torigatchi",
          priority: data.urgent ? "urgent" : "high",
          timestamp: Date.now(),
          duration: 0,
          // Persistent until addressed
          actionLabel: "Feed Now",
          actionCallback: () => {
            this.eventBus.emit("app:launch", { appId: "torigatchi" });
          },
          appId: "torigatchi",
          dismissible: true
        });
      });
      this.unsubscribers.push(unsubHunger);
      const unsubAutosave = this.eventBus.on("game:autosave", (data) => {
        this.show({
          id: `autosave-${Date.now()}`,
          title: "Auto-Saved",
          message: data.scene ? `Progress saved at ${data.scene}` : "Progress saved",
          icon: "💾",
          category: "autosave",
          priority: "low",
          timestamp: Date.now(),
          duration: 2e3,
          // Quick confirmation
          dismissible: true
        });
      });
      this.unsubscribers.push(unsubAutosave);
      const unsubAchievement = this.eventBus.on("achievement:unlocked", (data) => {
        this.show({
          id: `achievement-${data.id || Date.now()}`,
          title: "Achievement Unlocked!",
          message: data.title || data.description || "You did something amazing!",
          icon: data.icon || "🏆",
          category: "achievement",
          priority: "high",
          timestamp: Date.now(),
          duration: 8e3,
          actionLabel: "View",
          actionCallback: () => {
            this.eventBus.emit("ui:achievements:open", {});
          },
          dismissible: true
        });
        if (navigator.vibrate) navigator.vibrate([50, 30, 100]);
      });
      this.unsubscribers.push(unsubAchievement);
      const unsubTether = this.eventBus.on("tether:warning", (data) => {
        const level = data.level || 0;
        const isCritical = level < 20;
        this.show({
          id: "tether-warning",
          title: isCritical ? "⚠️ Tether Critical!" : "Tether Low",
          message: `Connection at ${Math.round(level)}%${isCritical ? " - Take action!" : ""}`,
          icon: "⚡",
          category: "tether",
          priority: isCritical ? "urgent" : "high",
          timestamp: Date.now(),
          duration: isCritical ? 0 : 5e3,
          dismissible: !isCritical
        });
      });
      this.unsubscribers.push(unsubTether);
      const unsubNote = this.eventBus.on("note:received", (data) => {
        this.show({
          id: `note-${data.id || Date.now()}`,
          title: `New Note from ${data.sender || "Unknown"}`,
          message: data.preview || data.title || "You have a new note",
          icon: "📬",
          category: "note",
          priority: "normal",
          timestamp: Date.now(),
          duration: 6e3,
          actionLabel: "Read",
          actionCallback: () => {
            this.eventBus.emit("ui:notes:open", { noteId: data.id });
          },
          dismissible: true
        });
      });
      this.unsubscribers.push(unsubNote);
    }
    // ========================================
    // PUBLIC API
    // ========================================
    /**
     * Show a notification
     */
    show(config) {
      if (this.notifications.has(config.id)) {
        this.update(config.id, config);
        return;
      }
      if (config.duration === void 0) {
        config.duration = DEFAULT_DURATIONS[config.priority];
      }
      this.notifications.set(config.id, config);
      if (config.appId) {
        const count = (this.badgeCounts.get(config.appId) || 0) + 1;
        this.badgeCounts.set(config.appId, count);
        this.eventBus.emit("notification:badge_update", {
          appId: config.appId,
          count
        });
      }
      this.createNotificationElement(config);
      if (config.duration && config.duration > 0) {
        const timer = setTimeout(() => {
          this.dismiss(config.id);
        }, config.duration);
        this.dismissTimers.set(config.id, timer);
      }
      this.eventBus.emit("notification:shown", { id: config.id, category: config.category });
      console.log(`🔔 Notification shown: ${config.title} [${config.priority}]`);
    }
    /**
     * Update an existing notification
     */
    update(id, updates) {
      const existing = this.notifications.get(id);
      if (!existing) return;
      const updated = { ...existing, ...updates };
      this.notifications.set(id, updated);
      const element = this.notificationElements.get(id);
      if (element) {
        this.updateNotificationElement(element, updated);
      }
    }
    /**
     * Dismiss a notification
     */
    dismiss(id, skipAnimation = false) {
      const config = this.notifications.get(id);
      const element = this.notificationElements.get(id);
      if (!config || !element) return;
      const timer = this.dismissTimers.get(id);
      if (timer) {
        clearTimeout(timer);
        this.dismissTimers.delete(id);
      }
      if (config.appId) {
        const count = Math.max(0, (this.badgeCounts.get(config.appId) || 1) - 1);
        this.badgeCounts.set(config.appId, count);
        this.eventBus.emit("notification:badge_update", {
          appId: config.appId,
          count
        });
      }
      if (!skipAnimation) {
        element.classList.add("dismissing");
        setTimeout(() => {
          this.removeNotification(id);
        }, this.ANIMATION_DURATION);
      } else {
        this.removeNotification(id);
      }
      if (navigator.vibrate) navigator.vibrate(10);
    }
    /**
     * Clear all notifications
     */
    clearAll() {
      const ids = Array.from(this.notifications.keys());
      ids.forEach((id, index) => {
        setTimeout(() => {
          this.dismiss(id);
        }, index * 50);
      });
      console.log("🧹 All notifications cleared");
    }
    /**
     * Get notification count
     */
    getCount() {
      return this.notifications.size;
    }
    /**
     * Get notifications by category
     */
    getByCategory(category) {
      return Array.from(this.notifications.values()).filter((n) => n.category === category);
    }
    /**
     * Get badge count for an app
     */
    getBadgeCount(appId) {
      return this.badgeCounts.get(appId) || 0;
    }
    /**
     * Destroy the notification rail
     */
    destroy() {
      this.dismissTimers.forEach((timer) => clearTimeout(timer));
      this.dismissTimers.clear();
      this.unsubscribers.forEach((unsub) => unsub());
      this.unsubscribers = [];
      this.container.remove();
      console.log("🔔 NotificationRail destroyed");
    }
    // ========================================
    // PRIVATE METHODS
    // ========================================
    /**
     * Create notification DOM element
     */
    createNotificationElement(config) {
      const colors = PRIORITY_COLORS[config.priority];
      const card = document.createElement("div");
      card.className = `notification-card priority-${config.priority} category-${config.category}`;
      card.dataset.id = config.id;
      card.style.cssText = `
            background: ${colors.bg};
            border: 1px solid ${colors.border};
            box-shadow: 0 4px 20px ${colors.glow};
        `;
      card.innerHTML = `
            <div class="notification-header">
                <span class="notification-icon">${config.icon}</span>
                <span class="notification-title">${this.escapeHtml(config.title)}</span>
                <span class="notification-time">${this.formatTime(config.timestamp)}</span>
            </div>
            <div class="notification-message">${this.escapeHtml(config.message)}</div>
            ${config.actionLabel || config.dismissible !== false ? `
            <div class="notification-actions">
                ${config.actionLabel ? `
                <button class="notification-action-btn">${this.escapeHtml(config.actionLabel)}</button>
                ` : ""}
                ${config.dismissible !== false ? `
                <button class="notification-action-btn notification-dismiss-btn">Dismiss</button>
                ` : ""}
            </div>
            ` : ""}
            <span class="notification-swipe-indicator">→</span>
        `;
      this.setupNotificationHandlers(card, config);
      this.railElement.insertBefore(card, this.railElement.firstChild);
      this.notificationElements.set(config.id, card);
      requestAnimationFrame(() => {
        card.classList.add("visible");
      });
      this.updateStackDisplay();
    }
    /**
     * Set up event handlers for a notification card
     */
    setupNotificationHandlers(card, config) {
      const actionBtn = card.querySelector(".notification-action-btn:not(.notification-dismiss-btn)");
      if (actionBtn && config.actionCallback) {
        actionBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          config.actionCallback();
          this.dismiss(config.id);
        });
      }
      const dismissBtn = card.querySelector(".notification-dismiss-btn");
      if (dismissBtn) {
        dismissBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.dismiss(config.id);
        });
      }
      card.addEventListener("click", () => {
        if (config.actionCallback) {
          config.actionCallback();
          this.dismiss(config.id);
        }
      });
      if (config.dismissible !== false) {
        this.setupSwipeHandlers(card, config.id);
      }
    }
    /**
     * Set up swipe-to-dismiss handlers
     */
    setupSwipeHandlers(card, id) {
      card.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];
        if (!touch) return;
        this.swipeState.startX = touch.clientX;
        this.swipeState.startY = touch.clientY;
        this.swipeState.currentX = touch.clientX;
        this.swipeState.isDragging = false;
        this.swipeState.targetId = id;
      }, { passive: true });
      card.addEventListener("touchmove", (e) => {
        if (this.swipeState.targetId !== id) return;
        const touch = e.touches[0];
        if (!touch) return;
        const deltaX = touch.clientX - this.swipeState.startX;
        const deltaY = Math.abs(touch.clientY - this.swipeState.startY);
        if (deltaX > 10 && deltaY < 30) {
          this.swipeState.isDragging = true;
          this.swipeState.currentX = touch.clientX;
          card.classList.add("swiping");
          card.style.transform = `translateX(${Math.max(0, deltaX)}px)`;
          card.style.opacity = String(1 - deltaX / (this.SWIPE_THRESHOLD * 2));
        }
      }, { passive: true });
      card.addEventListener("touchend", () => {
        if (this.swipeState.targetId !== id) return;
        const deltaX = this.swipeState.currentX - this.swipeState.startX;
        card.classList.remove("swiping");
        if (this.swipeState.isDragging && deltaX > this.SWIPE_THRESHOLD) {
          this.dismiss(id);
        } else {
          card.style.transform = "";
          card.style.opacity = "";
        }
        this.swipeState.isDragging = false;
        this.swipeState.targetId = null;
      });
    }
    /**
     * Update notification element content
     */
    updateNotificationElement(element, config) {
      const titleEl = element.querySelector(".notification-title");
      const messageEl = element.querySelector(".notification-message");
      const timeEl = element.querySelector(".notification-time");
      if (titleEl) titleEl.textContent = config.title;
      if (messageEl) messageEl.textContent = config.message;
      if (timeEl) timeEl.textContent = this.formatTime(config.timestamp);
      const colors = PRIORITY_COLORS[config.priority];
      element.style.background = colors.bg;
      element.style.borderColor = colors.border;
      element.style.boxShadow = `0 4px 20px ${colors.glow}`;
    }
    /**
     * Remove notification from DOM and storage
     */
    removeNotification(id) {
      const element = this.notificationElements.get(id);
      if (element) {
        element.remove();
        this.notificationElements.delete(id);
      }
      this.notifications.delete(id);
      this.updateStackDisplay();
      this.eventBus.emit("notification:dismissed", { id });
    }
    /**
     * Update visual stacking of notifications
     */
    updateStackDisplay() {
      const count = this.notifications.size;
      let clearAllBtn = this.railElement.querySelector(".notification-clear-all");
      if (count > 1 && !clearAllBtn) {
        clearAllBtn = document.createElement("button");
        clearAllBtn.className = "notification-clear-all";
        clearAllBtn.innerHTML = "🧹 Clear All";
        clearAllBtn.addEventListener("click", () => this.clearAll());
        this.railElement.appendChild(clearAllBtn);
      } else if (count <= 1 && clearAllBtn) {
        clearAllBtn.remove();
      }
    }
    /**
     * Format timestamp to relative time
     */
    formatTime(timestamp) {
      const diff = Date.now() - timestamp;
      const seconds = Math.floor(diff / 1e3);
      const minutes = Math.floor(seconds / 60);
      if (seconds < 5) return "now";
      if (seconds < 60) return `${seconds}s`;
      if (minutes < 60) return `${minutes}m`;
      return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }
  }
  console.log("🌉 UV7 System Bridge initializing...");
  const UV7System = {
    EventBus,
    StatusBar,
    NotificationRail,
    // Factory to easily create a standalone status bar
    createStatusBar: (_containerId, context = "showcase") => {
      console.log(`🏗️ Creating StatusBar for ${context}`);
      const eventBus = new EventBus();
      const statusBar = new StatusBar(eventBus, void 0, {
        // We can pass initial config here if needed
      });
      const notificationRail = new NotificationRail(eventBus);
      return {
        instance: statusBar,
        eventBus,
        notificationRail
      };
    }
  };
  window.UV7System = UV7System;
  console.log("✅ UV7 System Bridge ready.");
  const script = document.createElement("script");
  script.src = "./uv7-app-switcher.js";
  script.async = true;
  document.head.appendChild(script);
  const appSwitcherReady = new Promise((resolve) => {
    script.onload = () => {
      const checkReady = setInterval(() => {
        if (typeof window.UV7AppSwitcher !== "undefined") {
          clearInterval(checkReady);
          const switcher = new window.UV7AppSwitcher();
          resolve(switcher);
        }
      }, 50);
    };
  });
  async function initializeAppSwitcher() {
    return appSwitcherReady;
  }
  const UV7AppSwitcher = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    appSwitcherReady,
    initializeAppSwitcher
  }, Symbol.toStringTag, { value: "Module" }));
})();
//# sourceMappingURL=uv7-system-bridge.js.map
