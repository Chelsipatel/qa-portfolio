# BUG-005: Footer "Resources" links lead to "article not found" (Server Types, API Reference)

| Field             | Value                                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| **Bug ID**        | BUG-005                                                                                                        |
| **Title**         | Landing footer "Server Types" and "API Reference" links open a non-existent docs article ("article not found") |
| **Reported By**   | Chelsi Patel (Chelsipatel2001@gmail.com)                                                                       |
| **Date Reported** | 2026-07-04                                                                                                     |
| **Severity**      | Medium                                                                                                         |
| **Priority**      | P3                                                                                                             |
| **Status**        | New                                                                                                            |
| **Component**     | Marketing / Landing Page Footer + Documentation                                                                |
| **Version**       | 1.0.0                                                                                                          |

---

## Summary

In the landing-page footer's **Resources** section, the **Server Types** link
navigates to the docs area but shows **"article not found."** The link points to
a documentation path (`/docs/guides/server-types`) that does not exist. The
sibling **API Reference** link (`/docs/api/overview`) has the same problem. Only
**Getting Started** points to a real article.

## Environment

| Aspect      | Details                                            |
| ----------- | -------------------------------------------------- |
| Browser     | Chrome (Windows)                                   |
| OS          | Windows 11                                         |
| App Version | 1.0.0                                              |
| Environment | Local Development (frontend :5173)                 |
| Page        | Public landing / marketing footer -> Documentation |

---

## Reproduction Steps

### Preconditions

- None (public page).

### Steps to Reproduce

1. Go to the landing page (`http://localhost:5173/`) and scroll to the footer.
2. Under **Resources**, click **Server Types**.
3. Observe the docs page that loads.
4. (Repeat for **API Reference**.)

### Expected Result

Each Resources link should open its matching documentation article.

### Actual Result

The page shows **"article not found."** The links point to docs paths that do not
exist:

- **Server Types** -> `/docs/guides/server-types` (no `guides` section, no
  `server-types` article)
- **API Reference** -> `/docs/api/overview` (no `api` section)

The only existing docs sections are: getting-started, server-management,
plugins-mods, backups, advanced.

### Reproduction Rate

- [x] Always (100%)

---

## Evidence

### Screenshots

- "Article Not Found" reached via footer -> API Reference, breadcrumb shows
  `Docs > Api > Overview`: `Screenshot 2026-07-04 184942.png`
- The real, working "Overview" article — but under **Server Management**, not
  API (`Docs > Server Management > Overview`): `Screenshot 2026-07-04 185147.png`

### Code reference (confirmed cause)

Footer links (`MarketingFooter.tsx`, resources):

```jsx
{ name: 'Getting Started', href: '/docs/getting-started/quickstart' } // exists
{ name: 'API Reference',  href: '/docs/api/overview' }               // no 'api' section
{ name: 'Server Types',   href: '/docs/guides/server-types' }         // no 'guides' section
```

The docs data (`docs-data.tsx`) has no `guides` or `api` sections.

---

## Additional Information

### Workaround

Reach real docs via the Documentation page, which lists the sections that
actually exist.

### Notes / Tester's observations

- **Third type of link bug** seen in this footer: this one leads to a page that
  **does not exist** (404 / "article not found") — distinct from a dead `#` link
  (BUG-003) or a wrong-external-destination link (BUG-004).
- **Defect cluster:** two of the three Resources links are broken (Server Types
  and API Reference); only Getting Started works.
- Fix is either to create the missing articles or to point the links at existing
  ones.
- **Content gap (beyond the link):** there is no API documentation section at all.
  A working "Overview" article exists, but under **Server Management**, not API.
  So "API Reference" promises content the product does not have — a product
  question (write API docs, or stop advertising them), not just a mislinked URL.
- **Phantom breadcrumb:** the docs breadcrumb is built from the URL, so it
  displays a non-existent category ("Api > Overview") even though that section
  does not exist.

### Related

- BUG-003 and BUG-004 — same footer, ongoing "unfinished footer" theme.

---

## Resolution

_(To be filled by the developer)_

- **Root Cause:** [pending]
- **Fix Description:** [pending]
- **Fix Verified By:** [Chelsi Patel, once fixed]
- **Verification Date:** [pending]
