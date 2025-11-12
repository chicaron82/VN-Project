// ========================================
// GAME ENGINE - Version 848
// Main game logic and scene management
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
        // Preload images
        const imagesToPreload = [
            'menudesktop.png',
            'menumobile.png',
            'desktopVersion.png'
        ];
        
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
                    }, 300);
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
                    }, 300);
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
        
        // Keyboard controls (Spacebar or Enter)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
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
        // Get current attempt number from localStorage (defaults to 848)
        const attemptNumber = localStorage.getItem('attemptNumber') || '848';
        
        // Update browser tab title
        document.title = `Version ${attemptNumber}`;
        
        // Update main menu H1
        const mainMenuTitle = document.querySelector('#main-menu-content h1');
        if (mainMenuTitle) {
            mainMenuTitle.textContent = `VERSION ${attemptNumber}`;
        }
    }
    
    incrementAttempt() {
        // Get current attempt, increment, and save
        let attemptNumber = parseInt(localStorage.getItem('attemptNumber')) || 848;
        attemptNumber++;
        localStorage.setItem('attemptNumber', attemptNumber.toString());
        
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
            }, 100);
            
            // Start shared prologue
            const prologue = new SharedPrologue(this);
            prologue.start();
        }, 800);
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
            }, 100);
        }, 1000);
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
            }, 100);
        }, 1000);
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
            }, 100);
            
            if (routeName === 'ronnie') {
                this.currentRoute = new RonnieRoute(this);
                // Start Ronnie's route (will be changed to use start() method)
                if (this.currentRoute.start) {
                    this.currentRoute.start();
                }
            } else if (routeName === 'tori') {
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
                }, 3000);
            }, 2000);
        }, 800);
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
        }, 30);
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
            button.className = 'choice-option';
            button.textContent = choice.text;
            
            if (choice.locked) {
                button.classList.add('locked');
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
    // NOTES SYSTEM
    // ========================================
    
    showNotes() {
        if (!this.currentRoute || !this.currentRoute.collectedNotes) return;
        
        this.notesViewer.style.display = 'block';
        this.notesList.innerHTML = '';
        
        const allNotes = this.currentRoute.allNotes;
        const collected = this.currentRoute.collectedNotes;
        
        Object.keys(allNotes).forEach(noteId => {
            const note = allNotes[noteId];
            const isCollected = collected[note.type].includes(noteId);
            
            const noteItem = document.createElement('div');
            noteItem.className = `note-item ${note.type}-note`;
            if (!isCollected) noteItem.classList.add('note-locked');
            
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
                    noteItem.classList.toggle('expanded');
                });
            }
            
            this.notesList.appendChild(noteItem);
        });
    }
    
    // ========================================
    // CREDITS
    // ========================================
    
    showCredits() {
        console.log('ShowCredits: Starting flash & hold sequence...');
        
        // Hide main menu if showing
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            mainMenu.classList.remove('active');
            mainMenu.style.display = 'none';
        }
        
        // Show credits screen
        const creditsScreen = document.getElementById('credits-screen');
        if (creditsScreen) {
            creditsScreen.classList.add('active');
            
            // Reset to first screen
            this.currentCreditIndex = 0;
            this.totalCredits = 13; // Total number of credit screens
            
            // Show first screen
            this.showCreditScreen(0);
            
            // Change NEXT button to BACK TO MENU on last screen
            this.updateNextButton();
        } else {
            console.error('ShowCredits: Credits screen element not found!');
        }
    }

    showCreditScreen(index) {
        console.log(`Showing credit screen ${index}`);
        
        // Hide all screens
        const allScreens = document.querySelectorAll('.credit-screen');
        allScreens.forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('fade-out');
        });
        
        // Show target screen after brief delay for fade
        setTimeout(() => {
            allScreens.forEach(screen => screen.classList.remove('fade-out'));
            
            const targetScreen = document.getElementById(`credit-${index}`);
            if (targetScreen) {
                targetScreen.classList.add('active');
            }
        }, 100);
        
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
        console.log(`NextCredit: Current index ${this.currentCreditIndex}`);
        
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
        console.log('CloseCredits: Closing...');
        const creditsScreen = document.getElementById('credits-screen');
        if (creditsScreen) {
            creditsScreen.classList.remove('active');
        }
        
        // Reset index
        this.currentCreditIndex = 0;
        
        // Return to main menu
        this.mainMenu.style.display = 'flex';
        setTimeout(() => {
            this.mainMenu.style.opacity = '1';
        }, 100);
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
