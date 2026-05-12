# Restore Point — PRE — TC-006 Email Notifications (Phase 1A.2)

**Type:** PRE-execution
**Task Contract:** TC-006 — Email Notifications Phase 1A.2
**Lane:** C (HIGH risk — DB migrations + Edge Function + trigger + UI)
**Date:** 2026-05-12
**Operator:** Claude Code (Mode A — Devmart-mediated)
**Authority:** Delroy — approved 2026-05-12 via Cowork; Lane C re-confirmation given for migrations, Edge Function, trigger in this session.

---

## Pre-Execution State

### Settings UI — current files

**`src/app/(admin)/settings/page.tsx`** — Renders 4 cards in a single `Row` (g-4 mb-4):
- `ProfileCard` (Col lg=6) — all roles
- `ThemeSettingsCard` (Col lg=6) — all roles
- `SystemInfoCard` (Col lg=6) — all roles, role-aware
- `PushNotificationToggle` (Col lg=6) — VP+Secretary (Protocol guarded internally)

Uses `useAuthContext()` to read `session`, `role`, `authLoading`. No EmailSettingsCard import or render present.

**`src/app/(admin)/settings/components/index.ts`** — Exports:
- `ProfileCard`
- `ThemeSettingsCard`
- `SystemInfoCard`
- `PushNotificationToggle` (default export re-export)

No `EmailSettingsCard` export present.

**`src/app/(admin)/settings/hooks/index.ts`** — Exports:
- `useUserProfile`

No `useEmailSettings` export present.

### Database — email_settings table

Confirmed ABSENT. No migration file in `supabase/migrations/` matches `*email*`. No `email_settings` table exists.

### Edge Functions — send-email-notification

Confirmed ABSENT (will be created in STAP 4).

### Existing push notification artifacts (frozen — NOT to be modified)

- `supabase/functions/send-push-notification/` — frozen (TC-005 sealed)
- `trigger_push_notification` PL/pgSQL function — frozen
- `on_notification_send_push` trigger on `notifications` — frozen
- Vault secret `PUSH_TRIGGER_SERVICE_ROLE` — confirmed valid by Delroy (exp 2036); will be reused as service-role JWT source for email trigger.

---

## Planned Changes (per TC-006)

### New files

1. `supabase/migrations/[timestamp]_email_settings_table.sql` — table + RLS + single-row seed
2. `supabase/migrations/[timestamp]_email_notification_trigger.sql` — `trigger_email_notification()` + `on_notification_send_email` trigger
3. `supabase/functions/send-email-notification/index.ts` — Edge Function (nodemailer / Hostinger SMTP)
4. `src/app/(admin)/settings/components/EmailSettingsCard.tsx`
5. `src/app/(admin)/settings/hooks/useEmailSettings.ts`

### Modified files

1. `src/app/(admin)/settings/components/index.ts` — add EmailSettingsCard export
2. `src/app/(admin)/settings/hooks/index.ts` — add useEmailSettings export
3. `src/app/(admin)/settings/page.tsx` — add EmailSettingsCard (Col lg=12, VP-only guard via `role === 'vp'`)

### NOT touched

- Any existing migration file
- `send-push-notification` Edge Function and its trigger
- All frozen v1.x modules
- `src/integrations/supabase/types.ts` (will only change if Supabase CLI regenerates)
- RLS policies on existing tables
- `.claude/`, `Project Docs/`, other restore points

---

## Risks at PRE

- **Nodemailer Deno-runtime risk** — `npm:nodemailer` in Supabase Edge Functions may fail at runtime due to Node net/tls socket compatibility. TC §Constraints forbids lib-swap. Mitigation: deploy first; failure during Test Verbinding → STOP and escalate to Delroy. No autonomous library substitution.
- **Hard-coded Supabase URL in trigger** — Replicates existing MEDIUM issue (§14 CLAUDE.md) — accepted by Delroy in CHALLENGE FIRST decision (URL-pattern A). No new risk class introduced.
- **Vault secret expiry** — `PUSH_TRIGGER_SERVICE_ROLE` confirmed valid (exp 2036) — no action needed in this TC.

---

## Stop Conditions Active

- Stop after each STAP and await Delroy confirmation
- Build/lint failure → STOP, no auto-fix outside scope
- Edge Function deploy failure → STOP, report
- Migration apply failure → STOP, do not edit migration retroactively (additive only)
