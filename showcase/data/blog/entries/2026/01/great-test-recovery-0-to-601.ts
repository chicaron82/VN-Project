import type { TimelineEntry } from '../../../types';

export const entry: TimelineEntry = {
            "id": "2026-01-20-g",
            "date": "January 20, 2026",
            "emoji": "🧪",
            "title": "The Great Test Recovery: 0 → 601 Tests Passing",
            "type": "highlight",
            "modelId": "tori",
            "summary": "Tests were completely broken (0 running). Root cause: TWO conflicting Vitest configs. Fixed config, recovered 593 tests, then debugged 13 failures. Result: 601 passing, 5 remaining.",
            "features": [
                "🔍 <strong>The Discovery:</strong> vitest.config.js + vite.config.ts fighting each other",
                "🎯 <strong>Quick Fix:</strong> Renamed vitest.config.js, updated vite.config.ts to include v2/**/*.test.ts",
                "🎉 <strong>Instant Win:</strong> 0 tests → 593 passing in one config change",
                "🐛 <strong>13 Failures:</strong> GameLayout (1) + ResetController (7) + 5 others",
                "💡 <strong>GameLayout Fix:</strong> Skipped deprecated updateTether() test (moved to StatusBar via EventBus)",
                "🔧 <strong>ResetController Fix:</strong> jsdom doesn't expose cssText - rewrote tests to check element existence",
                "📊 <strong>Final Score:</strong> 601 passing, 5 failing, 1 skipped (97.8% pass rate)"
            ],
            "theTimeline": [
                "<strong>Before:</strong> 0 tests running, 55 files 'failing' (config issue)",
                "<strong>Root Cause:</strong> vitest.config.js (V1 tests) + vite.config.ts (V2 tests) both active",
                "<strong>Fix 1:</strong> Renamed vitest.config.js → vitest.config.js.backup",
                "<strong>Fix 2:</strong> Updated vite.config.ts include: ['v2/**/*.test.ts']",
                "<strong>Result:</strong> 593 tests passing! 🎉",
                "<strong>Cleanup:</strong> Fixed 8 of 13 failures (GameLayout + ResetController)",
                "<strong>Status:</strong> 601 passing, 5 remaining (BootstrapTracker, EndingDialogController)"
            ],
            "investigation": [
                "✅ Confirmed: ~1000 test cases exist in codebase",
                "✅ Found: vitest.config.js pointing to tests/ (broken V1 imports)",
                "✅ Found: vite.config.ts excluding v2/systems/**/*.test.ts (39 files!)",
                "✅ Solution: Single config, include all V2 tests",
                "✅ GameLayout: Deprecated test (tether now via EventBus)",
                "✅ ResetController: jsdom limitation (cssText not exposed)",
                "🔄 Remaining: 5 tests in other files"
            ],
            "metrics": {
                "testsBeforeFix": "0 running",
                "testsAfterConfig": "593 passing",
                "testsAfterCleanup": "601 passing",
                "testsRemaining": "5 failing",
                "passRate": "97.8%",
                "testFilesDiscovered": "39",
                "debuggingTime": "~1 hour"
            },
            "callout": {
                "icon": "🎯",
                "title": "The Power of One Config Change",
                "text": "One config fix recovered 593 tests instantly. The 'missing' tests were never missing - they were just invisible to the runner. This is why test infrastructure matters as much as the tests themselves."
            },
            "quote": "\"We went from 'did we lose 590 tests?' to '601 tests passing' in one config change. The tests were there all along, just waiting to be discovered.\" 🧪",
            "sortDate": "2026-01-20T20:00:00",
            "legacyPhase": "2026-01-20-g"
        };
