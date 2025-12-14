// ========================================
// DEV CONSOLE MODULE
// In-game debugging terminal for mobile testing
// Accessible via OPENCONSOLE secret code
// ========================================

const DevConsole = (() => {
    let game = null;
    let overlay, input, log, closeBtn, minimizeBtn, floatBtn;
    let isOpen = false;
    let isMinimized = false;
    let commandHistory = [];
    let historyIndex = -1;

    function init(gameEngine) {
        game = gameEngine;
        overlay = document.getElementById('dev-console-overlay');
        input = document.getElementById('dev-console-input');
        log = document.getElementById('dev-console-log');
        closeBtn = document.getElementById('dev-console-close');
        minimizeBtn = document.getElementById('dev-console-minimize');
        floatBtn = document.getElementById('dev-console-float');

        if (!overlay || !input || !log || !closeBtn || !minimizeBtn || !floatBtn) {
            console.warn('Dev console elements not found in DOM');
            return;
        }

        closeBtn.addEventListener('click', close);
        minimizeBtn.addEventListener('click', minimize);
        floatBtn.addEventListener('click', maximize);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                if (cmd) {
                    appendLog(`> ${cmd}`, 'user');
                    commandHistory.push(cmd);
                    historyIndex = commandHistory.length;
                    runCommand(cmd);
                    input.value = '';
                }
            } else if (e.key === 'Escape') {
                close();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    input.value = commandHistory[historyIndex] || '';
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    input.value = commandHistory[historyIndex] || '';
                } else {
                    historyIndex = commandHistory.length;
                    input.value = '';
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!isOpen) return;
            if (e.key === 'Escape') {
                close();
            }
        });

        // Intercept console methods to show in dev console
        interceptConsoleLogs();

        console.log('🖥️ Dev console initialized');
    }

    function interceptConsoleLogs() {
        // Store original console methods
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        // Helper for circular JSON handling
        const safeStringify = (obj) => {
            const seen = new WeakSet();
            return JSON.stringify(obj, (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) {
                        return '[Circular]';
                    }
                    seen.add(value);
                }
                return value;
            }, 2);
        };

        // Override console.log
        console.log = function (...args) {
            const message = args.map(arg =>
                typeof arg === 'object' ? safeStringify(arg) : String(arg)
            ).join(' ');
            appendLog(message, 'log');
            originalLog.apply(console, args);
        };

        // Override console.warn
        console.warn = function (...args) {
            const message = args.map(arg =>
                typeof arg === 'object' ? safeStringify(arg) : String(arg)
            ).join(' ');
            appendLog('⚠️ ' + message, 'warn');
            originalWarn.apply(console, args);
        };

        // Override console.error
        console.error = function (...args) {
            const message = args.map(arg =>
                typeof arg === 'object' ? safeStringify(arg) : String(arg)
            ).join(' ');
            appendLog('❌ ' + message, 'error');
            originalError.apply(console, args);
        };
    }

    function open() {
        if (!overlay) return;
        overlay.classList.remove('hidden');
        isOpen = true;
        input.focus();
        appendLog('═══════════════════════════════════════════════', 'system');
        appendLog('DEV CONSOLE v1.0 - Type "help" for commands', 'system');
        appendLog('═══════════════════════════════════════════════', 'system');
        console.log('🖥️ Dev console opened');
    }

    function close() {
        if (!overlay || !floatBtn) return;
        overlay.classList.add('hidden');
        floatBtn.classList.add('hidden');
        isOpen = false;
        isMinimized = false;
        console.log('🖥️ Dev console closed');
    }

    function minimize() {
        if (!overlay || !floatBtn) return;
        overlay.classList.add('hidden');
        floatBtn.classList.remove('hidden');
        isMinimized = true;
        console.log('🖥️ Dev console minimized');
    }

    function maximize() {
        if (!overlay || !floatBtn) return;
        overlay.classList.remove('hidden');
        floatBtn.classList.add('hidden');
        isMinimized = false;
        input.focus();
        console.log('🖥️ Dev console maximized');
    }

    function appendLog(text, type = 'system') {
        if (!log) return;
        const line = document.createElement('div');
        line.className = `dev-console-log-entry ${type}`;
        line.textContent = text;
        log.appendChild(line);
        log.scrollTop = log.scrollHeight;
    }

    function runCommand(raw) {
        const [cmd, ...args] = raw.split(/\s+/);
        const lower = cmd.toLowerCase();

        try {
            switch (lower) {
                case 'help':
                    appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
                    appendLog('AVAILABLE COMMANDS:', 'system');
                    appendLog('  help              - Show this command list', 'system');
                    appendLog('  route [name]      - Check/switch route (tori/ronnie)', 'system');
                    appendLog('  act [number]      - Jump to act (1/2/3)', 'system');
                    appendLog('  scene             - Show current scene info', 'system');
                    appendLog('  tether [0-100]    - Check/set tether level', 'system');
                    appendLog('  difficulty [name] - Check/set difficulty', 'system');
                    appendLog('  flags             - Dump internal game flags', 'system');
                    appendLog('  notes             - Show notes status', 'system');
                    appendLog('  codes             - Show discovered codes', 'system');
                    appendLog('  save [slot]       - Save to slot (1-5)', 'system');
                    appendLog('  load [slot]       - Load from slot (1-5)', 'system');
                    appendLog('  timemachine       - Inspect Time Machine snapshots', 'system');
                    appendLog('  tm                - Alias for timemachine', 'system');
                    appendLog('  jump [id]         - Jump to snapshot by ID', 'system');
                    appendLog('  sensory           - Show last 20 sensory events', 'system');
                    appendLog('  clear             - Clear console log', 'system');
                    appendLog('  reload            - Hard refresh page', 'system');
                    appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
                    break;

                case 'route':
                    if (!args[0]) {
                        const routeName = game?.currentRoute?.name || game?.currentRoute?.constructor?.name || 'unknown';
                        appendLog(`Current route: ${routeName}`, 'system');
                    } else {
                        const route = args[0].toLowerCase();
                        if (route === 'tori' || route === 'ronnie') {
                            game?.loadRoute?.(route);
                            appendLog(`✓ Switched to ${route} route`, 'success');
                        } else {
                            appendLog('Error: Route must be "tori" or "ronnie"', 'error');
                        }
                    }
                    break;

                case 'act':
                    if (!args[0]) {
                        const act = game?.currentRoute?.currentAct || game?.currentRoute?.act || '?';
                        appendLog(`Current act: ${act}`, 'system');
                    } else {
                        const actNum = parseInt(args[0], 10);
                        if (Number.isNaN(actNum) || actNum < 1 || actNum > 3) {
                            appendLog('Error: Act must be 1, 2, or 3', 'error');
                        } else {
                            if (game?.currentRoute?.jumpToAct) {
                                game.currentRoute.jumpToAct(actNum);
                                appendLog(`✓ Jumped to Act ${actNum}`, 'success');
                            } else {
                                appendLog('Error: Current route does not support act jumping', 'error');
                            }
                        }
                    }
                    break;

                case 'scene':
                    const sceneStack = game?.sceneStack || [];
                    const currentScene = sceneStack[sceneStack.length - 1];
                    if (currentScene) {
                        appendLog(`Scene ID: ${currentScene.id || 'unknown'}`, 'system');
                        appendLog(`Speaker: ${currentScene.speaker || 'none'}`, 'system');
                        appendLog(`Text length: ${currentScene.text?.length || 0} chars`, 'system');
                        appendLog(`Has choices: ${currentScene.choices ? 'yes' : 'no'}`, 'system');
                    } else {
                        appendLog('No active scene', 'system');
                    }
                    break;

                case 'tether':
                    if (!args[0]) {
                        const level = game?.tetherSystem?.currentLevel ?? game?.tetherSystem?.getLevel?.() ?? '?';
                        const max = game?.tetherSystem?.maxLevel ?? 100;
                        appendLog(`Tether: ${level}/${max}`, 'system');
                    } else {
                        const val = parseInt(args[0], 10);
                        if (Number.isNaN(val) || val < 0 || val > 100) {
                            appendLog('Error: Tether must be 0-100', 'error');
                        } else {
                            if (game?.tetherSystem?.setLevel) {
                                game.tetherSystem.setLevel(val);
                                appendLog(`✓ Tether set to ${val}`, 'success');
                            } else {
                                appendLog('Error: Tether system not available', 'error');
                            }
                        }
                    }
                    break;

                case 'difficulty':
                    if (!args[0]) {
                        const diff = game?.settingsManager?.getDifficulty?.() || 'unknown';
                        appendLog(`Current difficulty: ${diff}`, 'system');
                    } else {
                        const diff = args[0].toLowerCase();
                        if (['easy', 'normal', 'intense', 'insane'].includes(diff)) {
                            game?.settingsManager?.setDifficulty?.(diff);
                            appendLog(`✓ Difficulty set to ${diff}`, 'success');
                        } else {
                            appendLog('Error: Difficulty must be easy/normal/intense/insane', 'error');
                        }
                    }
                    break;

                case 'flags':
                    const flags = {
                        route: game?.currentRoute?.name || '?',
                        act: game?.currentRoute?.currentAct || '?',
                        difficulty: game?.settingsManager?.getDifficulty?.() || '?',
                        tether: game?.tetherSystem?.currentLevel ?? '?',
                        loop: game?.currentRoute?.loopVersion || '?',
                        skipActive: game?.skipActive || false,
                        autoAdvance: game?.autoAdvanceActive || false
                    };
                    appendLog(JSON.stringify(flags, null, 2), 'system');
                    break;

                case 'notes':
                    const collected = game?.collectiblesManager?.getCollectedCount?.() || 0;
                    const total = game?.collectiblesManager?.getTotalCount?.() || 0;
                    appendLog(`Notes collected: ${collected}/${total}`, 'system');

                    if (game?.collectiblesManager?.collectedNotes) {
                        const notes = game.collectiblesManager.collectedNotes;
                        Object.entries(notes).forEach(([type, ids]) => {
                            if (ids.length > 0) {
                                appendLog(`  ${type}: ${ids.length} (${ids.join(', ')})`, 'system');
                            }
                        });
                    }
                    break;

                case 'codes':
                    const discovered = game?.secretCodesManager?.discoveredCodes || new Set();
                    const count = discovered.size;
                    const max = GameConfig?.CODES?.MAX_DISCOVERED || 12;
                    appendLog(`Codes discovered: ${count}/${max}`, 'system');
                    if (count > 0) {
                        appendLog(`  ${[...discovered].join(', ')}`, 'system');
                    }
                    break;

                case 'save':
                    const saveSlot = parseInt(args[0], 10);
                    if (Number.isNaN(saveSlot) || saveSlot < 1 || saveSlot > 5) {
                        appendLog('Error: Save slot must be 1-5', 'error');
                    } else {
                        if (game?.saveManager?.saveGame) {
                            game.saveManager.saveGame(saveSlot, false);
                            appendLog(`✓ Game saved to slot ${saveSlot}`, 'success');
                        } else {
                            appendLog('Error: Save manager not available', 'error');
                        }
                    }
                    break;

                case 'load':
                    const loadSlot = parseInt(args[0], 10);
                    if (Number.isNaN(loadSlot) || loadSlot < 1 || loadSlot > 5) {
                        appendLog('Error: Load slot must be 1-5', 'error');
                    } else {
                        if (game?.saveManager?.loadGame) {
                            close(); // Close console before loading
                            game.saveManager.loadGame(loadSlot);
                            appendLog(`✓ Loading from slot ${loadSlot}...`, 'success');
                        } else {
                            appendLog('Error: Save manager not available', 'error');
                        }
                    }
                    break;

                case 'clear':
                    if (log) {
                        log.innerHTML = '';
                        appendLog('Console cleared.', 'system');
                    }
                    break;

                case 'reload':
                    appendLog('Reloading page...', 'system');
                    setTimeout(() => location.reload(), 500);
                    break;

                case 'timemachine':
                case 'tm':
                    if (!game?.timeMachine) {
                        appendLog('Error: Time Machine not initialized', 'error');
                        break;
                    }

                    const stats = game.timeMachine.getStats();
                    const entries = game.timeMachine.getEntries();

                    appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
                    appendLog('⏰ TIME MACHINE INSPECTOR', 'system');
                    appendLog(`Total snapshots: ${stats.total}/${stats.max}`, 'system');
                    appendLog(`Locked: ${stats.locked} | Burned: ${stats.burned} | Corrupted: ${stats.corrupted}`, 'system');
                    appendLog(`Anchors: ${stats.anchors}`, 'system');
                    appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');

                    if (entries.length === 0) {
                        appendLog('No snapshots recorded yet', 'system');
                    } else {
                        // Show last 10 snapshots
                        const recent = entries.slice(-10);
                        appendLog(`Showing last ${recent.length} snapshots:`, 'system');

                        recent.forEach(entry => {
                            const flags = [];
                            if (entry.locked) flags.push('🔒');
                            if (entry.burned) flags.push('🔥');
                            if (entry.corrupted) flags.push('⚠️');
                            if (entry.insaneBlocked) flags.push('💀');
                            if (entry.priority === 'anchor') flags.push('⚓');
                            if (entry.priority === 'high') flags.push('⬆️');

                            const flagStr = flags.length > 0 ? ` ${flags.join('')}` : '';
                            const label = entry.label ? `"${entry.label}"` : '(unlabeled)';

                            appendLog(`  #${entry.id} [${entry.priority}]${flagStr} ${label}`, 'system');
                            appendLog(`    → ${entry.routeId}/${entry.sceneId} (page ${entry.pageIndex})`, 'system');
                        });

                        appendLog('', 'system');
                        appendLog('Use "jump [id]" to jump to a snapshot', 'system');
                    }
                    break;

                case 'jump':
                    if (!game?.timeMachine) {
                        appendLog('Error: Time Machine not initialized', 'error');
                        break;
                    }

                    const jumpId = parseInt(args[0], 10);
                    if (Number.isNaN(jumpId)) {
                        appendLog('Error: Must specify snapshot ID (e.g., "jump 5")', 'error');
                        break;
                    }

                    const entry = game.timeMachine.getEntryById(jumpId);
                    if (!entry) {
                        appendLog(`Error: Snapshot #${jumpId} not found`, 'error');
                        break;
                    }

                    const canJump = game.timeMachine.canJumpTo(entry);
                    if (!canJump) {
                        const reason = game.timeMachine.getBlockReason(entry);
                        appendLog(`⚠️ Jump blocked: ${reason}`, 'warn');
                        appendLog('Use "jump [id] force" to bypass rules', 'system');
                        break;
                    }

                    appendLog(`⏰ Jumping to snapshot #${jumpId}...`, 'success');
                    close(); // Close console before jump

                    setTimeout(async () => {
                        const ignoreRules = args[1] === 'force';
                        const success = await game.timeMachine.jumpTo(jumpId, { ignoreRules });
                        if (!success) {
                            console.error('Time jump failed');
                        }
                    }, 300);
                    break;

                case 'sensory':
                    if (!game?.sensoryLog || game.sensoryLog.length === 0) {
                        appendLog('⏱️ No sensory events logged yet', 'system');
                        break;
                    }

                    appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
                    appendLog(`⏱️ SENSORY EVENT LOG (Last ${game.sensoryLog.length} events)`, 'system');
                    appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
                    appendLog('', 'system');

                    const comfortLevel = game.settingsManager?.getComfortIntensity?.() ?? 1;
                    const comfortNames = ['Gentle', 'Normal', 'Amped'];
                    const isInsane = game.gameState?.flags?.insaneModeLocked || false;

                    appendLog(`Current comfort: ${comfortNames[comfortLevel]} | Insane mode: ${isInsane ? 'ACTIVE' : 'Inactive'}`, 'system');
                    appendLog('', 'system');

                    game.sensoryLog.forEach((event, index) => {
                        const timestamp = new Date(event.timestamp).toLocaleTimeString();
                        const channelIcon = event.channel === 'critical' ? '🔥' : event.channel === 'narrative' ? '📖' : '🎮';
                        const scaledIndicator = event.scaled ? `(${event.scaleFactor.toFixed(2)}x)` : '(raw)';

                        appendLog(`${channelIcon} [${timestamp}] ${event.patternName} ${scaledIndicator}`, 'system');
                        if (event.description) {
                            appendLog(`   └─ ${event.description}`, 'system');
                        }
                        appendLog(`   └─ Channel: ${event.channel} | Pattern: [${event.pattern.join(', ')}]ms`, 'system');

                        if (index < game.sensoryLog.length - 1) {
                            appendLog('', 'system');
                        }
                    });

                    appendLog('', 'system');
                    appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'system');
                    break;

                default:
                    appendLog(`Unknown command: ${cmd}`, 'error');
                    appendLog('Type "help" for available commands', 'system');
            }
        } catch (err) {
            appendLog(`Error: ${err.message}`, 'error');
            console.error('Dev console error:', err);
        }
    }

    return {
        init,
        open,
        close,
        minimize,
        maximize,
        runCommand,
        isOpen: () => isOpen,
        isMinimized: () => isMinimized
    };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DevConsole;
}
