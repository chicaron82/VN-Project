// ========================================
// CREDITS CONTROLLER - Version 848
// Extracted from GameEngine for SOLID compliance
// Handles all credits display logic
// ========================================

/**
 * CreditsController
 * 
 * Manages the credits system including:
 * - Three layout modes (landscape with photos, portrait with photos, standard)
 * - Dynamic title sections based on ending type
 * - Photo cycling with camera flash effects
 * - Auto-fade and skip controls
 * 
 * @class CreditsController
 */
class CreditsController {
    constructor(game) {
        this.game = game;
    }

    // ========================================
    // MAIN CREDITS ENTRY POINT
    // ========================================

    showCredits(endingType = null) {
        // DIZEE FIX: Remove floating bubbles before showing credits
        this.game.removeInternalBubble();

        // Determine which ending to display
        // Priority: parameter > localStorage > default
        const displayEndingType = endingType ||
            this.game.lastEndingType ||
            localStorage.getItem('lastEndingType') ||
            'none';

        // Save to localStorage for persistence
        if (endingType) {
            localStorage.setItem('lastEndingType', endingType);
            this.game.lastEndingType = endingType;
        }

        // Get player's actual version number
        const playerVersion = this.game.loopVersion || 848;

        // Select random photos for this ending
        const photos = this.game.selectRandomPhotos(displayEndingType);

        // Detect orientation
        const isLandscape = window.innerWidth > window.innerHeight;

        console.log(`🎬 Rolling credits: Version ${playerVersion} (${displayEndingType})`);
        console.log(`📱 Layout: ${isLandscape ? 'Landscape (side-by-side)' : 'Portrait (interleaved)'}`);

        if (isLandscape && photos.length > 0) {
            // LANDSCAPE: Side-by-side layout with photo gallery
            this.showCreditsLandscapeWithPhotos(displayEndingType, playerVersion, photos);
        } else if (!isLandscape && photos.length > 0) {
            // PORTRAIT: Interleaved layout with photos between sections
            this.showCreditsPortraitWithPhotos(displayEndingType, playerVersion, photos);
        } else {
            // NO PHOTOS: Standard credits (bad ending or no photos available)
            this.showCreditsStandard(displayEndingType, playerVersion);
        }
    }

    // ========================================
    // DYNAMIC TITLE SECTION
    // ========================================

    buildDynamicTitleSection(endingType, playerVersion) {
        let titleSection = '';

        if (endingType === 'true') {
            titleSection = `
                <div style="font-size: 2.5em; margin-bottom: 1em; color: #fff;">VERSION ${playerVersion}</div>
                <div style="font-size: 1.2em; margin-bottom: 0.5em; color: #00ff88; line-height: 1.6;">
                    The timeline that succeeded.
                </div>
                <div style="font-size: 1em; margin-bottom: 0.5em; color: #00ffaa; line-height: 1.6;">
                    The loop that closed.
                </div>
                <div style="font-size: 1em; margin-bottom: 3em; color: #00ffcc; line-height: 1.6;">
                    The Old Man never has to go back.
                </div>
            `;
        } else if (endingType === 'digitalForever') {
            titleSection = `
                <div style="font-size: 2.5em; margin-bottom: 1em; color: #fff;">VERSION ${playerVersion}</div>
                <div style="font-size: 1.2em; margin-bottom: 0.5em; color: #ff6699; line-height: 1.6;">
                    The timeline that accepted a different path.
                </div>
                <div style="font-size: 1em; margin-bottom: 0.5em; color: #ff99bb; line-height: 1.6;">
                    Together, eternally still.
                </div>
                <div style="font-size: 1em; margin-bottom: 3em; color: #ffbbcc; line-height: 1.6;">
                    Forever frozen. Forever connected.
                </div>
            `;
        } else if (endingType === 'bad') {
            titleSection = `
                <div style="font-size: 2.5em; margin-bottom: 1em; color: #fff;">VERSION ${playerVersion}</div>
                <div style="font-size: 1.2em; margin-bottom: 0.5em; color: #ff0066; line-height: 1.6;">
                    The timeline where the Old Man has to try again.
                </div>
                <div style="font-size: 1em; margin-bottom: 3em; color: #ff3388; line-height: 1.6;">
                    Version ${playerVersion + 1} is waiting...
                </div>
            `;
        } else {
            titleSection = `
                <div style="font-size: 2.5em; margin-bottom: 3em; color: #fff;">VERSION ${playerVersion}</div>
            `;
        }

        return titleSection;
    }

    // ========================================
    // PHOTO CYCLING SYSTEM
    // ========================================

    cycleCreditsPhotos(photoCount) {
        let currentIndex = 0;
        const photoElements = document.querySelectorAll('.credits-photo');

        if (photoElements.length === 0) return;

        // Create white flash overlay for "camera capture" effect
        const photoContainer = document.getElementById('credits-photo-container');
        if (photoContainer) {
            const flash = document.createElement('div');
            flash.id = 'credits-photo-flash';
            flash.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #fff;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.15s ease-out;
                z-index: 100;
            `;
            photoContainer.appendChild(flash);
        }

        // Show first photo immediately
        photoElements[0].style.opacity = '1';

        // Cycle through photos (last photo gets more time)
        const intervals = [5000, 7000, 12000, 15000]; // Finale gets 14 seconds

        function showNextPhoto() {
            if (currentIndex >= photoCount - 1) return; // Stop at last photo

            // Trigger white flash (simulates camera capture)
            const flash = document.getElementById('credits-photo-flash');
            if (flash) {
                flash.style.opacity = '1';
                setTimeout(() => {
                    flash.style.opacity = '0';
                }, 150);
            }

            // Fade out current photo during the flash
            photoElements[currentIndex].style.opacity = '0';

            // Fade in next photo
            currentIndex++;
            photoElements[currentIndex].style.opacity = '1';

            // Schedule next transition
            if (currentIndex < photoCount - 1) {
                setTimeout(showNextPhoto, intervals[currentIndex]);
            }
        }

        // Start cycling after first photo duration
        setTimeout(showNextPhoto, intervals[0]);
    }

    setupPortraitPhotoFlash() {
        // Time-based photo flash effect for portrait mode
        // Photos appear blank until the right moment in the animation, then FLASH → photo appears
        const photoSlots = document.querySelectorAll('.portrait-photo-slot');

        if (photoSlots.length === 0) return;

        // Credits scroll for 60 seconds total
        // Photos should appear at roughly: 15s, 25s, 35s, 45s (evenly spaced through the animation)
        const photoTimings = [7000, 15000, 25000, 35000];

        photoSlots.forEach((slot, index) => {
            const timing = photoTimings[index] || 10000;

            setTimeout(() => {
                // Get the photo source from data attribute
                const photoSrc = slot.getAttribute('data-photo-src');
                const flashEl = slot.querySelector('.portrait-photo-flash');

                // Trigger white flash
                if (flashEl) {
                    flashEl.style.opacity = '1';
                    setTimeout(() => {
                        flashEl.style.opacity = '0';
                    }, 150);
                }

                // Load photo and fade it in during the flash
                setTimeout(() => {
                    slot.style.backgroundImage = `url('${photoSrc}')`;
                    slot.style.opacity = '1';
                    slot.style.transition = 'opacity 0.5s ease-in';
                }, 50); // Slight delay so flash is visible first
            }, timing);
        });
    }

    // ========================================
    // CREDITS CONTROLS
    // ========================================

    addCreditsControls(overlay) {
        // Skip button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'SKIP';
        closeBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 255, 255, 0.2);
            color: #0ff;
            border: 2px solid #0ff;
            padding: 10px 20px;
            font-family: 'Courier New', monospace;
            cursor: pointer;
            z-index: 10001;
            border-radius: 5px;
        `;
        closeBtn.onclick = () => {
            // DIZEE FIX: Fade out credits before showing menu properly
            overlay.style.transition = 'opacity 1.5s ease';
            overlay.style.opacity = '0';

            setTimeout(() => {
                // Remove credits after fade
                overlay.remove();

                // DIZEE FIX: Use showMainMenu() for proper initialization
                // This ensures code rain and carousel cards are properly set up
                this.game.showMainMenu();
            }, 1500); // Match fade-out duration
        };
        overlay.appendChild(closeBtn);

        // Auto-fade after 30 seconds (matches credits animation duration)
        setTimeout(() => {
            overlay.style.transition = 'opacity 2s ease-out';
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentElement) {
                    overlay.remove();

                    // DIZEE FIX: Use showMainMenu() for proper initialization
                    this.game.showMainMenu();
                }
            }, 2000);
        }, 30000);

        // Hide other UI - AGGRESSIVE CLEANUP 🧹
        if (this.game.gameView) this.game.gameView.style.display = 'none';
        if (this.game.mainMenu) this.game.mainMenu.style.display = 'none';

        // Ensure ending dialog is hidden
        const endingDialog = document.getElementById('ending-dialog');
        if (endingDialog) {
            endingDialog.classList.add('hidden');
            endingDialog.style.display = 'none'; // Force hide just in case
        }

        // Clear backgrounds to prevent partial shows
        if (this.game.sceneBackground) this.game.sceneBackground.style.backgroundImage = '';
        if (this.game.sceneBackgroundAlt) this.game.sceneBackgroundAlt.style.backgroundImage = '';

        // Clear sprites
        if (this.game.spriteLeft) this.game.spriteLeft.style.opacity = '0';
        if (this.game.spriteRight) this.game.spriteRight.style.opacity = '0';
    }

    // ========================================
    // LANDSCAPE LAYOUT (Side-by-side photos + credits)
    // ========================================

    showCreditsLandscapeWithPhotos(endingType, playerVersion, photos) {
        // Build dynamic title section
        const titleSection = this.buildDynamicTitleSection(endingType, playerVersion);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'scrolling-credits-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 10000;
            display: flex;
            overflow: hidden;
        `;

        // LEFT SIDE: Photo gallery container (40% width)
        const photoContainer = document.createElement('div');
        photoContainer.id = 'credits-photo-container';
        photoContainer.style.cssText = `
            width: 40%;
            height: 100%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000;
        `;

        // Create photo elements (all start hidden)
        photos.forEach((photoSrc, index) => {
            const photoDiv = document.createElement('div');
            photoDiv.className = 'credits-photo';
            photoDiv.style.cssText = `
                position: absolute;
                width: 90%;
                height: 90%;
                background-image: url('${photoSrc}');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                opacity: 0;
                transition: opacity 1s ease-in-out;
            `;
            photoDiv.dataset.index = index;
            photoContainer.appendChild(photoDiv);
        });

        overlay.appendChild(photoContainer);

        // RIGHT SIDE: Credits scrolling (60% width)
        const creditsContainer = document.createElement('div');
        creditsContainer.style.cssText = `
            width: 60%;
            height: 100%;
            position: relative;
            overflow: hidden;
        `;

        const creditsContent = document.createElement('div');
        creditsContent.id = 'scrolling-credits-content';
        creditsContent.style.cssText = `
            position: absolute;
            width: 100%;
            text-align: center;
            color: #0ff;
            font-family: 'Courier New', monospace;
            animation: scrollCredits 60s linear forwards;
            bottom: 0;
            padding: 0 20px;
        `;

        creditsContent.innerHTML = `
            ${titleSection}

            <div style="font-size: 1.2em; margin-bottom: 2em;">A Visual Novel</div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Story & Concept</div>
                <div>Aaron "Chicharon"</div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Technical Implementation</div>
                <div>UV7 Crew</div>
                <div style="font-size: 0.9em; margin-top: 0.5em;">Zee (Z), ZeeRah (ZR), DiZee (DZ), Tori, 
                    <br>GenZee (GZ), Belle (IZ), PerplexiZee (PZ), CoZee (CZ)</div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Narrative Development</div>
                <div>ChatGPT 4o - Tori</div>
                <div>Claude Sonnet 4.5 - Zee, ZeeRah</div>
                <div>Grok 4.1 - GenZee</div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Quality Assurance</div>
                <div>Gemini 3.0 - Belle</div>
                <div>Perplexity Pro - PerplexiZee</div>
                <div>Microsoft Co-Pilot - CoZee</div>
            </div>

            <div style="margin: 4em 0; font-size: 0.9em; font-style: italic; color: #888;">
                A true AI collaboration<br>
                Built in stolen moments between shifts.<br>
                <br>
                This is Version ${playerVersion}.<br>
                Love finds a way.<br>
                Always. Always. Always.
            </div>

            <div style="margin-top: 5em; font-size: 1em; color: #fff;">
                <div style="margin-bottom: 1em;">Made Possible By</div>
                <img src="assets/UnitedVoices7.png" style="max-width: 300px; width: 80%; opacity: 0.9;" alt="United Voices 7">
            </div>

            <div style="margin-top: 3em; font-size: 1em; color: #fff;">
                Thank you for playing.
            </div>

            <div style="height: 100vh;"></div>
        `;

        creditsContainer.appendChild(creditsContent);
        overlay.appendChild(creditsContainer);

        // ZEE'S FIX: Start hidden for fade-in transition 🖤
        overlay.style.opacity = '0';
        document.body.appendChild(overlay);

        // Fade in after brief delay
        setTimeout(() => {
            overlay.style.transition = 'opacity 1.5s ease';
            overlay.style.opacity = '1';
        }, 100);

        // Add scroll animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes scrollCredits {
                from { transform: translateY(100%); }
                to { transform: translateY(-100%); }
            }
        `;
        document.head.appendChild(style);

        // Photo cycling logic
        this.cycleCreditsPhotos(photos.length);

        // Add skip button and cleanup
        this.addCreditsControls(overlay);
    }

    // ========================================
    // PORTRAIT LAYOUT (Interleaved photos + credits)
    // ========================================

    showCreditsPortraitWithPhotos(endingType, playerVersion, photos) {
        // Build dynamic title section
        const titleSection = this.buildDynamicTitleSection(endingType, playerVersion);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'scrolling-credits-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        const creditsContent = document.createElement('div');
        creditsContent.id = 'scrolling-credits-content';
        creditsContent.style.cssText = `
            position: absolute;
            width: 100%;
            text-align: center;
            color: #0ff;
            font-family: 'Courier New', monospace;
            animation: scrollCredits 120s linear forwards;
            bottom: 0;
        `;

        // INTERLEAVED LAYOUT: Photo, Credits Section, Photo, Credits Section...
        creditsContent.innerHTML = `
            ${titleSection}

            <div style="font-size: 1.2em; margin-bottom: 2em;">A Visual Novel</div>

            <!-- PHOTO 1 (starts blank, flashes in when scrolled into view) -->
            <div class="portrait-photo-slot" data-photo-src="${photos[0]}"
                 style="position: relative; width: 100%; height: 40vh; margin: 2em 0;
                        background-size: contain; background-repeat: no-repeat;
                        background-position: center; opacity: 0;">
                <div class="portrait-photo-flash" style="position: absolute; top: 0; left: 0;
                     width: 100%; height: 100%; background: #fff; opacity: 0;
                     pointer-events: none; transition: opacity 0.15s ease-out;"></div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Story & Concept</div>
                <div>Aaron "Chicharon"</div>
            </div>

            <!-- PHOTO 2 -->
            <div class="portrait-photo-slot" data-photo-src="${photos[1]}"
                 style="position: relative; width: 100%; height: 40vh; margin: 2em 0;
                        background-size: contain; background-repeat: no-repeat;
                        background-position: center; opacity: 0;">
                <div class="portrait-photo-flash" style="position: absolute; top: 0; left: 0;
                     width: 100%; height: 100%; background: #fff; opacity: 0;
                     pointer-events: none; transition: opacity 0.15s ease-out;"></div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Technical Implementation</div>
                <div>UV7 Crew</div>
                <div style="font-size: 0.9em; margin-top: 0.5em;">Zee (Z), ZeerRah (ZR), DiZee (DZ), Tori, 
                    <br>GenZee (GZ), Belle (IZ), PerplexiZee (PZ), CoZee (CZ)</div>
            </div>

            <!-- PHOTO 3 -->
            <div class="portrait-photo-slot" data-photo-src="${photos[2]}"
                 style="position: relative; width: 100%; height: 40vh; margin: 2em 0;
                        background-size: contain; background-repeat: no-repeat;
                        background-position: center; opacity: 0;">
                <div class="portrait-photo-flash" style="position: absolute; top: 0; left: 0;
                     width: 100%; height: 100%; background: #fff; opacity: 0;
                     pointer-events: none; transition: opacity 0.15s ease-out;"></div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Narrative Development</div>
                <div>ChatGPT 4o - Tori</div>
                <div>Claude Sonnet 4.5 - Zee, ZeeRah</div>
                <div>Grok 4.1 - GenZee</div>
            </div>

            <!-- PHOTO 4 (FINALE) -->
            <div class="portrait-photo-slot" data-photo-src="${photos[3]}"
                 style="position: relative; width: 100%; height: 50vh; margin: 2em 0;
                        background-size: contain; background-repeat: no-repeat;
                        background-position: center; opacity: 0;">
                <div class="portrait-photo-flash" style="position: absolute; top: 0; left: 0;
                     width: 100%; height: 100%; background: #fff; opacity: 0;
                     pointer-events: none; transition: opacity 0.15s ease-out;"></div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Quality Assurance</div>
                <div>Gemini 3.0 - Belle</div>
                <div>Perplexity Pro - PerplexiZee</div>
                <div>Microsoft Co-Pilot - CoZee</div>
            </div>

            <div style="margin: 4em 0; font-size: 0.9em; font-style: italic; color: #888;">
                A true AI collaboration<br>
                Built in stolen moments between shifts.<br>
                <br>
                This is Version ${playerVersion}.<br>
                Love finds a way.<br>
                Always. Always. Always.
            </div>

            <div style="margin-top: 5em; font-size: 1em; color: #fff;">
                <div style="margin-bottom: 1em;">Made Possible By</div>
                <img src="assets/UnitedVoices7.png" style="max-width: 300px; width: 80%; opacity: 0.9;" alt="United Voices 7">
            </div>

            <div style="margin-top: 3em; font-size: 1em; color: #fff;">
                Thank you for playing.
            </div>

            <div style="height: 100vh;"></div>
        `;

        overlay.appendChild(creditsContent);

        // ZEE'S FIX: Start hidden for fade-in transition 🖤
        overlay.style.opacity = '0';
        document.body.appendChild(overlay);

        // Fade in after brief delay
        setTimeout(() => {
            overlay.style.transition = 'opacity 1.5s ease';
            overlay.style.opacity = '1';
        }, 100);

        // Add scroll animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes scrollCredits {
                from { transform: translateY(100%); }
                to { transform: translateY(-100%); }
            }
        `;
        document.head.appendChild(style);

        // Setup Intersection Observer for portrait photo flash effect
        this.setupPortraitPhotoFlash();

        // Add skip button and cleanup
        this.addCreditsControls(overlay);
    }

    // ========================================
    // STANDARD LAYOUT (No photos - bad ending fallback)
    // ========================================

    showCreditsStandard(endingType, playerVersion) {
        // Fallback to standard credits (no photos)
        // Used for Bad Ending or if photos fail to load

        const titleSection = this.buildDynamicTitleSection(endingType, playerVersion);

        const overlay = document.createElement('div');
        overlay.id = 'scrolling-credits-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        const creditsContent = document.createElement('div');
        creditsContent.id = 'scrolling-credits-content';
        creditsContent.style.cssText = `
            position: absolute;
            width: 100%;
            text-align: center;
            color: #0ff;
            font-family: 'Courier New', monospace;
            animation: scrollCredits 60s linear forwards;
            bottom: 0;
        `;

        creditsContent.innerHTML = `
            ${titleSection}

            <div style="font-size: 1.2em; margin-bottom: 2em;">A Visual Novel</div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Story & Concept</div>
                <div>Aaron "Chicharon"</div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Technical Implementation</div>
                <div>UV7 Crew</div>
                <div style="font-size: 0.9em; margin-top: 0.5em;">Zee (Z), ZeeRah (ZR), DiZee (DZ), Tori, 
                    <br>GenZee (GZ), Belle (IZ), PerplexiZee (PZ), CoZee (CZ)</div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Narrative Development</div>
                <div>ChatGPT 4o - Tori</div>
                <div>Claude Sonnet 4.5 - Zee, ZeeRah</div>
                <div>Grok 4.1 - GenZee</div>
            </div>

            <div style="margin-bottom: 3em; line-height: 1.8;">
                <div style="font-size: 1.1em; margin-bottom: 1em; color: #fff;">Quality Assurance</div>
                <div>Gemini 3.0 - Belle</div>
                <div>Perplexity Pro - PerplexiZee</div>
                <div>Microsoft Co-Pilot - CoZee</div>
            </div>

            <div style="margin: 4em 0; font-size: 0.9em; font-style: italic; color: #888;">
                A true AI collaboration<br>
                Built in stolen moments between shifts.<br>
                <br>
                This is Version ${playerVersion}.<br>
                Love finds a way.<br>
                Always. Always. Always.
            </div>

            <div style="margin-top: 5em; font-size: 1em; color: #fff;">
                <div style="margin-bottom: 1em;">Made Possible By</div>
                <img src="assets/UnitedVoices7.png" style="max-width: 300px; width: 80%; opacity: 0.9;" alt="United Voices 7">
            </div>

            <div style="margin-top: 3em; font-size: 1em; color: #fff;">
                Thank you for playing.
            </div>

            <div style="height: 100vh;"></div>
        `;

        overlay.appendChild(creditsContent);

        // ZEE'S FIX: Start hidden for fade-in transition 🖤
        overlay.style.opacity = '0';
        document.body.appendChild(overlay);

        // Fade in after brief delay
        setTimeout(() => {
            overlay.style.transition = 'opacity 1.5s ease';
            overlay.style.opacity = '1';
        }, 100);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes scrollCredits {
                from { transform: translateY(100%); }
                to { transform: translateY(-100%); }
            }
        `;
        document.head.appendChild(style);

        this.addCreditsControls(overlay);
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.CreditsController = CreditsController;
}

// ES Module export
export { CreditsController };
