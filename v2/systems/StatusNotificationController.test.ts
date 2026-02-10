import { StatusNotificationController } from './StatusNotificationController';
import { EventBus } from '../core/EventBus';
import { StateManager } from '../core/StateManager';
import { Logger } from '@utils/Logger';

describe('StatusNotificationController', () => {
    let controller: StatusNotificationController;
    let eventBus: EventBus;
    let stateManager: StateManager;
    let mockNotification: HTMLElement;

    beforeEach(() => {
        // Create mock DOM elements
        mockNotification = document.createElement('div');
        mockNotification.id = 'status-notification';
        mockNotification.innerHTML = `
            <span class="status-notif-icon"></span>
            <span class="status-notif-text"></span>
            <div class="status-notif-progress">
                <div class="status-notif-progress-fill"></div>
            </div>
        `;
        document.body.appendChild(mockNotification);

        eventBus = new EventBus();
        stateManager = new StateManager();
        controller = new StatusNotificationController(eventBus, stateManager);
    });

    afterEach(() => {
        document.body.removeChild(mockNotification);
        vi.clearAllTimers();
    });

    // ========================================
    // INITIALIZATION TESTS
    // ========================================

    it('should initialize disabled by default', () => {
        expect(controller['isEnabled']).toBe(false);
    });

    it('should find and cache DOM elements', () => {
        expect(controller['notification']).toBe(mockNotification);
        expect(controller['iconElement']).toBeTruthy();
        expect(controller['textElement']).toBeTruthy();
        expect(controller['progressFill']).toBeTruthy();
    });

    // ========================================
    // ENABLE/DISABLE TESTS
    // ========================================

    it('should enable notifications when enable() is called', () => {
        controller.enable();
        expect(controller['isEnabled']).toBe(true);
    });

    it('should disable notifications when disable() is called', () => {
        controller.enable();
        controller.disable();
        expect(controller['isEnabled']).toBe(false);
    });

    it('should clear queue when disabled', () => {
        controller.enable();
        controller['queue'] = [
            { message: 'Test 1' },
            { message: 'Test 2' }
        ];
        controller.disable();
        expect(controller['queue'].length).toBe(0);
    });

    // ========================================
    // BASIC SHOW/HIDE TESTS
    // ========================================

    it('should block notifications when disabled', () => {
        const loggerSpy = vi.spyOn(Logger, 'ui');
        controller.show({ message: 'Test' });
        expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('blocked (disabled)'));
    });

    it('should show notification when enabled', () => {
        controller.enable();
        controller.show({ message: 'Test message', icon: '🎉' });

        const iconEl = mockNotification.querySelector('.status-notif-icon');
        const textEl = mockNotification.querySelector('.status-notif-text');

        expect(iconEl?.textContent).toBe('🎉');
        expect(textEl?.textContent).toBe('Test message');
        expect(mockNotification.classList.contains('visible')).toBe(true);
    });

    it('should apply type class to notification', () => {
        controller.enable();
        controller.show({ type: 'error', message: 'Error!' });
        expect(mockNotification.classList.contains('type-error')).toBe(true);
    });

    it('should apply pulse class when pulse=true', () => {
        controller.enable();
        controller.show({ message: 'Test', pulse: true });
        expect(mockNotification.classList.contains('pulse')).toBe(true);
    });

    it('should apply interactive class when interactive=true', () => {
        controller.enable();
        controller.show({ message: 'Test', interactive: true });
        expect(mockNotification.classList.contains('interactive')).toBe(true);
    });

    it('should auto-hide after duration', () => {
        vi.useFakeTimers();
        controller.enable();
        controller.show({ message: 'Test', duration: 2000 });

        expect(mockNotification.classList.contains('visible')).toBe(true);

        vi.advanceTimersByTime(2000);

        // Wait for hide animation
        vi.advanceTimersByTime(300);

        expect(controller['isShowing']).toBe(false);
        vi.useRealTimers();
    });

    it('should not auto-hide when duration=0 (persistent)', () => {
        vi.useFakeTimers();
        controller.enable();
        controller.show({ message: 'Persistent', duration: 0 });

        vi.advanceTimersByTime(5000);

        expect(controller['isShowing']).toBe(true);
        vi.useRealTimers();
    });

    // ========================================
    // QUEUE TESTS
    // ========================================

    it('should queue messages when notification is showing', () => {
        controller.enable();
        controller.show({ message: 'First', duration: 2000 });
        controller.show({ message: 'Second', duration: 2000 });

        expect(controller['queue'].length).toBe(1);
        expect(controller['queue'][0].message).toBe('Second');
    });

    it('should process queue after current notification hides', () => {
        vi.useFakeTimers();
        controller.enable();

        controller.show({ message: 'First', duration: 1000 });
        controller.show({ message: 'Second', duration: 1000 });

        // First message showing
        expect(controller['textElement']?.textContent).toBe('First');

        // Wait for first to hide
        vi.advanceTimersByTime(1000);
        vi.advanceTimersByTime(300); // Hide animation

        // Second message should now be showing
        expect(controller['textElement']?.textContent).toBe('Second');
        vi.useRealTimers();
    });

    it('should sort queue by priority (high priority first)', () => {
        controller.enable();
        // Show a high priority message first so subsequent messages get queued
        controller.show({ message: 'First', duration: 5000, priority: 'critical' });
        controller.show({ message: 'Low', duration: 1000, priority: 'low' });
        controller.show({ message: 'High', duration: 1000, priority: 'high' });
        controller.show({ message: 'Normal', duration: 1000, priority: 'normal' });

        // Queue should be sorted: high > normal > low
        expect(controller['queue'][0].message).toBe('High');
        expect(controller['queue'][1].message).toBe('Normal');
        expect(controller['queue'][2].message).toBe('Low');
    });

    it('should limit queue to 5 messages', () => {
        controller.enable();
        controller.show({ message: 'First', duration: 5000 });

        for (let i = 0; i < 10; i++) {
            controller.show({ message: `Message ${i}`, duration: 1000, priority: 'low' });
        }

        expect(controller['queue'].length).toBeLessThanOrEqual(5);
    });

    it('should drop low-priority messages when queue is full', () => {
        const loggerSpy = vi.spyOn(Logger, 'ui');
        controller.enable();
        controller.show({ message: 'First', duration: 5000 });

        for (let i = 0; i < 6; i++) {
            controller.show({ message: `Low ${i}`, duration: 1000, priority: 'low' });
        }

        expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Dropped low-priority'));
    });

    // ========================================
    // PRIORITY INTERRUPT TESTS
    // ========================================

    it('should interrupt current notification with critical priority', () => {
        vi.useFakeTimers();
        controller.enable();

        controller.show({ message: 'Normal', duration: 5000, priority: 'normal' });
        expect(controller['textElement']?.textContent).toBe('Normal');

        controller.show({ message: 'Critical!', duration: 2000, priority: 'critical' });

        // Critical should interrupt and show immediately
        vi.advanceTimersByTime(300); // Hide animation
        expect(controller['textElement']?.textContent).toBe('Critical!');
        vi.useRealTimers();
    });

    it('should not interrupt with lower priority', () => {
        controller.enable();
        controller.show({ message: 'High', duration: 5000, priority: 'high' });
        controller.show({ message: 'Low', duration: 1000, priority: 'low' });

        // High should still be showing
        expect(controller['textElement']?.textContent).toBe('High');
        // Low should be queued
        expect(controller['queue'].length).toBe(1);
    });

    // ========================================
    // CONVENIENCE METHOD TESTS
    // ========================================

    it('showNote() should show note notification', () => {
        controller.enable();
        controller.showNote('Tori', 'Important message');

        expect(controller['iconElement']?.textContent).toBe('✉️');
        expect(controller['textElement']?.textContent).toBe('Tori: Important message');
        expect(mockNotification.classList.contains('type-note')).toBe(true);
        expect(mockNotification.classList.contains('interactive')).toBe(true);
    });

    it('showSave() should show save notification', () => {
        controller.enable();
        controller.showSave();

        expect(controller['iconElement']?.textContent).toBe('💾');
        expect(controller['textElement']?.textContent).toBe('Game saved');
    });

    it('showAutoSave() should show auto-save notification with low priority', () => {
        controller.enable();
        controller.showAutoSave();

        expect(controller['textElement']?.textContent).toBe('Auto-saved');
        expect(controller['currentPriority']).toBe('low');
    });

    it('showSkipping() should show persistent skipping notification', () => {
        controller.enable();
        controller.showSkipping();

        expect(controller['iconElement']?.textContent).toBe('⏭️');
        expect(controller['textElement']?.textContent).toBe('Skipping...');
        expect(mockNotification.classList.contains('pulse')).toBe(true);
    });

    it('showDespairBlock() should show warning notification', () => {
        controller.enable();
        controller.showDespairBlock();

        expect(controller['iconElement']?.textContent).toBe('🛡️');
        expect(controller['textElement']?.textContent).toBe('Despair blocked by echo');
        expect(controller['currentPriority']).toBe('high');
    });

    it('showTetherWarning() should show tether warning', () => {
        controller.enable();
        controller.showTetherWarning();

        expect(controller['iconElement']?.textContent).toBe('⚠️');
        expect(controller['textElement']?.textContent).toBe('Tether critical!');
        expect(mockNotification.classList.contains('pulse')).toBe(true);
    });

    it('showTetherDeath() should show critical tether death notification', () => {
        controller.enable();
        controller.showTetherDeath();

        expect(controller['iconElement']?.textContent).toBe('💔');
        expect(controller['textElement']?.textContent).toBe('Tether severed!');
        expect(controller['currentPriority']).toBe('critical');
    });

    it('showTutorial() should show tutorial notification', () => {
        controller.enable();
        controller.showTutorial('Press SPACE to continue');

        expect(controller['iconElement']?.textContent).toBe('💡');
        expect(controller['textElement']?.textContent).toBe('Press SPACE to continue');
        expect(controller['currentPriority']).toBe('low');
    });

    it('showError() should show error notification', () => {
        controller.enable();
        controller.showError('Something went wrong');

        expect(controller['iconElement']?.textContent).toBe('❌');
        expect(controller['textElement']?.textContent).toBe('Something went wrong');
        expect(controller['currentPriority']).toBe('critical');
    });

    // ========================================
    // CLICK HANDLER TESTS
    // ========================================

    it('should emit event when note notification is clicked', () => {
        const emitSpy = vi.spyOn(eventBus, 'emit');
        controller.enable();
        controller.showNote('Tori', 'Test');

        mockNotification.click();

        expect(emitSpy).toHaveBeenCalledWith('ui:sidebar:open', {});
        expect(emitSpy).toHaveBeenCalledWith('ui:notes:open', {});
    });

    it('should hide notification when clicked', () => {
        vi.useFakeTimers();
        controller.enable();
        controller.show({ message: 'Test', duration: 5000 });

        mockNotification.click();

        vi.advanceTimersByTime(300);
        expect(controller['isShowing']).toBe(false);
        vi.useRealTimers();
    });

    // ========================================
    // PROGRESS BAR TESTS
    // ========================================

    it('should animate progress bar based on duration', () => {
        controller.enable();
        controller.show({ message: 'Test', duration: 2000 });

        const progressFill = mockNotification.querySelector('.status-notif-progress-fill') as HTMLElement;
        expect(progressFill.style.transition).toContain('2000ms');
    });

    it('should not animate progress bar when duration=0', () => {
        controller.enable();
        controller.show({ message: 'Persistent', duration: 0 });

        const progressFill = mockNotification.querySelector('.status-notif-progress-fill') as HTMLElement;
        expect(progressFill.style.transition).not.toContain('ms');
    });
});
