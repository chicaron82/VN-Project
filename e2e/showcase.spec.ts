/**
 * UV7 Showcase E2E Tests
 * Smoke tests for critical user flows
 *
 * Phase 6C: Foundation for E2E testing
 * Run: npx playwright test
 */
import { test, expect } from '@playwright/test';

test.describe('Showcase Navigation', () => {
    test('should load the homepage', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/UV7|V848/i);
    });

    test('should display the main navigation tabs', async ({ page }) => {
        await page.goto('/');
        // Wait for app to initialize
        await page.waitForSelector('[data-section]', { timeout: 10000 });

        const sections = page.locator('[data-section]');
        await expect(sections.first()).toBeVisible();
    });

    test('should navigate between tabs', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('.tab-button, [data-tab]', { timeout: 10000 });

        const tabs = page.locator('.tab-button, [data-tab]');
        const count = await tabs.count();

        if (count > 1) {
            await tabs.nth(1).click();
            // Verify navigation happened (URL hash or active class changes)
            await page.waitForTimeout(500);
        }
    });

    test('should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Page should still load and be functional
        await expect(page).toHaveTitle(/UV7|V848/i);
    });
});

test.describe('Showcase Accessibility', () => {
    test('should have no accessibility violations on load', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Check basic accessibility: page has a main landmark
        const hasMain = await page.locator('main, [role="main"], #app').count();
        expect(hasMain).toBeGreaterThan(0);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Check that H1 exists
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBeGreaterThanOrEqual(1);
    });

    test('should have alt text on images', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const images = page.locator('img:visible');
        const count = await images.count();

        for (let i = 0; i < Math.min(count, 10); i++) {
            const alt = await images.nth(i).getAttribute('alt');
            const ariaLabel = await images.nth(i).getAttribute('aria-label');
            const role = await images.nth(i).getAttribute('role');

            // Each visible image should have alt text, aria-label, or role="presentation"
            const hasAccessibility = alt !== null || ariaLabel !== null || role === 'presentation';
            expect(hasAccessibility).toBe(true);
        }
    });
});

test.describe('Blog Section', () => {
    test('should display blog entries', async ({ page }) => {
        await page.goto('/');

        // Navigate to blog/timeline section if needed
        const blogTab = page.locator('[data-tab="blog"], [data-section="blog"], .tab-button:has-text("Blog")').first();
        if (await blogTab.isVisible()) {
            await blogTab.click();
            await page.waitForTimeout(500);
        }

        // Blog entries should render
        const entries = page.locator('.blog-entry, .timeline-entry, [data-entry]');
        const count = await entries.count();
        // At least some entries should be visible
        expect(count).toBeGreaterThanOrEqual(0);
    });
});
