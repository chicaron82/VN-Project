/**
 * Ronnie Route - Act 3: Crisis, Mad Dash, and All Endings
 *
 * Memory fracture, the race to the hospital, and three possible endings:
 * - True Ending: Makes it in time, Tori returns to her body
 * - Bad Ending: Too late, the loop begins again
 * - Digital Forever: Ronnie joins Tori in the device
 */

import type { Scene } from '../../../core/types';

export const RONNIE_ACT3_SCENES: Scene[] = [
  // ========================================
  // BEAT 2: MEMORY FRACTURE
  // Tori's memories start corrupting
  // ========================================
  {
    id: 'ronnie-act3-start',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'narration',
        text: '"Over the next few days, it got worse. She\'d forget things. Small things at first."',
        internal: '[Visual: Digital apartment. Tori cooking breakfast - movements glitchy, repeating.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act3-beat2-forgetting',
  },

  {
    id: 'ronnie-act3-beat2-forgetting',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'surprised', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        emotion: 'surprised',
        text: '"Baby, what\'s our anniversary date again?"',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'ronnie-act3-beat2-answer',
  },

  {
    id: 'ronnie-act3-beat2-answer',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"June 12th. We\'ve celebrated it four times."',
        internal: '[She knows this. She KNOWS this. Why is she asking?]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat2-realization',
  },

  {
    id: 'ronnie-act3-beat2-realization',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        emotion: 'worried',
        text: '"I knew that. I KNEW that. Why couldn\'t I... Ronnie, what\'s happening to me?"',
        internal: '[Her sprite flickers. Eyes wide with fear.]',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'low', duration: 300 },
    ],
    style: 'critical',
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat2-promise',
  },

  {
    id: 'ronnie-act3-beat2-promise',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
      { character: 'tori', emotion: 'sad', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"It\'s okay. We\'ll figure it out. I promise."',
        internal: '[Ronnie (internal): "But I had no idea how. The code was stable. What was causing this?"]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act3-beat3',
  },

  // ========================================
  // BEAT 3: SYSTEM MESSAGES INTRUDE
  // ========================================
  {
    id: 'ronnie-act3-beat3',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'Then the messages started appearing.',
        internal: '[Visual: Text overlays bleeding through the game world. Red warnings.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'ronnie-act3-beat3-first-message',
  },

  {
    id: 'ronnie-act3-beat3-first-message',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'system',
        text: '⚠️ WARNING: MEMORY CORRUPTION DETECTED\n⚠️ VESSEL INSTABILITY: 67%\n⚠️ RECOMMEND IMMEDIATE DIAGNOSTICS',
        internal: '[The text appears over Tori\'s sprite. She can see it too.]',
      },
    ],
    style: 'critical',
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat3-tori-sees',
  },

  {
    id: 'ronnie-act3-beat3-tori-sees',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"Ronnie... I can see that. The warnings. Vessel instability? What vessel?"',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat3-hesitates',
  },

  {
    id: 'ronnie-act3-beat3-hesitates',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Just... system diagnostics. Nothing to worry about."',
        internal: '[Ronnie (internal): "I couldn\'t tell her. Not yet. Not while she was already scared."]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat3-more-warnings',
  },

  {
    id: 'ronnie-act3-beat3-more-warnings',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'system',
        text: '⚠️ CRITICAL: BATTERY DEPLETION ACCELERATING\n⚠️ CONSCIOUSNESS ANCHOR: UNSTABLE\n⚠️ ESTIMATED TIME TO FAILURE: 72 HOURS',
        internal: '[More messages. Faster now. Tori\'s sprite glitches harder with each one.]',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'medium', duration: 400 },
    ],
    style: 'critical',
    autoAdvanceDelay: 3500,
    next: 'ronnie-act3-beat3-tori-demands',
  },

  {
    id: 'ronnie-act3-beat3-tori-demands',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'angry', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        emotion: 'angry',
        text: '"Ronnie. TELL ME. What\'s happening? What\'s the vessel? What\'s failing?"',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat4',
  },

  // ========================================
  // BEAT 4: FRAGMENTATION
  // ========================================
  {
    id: 'ronnie-act3-beat4',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'sad', position: 'left' },
      { character: 'tori', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"The Tori-Gatchi. You\'re... inside it. You messaged me in the game I made. I don\'t think my computer can handle your consciousness."',
        internal: '[Ronnie finally admits it. The truth he\'d been hiding.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-act3-beat4-processing',
  },

  {
    id: 'ronnie-act3-beat4-processing',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'sad', position: 'left' },
      { character: 'tori', emotion: 'surprised', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"I\'m... in the Tamagotchi. Not the game. The device itself."',
        internal: '[Her sprite stutters. Reality reshaping around the revelation.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat4-understanding',
  },

  {
    id: 'ronnie-act3-beat4-understanding',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'sad', position: 'left' },
      { character: 'tori', emotion: 'sad', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"The buzzes. The battery drain. That\'s me. I\'m killing the device just by existing in it."',
      },
    ],
    unlockNote: 'gz3', // GenZee's bootstrap paradox note
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat4-confirms',
  },

  {
    id: 'ronnie-act3-beat4-confirms',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'sad', position: 'left' },
      { character: 'tori', emotion: 'sad', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Yes. And when it dies... I don\'t know what happens to you. If you just... stop. Or if it\'s worse."',
        internal: '[The weight of it. The timer counting down.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act3-beat4-glitch',
  },

  {
    id: 'ronnie-act3-beat4-glitch',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'GLITCH.',
        internal: '[Tori\'s sprite fractures. Screen tears. Visual corruption spreads.]',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'high', duration: 500 },
      { type: 'shake', intensity: 'medium', duration: 300 },
    ],
    style: 'critical',
    autoAdvanceDelay: 1500,
    next: 'ronnie-act3-beat4-screaming',
  },

  {
    id: 'ronnie-act3-beat4-screaming',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
      { character: 'tori', emotion: 'hurt', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'distorted',
        text: '"I can feel it. The edges. I\'m coming apart. Ronnie, I\'m SCARED—"',
        internal: '[Her voice fragments mid-word. Sprite dissolving at the edges.]',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'medium', duration: 400 },
    ],
    style: 'critical',
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat4-grabs',
  },

  {
    id: 'ronnie-act3-beat4-grabs',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Hold on! Just—stay with me! I\'ll fix this!"',
        internal: '[He grabs the device. Holds it close. Like proximity could keep her together.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat5',
  },

  // ========================================
  // BEAT 5: REVELATION - BODY ANCHOR
  // ========================================
  {
    id: 'ronnie-act3-beat5',
    background: 'hospital',
    sprites: [],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'narration',
        text: '"And then I remembered. The hospital. The single buzz."',
        internal: '[Flashback: Device near Tori\'s body. One buzz. Different from the vessel transfers.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act3-beat5-realization',
  },

  {
    id: 'ronnie-act3-beat5-realization',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'happy', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"The body. Tori, your BODY. It\'s still there. Still alive. That buzz—you were reaching for it!"',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat5-tori-hope',
  },

  {
    id: 'ronnie-act3-beat5-tori-hope',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'through game',
        text: '"I felt something. Warmth. A pull. Different from the laptop."',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat5-theory',
  },

  {
    id: 'ronnie-act3-beat5-theory',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"If I bring the device close enough... if you can jump vessels... maybe you can jump HOME."',
        internal: '[The mad theory. Desperate. Beautiful. Terrifying.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act3-beat5-uncertain',
  },

  {
    id: 'ronnie-act3-beat5-uncertain',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'worried', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"But what if I can\'t? What if I just... dissolve? What if jumping destroys me?"',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat5-promise',
  },

  {
    id: 'ronnie-act3-beat5-promise',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Then we find another way. Upload you somewhere safer. Or... I don\'t know. But we\'re running out of time."',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act3-beat5-timer',
  },

  {
    id: 'ronnie-act3-beat5-timer',
    background: 'digitalSpace',
    sprites: [],
    dialog: [
      {
        speaker: 'system',
        text: '⚠️ CRITICAL BATTERY: 8% REMAINING\n⚠️ ESTIMATED TIME: 12 HOURS\n⚠️ DECISION REQUIRED',
        internal: '[The clock is ticking. He needs to act NOW.]',
      },
    ],
    style: 'critical',
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat6-upload',
  },

  // ========================================
  // BEAT 6: UPLOAD ATTEMPT FAILS
  // ========================================
  {
    id: 'ronnie-act3-beat6-upload',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"If the device can\'t hold you... I\'ll upload you somewhere bigger. The laptop. The cloud. ANYWHERE with more space!"',
        internal: '[He frantically opens his laptop. Connection protocols. Upload sequence initiating.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act3-beat6-progress',
  },

  {
    id: 'ronnie-act3-beat6-progress',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'system',
        text: 'TRANSFER PROTOCOL INITIATED\nUploading consciousness data...\n\n[████████████████░░░░] 73%\n\n⚠️ GLITCH DETECTED',
        internal: '[Dramatic pause at 73%]',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'high', duration: 400 },
    ],
    style: 'critical',
    autoAdvanceDelay: 4000,
    next: 'ronnie-act3-beat6-fails',
  },

  {
    id: 'ronnie-act3-beat6-fails',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'through device',
        text: '"Ronnie... I\'m still here. Still in the Tamagotchi. It didn\'t work."',
        internal: '[The upload failed. She can\'t be moved like data. She\'s consciousness, not code.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat6-realization',
  },

  {
    id: 'ronnie-act3-beat6-realization',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'surprised', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"You can\'t be uploaded. You\'re not DATA. You\'re a SOUL. And souls need... bodies."',
        internal: '[The pieces click. The single buzz at the hospital. Her body reaching for her.]',
      },
    ],
    unlockNote: 'pz2', // PerplexiZee's body anchor mechanics note
    autoAdvanceDelay: 4000,
    next: 'ronnie-act3-beat6-body-anchor',
  },

  {
    id: 'ronnie-act3-beat6-body-anchor',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'determined', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"My body. Ronnie, my BODY is still at the hospital. I felt it pull me when you were near!"',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat6-plan',
  },

  {
    id: 'ronnie-act3-beat6-plan',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Then that\'s the anchor. Device to hand. Heartbeat to heartbeat. You can jump BACK."',
        internal: '[Hope. Desperate. Dangerous. But possible.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act3-beat7-phone',
  },

  // ========================================
  // BEAT 7: THE CALL - HOSPITAL EMERGENCY
  // ========================================
  {
    id: 'ronnie-act3-beat7-phone',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'His phone SCREAMS.',
        internal: '[Incoming call: City General Hospital. ICU. URGENT.]',
      },
    ],
    style: 'critical',
    autoAdvanceDelay: 2000,
    next: 'ronnie-act3-beat7-nurse',
  },

  {
    id: 'ronnie-act3-beat7-nurse',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        variant: 'phone',
        text: '"Mr. Ronnie? It\'s City General. Tori\'s vitals just crashed. Heart rate erratic. Blood pressure dropping. You need to get here NOW."',
      },
    ],
    style: 'critical',
    autoAdvanceDelay: 4000,
    next: 'ronnie-act3-beat7-tamagotchi-buzz',
  },

  {
    id: 'ronnie-act3-beat7-tamagotchi-buzz',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'The Tamagotchi BUZZES VIOLENTLY in his hand.',
        internal: '[Screen flashing red. Battery: 3%. She\'s dying. Both versions of her. Simultaneously.]',
      },
    ],
    effects: [
      { type: 'haptic', hapticType: 'emergency', reason: 'Tamagotchi emergency buzz' },
      { type: 'shake', intensity: 'high', duration: 500 },
    ],
    style: 'critical',
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat7-tori-screaming',
  },

  {
    id: 'ronnie-act3-beat7-tori-screaming',
    background: 'digitalSpace',
    sprites: [
      { character: 'tori', emotion: 'hurt', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'distorted',
        text: '"RONNIE! I can feel it! Both of me! I\'m FRACTURING—"',
        internal: '[Her voice cuts out. Static. The connection fraying.]',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'high', duration: 600 },
    ],
    style: 'critical',
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-beat7-decision',
  },

  {
    id: 'ronnie-act3-beat7-decision',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Hold on. HOLD ON. I\'m coming!"',
        internal: '[He grabs his keys. The Tamagotchi. Sprints for the door.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'ronnie-act3-mad-dash-start',
  },

  // ========================================
  // THE MAD DASH - SHARED SEQUENCE
  // ========================================
  {
    id: 'ronnie-act3-mad-dash-start',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'THE MAD DASH BEGINS.',
        internal: '[Visual: Ronnie bursts through apartment door. Tamagotchi clutched tight. Sprinting down stairs.]',
      },
    ],
    autoAdvanceDelay: 2000,
    next: 'ronnie-act3-mad-dash-streets',
  },

  {
    id: 'ronnie-act3-mad-dash-streets',
    background: 'apartment',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'City streets blur past. Red lights ignored. Horns blaring. He doesn\'t stop.',
        internal: '[Tamagotchi screen: Battery 2%. Tori\'s sprite flickering. Fading.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-act3-mad-dash-hospital',
  },

  {
    id: 'ronnie-act3-mad-dash-hospital',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'HOSPITAL. ICU FLOOR. ALARMS SCREAMING.',
        internal: '[Visual: Ronnie bursts through lobby. Elevator too slow. Takes stairs. Three at a time.]',
      },
    ],
    style: 'critical',
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-mad-dash-corridors',
  },

  {
    id: 'ronnie-act3-mad-dash-corridors',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'Corridor. Room 302. Medical staff swarming. Crash cart.',
        internal: '[He can see her room. Door ahead. Nurses blocking the way.]',
      },
    ],
    style: 'critical',
    autoAdvanceDelay: 3000,
    next: 'ronnie-act3-mad-dash-monitor',
  },

  {
    id: 'ronnie-act3-mad-dash-monitor',
    background: 'hospital',
    sprites: [],
    dialog: [
      {
        speaker: 'system',
        text: '⚠️ BATTERY: 1%\n⚠️ PATIENT VITALS: CRITICAL\n⚠️ ESTIMATED TIME TO FLATLINE: 60 SECONDS',
        internal: '[Both timers converging. Body dying. Device dying. One minute.]',
      },
    ],
    style: 'critical',
    autoAdvanceDelay: 3500,
    next: 'ronnie-act3-critical-choice',
  },

  // ========================================
  // CRITICAL CHOICE - DETERMINES ENDING
  // ========================================
  {
    id: 'ronnie-act3-critical-choice',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'internal',
        text: 'One minute. One choice. Everything depends on this.',
        internal: '[What do you do?]',
      },
    ],
    choices: [
      {
        text: '[Push through - GET TO HER NOW]',
        next: 'ronnie-ending-true-start',
        flags: [{ name: 'final_choice_push_through', value: true }],
      },
      {
        text: '[Stop and explain to medical staff]',
        next: 'ronnie-ending-bad-start',
        flags: [{ name: 'final_choice_explain', value: true }],
      },
      {
        text: '[Connect to her digitally one last time]',
        next: 'ronnie-ending-digital-start',
        flags: [{ name: 'final_choice_connect', value: true }],
      },
    ],
  },

  // ========================================
  // TRUE ENDING - MAKES IT IN TIME
  // ========================================
  {
    id: 'ronnie-ending-true-start',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'HE PUSHES THROUGH.',
        internal: '[Nurses try to stop him. He doesn\'t hear them. Doesn\'t see them. Only her.]',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'ronnie-ending-true-burst',
  },

  {
    id: 'ronnie-ending-true-burst',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'He BURSTS through the door.',
        internal: '[Her body convulsing. Alarms blaring. Medical staff scrambling. Monitor showing erratic heartbeat.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-ending-true-move',
  },

  {
    id: 'ronnie-ending-true-move',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'shouting',
        text: '"Move!"',
        internal: '[He reaches her bedside. Places the Tamagotchi in her palm. Closes her fingers around it with his own hand covering hers.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-ending-true-anchor',
  },

  {
    id: 'ronnie-ending-true-anchor',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Come home. Follow the heartbeat."',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-ending-true-transfer',
  },

  {
    id: 'ronnie-ending-true-transfer',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'through device',
        text: '"I feel it... the pull... I\'m—',
        internal: '[Visual: Tamagotchi screen. Tori\'s sprite begins to dissolve - not glitch, but fade like mist.]\n[Visual: Her real hand twitches.]\n[Monitor stabilizes slightly. Beeping slows from erratic to rhythmic.]\n[Her eyes move beneath closed lids.]',
      },
    ],
    effects: [
      { type: 'haptic', hapticType: 'double', reason: 'Double buzz - Tori returns to her body' },
    ],
    autoAdvanceDelay: 4500,
    next: 'ronnie-ending-true-whisper',
  },

  {
    id: 'ronnie-ending-true-whisper',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'sad', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'whispers',
        text: '"That\'s it. That\'s it, baby. Follow me back."',
        internal: '[Visual: Tamagotchi screen goes completely white. Then dark. Silent.]\n[Beat of silence.]\n[Her eyes flutter open.]',
      },
    ],
    autoAdvanceDelay: 5000,
    next: 'ronnie-ending-true-awakening',
  },

  {
    id: 'ronnie-ending-true-awakening',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'happy', position: 'left' },
      { character: 'tori', emotion: 'surprised', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"...Ronnie?"',
        internal: '[He breaks. Collapses forward, forehead against her hand.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-ending-true-always',
  },

  {
    id: 'ronnie-ending-true-always',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'happy', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Always. Always. Always."',
        internal: '[She lifts her free hand shakily. Touches his hair. Strokes it.]\n[They cry together. No words. Just breathing.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-ending-true-terrible',
  },

  {
    id: 'ronnie-ending-true-terrible',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'happy', position: 'left' },
      { character: 'tori', emotion: 'smirk', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        emotion: 'smirk',
        text: '"You look terrible."',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'ronnie-ending-true-months',
  },

  {
    id: 'ronnie-ending-true-months',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'happy', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        emotion: 'happy',
        text: '"You\'ve been asleep for months."',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'ronnie-ending-true-scared',
  },

  {
    id: 'ronnie-ending-true-scared',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'sad', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        emotion: 'sad',
        text: '"I was so scared. I couldn\'t find you. And then I could. But I couldn\'t touch you."',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-ending-true-home',
  },

  {
    id: 'ronnie-ending-true-home',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'happy', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"You\'re here now. You\'re real. You\'re home."',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-ending-true-toast',
  },

  {
    id: 'ronnie-ending-true-toast',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'happy', position: 'left' },
      { character: 'tori', emotion: 'smirk', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        emotion: 'smirk',
        text: '"So... you up for some burnt toast?"',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'ronnie-ending-true-pasta',
  },

  {
    id: 'ronnie-ending-true-pasta',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'happy', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        emotion: 'happy',
        text: '"Only if I get to oversalt the pasta."',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-ending-true-final',
  },

  {
    id: 'ronnie-ending-true-final',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'happy', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'narration',
        text: '"For once, love wasn\'t trapped in glass. It came home."',
        internal: '[Visual: Morning light through hospital window. Golden. Warm.]\n[Tori\'s hand resting on Ronnie\'s head. He\'s kneeling beside her bed. Eyes closed. Finally at peace.]\n[Tamagotchi on bedside table. Screen glowing faintly - sprite image synced with Tori\'s real smile.]\n\n**TRUE ENDING**\n"She came home."',
      },
    ],
    effects: [
      { type: 'fade', intensity: 'low', duration: 2000 },
    ],
    flags: [
      { name: 'ending_true_complete', value: true },
      { name: 'skip_prologue_unlocked', value: true },
    ],
    next: 'epilogue-start', // Transitions to shared epilogue
  },

  // ========================================
  // BAD ENDING - TOO LATE
  // ========================================
  {
    id: 'ronnie-ending-bad-start',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'worried', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"You don\'t understand! She\'s IN the device! Her consciousness! I need to—"',
        internal: '[The nurses exchange glances. Confused. Concerned. One reaches for his arm.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-ending-bad-too-late',
  },

  {
    id: 'ronnie-ending-bad-too-late',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'hurt', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'The monitor flatlines.',
        internal: '[A single, sustained tone. The Tamagotchi screen goes dark. Both gone. Simultaneously.]',
      },
    ],
    style: 'critical',
    autoAdvanceDelay: 3000,
    next: 'ronnie-ending-bad-nurse-words',
  },

  {
    id: 'ronnie-ending-bad-nurse-words',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'hurt', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: '"I\'m sorry. We did everything we could."',
        internal: '[He was 15 seconds too late. Just 15 seconds.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-ending-bad-staring',
  },

  {
    id: 'ronnie-ending-bad-staring',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'sad', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        variant: 'narration',
        text: '"She was gone. And I\'d been too late."',
        internal: '[Ronnie doesn\'t respond. Staring at the Tamagotchi in his hand.]\n[Fade to black.]',
      },
    ],
    effects: [
      { type: 'fade', duration: 2000 },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-ending-bad-time-skip',
  },

  {
    id: 'ronnie-ending-bad-time-skip',
    background: 'apartment',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'Years later...',
        internal: '[Visual: Dimly lit workshop. Older Ronnie, silver hair, faded BGA hoodie. Soldering iron in hand.]\n[Workbench: Tori\'s original Tamagotchi, disassembled. Modified circuitry. Notes everywhere.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-ending-bad-news',
  },

  {
    id: 'ronnie-ending-bad-news',
    background: 'apartment',
    sprites: [
      { character: 'oldRonnie', emotion: 'neutral', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: '"—breakthrough in temporal displacement technology announced today—"',
        internal: '[TV in background. Old Ronnie\'s hand pauses. He looks up.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-ending-bad-chance',
  },

  {
    id: 'ronnie-ending-bad-chance',
    background: 'apartment',
    sprites: [
      { character: 'oldRonnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'oldRonnie',
        text: '"...There\'s still a chance."',
        internal: '[Visual: He picks up the modified Tamagotchi. Screen glows faintly.]\n[Fade to black.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-ending-bad-before-bump',
  },

  {
    id: 'ronnie-ending-bad-before-bump',
    background: 'apartment',
    sprites: [
      { character: 'oldRonnie', emotion: 'neutral', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: '',
        internal: '[Visual: Street corner, same location as Scene 1. An older man with silver hair stands in shadow, BGA hoodie prominent. He holds a worn Tamagotchi device - labeled "Ronnie-gatchi v1.0"]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-ending-bad-preparation',
  },

  {
    id: 'ronnie-ending-bad-preparation',
    background: 'apartment',
    sprites: [
      { character: 'oldRonnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'oldRonnie',
        text: '"One more time. This has to work."',
        internal: '[He looks at the device, then around the corner where young Tori will appear]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-ending-bad-give-tools',
  },

  {
    id: 'ronnie-ending-bad-give-tools',
    background: 'apartment',
    sprites: [
      { character: 'oldRonnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'oldRonnie',
        text: '"Give her the tools. Give myself the tools I never had."',
        internal: '[He takes a breath, steps around the corner]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-ending-bad-loop-begins',
  },

  {
    id: 'ronnie-ending-bad-loop-begins',
    background: 'apartment',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: 'You\'ve seen this before... haven\'t you?',
        internal: '[The bump scene from the prologue begins to play. But this time, you recognize the old man in the BGA hoodie.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-ending-bad-retry-loop',
  },

  {
    id: 'ronnie-ending-bad-retry-loop',
    background: 'apartment',
    sprites: [
      { character: 'oldRonnie', emotion: 'sad', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'oldRonnie',
        variant: 'narration',
        text: '"I spent years refining it. Perfecting the bridge. When they finally cracked time travel... I knew what I had to do. One chance. One moment. To give us both a second try."',
        internal: '[Visual: Sunny street. Old Ronnie\'s perspective. Young Tori walks by, distracted by her Tamagotchi.]',
      },
    ],
    autoAdvanceDelay: 6000,
    next: 'ronnie-ending-bad-bump',
  },

  {
    id: 'ronnie-ending-bad-bump',
    background: 'apartment',
    sprites: [
      { character: 'oldRonnie', emotion: 'sad', position: 'left' },
      { character: 'tori', emotion: 'surprised', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'oldRonnie',
        variant: 'narration',
        text: '"I\'m sorry I couldn\'t save you the first time. But maybe... maybe I can save us both."',
        internal: '[He steps forward. She bumps into him. Both Tamagotchis fall. She picks up his modified toy. It buzzes in her hand.]',
      },
    ],
    autoAdvanceDelay: 5000,
    next: 'ronnie-ending-bad-apology',
  },

  {
    id: 'ronnie-ending-bad-apology',
    background: 'apartment',
    sprites: [
      { character: 'oldRonnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'surprised', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"Oh my gosh, I\'m so sorry—I wasn\'t paying attention!"',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'ronnie-ending-bad-warning',
  },

  {
    id: 'ronnie-ending-bad-warning',
    background: 'apartment',
    sprites: [
      { character: 'oldRonnie', emotion: 'sad', position: 'left' },
      { character: 'tori', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'oldRonnie',
        text: '"No problem. Hang on to that. It may save your life someday."',
        internal: '[He picks up her original device. Clutches it. Walks away.]\n[Visual: Camera follows him. He glances back once - sees young Ronnie waiting at home for her.]',
      },
    ],
    autoAdvanceDelay: 5000,
    next: 'ronnie-ending-bad-final',
  },

  {
    id: 'ronnie-ending-bad-final',
    background: 'apartment',
    sprites: [
      { character: 'oldRonnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'oldRonnie',
        variant: 'narration',
        text: '"Don\'t make the same mistakes I did. Get there in time."',
        internal: '[Fade to white.]\n\n**BAD ENDING: THE LOOP BEGINS AGAIN**\n"Love trapped in glass."\n\n[System restarting...]',
      },
    ],
    effects: [
      { type: 'fade', intensity: 'high', duration: 2000 },
    ],
    flags: [
      { name: 'ending_bad_complete', value: true },
      { name: 'skip_prologue_unlocked', value: true },
    ],
    next: 'ending-menu', // Returns to ending menu
  },

  // ========================================
  // DIGITAL FOREVER ENDING - DOUBLE BUZZ
  // ========================================
  {
    id: 'ronnie-ending-digital-start',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        text: '"Tori... if I can\'t get to you... then I\'m coming TO you."',
        internal: '[He stops running. Holds the Tamagotchi close. Opens the connection.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-ending-digital-connect',
  },

  {
    id: 'ronnie-ending-digital-connect',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'determined', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'tori',
        variant: 'through device',
        text: '"Ronnie... don\'t... you can\'t—"',
        internal: '[He presses his forehead to the screen. Eyes closed. Reaching through the code.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-ending-digital-double-buzz',
  },

  {
    id: 'ronnie-ending-digital-double-buzz',
    background: 'hospital',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'BUZZ. BUZZ.',
        internal: '[Two pulses. Synchronized. The device PULLS.]',
      },
    ],
    effects: [
      { type: 'haptic', hapticType: 'double', reason: 'Synchronized double pulse - tether connection' },
    ],
    style: 'critical',
    autoAdvanceDelay: 2500,
    next: 'ronnie-ending-digital-transfer',
  },

  {
    id: 'ronnie-ending-digital-transfer',
    background: 'hospital',
    sprites: [],
    dialog: [
      {
        speaker: 'system',
        text: '⚠️ UNAUTHORIZED CONSCIOUSNESS TRANSFER\n⚠️ TWO SOULS DETECTED\n⚠️ VESSEL OVERLOAD',
        internal: '[His body collapses in the hallway. Nurses rush to him. But he\'s already gone.]',
      },
    ],
    effects: [
      { type: 'glitch', intensity: 'high', duration: 600 },
    ],
    style: 'critical',
    autoAdvanceDelay: 3000,
    next: 'ronnie-ending-digital-merge',
  },

  {
    id: 'ronnie-ending-digital-merge',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'surprised', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'Digital space. White void. Two sprites materialize.',
        internal: '[Ronnie\'s form solidifies beside Tori\'s. Both digital. Both together.]',
      },
    ],
    autoAdvanceDelay: 3500,
    next: 'ronnie-ending-digital-together',
  },

  {
    id: 'ronnie-ending-digital-together',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'surprised', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        emotion: 'surprised',
        text: '"Ronnie... what did you DO?"',
      },
    ],
    autoAdvanceDelay: 2500,
    next: 'ronnie-ending-digital-smile',
  },

  {
    id: 'ronnie-ending-digital-smile',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'happy', position: 'left' },
      { character: 'tori', emotion: 'surprised', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'ronnie',
        emotion: 'happy',
        text: '"What I promised. Always."',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-ending-digital-acceptance',
  },

  {
    id: 'ronnie-ending-digital-acceptance',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'happy', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'tori',
        text: '"You idiot. Beautiful idiot."',
        internal: '[She takes his hand. Their sprites sync perfectly.]',
      },
    ],
    autoAdvanceDelay: 3000,
    next: 'ronnie-ending-digital-world',
  },

  {
    id: 'ronnie-ending-digital-world',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'happy', position: 'left' },
      { character: 'tori', emotion: 'happy', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'They build their world together. Pixel parks. Digital sunsets. Eternally young. Eternally together.',
        internal: '[Visual: Their apartment, recreated in code. Perfect. Frozen. Safe.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-ending-digital-static',
  },

  {
    id: 'ronnie-ending-digital-static',
    background: 'digitalSpace',
    sprites: [
      { character: 'ronnie', emotion: 'neutral', position: 'left' },
      { character: 'tori', emotion: 'neutral', position: 'right' },
    ],
    dialog: [
      {
        speaker: 'narrator',
        text: 'No sickness. No death. No separation.',
        internal: '[But also: No growth. No change. No real touch. Just eternal digital stasis.]',
      },
    ],
    autoAdvanceDelay: 4000,
    next: 'ronnie-ending-digital-hospital',
  },

  {
    id: 'ronnie-ending-digital-hospital',
    background: 'hospital',
    sprites: [],
    dialog: [
      {
        speaker: 'narrator',
        text: '[CUT TO: Hospital room. Two bodies on beds. Monitors humming. No one wakes.]',
        internal: '[Outside the window, years pass. Seasons change. The world moves on without them.]',
      },
    ],
    autoAdvanceDelay: 5000,
    next: 'ronnie-ending-digital-final',
  },

  {
    id: 'ronnie-ending-digital-final',
    background: 'hospital',
    sprites: [],
    dialog: [
      {
        speaker: 'system',
        text: '**DIGITAL FOREVER ENDING**\n"Together, eternally still."',
        internal: '[Is this love? Or is it fear of loss?\nIs safety worth stagnation?\nYou chose connection over growth.]\n\n[They remain, forever digital, forever young, forever together...]\n[...forever frozen.]',
      },
    ],
    effects: [
      { type: 'fade', intensity: 'low', duration: 2000 },
    ],
    flags: [
      { name: 'ending_digital_forever_complete', value: true },
      { name: 'skip_prologue_unlocked', value: true },
    ],
    next: 'ending-menu', // Returns to ending menu
  },
];

export function getRonnieAct3Scene(id: string): Scene | undefined {
  return RONNIE_ACT3_SCENES.find(scene => scene.id === id);
}

export function getRonnieAct3StartScene(): string {
  return 'ronnie-act3-start';
}
