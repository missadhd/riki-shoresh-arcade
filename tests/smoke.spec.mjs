import { test, expect } from '@playwright/test';

test('arcade loads without uncaught page errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto('/');
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('body')).not.toBeEmpty();
  expect(errors, errors.join('\n')).toEqual([]);
});

test('saved progress is not cleared on reload', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('rikiRootProgressV1', JSON.stringify({ testSentinel: true })));
  await page.reload();
  const saved = await page.evaluate(() => localStorage.getItem('rikiRootProgressV1'));
  expect(saved).toBe(JSON.stringify({ testSentinel: true }));
});
