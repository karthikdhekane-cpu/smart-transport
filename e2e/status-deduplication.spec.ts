import { test, expect } from '@playwright/test';

test.describe('Status Deduplication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/parent');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('should not create duplicate pickup notification for same transition', async ({ page }) => {
    // First set status to waiting (so pickup will generate notification)
    await page.locator('button:has-text("Waiting")').click();
    
    // Click "Picked Up" button twice
    const pickedUpBtn = page.locator('button:has-text("Picked Up")');
    await pickedUpBtn.click();
    await page.waitForTimeout(500);
    await pickedUpBtn.click();

    // Navigate to student notifications (shared service)
    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');

    // Click "all" filter
    const allFilterBtn = page.locator('button').filter({ hasText: /^all$/i });
    await allFilterBtn.click();
    await page.waitForTimeout(3000);

    // Count pickup notifications - should be only 1
    const pickupNotifications = await page.locator('text=/Student Picked Up/i').count();
    expect(pickupNotifications).toBe(1);
  });

  test('should not create duplicate drop-off notification for same transition', async ({ page }) => {
    // Set to Picked Up first
    await page.locator('button:has-text("Waiting")').click();
    await page.locator('button:has-text("Picked Up")').click();

    // Click "Dropped Off" button twice
    const droppedOffBtn = page.locator('button:has-text("Dropped Off")');
    await droppedOffBtn.click();
    await page.waitForTimeout(500);
    await droppedOffBtn.click();

    // Navigate to student notifications (shared service)
    await page.goto('/student/notifications');
    await page.waitForLoadState('networkidle');

    // Click "all" filter
    const allFilterBtn = page.locator('button').filter({ hasText: /^all$/i });
    await allFilterBtn.click();
    await page.waitForTimeout(3000);

    // Count drop-off notifications - should be only 1
    const dropoffNotifications = await page.locator('text=/Student Dropped Off/i').count();
    expect(dropoffNotifications).toBe(1);
  });
});
