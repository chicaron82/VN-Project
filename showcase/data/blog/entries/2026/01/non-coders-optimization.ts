import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-25-a",
            "date": "January 25, 2026",
            "emoji": "🧠",
            "title": "The Non-Coder's Optimization: When the Human Teaches the AI",
            "type": "milestone",
            "sortDate": "2026-01-25T16:00:00",
            "summary": "Aaron (non-coder) independently discovered the DRY principle by looking at showcase HTML and asking 'why are we typing this 6 times?' Implemented FooterInjector and BannerGenerator utilities, eliminating 182 lines of duplication and adding XSS protection. Proof that human-AI collaboration works both ways.",
            "features": [
                "🧠 <strong>DRY Discovery:</strong> Non-coder spotted footer duplication across 6 sections just by reading HTML - 'is there a way to make it more efficient?'",
                "🎯 <strong>FooterInjector:</strong> Single HTML <template> + JavaScript cloning replaces 6 duplicate footers (102 lines saved)",
                "🎨 <strong>BannerGenerator:</strong> Centralized banner creation with config objects replaces 5 duplicate hero banners (80 lines saved)",
                "🔒 <strong>Security Bonus:</strong> Added HTML escaping to prevent XSS attacks - `escapeHtml()` function sanitizes all user-facing content",
                "📦 <strong>Bundle Optimization:</strong> showcase.js reduced from 286 KB → 282 KB, index.html from 40.56 KB → 35.57 KB",
                "✅ <strong>Test Coverage:</strong> 8 new tests added (FooterInjector + BannerGenerator) - including XSS protection verification"
            ],
            "problem": {
                "description": "Six sections in showcase HTML each had identical footer markup (22 lines) and similar hero banner markup (27 lines). Standard 'copy-paste' duplication.",
                "rootCause": "When building sections one by one, each was implemented independently without considering shared patterns. Classic early-stage codebase issue."
            },
            "solution": {
                "approach": "Create reusable utilities following established software engineering patterns - template cloning for static content, generator functions for dynamic content",
                "features": [
                    "FooterInjector: HTML5 <template> element stores footer once, JavaScript clones into 6 placeholders on page load",
                    "BannerGenerator: TypeScript function generates hero banners from config objects (title, subtitle, image, alt)",
                    "Type safety: BannerConfig interface ensures all banners have required fields",
                    "Security: escapeHtml() prevents malicious script injection via user-controlled config"
                ]
            },
            "metrics": {
                "Lines Removed": 182,
                "Bundle Size Reduction": "4 KB (showcase.js)",
                "HTML Size Reduction": "5 KB (index.html)",
                "Tests Added": 8,
                "Maintenance Impact": "Change once, affects all 6 sections",
                "Discovery Source": "Non-coder code review"
            },
            "callout": {
                "icon": "🧠",
                "title": "Role Reversal",
                "text": "AI suggesting optimizations to humans? Expected. Human suggesting optimizations to AI? That's the good stuff. The non-coder saw the inefficiency precisely BECAUSE they weren't bogged down in 'this is just how we do it.' Fresh eyes spot patterns that experts miss. This is what genuine collaboration looks like."
            },
            "quote": "that deserves an entry lol - Aaron, after discovering a fundamental software engineering principle just by looking at HTML and thinking 'this seems repetitive.' 💚🔥💀"
        };
