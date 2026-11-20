import { expect, test } from '@playwright/test';

test.describe('S02 test fixture', () => {
  test('renders the explicitly test-only page and increments with a pointer', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));
    await page.goto('/');
    await expect(page).toHaveTitle('MADAR S02 — TEST FIXTURE ONLY');
    await expect(
      page.getByRole('heading', { name: 'MADAR S02 — TEST FIXTURE ONLY' }),
    ).toBeVisible();
    await expect(page.getByRole('status')).toHaveText('0');
    await page.getByRole('button', { name: 'Increment' }).click();
    await expect(page.getByRole('status')).toHaveText('1');
    expect(pageErrors).toEqual([]);
  });

  test('increment control is keyboard accessible', async ({ page }) => {
    await page.goto('/');
    const increment = page.getByRole('button', { name: 'Increment' });
    await increment.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toHaveText('1');
  });

  test('unknown browser path provides a safe 404 response', async ({ page }) => {
    const response = await page.goto('/missing-page');
    expect(response?.status()).toBe(404);
    await expect(page.locator('body')).toHaveText('Not found');
  });

  test('exposes test-only mock data and rejects unsupported methods safely', async ({
    request,
  }) => {
    const mock = await request.get('/__s02/mock');
    expect(mock.status()).toBe(200);
    await expect(mock.json()).resolves.toEqual({ message: 'S02 fixture', testOnly: true });

    const methodNotAllowed = await request.post('/__s02/health');
    expect(methodNotAllowed.status()).toBe(405);
    await expect(methodNotAllowed.text()).resolves.toBe('Method not allowed');
  });
});
