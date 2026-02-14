/**
 * NotificationShade DOM Template
 *
 * Pure function to create the notification shade's DOM structure.
 * V1 Parity: Exact DOM structure from index.html lines 131-290.
 * 💚🔥💀
 */

/**
 * Create the notification shade DOM element.
 * V1 Parity: Exact DOM structure and class names.
 *
 * @param isInShell - Whether the app is running inside the shell
 * @returns The fully-constructed shade container element
 */
export function createShadeDOM(isInShell: boolean): HTMLElement {
    const div = document.createElement('div');
    div.id = 'notification-shade';
    div.className = 'notification-shade';

    // V1 Parity: Exact DOM structure from index.html lines 131-290
    div.innerHTML = `
            <div class="swipe-indicator"></div>

            <!-- Quick Actions - Expandable with Paging -->
            <div class="shade-section quick-actions-container">
                <div class="shade-section-header">
                    <div class="shade-section-title">Quick Actions</div>
                    <div class="expand-hint">⋯⋯</div>
                </div>

                <!-- Quick State: Paged carousel -->
                <div class="quick-actions-carousel">
                    <div class="quick-actions-track">
                        <!-- Page 1: Core Actions -->
                        <div class="quick-actions-page" data-page="0">
                            <button class="quick-action-btn" data-action="save">
                                <span class="quick-action-icon">💾</span>
                                <span>Save</span>
                            </button>
                            <button class="quick-action-btn" data-action="load">
                                <span class="quick-action-icon">📂</span>
                                <span>Load</span>
                            </button>
                            <button class="quick-action-btn" data-action="fullscreen">
                                <span class="quick-action-icon">⛶</span>
                                <span>Full</span>
                            </button>
                            <button class="quick-action-btn" data-action="${isInShell ? 'exit-to-shell' : 'exit'}">
                                <span class="quick-action-icon">${isInShell ? '🏠' : '🚪'}</span>
                                <span>${isInShell ? 'Shell' : 'Exit'}</span>
                            </button>
                        </div>

                        <!-- Page 2: Tools -->
                        <div class="quick-actions-page" data-page="1">
                            <button class="quick-action-btn" data-action="screenshot">
                                <span class="quick-action-icon">📸</span>
                                <span>Shot</span>
                            </button>
                            <button class="quick-action-btn" data-action="notes">
                                <span class="quick-action-icon">📝</span>
                                <span>Notes</span>
                            </button>
                            <button class="quick-action-btn" data-action="settings">
                                <span class="quick-action-icon">⚙️</span>
                                <span>Set</span>
                            </button>
                            <button class="quick-action-btn" data-action="help">
                                <span class="quick-action-icon">❓</span>
                                <span>Help</span>
                            </button>
                        </div>
                    </div>

                    <!-- Page indicators -->
                    <div class="quick-actions-dots">
                        <span class="dot active"></span>
                        <span class="dot"></span>
                    </div>
                </div>

                <!-- Expanded State: Full grid -->
                <div class="quick-actions-expanded" style="display: none;">
                    <div class="expanded-header">
                        <span>All Actions</span>
                        <button class="edit-btn" id="shade-edit-actions">✏️</button>
                    </div>

                    <div class="expanded-grid">
                        <!-- Page 1 Group -->
                        <div class="expanded-group">
                            <div class="group-label">Default ⭐</div>
                            <div class="expanded-actions">
                                <button class="quick-action-btn" data-action="save">
                                    <span class="quick-action-icon">💾</span>
                                    <span>Save</span>
                                </button>
                                <button class="quick-action-btn" data-action="load">
                                    <span class="quick-action-icon">📂</span>
                                    <span>Load</span>
                                </button>
                                <button class="quick-action-btn" data-action="fullscreen">
                                    <span class="quick-action-icon">⛶</span>
                                    <span>Full</span>
                                </button>
                                <button class="quick-action-btn" data-action="${isInShell ? 'exit-to-shell' : 'exit'}">
                                    <span class="quick-action-icon">${isInShell ? '🏠' : '🚪'}</span>
                                    <span>${isInShell ? 'Shell' : 'Exit'}</span>
                                </button>
                            </div>
                        </div>

                        <!-- Page 2 Group -->
                        <div class="expanded-group">
                            <div class="group-label">Tools</div>
                            <div class="expanded-actions">
                                <button class="quick-action-btn" data-action="screenshot">
                                    <span class="quick-action-icon">📸</span>
                                    <span>Shot</span>
                                </button>
                                <button class="quick-action-btn" data-action="notes">
                                    <span class="quick-action-icon">📝</span>
                                    <span>Notes</span>
                                </button>
                                <button class="quick-action-btn" data-action="settings">
                                    <span class="quick-action-icon">⚙️</span>
                                    <span>Set</span>
                                </button>
                                <button class="quick-action-btn" data-action="help">
                                    <span class="quick-action-icon">❓</span>
                                    <span>Help</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Status Details -->
            <div class="shade-section">
                <div class="shade-section-title">Current Status</div>
                <div class="status-details">
                    <div class="status-detail-item">
                        <span class="status-detail-label">Route:</span>
                        <span class="status-detail-value" id="shade-route">Menu</span>
                    </div>
                    <div class="status-detail-item">
                        <span class="status-detail-label">Loop Version:</span>
                        <span class="status-detail-value" id="shade-loop">848</span>
                    </div>
                    <div class="status-detail-item">
                        <span class="status-detail-label">Notes Collected:</span>
                        <span class="status-detail-value" id="shade-notes">0/42</span>
                    </div>
                    <div class="status-detail-item" id="shade-tether-item" style="display: none;">
                        <span class="status-detail-label">Tether Level:</span>
                        <span class="status-detail-value" id="shade-tether-value">100%</span>
                    </div>
                </div>
            </div>

            <!-- Note Preview (Email-Style) -->
            <div class="shade-section" id="notes-preview-section" style="display: none;">
                <div class="shade-section-title">Unread Notes</div>
                <div class="note-preview-card" id="note-preview-btn">
                    <span class="note-icon">📝</span>
                    <div class="note-preview-content">
                        <div class="note-title">Note Title</div>
                        <div class="note-snippet">Preview text...</div>
                    </div>
                    <span class="note-arrow">→</span>
                </div>
            </div>

            <!-- UV7 Carrier-Style Footer -->
            <div class="shade-carrier-footer">
                <span class="carrier-logo">UV7</span>
                <span class="carrier-name">United Voices 7</span>
            </div>
        `;

    return div;
}
