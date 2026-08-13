# Case Study: Unit-testing `validateServerName` — and catching two tests that lied

- **Type:** Unit testing (+ test debugging)
- **Feature / area:** Server-name validation (the `validateServerName` rule behind **BUG-002**)
- **Tools:** Vitest (watch mode), TypeScript, Windows PowerShell
- **Date:** 2026-07-21

---

## 🎯 The goal

The platform lets a user name their Minecraft server. In an earlier exploratory
session I found **BUG-002**: a too-long name wasn't rejected cleanly — the user
got a raw technical error instead. The function `validateServerName(name)` is the
guard that's *supposed* to enforce the rule (**1–64 characters, not blank**). My
goal was to write unit tests that pin down its behaviour at every edge, so this
class of bug can never quietly come back — a **regression suite** for my own bug.

## 🧠 My approach

Before writing any code, I used the tester's core reflex: **enumerate the cases
first, then predict the answer for each.** For a "string with a length rule," the
edges that matter are:

| # | Input | My prediction |
|---|-------|---------------|
| 1 | `"a"` (1 character — the minimum) | valid |
| 2 | `"a"` × 64 (the maximum) | valid |
| 3 | `"a"` × 65 (one past the max) | **invalid** ← BUG-002 |
| 4 | `"   "` (spaces only) | **invalid** |
| 5 | `"  My Server  "` (real name, padded with spaces) | valid |
| 6 | `"<script>alert(1)</script>"` | valid |

I predicted all six correctly — including #6, which taught me the key insight
below.

## 🔧 What I did

I wrote a test for each case in `qa-learning/unit/validators.test.ts`, following
the **Arrange–Act–Assert** pattern:

```ts
it('rejects a name longer than 64 characters', () => {
  const result = validateServerName('a'.repeat(65)); // BUG-002 regression
  expect(result.valid).toBe(false);
});
```

I ran them in **watch mode** (`npm run test:unit:watch`) so every save re-ran the
suite instantly.

## 💡 The senior lesson: a green test can lie 🕵️‍♀️

All six tests passed on the first run — but I didn't trust the green. On review I
found **two of them were passing for the wrong reason:**

- My "65 characters" test was actually passing the input `'a'` (1 character), and
  asserting `true`. Green — but it never tested a 65-character name at all.
- My "spaces only" test was passing `'Has only spaces'` — a normal name *made of
  letters* — not actual spaces. Green — but it never tested a blank name.

The test **name promised one thing; the input did another.** So I fixed the
inputs to match, which correctly turned both tests **red**, then read the failure
message — `expected true to be false` — decided the *code* was right and my
*expectation* was wrong, and corrected the expected values. Now they're green
**and honest**: they genuinely exercise the 65-char and blank-name rules.

## 💡 A second insight: "valid" ≠ "safe" 🔓

Case #6 surprised people, but I predicted it: `validateServerName('<script>...')`
returns **valid** — because this function only checks **length**, not safety. A
`<script>` tag is 25 characters and not blank, so by *this* rule it's a valid
name. Keeping input *safe* (escaping/stripping `<script>`) is a **different job at
a different layer.** A length check passing tells you nothing about whether the
input is dangerous — a distinction I'll prove directly against the API in a later
drill (the frontend-vs-backend validation gap).

## 📸 Evidence

- Test file: [`tests/unit/validators.test.ts`](../tests/unit/validators.test.ts)
- Final run: **6 files, 55 tests passing** (validators suite: 28 tests) — all
  honest green.

## 📝 What I learned & would do next

- **Enumerate before writing.** Listing and predicting the cases first made the
  tests fast to write and caught my own mistakes.
- **Distrust green.** A passing test is not proof — it can test nothing, or the
  wrong thing. I now check that the *name*, the *input*, and the *expected value*
  all agree.
- **Read the failure message, then decide code-vs-test.** `expected X to be Y`
  tells you exactly what mismatched; the skill is deciding whether the code or the
  test is at fault. Both times here, the code was right.
- **Next:** extend this to the API layer with Supertest — send the same bad names
  (`""`, 65 chars, `<script>`) *directly* to the create-server endpoint and prove
  the backend rejects them too, not just the form.
