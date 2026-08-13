import { test, expect } from '@playwright/test';

test.describe('Student Pickup/Drop Status', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/parent');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('should change status to Picked Up and generate notification', async ({ page }) => {
    // First set status to waiting (so pickup will generate notification)
    await page.locator('button:has-text("Waiting")').click();
    
    // Then click "Picked Up" button
    const pickedUpBtn = page.locator('button:has-text("Picked Up")');
    await pickedUpBtn.click();

    // Check status display changed (use div to avoid button)
    await expect(page.locator('div:has-text("Picked Up")').first()).toBeVisible();

    // Navigate to student notifications (shared notification service)
    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');

    // Click "all" filter button (use exact match to avoid "Mark all read")
    const allFilterBtn = page.locator('button').filter({ hasText: /^all$/i });
    await allFilterBtn.click();

    // Wait for notification to appear (polling takes 2 seconds)
    await page.waitForTimeout(3000);

    // Check for pickup notification
    await expect(page.locator('text=/Student Picked Up/i')).toBeVisible();
    await expect(page.locator('text=/has been picked up by the bus/i')).toBeVisible();
  });

  test('should change status to On Bus', async ({ page }) => {
    // First set to Picked Up
    await page.locator('button:has-text("Picked Up")').click();

    // Then change to On Bus
    const onBusBtn = page.locator('button:has-text("On Bus")');
    await onBusBtn.click();

    // Check status display changed (use div to avoid button)
    await expect(page.locator('div:has-text("On Bus")').first()).toBeVisible();
  });

  test('should change status to Dropped Off and generate notification', async ({ page }) => {
    // Set to Picked Up first
    await page.locator('button:has-text("Picked Up")').click();

    // Then change to Dropped Off
    const droppedOffBtn = page.locator('button:has-text("Dropped Off")');
    await droppedOffBtn.click();

    // Check status display changed (use div to avoid button)
    await expect(page.locator('div:has-text("Dropped Off")').first()).toBeVisible();

    // Navigate to notifications
    await page.goto('/parent/notifications');
    await page.waitForLoadState('networkidle');

    // Check for drop-off notification
    await expect(page.locator('text=/Student Dropped Off/i')).toBeVisible();
  });

  test('should change status to Waiting', async ({ page }) => {
    const waitingBtn = page.locator('button:has-text("Waiting")');
    await waitingBtn.click();

    // Check status display changed
    await expect(page.locator('text=/Waiting for Pickup/i')).toBeVisible();
  });
});
