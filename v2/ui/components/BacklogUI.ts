import { BacklogManager } from '../../core/BacklogManager';
import { EventBus } from '../../core/EventBus';

export class BacklogUI {
    private container!: HTMLElement;
    private backlogList!: HTMLElement;
    private backlogManager: BacklogManager;
    private eventBus: EventBus;
    private isOpen: boolean = false;

    constructor(backlogManager: BacklogManager, eventBus: EventBus) {
        this.backlogManager = backlogManager;
        this.eventBus = eventBus;
        this.createDOM();
        this.setupEventListeners();
    }

    private createDOM(): void {
        this.container = document.createElement('div');
        this.container.id = 'backlog-overlay';
        this.container.style.display = 'none'; // Hidden by default

        // Header
        const header = document.createElement('div');
        header.className = 'backlog-header';
        header.innerHTML = `
            <h2>Running Log</h2>
            <button class="close-btn">×</button>
        `;

        // List Container
        this.backlogList = document.createElement('div');
        this.backlogList.id = 'backlog-list';

        this.container.appendChild(header);
        this.container.appendChild(this.backlogList);
        document.body.appendChild(this.container);
    }

    private setupEventListeners(): void {
        // Toggle Events
        this.eventBus.on('ui:backlog:open', () => this.open());
        this.eventBus.on('ui:backlog:close', () => this.close());
        this.eventBus.on('ui:backlog:toggle', () => this.toggle());
        this.eventBus.on('ui:backlog:close_request', () => this.close()); // Handle Back Button

        // Close button
        const closeBtn = this.container.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.close();
                this.eventBus.emit('ui:backlog:close', {}); // Notify manager of manual close
            });
        }

        // Close on background click (optional, maybe not for backlog if it covers full screen)
        // this.container.addEventListener('click', (e) => {
        //     if (e.target === this.container) this.close();
        // });
    }

    public open(): void {
        if (this.isOpen) return;
        this.isOpen = true;
        this.render();
        this.container.style.display = 'flex';
        // Notify manager to push history state
        this.eventBus.emit('ui:backlog:open', {});

        // Scroll to bottom
        setTimeout(() => {
            this.backlogList.scrollTop = this.backlogList.scrollHeight;
        }, 0);
    }

    public close(): void {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.container.style.display = 'none';
        // Note: We don't emit ui:backlog:close here to avoid circular loops
        // The manager listens to ui:backlog:close solely for manual interactions (via the button listener above)
    }

    public toggle(): void {
        if (this.isOpen) this.close();
        else this.open();
    }

    private render(): void {
        this.backlogList.innerHTML = '';
        const entries = this.backlogManager.getEntries();

        if (entries.length === 0) {
            this.backlogList.innerHTML = '<div class="empty-state">No history recorded.</div>';
            return;
        }

        entries.forEach((entry, index) => {
            const entryEl = document.createElement('div');
            entryEl.className = 'backlog-entry';
            if (entry.isJumpable) {
                entryEl.classList.add('jumpable');
                entryEl.title = 'Click to jump back to this moment';
                entryEl.addEventListener('click', () => {
                    this.backlogManager.jumpToEntry(index);
                });
            } else {
                entryEl.classList.add('locked');
                entryEl.title = 'Cannot return to this moment';
            }

            if (entry.isDistorted) {
                entryEl.classList.add('distorted');
            }

            // Thumbnail (V1 Parity)
            if (entry.currentBackground) {
                const thumb = document.createElement('div');
                thumb.className = 'backlog-thumbnail';
                thumb.style.backgroundImage = `url('${entry.currentBackground}')`;
                entryEl.appendChild(thumb);
            }

            // Content
            const content = document.createElement('div');
            content.className = 'backlog-content';

            const name = document.createElement('div');
            name.className = 'backlog-name';
            name.textContent = entry.character;

            const text = document.createElement('div');
            text.className = 'backlog-text';
            text.textContent = entry.text;

            if (entry.isDistorted) {
                const badge = document.createElement('span');
                badge.className = 'distortion-badge';
                badge.textContent = '[DISTORTION]';
                content.appendChild(badge);
            }

            content.appendChild(name);
            content.appendChild(text);
            entryEl.appendChild(content);

            // Time/Hint
            const meta = document.createElement('div');
            meta.className = 'backlog-meta';
            const date = new Date(entry.timestamp);
            meta.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            entryEl.appendChild(meta);

            this.backlogList.appendChild(entryEl);
        });
    }
}
