import { test, expect } from '@playwright/test';

test.describe('Student Portal Sidebar Navigation', () => {
  test('should navigate to Notifications page via sidebar', async ({ page }) => {
    // Start at student dashboard
    await page.goto('/student');
    await page.waitForLoadState('networkidle');

    // Click the Notifications link in the sidebar
    const notificationsLink = page.locator('a[href="/student/notifications"]');
    await expect(notificationsLink).toBeVisible();
    await notificationsLink.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Verify we're on the correct route
    expect(page.url()).toContain('/student/notifications');

    // Verify the Notifications page renders
    await expect(page.locator('h1:has-text("Notifications")')).toBeVisible();
  });

  test('should navigate to Notifications page and return HTTP 200', async ({ page }) => {
    // Navigate directly to the notifications page
    const response = await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');

    // Verify HTTP 200 response
    expect(response?.status()).toBe(200);

    // Verify the page renders correctly
    await expect(page.locator('h1:has-text("Notifications")')).toBeVisible();
  });
});
