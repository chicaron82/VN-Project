import type { TimelineEntry } from '../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-20-f",
            "date": "January 20, 2026",
            "emoji": "💥",
            "title": "The Case of 1000 Missing Tests (They're Not Missing)",
            "type": "chaos",
            "summary": "Stats said '590 tests passing'. Then they all disappeared. Panic ensued. Investigation revealed: tests didn't disappear - TWO test suites were fighting each other. V1 + V2 = Civil War.",
            "features": [
                "📊 <strong>The Stats:</strong> showcase/stats.json claimed 590 tests passing on Jan 19",
                "🔍 <strong>The Mystery:</strong> Now showing '55 test files failing, 0 tests running'",
                "😱 <strong>The Panic:</strong> Did we lose 590 tests?!",
                "🕵️ <strong>The Investigation:</strong> Counted ~1000 test cases still in the codebase",
                "💥 <strong>The Discovery:</strong> TWO competing test suites - V1 (tests/) + V2 (v2/) both trying to run",
                "🧟 <strong>V1 Tests:</strong> 16 files in tests/ importing from ../system/ (moved to v1/system/)",
                "✨ <strong>V2 Tests:</strong> 33 files in v2/ with proper code but Vitest can't discover them",
                "🎭 <strong>The Truth:</strong> Tests exist. Runner is broken. Game still works."
            ],
            "theTimeline": [
                "<strong>Jan 19 (Before):</strong> 52 test files in src/ with ~1000 test cases, 590 passing, 410 failing",
                "<strong>Jan 19 (After):</strong> src/ renamed to v2/, tests still worked",
                "<strong>Sometime Later:</strong> Vitest config broke, started running BOTH V1 and V2 tests",
                "<strong>V1 Tests:</strong> Import errors (paths moved to v1/)",
                "<strong>V2 Tests:</strong> 'No test suite found' despite having describe() blocks",
                "<strong>Result:</strong> 55 failed (16 V1 broken paths + 33 V2 undiscoverable + 6 integration) = TEST CIVIL WAR"
            ],
            "investigation": [
                "✅ Confirmed: ~1000 test cases still exist in code",
                "✅ Found: Old V1 tests in tests/ folder (broken imports)",
                "✅ Found: New V2 tests in v2/ folder (can't be discovered)",
                "❌ Fixed vite.config.ts to exclude V1 tests - still broken",
                "❌ Added 'vitest/globals' to tsconfig.json - still broken",
                "🤷 Conclusion: Vitest can load files but can't register describe() blocks (deeper config issue)"
            ],
            "metrics": {
                "testsOnJan19": "590 passing",
                "testCasesInCode": "~1000",
                "currentlyRunning": "0",
                "v1TestFiles": "16 (broken)",
                "v2TestFiles": "33 (undiscoverable)",
                "debuggingTime": "~2 hours",
                "stillNotFixed": "Yes"
            },
            "callout": {
                "icon": "💀",
                "title": "Did We Break Vitest With Too Many Tests?",
                "text": "Legitimate question: did we write so many tests that we broke the test runner? Answer: Probably not, but the test suites fighting each other definitely didn't help. Vitest can SEE the files but can't discover the test blocks inside them. Classic."
            },
            "quote": "\"We had 590 passing tests. Then we had 1000 tests that wouldn't run. Now we have a great story about why shipping > testing.\" 💥",
            "sortDate": "2026-01-20T0f",
            "legacyPhase": "2026-01-20-f"
        };
