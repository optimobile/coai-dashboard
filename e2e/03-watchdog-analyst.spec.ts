import { test, expect } from '@playwright/test';
import { TestHelpers } from './helpers';

test.describe('Watchdog Analyst Journey', () => {
  test('should navigate to watchdog page', async ({ page }) => {
    const helpers = new TestHelpers(page);
    await helpers.goToHome();
    
    // Click on Watchdog in navigation
    await page.click('text=Watchdog');
    await helpers.waitForNavigation();
    
    // Verify we're on watchdog page
    await expect(page.url()).toContain('/watchdog');
  });

  test('should display analyst application information', async ({ page }) => {
    await page.goto('/watchdog');
    await page.waitForLoadState('networkidle');
    
    // Verify page loaded
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to workbench', async ({ page }) => {
    await page.goto('/workbench');
    await page.waitForLoadState('networkidle');
    
    // Verify workbench page loaded
    await expect(page.locator('body')).toBeVisible();
  });
});
