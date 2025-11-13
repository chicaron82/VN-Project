// ========================================
// GAME ENGINE - Version 848 (REFACTORED)
// Main game logic and scene management
// Now using GameConfig for all constants
// ========================================

class GameEngine {
    constructor() {
        // DOM Elements
        this.loading = document.getElementById('loading-screen');
        this.loadingBar = document.getElementById('loading-bar');
        this.mainMenu = document.getElementById('main-menu');
        this.gameView = document.getElementById('game-view');
        this.dialogueBox = document.getElementById('dialogue-box');
        this.characterName = document.getElementById('character-name');
        this.dialogueText = document.getElementById('dialogue-text');
        this.internalThought = document.getElementById('internal-thought');
        this.sceneBackground = document.getElementById('scene-background');
        this.choiceMenu = document.getElementById('choice-menu');
        this.choicesContainer = document.getElementById('choices-container');
        
        // Tori Route Elements
        this.tetherUI = document.getElementById('tether-ui');
        this.tetherFill = document.getElementById('tether-fill');
        this.tetherText = document.getElementById('tether-text');
        this.holdOnButton = document.getElementById('hold-on-button');
        this.echoDisplay = document.getElementById('echo-display');
        this.echo1Text = document.getElementById('echo-1-text');
        this.echo2Text = document.getElementById('echo-2-text');
        this.echoDespairText = document.getElementById('echo-despair-text');
        this.notesButton = document.getElementById('notes-button');
        this.notesCount = document.getElementById('notes-count');
        this.notesViewer = document.getElementById('notes-viewer');
        this.notesList = document.getElementById('notes-list');
        this.closeNotesButton = document.getElementById('close-notes');
        
        // State
        this.currentRoute = null;
        this.currentScene = null;
        this.currentSceneId = null;  // Track current scene ID for save/load
        this.typewriterActive = false;
        this.typewriterInterval = null;
        this.typewriterCallback = null;
        this.fullDialogueText = '';
        
        this.gameState = {  // Global state holder
            flags: {},      // For all those filthy flags
            affection: 0,   // Init defaults to kill undefineds
            suspicion: 0,
            flirty: 0,
        // Add any other counters from flags refs (e.g., digital_forever_tilt: 0)
        };
        
        // Initialize save/load system
        this.saveManager = new SaveManager(this);
        this.saveLoadUI = new SaveLoadUI(this);
        
        // Initialize cutscene engine
        this.cutsceneEngine = new CutsceneEngine(this);
        
        this.init();
    }
    
    init() {
        // Preload images using GameConfig
        const imagesToPreload = GameConfig.ASSETS.IMAGES;
        
        let imagesLoaded = 0;
        const totalImages = imagesToPreload.length;
        
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.onload = () => {
                imagesLoaded++;
                const progress = Math.floor((imagesLoaded / totalImages) * 100);
                this.loadingBar.style.width = progress + '%';
                
                if (imagesLoaded === totalImages) {
                    setTimeout(() => {
                        this.loading.style.display = 'none';
                        this.mainMenu.style.display = 'flex';
                        this.mainMenu.style.opacity = '1';
                    }, GameConfig.TIMING.MENU_TRANSITION_MS);
                }
            };
            img.onerror = () => {
                // If image fails to load, still continue
                imagesLoaded++;
                const progress = Math.floor((imagesLoaded / totalImages) * 100);
                this.loadingBar.style.width = progress + '%';
                
                if (imagesLoaded === totalImages) {
                    setTimeout(() => {
                        this.loading.style.display = 'none';
                        this.mainMenu.style.display = 'flex';
                        this.mainMenu.style.opacity = '1';
                    }, GameConfig.TIMING.MENU_TRANSITION_MS);
                }
            };
            img.src = src;
        });
        
        // Event Listeners
        this.holdOnButton.addEventListener('click', () => {
            if (this.currentRoute && this.currentRoute.holdOn) {
                this.currentRoute.holdOn();
            }
        });
        
        this.notesButton.addEventListener('click', () => {
            this.showNotes();
        });
        
        this.closeNotesButton.addEventListener('click', () => {
            this.notesViewer.style.display = 'none';
        });
        
        // Click anywhere to skip typing or advance
        this.dialogueBox.addEventListener('click', () => {
            this.handleDialogueClick();
        });
        
        // Keyboard controls using GameConfig
        document.addEventListener('keydown', (e) => {
            if (GameConfig.CONTROLS.ADVANCE.includes(e.code)) {
                // Don't trigger if typing in input fields
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return;
                }
                // Prevent default scroll behavior for spacebar
                e.preventDefault();
                this.handleDialogueClick();
            }
        });
        
        // Initialize dynamic title system
        this.updateTitleScreen();
    }
    
    // ========================================
    // DYNAMIC TITLE SYSTEM
    // ========================================
    
    updateTitleScreen() {
        // Get current attempt number from localStorage using GameConfig
        const attemptNumber = localStorage.getItem(GameConfig.VERSION.STORAGE_KEY) 
                             || GameConfig.VERSION.DEFAULT_START.toString();
        
        // Update browser tab title
        document.title = `${GameConfig.TITLE.BASE} ${attemptNumber}`;
        
        // Update main menu H1
        const mainMenuTitle = document.querySelector('#main-menu-content h1');
        if (mainMenuTitle) {
            mainMenuTitle.textContent = `${GameConfig.TITLE.BASE.toUpperCase()} ${attemptNumber}`;
        }
    }
    
    incrementAttempt() {
        // Get current attempt, increment, and save using GameConfig
        let attemptNumber = parseInt(localStorage.getItem(GameConfig.VERSION.STORAGE_KEY)) 
                           || GameConfig.VERSION.DEFAULT_START;
        attemptNumber++;
        localStorage.setItem(GameConfig.VERSION.STORAGE_KEY, attemptNumber.toString());
        
        // Update display
        this.updateTitleScreen();
        
        // Return the new number for display in endings
        return attemptNumber;
    }
    
    // ========================================
    // STORY START - PLAYS PROLOGUE FIRST
    // ========================================
    
    startStory() {
        // Fade out main menu
        this.mainMenu.style.opacity = '0';
        
        setTimeout(() => {
            this.mainMenu.style.display = 'none';
            this.gameView.style.display = 'flex';
            this.dialogueBox.style.display = 'block';
            
            // Fade in game view
            setTimeout(() => {
                this.gameView.style.transition = 'opacity 1s';
                this.gameView.style.opacity = '1';
            }, GameConfig.TIMING.MENU_TRANSITION_MS);
            
            // Start shared prologue
            const prologue = new SharedPrologue(this);
            prologue.start();
        }, GameConfig.TIMING.FADE_OUT_MS);
    }
    
    // ========================================
    // ROUTE SELECTION SCREEN
    // ========================================
    
    showRouteSelect() {
        // Fade out game view (after prologue)
        this.gameView.style.opacity = '0';
        
        setTimeout(() => {
            this.gameView.style.display = 'none';
            
            // Show route selection screen
            const routeSelect = document.getElementById('route-select');
            routeSelect.style.display = 'block';
            
            // Fade in
            setTimeout(() => {
                routeSelect.style.opacity = '1';
            }, GameConfig.TIMING.MENU_TRANSITION_MS);
        }, GameConfig.TIMING.FADE_IN_MS);
    }
    
    backToMenu() {
        // Fade out route select
        const routeSelect = document.getElementById('route-select');
        routeSelect.style.opacity = '0';
        
        setTimeout(() => {
            routeSelect.style.display = 'none';
            
            // Show main menu again
            this.mainMenu.style.display = 'flex';
            setTimeout(() => {
                this.mainMenu.style.opacity = '1';
            }, GameConfig.TIMING.MENU_TRANSITION_MS);
        }, GameConfig.TIMING.FADE_IN_MS);
    }
    
    startRoute(routeName) {
        // Fade out route select screen
        const routeSelect = document.getElementById('route-select');
        routeSelect.style.transition = 'opacity 0.8s';
        routeSelect.style.opacity = '0';
        
        setTimeout(() => {
            routeSelect.style.display = 'none';
            this.gameView.style.display = 'flex';
            this.gameView.style.opacity = '0';
            this.dialogueBox.style.display = 'block';
            
            // Fade in gameplay
            setTimeout(() => {
                this.gameView.style.transition = 'opacity 1s';
                this.gameView.style.opacity = '1';
            }, GameConfig.TIMING.MENU_TRANSITION_MS);
            
            if (routeName === GameConfig.ROUTES.RONNIE) {
                this.currentRoute = new RonnieRoute(this);
                // Start Ronnie's route
                if (this.currentRoute.start) {
                    this.currentRoute.start();
                }
            } else if (routeName === GameConfig.ROUTES.TORI) {
                // Show Tori-specific UI
                this.tetherUI.style.display = 'block';
                this.echoDisplay.style.display = 'block';
                this.notesButton.style.display = 'block';
                this.currentRoute = new ToriRoute(this);
                // Start Tori's route (Act 1)
                if (this.currentRoute.start) {
                    this.currentRoute.start();
                }
            }
            
            // Show ESC hint after game starts
            setTimeout(() => {
                this.saveLoadUI.showEscHint();
                setTimeout(() => {
                    this.saveLoadUI.hideEscHint();
                }, GameConfig.TIMING.DELAY_MEDIUM);
            }, GameConfig.TIMING.DELAY_SHORT);
        }, GameConfig.TIMING.FADE_OUT_MS);
    }
    
    // ========================================
    // SCENE DISPLAY
    // ========================================
    
    displayScene(sceneData, sceneId = null) {
        this.currentScene = sceneData;
        
        // Store the current scene's ID for save/load
        if (sceneId) {
            this.currentSceneId = sceneId;
        }
        
        // Update background
        if (sceneData.background) {
            this.sceneBackground.className = sceneData.background;
        }
        
        // Display character name
        this.characterName.textContent = sceneData.character || '';
        
        // Typewriter effect for dialogue
        this.typewriterText(this.dialogueText, sceneData.dialogue || '', () => {
            this.typewriterActive = false;
        });
        
        // Internal thought
        if (sceneData.internal) {
            this.internalThought.textContent = sceneData.internal;
            this.internalThought.style.display = 'block';
        } else {
            this.internalThought.style.display = 'none';
        }
        
        // Update echoes if present
        if (sceneData.echoes) {
            this.echo1Text.textContent = sceneData.echoes.echo1 || '';
            this.echo2Text.textContent = sceneData.echoes.echo2 || '';
            this.echoDespairText.textContent = sceneData.echoes.despair || '';
        }
        
        // Show choices if present
        if (sceneData.choices) {
            this.showChoices(sceneData.choices, sceneData.onChoice, sceneData.context || this.currentRoute);
        }
        
        // Auto-save after scene display
        if (this.saveManager && this.currentRoute) {
            this.saveManager.autoSave();
        }
    }
    
    typewriterText(element, text, callback) {
        this.typewriterActive = true;
        this.fullDialogueText = text;
        this.typewriterCallback = callback;
        element.textContent = '';
        let i = 0;
        
        // Clear any existing interval
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
        }
        
        this.typewriterInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(this.typewriterInterval);
                this.typewriterInterval = null;
                this.typewriterActive = false;
                if (callback) callback();
            }
        }, GameConfig.TIMING.TYPEWRITER_SPEED_MS);
    }
    
    skipTypewriter() {
        // Stop the typing animation and show full text immediately
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }
        
        // Show full text
        this.dialogueText.textContent = this.fullDialogueText;
        this.typewriterActive = false;
        
        // Execute callback if exists
        if (this.typewriterCallback) {
            this.typewriterCallback();
            this.typewriterCallback = null;
        }
    }
    
    handleDialogueClick() {
        // If typing is active, skip to full text
        if (this.typewriterActive) {
            this.skipTypewriter();
        }
        // If text is fully displayed, advance to next scene
        else {
            this.advance();
        }
    }
    
    advance() {
        // Don't advance if choices are showing
        if (this.choiceMenu.style.display === 'block') return;
        
        if (this.currentScene && this.currentScene.next) {
            this.currentScene.next();
        }
    }
    
    showChoices(choices, onChoice, context) {
        this.choicesContainer.innerHTML = '';
        this.choiceMenu.style.display = 'block';
        
        choices.forEach(choice => {
            const button = document.createElement('div');
            button.className = GameConfig.UI.CHOICE_OPTION_CLASS;
            button.textContent = choice.text;
            
            if (choice.locked) {
                button.classList.add(GameConfig.UI.CHOICE_LOCKED_CLASS);
            } else {
                button.addEventListener('click', () => {
                    this.choiceMenu.style.display = 'none';
                    if (onChoice) {
                        // Call with proper context binding
                        if (context) {
                            onChoice.call(context, choice.value);
                        } else {
                            onChoice(choice.value);
                        }
                    }
                });
            }
            
            this.choicesContainer.appendChild(button);
        });
    }
    
    // ========================================
    // NOTES SYSTEM (DELEGATES TO COLLECTIBLES MANAGER)
    // ========================================
    
    showNotes() {
        // Delegate to collectibles manager if available
        if (this.currentRoute && this.currentRoute.collectiblesManager) {
            this.currentRoute.collectiblesManager.showNotesViewer();
            return;
        }
        
        // Fallback to legacy system for backwards compatibility
        if (!this.currentRoute || !this.currentRoute.collectedNotes) return;
        
        this.notesViewer.style.display = 'block';
        this.notesList.innerHTML = '';
        
        const allNotes = this.currentRoute.allNotes;
        const collected = this.currentRoute.collectedNotes;
        
        Object.keys(allNotes).forEach(noteId => {
            const note = allNotes[noteId];
            const isCollected = collected[note.type].includes(noteId);
            
            const noteItem = document.createElement('div');
            noteItem.className = `${GameConfig.UI.NOTE_ITEM_CLASS} ${note.type}-note`;
            if (!isCollected) noteItem.classList.add(GameConfig.UI.NOTE_LOCKED_CLASS);
            
            const title = document.createElement('div');
            title.className = 'note-title';
            title.textContent = isCollected ? note.title : '???';
            noteItem.appendChild(title);
            
            if (isCollected) {
                const content = document.createElement('div');
                content.className = 'note-content';
                content.textContent = note.content;
                noteItem.appendChild(content);
                
                noteItem.addEventListener('click', () => {
                    noteItem.classList.toggle(GameConfig.UI.NOTE_EXPANDED_CLASS);
                });
            }
            
            this.notesList.appendChild(noteItem);
        });
    }
    
    // ========================================
    // CREDITS
    // ========================================
    
    showCredits() {
        if (GameConfig.DEBUG.ENABLED) {
            console.log('ShowCredits: Starting flash & hold sequence...');
        }
        
        // Hide main menu if showing
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            mainMenu.classList.remove(GameConfig.UI.PAUSE_ACTIVE_CLASS);
            mainMenu.style.display = 'none';
        }
        
        // Show credits screen
        const creditsScreen = document.getElementById('credits-screen');
        if (creditsScreen) {
            creditsScreen.classList.add(GameConfig.UI.PAUSE_ACTIVE_CLASS);
            
            // Reset to first screen using GameConfig
            this.currentCreditIndex = GameConfig.CREDITS.INITIAL_INDEX;
            this.totalCredits = GameConfig.CREDITS.TOTAL_SCREENS;
            
            // Show first screen
            this.showCreditScreen(0);
            
            // Change NEXT button to BACK TO MENU on last screen
            this.updateNextButton();
        } else {
            console.error('ShowCredits: Credits screen element not found!');
        }
    }

    showCreditScreen(index) {
        if (GameConfig.DEBUG.ENABLED) {
            console.log(`Showing credit screen ${index}`);
        }
        
        // Hide all screens
        const allScreens = document.querySelectorAll('.credit-screen');
        allScreens.forEach(screen => {
            screen.classList.remove(GameConfig.UI.PAUSE_ACTIVE_CLASS);
            screen.classList.add('fade-out');
        });
        
        // Show target screen after brief delay for fade
        setTimeout(() => {
            allScreens.forEach(screen => screen.classList.remove('fade-out'));
            
            const targetScreen = document.getElementById(`credit-${index}`);
            if (targetScreen) {
                targetScreen.classList.add(GameConfig.UI.PAUSE_ACTIVE_CLASS);
            }
        }, GameConfig.TIMING.CREDIT_SCREEN_FADE_MS);
        
        // Update button text
        this.updateNextButton();
    }

    updateNextButton() {
        const nextButton = document.getElementById('next-credits');
        if (nextButton) {
            if (this.currentCreditIndex >= this.totalCredits - 1) {
                nextButton.textContent = 'BACK TO MENU';
            } else {
                nextButton.textContent = 'NEXT >';
            }
        }
    }

    nextCredit() {
        if (GameConfig.DEBUG.ENABLED) {
            console.log(`NextCredit: Current index ${this.currentCreditIndex}`);
        }
        
        if (this.currentCreditIndex >= this.totalCredits - 1) {
            // Last screen - go back to menu
            this.closeCredits();
        } else {
            // Advance to next screen
            this.currentCreditIndex++;
            this.showCreditScreen(this.currentCreditIndex);
        }
    }

    closeCredits() {
        if (GameConfig.DEBUG.ENABLED) {
            console.log('CloseCredits: Closing...');
        }
        
        const creditsScreen = document.getElementById('credits-screen');
        if (creditsScreen) {
            creditsScreen.classList.remove(GameConfig.UI.PAUSE_ACTIVE_CLASS);
        }
        
        // Reset index
        this.currentCreditIndex = GameConfig.CREDITS.INITIAL_INDEX;
        
        // Return to main menu
        this.mainMenu.style.display = 'flex';
        setTimeout(() => {
            this.mainMenu.style.opacity = '1';
        }, GameConfig.TIMING.MENU_TRANSITION_MS);
    }
    
    // ========================================
    // SAVE/LOAD SYSTEM METHODS
    // ========================================
    
    resumeGame() {
        this.saveLoadUI.hidePauseMenu();
    }
    
    showSaveLoadScreen(mode) {
        this.saveLoadUI.showSaveLoadScreen(mode);
    }
    
    closeSaveLoadScreen() {
        this.saveLoadUI.closeSaveLoadScreen();
    }
    
    setSaveLoadMode(mode) {
        this.saveLoadUI.setSaveLoadMode(mode);
    }
    
    handleSaveSlotClick(slotId) {
        this.saveLoadUI.handleSaveSlotClick(slotId);
    }
    
    deleteSaveSlot(slotNumber) {
        this.saveLoadUI.deleteSaveSlot(slotNumber);
    }
    
    confirmAction(confirmed) {
        this.saveLoadUI.confirmAction(confirmed);
    }
    
    returnToMainMenu() {
        this.saveLoadUI.returnToMainMenu();
    }
    
    continueGame() {
        const mostRecent = this.saveManager.getMostRecentSave();
        if (mostRecent) {
            this.saveManager.restoreGameState(mostRecent.data);
        } else {
            this.saveManager.showSaveIndicator('No save data found', true);
        }
    }
}
