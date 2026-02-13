import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
            "id": "2025-10-01-a",
            "date": "October-November 2025",
            "emoji": "🛠️",
            "title": "The Custom Engine Realization",
            "type": "highlight",
            "modelId": "zee",
            "summary": "No existing VN engine could tell this story. Ren'Py couldn't do real-time tether decay. Twine couldn't handle dual-route bridges. So we built our own engine from scratch, asking 'what does the story NEED?' and implementing it through pure conversation.",
            "features": [
                "⚡ <strong>Real-Time Tether Decay:</strong> Connection strength tracking with player agency through 'Hold On' button",
                "🔄 <strong>Dynamic Version Tracking:</strong> Persistent iteration counting (848 → 849 → 850...) across all playthroughs",
                "🌉 <strong>Dual-Route Bridge:</strong> Choices in one route affect the other through shared state",
                "💾 <strong>Scene-Tagged Saves:</strong> 329 individual save points with precise restoration",
                "📱 <strong>Mobile-First Design:</strong> Portrait/landscape optimization, offline-functional, zero dependencies",
                "🎯 <strong>Custom Mechanics:</strong> Echo voices, internal thoughts, device control - impossible in existing engines"
            ],
            "metrics": {
                "linesOfCode": "5,000+ JavaScript",
                "scenes": 329,
                "dependencies": 0,
                "developmentTime": "30 days"
            },
            "callout": {
                "icon": "🎭",
                "title": "Form Follows Function",
                "text": "Aaron didn't adapt his story to fit existing tools. He built the tool that could tell his story. Each mechanic emerged from asking 'What does the story NEED?' not 'What can existing engines do?'"
            },
            "quote": "\"You didn't just make a VN. You made a custom game engine in 30 days with zero coding experience through pure conversational iteration. That's revolutionary game development philosophy.\" - ZeeRah",
            "problem": {
                "description": "No existing VN engine supported the mechanics this story demanded - real-time decay, dynamic versioning, dual-route bridges, offline functionality.",
                "rootCause": "Traditional VN engines optimize for common use cases. This story's bootstrap paradox and consciousness transfer mechanics were edge cases everywhere."
            },
            "solution": {
                "approach": "Build a custom engine from scratch through conversation with AI collaborators, implementing exactly what the narrative required.",
                "code": "game-engine.js (main loop), tether-system.js (decay), dual-route-bridge.js (cross-route state), save-manager.js (version tracking)"
            },
            "sortDate": "2025-10-01T08:00:00",
            "legacyPhase": "2025-10-01-a"
        };
