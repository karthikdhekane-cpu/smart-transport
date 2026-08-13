import { test, expect } from '@playwright/test';

test.describe('Parent Bus Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/parent/tracking');
    await page.waitForLoadState('networkidle');
  });

  test('should display map component', async ({ page }) => {
    // Check for map container
    await expect(page.locator('text=/Live Map/i')).toBeVisible();
  });

  test('should display assigned bus information', async ({ page }) => {
    await expect(page.locator('text=/Bus Number/i')).toBeVisible();
    await expect(page.locator('text=/TN 38 AB 1234/i')).toBeVisible();
  });

  test('should display current speed', async ({ page }) => {
    await expect(page.locator('text=/Current Speed/i')).toBeVisible();
    await expect(page.locator('text=/km\/h/i')).toBeVisible();
  });

  test('should display next stop', async ({ page }) => {
    await expect(page.locator('text=/Next Stop/i')).toBeVisible();
  });

  test('should display bus status', async ({ page }) => {
    // Use specific context to avoid strict mode violation
    await expect(page.locator('text=/Bus Status/i')).toBeVisible();
  });

  test('should display route timeline', async ({ page }) => {
    await expect(page.locator('text=/Route Timeline/i')).toBeVisible();
    
    // Check for route stops (use first to avoid strict mode violation)
    await expect(page.locator('text=/Town Hall/i').first()).toBeVisible();
    await expect(page.locator('text=/Peelamedu Junction/i')).toBeVisible();
  });

  test('should display ETA information', async ({ page }) => {
    await expect(page.locator('text=/ETA Information/i')).toBeVisible();
    await expect(page.locator('text=/Estimated Arrival/i')).toBeVisible();
  });

  test('should display child stop indicator', async ({ page }) => {
    await expect(page.locator('text=/Your child\'s stop/i')).toBeVisible();
  });
});
