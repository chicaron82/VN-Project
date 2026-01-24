
/**
 * SocialShare.ts
 * Handles social sharing functionality.
 */
export function initSocialShare(): void {

    function shareTwitter(): void {
        const text = "Check out UV7: A visual novel engine built from chaos to harmony with AI. #UV7 #GameDev #AI";
        const url = window.location.href;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    }

    function copyLink(btn: HTMLElement | null): void {
        navigator.clipboard.writeText(window.location.href).then(() => {
            if (btn) {
                const originalText = btn.innerText;
                btn.innerText = "✅ Copied!";
                setTimeout(() => btn.innerText = originalText, 2000);
            }
        });
    }

    // Attach listener to any element with .btn-share class
    // We infer the action based on text or specific class if we had one.
    // But script.js used inline onclick. We need to replace that behavior.

    // Strategy: Find buttons that *would* have called these functions.
    // Or, for backward compatibility with HTML that still has onclick="shareTwitter()",
    // we expose them to window.

    window.shareTwitter = shareTwitter;
    window.copyLink = function (): void {
        // Need to find the button that triggered this if called via inline handler
        // But inline handler `onclick="copyLink()"` doesn't pass `this`.
        // So we just find the button manually in the DOM like the original script did.
        const btn = document.querySelector<HTMLElement>('button[onclick="copyLink()"]') || document.querySelector<HTMLElement>('.btn-share-copy');
        copyLink(btn);
    };

    // Better approach: Attach event listeners to cleaner classes if they exist
    const shareBtn = document.querySelector('.btn-share-twitter'); // Hypothetical
    if (shareBtn) shareBtn.addEventListener('click', shareTwitter);
}
