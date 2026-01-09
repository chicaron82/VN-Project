/**
 * Endings Content - Complete Export
 *
 * Exports epilogue scenes, credits data, and ending dialog configuration.
 */

// Epilogue
export {
  getEpilogueConfig,
  getEpilogueScenes,
  getEpilogueScene,
  getEpilogueStartScene,
  EPILOGUE_META,
  type EpilogueConfig,
} from './epilogue';

// Credits
export {
  PHOTO_POOLS,
  selectRandomPhotos,
  CREDITS_SECTIONS,
  CREDITS_TAGLINE,
  getEndingTitle,
  CREDITS_TIMING,
  getCreditsLayout,
  CREDITS_META,
  type PhotoPool,
  type PhotoPools,
  type CreditsSection,
  type CreditsPerson,
  type EndingTitle,
  type CreditsTiming,
  type CreditsLayout,
} from './credits';

// Ending Dialog
export {
  ENDING_DIALOG_OPTIONS,
  getEndingDialogTitle,
  getEndingDialogSubtitle,
  ENDING_DIALOG_NAVIGATION,
  ENDING_DIALOG_META,
  getEndingDialogStyle,
  type EndingDialogOption,
  type EndingDialogConfig,
  type EndingDialogNavigationConfig,
  type EndingDialogStyle,
} from './ending-dialog';
