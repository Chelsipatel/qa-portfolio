/**
 * End-to-end (E2E) test: can a real user complete a whole journey?
 *
 * E2E tests drive a real browser the way a person would: click buttons, type in
 * fields, read what appears. They are the closest thing to "a human tested it",
 * just automated and repeatable.
 *
 * The journey here: open the dashboard -> open the Create Server form ->
 * (first, prove the validation stops an empty name) -> fill it in -> submit ->
 * see the new server appear.
 *
 * TIP: you can generate clicks like these automatically by RECORDING yourself:
 *   npm run test:e2e:record -- http://localhost:4321
 * (start the demo first, or just watch guide 05 for the full walkthrough.)
 */

import { test, expect } from '@playwright/test';

test('a user can create a new server', async ({ page }) => {
  // 1. Arrive at the dashboard.
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Your Servers' })).toBeVisible();

  // 2. Open the Create Server form.
  await page.getByRole('button', { name: '+ Create Server' }).click();
  const modal = page.getByRole('dialog', { name: 'Create Server' });
  await expect(modal).toBeVisible();

  // 3. UNHAPPY PATH FIRST: try to submit with no name and expect to be stopped.
  //    A good tester always checks that the guardrails actually work.
  await modal.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText('Server name is required')).toBeVisible();

  // 4. HAPPY PATH: type a name and submit.
  await page.getByLabel('Server name').fill('My Test Server');
  await modal.getByRole('button', { name: 'Create' }).click();

  // 5. Prove the outcome: the modal closes and the new server card appears.
  await expect(modal).toBeHidden();
  await expect(page.locator('[data-server="My Test Server"]')).toBeVisible();
  await expect(
    page.locator('[data-server="My Test Server"]').getByText('Stopped')
  ).toBeVisible();
  await expect(
    page.locator('[data-server="My Test Server"]').getByText('stopped')
  ).toBeVisible();
   await expect(
    page.locator('[data-server="My Test Server"]').getByText('0 / 20')
  ).toBeVisible();
});

