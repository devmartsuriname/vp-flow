# TC-005 — Push Notifications Auth Fix (Edge Function 401 Resolution)

**Status:** APPROVED — AMENDED v2 (Path A3, Delroy 2026-05-11)
**Lane:** C (Edge Function deploy config + DB trigger function + Edge Function code + Supabase Vault — highest risk)
**Module:** Push Notifications (v2.0 Phase 1A.1 completion)
**Created:** 2026-05-11
**Created by:** Devmart (Claude Code diagnostic during TC-003 Task 3)
**Amended v1:** 2026-05-11 — Path A2 selected; send-push-notification/index.ts added to scope
**Amended v2:** 2026-05-11 — Path A3 selected after secure-reviewer BLOCK on Path A2. Auth Gateway re-enabled. service_role via Vault replaces x-trigger-source-only gate.
**Approved by:** Delroy (2026-05-11)

---

## Context

TC-003 Task 3 (push smoke test) is BLOCKED. End-to-end flow works except the final hop:

```
Notification INSERT → trigger fires → pg_net POST → Edge Function → 401 "Invalid token"
```

Confirmed via `net._http_response`: two rows at `21:20:39.620737` with `status_code: 401`, `content: {"error":"Invalid token"}`. No Edge Function invocation logs (rejection happens at Supabase Auth Gateway).

Root cause is two compounding configuration issues:

1. **Edge Function `Verify JWT with legacy secret` is ENABLED** on `send-push-notification` (confirmed via Supabase Dashboard → Edge Functions → settings).
2. **Trigger function hardcodes a legacy anon JWT** in [supabase/migrations/20260325104819_045b0e84-738b-4139-8b5c-7abf8ee1951d.sql:17](../../supabase/migrations/20260325104819_045b0e84-738b-4139-8b5c-7abf8ee1951d.sql). Project now uses the new `sb_publishable_*` API key format, so the legacy JWT no longer authenticates against this project.

Both must be addressed. The Edge Function already implements its own internal access control (`x-trigger-source: pg_trigger` header check + service_role fallback) per RP-v2.0-Phase2-1A1-POST, so disabling Auth Gateway JWT verification is consistent with the original design.

---

## Scope

### Task 1 — Disable `Verify JWT` on Edge Function (Lane C)
- In Supabase Dashboard → Edge Functions → `send-push-notification` → Settings, disable "Verify JWT with legacy secret"
- OR redeploy the function with `--no-verify-jwt` flag via Supabase CLI
- Rationale: function already performs its own access control; the Auth Gateway adds a duplicate check that fails against the new key format

### Task 2 — Update trigger function + Edge Function (Path A3, Lane C)

**Path A3 selected after secure-reviewer BLOCK on Path A2 (Delroy, 2026-05-11).**
**Secure state maintained: index.ts A2 edit must be reverted first (not deployed — safe to undo).**

**Pre-step (Claude Code):** Revert local A2 edit on `supabase/functions/send-push-notification/index.ts` — discard uncommitted changes, restore to pre-Task-2B state.

**Pre-step (Delroy — manual, before migration apply):**
- Go to Supabase Dashboard → Settings → Vault → New Secret
- Name: `PUSH_TRIGGER_SERVICE_ROLE`
- Value: the project's service_role key (from Dashboard → Settings → API)
- Save. Do NOT commit this value anywhere.

**Part A — Update additive migration (replace the Task 2A migration):**
- Update `supabase/migrations/20260511214742_fix_push_trigger_auth.sql` (already created, not yet applied)
- `CREATE OR REPLACE FUNCTION public.trigger_push_notification()`:
  - Read service_role key from vault: `(SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'PUSH_TRIGGER_SERVICE_ROLE' LIMIT 1)`
  - Send as `Authorization: Bearer <vault_value>` in headers
  - Keep `x-trigger-source: pg_trigger` as secondary header
  - Body and all other logic unchanged
- Verify vault read works before applying (Claude Code: check vault.decrypted_secrets access from plpgsql)
- Do NOT modify existing migration `20260325104819`

**Part B — Edge Function code change:**
- Modify `supabase/functions/send-push-notification/index.ts`
- Restore JWT validation — but gate on `callerRole === 'service_role'` (NOT 'anon' as before)
- Keep `x-trigger-source: pg_trigger` as secondary check (defense in depth)
- All other function behavior (VAPID delivery, error handling) unchanged

**Part C — Re-enable Auth Gateway (Delroy — manual, after migration applied + function deployed):**
- Supabase Dashboard → Edge Functions → send-push-notification → Settings
- "Verify JWT with legacy secret" → ON
- Save changes

**Part D — Redeploy Edge Function:**
- `supabase functions deploy send-push-notification`

### Task 3 — Re-run smoke test (read + log only)
- After Tasks 1 + 2 applied, repeat: approve an appointment → observe `net._http_response`
- Pass criteria: `status_code: 200` (or 2xx) in `net._http_response`, push notification received on subscribed device, Edge Function invocation logged in dashboard
- If still failing: STOP and report — do not iterate without Delroy signal

### Task 4 — Seal Phase 1A.1
- Create `RP_PushNotifications_POST_Phase1A1_SEALED.md` documenting final state
- Update `.claude/rules/phase-gates.md` to mark Phase 1A.1 as CLOSED
- Update `CLAUDE.md` Section 14 known issues — mark push notification row RESOLVED

---

## Out of Scope

- Email notifications (Phase 1A.2) — separate TC
- Notification preferences UI (Phase 1B+)
- Rotating VAPID keys
- Changes to `push_subscriptions` table schema or RLS
- Changes to `sw-push.js` push handler
- Changes to `usePushSubscription.ts` client hook
- Changes to `PushNotificationToggle.tsx` UI
- Any v1.x trigger, table, or RLS policy

---

## Files Affected

| File / Resource | Change | Who | Risk |
|---|---|---|---|
| Supabase Vault | Add `PUSH_TRIGGER_SERVICE_ROLE` secret (service_role key) | Delroy (manual) | Lane C — secret management |
| Supabase Edge Function config | Re-enable "Verify JWT" toggle AFTER deploy | Delroy (manual) | Lane C — deploy config |
| `supabase/migrations/20260511214742_fix_push_trigger_auth.sql` | Update to read service_role from Vault; send as Authorization Bearer | Claude Code | Lane C — DB function change |
| `supabase/functions/send-push-notification/index.ts` | Restore JWT validation; gate on callerRole === 'service_role' + x-trigger-source secondary check | Claude Code | Lane C — Edge Function code + redeploy |

---

## Pre-Execution Requirements

- [ ] Delroy approval (Lane C requires explicit re-confirmation immediately before execution)
- [ ] PRE restore point: `RP_PushNotifications_PRE_TC005.md` — snapshot current trigger function body + Edge Function "Verify JWT" setting
- [ ] db-guard agent review of new migration before apply
- [ ] secure-reviewer agent review of Edge Function access control (confirm `x-trigger-source` gate is sufficient without JWT layer)

## Post-Execution Requirements

- [ ] POST restore point: `RP_PushNotifications_POST_TC005.md`
- [ ] devmart-reviewer verdict
- [ ] Smoke test PASS evidence (net._http_response 2xx + dashboard invocation log + device push received)
- [ ] No regressions: in-app notifications still working, push toggle still working, RLS unchanged

---

## Acceptance Criteria

- [ ] `Verify JWT` disabled on `send-push-notification` Edge Function
- [ ] New migration applied — trigger function no longer contains hardcoded legacy JWT
- [ ] Smoke test: appointment approval → push received on device within 10 seconds
- [ ] `net._http_response` shows 2xx (or 2xx-equivalent) for trigger calls
- [ ] Edge Function dashboard shows invocation logs with `{ sent }` or `{ failed }` payload
- [ ] No v1.x behavior changed
- [ ] Phase 1A.1 formally sealed

---

## Governance Checklist

- [ ] Scope strictly limited to auth fix — no feature additions
- [ ] No frozen v1.x behavior touched
- [ ] Additive migration only (no edits to existing migrations)
- [ ] Lane C — PRE + POST restore points required
- [ ] Delroy re-confirmation immediately before execution
- [ ] db-guard agent invoked for migration review
- [ ] secure-reviewer agent invoked for Edge Function access control review

---

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Disabling Verify JWT removes Auth Gateway layer | HIGH | Edge Function retains internal x-trigger-source: pg_trigger gate. secure-reviewer must confirm before execution. |
| Edge Function JWT removal weakens security if x-trigger-source header can be spoofed externally | MEDIUM | x-trigger-source is sent only from DB trigger via pg_net — not reachable from browser. Function redeploy required after code change. |
| Trigger function CREATE OR REPLACE could disrupt in-flight requests | LOW | pg_net is async; brief replacement window has no impact on user-facing flow |
| Edge Function redeploy introduces brief cold-start window | LOW | Supabase Edge Functions are stateless; redeploy is near-instant with no data loss |

---

## Notes

- TC-005 directly unblocks TC-003 Task 3 and TC-003 Task 4.
- Phase 1A.1 stays UNSEALED until TC-005 completes successfully.
- Phase 1A.2 (Email Notifications) remains BLOCKED per `.claude/rules/phase-gates.md`.

---

**DRAFT — awaiting Delroy goedkeuring before any execution.**
