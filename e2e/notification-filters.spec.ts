import { test, expect } from '@playwright/test';

test.describe('Notification Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');
  });

  test('should display all filter buttons', async ({ page }) => {
    const filters = [
      'unread',
      'BUS APPROACHING',
      'BUS ARRIVING',
      'BUS ARRIVED',
      'BUS DEPARTED',
      'BUS DELAYED',
      'ETA CHANGED',
      'TRAFFIC DELAY',
      'TRIP STARTED',
      'TRIP COMPLETED',
      'ROUTE CHANGED',
      'SYSTEM',
    ];

    for (const filter of filters) {
      const filterButton = page.locator(`button:has-text("${filter.replace('_', ' ')}")`);
      await expect(filterButton).toBeVisible();
    }
    
    // Check "all" filter separately with exact match to avoid strict mode
    await expect(page.locator('button').filter({ hasText: /^all$/i })).toBeVisible();
  });

  test('should filter by ROUTE_CHANGED', async ({ page }) => {
    // First generate a route change notification
    await page.goto('/student/eta');
    await page.waitForLoadState('networkidle');
    
    // Initialize route state
    await page.locator('button:has-text("Back to Route A")').click();
    await page.locator('button:has-text("Change to Route B")').click();

    // Navigate to notifications
    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');

    // Click "all" filter first to ensure notification is visible
    await page.locator('button').filter({ hasText: /^all$/i }).click();
    await page.waitForTimeout(3000);

    // Click ROUTE_CHANGED filter
    const routeChangedFilter = page.locator('button:has-text("ROUTE CHANGED")');
    await routeChangedFilter.click();

    // Verify route change notification is visible
    await expect(page.locator('span:has-text("Route Changed")')).toBeVisible();
  });

  test('should filter by unread notifications', async ({ page }) => {
    // Generate a notification
    await page.goto('/student/eta');
    await page.waitForLoadState('networkidle');
    
    // Initialize route state
    await page.locator('button:has-text("Back to Route A")').click();
    await page.locator('button:has-text("Change to Route B")').click();

    // Navigate to notifications
    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');

    // Click "all" filter first to ensure notification is visible
    await page.locator('button').filter({ hasText: /^all$/i }).click();
    await page.waitForTimeout(3000);

    // Click unread filter
    const unreadFilter = page.locator('button:has-text("unread")');
    await unreadFilter.click();

    // Verify unread notification is visible
    await expect(page.locator('span:has-text("Route Changed")')).toBeVisible();
  });

  test('should filter by all notifications', async ({ page }) => {
    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');

    // Click all filter (use exact match to avoid strict mode)
    const allFilter = page.locator('button').filter({ hasText: /^all$/i });
    await allFilter.click();

    // Verify filter is active (green background)
    await expect(allFilter).toHaveClass(/bg-\[#00C853\]/);
  });
});
