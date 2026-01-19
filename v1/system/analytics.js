// ========================================
// ANALYTICS SYSTEM
// Privacy-respecting, local-only analytics
// ========================================

/**
 * Analytics - Track player behavior for insights
 * 
 * Features:
 * - Privacy-respecting (local only, no external tracking)
 * - Playtime tracking
 * - Route distribution
 * - Choice distribution
 * - Scene popularity
 * - Session tracking
 */

class Analytics {
    constructor(game) {
        this.game = game;
        this.events = [];
        this.maxEvents = 1000;
        this.sessionStart = Date.now();
        this.sessionId = this.generateSessionId();

        this.init();
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    init() {
        this.loadEvents();
        this.trackSession();
        this.setupEventListeners();
        console.log('📊 Analytics initialized (privacy-respecting, local-only)');
    }

    setupEventListeners() {
        // Track important game events
        document.addEventListener('scene-displayed', (e) => {
            this.track('scene_view', { sceneId: e.detail?.sceneId });
        });

        document.addEventListener('choice-made', (e) => {
            this.track('choice_made', {
                choiceText: e.detail?.choiceText,
                sceneId: e.detail?.sceneId
            });
        });

        document.addEventListener('route-point-change', (e) => {
            this.track('route_point', {
                type: e.detail?.type,
                value: e.detail?.value
            });
        });

        // Track session end
        window.addEventListener('beforeunload', () => {
            this.endSession();
        });
    }

    // ========================================
    // EVENT TRACKING
    // ========================================

    track(event, data = {}) {
        const eventData = {
            id: this.generateEventId(),
            sessionId: this.sessionId,
            event,
            data,
            timestamp: Date.now()
        };

        this.events.push(eventData);

        // Trim old events
        if (this.events.length > this.maxEvents) {
            this.events = this.events.slice(-this.maxEvents);
        }

        this.saveEvents();
    }

    // ========================================
    // SESSION TRACKING
    // ========================================

    trackSession() {
        this.track('session_start', {
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language
        });
    }

    endSession() {
        const duration = Date.now() - this.sessionStart;
        this.track('session_end', {
            duration,
            eventsCount: this.events.filter(e => e.sessionId === this.sessionId).length
        });
        this.saveEvents();
    }

    // ========================================
    // STATISTICS
    // ========================================

    getStats() {
        return {
            totalPlaytime: this.calculateTotalPlaytime(),
            sessionCount: this.getSessionCount(),
            routeDistribution: this.getRouteDistribution(),
            choiceDistribution: this.getChoiceDistribution(),
            mostVisitedScenes: this.getMostVisitedScenes(),
            averageSessionLength: this.getAverageSessionLength()
        };
    }

    calculateTotalPlaytime() {
        const sessions = this.events.filter(e => e.event === 'session_end');
        const total = sessions.reduce((sum, s) => sum + (s.data.duration || 0), 0);
        return this.formatDuration(total);
    }

    getSessionCount() {
        const uniqueSessions = new Set(this.events.map(e => e.sessionId));
        return uniqueSessions.size;
    }

    getRouteDistribution() {
        const routes = {};
        this.events
            .filter(e => e.event === 'scene_view')
            .forEach(e => {
                const route = this.extractRoute(e.data.sceneId);
                routes[route] = (routes[route] || 0) + 1;
            });
        return routes;
    }

    getChoiceDistribution() {
        const choices = {};
        this.events
            .filter(e => e.event === 'choice_made')
            .forEach(e => {
                const text = e.data.choiceText || 'Unknown';
                choices[text] = (choices[text] || 0) + 1;
            });

        // Sort by frequency
        return Object.entries(choices)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {});
    }

    getMostVisitedScenes() {
        const scenes = {};
        this.events
            .filter(e => e.event === 'scene_view')
            .forEach(e => {
                const sceneId = e.data.sceneId || 'Unknown';
                scenes[sceneId] = (scenes[sceneId] || 0) + 1;
            });

        return Object.entries(scenes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {});
    }

    getAverageSessionLength() {
        const sessions = this.events.filter(e => e.event === 'session_end');
        if (sessions.length === 0) return '0m';

        const avg = sessions.reduce((sum, s) => sum + (s.data.duration || 0), 0) / sessions.length;
        return this.formatDuration(avg);
    }

    // ========================================
    // EXPORT
    // ========================================

    exportStats() {
        const stats = this.getStats();
        const report = `
=== V848 Analytics Report ===
Generated: ${new Date().toISOString()}

PLAYTIME:
Total: ${stats.totalPlaytime}
Sessions: ${stats.sessionCount}
Average Session: ${stats.averageSessionLength}

ROUTE DISTRIBUTION:
${Object.entries(stats.routeDistribution).map(([k, v]) => `  ${k}: ${v} scenes`).join('\n')}

TOP CHOICES:
${Object.entries(stats.choiceDistribution).map(([k, v]) => `  ${k}: ${v} times`).join('\n')}

MOST VISITED SCENES:
${Object.entries(stats.mostVisitedScenes).map(([k, v]) => `  ${k}: ${v} visits`).join('\n')}
========================
        `.trim();

        return report;
    }

    downloadReport() {
        const report = this.exportStats();
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `v848-analytics-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        console.log('📊 Analytics report downloaded');
    }

    // ========================================
    // UTILITIES
    // ========================================

    formatDuration(ms) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    extractRoute(sceneId) {
        if (!sceneId) return 'Unknown';
        // Extract route from scene ID (e.g., "tori_act1_scene1" -> "tori")
        return sceneId.split('_')[0] || 'Unknown';
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateEventId() {
        return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // ========================================
    // PERSISTENCE
    // ========================================

    loadEvents() {
        try {
            const saved = localStorage.getItem('analytics_events');
            if (saved) {
                this.events = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load analytics events');
        }
    }

    saveEvents() {
        try {
            localStorage.setItem('analytics_events', JSON.stringify(this.events));
        } catch (e) {
            console.warn('Failed to save analytics events');
        }
    }

    clearEvents() {
        this.events = [];
        localStorage.removeItem('analytics_events');
        console.log('📊 Analytics cleared');
    }
}

// ========================================
// GLOBAL EXPORT
// ========================================

if (typeof window !== 'undefined') {
    window.Analytics = Analytics;
}

export { Analytics };
