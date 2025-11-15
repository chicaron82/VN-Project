// ========================================
// GAME ENGINE - Version 848 (COMPLETE)
// Main game logic and scene management
// WITH SPRITE MANAGEMENT + PAGINATION SYSTEM
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
        
        // Character sprite containers
        this.spriteLeft = document.getElementById('character-left');
        this.spriteRight = document.getElementById('character-right');
        this.currentSprites = {
            left: null,
            right: null
        };
        
        // State
        this.currentRoute = null;
        this.currentScene = null;
        this.typewriterActive = false;
        this.typewriterInterval = null;
        this.typewriterCallback = null;
        this.fullDialogueText = '';
        
        // Pagination state (for mobile dialogue handling)
        this.dialoguePages = [];
        this.currentDialoguePage = 0;
        this.paginationActive = false;
        
        // Detect mobile for sprite handling
        this.isMobile = window.innerWidth <= 480;
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 480;
        });
        
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
            this.mainMenu.style.display = 'flex';
            
            // Fade in menu
            setTimeout(() => {
                this.mainMenu.style.opacity = '1';
            }, 100);
        }, 500);
    }
    
    // ========================================
    // ROUTE START
    // ========================================
    
    startRoute(routeName) {
        // Fade out route select
        const routeSelect = document.getElementById('route-select');
        routeSelect.style.opacity = '0';
        
        setTimeout(() => {
            routeSelect.style.display = 'none';
            this.gameView.style.display = 'flex';
            
            // Fade in game view
            setTimeout(() => {
                this.gameView.style.opacity = '1';
            }, 100);
            
            // Initialize route
            if (routeName === 'ronnie') {
                this.currentRoute = new RonnieRoute(this);
                this.currentRoute.start();
            } else if (routeName === 'tori') {
                this.currentRoute = new ToriRoute(this);
                this.currentRoute.start();
            }
        }, 1000);
    }
    
    // ========================================
    // SCENE DISPLAY
    // ========================================
    
    displayScene(scene, sceneId) {
        this.currentScene = scene;
        
        // Store scene ID for save system
        if (sceneId) {
            this.gameState.progress.currentScene = sceneId;
        }
        
        // Handle character display (speaker highlighting)
        if (scene.character) {
            this.setActiveSpeaker(scene.character);
        }
        
        // Update character name
        this.characterName.textContent = scene.character || '';
        this.characterName.style.display = scene.character ? 'block' : 'none';
        
        // Handle sprites (show/hide based on scene data)
        if (scene.sprites) {
            this.updateSprites(scene.sprites);
        }
        
        // Clear previous dialogue
        this.dialogueText.textContent = '';
        this.internalThought.textContent = '';
        
        // Store full dialogue for skip functionality
        this.fullDialogueText = scene.dialogue || '';
        
        // Handle dialogue with typewriter effect
        if (scene.dialogue) {
            // Pass internal text length so pagination considers BOTH dialogue + internal
            const internalLength = scene.internal ? scene.internal.length : 0;
            this.typewriterText(this.dialogueText, scene.dialogue, null, internalLength);
        }
        
        // Handle internal thoughts
        if (scene.internal) {
            this.internalThought.textContent = scene.internal;
            this.internalThought.style.display = 'block';
        } else {
            this.internalThought.style.display = 'none';
        }
        
        // Handle choices
        if (scene.choices) {
            this.showChoices(scene.choices, scene.onChoice);
        } else {
            this.choiceMenu.style.display = 'none';
        }
        
        // Handle echoes (Tori route only)
        if (scene.echoes) {
            this.displayEchoes(scene.echoes);
        } else {
            this.clearEchoes();
        }
        
        // Handle background changes
        if (scene.background) {
            this.sceneBackground.style.backgroundImage = `url(${scene.background})`;
        }
        
        // Handle special styling
        if (scene.style) {
            this.dialogueBox.classList.add(scene.style);
        } else {
            this.dialogueBox.className = '';
        }
        
        // Auto-save after each scene (if route is active)
        if (this.currentRoute) {
            this.saveManager.autoSave();
        }
    }
    
    // ========================================
    // SPRITE MANAGEMENT
    // ========================================
    
    updateSprites(sprites) {
        // Handle left sprite
        if (sprites.left !== undefined) {
            if (sprites.left === null) {
                // Hide left sprite
                if (this.spriteLeft) {
                    this.spriteLeft.style.opacity = '0';
                    setTimeout(() => {
                        this.spriteLeft.style.display = 'none';
                    }, 300);
                }
                this.currentSprites.left = null;
            } else {
                // Show/update left sprite
                if (this.spriteLeft) {
                    this.spriteLeft.style.display = 'block';
                    this.spriteLeft.style.backgroundImage = `url(${sprites.left})`;
                    this.spriteLeft.style.opacity = '1';
                }
                this.currentSprites.left = sprites.left;
            }
        }
        
        // Handle right sprite
        if (sprites.right !== undefined) {
            if (sprites.right === null) {
                // Hide right sprite
                if (this.spriteRight) {
                    this.spriteRight.style.opacity = '0';
                    setTimeout(() => {
                        this.spriteRight.style.display = 'none';
                    }, 300);
                }
                this.currentSprites.right = null;
            } else {
                // Show/update right sprite
                if (this.spriteRight) {
                    this.spriteRight.style.display = 'block';
                    this.spriteRight.style.backgroundImage = `url(${sprites.right})`;
                    this.spriteRight.style.opacity = '1';
                }
                this.currentSprites.right = sprites.right;
            }
        }
    }
    
    setActiveSpeaker(speaker) {
        if (!speaker) {
            // No speaker - remove all dims
            if (this.spriteLeft) this.spriteLeft.classList.remove('sprite-dim');
            if (this.spriteRight) this.spriteRight.classList.remove('sprite-dim');
            return;
        }
        
        const speakerName = speaker.toLowerCase(); // toLowerCase HERE, not in displayScene
        
        // Determine which sprite should be bright (remove dim from active, add to inactive)
        if (speakerName.includes('ronnie')) {
            // Ronnie speaking - left bright, right dim
            if (this.spriteLeft) this.spriteLeft.classList.remove('sprite-dim');
            if (this.spriteRight && this.currentSprites.right) {
                this.spriteRight.classList.add('sprite-dim');
            }
        } else if (speakerName.includes('tori')) {
            // Tori speaking - right bright, left dim
            if (this.spriteRight) this.spriteRight.classList.remove('sprite-dim');
            if (this.spriteLeft && this.currentSprites.left) {
                this.spriteLeft.classList.add('sprite-dim');
            }
        } else if (speakerName.includes('narration') || speakerName.includes('system')) {
            // Narration - no dimming
            if (this.spriteLeft) this.spriteLeft.classList.remove('sprite-dim');
            if (this.spriteRight) this.spriteRight.classList.remove('sprite-dim');
        }
    }
    
    hideAllSprites() {
        if (this.spriteLeft) {
            this.spriteLeft.style.opacity = '0';
            setTimeout(() => {
                this.spriteLeft.style.display = 'none';
            }, 300);
        }
        if (this.spriteRight) {
            this.spriteRight.style.opacity = '0';
            setTimeout(() => {
                this.spriteRight.style.display = 'none';
            }, 300);
        }
        this.currentSprites = { left: null, right: null };
    }
    
    // ========================================
    // TYPEWRITER EFFECT WITH PAGINATION
    // ========================================
    
    typewriterText(element, text, callback, internalTextLength = 0) {
        // Check if text needs pagination on mobile
        // Consider BOTH dialogue and internal text length
        const totalLength = text.length + internalTextLength;
        
        if (this.shouldPaginateText(totalLength)) {
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
            }, 30); // FIXED SPEED - always 30ms
        }
    }
    
    shouldPaginateText(textLength) {
        // Only paginate on mobile portrait
        if (window.innerWidth > 480) return false;
        if (window.innerHeight < window.innerWidth) return false; // Landscape - no pagination
        
        // Check if text is longer than mobile-safe threshold
        // Lower threshold when we have both dialogue + internal
        return textLength > 200;
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
                pages.push(remainingText);
                break;
            }
            
            let breakPoint = charsPerPage;
            
            // Look for sentence end within last 50 chars
            const sentenceEnd = remainingText.substring(0, charsPerPage).lastIndexOf('. ');
            if (sentenceEnd > charsPerPage - 50) {
                breakPoint = sentenceEnd + 2;
            } else {
                // Look for word boundary
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
                // Add page indicator when typing finishes
                if (this.dialoguePages.length > 1) {
                    element.textContent += pageIndicator;
                }
                
                clearInterval(this.typewriterInterval);
                this.typewriterInterval = null;
                this.typewriterActive = false;
            }
        }, 30); // FIXED SPEED - always 30ms
    }

    
    showNextDialoguePage() {
        this.currentDialoguePage++;
        
        if (this.currentDialoguePage >= this.dialoguePages.length) {
            // All pages shown - advance to next scene
            this.paginationActive = false;
            this.advance();
        } else {
            // Show next page
            this.displayDialoguePage(this.dialogueText);
        }
    }
    
    skipTypewriter() {
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
        }
        
        if (this.paginationActive) {
            // Show current page fully with indicator
            const currentPage = this.dialoguePages[this.currentDialoguePage];
            const pageIndicator = (this.dialoguePages.length > 1)
                ? ` [${this.currentDialoguePage + 1}/${this.dialoguePages.length}]`
                : '';
            this.dialogueText.textContent = currentPage + pageIndicator;
        } else {
            // Show full text
            this.dialogueText.textContent = this.fullDialogueText;
        }
        
        this.typewriterActive = false;
        
        // Execute callback if exists
        if (this.typewriterCallback) {
            this.typewriterCallback();
            this.typewriterCallback = null;
        }
    }
    
    handleDialogueClick() {
        // If pagination is active, show next page
        if (this.paginationActive && !this.typewriterActive) {
            this.showNextDialoguePage();
            return;
        }
        
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
    
    showChoices(choices, onChoice) {
        this.choicesContainer.innerHTML = '';
        this.choiceMenu.style.display = 'block';
        
        choices.forEach(choice => {
            const button = document.createElement('div');
            button.className = 'choice-option';
            button.textContent = choice.text;
            
            if (choice.locked || choice.disabled) {
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
    // ECHO DISPLAY (TORI ROUTE)
    // ========================================
    
    displayEchoes(echoes) {
        if (!this.echoDisplay) return;
        
        this.echoDisplay.style.display = 'block';
        
        if (echoes.echo1) {
            this.echo1Text.textContent = echoes.echo1;
            this.echo1Text.style.display = 'block';
        } else {
            this.echo1Text.style.display = 'none';
        }
        
        if (echoes.echo2) {
            this.echo2Text.textContent = echoes.echo2;
            this.echo2Text.style.display = 'block';
        } else {
            this.echo2Text.style.display = 'none';
        }
        
        if (echoes.despair) {
            this.echoDespairText.textContent = echoes.despair;
            this.echoDespairText.style.display = 'block';
        } else {
            this.echoDespairText.style.display = 'none';
        }
    }
    
    clearEchoes() {
        if (this.echoDisplay) {
            this.echoDisplay.style.display = 'none';
        }
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
