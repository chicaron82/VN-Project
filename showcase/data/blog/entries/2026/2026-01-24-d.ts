import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-24-d",
            "date": "January 24, 2026",
            "emoji": "🎢",
            "title": "The Great Swipe Saga: When CSS Scroll-Snap Saved the Day",
            "type": "chaos",
            "sortDate": "2026-01-24T23:00:00",
            "summary": "Epic debugging session to implement Facebook-style swipe navigation. Started with custom SwipeController transforms, discovered duplicate script overwrites, chased invisible timelines, and finally traced opacity:0 up the DOM tree. CSS scroll-snap ended up being the hero, but not before several hours of 'why is this blank?!'",
            "features": [
                "🔄 <strong>Swipe Mode Conversion:</strong> Changed from scroll-spy (vertical scrolling all sections) to swipe mode (horizontal panel sliding like mobile apps)",
                "🐛 <strong>The Phantom Overwrite:</strong> Two main.ts files loading - js/main.ts was re-initializing JourneySection and wiping the timeline after TimelineRenderer populated it",
                "👻 <strong>The Invisible Timeline:</strong> 59 entries rendering, taking up 21,094px height, but completely invisible - classic 'it's there but you can't see it' debugging",
                "🔍 <strong>DOM Tree Detective Work:</strong> Traced opacity up parent chain - .fade-in-section had opacity:0 waiting for scroll animation that never triggered in swipe mode",
                "📜 <strong>CSS Scroll-Snap Victory:</strong> Replaced complex transform-based SwipeController with native CSS scroll-snap - browser handles everything, we just sync tab indicators",
                "🎉 <strong>Birthday Party Deadline:</strong> Fixed just in time to show off to dev friend at birthday party"
            ],
            "theTimeline": [
                "<strong>Initial Problem:</strong> Showcase navigation broken - swipes not registering, content jumping, panels blank",
                "<strong>First Attempt:</strong> Custom SwipeController with touch events, transform calculations, velocity detection - too complex, still breaking",
                "<strong>Paradigm Shift:</strong> User wanted Facebook-style 1:1 direct manipulation, not just gesture detection",
                "<strong>CSS Scroll-Snap:</strong> Ditched custom JS, used native scroll-snap-type: x mandatory - instant improvement",
                "<strong>Still Blank:</strong> Swipes worked but content invisible - added debug red boxes, yellow borders, nothing visible",
                "<strong>The Duplicate Discovery:</strong> Two script tags loading main.ts AND js/main.ts - second one overwriting timeline content",
                "<strong>Still Blank After Fix:</strong> Timeline-container had correct innerHTML but opacity:0 from parent .fade-in-section class",
                "<strong>Victory:</strong> Added CSS override for .fade-in-section in swipe mode - timeline finally visible, pagination working, shipped just before party guests arrived"
            ],
            "investigation": [
                "document.querySelector('#timeline-container').innerHTML showed original comment - content was being overwritten",
                "Traced DOM: SECTION.journey-section.fade-in-section had opacity:0",
                "Scroll animations designed for vertical scrolling don't trigger in horizontal swipe mode",
                "Solution: Force opacity:1 on .fade-in-section inside .tab-panel"
            ],
            "metrics": {
                "Debug Hours": "~3",
                "Red Herrings": 5,
                "Duplicate Scripts Found": 1,
                "CSS Overrides Added": 2,
                "Party Deadline": "Met ✅"
            },
            "callout": {
                "icon": "🎂",
                "title": "Birthday Debugging",
                "text": "Nothing like a hard deadline (guests arriving) to focus the debugging effort. The cascade of issues - swipe not working, duplicate initialization, invisible content - each fix revealed the next layer. Classic debugging onion."
            },
            "quote": "The timeline was there the whole time - 21,094 pixels of invisible content. Sometimes the bug isn't that something doesn't exist, it's that something is hiding it. 💚🔥💀"
        };
