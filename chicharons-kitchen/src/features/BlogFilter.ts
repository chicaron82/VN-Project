import type { BlogEntry } from '../../entries/types';

export interface FilterState {
    type: string | null;
    modelId: string | null;
    tag: string | null;
}

type FilterChangeCallback = (state: FilterState) => void;

/**
 * BlogFilter — filter bar with pills for type, modelId, and tags
 */
export class BlogFilter {
    private entries: BlogEntry[];
    private state: FilterState = { type: null, modelId: null, tag: null };
    private onFilterChange: FilterChangeCallback;
    private countEl: HTMLElement | null = null;

    constructor(entries: BlogEntry[], onFilterChange: FilterChangeCallback) {
        this.entries = entries;
        this.onFilterChange = onFilterChange;
    }

    render(): HTMLElement {
        const bar = document.createElement('div');
        bar.className = 'filter-bar';

        const types = this.unique(this.entries.map(e => e.type).filter(Boolean) as string[]);
        const models = this.unique(this.entries.map(e => e.modelId).filter(Boolean) as string[]);
        const tags = this.unique(this.entries.flatMap(e => e.tags || []));

        this.countEl = document.createElement('div');
        this.countEl.className = 'entry-count';
        this.updateCount(this.entries.length);

        bar.appendChild(this.countEl);
        bar.appendChild(this.buildGroup('Type', types, 'type'));
        bar.appendChild(this.buildGroup('Model', models, 'model'));
        bar.appendChild(this.buildTagGroup('Tag', tags));

        const resetBtn = document.createElement('button');
        resetBtn.className = 'filter-reset';
        resetBtn.textContent = '✕ Clear';
        resetBtn.addEventListener('click', () => this.reset(bar));
        bar.appendChild(resetBtn);

        return bar;
    }

    updateCount(count: number): void {
        if (this.countEl) {
            this.countEl.textContent = `${count} entr${count === 1 ? 'y' : 'ies'}`;
        }
    }

    private buildGroup(label: string, values: string[], filterKey: 'type' | 'model'): HTMLElement {
        const group = document.createElement('div');
        group.className = 'filter-group';

        const lbl = document.createElement('span');
        lbl.className = 'filter-label';
        lbl.textContent = label + ':';
        group.appendChild(lbl);

        values.forEach(val => {
            const pill = document.createElement('button');
            pill.className = `filter-pill ${filterKey === 'type' ? `type-${val}` : `model-${val}`}`;
            pill.textContent = val;
            pill.dataset.key = filterKey;
            pill.dataset.val = val;
            pill.addEventListener('click', () => {
                const key = filterKey === 'model' ? 'modelId' : 'type';
                this.toggle(key as keyof FilterState, val, pill, group);
            });
            group.appendChild(pill);
        });

        return group;
    }

    private buildTagGroup(label: string, values: string[]): HTMLElement {
        const group = document.createElement('div');
        group.className = 'filter-group filter-tags';

        const lbl = document.createElement('span');
        lbl.className = 'filter-label';
        lbl.textContent = label + ':';
        group.appendChild(lbl);

        // Show top 20 tags to avoid overflow
        values.slice(0, 20).forEach(val => {
            const pill = document.createElement('button');
            pill.className = 'filter-pill';
            pill.textContent = val;
            pill.addEventListener('click', () => {
                this.toggle('tag', val, pill, group);
            });
            group.appendChild(pill);
        });

        return group;
    }

    private toggle(key: keyof FilterState, val: string, pill: HTMLButtonElement, group: HTMLElement): void {
        const isActive = this.state[key] === val;
        this.state[key] = isActive ? null : val;

        // Update pill active states within group
        group.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        if (!isActive) pill.classList.add('active');

        this.onFilterChange({ ...this.state });
    }

    private reset(bar: HTMLElement): void {
        this.state = { type: null, modelId: null, tag: null };
        bar.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        this.onFilterChange({ ...this.state });
    }

    private unique(arr: string[]): string[] {
        return [...new Set(arr)].sort();
    }

    static applyFilter(entries: BlogEntry[], state: FilterState): BlogEntry[] {
        return entries.filter(e => {
            if (state.type && e.type !== state.type) return false;
            if (state.modelId && e.modelId !== state.modelId) return false;
            if (state.tag && !(e.tags || []).includes(state.tag)) return false;
            return true;
        });
    }
}
