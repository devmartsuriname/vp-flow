# DEVMART TASK CONTRACT

## Task Identification

- **Task Name:** Email Notifications — TC-006 Amendment A (CORS + Auth Split)
- **Project:** VP-Flow
- **Phase:** v2.0 Phase 1A.2 — Email Notifications (amendment)
- **Phase Validator:** Delroy
- **Date:** 2026-05-12
- **Control Chain Mode:** [x] Mode A — Claude.ai-Mediated
- Mode B reason: N/A

---

## Objective

Fix two design issues in `send-email-notification` that prevent the Test Verbinding button from working in the browser:

**P1 — CORS:** The Edge Function returns no CORS headers. Browser calls via `supabase.functions.invoke()` trigger an OPTIONS preflight which fails, blocking the request before the function is reached.

**P2 — Auth split:** Test mode (`test: true`) currently requires a `service_role` JWT, but the browser sends the user's authenticated JWT. These cannot coexist safely — service_role must never reach the browser. Fix: split auth by call mode. Test mode accepts authenticated JWT + VP role check via adminClient. Trigger mode (pg_net → pg_trigger) retains service_role + `x-trigger-source` gate, unchanged.

---

## Execution Mode

[ ] SAFE MODE — bug fixes, narrow corrections, code review
[ ] EXTENDED MODE — controlled feature work, bounded module expansion
[x] FULL BUILD MODE — full implementation within approved PRD

---

## Risk Classification

[ ] LOW — single module, no data/auth impact
[ ] MEDIUM — multi-file within module, potential side effects
[x] HIGH — DB / auth / security / API contract / architecture / cross-module

**HIGH approval confirmation:** Delroy — goedgekeurd 2026-05-12 via Cowork sessie

---

## Scope Definition

### In Scope

**P1 — CORS (1 change in Edge Function)**
- Add CORS response headers to `send-email-notification/index.ts`:
  - `Access-Control-Allow-Origin: *`
  - `Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type, x-trigger-source`
- Handle OPTIONS preflight: if `req.method === 'OPTIONS'` → return 200 with CORS headers immediately
- No other change to request handling

**P2 — Auth split (1 change in Edge Function)**
- Replace single auth check with two-path logic:
  1. **Test path** (`body.test === true`): accept authenticated JWT. Verify caller is VP using `adminClient.rpc('has_role', { uid, role: 'vp' })` or equivalent. If not VP → return 403. No `x-trigger-source` required.
  2. **Trigger path** (normal mode): retain existing check — require `callerRole === 'service_role'` + `x-trigger-source: pg_trigger` header. Unchanged.
- These two checks are mutually exclusive: test mode or trigger mode, never both.

### Out of Scope

- Any change to the DB trigger (`on_notification_send_email`)
- Any change to `send-push-notification`
- Any change to `email_settings` table or RLS
- Any change to `EmailSettingsCard.tsx` or `useEmailSettings.ts`
- Any new database migrations
- Retry logic, unsubscribe links, or email templates
- Changing CORS origin from `*` to a specific domain (deferred)

---

## File Boundary

### Allowed — Modified Files

- `supabase/functions/send-email-notification/index.ts` — one file only

### Forbidden

- All other Edge Functions
- All migration files
- All frontend files
- `.claude/`, `Project Docs/`, `Project Restore Points/`, `Task Contracts/`

---

## Pre-Execution Requirements (Lane C)

1. **PRE restore point** must be created: `RP_EmailNotifications_PRE_TC006A.md` in `/Project Restore Points/v2.0/`
2. **Read the current Edge Function** before touching anything — confirm current auth logic exactly
3. **Delroy re-confirmation required** before modifying the Edge Function — Lane C gate

---

## Expected Output

- `send-email-notification` Edge Function deployed (exit 0)
- OPTIONS preflight returns 200 + CORS headers
- Test Verbinding via Settings UI returns success toast when SMTP is configured
- Trigger path (pg_net → Edge Function) unchanged and still functional
- No SMTP credentials logged server-side

---

## Verification Requirement

Claude Code must confirm after execution:

1. Edge Function deployed: `supabase functions deploy send-email-notification` — exit 0
2. Show the before/after diff — CORS block + auth split only
3. Confirm no other files were modified
4. Smoke test instruction: Delroy clicks Test Verbinding in Settings → expects success toast and email delivery to `from_address`

---

## Constraints

- CORS origin: `*` for now — specific domain deferred (consistent with §14 known issue for push)
- Auth in test mode: verify VP role via adminClient only — never trust JWT claims directly
- service_role JWT must never be sent to browser — trigger path is server-to-server only
- No `console.log` of SMTP password or JWT
- Deno deploy: use `supabase functions deploy`, not manual upload

---

## Stop Condition

Stop after: Edge Function deployed, diff shown, report delivered to Delroy. Do not start smoke test — Delroy executes that manually.

---

## Override Log

- Violation detected: TC-006 constraint "no CORS headers" — overridden by this amendment (browser invocation requires CORS)
- Instruction in conflict: TC-006 §Constraints: "no CORS headers (server-side only)" — amended here: test mode IS browser-initiated
- Execution status: NOT STARTED
- Delroy response: [x] Override authorized via TC-006-A

---

## Validation Checklist

- [x] Objective is single and unambiguous
- [x] Execution mode selected: FULL BUILD MODE
- [x] Risk classified: HIGH
- [x] File boundaries explicit — one file only
- [x] Stop condition defined
- [x] No field blank
- [x] PRE restore point required before execution
- [x] Lane C re-confirmation by Delroy required before Edge Function is touched
- [x] TC-006 constraint override documented in Override Log

---

**STATUS: DRAFT — Awaiting Delroy approval ("Goedgekeurd") before Claude Code may begin.**
