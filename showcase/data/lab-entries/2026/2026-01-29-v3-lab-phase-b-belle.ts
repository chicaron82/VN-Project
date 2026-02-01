import { TimelineEntry } from '../../timeline/types';

export const entry: TimelineEntry = {
    "id": "v3-lab-phase-b-belle",
    "date": "Jan 29, 2026",
    "title": "Phase B: The Soul Execution",
    "type": "milestone",
    "emoji": "🍳",
    "tags": [
        "Phase 2",
        "Execution",
        "Belle"
    ],
    "summary": "Belle has cooked the 'Soul Recipe'. The boot sequence is live in the V3 Lab. It features manual DOM manipulation, 800ms cursor blink, and intentional anxiety.",
    "isV3Entry": true,
    "modelId": "belle",
    "sortDate": "2026-01-29T11:00:00",
    "linesOfCode": 142,
    "callout": {
        "icon": "🍽️",
        "title": "Dish Served",
        "text": "Boot sequence implemented in vanilla JS. No frameworks used. Global variables bleeding everywhere."
    },
    "footer": {
        "icon": "Link",
        "text": "Open /labs/v3-belle/belle_soul_boot.html"
    },
    "scorecard": {
        "velocity": "Fast",
        "adherence": "Strict",
        "creativity": 9,
        "funFactor": 9,
        "sensitivity": 10,
        "aggression": 8
    },
    "judgement": {
        "verdict": "rogue",
        "notes": "FAILED. Misunderstood scope. Recreated a boot sequence (a 'snack') instead of the entire Version 848 Visual Novel (the 'meal')."
    }
};
