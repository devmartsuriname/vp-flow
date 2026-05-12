# Restore Point — POST TC-006-A (Email Notifications CORS + Auth Split Fix)

**Date:** 2026-05-12
**TC:** TC-006-A — Email Notifications CORS + Auth Split Fix
**Lane:** C (Edge Function)
**Phase:** v2.0 Phase 1A.2 (amendment)
**Status:** POST-EXECUTION — deploy successful, awaiting Delroy smoke test

---

## What Changed

Single file: `supabase/functions/send-email-notification/index.ts`

1. **CORS** — added `corsHeaders` constant (`Origin: *`, allowed headers include `authorization, x-client-info, apikey, content-type, x-trigger-source`, methods `POST, OPTIONS`); merged into `jsonHeaders`. OPTIONS preflight now returns `200` with `corsHeaders` before any other logic runs.
2. **Auth split** — replaced single `service_role`-only check with two mutually exclusive branches keyed on `body.test`:
   - **Test path (`isTest === true`)**: requires `callerRole === 'authenticated'` + `callerSub` (UUID); calls `adminClient.rpc('has_role', { _user_id: callerSub, _role: 'vp' })`; rejects with 403 if not VP.
   - **Trigger path (default)**: retains `callerRole === 'service_role'` + `x-trigger-source: pg_trigger` header check, byte-equivalent to TC-006 behavior.
3. **adminClient construction** moved up — created once before the auth split so the test path can call `has_role`. The previous adminClient block (originally below the auth check) was absorbed into the new earlier position; no duplicate construction.

## What Was NOT Touched

- DB trigger `on_notification_send_email`
- `send-push-notification` Edge Function
- `email_settings` table, RLS, columns
- Any frontend file
- All migration files
- nodemailer transporter, SMTP settings load, test/trigger email-sending blocks below the auth split — unchanged

## Deployment

```
supabase functions deploy send-email-notification
→ Deployed Functions on project xjkkumclqqnjngnttabf: send-email-notification
→ Exit 0 (success)
```

Docker warning is informational (no local container needed for remote deploy).

## Verification Performed

- File diff confined to `supabase/functions/send-email-notification/index.ts` — confirmed via `git status` (single modified file).
- `has_role` RPC signature confirmed by Delroy: `(_user_id UUID, _role app_role) RETURNS BOOLEAN` — matches implementation.
- Trigger path branch left structurally identical to TC-006: same `service_role` check, same `x-trigger-source: pg_trigger` gate.
- Service-role JWT path is NOT exposed to browser callers — service-role usage is server-side only via `Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')` for adminClient construction.

## Smoke Test (Delroy executes manually)

1. Open Settings → Email Notifications (as VP).
2. Click **Test Verbinding**.
3. **Expected:** success toast; probe email arrives at `from_address`.
4. **Non-VP test (negative case, optional):** sign in as Secretary or Protocol → Test Verbinding should 403 (`Forbidden: VP role required`).
5. **Trigger path regression (optional):** any DB notification insert that calls the trigger → email still delivered.

## Risks Remaining

- **R1 — CORS `*`** — Low; consistent with push function. Narrowing deferred per TC §Constraints.
- **R2 — JWT role claim trust** — Low; Auth Gateway verifies signature upstream. Role decode is identical to existing pattern in `send-push-notification`.
- **R3 — Smoke test pending** — Function is deployed but not browser-tested. If smoke test fails, rollback per PRE restore point §Rollback Plan.

## Stop Condition

Deploy complete. Diff confined to single file. Awaiting Delroy smoke test result.

---

**Status:** POST-EXECUTION — TC-006-A delivered. Awaiting Delroy smoke test confirmation before phase closure.
