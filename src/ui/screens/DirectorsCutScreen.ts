
import { DevCommentarySystem } from '@systems/DevCommentarySystem';


export class DirectorsCutScreen {
    private container: HTMLElement | null = null;
    private devCommentarySystem: DevCommentarySystem;

    constructor(devCommentarySystem: DevCommentarySystem) {
        this.devCommentarySystem = devCommentarySystem;
    }

    public show(): void {
        if (this.container) return;

        const statements = this.devCommentarySystem.getAllCommentary();
        this.render(statements);
    }

    public hide(): void {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }

    private render(statements: CrewStatement[]): void {
        const overlay = document.createElement('div');
        overlay.id = 'directors-cut-overlay';
        overlay.className = 'directors-cut-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            padding: 40px 20px;
            box-sizing: border-box;
            overflow-y: auto;
            color: #0ff;
            font-family: 'Courier New', monospace;
            animation: fadeIn 0.3s ease-out;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
        `;

        // Title
        const titleDiv = document.createElement('div');
        titleDiv.style.textAlign = 'center';
        titleDiv.style.marginBottom = '3em';
        titleDiv.innerHTML = `
            <div style="font-size: 2em; color: #fff; margin-bottom: 0.5em;">DIRECTOR'S CUT</div>
            <div style="font-size: 1em; color: #888;">Extended Crew Statements</div>
        `;
        content.appendChild(titleDiv);

        // Statements
        statements.forEach(s => {
            const block = document.createElement('div');
            block.style.cssText = `
                margin-bottom: 3em;
                padding: 20px;
                border: 1px solid #0ff;
                border-radius: 5px;
                background: rgba(0, 50, 50, 0.1);
            `;
            block.innerHTML = `
                <div style="font-size: 1.2em; color: #fff; margin-bottom: 1em;">${s.name}</div>
                <div style="color: #ccc;">${s.text}</div>
            `;
            content.appendChild(block);
        });

        // Close Button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'CLOSE';
        closeBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 255, 255, 0.2);
            color: #0ff;
            border: 2px solid #0ff;
            padding: 10px 20px;
            font-family: 'Courier New', monospace;
            cursor: pointer;
            z-index: 10001;
            border-radius: 5px;
        `;
        closeBtn.onclick = () => this.hide();

        overlay.appendChild(content);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);
        this.container = overlay;
    }
}
