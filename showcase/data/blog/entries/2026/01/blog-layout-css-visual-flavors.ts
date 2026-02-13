import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
    "id": "2026-01-31-c",
    "date": "January 31, 2026",
    "emoji": "🎨",
    "title": "Phase 2: Blog-Style CSS with Visual Flavors",
    "type": "polish",
    "sortDate": "2026-01-31T11:00:00",
    "summary": "Created blog-timeline.css with glassmorphism cards, category theming, and visual flavors. Each entry type got its own gradient theme: 🔥 V1/Chaos (red/orange fire), ⚡ V2/Polish (indigo/purple clean), 🛠️ Shell/Milestone (cyan/green architectural).",
    "features": [
        "💎 <strong>Glassmorphism Cards:</strong> Backdrop-filter blur, translucent backgrounds, smooth hover effects",
        "🌈 <strong>Visual Flavors:</strong> Category-specific gradient themes (V1=fire, V2=polish, Shell=architectural)",
        "📱 <strong>Responsive Design:</strong> Mobile-first with stacked header, smaller fonts, tighter spacing",
        "✨ <strong>Hover Effects:</strong> translateY lift, box-shadow glow, border shimmer",
        "🎯 <strong>Read More Button:</strong> Gradient background (indigo → purple), animated arrow rotation",
        "🔍 <strong>Spotlight Mode:</strong> Dimmed unfocused entries (blur + grayscale) during search"
    ],
    "metrics": {
        "New File": "blog-timeline.css",
        "Lines of CSS": "382 lines",
        "Visual Flavors": "3 (V1/Chaos, V2/Polish, Shell/Milestone)",
        "Responsive Breakpoints": "2 (mobile, desktop)"
    },
    "callout": {
        "icon": "🎨",
        "title": "Visual Flavors",
        "text": "Each category got its own visual identity: V1/Chaos entries feel like fire (red/orange), V2/Polish entries feel refined (indigo/purple), Shell/Milestone entries feel architectural (cyan/green). The gradients shift the mood before you even read the content.",
        "type": "highlight"
    },
    "problem": {
        "description": "Phase 1 created the blog layout structure but had no styling. Entries looked like plain text blocks. Needed visual identity that matched the content—chaos should look chaotic, polish should look polished.",
        "rootCause": "Separation of concerns: Phase 1 focused on HTML structure, Phase 2 focused on CSS styling. Incremental approach kept each phase manageable."
    },
    "solution": {
        "approach": "Created dedicated blog-timeline.css with modern CSS features: glassmorphism (backdrop-filter), category-based theming (data attributes), responsive design (clamp, flexbox), and smooth transitions.",
        "features": [
            "Glassmorphism: backdrop-filter: blur(20px) + translucent backgrounds",
            "Category theming: [data-category='v1'] gets red/orange gradients",
            "Responsive typography: clamp(1.5rem, 3vw, 2rem) for fluid scaling",
            "Hover effects: translateY(-2px) lift + box-shadow glow",
            "Spotlight mode: :not(.focused) entries get blur(2px) + grayscale(60%)"
        ]
    },
    "quote": "Each entry is a page in the playground journal.",
    "crew": [
        {
            "name": "Aaron (Design Direction)",
            "icon": "🎨",
            "contribution": "Defined the 'visual flavors' concept—V1 should feel like fire, V2 should feel polished"
        },
        {
            "name": "Claude Sonnet 4.5 (CSS Implementation)",
            "icon": "🤖",
            "contribution": "Implemented glassmorphism, category theming, responsive design, and spotlight mode"
        }
    ]
};
