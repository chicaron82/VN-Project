/**
 * Footer Injector
 * Clones the footer template into all placeholder divs
 * 
 * DRY Efficiency: Reduces ~180 lines of duplicated HTML to 1 template
 */

export function injectFooters(): void {
    const template = document.getElementById('footer-template') as HTMLTemplateElement;
    if (!template) {
        console.warn('[FooterInjector] Footer template not found');
        return;
    }

    const placeholders = document.querySelectorAll('.footer-placeholder');
    
    placeholders.forEach((placeholder) => {
        // Clone template content
        const footerClone = template.content.cloneNode(true);
        // Replace placeholder with cloned footer
        placeholder.replaceWith(footerClone);
    });

    console.log(`✅ [FooterInjector] Injected ${placeholders.length} footers`);
}
