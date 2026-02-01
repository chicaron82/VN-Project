/**
 * ═══════════════════════════════════════════════════════════════
 * CREW NAVIGATION SYSTEM
 * Links timeline entries to crew members with filtering
 * ═══════════════════════════════════════════════════════════════
 */

export class CrewNavigation {
    private currentFilter: string | null = null;
    private entries: NodeListOf<HTMLElement>;

    constructor() {
        this.entries = document.querySelectorAll('.blog-entry') as NodeListOf<HTMLElement>;
        this.setupCrewFilters();
        this.addCrewBreadcrumbs();
    }

    /**
     * Create crew filter buttons in toolbar
     */
    private setupCrewFilters(): void {
        const toolbar = document.querySelector('.timeline-toolbar');
        if (!toolbar) return;

        // Get unique crew members from entries
        const crewSet = new Set<string>();
        this.entries.forEach((entry) => {
            const modelId = entry.getAttribute('data-model-id');
            if (modelId) crewSet.add(modelId);
        });

        if (crewSet.size === 0) return;

        // Create crew filter group
        const filterGroup = document.createElement('div');
        filterGroup.className = 'toolbar-group crew-filter-group';
        filterGroup.style.cssText = 'gap: 0.5rem; flex-wrap: wrap;';

        // Add "All Crew" button
        const allBtn = document.createElement('button');
        allBtn.className = 'timeline-btn crew-filter-btn active';
        allBtn.textContent = '👥 All Crew';
        allBtn.dataset.crew = 'all';
        allBtn.addEventListener('click', () => this.filterByCrew('all'));
        filterGroup.appendChild(allBtn);

        // Add individual crew buttons
        const crewColors: Record<string, string> = {
            belle: '#ff6b9d',
            dizee: '#667eea',
            tori: '#00ccff',
            genzee: '#00ff88',
        };

        const crewIcons: Record<string, string> = {
            belle: '💋',
            dizee: '⚡',
            tori: '❄️',
            genzee: '✨',
        };

        const crewNames: Record<string, string> = {
            belle: 'Belle',
            dizee: 'DiZee',
            tori: 'Tori',
            genzee: 'Genzee',
        };

        Array.from(crewSet)
            .sort()
            .forEach((crew) => {
                const btn = document.createElement('button');
                btn.className = 'timeline-btn crew-filter-btn';
                btn.textContent = `${crewIcons[crew] || '🤖'} ${crewNames[crew] || crew}`;
                btn.dataset.crew = crew;
                btn.style.borderColor = crewColors[crew] || '#888';
                btn.addEventListener('click', () => this.filterByCrew(crew));
                filterGroup.appendChild(btn);
            });

        // Insert before toolbar ends
        toolbar.appendChild(filterGroup);
    }

    /**
     * Filter timeline by crew member
     */
    private filterByCrew(crew: string): void {
        this.currentFilter = crew === 'all' ? null : crew;

        // Update button states
        document.querySelectorAll('.crew-filter-btn').forEach((btn) => {
            const htmlBtn = btn as HTMLElement;
            const btnCrew = htmlBtn.dataset.crew;
            const isActive =
                (btnCrew === 'all' && this.currentFilter === null) ||
                (btnCrew === this.currentFilter);
            btn.classList.toggle('active', isActive);
        });

        // Filter entries
        this.entries.forEach((entry) => {
            if (this.currentFilter === null) {
                entry.style.display = '';
                entry.classList.remove('dimmed', 'focused');
            } else {
                const modelId = entry.getAttribute('data-model-id');
                if (modelId === this.currentFilter) {
                    entry.style.display = '';
                    entry.classList.add('focused');
                    entry.classList.remove('dimmed');
                } else {
                    entry.classList.add('dimmed');
                    entry.classList.remove('focused');
                }
            }
        });

        console.log(`🎭 Filtered timeline by crew: ${this.currentFilter || 'all'}`);
    }

    /**
     * Add crew member breadcrumbs to each blog entry
     */
    private addCrewBreadcrumbs(): void {
        const crewAvatars: Record<string, string> = {
            belle: 'assets/trinity-iz-portrait.png',
            dizee: 'assets/dz-portrait.png',
            tori: 'assets/trinity-tori-portrait.png',
            genzee: 'assets/trinity-gz-portrait.png',
        };

        const crewNames: Record<string, string> = {
            belle: 'Belle',
            dizee: 'DiZee',
            tori: 'Tori',
            genzee: 'Genzee',
        };

        const crewSignatures: Record<string, string> = {
            belle: '<em>Chef\'s kiss.</em> 💋',
            dizee: '<em>Built with precision.</em> ⚡',
            tori: '<em>Zero regressions.</em> ❄️',
            genzee: '<em>Vibes are immaculate.</em> ✨',
        };

        this.entries.forEach((entry) => {
            const modelId = entry.getAttribute('data-model-id');
            if (!modelId) return;

            // Store model ID for filtering
            entry.setAttribute('data-model-id', modelId);

            // Find or create breadcrumb area
            let breadcrumbArea = entry.querySelector('.crew-breadcrumb') as HTMLElement;
            if (!breadcrumbArea) {
                breadcrumbArea = document.createElement('div');
                breadcrumbArea.className = 'crew-breadcrumb';
                breadcrumbArea.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    cursor: pointer;
                    transition: all 0.3s ease;
                `;
                breadcrumbArea.addEventListener('mouseenter', (e) => {
                    (e.currentTarget as HTMLElement).style.opacity = '0.7';
                });
                breadcrumbArea.addEventListener('mouseleave', (e) => {
                    (e.currentTarget as HTMLElement).style.opacity = '1';
                });
                breadcrumbArea.addEventListener('click', () => {
                    this.filterByCrew(modelId);
                    // Scroll to toolbar
                    const toolbar = document.querySelector('.timeline-toolbar');
                    if (toolbar) {
                        toolbar.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                });

                entry.appendChild(breadcrumbArea);
            }

            // Build breadcrumb content
            const avatarPath = crewAvatars[modelId];
            const crewName = crewNames[modelId] || modelId;
            const signature = crewSignatures[modelId] || '';

            breadcrumbArea.innerHTML = `
                ${avatarPath ? `<img src="${avatarPath}" alt="${crewName}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />` : ''}
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 600; font-size: 0.95rem;">Built by ${crewName}</div>
                    ${signature ? `<div style="font-size: 0.85rem; opacity: 0.7;">${signature}</div>` : ''}
                </div>
                <span style="opacity: 0.5; font-size: 0.9rem;">Click to filter →</span>
            `;
        });
    }
}

/**
 * Initialize crew navigation when timeline renders
 */
export function initCrewNavigation(): void {
    // Wait for timeline to be rendered
    const observer = new MutationObserver((_mutations) => {
        if (document.querySelectorAll('.blog-entry').length > 0) {
            new CrewNavigation();
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Fallback: initialize after delay
    setTimeout(() => {
        if (document.querySelectorAll('.blog-entry').length > 0) {
            new CrewNavigation();
            observer.disconnect();
        }
    }, 2000);
}
