import { test, expect } from '@playwright/test';

test('student sidebar "Notifications" navigates to /student/notifications', async ({ page }) => {
  await page.goto('/student');

  const link = page.getByRole('link', { name: 'Notifications' });
  await expect(link).toHaveAttribute('href', '/student/notifications');

  await link.click();

  await expect(page).toHaveURL(/\/student\/notifications$/);
  await expect(page.getByRole('heading', { name: /Notifications/ })).toBeVisible();
  await expect(page.getByText('This page could not be found')).toHaveCount(0);
});

test('/student/notifications returns HTTP 200 and renders the notification list', async ({ page, request }) => {
  const res = await request.get('/student/notifications');
  expect(res.status()).toBe(200);

  const response = await page.goto('/student/notifications');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: /Notifications/ })).toBeVisible();
  await expect(page.getByText('Bus Arriving Soon', { exact: true })).toBeVisible();
  await expect(page.getByText('Delay Alert', { exact: true })).toBeVisible();
});
