import { test, expect } from '@playwright/test';

test.describe('Parent Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/parent');
    await page.waitForLoadState('networkidle');
  });

  test('should display child information', async ({ page }) => {
    // Check for child name (use specific context)
    await expect(page.locator('text=/Priya Sharma/i').first()).toBeVisible();
    
    // Check for roll number (use specific context to avoid strict mode)
    await expect(page.locator('text=/21CS001/i').first()).toBeVisible();
  });

  test('should display assigned bus information', async ({ page }) => {
    // Check for assigned bus (use specific context)
    await expect(page.locator('text=/BUS-01/i').first()).toBeVisible();
    
    // Check for bus status indicator (use specific context to avoid strict mode)
    await expect(page.locator('text=/BUS-01 Live/i')).toBeVisible();
  });

  test('should display assigned stop', async ({ page }) => {
    // Check for assigned stop (use specific context to avoid strict mode)
    await expect(page.locator('text=/Pickup Stop/i')).toBeVisible();
    await expect(page.locator('text=/Town Hall/i').first()).toBeVisible();
  });

  test('should display route information', async ({ page }) => {
    // Use specific context to avoid strict mode violation
    await expect(page.locator('text=/Route A — Gandhipuram/i').first()).toBeVisible();
  });

  test('should display ETA', async ({ page }) => {
    await expect(page.locator('text=/ETA/i')).toBeVisible();
    // Use specific context to avoid strict mode violation
    await expect(page.locator('div:has-text("min")').first()).toBeVisible();
  });

  test('should display bus speed', async ({ page }) => {
    await expect(page.locator('text=/Bus Speed/i')).toBeVisible();
    await expect(page.locator('text=/km\/h/i')).toBeVisible();
  });

  test('should display occupancy', async ({ page }) => {
    // Use specific context to avoid strict mode violation
    await expect(page.locator('text=/Occupancy/i').first()).toBeVisible();
  });

  test('should display safety score', async ({ page }) => {
    await expect(page.locator('text=/Safety Score/i')).toBeVisible();
    // Use specific context to avoid strict mode violation
    await expect(page.locator('text=/Safety:/i')).toBeVisible();
  });

  test('should display driver information', async ({ page }) => {
    await expect(page.locator('text=/Driver Info/i')).toBeVisible();
    await expect(page.locator('text=/Rajesh Kumar/i')).toBeVisible();
    await expect(page.locator('text=/Safety:/i')).toBeVisible();
  });

  test('should display notification count', async ({ page }) => {
    await expect(page.locator('text=/unread/i')).toBeVisible();
  });

  test('should display student status controls', async ({ page }) => {
    // Check for Student Status section
    await expect(page.locator('text=/Student Status/i')).toBeVisible();

    // Check for status buttons
    await expect(page.locator('button:has-text("Waiting")')).toBeVisible();
    await expect(page.locator('button:has-text("Picked Up")')).toBeVisible();
    await expect(page.locator('button:has-text("On Bus")')).toBeVisible();
    await expect(page.locator('button:has-text("Dropped Off")')).toBeVisible();
  });

  test('should display live bus location map', async ({ page }) => {
    await expect(page.locator('text=/Live Bus Location/i')).toBeVisible();
  });

  test('should display route progress', async ({ page }) => {
    await expect(page.locator('text=/Route Progress/i')).toBeVisible();
  });
});
