import { test, expect } from '@playwright/test';

test.describe('Regression Tests - Existing Routes', () => {
  const routes = [
    '/',
    '/login',
    '/student',
    '/student/eta',
    '/student/tracking',
    '/student/notifications',
    '/parent',
    '/parent/tracking',
    '/parent/notifications',
    '/driver',
    '/admin',
    '/tracking',
  ];

  for (const route of routes) {
    test(`should load ${route} without errors`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check for no console errors
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      // Small delay to catch any runtime errors
      await page.waitForTimeout(1000);
      
      expect(errors.length).toBe(0);
    });
  }
});
