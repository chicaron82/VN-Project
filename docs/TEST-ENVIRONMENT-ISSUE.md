# Test Environment Issue - Vitest Test Discovery Failure

**Status:** 🔴 CRITICAL - All tests failing
**Date:** 2026-01-16
**Affected:** All test files (57 test files, 0 tests running)

## Problem

All Vitest tests are failing with the error:
```
Error: No test suite found in file <path>
```

This affects:
- ✅ **Code written:** DirectorsCutController.test.ts (60+ comprehensive tests)
- ❌ **Tests running:** 0 tests discovered
- 🔴 **Status:** All 57 test files report "No test suite found"

## What's Happening

1. Vitest runs and attempts to collect tests
2. Collection phase completes (`collect 141ms`)
3. Zero tests are discovered from any file
4. All test files fail with "No test suite found"

## Investigation Results

### ✅ Confirmed NOT the Issue

- **File syntax:** Created minimal test with just `describe/it/expect` - same failure
- **TypeScript compilation:** Files compile without errors
- **Imports:** Both `import { describe, it, expect } from 'vitest'` and global usage fail
- **File location:** Tests in `src/` and `tests/` both fail
- **node_modules:** Reinstalled completely - no change
- **Vitest version:** v1.6.1 (correct and installed)
- **Config syntax:** Both vite.config.ts and vitest.config.js are valid

### 🔍 Evidence of Deeper Issue

**Minimal test that fails:**
```typescript
// src/test-minimal.test.ts
import { describe, it, expect } from 'vitest';

describe('Minimal Test', () => {
    it('should pass', () => {
        expect(true).toBe(true);
    });
});
```

**Result:**
```
Error: No test suite found in file C:/Users/silve/Downloads/GitHub/VN-Project/src/test-minimal.test.ts
```

**Different error in tests/minimal.test.js:**
```javascript
// tests/minimal.test.js
import { test, expect } from 'vitest';

test('minimal test', () => {
    expect(true).toBe(true);
});
```

**Result:**
```
TypeError: Cannot read properties of undefined (reading 'test')
```

This suggests vitest globals aren't available during import/execution.

## Configuration Files

### vite.config.ts
```typescript
test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/timeline_847_failures/**',
    ],
}
```

### vitest.config.js (also present)
```javascript
test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    exclude: [
        'node_modules/**',
        'timeline_847_failures/**',
        'dist/**'
    ],
}
```

### tests/setup.js
Issue discovered: Originally had `vi.fn()` calls which aren't available in setup files.

**Fixed version:**
```javascript
// Mock window.matchMedia for orientation queries
global.window = global.window || {};
global.window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
});
```

**Result:** Still no change - all tests still fail

## Timeline

1. **b9aa99e** - "fix(tests): Fix V2 test configuration" - Tests reportedly at 97.3% passing
2. **Current** - 100% tests failing with "No test suite found"
3. **Between these commits** - Something fundamentally broke test discovery

## Possible Causes

1. **Vitest globals not initializing** - `globals: true` not working
2. **Setup file breaking test discovery** - Even after fixing `vi.fn()` usage
3. **Conflicting config files** - Both vite.config.ts and vitest.config.js present
4. **Windows path issues** - Though paths appear correct in errors
5. **Git corruption** - Encountered git object corruption during investigation
6. **Environment-specific issue** - May be Windows-specific or local dev environment

## Workaround Used

For DirectorsCutController port (Phase 25a):
- ✅ Created comprehensive test suite (60+ tests)
- ✅ Controller integrated into main.ts successfully
- ✅ Controller compiles without errors
- ✅ Code reviewed for correctness
- ⚠️ Tests exist but cannot run due to environment issue

## Next Steps to Fix

1. **Check git history** - Find exact commit where tests broke
2. **Compare working vs broken setup.js** - May need to revert setup file completely
3. **Try removing vitest.config.js** - Use only vite.config.ts
4. **Check for global pollution** - Something may be interfering with vitest globals
5. **Try fresh vitest init** - `npm init vitest@latest` to regenerate config
6. **Check Node version** - May be Node.js version incompatibility

## Impact

- ✅ **Development:** Controllers can still be written and integrated
- ✅ **Build:** TypeScript compilation works fine
- ❌ **Testing:** Cannot verify controller behavior via tests
- ❌ **CI/CD:** If tests are part of pipeline, builds will fail
- ⚠️ **Quality:** Reduced confidence without test coverage verification

## Files Affected

- All 57 test files in the project
- DirectorsCutController.test.ts (newly created, cannot run)
- Any future test files until issue is resolved

---

**Author:** Claude Sonnet 4.5
**Session:** Phase 25a DirectorsCutController port
**Priority:** HIGH - Blocks test-driven development
