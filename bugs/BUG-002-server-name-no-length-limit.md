# BUG-002: Server name has no length limit; long names show a raw technical error

| Field             | Value                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Bug ID**        | BUG-002                                                                                                             |
| **Title**         | Create Server: no length limit on name; over-64-byte names show a raw technical error instead of a friendly message |
| **Reported By**   | Chelsi Patel (Chelsipatel2001@gmail.com)                                                                            |
| **Date Reported** | 2026-07-04                                                                                                          |
| **Severity**      | Medium                                                                                                              |
| **Priority**      | P3                                                                                                                  |
| **Status**        | New                                                                                                                 |
| **Component**     | Server Management / Create Server form                                                                              |
| **Version**       | 1.0.0                                                                                                               |

---

## Summary

The "Create New Server" form does not limit the length of the **Server Name**
field on the screen. When a name longer than 64 bytes is submitted, the backend
(Kubernetes) rejects it, and the app displays the **raw technical error** to the
user (an HTTP 422 with internal Kubernetes/API details) instead of a clear,
friendly message. No server is created. This is inconsistent with the empty-name
case, which shows a helpful inline nudge ("Please fill out this field").

## Environment

| Aspect      | Details                                           |
| ----------- | ------------------------------------------------- |
| Browser     | Chrome (Windows)                                  |
| OS          | Windows 11                                        |
| App Version | 1.0.0                                             |
| Environment | Local Development (frontend :5173, backend :8080) |
| Auth state  | Logged in                                         |

---

## Reproduction Steps

### Preconditions

- User is logged in and on the dashboard.

### Steps to Reproduce

1. Click **Create Server** to open the "Create New Server" form.
2. In **Server Name**, type a very long name (more than 64 characters).
3. Click **Create Server**.
4. Observe the result.

### Expected Result

The form should guide the user _before_ failing — consistent with the empty-name
case. Ideally either:

- prevent typing beyond the allowed length, **or**
- show a clear, friendly inline message such as _"Server name must be 64
  characters or less."_

No raw technical/internal error should ever be shown to the user.

### Actual Result

No server is created. A large **red technical error banner** appears on the
dashboard, showing the raw backend/Kubernetes response, including:

```
HTTP-Code: 422 ... "message":"MinecraftServer.minecraft.platform.com \"mc-557c27c65aaf\"
is invalid: spec.displayName: Too long: may not be more than 64 bytes",
"reason":"Invalid", ... "causes":[{"reason":"FieldValueTooLong",
"message":"Too long: may not be more than 64 bytes","field":"spec.displayName"}], "code":422
... "warning":"299 - \"unknown field \"spec.config.spawnNpcs\"\"" ...
```

### Reproduction Rate

- [x] Always (100%) — reproduces every time a name over 64 bytes is submitted.

---

## Evidence

### Screenshots

- Long name entered in the form: `Screenshot 2026-07-04 171356.png`
- Red error banner on the dashboard: `Screenshot 2026-07-04 171415.png`
- Close-up of the raw error text (422, "may not be more than 64 bytes"):
  `Screenshot 2026-07-04 172126.png`

---

## Additional Information

### Workaround

Use a server name of 64 characters or fewer.

### Notes / Tester's observations

- The real limit is **64 bytes** on `spec.displayName` (from the error's
  `FieldValueTooLong` reason).
- The failure is **safe** (no broken server is created), so this is a
  **usability / error-handling** issue rather than data loss.
- The raw error also leaks internal system details (Kubernetes field names such
  as `spec.displayName` and an unrelated warning about `spec.config.spawnNpcs`).
  Exposing internal structure to end users is poor practice and a minor
  information-disclosure smell — a reason this is worth fixing.
- Inconsistent with the empty-name case (BUG context), which correctly shows a
  friendly inline nudge. Validation should be consistent.

### Related

- Empty-name validation (works correctly) — the model this should follow.
- Discovered during boundary testing of the Server Name field.

---

## Resolution

_(To be filled by the developer)_

- **Root Cause:** [pending]
- **Fix Description:** [pending]
- **Fix Verified By:** [Chelsi Patel, once fixed]
- **Verification Date:** [pending]
