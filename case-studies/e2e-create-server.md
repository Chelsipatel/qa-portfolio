# Case Study: End-to-end testing — automating the "create a server" journey

- **Type:** End-to-end (E2E) testing (Playwright)
- **Feature / area:** the full create-server user journey (happy **and** unhappy path)
- **Tools:** Playwright, Playwright **codegen** (record-and-play)
- **Test file:** `qa-learning/e2e/createServer.spec.ts`
- **Date:** 2026-07-25

---

## 🎯 The goal

Unit and integration tests check pieces; an **end-to-end** test drives a **real browser
through a whole user journey**, the way a person would — the closest automated thing to
"a human tested it." I wanted to prove the *critical* journey (creating a server) works
from start to finish, including when it goes wrong.

## 🧠 My approach

Test the **unhappy path first** (prove the guardrail holds), *then* the happy path — pure
"find where it breaks before proving it works" thinking.

## 🔧 What I did — the journey, step by step

| Step | The user action | What the test checks |
| ---- | --------------- | -------------------- |
| 1 | Arrive at the dashboard | heading "Your Servers" is visible |
| 2 | Open the Create Server form | the dialog appears |
| 3 | **Unhappy path:** submit with no name | error "Server name is required"; nothing created |
| 4 | Type a valid name and submit | modal closes |
| 5 | Verify the outcome | new server card appears with status "Stopped" **and 0 / 20 players** |

```ts
await page.getByRole('button', { name: '+ Create Server' }).click();
await page.getByLabel('Server name').fill('My Test Server');
await expect(page.locator('[data-server="My Test Server"]').getByText('0 / 20')).toBeVisible();
```

- **Ran it:** `npm run test:e2e` → **`1 passed`**.
- **Recorded a journey with codegen:** clicked through "open → cancel" and Playwright *wrote
  the test code for me* — it even added `{ exact: true }` to tell two "Create" buttons apart.
- **Extended the real test:** added the `0 / 20` players assertion myself. Hit a precise bug
  (`'0/20'` vs `'0 / 20'` — `getByText` matches the *exact* text, spaces included), read the
  "element not found" error, and fixed it to green.

## 📸 Evidence

- The `1 passed` E2E run; the codegen-generated journey code; the green run after adding my assertion. *(To file in `evidence/`.)*

## 💡 What I found / the result

A single automated test now guarantees the whole create-server flow — *and* that the app
**stops an empty name** before it ever creates anything. It runs in seconds, the same way,
every time.

## 📝 What I learned & would do next

- **E2E is few, slow, and most realistic** — reserve it for *critical journeys*; push the fiddly cases down into fast unit tests.
- **Locators matter:** `getByRole` / `getByLabel` find things the way a *user or screen-reader* does — stabler than fragile internal hooks, *and* a quiet accessibility check.
- **`getByText` matches the exact visible text** — whitespace counts (`'0/20'` ≠ `'0 / 20'`).
- **Codegen** turns clicks into real test code — a genuine accelerator.
- Debugging tools: `--headed` to *watch* the browser, `show-report` for the trace + failure screenshot.
- **Next:** automate more journeys — cancel the modal, delete a server (with confirm), each validation failure, and the sign-out flow (regression for BUG-001).
