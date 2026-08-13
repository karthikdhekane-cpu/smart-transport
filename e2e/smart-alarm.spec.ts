import { test, expect } from '@playwright/test';

test.describe('Smart Wake-Up Alarm', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/student/eta');
    await page.waitForLoadState('networkidle');
  });

  test('should set 5 min before alarm', async ({ page }) => {
    const fiveMinBtn = page.locator('button:has-text("5 min before")').first();
    await fiveMinBtn.click();

    // Check for alarm confirmation
    await expect(page.locator('text=/Alarm Set!/i')).toBeVisible();
    await expect(page.locator('text=/5 minutes before/i')).toBeVisible();

    // Check button is selected (green background)
    await expect(fiveMinBtn).toHaveClass(/bg-\[#00C853\]/);
  });

  test('should set 10 min before alarm', async ({ page }) => {
    const tenMinBtn = page.locator('button:has-text("10 min before")').first();
    await tenMinBtn.click();

    // Check for alarm confirmation
    await expect(page.locator('text=/Alarm Set!/i')).toBeVisible();
    await expect(page.locator('text=/10 minutes before/i')).toBeVisible();

    // Check button is selected
    await expect(tenMinBtn).toHaveClass(/bg-\[#00C853\]/);
  });

  test('should set 15 min before alarm', async ({ page }) => {
    const fifteenMinBtn = page.locator('button:has-text("15 min before")').first();
    await fifteenMinBtn.click();

    // Check for alarm confirmation
    await expect(page.locator('text=/Alarm Set!/i')).toBeVisible();
    await expect(page.locator('text=/15 minutes before/i')).toBeVisible();

    // Check button is selected
    await expect(fifteenMinBtn).toHaveClass(/bg-\[#00C853\]/);
  });

  test('should dismiss alarm confirmation', async ({ page }) => {
    // Set alarm
    await page.locator('button:has-text("5 min before")').first().click();

    // Dismiss alarm
    const dismissBtn = page.locator('button:has-text("×")');
    await dismissBtn.click();

    // Alarm confirmation should be hidden
    await expect(page.locator('text=/Alarm Set!/i')).not.toBeVisible();
  });
});
