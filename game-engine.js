// ========================================
// GAME ENGINE - Version 848.2
// Main game logic and scene management
// WITH MOBILE DIALOGUE PAGINATION
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
        this.typewriterInterval = null;
        this.typewriterCallback = null;
        this.fullDialogueText = '';
        
        // Pagination state (NEW - Version 848.2)
        this.dialoguePages = [];
        this.currentDialoguePage = 0;
        this.paginationActive = false;
        
        // Game state for tracking choices, flags, and progress
        this.gameState = {
            flags: {},
            choices: {},
            progress: {}
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
            } else if (routeName === 'tori') {
                // Show Tori-specific UI
                this.tetherUI.style.display = 'block';
                this.echoDisplay.style.display = 'block';
                this.notesButton.style.display = 'block';
                this.currentRoute = new ToriRoute(this);
                this.currentRoute.start(); // Start Tori's route (Act 1)
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
    // BACKGROUND MANAGER
    // ========================================
    
    setBackground(backgroundName) {
        if (!backgroundName) {
            return;
        }
        
        // Fade out current background
        this.sceneBackground.style.opacity = '0';
        
        setTimeout(() => {
            // Set new background image
            this.sceneBackground.style.backgroundImage = `url('${backgroundName}')`;
            this.sceneBackground.style.backgroundSize = 'cover';
            this.sceneBackground.style.backgroundPosition = 'center';
            this.sceneBackground.style.backgroundRepeat = 'no-repeat';
            
            // Fade in new background
            this.sceneBackground.style.opacity = '1';
        }, 500);
    }
    
        // ========================================
    // SPRITE MANAGEMENT SYSTEM
    // ========================================
    
    showSprite(position, spriteName) {
        // position: 'left' or 'right'
        // spriteName: 'tori-sprite.png', 'ronnie-sprite.png', 'three-echoes-sprite.png'
        
        const container = position === 'left' ? this.spriteLeft : this.spriteRight;
        if (!container) return;
        
        // Set sprite and ensure visibility
        container.style.backgroundImage = `url('${spriteName}')`;
        container.style.display = 'block';
        container.style.opacity = '1';
        container.style.visibility = 'visible';
        
        // Remove any dimming/exit classes
        container.classList.remove('sprite-dim', 'sprite-exit');
        
        // Add entrance animation
        container.classList.add('sprite-enter');
        
        setTimeout(() => {
            container.classList.remove('sprite-enter');
        }, 500);
        
        // Track current sprite
        this.currentSprites[position] = spriteName;
    }
    
    hideSprite(position) {
        const container = position === 'left' ? this.spriteLeft : this.spriteRight;
        if (!container) return;
        
        // Fade out animation
        container.classList.add('sprite-exit');
        
        setTimeout(() => {
            container.style.display = 'none';
            container.style.backgroundImage = '';
            container.classList.remove('sprite-exit', 'sprite-dim');
            this.currentSprites[position] = null;
        }, 500);
    }
    
    clearAllSprites() {
        this.hideSprite('left');
        this.hideSprite('right');
    }
    
    highlightActiveSprite(characterName) {
        // Determine which sprite should be highlighted based on character name
        let activePosition = null;
        
        // Map character names to positions
        if (characterName === 'Tori' || characterName.includes('Tori')) {
            // Tori usually on right (convention)
            activePosition = this.currentSprites.right ? 'right' : 
                            this.currentSprites.left ? 'left' : null;
        } else if (characterName === 'Ronnie' || characterName.includes('Ronnie')) {
            // Ronnie usually on left
            activePosition = this.currentSprites.left ? 'left' : 
                            this.currentSprites.right ? 'right' : null;
        }
        
        if (activePosition) {
            // Highlight active, dim inactive
            if (activePosition === 'left') {
                this.spriteLeft.classList.remove('sprite-dim');
                if (this.spriteRight.style.display === 'block') {
                    this.spriteRight.classList.add('sprite-dim');
                }
            } else {
                this.spriteRight.classList.remove('sprite-dim');
                if (this.spriteLeft.style.display === 'block') {
                    this.spriteLeft.classList.add('sprite-dim');
                }
            }
        }
    }
    
    // ========================================
    // SPECIAL EFFECTS - SPRITE TRANSITIONS
    // ========================================
    
    /**
     * Fade between two sprites (for Tori's consciousness flicker)
     * Shows sprite1 → fades to sprite2 → fades back to sprite1
     * Used in prologue when Tori sees Old Ronnie briefly
     */
    fadeSpritesSequence(position, sprite1, sprite2, duration = 4000) {
        const container = position === 'left' ? this.spriteLeft : this.spriteRight;
        if (!container) return;
        
        // Start with sprite1 (young Ronnie)
        container.style.backgroundImage = `url('${sprite1}')`;
        container.style.display = 'block';
        container.style.opacity = '1';
        
        const timing = duration / 4; // Split into 4 phases
        
        // Phase 1: Fade out sprite1
        setTimeout(() => {
            container.style.transition = 'opacity 0.8s ease';
            container.style.opacity = '0.2';
        }, timing);
        
        // Phase 2: Switch to sprite2 (Old Man) at lowest opacity
        setTimeout(() => {
            container.style.backgroundImage = `url('${sprite2}')`;
            container.style.opacity = '1';
        }, timing * 1.8);
        
        // Phase 3: Hold Old Man briefly, then fade
        setTimeout(() => {
            container.style.opacity = '0.2';
        }, timing * 2.8);
        
        // Phase 4: Switch back to sprite1 (young Ronnie) and restore visibility
        setTimeout(() => {
            container.style.backgroundImage = `url('${sprite1}')`;
            container.style.opacity = '1';
            container.style.transition = 'opacity 0.6s ease';
        }, timing * 3.5);
        
        // Stay visible - don't fade to black
        // Sprite persists for rest of scene
    }
    
    // ========================================
    // SCENE DISPLAY
    // ========================================
    
    displayScene(sceneData) {
        this.currentScene = sceneData;
        
        // Update background (supports both image files and CSS classes)
        if (sceneData.background) {
            if (sceneData.background.endsWith('.png') || sceneData.background.endsWith('.jpg')) {
                // Image background
                this.setBackground(sceneData.background);
            } else {
                // CSS class background (legacy support)
                this.sceneBackground.className = sceneData.background;
            }
        }
        
        // Display character name
        this.characterName.textContent = sceneData.character || '';
        
        // Typewriter effect for dialogue (with pagination support)
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
            this.showChoices(sceneData.choices, sceneData.onChoice);
        }
        
        // Auto-save after scene display
        if (this.saveManager && this.currentRoute) {
            this.saveManager.autoSave();
        }
    }
    
    // ========================================
    // TYPEWRITER SYSTEM WITH PAGINATION
    // Version 848.2 - Mobile-friendly text handling
    // ========================================
    
    typewriterText(element, text, callback) {
        // Check if text needs pagination on mobile
        if (this.shouldPaginateText(text)) {
            this.paginateAndDisplayText(element, text, callback);
        } else {
            // Original typewriter behavior for desktop/short text
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
    }
    
    shouldPaginateText(text) {
        // Only paginate on mobile portrait
        if (window.innerWidth > 480) return false;
        if (window.innerHeight < window.innerWidth) return false; // Landscape - no pagination
        
        // Check if text is longer than mobile-safe threshold
        // ~200 characters fits comfortably in 260px box with font-size 0.85rem
        return text.length > 200;
    }
    
    paginateAndDisplayText(element, text, callback) {
        // Split text into pages that fit in mobile dialogue box
        this.dialoguePages = this.splitTextIntoPages(text, 200);
        this.currentDialoguePage = 0;
        this.paginationActive = true;
        this.typewriterCallback = callback;
        
        // Display first page
        this.displayDialoguePage(element);
    }
    
    splitTextIntoPages(text, charsPerPage) {
        const pages = [];
        let remainingText = text;
        
        while (remainingText.length > 0) {
            if (remainingText.length <= charsPerPage) {
                // Last page - add everything
                pages.push(remainingText);
                break;
            }
            
            // Find a good break point (space, period, comma) near charsPerPage
            let breakPoint = charsPerPage;
            
            // Look for sentence end (. ! ?) within last 50 chars
            const sentenceEnd = remainingText.substring(0, charsPerPage).lastIndexOf('. ');
            if (sentenceEnd > charsPerPage - 50) {
                breakPoint = sentenceEnd + 2; // Include period and space
            } else {
                // Look for word boundary (space)
                const lastSpace = remainingText.substring(0, charsPerPage).lastIndexOf(' ');
                if (lastSpace > charsPerPage - 30) {
                    breakPoint = lastSpace + 1;
                }
            }
            
            pages.push(remainingText.substring(0, breakPoint).trim());
            remainingText = remainingText.substring(breakPoint).trim();
        }
        
        return pages;
    }
    
    displayDialoguePage(element) {
        const currentPage = this.dialoguePages[this.currentDialoguePage];
        
        // Add page indicator for multi-page dialogue
        const pageIndicator = (this.dialoguePages.length > 1) 
            ? ` [${this.currentDialoguePage + 1}/${this.dialoguePages.length}]`
            : '';
        
        // Typewriter the current page
        this.typewriterActive = true;
        this.fullDialogueText = currentPage;
        element.textContent = '';
        let i = 0;
        
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
        }
        
        this.typewriterInterval = setInterval(() => {
            if (i < currentPage.length) {
                element.textContent += currentPage.charAt(i);
                i++;
            } else {
                // Add page indicator when typing finishes (only on mobile)
                if (this.dialoguePages.length > 1) {
                    element.textContent += pageIndicator;
                }
                
                clearInterval(this.typewriterInterval);
                this.typewriterInterval = null;
                this.typewriterActive = false;
            }
        }, 30);
    }
    
    skipTypewriter() {
        // Stop the typing animation and show full text immediately
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
            this.typewriterInterval = null;
        }
        
        // If pagination active, show full current page with indicator
        if (this.paginationActive) {
            const currentPage = this.dialoguePages[this.currentDialoguePage];
            const pageIndicator = (this.dialoguePages.length > 1) 
                ? ` [${this.currentDialoguePage + 1}/${this.dialoguePages.length}]`
                : '';
            this.dialogueText.textContent = currentPage + pageIndicator;
        } else {
            // Original behavior - show full text
            this.dialogueText.textContent = this.fullDialogueText;
        }
        
        this.typewriterActive = false;
        
        // Execute callback only when pagination is done
        if (this.typewriterCallback && !this.paginationActive) {
            this.typewriterCallback();
            this.typewriterCallback = null;
        }
    }
    
    handleDialogueClick() {
        // If typing is active, skip to full text
        if (this.typewriterActive) {
            this.skipTypewriter();
        }
        // If pagination is active and more pages remain
        else if (this.paginationActive && this.currentDialoguePage < this.dialoguePages.length - 1) {
            this.currentDialoguePage++;
            this.displayDialoguePage(this.dialogueText);
        }
        // If pagination done or not active, advance to next scene
        else {
            // Reset pagination state
            this.paginationActive = false;
            this.dialoguePages = [];
            this.currentDialoguePage = 0;
            
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
        const creditsScreen = document.getElementById('credits-screen');
        if (!creditsScreen) {
            console.error('Credits screen element not found');
            return;
        }
        
        // Initialize credits state
        this.currentCreditIndex = 0;
        this.totalCredits = 13; // 0-12 inclusive
        
        // Hide all other UI
        this.gameView.style.display = 'none';
        this.mainMenu.style.display = 'none';
        
        // Show credits screen
        creditsScreen.style.display = 'flex';
        
        // Show first credit screen
        this.displayCreditScreen(0);
    }
    
    displayCreditScreen(index) {
        // Hide all credit screens
        const allScreens = document.querySelectorAll('.credit-screen');
        allScreens.forEach(screen => {
            screen.style.display = 'none';
            screen.classList.remove('active');
        });
        
        // Show current screen with fade-in
        const currentScreen = document.getElementById(`credit-${index}`);
        if (currentScreen) {
            currentScreen.style.display = 'flex';
            // Trigger fade-in animation
            setTimeout(() => {
                currentScreen.classList.add('active');
            }, 50);
        }
        
        // Update next button text (change to "BACK TO MENU" on last screen)
        const nextButton = document.getElementById('next-credits');
        if (nextButton) {
            if (index >= this.totalCredits - 1) {
                nextButton.textContent = 'BACK TO MENU';
                nextButton.style.display = 'block';
            } else {
                nextButton.textContent = 'NEXT >';
                nextButton.style.display = 'block';
            }
        }
    }
    
    nextCredit() {
        this.currentCreditIndex++;
        
        if (this.currentCreditIndex >= this.totalCredits) {
            // Credits finished - return to main menu
            this.closeCredits();
        } else {
            // Show next credit screen
            this.displayCreditScreen(this.currentCreditIndex);
        }
    }
    
    closeCredits() {
        const creditsScreen = document.getElementById('credits-screen');
        if (creditsScreen) {
            creditsScreen.style.display = 'none';
        }
        
        // Return to main menu
        this.mainMenu.style.display = 'flex';
        this.mainMenu.style.opacity = '1';
        
        // Reset credits state
        this.currentCreditIndex = 0;
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
        // Stop tether decay if in Tori's route
        if (this.currentRoute) {
            // Check if route has stopTetherDecay method
            if (this.currentRoute.stopTetherDecay) {
                this.currentRoute.stopTetherDecay();
            }
            // Or if route has tetherSystem object
            if (this.currentRoute.tetherSystem && this.currentRoute.tetherSystem.stopDecay) {
                this.currentRoute.tetherSystem.stopDecay();
            }
        }
        
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
