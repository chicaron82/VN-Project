// STORY DATA - Shared content and flags
// This file contains story beats that are referenced by both routes

const StoryData = {
    // Character names
    characters: {
        RONNIE: 'Ronnie',
        TORI: 'Tori',
        ECHO_1: 'Echo 1',
        ECHO_2: 'Echo 2',
        ECHO_3: 'Echo 3',
        DESPAIR: 'Despair Echo'
    },

    // Shared memories (referenced in both routes)
    memories: {
        PASTA: {
            title: 'The Pasta Incident',
            description: 'Tori oversalted pasta, Ronnie teased her about it'
        },
        GARLIC_BREAD: {
            title: 'Extra Charcoal',
            description: 'Tori\'s response: making garlic bread "extra charcoal" to match'
        },
        ICE_CREAM: {
            title: 'Tiger Tail Hatred',
            description: 'Tori hates Tiger Tail flavor, calls it "candy corn\'s evil twin"'
        },
        WEDDING: {
            title: 'Wedding Reception',
            description: 'Dancing at their wedding reception'
        }
    },

    // System messages (glitch notifications)
    systemMessages: {
        BATTERY_LOW: 'Battery Low: {percent}%',
        CONNECTION_ERROR: 'Connection Error: Memory_Fragment_{num} corrupted',
        FRAGMENTATION: 'Warning: Fragmentation detected',
        UPLOAD_FAILED: 'Upload failed',
        SOUL_ERROR: 'You can\'t upload a soul.'
    },

    // Echo personalities (for Tori's route)
    echoPersonalities: {
        ECHO_1: {
            voice: 'dry sarcasm',
            traits: ['clinical', 'gallows humor', 'matter-of-fact']
        },
        ECHO_2: {
            voice: 'soft empathy',
            traits: ['apologetic', 'gentle', 'hopeful']
        },
        ECHO_3: {
            voice: 'resigned truth',
            traits: ['flat delivery', 'accepting', 'experienced']
        },
        DESPAIR: {
            voice: 'bitter saboteur',
            traits: ['self-aware', 'hostile', 'eventually redemptive']
        }
    },

    // Game flags
    flags: {
        DISCOVERED_BODY_ANCHOR: false,
        DESPAIR_ECHO_REDEEMED: false,
        LOOP_COUNT: 0,
        EASTER_EGGS_FOUND: []
    }
};
