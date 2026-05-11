# Restore Point: v2.0 Phase 1A.1 — POST (PARTIAL COMPLETE)

**Created:** 2026-05-11
**Phase:** v2.0 Phase 1A.1 — Push Notifications Continuation (TC-003)
**Status:** PARTIAL COMPLETE — blocked on auth issue, Phase 1A.1 NOT sealed
**TC:** TC-003-PushNotifications-Phase1A1-Continuation
**Lane:** C

---

## TC-003 Task Outcomes

| Task | Status | Notes |
|---|---|---|
| Task 1 — Narrow Edge Function CORS | ✅ COMPLETE | CORS hardened in send-push-notification/index.ts |
| Task 2 — VAPID Secrets Verification | ✅ COMPLETE | All three VAPID secrets confirmed present in Supabase Edge Function secrets |
| Task 3 — Runtime Smoke Test | ❌ BLOCKED | Push delivery fails with 401 — root cause identified |
| Task 4 — Formal Phase Closure | ⏸ DEFERRED | Cannot seal Phase 1A.1 until Task 3 passes — requires TC-005 |

---

## Task 3 Smoke Test — Findings

### Test executed
- VitePWA `devOptions: { enabled: true, type: 'module' }` added in TC-004 — service worker registers in dev
- Push subscription created successfully via Settings toggle (Status: Active, toggle ON)
- Appointment "bazo verzekering" approved at 18:20 (later test rerun at 21:20:39)
- In-app notification rows created correctly in `public.notifications` (confirmed two rows at 21:20:39.567926)

### Push delivery result
**FAILED** — no push notification received on device.

### Root cause (confirmed via DB diagnostics)

1. **Trigger fires correctly** — `on_notification_send_push` AFTER INSERT trigger on `public.notifications` is present and enabled (verified via `pg_trigger`)
2. **`trigger_push_notification()` function body intact** — matches migration `20260325104819_045b0e84-738b-4139-8b5c-7abf8ee1951d.sql`
3. **`pg_net` delivers HTTP POST** — request queue empty after run; responses recorded in `net._http_response`
4. **Edge Function rejects call with HTTP 401** — `net._http_response` shows two rows with `status_code: 401`, `content: {"error":"Invalid token"}` at `21:20:39.620737` (53ms after notification INSERT)

### Why the call fails

Two compounding causes confirmed via browser dashboard check:

- **Cause A — Edge Function `Verify JWT with legacy secret` is ENABLED** on `send-push-notification`. Function rejects all calls at Supabase Auth Gateway level before invocation logs are written (which is why dashboard function logs show only boot logs, no invocation).
- **Cause B — Trigger uses hardcoded legacy anon JWT** in [supabase/migrations/20260325104819_045b0e84-738b-4139-8b5c-7abf8ee1951d.sql:17](../../supabase/migrations/20260325104819_045b0e84-738b-4139-8b5c-7abf8ee1951d.sql). Project has migrated to the new `sb_publishable_*` API key format, so the legacy JWT is no longer a valid token for this project's Auth Gateway.

The 401 is consistent with either cause. Fix must address both (disable `Verify JWT` and/or update the token used by the trigger).

---

## What Works (Verified)

- ✅ `push_subscriptions` table + owner-only RLS
- ✅ VitePWA service worker registration in dev (TC-004)
- ✅ Push subscription creation/storage via Settings toggle
- ✅ `pg_net` async HTTP POST from `trigger_push_notification`
- ✅ AFTER INSERT trigger on `public.notifications` fires reliably
- ✅ VAPID secrets present in Supabase Edge Function environment
- ✅ Edge Function CORS narrowed (TC-003 Task 1)
- ✅ In-app notifications (notifications table writes) — fully functional

## What Does Not Work

- ❌ Push delivery end-to-end — blocked by 401 at Edge Function Auth Gateway
- ❌ Phase 1A.1 formal closure — cannot seal until smoke test passes

## What Was Not Touched

- v1.x audit triggers — untouched
- RLS policies for v1.x tables — untouched
- Existing migrations — no edits (additive only principle preserved)
- Email notifications (Phase 1A.2) — not started

---

## Risks Remaining

| Risk | Severity | Mitigation |
|---|---|---|
| Push delivery non-functional in production | HIGH | Fix tracked in TC-005 DRAFT |
| Hardcoded JWT in migration becomes stale on rotation | MEDIUM | Resolved by TC-005 (move to Supabase config / use new key format) |
| Edge Function `Verify JWT` setting drift between environments | MEDIUM | Document target state in TC-005 |

---

## Next Step

TC-005 (Lane C) DRAFT created: fix `Verify JWT` setting on `send-push-notification` Edge Function + update trigger function to use current API key format. Requires Delroy approval before execution.

Phase 1A.1 remains **UNSEALED** until TC-005 completes and Task 3 smoke test passes.

---

## Files Created This Session (TC-003 + TC-004)

- `Task Contracts/TC-004-VitePWA-DevOptions.md`
- `Project Restore Points/v2.0/RP_PushNotifications_POST_Phase1A1_PARTIAL.md` (this file)
- `Task Contracts/TC-005-PushNotifications-AuthFix.md` (DRAFT)

## Files Modified This Session

- `vite.config.ts` — added VitePWA `devOptions` (TC-004)
- `supabase/functions/send-push-notification/index.ts` — CORS narrowed (TC-003 Task 1)
