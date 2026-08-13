# BUG-006: Number fields (Max Players, Advanced settings) can't be typed into — must use spinner buttons

| Field             | Value                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| **Bug ID**        | BUG-006                                                                                                       |
| **Title**         | Create Server number fields reject typed input (can't clear/edit), forcing use of the up/down spinner buttons |
| **Reported By**   | Chelsi Patel (Chelsipatel2001@gmail.com)                                                                      |
| **Date Reported** | 2026-07-04                                                                                                    |
| **Severity**      | Medium                                                                                                        |
| **Priority**      | P3                                                                                                            |
| **Status**        | New                                                                                                           |
| **Component**     | Server Management / Create Server form (NumberInput)                                                          |
| **Version**       | 1.0.0                                                                                                         |

---

## Summary

In the "Create New Server" form, numeric fields (e.g., **Max Players**, and
numeric fields under **Advanced Settings**) do not let the user type a value
normally. Trying to clear the box or edit it is rejected, so the value appears
"stuck" and the user is forced to use the tiny up/down spinner buttons to change
it. Setting a specific value (e.g., 100) this way is slow and frustrating.

## Environment

| Aspect      | Details                            |
| ----------- | ---------------------------------- |
| Browser     | Chrome (Windows)                   |
| OS          | Windows 11                         |
| App Version | 1.0.0                              |
| Environment | Local Development (frontend :5173) |

---

## Reproduction Steps

### Preconditions

- User is logged in and on the Create Server form.

### Steps to Reproduce

1. Click **Create Server** to open the form.
2. Click into the **Max Players** field (default 20).
3. Try to select-all and delete, or clear it and type a new number.
4. Observe the field will not clear / resists typing; the value snaps back.
5. Note you can only change it using the up/down spinner arrows.
6. Repeat under **Advanced Settings** for its numeric field (defaults to 0, same
   behaviour).

### Expected Result

The user should be able to click into a number field, clear it, and type a value
directly (like any normal number box). The spinner buttons should be a
convenience, not the only way to set the value.

### Actual Result

Typed/empty/partial input is ignored, so the field cannot be cleared or edited
normally. The value only changes via the spinner buttons.

### Reproduction Rate

- [x] Always (100%)

---

## Evidence

### Screenshots

- Max Players default (20): `Screenshot 2026-07-04 190130.png`
- Max Players changed via buttons (25), spinner arrows visible:
  `Screenshot 2026-07-04 190329.png`

### Code reference (confirmed cause)

`NumberInput.tsx`:

```js
const newValue = parseInt(e.target.value, 10);
if (!isNaN(newValue)) {
  // empty/invalid input (e.g. a cleared box) is NaN -> ignored
  // clamp + onChange(...)
}
```

Because `onChange` only fires for a valid number, clearing the field (empty
string -> NaN) is dropped, and the controlled input snaps back to the old value —
blocking normal typing/editing.

---

## Additional Information

### Workaround

Use the up/down spinner arrows to change the value.

### Notes / Tester's observations

- Same component/behaviour affects Max Players and the Advanced Settings numeric
  field (one root cause, multiple locations).
- **Separate minor observation (product/UX question, not this bug):** in Advanced
  Settings, a URL field has no `*` to indicate whether it is required, yet the
  server can be created without it. Worth confirming whether that field is
  intended to be optional, and marking it clearly either way.

### Related

- Create Server form validation (BUG-002).

---

## Resolution

_(To be filled by the developer)_

- **Root Cause:** [pending — likely the `!isNaN` guard dropping empty input]
- **Fix Description:** [pending]
- **Fix Verified By:** [Chelsi Patel, once fixed]
- **Verification Date:** [pending]
