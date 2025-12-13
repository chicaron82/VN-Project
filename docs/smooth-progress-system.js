// ========================================
// SMOOTH PROGRESS ANIMATION SYSTEM
// Makes loading feel satisfying even on fast connections
// By ZeeRah 💚🔥💀
// ========================================

/*
IMPLEMENTATION GUIDE:

Add this at the TOP of init() method (after this.imageCache = new Map();):

        // Smooth progress animation settings
        this.minLoadingAnimationTime = 2000; // Minimum 2 seconds for satisfying progress bar
        
Then REPLACE the entire image loading section with the enhanced version below.
*/

// ========================================
// ENHANCED INIT() PRELOAD SECTION
// ========================================

init() {
    // ... existing splash/loading setup code ...
    
    // Image cache for preloaded assets
    this.imageCache = new Map();
    
    // Smooth progress animation settings
    this.minLoadingAnimationTime = 2000; // Minimum 2 seconds for satisfying progress bar

    // Preload images with priority system
    const imagesToPreload = {
        // PRIORITY 1: Critical menu assets (load first)
        critical: [
            'assets/menudesktop.png',
            'assets/menumobile.png',
            'assets/desktopVersion.png',
            'assets/UnitedVoices7.png'
        ],

        // PRIORITY 2: Core gameplay assets (load second)
        gameplay: [
            'assets/ronnie-sprite.png',
            'assets/tori-sprite.png',
            'assets/apartment.png',
            'assets/hospital.png',
            'assets/genericBack.png',
            'assets/digitalSpace.png'
        ],

        // PRIORITY 3: Route-specific assets (load last)
        routes: [
            'assets/echo-1-sprite.png',
            'assets/echo-2-sprite.png',
            'assets/despair-sprite.png',
            'assets/three-echoes-sprite.png'
        ]
    };

    // Flatten all images for total count
    const allImages = [
        ...imagesToPreload.critical,
        ...imagesToPreload.gameplay,
        ...imagesToPreload.routes
    ];

    let imagesLoaded = 0;
    const totalImages = allImages.length;
    const failedImages = [];
    const loadStartTime = Date.now();

    // Enhanced preload function with caching and retry logic
    const preloadImage = (src, retryCount = 0) => {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                // Cache the loaded image
                this.imageCache.set(src, img);

                imagesLoaded++;
                const progress = Math.floor((imagesLoaded / totalImages) * 100);
                this.loadingBar.style.width = progress + '%';

                console.log(`✅ Loaded: ${src} (${imagesLoaded}/${totalImages})`);
                resolve(src);
            };

            img.onerror = () => {
                // Retry failed images up to 2 times
                if (retryCount < 2) {
                    console.warn(`⚠️ Retrying: ${src} (attempt ${retryCount + 1}/2)`);
                    setTimeout(() => {
                        preloadImage(src, retryCount + 1).then(resolve).catch(reject);
                    }, 500 * (retryCount + 1)); // Exponential backoff
                } else {
                    // After 2 retries, mark as failed and continue
                    console.error(`❌ Failed to load: ${src}`);
                    failedImages.push(src);

                    imagesLoaded++;
                    const progress = Math.floor((imagesLoaded / totalImages) * 100);
                    this.loadingBar.style.width = progress + '%';

                    resolve(src); // Resolve anyway to continue loading
                }
            };

            img.src = src;
        });
    };

    // Load images in priority order
    const loadPriorityGroup = async (group) => {
        return Promise.all(group.map(src => preloadImage(src)));
    };

    // Sequential priority loading
    (async () => {
        try {
            // Load critical assets first
            await loadPriorityGroup(imagesToPreload.critical);
            console.log('📦 Critical assets loaded');

            // Load gameplay assets second
            await loadPriorityGroup(imagesToPreload.gameplay);
            console.log('📦 Gameplay assets loaded');

            // Load route-specific assets last
            await loadPriorityGroup(imagesToPreload.routes);
            console.log('📦 Route assets loaded');

            // All loading complete
            const actualLoadTime = Date.now() - loadStartTime;
            
            if (failedImages.length > 0) {
                console.warn(`⚠️ ${failedImages.length} images failed to load:`, failedImages);
            }

            console.log(`✅ Loading complete: ${imagesLoaded}/${totalImages} loaded in ${actualLoadTime}ms`);

            // ========================================
            // SMOOTH PROGRESS SIMULATION FOR FAST LOADS
            // ========================================
            
            // If loading was TOO FAST (< 2 seconds), simulate smooth progress to make it feel satisfying
            if (actualLoadTime < this.minLoadingAnimationTime) {
                const remainingAnimTime = this.minLoadingAnimationTime - actualLoadTime;
                console.log(`⏱️ Fast load detected (${actualLoadTime}ms). Simulating smooth progress for ${remainingAnimTime}ms more...`);
                
                // Smoothly animate from current progress to 100% over remaining time
                const startProgress = parseInt(this.loadingBar.style.width) || 0;
                const progressToGo = 100 - startProgress;
                const steps = Math.ceil(remainingAnimTime / 50); // Update every 50ms
                const progressPerStep = progressToGo / steps;
                
                let currentStep = 0;
                const smoothInterval = setInterval(() => {
                    currentStep++;
                    const newProgress = Math.min(100, startProgress + (progressPerStep * currentStep));
                    this.loadingBar.style.width = newProgress + '%';
                    
                    if (currentStep >= steps || newProgress >= 100) {
                        clearInterval(smoothInterval);
                        this.loadingBar.style.width = '100%';
                        
                        // Now proceed to menu display logic
                        this.proceedToMenu();
                    }
                }, 50);
            } else {
                // Loading took long enough, proceed immediately
                this.loadingBar.style.width = '100%';
                this.proceedToMenu();
            }

        } catch (error) {
            console.error('Critical loading error:', error);
            // Even on error, show the menu
            this.proceedToMenu(true);
        }
    })();
    
    // ... rest of init() continues with Event Listeners ...
}

// ========================================
// NEW METHOD: proceedToMenu()
// ========================================

// ADD THIS METHOD to GameEngine class (after init):

proceedToMenu(hasError = false) {
    if (hasError) {
        console.error('Loading completed with errors, showing menu anyway');
        // Force show menu immediately on error
        if (window.completeSplash) {
            window.completeSplash();
        }
        this.mainMenu.style.display = 'flex';
        this.mainMenu.style.opacity = '1';
        return;
    }
    
    // Check if user manually skipped splash
    const userSkipped = window.splashSkippedByUser === true || this.splashSkipped === true;

    // Calculate how long splash has been showing
    const elapsed = Date.now() - this.splashStartTime;
    const remaining = userSkipped ? 0 : Math.max(0, this.minSplashDuration - elapsed);

    console.log(`Proceeding to menu. Elapsed: ${elapsed}ms, User skipped: ${userSkipped}, Waiting: ${remaining}ms more`);

    // Wait for remaining time (or skip immediately if user clicked)
    setTimeout(() => {
        // Hide UV7 splash (calls window.completeSplash if available)
        if (window.completeSplash) {
            window.completeSplash();
        }

        // Show main menu AFTER splash fade completes (1500ms fade-out duration)
        setTimeout(() => {
            this.mainMenu.style.display = 'flex';
            this.mainMenu.style.opacity = '1';
        }, 1500); // Wait for splash fade-out animation to complete
    }, remaining + 300); // Additional 300ms for fade transition
}

// ========================================
// WHAT THIS DOES
// ========================================

/*
FAST CONNECTION (images load in <2 seconds):
1. Images load quickly (e.g., 300ms)
2. System detects: "Too fast! Need 1700ms more for satisfying animation"
3. Progress bar smoothly animates from current % to 100% over 1700ms
4. Feels deliberate and polished, not janky

SLOW CONNECTION (images take >2 seconds):
5. Images load normally (e.g., 3000ms)
6. Progress bar fills naturally as images load
7. No artificial delay added
8. User sees real progress feedback

RESULT:
- Fast users: Smooth, satisfying 2-second progress animation
- Slow users: Real progress feedback, no unnecessary wait
- All users: Polished loading experience!
*/

// ========================================
// CONSOLE OUTPUT EXAMPLES
// ========================================

// FAST CONNECTION:
// ✅ Loading complete: 14/14 loaded in 287ms
// ⏱️ Fast load detected (287ms). Simulating smooth progress for 1713ms more...
// Proceeding to menu. Elapsed: 2150ms, User skipped: false, Waiting: 3850ms more

// SLOW CONNECTION:
// ✅ Loading complete: 14/14 loaded in 3241ms
// Proceeding to menu. Elapsed: 3350ms, User skipped: false, Waiting: 2650ms more

// SUPER FAST (CACHED):
// ✅ Loading complete: 14/14 loaded in 44ms
// ⏱️ Fast load detected (44ms). Simulating smooth progress for 1956ms more...
// Proceeding to menu. Elapsed: 2100ms, User skipped: false, Waiting: 3900ms more
