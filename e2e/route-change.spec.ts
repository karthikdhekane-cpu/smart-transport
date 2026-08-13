import { test, expect } from '@playwright/test';

test.describe('Route Change Notifications', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/student/eta');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('should generate route change notification when changing to Route B', async ({ page }) => {
    await page.goto('/student/eta');
    await page.waitForLoadState('networkidle');

    // First initialize route state by clicking "Back to Route A" (won't generate notification on first click)
    await page.locator('button:has-text("Back to Route A")').click();

    // Now change to Route B (will generate notification)
    const changeToRouteB = page.locator('button:has-text("Change to Route B")');
    await changeToRouteB.click();

    // Navigate to notifications
    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');

    // Click "all" filter to ensure we see all notifications
    const allFilterBtn = page.locator('button').filter({ hasText: /^all$/i });
    await allFilterBtn.click();

    // Wait for notification to appear (polling takes 2 seconds)
    await page.waitForTimeout(3000);

    // Check for ROUTE_CHANGED notification (use span to avoid filter button)
    const routeChangedNotification = page.locator('span:has-text("Route Changed")');
    await expect(routeChangedNotification).toBeVisible();

    // Check for route change message (looks for "to Route B" in the message)
    await expect(page.locator('text=/to Route B — RS Puram Express/i')).toBeVisible();
  });

  test('should generate another route change notification when changing to Route C', async ({ page }) => {
    await page.goto('/student/eta');
    await page.waitForLoadState('networkidle');

    // First initialize route state
    await page.locator('button:has-text("Back to Route A")').click();

    // Change to Route B first
    await page.locator('button:has-text("Change to Route B")').click();

    // Then change to Route C
    await page.locator('button:has-text("Change to Route C")').click();

    // Navigate to notifications
    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');

    // Click "all" filter to ensure we see all notifications
    const allFilterBtn = page.locator('button').filter({ hasText: /^all$/i });
    await allFilterBtn.click();

    // Wait for notification to appear (polling takes 2 seconds)
    await page.waitForTimeout(3000);

    // Check for route change notification mentioning Route C (looks for "to Route C")
    await expect(page.locator('text=/to Route C — Peelamedu Circuit/i')).toBeVisible();
  });

  test('should not create duplicate notification for same route change', async ({ page }) => {
    await page.goto('/student/eta');
    await page.waitForLoadState('networkidle');

    // First initialize route state
    await page.locator('button:has-text("Back to Route A")').click();

    // Change to Route C
    await page.locator('button:has-text("Change to Route C")').click();

    // Try to change to Route C again
    await page.locator('button:has-text("Change to Route C")').click();

    // Navigate to notifications
    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');

    // Click "all" filter to ensure we see all notifications
    const allFilterBtn = page.locator('button').filter({ hasText: /^all$/i });
    await allFilterBtn.click();

    // Wait for notification to appear (polling takes 2 seconds)
    await page.waitForTimeout(3000);

    // Count ROUTE_CHANGED notifications for Route C (looks for "to Route C")
    const routeCNotifications = await page.locator('text=/to Route C — Peelamedu Circuit/i').count();
    expect(routeCNotifications).toBe(1);
  });

  test('should generate notification when returning to Route A', async ({ page }) => {
    await page.goto('/student/eta');
    await page.waitForLoadState('networkidle');

    // First initialize route state
    await page.locator('button:has-text("Back to Route A")').click();

    // Change to Route D then back to Route A
    await page.locator('button:has-text("Change to Route D")').click();
    await page.locator('button:has-text("Back to Route A")').click();

    // Navigate to notifications
    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');

    // Click "all" filter to ensure we see all notifications
    const allFilterBtn = page.locator('button').filter({ hasText: /^all$/i });
    await allFilterBtn.click();

    // Wait for notification to appear (polling takes 2 seconds)
    await page.waitForTimeout(3000);

    // Check for route change notification mentioning Route A (looks for "to Route A")
    await expect(page.locator('text=/to Route A — Gandhipuram Loop/i')).toBeVisible();
  });

  test('should persist route state after page refresh', async ({ page }) => {
    await page.goto('/student/eta');
    await page.waitForLoadState('networkidle');

    // First initialize route state
    await page.locator('button:has-text("Back to Route A")').click();

    // Change to Route B
    await page.locator('button:has-text("Change to Route B")').click();

    // Navigate to notifications first to ensure notification is generated
    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');
    
    // Click "all" filter
    const allFilterBtn = page.locator('button').filter({ hasText: /^all$/i });
    await allFilterBtn.click();
    
    // Wait for notification to appear
    await page.waitForTimeout(3000);

    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Click "all" filter again after refresh
    await page.locator('button').filter({ hasText: /^all$/i }).click();
    
    // Wait for polling
    await page.waitForTimeout(3000);

    // Route change notification should still be present (looks for "to Route B")
    await expect(page.locator('text=/to Route B — RS Puram Express/i')).toBeVisible();
  });
});
