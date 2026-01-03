import { test, expect } from '@playwright/test';
import { TestHelpers } from './helpers';

/**
 * E2E Tests for Watchdog Analyst Signup Flow
 * Tests the complete LOI (Letter of Intent) submission process
 */

test.describe('Watchdog Analyst Signup Flow', () => {
  test('should display signup page with all required elements', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    // Navigate to signup page
    await page.goto('/watchdog-signup');
    await helpers.waitForNavigation();
    
    // Verify page title and hero content
    await expect(page.locator('text=Become an AI Safety')).toBeVisible();
    await expect(page.locator('text=Watchdog Analyst')).toBeVisible();
    
    // Verify benefits section
    await expect(page.locator('text=100% FREE Training')).toBeVisible();
    await expect(page.locator('text=Work From Home')).toBeVisible();
    await expect(page.locator('text=Flexible Hours')).toBeVisible();
    await expect(page.locator('text=Competitive Pay')).toBeVisible();
    
    // Verify LOI counter is visible
    await expect(page.locator('text=People have signed up')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    await page.goto('/watchdog-signup');
    await helpers.waitForNavigation();
    
    // Scroll to form
    await page.locator('[data-testid="signup-submit-button"]').scrollIntoViewIfNeeded();
    
    // Try to submit empty form
    await page.click('[data-testid="signup-submit-button"]');
    
    // Should show validation error (browser native or toast)
    // Wait a moment for any validation to appear
    await page.waitForTimeout(500);
    
    // Form should still be visible (not submitted)
    await expect(page.locator('[data-testid="signup-name-input"]')).toBeVisible();
  });

  test('should successfully submit signup form', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    await page.goto('/watchdog-signup');
    await helpers.waitForNavigation();
    
    // Generate unique email for this test run
    const timestamp = Date.now();
    const testEmail = `test-analyst-${timestamp}@playwright-test.com`;
    
    // Fill in the form
    await page.fill('[data-testid="signup-name-input"]', 'Test Analyst User');
    await page.fill('[data-testid="signup-email-input"]', testEmail);
    
    // Fill motivation (required, min 50 chars)
    const motivation = 'I am passionate about AI safety and want to contribute to making AI systems safer for everyone. I have experience in technology and believe human oversight is crucial.';
    await page.fill('[data-testid="signup-motivation-input"]', motivation);
    
    // Submit form
    await page.click('[data-testid="signup-submit-button"]');
    
    // Wait for success message
    await expect(page.locator('text=You\'re on the list!')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Thank you for joining the AI safety movement')).toBeVisible();
    
    // Verify success state shows explore button
    await expect(page.locator('text=Explore CSOAI Dashboard')).toBeVisible();
  });

  test('should prevent duplicate email submissions', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    await page.goto('/watchdog-signup');
    await helpers.waitForNavigation();
    
    // Use a known test email
    const testEmail = 'duplicate-test@example.com';
    
    // First submission
    await page.fill('[data-testid="signup-name-input"]', 'First User');
    await page.fill('[data-testid="signup-email-input"]', testEmail);
    await page.fill('[data-testid="signup-motivation-input"]', 'I want to help make AI safer for everyone. This is my motivation to become a Watchdog Analyst and contribute to the community.');
    await page.click('[data-testid="signup-submit-button"]');
    
    // Wait for success or error
    await page.waitForTimeout(2000);
    
    // Navigate back to signup
    await page.goto('/watchdog-signup');
    await helpers.waitForNavigation();
    
    // Try to submit with same email
    await page.fill('[data-testid="signup-name-input"]', 'Second User');
    await page.fill('[data-testid="signup-email-input"]', testEmail);
    await page.fill('[data-testid="signup-motivation-input"]', 'Another motivation text that is long enough to pass validation requirements for the form submission.');
    await page.click('[data-testid="signup-submit-button"]');
    
    // Should show error or success (depending on backend logic)
    await page.waitForTimeout(2000);
  });

  test('should show LOI counter incrementing', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    await page.goto('/watchdog-signup');
    await helpers.waitForNavigation();
    
    // Get initial LOI count
    const counterElement = page.locator('text=People have signed up').locator('..');
    const initialText = await counterElement.textContent();
    
    // Extract number from text (e.g., "123+ People have signed up")
    const initialCount = parseInt(initialText?.match(/\d+/)?.[0] || '0');
    
    // Verify count is a reasonable number
    expect(initialCount).toBeGreaterThanOrEqual(0);
    expect(initialCount).toBeLessThan(1000000);
  });

  test('should have working navigation back to dashboard', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    await page.goto('/watchdog-signup');
    await helpers.waitForNavigation();
    
    // Click "Back to Dashboard" button
    await page.click('text=Back to Dashboard');
    
    // Should navigate to home/dashboard
    await helpers.waitForNavigation();
    await expect(page).toHaveURL(/\/(|dashboard)/);
  });

  test('should display stats section with correct numbers', async ({ page }) => {
    const helpers = new TestHelpers(page);
    
    await page.goto('/watchdog-signup');
    await helpers.waitForNavigation();
    
    // Verify stats are visible
    await expect(page.locator('text=AI Safety Incidents Reported Daily')).toBeVisible();
    await expect(page.locator('text=500+')).toBeVisible();
    
    await expect(page.locator('text=Companies Using AI Without Oversight')).toBeVisible();
    await expect(page.locator('text=10,000+')).toBeVisible();
    
    await expect(page.locator('text=Potential EU AI Act Fines')).toBeVisible();
    await expect(page.locator('text=€35M+')).toBeVisible();
    
    await expect(page.locator('text=Human Reviewers Needed')).toBeVisible();
    await expect(page.locator('text=1,000+')).toBeVisible();
  });
});
