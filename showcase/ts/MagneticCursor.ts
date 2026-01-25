/**
 * Magnetic Cursor Effect
 * Adds a custom cursor that trails movement and snaps to interactive elements
 * 
 * Bougie Factor: +15%
 */

export class MagneticCursor {
    private cursor: HTMLElement;
    private cursorDot: HTMLElement;
    private cursorCircle: HTMLElement;
    
    private mouseX: number = 0;
    private mouseY: number = 0;
    private cursorX: number = 0;
    private cursorY: number = 0;
    
    // Smoothness factor (lower = smoother/slower trail)
    private speed: number = 0.15;
    
    private isHovering: boolean = false;
    private hoverScale: number = 1.5;

    constructor() {
        // Create cursor elements
        this.cursor = document.createElement('div');
        this.cursor.className = 'uv7-cursor-container';
        
        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'uv7-cursor-dot';
        
        this.cursorCircle = document.createElement('div');
        this.cursorCircle.className = 'uv7-cursor-circle';
        
        this.cursor.appendChild(this.cursorDot);
        this.cursor.appendChild(this.cursorCircle);
        document.body.appendChild(this.cursor);
        
        // Hide default cursor
        document.body.style.cursor = 'none';
        
        // Use 'a', 'button', and elements with 'data-magnetic' attribute
        this.initEventListeners();
        this.startAnimationLoop();
        
        // Add hover listeners to all interactive elements
        this.refreshMagnetTargets();
    }
    
    private initEventListeners(): void {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Move the small dot instantly
            this.cursorDot.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px)`;
        });
        
        // Handle clicks
        document.addEventListener('mousedown', () => {
            this.cursorCircle.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px) scale(0.8)`;
        });
        
        document.addEventListener('mouseup', () => {
             const scale = this.isHovering ? this.hoverScale : 1;
             this.cursorCircle.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px) scale(${scale})`;
        });
        
        // Handle leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
        });
    }
    
    private startAnimationLoop(): void {
        const animate = () => {
            // Smooth lerp for the outer circle
            this.cursorX += (this.mouseX - this.cursorX) * this.speed;
            this.cursorY += (this.mouseY - this.cursorY) * this.speed;
            
            const scale = this.isHovering ? this.hoverScale : 1;
            
            // Just move the circle
            this.cursorCircle.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px) scale(${scale})`;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    public refreshMagnetTargets(): void {
        const targets = document.querySelectorAll('a, button, [data-magnetic], .quick-action, .section-nav-item');
        
        targets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                this.isHovering = true;
                this.cursorCircle.classList.add('is-hovering');
            });
            
            target.addEventListener('mouseleave', () => {
                this.isHovering = false;
                this.cursorCircle.classList.remove('is-hovering');
            });
            
            // Force cursor: none on these elements too
            (target as HTMLElement).style.cursor = 'none';
        });
    }
}
