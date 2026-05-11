# RP — Push Notifications PRE (Phase 1A.1 Final Closure)

**TC:** TC-003 — Push Notifications v2.0 Phase 1A.1 Continuation
**Type:** PRE
**Lane:** C (Edge Function, push infrastructure — highest risk)
**Created:** 2026-05-11
**Author:** Claude Code (under Delroy authority)
**Status:** DRAFT — pre-execution snapshot

---

## Purpose

Capture the exact pre-execution state of the Push Notifications subsystem before
executing the TC-003 finalization tasks (CORS narrowing, VAPID verification,
runtime smoke test, formal phase closure).

---

## Current State Summary (verified 2026-05-11)

### Database
- `push_subscriptions` table — present
- `trigger_push_notification` trigger — present, fires on `notifications` insert
- `pg_net` extension — enabled (for async HTTP calls from trigger)

### Edge Function
- File: `supabase/functions/send-push-notification/index.ts`
- Auth gate: JWT validation + `x-trigger-source: pg_trigger` header check
- Roles allowed: `anon` (via pg_trigger) and `service_role`
- VAPID env vars consumed: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`
- CORS: `Access-Control-Allow-Origin: *` — TO BE NARROWED (Task 1)
- Web Push implementation: raw RFC 8291 (aes128gcm, ECDH P-256, VAPID ES256 JWT)
- Failed subscription cleanup: 410/404 responses trigger delete from `push_subscriptions`

### Service Worker
- File: `public/sw-push.js`
- Events handled: `push`, `notificationclick`
- Behavior: shows notification with title/body, focuses existing window or opens new

### Client
- Hook: `src/hooks/usePushSubscription.ts` — present
- UI: `PushNotificationToggle.tsx` in Settings — present, toggle-hang fix applied
- Recent commits in flight (unsealed):
  - `4e685aa` — Fix push toggle hang
  - `9235b3b` — Add push toggle flow
  - `5dc8d43` — Split phase 1A.1 post-execution

### Open Risks (entering Phase 1A.1 closure)
- VAPID secrets configuration in Supabase — UNVERIFIED
- Runtime push delivery to real device — UNTESTED
- Edge Function CORS too broad (`*`) — LOW severity, to be narrowed
- Hard-coded Supabase URL in push migration — explicitly OUT OF SCOPE for TC-003

---

## What Is Being Changed (TC-003 scope)

| File | Change |
|---|---|
| `supabase/functions/send-push-notification/index.ts` | Narrow CORS header |
| `CHANGELOG.md` | Add Phase 1A.1 closure entry |
| `.claude/rules/phase-gates.md` | Update Phase 1A.1 status to CLOSED |

Plus: read-only VAPID secret verification, runtime smoke test, POST restore point.

---

## What Is NOT Being Changed

- `push_subscriptions` table schema — untouched
- `trigger_push_notification` trigger — untouched
- `public/sw-push.js` — untouched
- `src/hooks/usePushSubscription.ts` — untouched
- `PushNotificationToggle.tsx` — untouched
- All v1.x frozen modules — untouched
- Hard-coded Supabase URL in push migration — separate TC required (out of scope)
- No new Edge Functions
- No new migrations

---

## Restore Procedure (if rollback required)

1. Revert any change to `supabase/functions/send-push-notification/index.ts`
   via `git checkout HEAD -- supabase/functions/send-push-notification/index.ts`
2. Redeploy the Edge Function from the reverted source
3. Revert `CHANGELOG.md` and `.claude/rules/phase-gates.md` from git
4. No DB rollback required — TC-003 does not touch schema, triggers, or data

---

## Approval Chain

- TC author: Devmart (Cowork)
- TC approver: Delroy — required before Lane C execution begins
- Execution begins ONLY after Delroy says "Goedgekeurd" on TC-003 and on this PRE plan
