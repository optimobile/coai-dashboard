import { Page, expect } from '@playwright/test';

/**
 * E2E Test Helpers for COAI Dashboard
 */

export class TestHelpers {
  constructor(public page: Page) {}

  /**
   * Navigate to homepage
   */
  async goToHome() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for and click an element
   */
  async clickElement(selector: string) {
    await this.page.waitForSelector(selector, { state: 'visible' });
    await this.page.click(selector);
  }

  /**
   * Fill a form field
   */
  async fillField(selector: string, value: string) {
    await this.page.waitForSelector(selector, { state: 'visible' });
    await this.page.fill(selector, value);
  }

  /**
   * Check if element contains text
   */
  async expectTextContent(selector: string, text: string) {
    const element = await this.page.waitForSelector(selector);
    const content = await element.textContent();
    expect(content).toContain(text);
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take a screenshot for debugging
   */
  async screenshot(name: string) {
    await this.page.screenshot({ path: `e2e/screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Check if countdown timer is visible and working
   */
  async verifyCountdownTimer() {
    // Check for countdown elements
    await expect(this.page.locator('text=Days')).toBeVisible();
    await expect(this.page.locator('text=Hours')).toBeVisible();
    await expect(this.page.locator('text=Minutes')).toBeVisible();
    await expect(this.page.locator('text=Seconds')).toBeVisible();
    
    // Verify numbers are present
    const daysElement = this.page.locator('text=Days').locator('..').locator('div').first();
    await expect(daysElement).toBeVisible();
  }

  /**
   * Verify promotional banner
   */
  async verifyPromoBanner() {
    await expect(this.page.locator('text=First 10,000 signups get full training FREE')).toBeVisible();
    await expect(this.page.locator('text=EU AI Act Enforcement Deadline')).toBeVisible();
  }

  /**
   * Click "Start Free Training Now" button
   */
  async clickStartTraining() {
    await this.clickElement('text=Start Free Training Now');
  }
}

/**
 * Mock user data for testing
 */
export const mockUsers = {
  analyst: {
    email: 'test-analyst@example.com',
    name: 'Test Analyst',
    password: 'TestPassword123!',
  },
  admin: {
    email: 'test-admin@example.com',
    name: 'Test Admin',
    password: 'AdminPassword123!',
  },
};
