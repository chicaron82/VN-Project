/**
 * Scene Type Definitions for V2
 * 
 * This is the foundation - get this right and everything else follows.
 */

/**
 * Core Scene Interface
 * A scene is a single unit of story content (dialogue, choices, transitions)
 */
export interface Scene {
  /** Unique scene identifier (e.g., "scene1_coffee") */
  id: string;
  
  /** Background image asset path */
  background?: string;
  
  /** Background music/audio asset path */
  music?: string;
  
  /** Character sprites to display */
  sprites?: SpriteConfig[];
  
  /** Dialogue entries (can be multiple for multi-page scenes) */
  dialogue: DialogueEntry | DialogueEntry[];
  
  /** Choice menu (optional) */
  choices?: Choice[];
  
  /** Visual effects to apply */
  effects?: Effect[];
  
  /** Tether impact (for Tori's route) */
  tetherImpact?: number;
  
  /** Next scene reference */
  next?: string | ConditionalNext;
  
  /** Flag changes (game state mutations) */
  flags?: FlagChange[];
  
  /** Auto-advance delay (ms) */
  delay?: number;
  
  /** Internal thought text (Tori's route) */
  internal?: string;
}

/**
 * Sprite Configuration
 */
export interface SpriteConfig {
  /** Position: "left" | "right" | "center" */
  position: 'left' | 'right' | 'center';
  
  /** Image asset path */
  image: string;
  
  /** Character name */
  character?: string;
  
  /** Emotion/expression variant */
  emotion?: string;
  
  /** Fade in/out settings */
  fade?: {
    in?: boolean;
    out?: boolean;
    duration?: number;
  };
}

/**
 * Dialogue Entry
 * Single page of dialogue text
 */
export interface DialogueEntry {
  /** Speaker name or "Narrator" */
  character: string;
  
  /** Dialogue text */
  text: string;
  
  /** Emotion/expression */
  emotion?: string;
  
  /** Voice clip asset */
  voice?: string;
  
  /** Internal thought (Tori's route) */
  internal?: string;
}

/**
 * Choice Definition
 */
export interface Choice {
  /** Choice text displayed to player */
  text: string;
  
  /** Next scene ID when selected */
  next: string;
  
  /** Condition (optional - must be true to show) */
  condition?: Condition;
  
  /** Tether cost (Tori's route) */
  tetherCost?: number;
  
  /** Flag changes on selection */
  flags?: FlagChange[];
}

/**
 * Conditional Scene Reference
 * Next scene depends on game state
 */
export interface ConditionalNext {
  /** Default next scene */
  default: string;
  
  /** Conditional branches */
  conditions?: Array<{
    /** Condition to check */
    condition: Condition;
    
    /** Scene ID if condition is true */
    next: string;
  }>;
}

/**
 * Condition Definition
 * Checks game state
 */
export interface Condition {
  /** Flag name to check */
  flag?: string;
  
  /** Flag value (if checking boolean) */
  value?: boolean;
  
  /** Counter name to check */
  counter?: string;
  
  /** Counter comparison */
  counterOp?: '<' | '>' | '<=' | '>=' | '===';
  
  /** Counter value to compare against */
  counterValue?: number;
  
  /** Route name (if checking route) */
  route?: 'ronnie' | 'tori';
  
  /** Logical operators for complex conditions */
  and?: Condition[];
  or?: Condition[];
  not?: Condition;
}

/**
 * Flag Change
 * Modifies game state
 */
export interface FlagChange {
  /** Flag name */
  name: string;
  
  /** New value */
  value: boolean | number | string;
}

/**
 * Visual Effect
 */
export interface Effect {
  /** Effect type */
  type: 'fade' | 'glitch' | 'shake' | 'flash' | 'corrupt';
  
  /** Effect parameters */
  params?: Record<string, unknown>;
  
  /** Duration (ms) */
  duration?: number;
}

/**
 * Route Definition
 * Complete route (Act 1-3 + endings)
 */
export interface Route {
  /** Route ID */
  id: 'ronnie' | 'tori';
  
  /** Route display name */
  name: string;
  
  /** Route description */
  description: string;
  
  /** Starting scene ID */
  startScene: string;
  
  /** All scenes in this route */
  scenes: Scene[];
}

/**
 * Example Scene (V2 JSON format)
 * 
 * This would be stored as: content/routes/tori/act1.json
 */
export const exampleScene: Scene = {
  id: "scene1_coffee",
  background: "assets/genericBack.png",
  sprites: [
    {
      position: "left",
      image: "assets/full-sprite-tori.webp",
      character: "Tori",
      fade: { in: true, duration: 500 }
    }
  ],
  dialogue: {
    character: "Tori (internal)",
    text: "French Vanilla for Ronnie. He always asks for this one.",
    internal: "[Visual: Coffee shop. Tori picks up the drink, checks her Tamagotchi while walking out.]"
  },
  next: "scene1_distracted",
  delay: 3000,
  flags: [
    { name: "note_unlocked_z1", value: true }
  ]
};

/**
 * Example Choice Scene
 */
export const exampleChoiceScene: Scene = {
  id: "scene_choice_example",
  background: "assets/genericBack.png",
  dialogue: {
    character: "Tori",
    text: "What should I do?"
  },
  choices: [
    {
      text: "Trust Hope",
      next: "scene_trust_hope",
      tetherCost: -5,
      flags: [{ name: "chose_hope", value: true }]
    },
    {
      text: "Listen to Despair",
      next: "scene_listen_despair",
      tetherCost: 10,
      condition: { flag: "despair_aware", value: true }
    }
  ]
};
