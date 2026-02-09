/**
 * Footer Injector
 * Clones the footer template into all placeholder divs
 * 
 * DRY Efficiency: Reduces ~180 lines of duplicated HTML to 1 template
 */

import { Logger } from '@utils/Logger';

export function injectFooters(): void {
    const template = document.getElementById('footer-template') as HTMLTemplateElement;
    if (!template) {
        Logger.warn('[FooterInjector] Footer template not found');
        return;
    }

    const placeholders = document.querySelectorAll('.footer-placeholder');
    
    placeholders.forEach((placeholder) => {
        // Clone template content
        const footerClone = template.content.cloneNode(true);
        // Replace placeholder with cloned footer
        placeholder.replaceWith(footerClone);
    });

    Logger.ui(`✅ [FooterInjector] Injected ${placeholders.length} footers`);
}
