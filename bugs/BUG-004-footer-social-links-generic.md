# BUG-004: Footer social links point to generic platform homepages, not VelvetCraft accounts

| Field             | Value                                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Bug ID**        | BUG-004                                                                                                                            |
| **Title**         | Generic external links point to platform homepages, not VelvetCraft's accounts (footer social icons + About-page "View on GitHub") |
| **Reported By**   | Chelsi Patel (Chelsipatel2001@gmail.com)                                                                                           |
| **Date Reported** | 2026-07-04                                                                                                                         |
| **Severity**      | Low                                                                                                                                |
| **Priority**      | P4                                                                                                                                 |
| **Status**        | New                                                                                                                                |
| **Component**     | Marketing / Landing Page Footer                                                                                                    |
| **Version**       | 1.0.0                                                                                                                              |

---

## Summary

Several external links point to the **generic homepage** of a platform rather
than VelvetCraft's own account/profile/server. The links work, but they lead to
the wrong destination. This appears in **more than one place** (same root cause):

- **Footer social icons** (GitHub, Twitter/X, Discord) → generic platform
  homepages (e.g., the Discord icon opens discord.com's marketing page, not a
  VelvetCraft invite).
- **About page "View on GitHub" button** → `https://github.com` (the GitHub
  homepage), not the project's actual repository.
- **FAQ page "Join our Discord" button** → `https://discord.gg` (Discord's
  homepage), not a real server invite.

## Environment

| Aspect      | Details                                |
| ----------- | -------------------------------------- |
| Browser     | Chrome (Windows)                       |
| OS          | Windows 11                             |
| App Version | 1.0.0                                  |
| Environment | Local Development (frontend :5173)     |
| Page        | Public landing / marketing page footer |

---

## Reproduction Steps

### Preconditions

- None (public page).

### Steps to Reproduce

1. Go to the landing page (`http://localhost:5173/`) and scroll to the footer.
2. Click the **GitHub**, **Twitter**, or **Discord** social icon.
3. Observe where each link leads.
4. Separately, open the **About** page and click **"View on GitHub"**.
5. Observe it also opens the generic GitHub homepage.
6. Open the **FAQ** page, click **"Join our Discord"**, and observe it opens
   Discord's generic homepage (not a server invite).

### Expected Result

Each icon should open VelvetCraft's **own** presence:

- **GitHub** → the project's actual repository/organisation page.
- **Twitter/X** → VelvetCraft's actual profile.
- **Discord** → a real server **invite** so a visitor can _join the community_
  straight away (prompting them to log in / sign up to Discord if needed), rather
  than landing on Discord's generic marketing homepage.

### Actual Result

The icons open the generic platform homepages instead:

```jsx
{ name: 'GitHub',  href: 'https://github.com' }
{ name: 'Twitter', href: 'https://twitter.com' }
{ name: 'Discord', href: 'https://discord.gg' }
```

About page (`AboutPage.tsx`): the "View on GitHub" button also uses
`href="https://github.com"` (generic homepage, not the project repo).

### Reproduction Rate

- [x] Always (100%)

---

## Evidence

### Screenshots

- Footer social icons: `Screenshot 2026-07-04 183918.png`, `Screenshot 2026-07-04 183924.png`
- Discord generic homepage (destination): `Screenshot 2026-07-04 183940.png`
- Twitter/X generic homepage (destination): `Screenshot 2026-07-04 184004.png`
- FAQ page "Join our Discord" button and its Discord-homepage destination:
  `Screenshot 2026-07-04 184836.png`, `Screenshot 2026-07-04 184914.png`
- About page "View on GitHub" → github.com: confirmed in `AboutPage.tsx`
  (screenshot to be attached)

---

## Additional Information

### Workaround

None needed — cosmetic/finish issue only.

### Notes / Tester's observations

- Different from BUG-003: those links are **dead** (go nowhere); these **work but
  point to the wrong destination** (placeholder URLs).
- Part of the same defect cluster: the footer as a whole appears unfinished
  (dead legal links in BUG-003 + placeholder social links here).
- **Product question:** if VelvetCraft's social accounts do not exist yet, these
  may be intentional placeholders — worth confirming with the product owner
  whether to wire them up or hide them for now.
- **Extra polish observation:** the Discord icon is a generic chat-bubble icon
  (`MessageCircle`), not the actual Discord brand logo — minor cosmetic
  inconsistency worth fixing alongside the link.

### Suggestion (enhancement — not a defect)

- Discord already appears on the **Support** page as "Discord Community." Wiring
  the footer's Discord icon to the same server would show Discord in **two**
  places. Consider replacing the footer's Discord slot with a **different**
  platform (e.g., Instagram) to avoid duplication and broaden social reach.
  _(This is a product decision, not a bug.)_

### Related

- BUG-003 (dead footer links) — same footer, same "unfinished" theme.
- Support page already links to a Discord community (possible duplication).

---

## Resolution

_(To be filled by the developer)_

- **Root Cause:** [pending]
- **Fix Description:** [pending]
- **Fix Verified By:** [Chelsi Patel, once fixed]
- **Verification Date:** [pending]
