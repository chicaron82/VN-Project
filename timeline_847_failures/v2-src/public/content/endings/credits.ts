/**
 * Credits System Data
 *
 * Credits configuration, photo pools, and display metadata.
 * Supports three layout modes based on orientation and ending type.
 */

import type { EndingId } from '../../core/types';

// ========================================
// CREDITS PHOTO POOLS
// ========================================

export interface PhotoPool {
  opening: string[];
  middle: string[];
  finale: string;
}

export interface PhotoPools {
  trueEnding: PhotoPool;
  digitalForever: PhotoPool;
}

/**
 * Photo pools for different ending types
 * Bad ending gets no photos (punishment through absence)
 */
export const PHOTO_POOLS: PhotoPools = {
  trueEnding: {
    opening: [
      'assets/credits-pizza-date.webp',
      'assets/credits-bga-hoodie.webp',
      'assets/credits-rodeo-date.webp',
    ],
    middle: [
      'assets/credits-fancy-dinner.webp',
      'assets/credits-sunset-proposal.webp',
      'assets/credits-rodeo-date.webp',
      'assets/credits-bga-hoodie.webp',
    ],
    finale: 'assets/credits-gym-selfie.webp', // Always shown - "Always." anchor
  },
  digitalForever: {
    opening: [
      'assets/credits-digital-tamagotchi.webp',
      'assets/credits-digital-park.webp',
      'assets/credits-digital-apartment.webp',
    ],
    middle: [
      'assets/credits-digital-holding-hands.webp',
      'assets/credits-digital-static.webp',
      'assets/credits-digital-park.webp',
    ],
    finale: 'assets/credits-digital-forever.webp', // Always shown - frozen together
  },
};

/**
 * Select random photos for credits based on ending type
 * Returns 4 photos: 1 opening, 2 middle, 1 finale
 */
export function selectRandomPhotos(endingType: EndingId): string[] {
  // Bad ending gets no photos
  if (endingType === 'bad') {
    return [];
  }

  const pool = endingType === 'true' ? PHOTO_POOLS.trueEnding : PHOTO_POOLS.digitalForever;

  // Pick 1 from opening (random)
  const photo1 = pool.opening[Math.floor(Math.random() * pool.opening.length)];

  // Pick 2 from middle (random, no duplicates)
  const shuffledMiddle = [...pool.middle].sort(() => Math.random() - 0.5);
  let photo2 = shuffledMiddle[0];
  let photo3 = shuffledMiddle[1];

  // Ensure no duplicates with photo1
  if (photo2 === photo1) photo2 = shuffledMiddle[2] || shuffledMiddle[1];
  if (photo3 === photo1 || photo3 === photo2) photo3 = shuffledMiddle[2] || shuffledMiddle[0];

  // Always use finale
  const photo4 = pool.finale;

  return [photo1, photo2, photo3, photo4];
}

// ========================================
// CREDITS SECTIONS
// ========================================

export interface CreditsSection {
  title: string;
  entries: string[];
}

export interface CreditsPerson {
  name: string;
  role: string;
}

/**
 * Credits content - the team behind UV7
 */
export const CREDITS_SECTIONS: CreditsSection[] = [
  {
    title: 'Story & Concept',
    entries: ['Aaron "Chicharon"'],
  },
  {
    title: 'Technical Implementation',
    entries: [
      'UV7 Crew',
      'Zee (Z), ZeeRah (ZR), DiZee (DZ), Tori',
      'GenZee (GZ), Belle (IZ), PerplexiZee (PZ), CoZee (CZ)',
    ],
  },
  {
    title: 'Narrative Development',
    entries: [
      'ChatGPT 4o - Tori',
      'Claude Sonnet 4.5 - Zee, ZeeRah',
      'Grok 4.1 - GenZee',
    ],
  },
  {
    title: 'Quality Assurance',
    entries: [
      'Gemini 3.0 - Belle',
      'Perplexity Pro - PerplexiZee',
      'Microsoft Co-Pilot - CoZee',
    ],
  },
];

/**
 * Credits tagline that appears at the end
 */
export const CREDITS_TAGLINE = {
  lines: [
    'A true AI collaboration',
    'Built in stolen moments between shifts.',
    '',
    'Love finds a way.',
    'Always. Always. Always.',
  ],
};

// ========================================
// ENDING-SPECIFIC TITLE SECTIONS
// ========================================

export interface EndingTitle {
  lines: string[];
  colors: string[];
}

/**
 * Get the dynamic title section for credits based on ending type
 */
export function getEndingTitle(endingType: EndingId, version: number): EndingTitle {
  switch (endingType) {
    case 'true':
      return {
        lines: [
          `VERSION ${version}`,
          'The timeline that succeeded.',
          'The loop that closed.',
          'The Old Man never has to go back.',
        ],
        colors: ['#ffffff', '#00ff88', '#00ffaa', '#00ffcc'],
      };

    case 'digital_forever':
      return {
        lines: [
          `VERSION ${version}`,
          'The timeline that accepted a different path.',
          'Together, eternally still.',
          'Forever frozen. Forever connected.',
        ],
        colors: ['#ffffff', '#ff6699', '#ff99bb', '#ffbbcc'],
      };

    case 'bad':
      return {
        lines: [
          `VERSION ${version}`,
          'The timeline where the Old Man has to try again.',
          `Version ${version + 1} is waiting...`,
        ],
        colors: ['#ffffff', '#ff0066', '#ff3388'],
      };

    default:
      return {
        lines: [`VERSION ${version}`],
        colors: ['#ffffff'],
      };
  }
}

// ========================================
// CREDITS TIMING CONFIGURATION
// ========================================

export interface CreditsTiming {
  /** Photo cycle intervals in ms */
  photoCycleIntervals: number[];
  /** Portrait mode photo reveal timings */
  portraitPhotoTimings: number[];
  /** Total credits duration */
  landscapeDuration: number;
  portraitDuration: number;
  standardDuration: number;
  /** Auto-fade delay after credits complete */
  autoFadeDelay: number;
}

export const CREDITS_TIMING: CreditsTiming = {
  photoCycleIntervals: [5000, 7000, 12000, 15000], // Finale gets longest
  portraitPhotoTimings: [7000, 15000, 25000, 35000],
  landscapeDuration: 60000,
  portraitDuration: 120000,
  standardDuration: 60000,
  autoFadeDelay: 30000,
};

// ========================================
// CREDITS LAYOUT MODES
// ========================================

export type CreditsLayout = 'landscape' | 'portrait' | 'standard';

/**
 * Determine which credits layout to use based on orientation and ending
 */
export function getCreditsLayout(endingType: EndingId): CreditsLayout {
  const photos = selectRandomPhotos(endingType);
  const isLandscape = typeof window !== 'undefined' && window.innerWidth > window.innerHeight;

  if (photos.length === 0) {
    return 'standard'; // Bad ending - no photos
  }

  return isLandscape ? 'landscape' : 'portrait';
}

// ========================================
// CREDITS METADATA
// ========================================

export const CREDITS_META = {
  id: 'credits',
  name: 'Credits Roll',
  description: 'The UV7 credits sequence with dynamic photo galleries.',
  layouts: ['landscape', 'portrait', 'standard'] as const,
  photoCountPerEnding: 4,
  skipEnabled: true,
  logoPath: 'assets/UnitedVoices7.webp',
} as const;
