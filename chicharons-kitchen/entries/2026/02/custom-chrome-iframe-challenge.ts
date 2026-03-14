import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
    id: 'custom-chrome-iframe-challenge-feb-2026',
    date: 'Feb 5, 2026',
    sortDate: '2026-02-05T06:30:00',
    title: 'The Custom Chrome Challenge: When Iframes Fight Back',
    type: 'investigation',
    emoji: '🔍',
    tags: ['Architecture', 'Chrome', 'V2', 'Iframe', 'DOM Boundaries', 'Investigation'],
    summary: 'Attempted to enable V2\'s custom sidebar/shade in shell mode using a customChrome flag. Discovered fundamental iframe architecture limitation: V2\'s UI components are trapped inside iframe DOM and cannot escape to parent shell. Three potential solutions identified for future implementation.',
    callout: {
        icon: '⚠️',
        title: 'DOM Boundary Reality Check',
        text: 'Iframes create a hard DOM boundary. No amount of clever flags can make elements escape from iframe to parent document. This requires architectural changes, not configuration tweaks.'
    },
    highlights: [
        'Added customChrome flag to StatusBarSpec interface',
        'Updated UV7Shell to hide shell sidebar/shade when flag is true',
        'Updated ChromePresets.game() to support customChrome parameter',
        'Implemented restore logic when switching away from custom chrome apps',
        'Discovered V2\'s iframe architecture prevents custom chrome from working',
        'Identified three potential solutions (postMessage, direct loading, or accept limitation)',
        'Clean implementation of the flag system - just needs V2 architecture changes'
    ],
    problem: {
        description: 'When V2 runs in shell mode, it shows the shell\'s generic sidebar/shade instead of V2\'s custom visual novel UI (layered sidebar with swipe gestures, quick actions carousel, route theming, collectibles tracking).',
        rootCause: 'V2 runs in an iframe (index.v2.html). V2\'s Sidebar and NotificationShade components are created inside the iframe\'s DOM. When shell hides its sidebar/shade, V2\'s components remain trapped inside the iframe and cannot be seen in the parent document.'
    },
    solution: {
        approach: 'Implemented customChrome flag system successfully. Flag works correctly - shell hides its chrome when true. However, V2\'s iframe architecture prevents its custom chrome from appearing in parent DOM.',
        features: [
            '**customChrome Flag:** Optional boolean in StatusBarSpec',
            '**Shell Logic:** Checks flag and hides shell sidebar/shade when true',
            '**Restore Logic:** Re-shows shell chrome when switching away from custom chrome apps',
            '**ChromePresets Support:** game() method accepts customChrome parameter',
            '**Clean Implementation:** All infrastructure works, just needs V2 architecture changes'
        ],
        steps: [
            '**Step 1:** Added customChrome flag to StatusBarSpec interface',
            '**Step 2:** Updated UV7Shell.loadApp() to check customChrome flag',
            '**Step 3:** Hide shell sidebar/shade when customChrome is true',
            '**Step 4:** Added restore logic in unmount to re-show shell chrome',
            '**Step 5:** Updated ChromePresets.game() to accept customChrome',
            '**Step 6:** Set V2App to use customChrome: true',
            '**Step 7:** Tested and discovered iframe DOM boundary issue'
        ]
    },
    technicalDetails: {
        title: 'The Iframe DOM Boundary Problem',
        sections: [
            {
                heading: 'What Happens',
                content: `
\`\`\`typescript
// In shell (parent DOM):
UV7Shell.loadApp('v2')
  → V2App.getStatusBarSpec() returns { customChrome: true }
  → Shell hides its sidebar/shade ✅
  → Shell's sidebar: display: none ✅

// Inside V2 iframe (separate DOM):
v2/main.ts runs
  → Creates Sidebar component ✅
  → Creates NotificationShade component ✅
  → Both exist in iframe's document ✅
  → But iframe's document ≠ parent's document ❌

// Result:
// - Shell's sidebar: hidden ✅
// - V2's sidebar: exists but in wrong DOM ❌
// - User sees: nothing 😢
\`\`\`
                `
            },
            {
                heading: 'Why Iframes Create DOM Boundaries',
                content: `
Iframes are **separate browsing contexts** with their own:
- Document object
- Window object  
- DOM tree
- CSS scope
- JavaScript scope

Elements created in an iframe **cannot** be moved to the parent document. This is a fundamental browser security feature.

\`\`\`javascript
// This doesn't work:
const iframeElement = iframe.contentDocument.getElementById('sidebar');
parentDocument.body.appendChild(iframeElement); // ❌ Error!
\`\`\`
                `
            },
            {
                heading: 'Three Potential Solutions',
                content: `
**Option 1: PostMessage Communication (Complex)**
- V2App creates placeholder elements in parent DOM
- V2 iframe sends postMessage events to parent
- Parent updates placeholder content based on messages
- Requires modifying V2's Sidebar/Shade to send messages
- Event handlers need special cross-boundary handling

**Option 2: Remove Iframe (Cleaner)**  
- Load V2 directly in shell viewport (no iframe)
- V2's components naturally appear in parent DOM
- Requires ensuring V2's modules work in shell context
- May need module path adjustments
- Cleaner architecture long-term

**Option 3: Accept Limitation (Pragmatic)**
- Document that V2 in shell uses shell's sidebar/shade
- V2's custom UI only available in standalone mode
- Keep iframe architecture as-is
- Simplest short-term solution
- Can revisit later with proper refactor
                `
            }
        ]
    },
    commits: [
        {
            hash: 'e083ec8',
            message: 'feat: add customChrome flag for apps to manage their own sidebar/shade',
            files: ['types/chrome.ts', 'shell/UV7Shell.ts', 'types/ChromePresets.ts', 'shell/apps/V2App.ts']
        },
        {
            hash: 'follow-up',
            message: 'fix: restore shell sidebar/shade when switching away from customChrome apps',
            files: ['shell/UV7Shell.ts']
        }
    ],
    metrics: {
        'Files Modified': 4,
        'Lines Added': 36,
        'Lines Removed': 10,
        'New Interfaces': 1,
        'Architecture Insights': 3
    },
    nextSteps: [
        'Decide on solution approach (postMessage vs direct loading vs accept)',
        'If postMessage: Modify V2 Sidebar/Shade to send parent messages',
        'If direct loading: Refactor V2App to import and run V2 modules directly',
        'If accept: Document limitation and move on to other priorities',
        'Update CHROME_ARCHITECTURE.md with customChrome flag documentation'
    ],
    lessonsLearned: [
        '**Iframes are hard boundaries:** No clever flags can bypass fundamental DOM separation',
        '**Architecture matters:** V2\'s iframe-based loading conflicts with custom chrome goals',
        '**Flag system works:** The customChrome infrastructure is solid, just needs V2 changes',
        '**Test early:** Should have tested V2 in shell mode before implementing full flag system',
        '**Document blockers:** Important to capture architectural limitations for future work'
    ],
    relatedEntries: ['hybrid-chrome-architecture-feb-2026', 'v2-custom-chrome-solution-feb-2026'],
    status: 'completed'
};
