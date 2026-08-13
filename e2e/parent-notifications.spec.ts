import { test, expect } from '@playwright/test';

test.describe('Parent Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/parent/notifications');
    await page.waitForLoadState('networkidle');
  });

  test('should display notification list', async ({ page }) => {
    // Use specific context to avoid strict mode violation
    await expect(page.locator('h1:has-text("Notifications")')).toBeVisible();
  });

  test('should display unread count', async ({ page }) => {
    // Use specific context to avoid strict mode violation
    await expect(page.locator('text=/unread notifications/i')).toBeVisible();
  });

  test('should display notification preferences', async ({ page }) => {
    await expect(page.locator('text=/Notification Preferences/i')).toBeVisible();
  });

  test('should generate and display pickup notification', async ({ page }) => {
    // Generate pickup notification
    await page.goto('/parent');
    await page.waitForLoadState('networkidle');
    
    // First set to waiting so pickup will generate notification
    await page.locator('button:has-text("Waiting")').click();
    await page.locator('button:has-text("Picked Up")').click();

    // Navigate to notifications
    await page.goto('/parent/notifications');
    await page.waitForLoadState('networkidle');

    // Click "all" filter to ensure we see all notifications
    const allFilterBtn = page.locator('button').filter({ hasText: /^all$/i });
    await allFilterBtn.click();

    // Wait for notification to appear (polling takes 2 seconds)
    await page.waitForTimeout(3000);

    // Check for pickup notification
    await expect(page.locator('text=/Student Picked Up/i')).toBeVisible();
  });

  test('should generate and display drop-off notification', async ({ page }) => {
    // Generate drop-off notification
    await page.goto('/parent');
    await page.waitForLoadState('networkidle');
    await page.locator('button:has-text("Picked Up")').click();
    await page.locator('button:has-text("Dropped Off")').click();

    // Navigate to notifications
    await page.goto('/parent/notifications');
    await page.waitForLoadState('networkidle');

    // Check for drop-off notification
    await expect(page.locator('text=/Student Dropped Off/i')).toBeVisible();
  });
});
