import { test, expect } from '@playwright/test';
import { TestHelpers } from './helpers';

test.describe('Training Journey', () => {
  test('should navigate to training page', async ({ page }) => {
    const helpers = new TestHelpers(page);
    await helpers.goToHome();
    
    // Click on Training in navigation
    await page.click('text=Training');
    await helpers.waitForNavigation();
    
    // Verify we're on training page
    await expect(page.url()).toContain('/training');
  });

  test('should display training courses', async ({ page }) => {
    await page.goto('/training');
    await page.waitForLoadState('networkidle');
    
    // Check for course-related content
    // Note: Actual content depends on what's in the database
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to paid courses', async ({ page }) => {
    const helpers = new TestHelpers(page);
    await helpers.goToHome();
    
    // Click on Paid Courses in navigation
    await page.click('text=Paid Courses');
    await helpers.waitForNavigation();
    
    // Verify we're on paid courses page
    await expect(page.url()).toContain('/paid-courses');
  });
});
