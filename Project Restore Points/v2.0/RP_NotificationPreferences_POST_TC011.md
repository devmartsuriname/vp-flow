# RP_NotificationPreferences_POST_TC011

**Type:** POST-execution restore point
**TC:** TC-011 — Notification Preferences (v2.0 Phase 1B)
**Date:** 2026-05-12
**Lane:** C (Step 1 migration + Step 3 Edge Function deploy) + B (Step 2 UI)
**Status:** COMPLETE — Delroy goedgekeurd 2026-05-12

---

## Outcome Summary

Phase 1B closed. Per-user push + email channel toggles are live:
- DB table `public.notification_preferences` deployed with owner-only RLS.
- Settings UI exposes a Notification Preferences card for all roles (VP, Secretary, Protocol).
- Both Edge Functions (`send-push-notification`, `send-email-notification`) now silently skip delivery when the user has opted out on the corresponding channel.
- Test path on email (`body.test = true`) continues to bypass the preference check.

## Execution Trail

### Step 1 — Migration (Lane C)
- File: `supabase/migrations/20260512110000_notification_preferences.sql`
- Applied via Supabase SQL Editor: "Success. No rows returned" (2026-05-12)
- Schema: `user_id UUID PK FK auth.users(id) ON DELETE CASCADE`, `push_enabled BOOL NOT NULL DEFAULT TRUE`, `email_enabled BOOL NOT NULL DEFAULT TRUE`, timestamps
- `updated_at` trigger active
- RLS ENABLED; three owner-only policies (SELECT/INSERT/UPDATE on `user_id = auth.uid()`)
- No DELETE policy, no seed rows (opt-out model)

### Step 2 — Settings UI (Lane B)
- New: `src/app/(admin)/settings/hooks/useNotificationPreferences.ts`
- New: `src/app/(admin)/settings/components/NotificationPreferencesCard.tsx`
- Modified: `src/app/(admin)/settings/hooks/index.ts`, `src/app/(admin)/settings/components/index.ts`, `src/app/(admin)/settings/page.tsx`
- `npm run lint`: 0 errors, 12 pre-existing warnings (TC-009 baseline)
- `npm run build`: ✓ built in 9.91s

### Step 3 — Edge Function delivery logic (Lane C)
- Modified: `supabase/functions/send-push-notification/index.ts` — preference check after `adminClient` creation, before subscriptions query
- Modified: `supabase/functions/send-email-notification/index.ts` — preference check inside trigger path, after `userId/title` validation, before `auth.admin.getUserById`
- Both functions: row-missing OR flag = true → continue. flag = false → return `{ sent: 0, skipped: 1, reason: ... }` status 200
- Failure mode: lookup error logs + fails open (continues delivery)
- Deployed: `npx supabase functions deploy send-push-notification` + `send-email-notification` (2026-05-12)

## Smoke Test Results (Delroy verified)

| Test | Condition | Result |
|---|---|---|
| A | push_enabled = FALSE, insert notification | net._http_response id 12: `{"sent":0,"skipped":1,"reason":"push disabled by user"}` status 200. Email id 11: sent:1. PASS |
| B | push_enabled = TRUE, insert notification | net._http_response id 13: push attempted (no active subscription — expected). Preference skip NOT triggered. PASS |
| C | email_enabled = FALSE + Settings "Test Verbinding" | Test email delivered to info@vpflow.app. Test path bypasses preference check. PASS |

Defaults restored after testing: push_enabled = TRUE, email_enabled = TRUE.

## What Was NOT Touched

- Existing migration files (additive new file only)
- Frozen v1.x modules and RLS policies
- DB trigger functions `trigger_push_notification`, `trigger_email_notification`
- `email_settings` table or SMTP logic
- `src/integrations/supabase/types.ts` (auto-generated — type assertion pattern matches existing `useEmailSettings`)
- Auth / role / audit logic
- VAPID configuration

## Rollback Plan (if needed)

1. UI: revert commits touching `src/app/(admin)/settings/`
2. Edge Functions: redeploy previous versions from git history via `supabase functions deploy <name>`
3. DB: `DROP TABLE public.notification_preferences CASCADE; DROP FUNCTION public.notification_preferences_set_updated_at();` (safe — additive table, no FK from other tables)

## Risk Remaining

- **Low.** Opt-out default + fail-open on DB lookup error means no user is silently cut off from notifications by this change.
- Edge Function CORS = `*` on email function remains LOW priority deferred (already tracked, not in scope here).
- `phase-gates.md` still shows Phase 1B as BLOCKED — Delroy may want to refresh that doc separately (out of TC-011 scope).

## Approval Trail

- TC-011 approved by Delroy 2026-05-12 via Cowork sessie
- Lane C migration apply re-confirmed by Delroy 2026-05-12
- Lane C Edge Function deploy re-confirmed by Delroy 2026-05-12
- Final closure approved by Delroy 2026-05-12 after smoke test verification

## Phase Status

- v2.0 Phase 1B — **CLOSED** 2026-05-12
- Next phase: requires new Task Contract before any v2.0 Phase 1B+ work begins
