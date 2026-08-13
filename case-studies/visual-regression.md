# Case Study: Visual regression testing — catching a UI change a pixel at a time

- **Type:** Visual regression testing (Playwright)
- **Feature / area:** the dashboard page and the create-server modal
- **Tools:** Playwright (`toHaveScreenshot`), Git
- **Date:** 2026-07-25

---

## 🎯 The goal

Every behaviour test I'd written proves the app *works* — but none of them would notice if
a button turned invisible or the layout collapsed. The code still "passes," it just *looks*
broken. **Visual regression testing** catches exactly that: it screenshots a page and
compares it **pixel-by-pixel** against a saved "known-good" image (the **baseline** — the
*oracle* for "what should this look like?").

## 🧠 My approach

1. **Create** the baselines (freeze the correct look).
2. **Prove green** — the page matches the baseline.
3. **Break the look on purpose** and watch the robot catch it + show me the diff.
4. **Revert** and confirm green — the full regression loop.

## 🔧 What I did

```ts
await expect(page).toHaveScreenshot('dashboard.png'); // take a picture, compare to baseline
```

- **Created baselines:** `npm run test:visual -- --update-snapshots` → 2 baseline PNGs (dashboard + modal), committed to git.
- **Confirmed green:** `npm run test:visual` → `2 passed` (page matches).
- **Made it fail on purpose:** edited the demo page, re-ran → **RED**, with a pixel diff:
  ```
  Error: Screenshot comparison failed:
    909269 pixels (ratio 0.99) are different.
  ```
- **Opened the diff image** — the whole dashboard flagged **red** — and reverted cleanly with `git checkout e2e/demo-app/index.html` → back to `2 passed`.

## 📸 Evidence

- **The diff image** (whole dashboard lit red) — the eye-catcher. *(To file in `evidence/`.)*
- The green baseline run and the red failing run with the pixel count.

## 💡 What I found — two lessons the exercise taught me

1. **Tests can be coupled to content.** When I first renamed the page heading, the test failed at its *"wait for the heading"* step (the locator finds the heading *by its text*) — **not** at the screenshot. Changing content broke the locator before the visual check even ran.
2. **`:hover` styles don't show in a static screenshot** — my first colour change was on the hover state, so the picture didn't move. I changed the *resting* style instead.

And I solved the **"99% different" mystery** straight from the diff image: I'd changed the page **background**, not the button — a background floods the whole picture, so *of course* 99% of pixels changed. **The diff shows the *scope* of a change at a glance.**

## 📝 What I learned & would do next

- The **baseline is the oracle** — the frozen "correct look" everything is compared against.
- The **first** run *creates* baselines (`--update-snapshots`); every run after *compares*.
- A visual test spots **differences** — a **human** decides if a change was *intended* (then re-baselines). The robot can't judge intent.
- Baselines are **per-platform** (`-win32`) and **committed to git** — they're the answer key, and rendering differs slightly across machines.
- Bonus real skill: **`git checkout <file>`** to cleanly undo all my edits.
- **Next:** snapshot more states — each server status (Running/Stopped/Error), the modal *with a validation error showing*, and mobile vs desktop widths.
