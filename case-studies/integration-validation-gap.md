# Case Study: Proving a validation gap with an automated API test

- **Type:** Integration / backend testing (+ the frontend-vs-backend validation gap)
- **Feature / area:** The create-server API endpoint (`POST /servers`)
- **Tools:** Vitest, Supertest, TypeScript
- **Date:** 2026-07-22

---

## 🎯 The goal

The **#1 real-world testing trap:** a UI form validates an input, so everyone
assumes it's safe — but an attacker (or a bug) can skip the form and call the
**API directly.** *"The frontend blocked it"* is never a defence. My goal was to
practise this by testing an API endpoint *directly* with the exact input a form
would block — the too-long server name behind **BUG-002**.

## 🧠 My approach

1. **Read the API code first.** I opened the create-server route and looked at
   what it validated. It checked the name **exists and isn't blank** — but I
   noticed it never checks the **length** (the 64-character rule that
   `validateServerName` enforces).
2. **Enumerated the attack inputs** a form would block: empty, spaces-only, a
   65-character name, `<script>`, and a missing field.
3. **Targeted the gap:** the 65-character name — long enough to break the rule,
   but not empty, so it slips past the only check that exists.

## 🔧 What I did

Using **Supertest** (which fires real HTTP requests at an Express app inside a
test, no server needed), I sent a 65-character name straight to the endpoint and
asserted that a *correct* API **should reject it** with `400`:

```ts
it('create a server when the name is invalid', async () => {
  const app = createServerApp(makeFakeStore());
  const res = await request(app).post('/servers').send({ name: 'a'.repeat(65) });
  expect(res.status).toBe(400); // a well-behaved API SHOULD reject it
});
```

## 📸 Evidence

```
FAIL  serverApi.test.ts > create a server when the name is invalid
- Expected: 400     ← what a correct API should do
+ Received: 201      ← what this API actually did: created it anyway
```

The test **failed with `201 Created`** — proving the API accepted a name it should
have rejected. Crucially, this time the *code* is at fault, not the test: the
assertion was correct, and the failure is the evidence.

## 💡 What I found — stated precisely

The API under test (`miniServerApi.ts`) has a **validation gap**: it enforces
"name required" but **not** the length limit, so it creates servers with
over-length names. My automated test proves it.

**Honest scope (this is the important bit):** this was a **practice API** — a
training stand-in. A finding in a test fixture is *not* automatically a production
bug. The *real* platform actually **does** reject over-length names at the
Kubernetes layer — I know because my own **BUG-002** captured that rejection (a
`422 "may not be more than 64 bytes"`). So the correct claim is *"I demonstrated
the validation-gap technique with an automated test,"* not *"the platform is
broken."* The definitive check against the **live** API is a follow-up with
Postman (Part 9).

## 📝 What I learned & would do next

- **Never trust client-side validation.** Test the API directly with the input the
  UI blocks — a whole class of bugs (often security holes) hides in that gap.
- **A failing test can be the *deliverable*.** Here the red result *is* the proof
  of the gap — the mirror image of a test being wrong: this time the code is.
- **Match the claim to the evidence.** Distinguish a test-fixture finding from a
  production bug, and verify against the real system before claiming it. That
  rigour is what makes a bug report trustworthy.
- **Next:** run the same attack against the **live** API with Postman/Newman to
  confirm whether the real backend guards it gracefully (Part 9).
