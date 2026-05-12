# Restore Point — PRE TC-006-A (Email Notifications CORS + Auth Split Fix)

**Date:** 2026-05-12
**TC:** TC-006-A — Email Notifications CORS + Auth Split Fix
**Lane:** C (Edge Function — highest risk)
**Phase:** v2.0 Phase 1A.2 (amendment)
**Status:** PRE-EXECUTION

---

## Current State Summary

The `send-email-notification` Edge Function was deployed under TC-006 (Phase 1A.2) on 2026-05-11. Two design issues prevent the Settings → Test Verbinding button from succeeding in the browser:

1. **No CORS headers.** Function omits `Access-Control-Allow-*` headers entirely (comment on line 6–8 states "No browser-direct calls. CORS headers omitted intentionally"). Browser `supabase.functions.invoke()` triggers an OPTIONS preflight that the function does not handle, blocking the test call before the function logic runs.

2. **Single-path auth requires `service_role`.** Lines 29–60 enforce `callerRole === 'service_role'` for ALL callers, including browser test mode. The browser sends the user's authenticated JWT (role: `authenticated`), so the function returns 403. Sending the service-role JWT to the browser is forbidden — service_role must never leave the server.

## File on Disk (frozen reference)

- **Path:** `supabase/functions/send-email-notification/index.ts`
- **Lines:** 189
- **Key blocks:**
  - L6–L8 — comment declaring CORS intentionally omitted
  - L8 — `jsonHeaders` (no CORS)
  - L20–L26 — method gate (POST only)
  - L29–L60 — auth check: Bearer required, manual JWT decode, `service_role` enforced
  - L62–L73 — body parse, `isTest` derived, `x-trigger-source: pg_trigger` enforced for non-test calls
  - L75–L107 — adminClient creation, settings load, enabled/SMTP completeness checks
  - L109–L121 — nodemailer transporter (port 465 SSL)
  - L124–L136 — test mode email path
  - L139–L181 — trigger mode email path

## What Is About to Change (TC-006-A scope)

Single file: `supabase/functions/send-email-notification/index.ts`

1. **CORS block** — add `corsHeaders` constant, merge into all responses, handle OPTIONS preflight before any other logic.
2. **Auth split** — replace single `service_role`-only check with two mutually exclusive paths:
   - Test path (`body.test === true`): authenticated JWT + adminClient VP role verification (via `has_role` RPC).
   - Trigger path (default): retain existing `service_role` + `x-trigger-source: pg_trigger` check, unchanged.

No other Edge Function. No migration. No frontend. No table or RLS change.

## What Is NOT Touched

- DB trigger `on_notification_send_email`
- `send-push-notification` Edge Function
- `email_settings` table, RLS, or contents
- Any frontend file (`EmailSettingsCard.tsx`, `useEmailSettings.ts`, etc.)
- All migration files
- `.claude/`, `Project Docs/`, `Project Restore Points/`, `Task Contracts/` (this file is a new addition, not a modification)

## Risks

- **R1 (Auth bypass)** — If the test path does not strictly verify VP role via adminClient, any authenticated user could trigger a Test email. Mitigation: VP-role check is the second gate after JWT validity; failure → 403.
- **R2 (CORS too open)** — `Access-Control-Allow-Origin: *` is broad. Accepted per TC §Constraints — consistent with existing push function known issue (§14). Narrowing deferred.
- **R3 (Regression on trigger path)** — pg_net → Edge Function relies on `service_role` + `x-trigger-source`. The split must keep that branch byte-identical in effect. Verified by leaving trigger path logic untouched apart from CORS-header merging.
- **R4 (Service-role leak)** — Service-role JWT must never reach the browser. Test path explicitly does NOT use service_role auth; only adminClient (server-side) uses the service-role key from `Deno.env`.

## Validation Gates Before Execution

- [x] TC-006-A read in full
- [x] `.claude/CLAUDE.md` and `.claude/rules/governance.md` read
- [x] Current Edge Function read — auth logic confirmed exactly (L29–L73)
- [x] PRE restore point created (this file)
- [ ] Diff presented to Delroy
- [ ] **Delroy second "Goedgekeurd" — required before any file modification** (Lane C gate)
- [ ] Deploy + diff + verification report

## Rollback Plan

If post-deploy smoke test fails:
1. `git checkout HEAD -- supabase/functions/send-email-notification/index.ts`
2. `supabase functions deploy send-email-notification`
3. Function returns to current (CORS-less, single-auth) state — trigger path still works.

---

**Status:** PRE-EXECUTION — awaiting Delroy second "Goedgekeurd" before Edge Function modification.
