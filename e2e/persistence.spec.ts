import { test, expect } from '@playwright/test';

test.describe('Persistence', () => {
  test('should persist route state after page refresh', async ({ page }) => {
    // Generate route change notification
    await page.goto('/student/eta');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Initialize route state
    await page.locator('button:has-text("Back to Route A")').click();
    await page.locator('button:has-text("Change to Route B")').click();

    // Navigate to notifications to ensure notification is generated
    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');
    
    // Click "all" filter
    await page.locator('button').filter({ hasText: /^all$/i }).click();
    await page.waitForTimeout(3000);

    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Click "all" filter again after refresh
    await page.locator('button').filter({ hasText: /^all$/i }).click();
    await page.waitForTimeout(3000);

    // Route change notification should still be present (looks for "to Route B")
    await expect(page.locator('text=/to Route B — RS Puram Express/i')).toBeVisible();
  });

  test('should persist student status after page refresh', async ({ page }) => {
    // Set student status
    await page.goto('/parent');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // First set to waiting so pickup will generate notification
    await page.locator('button:has-text("Waiting")').click();
    await page.locator('button:has-text("Picked Up")').click();

    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Status should still be Picked Up
    await expect(page.locator('div:has-text("Picked Up")').first()).toBeVisible();
  });

  test('should persist notifications after page refresh', async ({ page }) => {
    // Generate notifications
    await page.goto('/student/eta');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Initialize route state
    await page.locator('button:has-text("Back to Route A")').click();
    await page.locator('button:has-text("Change to Route B")').click();

    // Navigate to notifications to ensure notification is generated
    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');
    
    // Click "all" filter
    await page.locator('button').filter({ hasText: /^all$/i }).click();
    await page.waitForTimeout(3000);

    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Click "all" filter again after refresh
    await page.locator('button').filter({ hasText: /^all$/i }).click();
    await page.waitForTimeout(3000);

    // Notification should still be present
    await expect(page.locator('span:has-text("Route Changed")')).toBeVisible();
  });

  test('should persist notification read state after page refresh', async ({ page }) => {
    // Generate notification and mark as read
    await page.goto('/student/eta');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Initialize route state
    await page.locator('button:has-text("Back to Route A")').click();
    await page.locator('button:has-text("Change to Route B")').click();

    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');
    
    // Click "all" filter
    await page.locator('button').filter({ hasText: /^all$/i }).click();
    await page.waitForTimeout(3000);
    
    await page.locator('button:has-text("Mark all read")').click();
    await page.waitForTimeout(500);

    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Unread count should remain 0
    const unreadCount = await page.locator('text=/unread notifications/i').textContent();
    expect(unreadCount).toContain('0');
  });
});
