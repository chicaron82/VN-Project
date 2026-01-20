/**
 * TIMELINE SCRUBBER
 * A visual date-picker/scrubber that sits on the right side of the timeline
 * allowing quick jumps to specific months/years.
 */

class TimelineScrubber {
    constructor(containerSelector, timelineRenderer) {
        this.container = document.querySelector(containerSelector) || document.body;
        this.renderer = timelineRenderer;
        this.scrubber = null;
        this.isDragging = false;

        if (!this.container) {
            console.error("TimelineScrubber: Could not find container and body unavailable.");
            return;
        }

        // Wait for data
        this.initWhenReady();
    }

    initWhenReady() {
        const checkInterval = setInterval(() => {
            if (this.renderer && this.renderer.currentEntries && this.renderer.currentEntries.length > 0) {
                clearInterval(checkInterval);
                this.init();
            }
        }, 500);
    }

    init() {
        this.createScrubber();
        this.attachEvents();
    }

    createScrubber() {
        // Extract unique Year-Month combinations
        const entries = this.renderer.currentEntries;
        if (!entries) return;

        const dates = [...new Set(entries.map(p => {
            // Parse date "January 14, 2026"
            const parts = p.date.split(',');
            if (parts.length < 2) return 'Unknown';
            const monthPart = parts[0].split(' ')[0].substr(0, 3); // "Jan"
            const yearPart = parts[1].trim(); // "2026"
            return `${monthPart} ${yearPart}`;
        }))];

        this.scrubber = document.createElement('div');
        this.scrubber.className = 'timeline-scrubber';

        dates.forEach(dateLabel => {
            const dot = document.createElement('div');
            dot.className = 'scrubber-dot';
            dot.dataset.date = dateLabel;

            const label = document.createElement('span');
            label.className = 'scrubber-label';
            label.textContent = dateLabel;

            dot.appendChild(label);
            this.scrubber.appendChild(dot);

            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                this.scrollToDate(dateLabel);
            });
        });

        this.container.appendChild(this.scrubber);
    }

    scrollToDate(label) {
        // Find first entry with this date label
        const entry = this.renderer.currentEntries.find(p => p.date.includes(label.split(' ')[0])); // naive match
        if (entry) {
            const el = document.getElementById(entry.id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                this.highlightDot(label);
            }
        }
    }

    highlightDot(label) {
        const dots = this.scrubber.querySelectorAll('.scrubber-dot');
        dots.forEach(d => {
            if (d.dataset.date === label) d.classList.add('active');
            else d.classList.remove('active');
        });
    }

    attachEvents() {
        // Listen to global scroll to update active dot
        window.addEventListener('scroll', () => {
            // Debounce or throttle ideal
            // Check visible entry and update dot
            // Implementation omitted for brevity in MVP
        }, { passive: true });
    }
}

window.TimelineScrubber = TimelineScrubber;
