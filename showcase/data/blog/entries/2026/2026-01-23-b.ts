import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-23-b",
            "date": "January 23, 2026",
            "emoji": "🏠",
            "title": "HOME Tab: The 'We Went Full Michelin' Landing Page",
            "type": "milestone",
            "sortDate": "2026-01-23T18:00:00",
            "summary": "Added a HOME tab as the default landing page with expanded narrative about the UV7 OS ecosystem. The 'bougie rabbit hole' story needed a proper introduction - tabs moved below system banner, footer-per-panel architecture, and horizontal swipe finally working right.",
            "features": [
                "🌐 <strong>HOME Tab First:</strong> New landing page explaining the 'We Went Full Michelin' story - status bar, notification shade, sidebar, tab system.",
                "📍 <strong>Tabs Below Banner:</strong> Moved tab bar from floating position to directly under system banner for cleaner hierarchy.",
                "🦶 <strong>Footer Architecture:</strong> Added footer to each tab panel (7 instances) - eliminates white space gap, content flows naturally.",
                "✍️ <strong>Text Flow Polish:</strong> Fixed awkward line breaks ('operating system' split, 'Journey tab has the' split) - shorter, punchier sentences.",
                "🎯 <strong>Hero Section Fix:</strong> Changed from min-height:100vh to height:auto with min-height:60vh - content no longer cut off."
            ],
            "theTimeline": [
                "<strong>Session Start:</strong> 'What if we moved the tabs to the top and added a HOME tab to display the hero section?'",
                "<strong>Content Strategy:</strong> HOME tells the 'over-engineering manifesto' - playful, meta tone about building an OS for a visual novel.",
                "<strong>Footer Issue:</strong> White space before footer in each section. Fixed by moving footer INSIDE each panel (7 panels × footer).",
                "<strong>Sync Nightmare:</strong> Adding home tab broke everything - breadcrumb/active tab off by one, swipe skipping panels.",
                "<strong>Root Cause #1:</strong> scroll-spy IntersectionObserver firing on page load, overriding initial state. Solution: Disabled scroll-spy (not needed in swipe mode).",
                "<strong>Root Cause #2:</strong> .tab-panel padding:1rem causing 32px misalignment. Panels not exactly 100% width. Solution: padding:0 in swipe mode.",
                "<strong>Root Cause #3:</strong> Swipe momentum carrying past multiple panels. Solution: Enforce one-panel-at-a-time in onScrollEnd.",
                "<strong>Blank Content Bug:</strong> Components mounting before layout calculated. Solution: Force display:block + reflow + resize event after swipe init.",
                "<strong>Final State:</strong> HOME lands perfectly, swipe corrects momentum, all tabs sync, content renders immediately."
            ],
            "metrics": {
                "tabs_added": "1 (HOME)",
                "footers_added": "7",
                "bugs_fixed": "5",
                "approach": "Surgical debugging"
            },
            "callout": {
                "icon": "🔬",
                "title": "Debugging Is Detective Work",
                "text": "Five separate issues hiding behind one symptom. Each fix revealed the next layer. scroll-spy → padding → momentum → layout recalc. Patience wins."
            },
            "quote": "Sometimes you gotta break things five different ways before you understand how they work. — Chicharon"
        };
