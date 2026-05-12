# DEVMART TASK CONTRACT

## Task Identification

- **Task Name:** Email Notifications — Phase 1A.2 (Settings UI + Edge Function + Trigger)
- **Project:** VP-Flow
- **Phase:** v2.0 Phase 1A.2 — Email Notifications
- **Phase Validator:** Delroy
- **Date:** 2026-05-12
- **Control Chain Mode:** [x] Mode A — Claude.ai-Mediated
- Mode B reason: N/A

---

## Objective

Implement email notifications for VP-Flow by adding an Email Settings card (VP-only) to the Settings page, a new `email_settings` database table with RLS, a `send-email-notification` Edge Function using Hostinger SMTP, and a database trigger that fires email delivery on notification insert.

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

**Part A — Migration (Lane C)**
- New migration: `email_settings` table (single-row config pattern, upsert)
  - Columns: `id uuid PK`, `smtp_host text`, `smtp_port integer`, `smtp_username text`, `smtp_password text`, `from_address text`, `from_name text`, `enabled boolean default false`, `created_at timestamptz`, `updated_at timestamptz`
- RLS: VP role can SELECT and UPDATE. Service role can SELECT (for Edge Function). No other roles.
- Seed: insert one default row with `enabled = false` and empty fields (so UI always has a row to UPDATE)

**Part B — Settings UI (Lane B)**
- New component: `EmailSettingsCard.tsx` in `/src/app/(admin)/settings/components/`
  - Fields: SMTP Host, Port (number), Username, Password (masked input), From Address, From Name, Enabled toggle
  - Save button: upserts row via `useEmailSettings` hook
  - Test Connection button: calls Edge Function with `{ test: true }` payload — shows success/error toast
  - VP-only: card is rendered only when `role === 'vp'`
- New hook: `useEmailSettings.ts` in `/src/app/(admin)/settings/hooks/`
  - `useGetEmailSettings()` — SELECT from `email_settings`
  - `useUpsertEmailSettings()` — UPDATE the single row
- Export in `components/index.ts`
- Add `EmailSettingsCard` to `settings/page.tsx` — below PushNotificationToggle, Col lg={12}, VP-only guard

**Part C — Edge Function (Lane C)**
- New Edge Function: `supabase/functions/send-email-notification/index.ts`
  - Auth pattern: identical to send-push-notification (manual JWT payload decode, service_role + x-trigger-source gate)
  - Two modes:
    1. `test: true` in body → send test email to the `from_address` configured, return result. No x-trigger-source required for test mode — but still requires valid service_role JWT.
    2. Normal mode → triggered by pg_net from DB trigger, sends notification email to the target user
  - SMTP: use `npm:nodemailer` for Deno-compatible SMTP via Hostinger (`smtp.hostinger.com:465`, SSL)
  - Reads SMTP config from `email_settings` table via adminClient (service role)
  - Reads target user email from `auth.users` via adminClient
  - Email body: plain-text + HTML — title, message, and optional link
  - Returns `{ sent: 1 }` on success, error object on failure
  - If `email_settings.enabled = false`: return `{ skipped: true, reason: 'email disabled' }` with status 200

**Part D — Database Trigger (Lane C)**
- New trigger function: `trigger_email_notification()` in a new migration
  - Reads service_role JWT from `vault.decrypted_secrets WHERE name = 'PUSH_TRIGGER_SERVICE_ROLE'` (reuse existing vault secret — same JWT works)
  - Posts to `send-email-notification` Edge Function via `net.http_post`
  - Headers: `Authorization: Bearer <jwt>`, `x-trigger-source: pg_trigger`
  - Body: `{ userId: NEW.user_id, title: NEW.title, message: NEW.message, link: NEW.link }`
  - Only fires when `NEW.type` is a notification type that warrants email (all types initially)
- New trigger: `on_notification_send_email` AFTER INSERT ON `notifications` FOR EACH ROW EXECUTE PROCEDURE `trigger_email_notification()`

### Out of Scope

- Modifying any existing migration files
- Modifying `send-push-notification` Edge Function
- Modifying `trigger_push_notification` trigger or function
- Email template system (rich HTML templates — deferred)
- Per-user email preferences / opt-out (Notification Preferences — Phase 1B)
- Notification type filtering (Category Filtering — Phase 1B)
- Retry logic for failed emails (deferred)
- Unsubscribe links (deferred)
- Any frozen v1.x modules
- Any role other than VP for EmailSettingsCard

---

## File Boundary

### Allowed — New Files

- `supabase/migrations/[timestamp]_email_settings_table.sql`
- `supabase/migrations/[timestamp]_email_notification_trigger.sql`
- `supabase/functions/send-email-notification/index.ts`
- `src/app/(admin)/settings/components/EmailSettingsCard.tsx`
- `src/app/(admin)/settings/hooks/useEmailSettings.ts`

### Allowed — Modified Files

- `src/app/(admin)/settings/components/index.ts` (add EmailSettingsCard export)
- `src/app/(admin)/settings/hooks/index.ts` (add useEmailSettings export)
- `src/app/(admin)/settings/page.tsx` (add EmailSettingsCard, VP-only guard)

### Forbidden

- All files not listed above
- `/supabase/migrations/*.sql` (existing — read only)
- `/supabase/functions/send-push-notification/index.ts`
- All frozen v1.x modules
- `.claude/`, `Project Docs/`, `Project Restore Points/`
- Any RLS policy on existing tables
- `src/integrations/supabase/types.ts` — update only if Supabase CLI regenerates; do not hand-edit

---

## Pre-Execution Requirements (Lane C)

Before execution begins:

1. **PRE restore point** must be created: `RP_EmailNotifications_PRE_TC006.md` in `/Project Restore Points/v2.0/`
2. **SMTP password** must be confirmed available — will be read from `email_settings` table (entered via UI by VP after deployment)
3. **Vault secret** `PUSH_TRIGGER_SERVICE_ROLE` must still be valid — confirm before running trigger migration

---

## Expected Output

- Two new migration files (additive only)
- One new Edge Function directory + index.ts
- Three new frontend files (component, hook, types if needed)
- Three modified frontend files (index.ts x2, page.tsx)
- Build passes: `npm run build` exits 0, no TypeScript errors
- Lint passes: `npm run lint` exits 0

---

## Verification Requirement

Claude Code must confirm after execution:

1. `npm run build` — exit code and any errors
2. `npm run lint` — exit code
3. Migration SQL reviewed: table created, RLS policies correct, trigger fires on INSERT
4. Edge Function deployed: `supabase functions deploy send-email-notification` — exit 0
5. Settings page renders EmailSettingsCard for VP role (visual or DOM confirmation)
6. Smoke test: VP fills in SMTP settings via UI → clicks Test Connection → receives 200 response (actual email delivery verified manually by Delroy)

---

## Constraints

- SMTP library: `npm:nodemailer` — no other email libraries
- Auth pattern in Edge Function: identical to `send-push-notification` (manual JWT decode, no `auth.getClaims()`)
- RLS: no `USING (true)` — explicit VP-role check only
- Password field: `type="password"` in UI, never logged server-side
- Edge Function: no CORS headers (server-side only, called by pg_net and Settings UI test button via supabase.functions.invoke)
- Settings UI: VP-only guard in `page.tsx` — `role === 'vp'` check, not just hidden
- Single-row table: use upsert on fixed UUID or `ON CONFLICT DO UPDATE` pattern

---

## Stop Condition

Stop after: Edge Function deployed, migrations applied, Settings UI visible and functional for VP, POST restore point created, and report delivered to Delroy. Do not start Phase 1B work.

---

## Override Log

- Violation detected: —
- Instruction in conflict: —
- Execution status: NOT STARTED
- Delroy response: [ ] Corrected instruction | [ ] Override authorized

---

## Validation Checklist

- [x] Objective is single and unambiguous
- [x] Execution mode selected: FULL BUILD MODE
- [x] Risk classified: HIGH
- [x] File boundaries explicit
- [x] Stop condition defined
- [x] No field blank
- [x] PRE restore point required before execution
- [x] Lane C re-confirmation by Delroy required before migrations run

---

**STATUS: DRAFT — Awaiting Delroy approval ("Goedgekeurd") before Claude Code may begin.**
