/**
 * Section Banner Generator
 * Creates consistent hero banners for all sections
 * 
 * DRY Efficiency: Eliminates ~25 lines x 6 sections = 150 lines of duplicated banner HTML
 */

export interface BannerConfig {
    title: string;
    subtitle: string;
    image: string;
    alt: string;
    section: string;  // Section identifier for CSS class (e.g., 'journal', 'workflow')
}

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function createBanner(config: BannerConfig): string {
    return `
        <div class="hero-banner ${escapeHtml(config.section)}">
            <img src="${escapeHtml(config.image)}" alt="${escapeHtml(config.alt)}" class="hero-banner-image">
            <div class="hero-banner-particles">
                ${Array.from({ length: 10 }, () => '<div class="particle"></div>').join('')}
            </div>
            <div class="hero-banner-content">
                <h1 class="hero-banner-title">${escapeHtml(config.title)}</h1>
                <p class="hero-banner-subtitle">${escapeHtml(config.subtitle)}</p>
            </div>
        </div>
    `;
}

// Banner configurations for each section
// Using absolute paths from base for proper Vite resolution
export const BANNER_CONFIGS: Record<string, BannerConfig> = {
    journal: {
        title: 'The Journal',
        subtitle: 'From organic chaos to structured harmony in record time',
        image: '/VN-Project/showcase/media/banners/banner-journal.png',
        alt: 'Journal Banner',
        section: 'journal'
    },
    workflow: {
        title: 'The Workflow',
        subtitle: 'How a non-coder and AI built a game engine together',
        image: '/VN-Project/showcase/media/banners/banner-workflow.png',
        alt: 'Workflow Banner',
        section: 'workflow'
    },
    results: {
        title: 'The Results',
        subtitle: 'Numbers that tell a story of relentless iteration',
        image: '/VN-Project/showcase/media/banners/banner-results.png',
        alt: 'Results Banner',
        section: 'results'
    },
    spotlight: {
        title: 'Technical Spotlight',
        subtitle: 'A deep dive into the features that make UV7 special',
        image: '/VN-Project/showcase/media/banners/banner-spotlight.png',
        alt: 'Spotlight Banner',
        section: 'spotlight'
    },
    evolution: {
        title: 'The Evolution',
        subtitle: 'V1 vs V2: A tale of technical refinement',
        image: '/VN-Project/showcase/media/banners/banner-evolution.png',
        alt: 'Evolution Banner',
        section: 'evolution'
    },
    experiment: {
        title: 'The V3 Experiment',
        subtitle: 'Can "soul" be reverse-engineered into a recipe?',
        image: '/VN-Project/showcase/media/banners/banner-experiment.png',
        alt: 'V3 Experiment Banner',
        section: 'experiment'
    }
};
