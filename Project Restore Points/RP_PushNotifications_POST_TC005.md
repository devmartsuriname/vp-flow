# RP — Push Notifications POST TC-005

**Type:** POST restore point
**TC:** TC-005 — Push Notifications Auth Fix (Path A3 + A3+ patch)
**Lane:** C
**Created:** 2026-05-11
**Author:** Claude Code (Mode A, Devmart Guardian Rules v2.1)
**Status:** SEALED — Phase 1A.1 closed

---

## 1. Outcome

TC-005 complete. End-to-end push delivery path verified. Phase 1A.1 (Push Notifications) is formally closed.

---

## 2. What changed

| Component | Change | Path A3 / A3+ |
|---|---|---|
| `supabase/functions/send-push-notification/index.ts` | JWT validation block restored; `auth.getClaims()` replaced with manual JWT payload decode (Auth Gateway already verifies signature); `SUPABASE_ANON_KEY` env read removed; gate requires `callerRole === 'service_role'` AND `x-trigger-source === 'pg_trigger'` (defense in depth) | A3 + A3+ patch by Cowork |
| `supabase/migrations/20260511214742_fix_push_trigger_auth.sql` | New additive migration. `CREATE OR REPLACE FUNCTION public.trigger_push_notification()` — reads service_role JWT from `vault.decrypted_secrets WHERE name = 'PUSH_TRIGGER_SERVICE_ROLE'`; `RAISE EXCEPTION` if secret missing (strict failure mode); sends `Authorization: Bearer <vault>` + `x-trigger-source: pg_trigger`. Migration `20260325104819` NOT modified. | A3 |
| Supabase Vault | `PUSH_TRIGGER_SERVICE_ROLE` secret seeded with current project service_role JWT | A3 prerequisite |
| Supabase Dashboard → Edge Functions → send-push-notification | `Verify JWT with legacy secret` re-enabled (ON) | A3 deploy step |
| Edge Function deployment | Redeployed via `supabase functions deploy send-push-notification` (A3 then A3+) | A3 / A3+ |

---

## 3. Smoke test result — PASS

- Test action: appointment approved in VP-Flow UI by Delroy
- Trigger: `trigger_push_notification` fired via `AFTER INSERT` on notifications row
- Vault read: succeeded (service_role JWT retrieved)
- `net.http_post` POST to Edge Function: succeeded
- Auth Gateway "Verify JWT": passed (signature verified against project JWT secret)
- Edge Function inner check: `callerRole === 'service_role'` AND `x-trigger-source === 'pg_trigger'` → both true → 200 OK

Evidence — `net._http_response` (top rows, 2026-05-11):

| Row | Timestamp (UTC) | status_code |
|---|---|---|
| 5 | 2026-05-11 23:01:55 | **200** |
| 6 | 2026-05-11 23:01:55 | **200** |
| (prior) | 2026-05-11 21:20:39 | 401 (pre-fix, baseline from PRE restore point) |

Edge Function invocation logs visible in Supabase Dashboard for the 23:01:55 calls. No errors.

---

## 4. Acceptance criteria — all met

- ✅ `Verify JWT` ON on `send-push-notification` (re-enabled for A3 design)
- ✅ New additive migration applied — trigger no longer contains hardcoded legacy JWT
- ✅ Smoke test: appointment approval → 200 OK on `net._http_response`
- ✅ Edge Function dashboard shows invocation logs
- ✅ No v1.x behavior changed
- ✅ Phase 1A.1 formally sealed

---

## 5. NOT touched (frozen / out of scope)

- All v1.x frozen modules (Auth, Guests, Appointments, Cases, Audit, Users, Settings, Documents, Notes, PWA, In-app Notifications)
- Audit log triggers and tables
- Archive immutability for incoming_post
- Closed case immutability and reopen validation
- RLS policies for: guests, appointments, cases, documents, notes, incoming_post, audit_logs, notifications, user_roles
- Role model (`app_role` enum, `user_roles` table)
- `push_subscriptions` table schema and RLS
- `sw-push.js` push handler
- `usePushSubscription.ts` client hook
- `PushNotificationToggle.tsx` UI
- VAPID keys (no rotation in this TC)
- Vault config beyond seeding the one new secret
- Auth Gateway global config (only the per-function `Verify JWT` toggle for `send-push-notification`)
- Migration `20260325104819` (not modified — additive principle preserved)

---

## 6. Carried forward (NOT in TC-005 scope — follow-up TC required)

From secure-reviewer Path A3 review:
- H1 — User-existence oracle via differing response shapes
- H2 — No rate limiting / no input length caps / no UUID validation on `userId`
- M1 — `link` field not allowlist-validated
- M2 — service_role cross-user reads not audit-logged
- L1 — `VAPID keys not configured` 500 reveals deployment state
- M-A3.1 — Claim-shape assertions implicit (and now A3+ uses manual decode — explicit claim-shape validation also missing)

Note (A3+ delta): Edge Function inner `auth.getClaims()` was replaced with manual base64 payload decode because `auth.getClaims()` rejects legacy HS256 tokens against the new ECC key. Signature verification is now solely the Auth Gateway's responsibility. This A3+ delta has NOT been independently re-reviewed by secure-reviewer — flagged for the follow-up hardening TC.

Pre-existing infrastructure issues (CLAUDE.md §14):
- Hard-coded Supabase URL in push trigger migration (MEDIUM) — unchanged
- Push Edge Function CORS is `*` (LOW) — unchanged
- Service-role push delivery — secrets unverified (MEDIUM) — RESOLVED for the trigger path; Vault secret now in place

---

## 7. Rollback plan

If a regression is discovered:
1. **Emergency disable:** drop the AFTER INSERT trigger binding (not the function) — push delivery stops; in-app notification INSERTs continue working.
2. **Function rollback:** apply a new additive migration that `CREATE OR REPLACE`s `trigger_push_notification()` back to the prior body. Do NOT edit migration `20260511214742` in place.
3. **Edge Function rollback:** redeploy the previous revision via `supabase functions deploy send-push-notification` after restoring the prior `index.ts` from git history.
4. **Vault secret rotation:** `UPDATE vault.secrets SET secret = '<new JWT>' WHERE name = 'PUSH_TRIGGER_SERVICE_ROLE';` — no migration needed.

---

## 8. Files in this restore-point envelope

- `Project Restore Points/v2.0/RP_PushNotifications_PRE_TC005.md` — pre-state snapshot
- `Project Restore Points/RP_PushNotifications_POST_TC005.md` — this file (post-state)
- `Task Contracts/v2.0/TC-005-PushNotifications-AuthFix.md` — approved TC
- `TC-005-A3plus-redeploy-instructie.md` — A3+ redeploy instruction (project root, Delroy-authored)
- `supabase/migrations/20260511214742_fix_push_trigger_auth.sql` — new additive migration (applied)
- `supabase/functions/send-push-notification/index.ts` — A3+ patched (deployed)

---

**SEALED — Phase 1A.1 closed. v2.0 Phase 1A.2 (Email Notifications) remains BLOCKED pending separate TC per `.claude/rules/phase-gates.md`.**
