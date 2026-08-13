# Case Study: API testing with Postman — proving a validation gap on a live API

- **Type:** API testing (Postman + Newman) · the frontend-vs-backend validation gap
- **Feature / area:** the create-server API and its `Authorization`-protected endpoints
- **Tools:** Postman, Newman (CLI), a live Node/Express server, `jsonplaceholder` & `httpbin` (practice)
- **Date:** 2026-07-30 → 07-31

---

## 🎯 The goal

The **#1 real-world API-testing skill:** don't just click the UI — hit the **running API
directly** and check it enforces its own rules. A form can block bad input, but an
attacker (or a bug) skips the form and calls the API. So I set out to learn Postman
end-to-end and then re-run my **BUG-002** hunt against a *live* server.

## 🧠 My approach

1. Learn the anatomy of a request hands-on (methods, URL, query params, headers, body,
   auth) against safe practice APIs.
2. Turn Postman into a *testing* tool — write assertions, organise a Collection, automate
   it with the Collection Runner and **Newman** (the CI way).
3. Point it all at a **live API** — authenticate with a Bearer token, then attack the
   create-server endpoint with the exact input the UI blocks.

## 🔧 What I did

**Requests (practice APIs):** every CRUD verb — `GET` (one + a list), `POST` (create,
`201`), `DELETE` — plus **query params** (`?userId=1`), **headers**, and an
`Authorization: Bearer <token>` header (verified it reached the server via httpbin's echo).

**Made it a test tool:** wrote `pm.test(...)` assertions in the Post-response script — a
4-check suite (status, response time, body shape, exact header value) → **4/4**. Saved it
as a **Collection**, ran it with the **Collection Runner** (16 assertions), then headless
with **Newman**:

```
requests     4 executed   0 failed
assertions  16 executed   0 failed      ← run from the command line, the way CI does it
```

**The live-API hunt:** against a running server (`http://localhost:4000`):
- `GET /health` → `200` (public); `GET /servers` with no token → **`401 Unauthorized`**;
  with **`Bearer`** token → `200`. (Learned auth is **per-request** in Postman.)
- Then the attack on `POST /servers`:

| Body I sent | API responded | Correct? |
| ----------- | ------------- | -------- |
| `{"name":"My Cool Server"}` | `201 Created` | ✅ |
| `{"name":""}` (empty) | `400` "name is required" | ✅ rejected |
| **`{"name":"aaa…"}` (65 chars)** | **`201 Created`** | ❌ **accepted — the gap!** |

I documented it with a **failing regression test** on the 65-char request:
```js
pm.test("REGRESSION: API must reject a name over 64 chars (BUG-002)", function () {
    pm.response.to.have.status(400);
});
// → Test Results 0/1 FAILED (got 201) — the red result IS the evidence.
```

## 📸 Evidence

- Postman requests (GET/POST/DELETE), the `4/4` assertions, the **Collection Runner** report, and the **Newman** terminal run (`16 assertions, 0 failed`).
- The live-API auth flow (`401` → `200`) and the **validation gap**: a 65-char name returning `201`, with the failing regression test (`0/1`).
- *(Screenshots to collect + rename `Date_Type_Feature.png` for the portfolio — see the build tracker.)*

## 💡 What I found — stated precisely

The API **rejects an empty name (`400`) but accepts a 65-character name (`201`)** — so it
checks a name is *present* but never checks its *length*. That's a validation gap: input
the form would block sails straight through the API.

**Honest scope:** this was a *live practice API* built to mirror the gap (the real platform
guards length at its Kubernetes layer). The **technique is the transferable skill** — on
*any* real API, a `201` there is a genuine bug I'd file immediately.

## 📝 What I learned & would do next

- **Never trust client-side validation** — test the API directly with the input the UI blocks.
- **Auth is per-request** in Postman (or set once on the Collection to inherit).
- **An assertion is only meaningful for its intended input** — "reject over-64" belongs only on the over-64 request; a valid name returning `201` is *correct*, not a bug.
- **A failing test documents a defect** — the red `0/1` is the evidence.
- **Newman = CI for APIs** — the same collection runs headless on a server, closing the loop from Guide 06.
- **Next:** grow the collection toward 30+ assertions across more endpoints; run it in CI.
