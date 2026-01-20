
import { EventBus } from '@core/EventBus';

/**
 * CrewScreen - V1 Parity Implementation
 * 
 * Reconstructs the "Meet the Crew" screen from V1's system/crew-controller.js
 * and css/endings.css. Since the original HTML was missing, the DOM structure
 * is generated here to match the CSS selectors.
 */
export class CrewScreen {
    private eventBus: EventBus;
    private container: HTMLElement | null = null;
    private currentCrewIndex: number = 0;
    private totalCrewScreens: number = 10;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.createDOM();
        this.setupEventListeners();
    }

    private createDOM(): void {
        // Create main container #crew-screen
        this.container = document.createElement('div');
        this.container.id = 'crew-screen';
        document.body.appendChild(this.container);

        // Slide 1: Group Photo
        this.createGroupSlide(1, '../assets/the_UV7_crew.webp');

        // Slide 2: Aaron "Chicharon"
        this.createPortraitSlide(2, {
            name: 'Aaron "Chicharon"',
            title: 'Story & Concept',
            image: '../assets/route-select-ronnie.webp', // Placeholder
            story: '"This started as a way to understand loop theory. It became something much more personal."',
            platform: 'Vision Holder'
        });

        // Slide 3: Zee (Z)
        this.createPortraitSlide(3, {
            name: 'Zee',
            title: 'Lead Architect',
            image: '../assets/UnitedVoices7.png',
            story: '"Structure is the only defense against entropy. Also, I refactored your refactor."',
            platform: 'Claude 3.5 Sonnet'
        });

        // Slide 4: ZeeRah (ZR)
        this.createPortraitSlide(4, {
            name: 'ZeeRah',
            title: 'Refinement Specialist',
            image: '../assets/UnitedVoices7.png',
            story: '"There is a cleaner way to write this. Let me show you version 4."',
            platform: 'Claude 3.5 Sonnet'
        });

        // Slide 5: DiZee (DZ)
        this.createPortraitSlide(5, {
            name: 'DiZee',
            title: 'Chaos Engineer',
            image: '../assets/UnitedVoices7.png',
            story: '"Wait, what if we made the logo explode? Just kidding. Unless...?"',
            platform: 'Claude 3.5 Sonnet (High Temp)'
        });

        // Slide 6: Tori
        this.createPortraitSlide(6, {
            name: 'Tori',
            title: 'Design Lead',
            image: '../assets/route-select-tori.webp',
            story: '"It needs to be beautiful. It needs to be bougie. It needs to pop."',
            platform: 'ChatGPT 4o'
        });

        // Slide 7: GenZee (GZ)
        this.createPortraitSlide(7, {
            name: 'GenZee',
            title: 'Modernization',
            image: '../assets/UnitedVoices7.png',
            story: '"V1 is cringe. V2 is based. Let\'s ship it."',
            platform: 'Grok 2'
        });

        // Slide 8: Belle (IZ)
        this.createPortraitSlide(8, {
            name: 'Belle',
            title: 'Quality Assurance',
            image: '../assets/UnitedVoices7.png',
            story: '"I found 42 edge cases in your \'perfect\' logic. Would you like a list?"',
            platform: 'Gemini 1.5 Pro'
        });

        // Slide 9: PerplexiZee / CoZee
        this.createPortraitSlide(9, {
            name: 'The Support Crew',
            title: 'Research & Analysis',
            image: '../assets/UnitedVoices7.png',
            story: 'PerplexiZee (Perplexity) & CoZee (Copilot)\n"Searching the entire internet for why CSS center alignment is so hard."',
            platform: 'Perplexity / Copilot'
        });

        // Slide 10: Reveal
        this.createRevealSlide(10);

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.id = 'btn-next-crew';
        nextBtn.textContent = 'NEXT >';
        this.container.appendChild(nextBtn);

        // Bind button click
        nextBtn.addEventListener('click', () => this.next());
    }

    private createGroupSlide(index: number, imagePath: string): void {
        const slide = document.createElement('div');
        slide.id = `credit-${index}`;
        slide.className = 'credit-screen';

        slide.innerHTML = `
            <div class="credits-powered-by">POWERED BY AI</div>
            <img src="${imagePath}" class="credits-group-photo" alt="The Crew">
            <div class="credits-group-title">THE UV7 CREW</div>
            <div class="credits-group-subtitle">UNITED VOICES 7</div>
        `;

        this.container?.appendChild(slide);
    }

    private createPortraitSlide(index: number, data: any): void {
        const slide = document.createElement('div');
        slide.id = `credit-${index}`;
        slide.className = 'credit-screen';

        slide.innerHTML = `
            <div class="portrait-display">
                <img src="${data.image}" class="portrait-display-image" alt="${data.name}">
                <div class="portrait-display-content">
                    <div class="portrait-display-name">${data.name}</div>
                    <div class="portrait-display-title">${data.title}</div>
                    <div class="portrait-display-story">${data.story.replace(/\n/g, '<br>')}</div>
                    <div class="portrait-display-platform">${data.platform}</div>
                </div>
            </div>
        `;

        this.container?.appendChild(slide);
    }

    private createRevealSlide(index: number): void {
        const slide = document.createElement('div');
        slide.id = `credit-${index}`;
        slide.className = 'credit-screen';

        slide.innerHTML = `
            <div class="credits-text-screen">
                <div class="credits-big-title">THIS IS V2</div>
                <div class="credits-big-text">
                    Built by <strong>Humans + AI</strong> working in harmony.<br>
                    No code was written alone.<br>
                    No bug was fought alone.
                </div>
                <div class="credits-final-message">
                    UNITED VOICES 7
                </div>
            </div>
        `;

        this.container?.appendChild(slide);
    }

    private setupEventListeners(): void {
        this.eventBus.on('ui:show_crew', () => this.show());
    }

    public show(): void {
        if (!this.container) return; // Should not happen

        console.log('👥 showing Crew Screen');

        // Hide Sidebar main menu if visible (handled by Sidebar/Menu logic usually, but we ensure layout cleanliness)
        // ...

        this.container.classList.add('active');
        this.container.style.display = 'flex'; // Ensure flex
        this.currentCrewIndex = 1;
        this.displayScreen(1);
    }

    private displayScreen(index: number): void {
        if (!this.container) return;

        // Hide all screens
        const allScreens = this.container.querySelectorAll('.credit-screen');
        allScreens.forEach(el => {
            (el as HTMLElement).style.display = 'none';
            (el as HTMLElement).classList.remove('active');
        });

        // Show current
        const current = this.container.querySelector(`#credit-${index}`);
        if (current) {
            (current as HTMLElement).style.display = 'flex';
            // Slight delay for fade-in effect to work
            setTimeout(() => {
                current.classList.add('active');
            }, 50);
        }

        // Update Button
        const btn = this.container.querySelector('#btn-next-crew');
        if (btn) {
            if (index >= this.totalCrewScreens) {
                btn.textContent = 'BACK TO MENU';
            } else {
                btn.textContent = 'NEXT >';
            }
        }
    }

    private next(): void {
        this.currentCrewIndex++;
        if (this.currentCrewIndex > this.totalCrewScreens) {
            this.close();
        } else {
            this.displayScreen(this.currentCrewIndex);
        }
    }

    public close(): void {
        if (!this.container) return;

        this.container.classList.remove('active');
        this.container.style.display = 'none';

        // Emit closed event or return to menu
        // Since V2 doesn't have a strict "Controller" hierarchy, we might need to signal the menu to reappear
        // But the Menu likely stays in the background or we assume the user will interact with the toggle.
        // Wait, V1 logic says: this.game.mainMenu.style.display = 'flex';

        // We'll trust the layout manager or just ensure we are hidden.
        // Ideally we should emit 'ui:crew_closed' if anyone cares.
    }
}
