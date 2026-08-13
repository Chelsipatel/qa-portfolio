# Case Study: Code coverage — using it to find blind spots (not chase a grade)

- **Type:** Code coverage analysis + coverage-driven testing
- **Feature / area:** the `src-under-test` modules (validators, token, the mini APIs)
- **Tools:** Vitest (v8 coverage)
- **Command:** `npm run coverage`
- **Date:** 2026-07-25

---

## 🎯 The goal

After writing ~90 tests, I wanted to answer two grown-up questions every QA interview asks:
*"How much of the code did our tests actually run?"* (coverage) and — more importantly —
*"what does coverage NOT tell us?"*

## 📊 Results

| Metric | % | In my own words |
| ------ | - | --------------- |
| Statements | **96.7%** | did each line run at least once? |
| Branches | **~88%** | did I test **both** the "if true" *and* "if false" path? |
| Functions | **100%** | was every function actually called? |
| Lines | **96.7%** | (≈ statements) |

*(That's the `src-under-test` folder — the code that matters. The top-line number looked
lower only because it counts config files I'd never test.)*

## 🕵️‍♀️ Blind spots I found (coverage doing its real job)

The report's **red lines** pointed straight at gaps *in my own testing:*

| Uncovered | Why it wasn't covered | Test that fixes it |
| --------- | --------------------- | ------------------ |
| `miniServerApi.ts` list/get/delete **error handlers** | I'd only tested the *create* route's failure | broken-store tests for each route → `500` |
| `validators.ts` non-string branch | I only passed *strings* to `validateServerName` | pass a number/`null` |

**Coverage-driven testing:** I wrote three **broken-store** error tests (make the store throw
on list/get/delete) and watched `miniServerApi.ts` climb **81.8% → 97.7%** as the red lines
turned green. That's the pro loop: *coverage finds a gap → I write the exact test → gap closed.*

## 📸 Evidence

- The coverage table showing `src-under-test 96.74%`, and the file view with the red → green lines. *(To file in `evidence/`.)*

## 💡 My take on coverage (the mature view)

**High coverage ≠ good testing.** Coverage tells me what code my tests *touched* — **not**
whether it's *correct*. I could "run" a line with a weak assertion and prove nothing. So I
use coverage to **find untested corners, not to chase a grade.** In industry, **70–85%** is
healthy; I'd hold *critical* code (auth, payments, deleting data) higher and not waste effort
squeezing the last stubborn line. A red line is a **question to investigate**, not
automatically a bug — a *signpost, not a verdict*.

## 📝 What I learned & would do next

- The four coverage numbers, and why **branch** coverage is the sneaky, important one.
- Coverage's real value is **surfacing blind spots** I couldn't see by eye.
- Saying *"I aim for solid coverage on the high-risk paths rather than 100% everywhere"* is the honest, experienced answer.
- **Next:** cover the remaining validator branch, and wire `npm run coverage` into CI so it runs on every change.
