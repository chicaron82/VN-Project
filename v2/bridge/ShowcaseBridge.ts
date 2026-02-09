import { EventBus } from '../core/EventBus';
import { StatusBar } from '../ui/components/StatusBar';
import { NotificationRail } from '../ui/components/NotificationRail';
// Import legacy-compatible Context definitions
import { UV7Context } from '../ui/components/StatusBarContext';

import { Logger } from '@utils/Logger';

Logger.system('🌉 UV7 System Bridge initializing...');

// Create a global namespace for UV7 System components
const UV7System = {
    EventBus: EventBus,
    StatusBar: StatusBar,
    NotificationRail: NotificationRail,

    // Factory to easily create a standalone status bar
    createStatusBar: (_containerId: string, context: UV7Context = 'showcase') => {
        Logger.system(`🏗️ Creating StatusBar for ${context}`);

        // 1. Setup Event Bus (communication backbone)
        const eventBus = new EventBus();

        // 2. Initialize StatusBar (without StateManager since Showcase is stateless/manages its own state)
        const statusBar = new StatusBar(eventBus, undefined, {
            // We can pass initial config here if needed
        });

        // 3. Initialize Notification Rail (Phase 26d)
        const notificationRail = new NotificationRail(eventBus);

        // 4. Return the instance and the bus so variables can control it
        return {
            instance: statusBar,
            eventBus: eventBus,
            notificationRail: notificationRail
        };
    }
};

// Expose to window
(window as any).UV7System = UV7System;

Logger.system('✅ UV7 System Bridge ready.');
