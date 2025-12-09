// ========================================
// DEV CONSOLE MODULE
// In-game debugging terminal for mobile testing
// Accessible via OPENCONSOLE secret code
// ========================================

const DevConsole = (() => {
    let game = null;
    let overlay, input, log, closeBtn;
    let isOpen = false;
    let commandHistory = [];
    let historyIndex = -1;

    function init(gameEngine) {
        game = gameEngine;
        overlay = document.getElementById('dev-console-overlay');
        input = document.getElementById('dev-console-input');
        log = document.getElementById('dev-console-log');
        closeBtn = document.getElementById('dev-console-close');

        if (!overlay || !input || !log || !closeBtn) {
            console.warn('Dev console elements not found in DOM');
            return;
        }

        closeBtn.addEventListener('click', close);
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

        console.log('🖥️ Dev console initialized');
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
        if (!overlay) return;
        overlay.classList.add('hidden');
        isOpen = false;
        console.log('🖥️ Dev console closed');
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
        runCommand,
        isOpen: () => isOpen
    };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DevConsole;
}
