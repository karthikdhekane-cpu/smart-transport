import { test, expect } from '@playwright/test';

test.describe('Student ETA Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/student/eta');
  });

  test('should display ETA information', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check for ETA display
    const etaDisplay = page.locator('text=/Estimated Time of Arrival/i');
    await expect(etaDisplay).toBeVisible();

    // Check for AI ETA Engine heading
    const heading = page.locator('h1:has-text("AI ETA Engine")');
    await expect(heading).toBeVisible();
  });

  test('should display traffic conditions', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check for Traffic Conditions section
    const trafficSection = page.locator('text=/Traffic Conditions/i');
    await expect(trafficSection).toBeVisible();
  });

  test('should display AI Prediction Factors', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check for AI Prediction Factors section
    const aiFactors = page.locator('text=/AI Prediction Factors/i');
    await expect(aiFactors).toBeVisible();

    // Check for specific factors
    await expect(page.locator('text=/Current Traffic/i')).toBeVisible();
    await expect(page.locator('text=/Bus Speed/i')).toBeVisible();
    await expect(page.locator('text=/Distance/i')).toBeVisible();
  });

  test('should display Smart Wake-Up Alarm controls', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check for Smart Wake-Up Alarm section
    const alarmSection = page.locator('text=/Smart Wake-Up Alarm/i');
    await expect(alarmSection).toBeVisible();

    // Check for alarm buttons (use first() to avoid strict mode)
    const fiveMinBtn = page.locator('button:has-text("5 min before")').first();
    const tenMinBtn = page.locator('button:has-text("10 min before")').first();
    const fifteenMinBtn = page.locator('button:has-text("15 min before")').first();

    await expect(fiveMinBtn).toBeVisible();
    await expect(tenMinBtn).toBeVisible();
    await expect(fifteenMinBtn).toBeVisible();
  });

  test('should set alarm and display confirmation', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Click 5 min before button (use first() to avoid strict mode)
    const fiveMinBtn = page.locator('button:has-text("5 min before")').first();
    await fiveMinBtn.click();

    // Check for alarm confirmation
    const alarmConfirmation = page.locator('text=/Alarm Set!/i');
    await expect(alarmConfirmation).toBeVisible();

    // Check for confirmation message
    await expect(page.locator('text=/You\'ll be notified 5 minutes before/i')).toBeVisible();
  });

  test('should display Route Change Test controls', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check for Route Change Test section
    const routeChangeSection = page.locator('text=/Route Change Test/i');
    await expect(routeChangeSection).toBeVisible();

    // Check for route change buttons
    await expect(page.locator('button:has-text("Change to Route B")')).toBeVisible();
    await expect(page.locator('button:has-text("Change to Route C")')).toBeVisible();
    await expect(page.locator('button:has-text("Change to Route D")')).toBeVisible();
    await expect(page.locator('button:has-text("Back to Route A")')).toBeVisible();
  });

  test('should display Historical ETA Accuracy', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check for Historical ETA Accuracy section
    const historicalSection = page.locator('text=/Historical ETA Accuracy/i');
    await expect(historicalSection).toBeVisible();
  });
});
