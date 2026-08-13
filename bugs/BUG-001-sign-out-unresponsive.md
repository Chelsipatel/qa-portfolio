# BUG-001: Sign out button unresponsive in profile menu

| Field             | Value                                                 |
| ----------------- | ----------------------------------------------------- |
| **Bug ID**        | BUG-001                                               |
| **Title**         | Sign out button unresponsive in profile dropdown menu |
| **Reported By**   | Chelsi Patel (Chelsipatel2001@gmail.com)              |
| **Date Reported** | 2026-07-04                                            |
| **Severity**      | High                                                  |
| **Priority**      | P2                                                    |
| **Status**        | New                                                   |
| **Component**     | Authentication / User Menu                            |
| **Version**       | 1.0.0                                                 |

---

## Summary

When logged in, opening the profile menu (top-right avatar) correctly shows the
user's name, email, and a **Sign out** option. However, clicking **Sign out**
produces no visible response — the user is **not** logged out and remains on the
dashboard. Because the user cannot log out from the UI, on a shared or public
computer the next person could access the account, its servers, and its data.

## Environment

| Aspect      | Details                                                 |
| ----------- | ------------------------------------------------------- |
| Browser     | Chrome (Windows)                                        |
| OS          | Windows 11                                              |
| App Version | 1.0.0                                                   |
| Environment | Local Development (frontend on :5173, backend on :8080) |
| Auth state  | Logged in via Google OAuth                              |

---

## Reproduction Steps

### Preconditions

- User is logged in
- User is on the dashboard

### Steps to Reproduce

1. Click the profile **avatar** in the top-right corner to open the menu.
2. Observe the dropdown opens and correctly shows the user's name and email.
3. Click **Sign out**.
4. Observe the result.

### Expected Result

Clicking **Sign out** should log the user out (clear their session) and return
them to the public landing page.

### Actual Result

Nothing visibly happens. The menu does not complete a logout, the user remains
logged in, and the dashboard is still shown. The user has no working way to log
out from the interface.

### Reproduction Rate

- [x] Always (100%) — _confirm by repeating the steps a second time_

---

## Evidence

### Screenshots

**Before — profile menu open, "Sign out" visible** (account under test:
`terkeabt@gmail.com`):
`Screenshot 2026-07-04 165036.png`

**After clicking "Sign out" — still logged in on the dashboard** (URL bar still
shows `localhost:5173/dashboard`, avatar still present):
`Screenshot 2026-07-04 165116.png`

Together these show the before/after: the menu and Sign out option display
correctly, but after clicking Sign out the user remains authenticated on the
dashboard.

### Console Errors

```
(Optional next step to confirm the cause: press F12 -> Console tab ->
click Sign out -> copy any red errors here.)
```

---

## Additional Information

### Workaround

Close the browser entirely, or clear the site's cookies/storage, to end the
session manually.

### Notes / Tester's hypothesis

The name/email rows in the dropdown are display-only (not buttons), so their not
responding to clicks is **by design** and is _not_ part of this bug. The issue is
specifically the **Sign out** action.

Reading the code, the sign-out handler awaits a network logout call and then
redirects to the landing page. A developer should check whether that network
call hangs or an error prevents the redirect from running (the browser console
should reveal this). Capturing the console output (above) will confirm the cause.

### Related

- Discovered during exploratory testing of the dashboard / user-menu.
- Related learning: `docs/qa_plan/automation/01-thinking-like-a-tester.md` (unhappy paths, severity).

---

## Resolution

_(To be filled by the developer)_

- **Root Cause:** [pending]
- **Fix Description:** [pending]
- **Fix Verified By:** [your name, once the fix is confirmed]
- **Verification Date:** [pending]
