// ========================================
// CREDITS PHOTO CONTROLLER
// Randomized visual storytelling for endings
// SOLID Refactor: Extracted from GameEngine
// ========================================

/**
 * CreditsPhotoController
 * 
 * Manages photo pools for different ending types.
 * Randomizes photo selection for visual variety in credits.
 * 
 * @class CreditsPhotoController
 */
class CreditsPhotoController {
    constructor(game) {
        this.game = game;
    }

    // ========================================
    // PHOTO POOLS
    // ========================================

    getPools() {
        return {
            trueEnding: {
                opening: [
                    'assets/credits-pizza-date.png',
                    'assets/credits-bga-hoodie.png',
                    'assets/credits-rodeo-date.png'
                ],
                middle: [
                    'assets/credits-fancy-dinner.png',
                    'assets/credits-sunset-proposal.png',
                    'assets/credits-rodeo-date.png',
                    'assets/credits-bga-hoodie.png'
                ],
                finale: 'assets/credits-gym-selfie.png' // Always shown - "Always." anchor
            },
            digitalForever: {
                opening: [
                    'assets/credits-digital-tamagotchi.png',
                    'assets/credits-digital-park.png',
                    'assets/credits-digital-apartment.png'
                ],
                middle: [
                    'assets/credits-digital-holding-hands.png',
                    'assets/credits-digital-static.png',
                    'assets/credits-digital-park.png'
                ],
                finale: 'assets/credits-digital-forever.png' // Always shown - frozen together
            }
        };
    }

    // ========================================
    // RANDOM SELECTION
    // ========================================

    selectRandom(endingType) {
        const pools = this.getPools();

        // Bad ending gets no photos (punishment through absence)
        if (endingType === 'bad' || endingType === 'none') {
            console.log('🚫 Bad ending - no photos (punishment)');
            return [];
        }

        // Get pool for this ending
        const pool = endingType === 'true' ? pools.trueEnding : pools.digitalForever;

        // Pick 1 from opening pool (random)
        const photo1 = pool.opening[Math.floor(Math.random() * pool.opening.length)];

        // Pick 2 from middle pool (random, no duplicates)
        const shuffledMiddle = [...pool.middle].sort(() => Math.random() - 0.5);
        let photo2 = shuffledMiddle[0];
        let photo3 = shuffledMiddle[1];

        // Ensure photo2 and photo3 are different from photo1
        if (photo2 === photo1) photo2 = shuffledMiddle[2] || shuffledMiddle[1];
        if (photo3 === photo1 || photo3 === photo2) photo3 = shuffledMiddle[2] || shuffledMiddle[0];

        // Always use finale
        const photo4 = pool.finale;

        console.log(`📸 Selected photos for ${endingType}:`);
        console.log(`   Opening: ${photo1.split('/').pop()}`);
        console.log(`   Middle 1: ${photo2.split('/').pop()}`);
        console.log(`   Middle 2: ${photo3.split('/').pop()}`);
        console.log(`   Finale: ${photo4.split('/').pop()} ⭐`);

        return [photo1, photo2, photo3, photo4];
    }
}

// Global assignment for browser
if (typeof window !== 'undefined') {
    window.CreditsPhotoController = CreditsPhotoController;
}

// ES Module export
export { CreditsPhotoController };
