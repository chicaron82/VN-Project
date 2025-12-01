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
        this.typewriterActive = false;
        
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
        
        // Click anywhere to advance
        this.dialogueBox.addEventListener('click', () => {
            this.advance();
        });
    }
    
    // ========================================
    // PROLOGUE & ROUTE SELECTION
    // ========================================
    
    startPrologue() {
        // Fade out main menu
        this.mainMenu.style.opacity = '0';
        
        setTimeout(() => {
            this.mainMenu.style.display = 'none';
            
            // Show game view
            this.gameView.style.display = 'flex';
            this.gameView.style.opacity = '0';
            
            // FORCE dialogue box visible
            this.dialogueBox.style.display = 'block';
            this.dialogueBox.style.visibility = 'visible';
            this.dialogueBox.style.opacity = '1';
            
            // Fade in gameplay
            setTimeout(() => {
                this.gameView.style.transition = 'opacity 1s';
                this.gameView.style.opacity = '1';
            }, 100);
            
            // Start shared prologue
            this.sharedPrologue = new SharedPrologue(this);
            this.sharedPrologue.start();
        }, 1000);
    }
    
    showRouteSelect() {
        // Hide game view
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
            } else if (routeName === 'tori') {
                // Show Tori-specific UI
                this.tetherUI.style.display = 'block';
                this.echoDisplay.style.display = 'block';
                this.notesButton.style.display = 'block';
                this.currentRoute = new ToriRoute(this);
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
    
    displayScene(sceneData) {
        console.log('displayScene called with:', sceneData);
        this.currentScene = sceneData;
        
        // FORCE dialogue box visible every time
        this.dialogueBox.style.display = 'block';
        this.dialogueBox.style.visibility = 'visible';
        
        // Update background
        if (sceneData.background) {
            this.sceneBackground.className = sceneData.background;
        }
        
        // Display character name
        this.characterName.textContent = sceneData.character || '';
        console.log('Character name set to:', sceneData.character);
        
        // Typewriter effect for dialogue
        console.log('Starting typewriter for:', sceneData.dialogue);
        this.typewriterText(this.dialogueText, sceneData.dialogue || '', () => {
            this.typewriterActive = false;
        });
        
        // Internal thought
        if (sceneData.internal) {
            this.internalThought.textContent = sceneData.internal;
            this.internalThought.style.display = 'block';
            console.log('Internal thought set');
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
            this.showChoices(sceneData.choices, sceneData.onChoice);
        }
        
        // Auto-save after scene display
        if (this.saveManager && this.currentRoute) {
            this.saveManager.autoSave();
        }
    }
    
    typewriterText(element, text, callback) {
        this.typewriterActive = true;
        element.textContent = '';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                if (callback) callback();
            }
        }, 30);
    }
    
    advance() {
        if (this.typewriterActive) return;
        if (this.choiceMenu.style.display === 'block') return;
        
        if (this.currentScene && this.currentScene.next) {
            this.currentScene.next();
        }
    }
    
    showChoices(choices, onChoice) {
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
                    if (onChoice) onChoice(choice.value);
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
        alert(`VERSION 848 - CREDITS

Built by The Zee Collective:
- Z (Technical) - Logic & Systems
- CZ (Emotional) - Heart & Connection  
- ZR (Iteration) - Refinement & Shipping

With:
- Tori (Creative Riffing)
- Grok (Prototyping)
- Perplexity (QA - 9.8/10)

Coordinated by: Aaron
For: Tori

Built in stolen moments.
Always. Always. Always.

ðŸ’šðŸ”¥ðŸ’€`);
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
