import { test, expect } from '@playwright/test';

test.describe('Mark All as Read', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and generate a notification
    await page.goto('/student/eta');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // First initialize route state
    await page.locator('button:has-text("Back to Route A")').click();
    
    // Generate a route change notification
    await page.locator('button:has-text("Change to Route B")').click();
  });

  test('should mark all notifications as read', async ({ page }) => {
    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');

    // Click "all" filter to ensure we see all notifications
    const allFilterBtn = page.locator('button').filter({ hasText: /^all$/i });
    await allFilterBtn.click();

    // Wait for notification to appear
    await page.waitForTimeout(3000);

    // Get initial unread count
    const unreadCountBefore = await page.locator('text=/unread notifications/i').textContent();
    expect(unreadCountBefore).toContain('1');

    // Click "Mark all read" button
    const markAllReadBtn = page.locator('button:has-text("Mark all read")');
    await markAllReadBtn.click();

    // Wait for state update
    await page.waitForTimeout(500);

    // Verify unread count is 0
    const unreadCountAfter = await page.locator('text=/unread notifications/i').textContent();
    expect(unreadCountAfter).toContain('0');
  });

  test('should persist read state after page refresh', async ({ page }) => {
    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');

    // Mark all as read
    await page.locator('button:has-text("Mark all read")').click();
    await page.waitForTimeout(500);

    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify unread count remains 0
    const unreadCount = await page.locator('text=/unread notifications/i').textContent();
    expect(unreadCount).toContain('0');
  });
});
