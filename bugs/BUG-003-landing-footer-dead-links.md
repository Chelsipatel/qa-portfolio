# BUG-003: Landing page footer legal links are dead (Privacy Policy, Terms, Blog, Contact)

| Field             | Value                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| **Bug ID**        | BUG-003                                                                                                     |
| **Title**         | Landing page footer "Privacy Policy" (and Terms of Service, Blog, Contact) links are dead — they go nowhere |
| **Reported By**   | Chelsi Patel (Chelsipatel2001@gmail.com)                                                                    |
| **Date Reported** | 2026-07-04                                                                                                  |
| **Severity**      | Medium                                                                                                      |
| **Priority**      | P3                                                                                                          |
| **Status**        | New                                                                                                         |
| **Component**     | Marketing / Landing Page Footer                                                                             |
| **Version**       | 1.0.0                                                                                                       |

---

## Summary

On the public landing (marketing) page, the footer's **Privacy Policy** link does
nothing when clicked. The same is true for **Terms of Service**, **Blog**, and
**Contact** — they are all placeholder links that go nowhere. This is
inconsistent with the dashboard footer, where the Documentation, Support, and
Privacy links work correctly. A broken Privacy Policy link on a public site is
also a possible compliance concern, since privacy policies often need to be
readily accessible.

## Environment

| Aspect      | Details                                            |
| ----------- | -------------------------------------------------- |
| Browser     | Chrome (Windows)                                   |
| OS          | Windows 11                                         |
| App Version | 1.0.0                                              |
| Environment | Local Development (frontend :5173)                 |
| Page        | Public landing / marketing page (logged out or in) |

---

## Reproduction Steps

### Preconditions

- None (public page).

### Steps to Reproduce

1. Go to the main landing page (`http://localhost:5173/`).
2. Scroll to the footer at the bottom of the page.
3. Click **Privacy Policy**.
4. Observe the result. (Repeat for **Terms of Service**, **Blog**, **Contact**.)

### Expected Result

Clicking **Privacy Policy** should open the privacy policy page (the app has a
working `/privacy` page — the dashboard footer links to it correctly). Each
footer link should navigate to its matching page.

### Actual Result

Nothing happens. The links are placeholders pointing to `#`, so they do not
navigate anywhere. Privacy Policy, Terms of Service, Blog, and Contact are all
dead.

### Reproduction Rate

- [x] Always (100%)

---

## Evidence

### Screenshots

- Footer with the affected (dead) links: `Screenshot 2026-07-04 182522.png`

**Supporting evidence — the destination pages exist and work** (so the links only
need wiring up, not new pages):

- Documentation page loads correctly: `Screenshot 2026-07-04 183014.png`
- Privacy Policy page loads with real content: `Screenshot 2026-07-04 183041.png`
- Support Center page loads correctly: `Screenshot 2026-07-04 183058.png`

### Code reference (confirmed cause)

In `MarketingFooter.tsx`, the links are placeholders:

```jsx
<Link to="#">Privacy Policy</Link>
<Link to="#">Terms of Service</Link>
// company links Blog and Contact also use href: '#'
```

`to="#"` navigates nowhere.

---

## Additional Information

### Workaround

The dashboard footer's Privacy link works and reaches the `/privacy` page; a user
could navigate there from inside the app instead of the landing page.

### Notes / Tester's observations

- **Consistency bug:** the same "Privacy" works on the dashboard footer but is
  dead on the landing footer.
- **Defect cluster:** the single observation uncovered four dead links in the same
  footer (Privacy Policy, Terms of Service, Blog, Contact).
- The app already has a working `/privacy` page, so at least Privacy Policy simply
  needs to be pointed at it.
- Severity is Medium (not cosmetic) because a broken Privacy Policy link on a
  public site can be a trust/compliance issue.

### Related

- Discovered while comparing the dashboard footer to the landing-page footer.

---

## Resolution

_(To be filled by the developer)_

- **Root Cause:** [pending]
- **Fix Description:** [pending]
- **Fix Verified By:** [Chelsi Patel, once fixed]
- **Verification Date:** [pending]
