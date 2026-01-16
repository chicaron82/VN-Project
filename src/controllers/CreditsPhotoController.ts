/**
 * ════════════════════════════════════════════════════════════════
 * CREDITS PHOTO CONTROLLER - V2 Port
 * Phase 22g: Credits Photo Selection
 *
 * V1 Parity: system/credits-photo-controller.js (103 lines → ~140 lines)
 *
 * Purpose:
 * - Randomized photo selection for ending credits
 * - Different photo pools for different endings
 * - Ensures visual variety across playthroughs
 * - Punishment through absence (bad ending = no photos)
 *
 * Features:
 * - True ending photo pool
 * - Digital Forever ending photo pool
 * - Bad ending handling (no photos)
 * - Random selection with no duplicates
 * - Always show finale photo
 *
 * V1 Parity Notes:
 * - Photo pools unchanged
 * - Randomization logic identical
 * - Console logging format unchanged
 * - Finale photo always shown
 *
 * 📸 "Visual storytelling through memories." - Version 848
 * ════════════════════════════════════════════════════════════════
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

interface PhotoPool {
    opening: string[];
    middle: string[];
    finale: string;
}

interface PhotoPools {
    trueEnding: PhotoPool;
    digitalForever: PhotoPool;
}

type EndingType = 'true' | 'digital' | 'bad' | 'none';

interface GameReference {
    // Reserved for future integration
}

export class CreditsPhotoController {
    constructor(_game: GameReference) {
        // Reserved for future integration
    }

    // ========================================
    // PHOTO POOLS
    // ========================================

    private getPools(): PhotoPools {
        return {
            trueEnding: {
                opening: [
                    'assets/credits-pizza-date.webp',
                    'assets/credits-bga-hoodie.webp',
                    'assets/credits-rodeo-date.webp'
                ],
                middle: [
                    'assets/credits-fancy-dinner.webp',
                    'assets/credits-sunset-proposal.webp',
                    'assets/credits-rodeo-date.webp',
                    'assets/credits-bga-hoodie.webp'
                ],
                finale: 'assets/credits-gym-selfie.webp' // Always shown - "Always." anchor
            },
            digitalForever: {
                opening: [
                    'assets/credits-digital-tamagotchi.webp',
                    'assets/credits-digital-park.webp',
                    'assets/credits-digital-apartment.webp'
                ],
                middle: [
                    'assets/credits-digital-holding-hands.webp',
                    'assets/credits-digital-static.webp',
                    'assets/credits-digital-park.webp'
                ],
                finale: 'assets/credits-digital-forever.webp' // Always shown - frozen together
            }
        };
    }

    // ========================================
    // RANDOM SELECTION
    // ========================================

    public selectRandom(endingType: EndingType): string[] {
        const pools = this.getPools();

        // Bad ending gets no photos (punishment through absence)
        if (endingType === 'bad' || endingType === 'none') {
            console.log('🚫 Bad ending - no photos (punishment)');
            return [];
        }

        // Get pool for this ending
        const pool = endingType === 'true' ? pools.trueEnding : pools.digitalForever;

        // Pick 1 from opening pool (random)
        const photo1 = pool.opening[Math.floor(Math.random() * pool.opening.length)] || pool.opening[0];

        // Pick 2 from middle pool (random, no duplicates)
        const shuffledMiddle = [...pool.middle].sort(() => Math.random() - 0.5);
        let photo2 = shuffledMiddle[0] || pool.middle[0];
        let photo3 = shuffledMiddle[1] || pool.middle[1];

        // Ensure photo2 and photo3 are different from photo1
        if (photo2 === photo1) photo2 = shuffledMiddle[2] || shuffledMiddle[1] || pool.middle[0];
        if (photo3 === photo1 || photo3 === photo2) photo3 = shuffledMiddle[2] || shuffledMiddle[0] || pool.middle[1];

        // Always use finale
        const photo4 = pool.finale;

        console.log(`📸 Selected photos for ${endingType}:`);
        console.log(`   Opening: ${photo1!.split('/').pop()}`);
        console.log(`   Middle 1: ${photo2!.split('/').pop()}`);
        console.log(`   Middle 2: ${photo3!.split('/').pop()}`);
        console.log(`   Finale: ${photo4.split('/').pop()} ⭐`);

        return [photo1!, photo2!, photo3!, photo4];
    }
}
