# Restore Point — POST — TC-006 Email Notifications (Phase 1A.2)

**Type:** POST-execution
**Task Contract:** TC-006 — Email Notifications Phase 1A.2
**Lane:** C (HIGH risk)
**Date:** 2026-05-12
**Operator:** Claude Code (Mode A — Devmart-mediated)
**Authority:** Delroy — approved 2026-05-12 via Cowork; Lane C re-confirmation given this session; Option A override accepted for lint baseline at STAP 6.

---

## Execution Summary

All eight STAPs executed within scope. Migrations A + B applied manually by Delroy via Supabase SQL Editor (CLI db push blocked by harness — non-blocking). Edge Function deployed via CLI. Smoke test (real SMTP delivery) pending Delroy manual action.

---

## Files Created

| Path | Purpose |
|---|---|
| `supabase/migrations/20260512090000_email_settings_table.sql` | email_settings table + RLS (VP-only) + updated_at trigger + single-row seed (UUID `00000000-0000-0000-0000-000000000001`) |
| `supabase/migrations/20260512090100_email_notification_trigger.sql` | `trigger_email_notification()` + `on_notification_send_email` AFTER INSERT trigger on `notifications` |
| `supabase/functions/send-email-notification/index.ts` | Edge Function — manual JWT decode, service_role gate, test mode + trigger mode, npm:nodemailer / Hostinger SMTP |
| `src/app/(admin)/settings/components/EmailSettingsCard.tsx` | VP-only Settings UI card |
| `src/app/(admin)/settings/hooks/useEmailSettings.ts` | `useGetEmailSettings`, `useUpsertEmailSettings`, `useEmailSettings` |
| `Project Restore Points/v2.0/RP_EmailNotifications_PRE_TC006.md` | PRE restore point |
| `Project Restore Points/v2.0/RP_EmailNotifications_POST_TC006.md` | This document |

## Files Modified

| Path | Change |
|---|---|
| `src/app/(admin)/settings/components/index.ts` | Added `EmailSettingsCard` export |
| `src/app/(admin)/settings/hooks/index.ts` | Added `useEmailSettings`, `useGetEmailSettings`, `useUpsertEmailSettings` exports |
| `src/app/(admin)/settings/page.tsx` | Imported `EmailSettingsCard`; added `Col lg=12` render gated by `role === 'vp'` (explicit guard, not just hidden) |
| `~/.claude/logs/current-session.env` | Set `DEVMART_TC_ID=TC-006`, `DEVMART_LANE=C` |

## Files NOT Touched (per TC §Forbidden)

- All existing migration files
- `supabase/functions/send-push-notification/index.ts`
- `trigger_push_notification` function or `on_notification_send_push` trigger
- All frozen v1.x modules
- `src/integrations/supabase/types.ts` (no hand-edit; Supabase CLI regenerate deferred to Delroy)
- RLS policies on existing tables

---

## Database State After Execution

- **Table:** `public.email_settings` — exists, RLS enabled
- **Policies:** "VP can view email settings" (SELECT, VP-only), "VP can update email settings" (UPDATE, VP-only). No INSERT/DELETE policies (single-row pattern).
- **Seed row:** UUID `00000000-0000-0000-0000-000000000001`, `enabled = false`, empty SMTP fields.
- **Trigger function:** `public.trigger_email_notification()` — reads `PUSH_TRIGGER_SERVICE_ROLE` from vault, posts to hard-coded Edge Function URL.
- **Trigger:** `on_notification_send_email` AFTER INSERT FOR EACH ROW on `public.notifications`.

## Edge Function State

- **Name:** `send-email-notification`
- **Deployed:** 2026-05-12 via `supabase functions deploy send-email-notification --project-ref xjkkumclqqnjngnttabf` (exit 0)
- **Auth Gateway "Verify JWT":** assumed ENABLED (default; same as send-push-notification per TC-005 A3+ pattern)
- **Runtime status:** not yet exercised — first real call will be Delroy's Test Verbinding after SMTP config is filled in.

## Verification Results

| Check | Result |
|---|---|
| Build (`npm run build`) | PASS — exit 0, PWA generation OK |
| Lint (`npm run lint`) | FAIL — exit 1 (434 problems / 329 errors). **Zero errors in TC-006 files** (verified by grep on `EmailSettingsCard|useEmailSettings`). All errors pre-existing in codebase. Delroy authorized Option A: accept lint baseline. |
| Migration A applied | Confirmed by Delroy via Supabase SQL Editor — "Success. No rows returned." |
| Migration B applied | Confirmed by Delroy via Supabase SQL Editor — "Success." |
| Edge Function deployed | Confirmed by CLI exit 0 |
| Settings page renders EmailSettingsCard for VP | Code-confirmed via guard `role === 'vp'`; visual confirmation pending Delroy manual check |
| Smoke test (Test Verbinding → 200 + delivered email) | **Pending Delroy manual action** |

---

## Known Risks at POST

1. **Nodemailer Deno runtime** — Not yet exercised. First Test Verbinding click is the real validation. If runtime fails (Node `net`/`tls` socket issue): STOP and escalate per CHALLENGE FIRST decision. No autonomous lib-swap.
2. **Hard-coded Supabase URL in trigger** — Replicates existing MEDIUM issue (CLAUDE.md §14). Accepted by Delroy in CHALLENGE FIRST decision A.
3. **Lint baseline** — 329 pre-existing errors remain. Accepted by Delroy in Option A override. New TC required if a future cleanup is desired.
4. **types.ts not regenerated** — `email_settings` not present in `src/integrations/supabase/types.ts`. Build still passes (Supabase client tolerates unknown table names in queries at runtime). If strict typing is later required, run `supabase gen types typescript --project-id xjkkumclqqnjngnttabf` in a follow-up TC.
5. **Trigger fires on every notification** — Per TC §Part D, all notification types route to email. Per-user opt-out and category filtering are explicitly deferred to Phase 1B.

---

## Manual Actions Required by Delroy

1. Navigate to `Settings` as VP — confirm EmailSettingsCard renders below PushNotificationToggle (Col lg=12).
2. Fill in SMTP fields:
   - Host: `smtp.hostinger.com`
   - Port: `465`
   - Username: (Hostinger SMTP user)
   - Password: (Hostinger SMTP password)
   - From Address: (Hostinger mailbox address)
   - From Name: `VP-Flow` (or preferred)
3. Toggle **Enable email notifications** → ON.
4. Click **Opslaan**. Confirm toast "Email settings saved".
5. Click **Test Verbinding**. Expected: toast "Test email sent to …" + email arrives at `from_address` inbox.
6. If Test Verbinding fails: capture exact error message → escalate to Devmart. Do NOT swap email library autonomously.

---

## Stop Condition Status

STAP 8 (final report) follows this restore point. Per TC §Stop Condition: do not start Phase 1B work. Phase 1A.2 awaits Delroy "Goedgekeurd" after manual smoke test passes.
