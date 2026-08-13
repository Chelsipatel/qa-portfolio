# Case Study: Unit-testing REAL production code (not a toy example)

- **Type:** Unit testing (against live platform source)
- **Feature / area:** `parsePlayerList` — the function the platform uses to read how many players are online
- **Tools:** Vitest
- **Test file:** `qa-learning/unit/playerList.test.ts` → imports `api-server/src/utils/nbt-parser.ts`
- **Date:** 2026-07-21

---

## 🎯 The goal — and why this one is special

Most beginner portfolios test a made-up `add(a, b)` calculator. **Mine tests the real thing.**
`parsePlayerList` is genuine production code from the platform's `nbt-parser` — the function
that reads a Minecraft server's status line (`"There are 2 of a max of 20 players online: …"`)
into a clean object. I imported it **unchanged** and tested it. If it misreads, the dashboard
shows the wrong player count to real users.

## 🧠 My approach

Run the real function through the tester's lenses: the **happy path**, **boundaries** (an
empty server), **variations** (different max values), and the **unhappy path** (does gibberish
crash it, or fall back to safe defaults?).

## 🔧 What I did

```ts
import { parsePlayerList } from '../../api-server/src/utils/nbt-parser'; // ← REAL platform code

it('reads the online count', () => {
  const result = parsePlayerList('There are 2 of a max of 20 players online: Steve, Alex');
  expect(result.online).toBe(2);
});

it('falls back to safe defaults on gibberish', () => {
  expect(parsePlayerList('the server exploded').players).toEqual([]);
});
```

Cases covered: online count, an **empty server** (0 online, empty list), **different max**
values (20 / 100), and **gibberish input** → safe defaults (`0`, `[]`) instead of a crash.

## 📸 Evidence

- Green run showing the real-code tests passing. *(To file in `evidence/`.)*

## 💡 What I found / the result

The parser behaves correctly at every edge I tried — including refusing to crash on garbage,
falling back to safe defaults. My tests now guard that behaviour against future changes.

## 📝 What I learned & would do next

- I can honestly say in an interview: **"I wrote automated unit tests for production code in a
  real, Kubernetes-based platform"** — not a toy example.
- **Testing the unhappy path** (gibberish → safe defaults) matters as much as the happy path —
  a parser that crashes on bad input is a real outage risk.
- **Next:** extend to the bigger `parsePlayerData` parser (health, food, xp, gamemode, position)
  — many fields, many edges, a goldmine of real-code test cases.
