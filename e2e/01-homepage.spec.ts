import { test, expect } from '@playwright/test';
import { TestHelpers } from './helpers';

test.describe('Homepage', () => {
  test('should load homepage with countdown timer', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // Navigate to homepage
    await helpers.goToHome();
    
    // Verify page title
    await expect(page).toHaveTitle(/CSOAI/);
    
    // Verify promotional banner
    await helpers.verifyPromoBanner();
    
    // Verify countdown timer is working
    await helpers.verifyCountdownTimer();
    
    // Verify main heading
    await expect(page.locator('text=Securing AI\'s Future')).toBeVisible();
    await expect(page.locator('text=The Solution to AI Safety')).toBeVisible();
  });

  test('should have working navigation menu', async ({ page }) => {
    const helpers = new TestHelpers(page);
    await helpers.goToHome();
    
    // Check main navigation items
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Training')).toBeVisible();
    await expect(page.locator('text=Certification')).toBeVisible();
    await expect(page.locator('text=Watchdog')).toBeVisible();
  });

  test('should display "Start Free Training Now" button', async ({ page }) => {
    const helpers = new TestHelpers(page);
    await helpers.goToHome();
    
    // Verify CTA button is visible
    const ctaButton = page.locator('text=Start Free Training Now');
    await expect(ctaButton).toBeVisible();
    
    // Button should be clickable
    await expect(ctaButton).toBeEnabled();
  });

  test('should have countdown timer updating', async ({ page }) => {
    const helpers = new TestHelpers(page);
    await helpers.goToHome();
    
    // Get initial seconds value
    const secondsLocator = page.locator('text=Seconds').locator('..').locator('div').first();
    const initialSeconds = await secondsLocator.textContent();
    
    // Wait 2 seconds
    await page.waitForTimeout(2000);
    
    // Get new seconds value
    const newSeconds = await secondsLocator.textContent();
    
    // Seconds should have changed (either decreased or wrapped around)
    expect(initialSeconds).not.toBe(newSeconds);
  });
});
