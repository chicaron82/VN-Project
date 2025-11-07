// ========================================
// SAVE/LOAD UI CONTROLLER
// Handles all UI interactions for save/load system
// ========================================

class SaveLoadUI {
    constructor(game) {
        this.game = game;
        this.currentMode = 'save'; // 'save' or 'load'
        this.confirmCallback = null;
        
        this.initElements();
        this.setupKeyboardControls();
    }
    
    initElements() {
        this.pauseMenu = document.getElementById('pause-menu');
        this.saveLoadScreen = document.getElementById('save-load-screen');
        this.confirmDialog = document.getElementById('confirm-dialog');
        this.escHint = document.getElementById('esc-hint');
        
        this.saveLoadTitle = document.getElementById('save-load-title');
        this.saveModeBtn = document.getElementById('save-mode-btn');
        this.loadModeBtn = document.getElementById('load-mode-btn');
        
        this.confirmTitle = document.getElementById('confirm-title');
        this.confirmMessage = document.getElementById('confirm-message');
    }
    
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            // ESC key - show/hide pause menu
            if (e.code === 'Escape') {
                if (this.confirmDialog.classList.contains('active')) {
                    // Close confirm dialog
                    this.closeConfirmDialog();
                } else if (this.saveLoadScreen.classList.contains('active')) {
                    // Close save/load screen
                    this.game.closeSaveLoadScreen();
                } else if (this.pauseMenu.classList.contains('active')) {
                    // Close pause menu (resume game)
                    this.game.resumeGame();
                } else if (this.game.gameView.style.display === 'flex') {
                    // In-game, show pause menu
                    this.showPauseMenu();
                }
            }
        });
    }
    
    // ========================================
    // PAUSE MENU
    // ========================================
    
    showPauseMenu() {
        this.pauseMenu.classList.add('active');
    }
    
    hidePauseMenu() {
        this.pauseMenu.classList.remove('active');
    }
    
    // ========================================
    // SAVE/LOAD SCREEN
    // ========================================
    
    showSaveLoadScreen(mode = 'save') {
        this.currentMode = mode;
        this.updateSaveLoadTitle(mode);
        this.updateModeButtons(mode);
        this.refreshSaveSlots();
        
        // Hide pause menu if open
        this.hidePauseMenu();
        
        // Hide main menu if visible (when loading from main menu)
        if (this.game.mainMenu.style.display === 'flex') {
            this.game.mainMenu.style.display = 'none'; // Actually hide it, not just opacity
        }
        
        // Show save/load screen
        this.saveLoadScreen.classList.add('active');
    }
    
    closeSaveLoadScreen() {
        this.saveLoadScreen.classList.remove('active');
        
        // Return to pause menu if game is active
        if (this.game.gameView.style.display === 'flex') {
            this.showPauseMenu();
        }
        // Return to main menu if it was hidden
        else if (this.game.mainMenu.style.opacity === '0' || this.game.mainMenu.style.display === 'none') {
            this.game.mainMenu.style.display = 'flex';
            this.game.mainMenu.style.opacity = '1';
        }
    }
    
    updateSaveLoadTitle(mode) {
        this.saveLoadTitle.textContent = mode === 'save' ? 'SAVE GAME' : 'LOAD GAME';
    }
    
    updateModeButtons(mode) {
        if (mode === 'save') {
            this.saveModeBtn.classList.add('active');
            this.loadModeBtn.classList.remove('active');
        } else {
            this.saveModeBtn.classList.remove('active');
            this.loadModeBtn.classList.add('active');
        }
    }
    
    setSaveLoadMode(mode) {
        this.currentMode = mode;
        this.updateSaveLoadTitle(mode);
        this.updateModeButtons(mode);
        this.refreshSaveSlots();
    }
    
    refreshSaveSlots() {
        // Refresh auto-save slot
        this.refreshSlot('autosave', true);
        
        // Refresh manual slots
        for (let i = 1; i <= 3; i++) {
            this.refreshSlot(i, false);
        }
    }
    
    refreshSlot(slotId, isAutoSave) {
        const slotInfo = isAutoSave 
            ? this.getAutoSaveInfo()
            : this.game.saveManager.getSaveSlotInfo(slotId);
        
        const slotElement = document.getElementById(isAutoSave ? 'slot-autosave' : `slot-${slotId}`);
        const routeElement = document.getElementById(isAutoSave ? 'autosave-route' : `slot-${slotId}-route`);
        const infoElement = document.getElementById(isAutoSave ? 'autosave-info' : `slot-${slotId}-info`);
        const timestampElement = document.getElementById(isAutoSave ? 'autosave-timestamp' : `slot-${slotId}-timestamp`);
        
        if (slotInfo.isEmpty) {
            slotElement.classList.add('empty');
            routeElement.textContent = '---';
            if (!isAutoSave) {
                infoElement.innerHTML = '<div class="save-slot-empty-text">Empty Slot</div>';
            } else {
                timestampElement.textContent = 'No auto-save data';
            }
        } else {
            slotElement.classList.remove('empty');
            routeElement.textContent = slotInfo.routeName === 'ronnie' ? 'Ronnie Route' : 'Tori Route';
            
            const dateStr = slotInfo.timestamp.toLocaleDateString();
            const timeStr = slotInfo.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            if (!isAutoSave) {
                infoElement.innerHTML = `<div class="save-slot-timestamp">${dateStr} ${timeStr}</div>`;
            } else {
                timestampElement.textContent = `${dateStr} ${timeStr}`;
            }
        }
        
        // Show/hide delete button based on mode
        if (!isAutoSave) {
            const deleteBtn = slotElement.querySelector('.save-slot-delete');
            if (deleteBtn) {
                deleteBtn.style.display = (this.currentMode === 'save' && !slotInfo.isEmpty) ? 'block' : 'none';
            }
        }
    }
    
    getAutoSaveInfo() {
        const saveData = this.game.saveManager.loadGame(null, true);
        if (!saveData) {
            return { isEmpty: true };
        }
        
        return {
            isEmpty: false,
            routeName: saveData.routeName,
            timestamp: new Date(saveData.timestamp)
        };
    }
    
    handleSaveSlotClick(slotId) {
        const isAutoSave = slotId === 'autosave';
        
        if (this.currentMode === 'save') {
            // Saving
            if (isAutoSave) {
                // Can't manually save to auto-save slot
                this.game.saveManager.showSaveIndicator('Cannot overwrite auto-save', true);
                return;
            }
            
            // Check if slot has data
            const slotInfo = this.game.saveManager.getSaveSlotInfo(slotId);
            if (!slotInfo.isEmpty) {
                // Confirm overwrite
                this.showConfirmDialog(
                    'Overwrite Save?',
                    `This will overwrite the save in Slot ${slotId}. Continue?`,
                    () => {
                        this.performSave(slotId);
                    }
                );
            } else {
                this.performSave(slotId);
            }
        } else {
            // Loading
            const saveData = isAutoSave 
                ? this.game.saveManager.loadGame(null, true)
                : this.game.saveManager.loadGame(slotId);
            
            if (!saveData) {
                this.game.saveManager.showSaveIndicator('No save data in this slot', true);
                return;
            }
            
            // Confirm load
            this.showConfirmDialog(
                'Load Save?',
                'Loading will overwrite your current progress. Continue?',
                () => {
                    this.performLoad(saveData);
                }
            );
        }
    }
    
    performSave(slotNumber) {
        const success = this.game.saveManager.saveGame(slotNumber, false);
        if (success) {
            this.refreshSaveSlots();
        }
    }
    
    performLoad(saveData) {
        this.closeSaveLoadScreen();
        this.hidePauseMenu();
        this.game.saveManager.restoreGameState(saveData);
    }
    
    deleteSaveSlot(slotNumber) {
        this.showConfirmDialog(
            'Delete Save?',
            `This will permanently delete Slot ${slotNumber}. This cannot be undone.`,
            () => {
                this.game.saveManager.deleteSave(slotNumber);
                this.refreshSaveSlots();
                this.game.saveManager.showSaveIndicator(`Slot ${slotNumber} deleted`);
            }
        );
    }
    
    // ========================================
    // CONFIRMATION DIALOG
    // ========================================
    
    showConfirmDialog(title, message, onConfirm, onCancel = null) {
        this.confirmTitle.textContent = title;
        this.confirmMessage.textContent = message;
        this.confirmCallback = onConfirm;
        this.cancelCallback = onCancel; // New callback for NO button
        this.confirmDialog.classList.add('active');
    }
    
    closeConfirmDialog() {
        this.confirmDialog.classList.remove('active');
        this.confirmCallback = null;
        this.cancelCallback = null;
    }
    
    confirmAction(confirmed) {
        if (confirmed && this.confirmCallback) {
            // YES button clicked - execute confirm callback
            this.confirmCallback();
        } else if (!confirmed && this.cancelCallback) {
            // NO button clicked - execute cancel callback
            this.cancelCallback();
        }
        this.closeConfirmDialog();
    }
    
    // ========================================
    // MAIN MENU
    // ========================================
    
    returnToMainMenu() {
        const goToMainMenu = () => {
            // Return to main menu
            this.hidePauseMenu();
            this.game.gameView.style.display = 'none';
            this.game.mainMenu.style.display = 'flex';
            this.game.mainMenu.style.opacity = '1';
            
            // Hide route-specific UI
            this.game.tetherUI.style.display = 'none';
            this.game.echoDisplay.style.display = 'none';
            this.game.notesButton.style.display = 'none';
            
            // Clear current route
            this.game.currentRoute = null;
        };
        
        this.showConfirmDialog(
            'Return to Menu?',
            'Save your progress before leaving?',
            () => {
                // YES - Auto-save before leaving
                this.game.saveManager.autoSave();
                goToMainMenu();
            },
            () => {
                // NO - Just leave without saving
                goToMainMenu();
            }
        );
    }
    
    // ========================================
    // ESC HINT
    // ========================================
    
    showEscHint() {
        if (this.escHint) {
            this.escHint.classList.add('visible');
        }
    }
    
    hideEscHint() {
        if (this.escHint) {
            this.escHint.classList.remove('visible');
        }
    }
}
