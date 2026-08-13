/**
 * Visual test: has the way the page LOOKS changed unexpectedly?
 *
 * A visual test takes a screenshot and compares it, pixel by pixel, against a
 * saved "baseline" image. The first time you run it, there is no baseline yet,
 * so Playwright saves one and the test is skipped/expected-to-update. From then
 * on, if a single pixel changes, the test fails and shows you a highlighted diff.
 *
 * FIRST RUN (creates the baseline images):
 *   npm run test:visual -- --update-snapshots
 * EVERY RUN AFTER THAT (compares against the baseline):
 *   npm run test:visual
 */

import { test, expect } from '@playwright/test';

test('the dashboard looks right', async ({ page }) => {
  await page.goto('/');
  // Wait until the heading is visible so we screenshot a fully-loaded page.
  await expect(page.getByRole('heading', { name: 'Your Servers' })).toBeVisible();

  // Compare the whole page against the saved baseline image.
  await expect(page).toHaveScreenshot('dashboard.png');
});

test('the create-server modal looks right', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '+ Create Server' }).click();

  // Screenshot just the modal, not the whole page.
  const modal = page.getByRole('dialog', { name: 'Create Server' });
  await expect(modal).toBeVisible();
  await expect(modal).toHaveScreenshot('create-modal.png');
});
