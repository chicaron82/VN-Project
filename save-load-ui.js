// ========================================
// SAVE/LOAD UI CONTROLLER
// Handles all UI interactions for save/load system
// WITH ANDROID BACK BUTTON SUPPORT
// ========================================

class SaveLoadUI {
    constructor(game) {
        this.game = game;
        this.currentMode = 'save'; // 'save' or 'load'
        this.confirmCallback = null;
        
        this.initElements();
        this.setupKeyboardControls();
        this.setupAndroidBackButton();
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
                this.handleBackAction();
            }
        });
    }
    
    // ========================================
    // ANDROID BACK BUTTON SUPPORT
    // ========================================
    
    setupAndroidBackButton() {
        // Method 1: History API (works in most Android browsers/PWAs)
        // Push a dummy state so we can intercept the back button
        this.pushHistoryState();
        
        window.addEventListener('popstate', (e) => {
            // Intercept back navigation
            e.preventDefault();
            
            // Handle back action
            this.handleBackAction();
            
            // Re-push state to keep intercepting
            this.pushHistoryState();
        });
        
        // Method 2: Cordova/Capacitor backbutton event (if running in wrapper)
        document.addEventListener('backbutton', (e) => {
            e.preventDefault();
            this.handleBackAction();
        }, false);
    }
    
    pushHistoryState() {
        // Push a state to history so back button triggers popstate instead of leaving
        if (window.history && window.history.pushState) {
            window.history.pushState({ vnGame: true }, '', window.location.href);
        }
    }
    
    // ========================================
    // UNIFIED BACK ACTION HANDLER
    // Called by ESC key, Android back button, or any "back" trigger
    // ========================================
    
    handleBackAction() {
        console.log('Back action triggered');
        
        // Priority order: Close the most "on top" UI element first
        
        // 1. Confirm dialog is open - close it (same as clicking NO)
        if (this.confirmDialog && this.confirmDialog.classList.contains('active')) {
            console.log('Closing confirm dialog');
            this.confirmAction(false);
            return;
        }
        
        // 2. Notes viewer is open (Tori route) - close it
        const notesViewer = document.getElementById('notes-viewer');
        if (notesViewer && notesViewer.style.display === 'block') {
            console.log('Closing notes viewer');
            notesViewer.style.display = 'none';
            return;
        }
        
        // 3. Save/Load screen is open - close it
        if (this.saveLoadScreen && this.saveLoadScreen.classList.contains('active')) {
            console.log('Closing save/load screen');
            this.game.closeSaveLoadScreen();
            return;
        }
        
        // 4. Pause menu is open - close it (resume game)
        console.log('Checking pause menu:', this.pauseMenu, this.pauseMenu?.classList.contains('active'));
        if (this.pauseMenu && this.pauseMenu.classList.contains('active')) {
            console.log('Closing pause menu and resuming game');
            this.game.resumeGame();
            return;
        }
        
        // 5. Credits screen is open - close it
        const creditsScreen = document.getElementById('credits-screen');
        if (creditsScreen && creditsScreen.style.display === 'flex') {
            console.log('Closing credits');
            this.game.closeCredits();
            return;
        }
        
        // 6. Route selection screen is open - go back to main menu
        const routeSelect = document.getElementById('route-select');
        if (routeSelect && routeSelect.style.display === 'block') {
            console.log('Going back to menu from route select');
            this.game.backToMenu();
            return;
        }
        
        // 7. In-game (game view visible) - open pause menu
        if (this.game.gameView && this.game.gameView.style.display === 'flex') {
            console.log('Opening pause menu from game');
            this.showPauseMenu();
            return;
        }
        
        console.log('Back action: No action taken (at main menu)');
        // 8. Main menu is showing - do nothing (or could show exit confirmation)
        // On Android, pressing back at main menu typically exits the app
        // We'll let the default behavior happen by not preventing it
        // (The history state will be consumed, user presses back again to exit)
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
            
            // Build display with optional label
            const labelHtml = slotInfo.customLabel 
                ? `<div class="save-slot-label">"${slotInfo.customLabel}"</div>` 
                : '';
            
            if (!isAutoSave) {
                infoElement.innerHTML = `${labelHtml}<div class="save-slot-timestamp">${dateStr} ${timeStr}</div>`;
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
                        this.promptForSaveLabel(slotId);
                    }
                );
            } else {
                this.promptForSaveLabel(slotId);
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
    
    promptForSaveLabel(slotNumber) {
        // Show label input dialog
        this.showLabelInputDialog(
            'Name Your Save',
            'Enter a label (optional):',
            (label) => {
                this.performSave(slotNumber, label);
            }
        );
    }
    
    showLabelInputDialog(title, message, onConfirm) {
        // Create or get label dialog
        let labelDialog = document.getElementById('label-input-dialog');
        
        if (!labelDialog) {
            // Create dialog if it doesn't exist
            labelDialog = document.createElement('div');
            labelDialog.id = 'label-input-dialog';
            labelDialog.className = 'label-input-dialog';
            labelDialog.innerHTML = `
                <div class="label-input-content">
                    <h3 id="label-input-title">Name Your Save</h3>
                    <p id="label-input-message">Enter a label (optional):</p>
                    <input type="text" id="label-input-field" maxlength="30" placeholder="e.g., Before big choice...">
                    <div class="label-input-buttons">
                        <button class="label-btn save-btn" id="label-save-btn">SAVE</button>
                        <button class="label-btn skip-btn" id="label-skip-btn">SKIP</button>
                    </div>
                </div>
            `;
            document.body.appendChild(labelDialog);
        }
        
        // Update content
        document.getElementById('label-input-title').textContent = title;
        document.getElementById('label-input-message').textContent = message;
        
        const inputField = document.getElementById('label-input-field');
        inputField.value = '';
        
        // Show dialog
        labelDialog.classList.add('active');
        inputField.focus();
        
        // Setup handlers
        const saveBtn = document.getElementById('label-save-btn');
        const skipBtn = document.getElementById('label-skip-btn');
        
        const cleanup = () => {
            labelDialog.classList.remove('active');
            saveBtn.onclick = null;
            skipBtn.onclick = null;
            inputField.onkeydown = null;
        };
        
        saveBtn.onclick = () => {
            const label = inputField.value.trim() || null;
            cleanup();
            onConfirm(label);
        };
        
        skipBtn.onclick = () => {
            cleanup();
            onConfirm(null);
        };
        
        // Enter key saves, Escape skips
        inputField.onkeydown = (e) => {
            if (e.key === 'Enter') {
                saveBtn.click();
            } else if (e.key === 'Escape') {
                skipBtn.click();
            }
        };
    }
    
    performSave(slotNumber, customLabel = null) {
        const success = this.game.saveManager.saveGame(slotNumber, false, customLabel);
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
            // Echo display removed - now using sprite
            this.game.notesButton.style.display = 'none';
            
            // Stop tether decay if it's running (Tori's route)
            if (this.game.currentRoute && this.game.currentRoute.stopTetherDecay) {
                this.game.currentRoute.stopTetherDecay();
            }
            
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
