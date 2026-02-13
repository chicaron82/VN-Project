import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
    "id": "2026-01-31-d",
    "date": "January 31, 2026",
    "emoji": "✍️",
    "title": "Phase 3: Crew Attribution & Contributor Signatures",
    "type": "milestone",
    "sortDate": "2026-01-31T12:00:00",
    "summary": "Added crew attribution blocks showing who built what (icon + name + contribution), plus AI contributor signatures at the end of each entry. DiZee signs 'Built with precision.' Belle signs 'Chef's kiss. 💋' Tori signs 'Zero regressions.' Genzee signs 'Vibes are immaculate.'",
    "features": [
        "👥 <strong>Crew Attribution Blocks:</strong> Full crew contributions with icons, cards for each member, team quote",
        "✍️ <strong>AI Signatures:</strong> Each AI contributor signs their work with a catchphrase",
        "🎖️ <strong>Footer Badges:</strong> Special completion messages with green accent",
        "🎨 <strong>Gradient Styling:</strong> Crew blocks get gradient backgrounds with accent borders",
        "📝 <strong>Contributor Mapping:</strong> getContributorSignature() method maps modelId to catchphrase"
    ],
    "metrics": {
        "Files Modified": "2 (TimelineRenderer.ts, blog-timeline.css)",
        "Lines Added": "+195",
        "AI Signatures": "4 (DiZee, Belle, Tori, Genzee)",
        "New CSS Classes": "6 (.crew-attribution-block, .crew-members, etc.)"
    },
    "callout": {
        "icon": "🎯",
        "title": "AI Personality",
        "text": "Each AI has a signature style: DiZee is precise and technical, Belle is playful and enthusiastic, Tori is quality-focused and thorough, Genzee is vibe-aware and casual. The signatures reflect their personalities while giving credit for their work.",
        "type": "highlight"
    },
    "problem": {
        "description": "Timeline entries showed what was built but not who built it. The crew (Aaron + AI collaborators) deserved credit. Also, readers couldn't tell which AI contributed which features—was this DiZee's precision or Belle's creativity?",
        "rootCause": "Earlier phases focused on content layout and styling. Attribution was a natural next step once the presentation was solid."
    },
    "solution": {
        "approach": "Added two attribution systems: (1) Crew blocks showing full team contributions with icons and roles, (2) AI signatures at entry footer showing which AI built that feature, with personality-matched catchphrases.",
        "features": [
            "Crew attribution blocks with gradient background and accent border",
            "Grid layout for crew member cards (icon + name + contribution)",
            "Crew quote section with italicized team quote",
            "Footer badges for completion messages (green accent)",
            "Contributor signatures: right-aligned, subtle, personality-matched",
            "getContributorSignature() helper mapping modelId → catchphrase"
        ]
    },
    "quote": "Every entry is signed by the AI that built it.",
    "crew": [
        {
            "name": "DiZee",
            "icon": "⚙️",
            "contribution": "Built with precision. (Signature catchphrase)"
        },
        {
            "name": "Belle",
            "icon": "💋",
            "contribution": "Chef's kiss. (Signature catchphrase)"
        },
        {
            "name": "Tori",
            "icon": "🎯",
            "contribution": "Zero regressions. (Signature catchphrase)"
        },
        {
            "name": "Genzee",
            "icon": "✨",
            "contribution": "Vibes are immaculate. (Signature catchphrase)"
        }
    ]
};
