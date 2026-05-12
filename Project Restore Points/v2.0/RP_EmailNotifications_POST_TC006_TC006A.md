# Restore Point — Email Notifications POST
# TC-006 + TC-006-A (CORS + Auth Split Amendment)
# Phase: v2.0 Phase 1A.2
# Date: 2026-05-12
# Author: Claude Code (Cowork session — Delroy authorized)

---

## Status: COMPLETE

Phase 1A.2 Email Notifications is fully implemented and smoke-tested.

---

## What Was Implemented

### TC-006 — Core Email Notification System

**Migrations applied (manual via Supabase SQL Editor):**

1. `20260512090000_email_settings_table.sql`
   - Created `email_settings` table with singleton seed row (UUID `00000000-0000-0000-0000-000000000001`)
   - Columns: id, smtp_host, smtp_port, smtp_username, smtp_password, from_address, from_name, enabled, created_at
   - RLS enabled: VP-only read/write via `has_role(_user_id, 'vp')` (SECURITY DEFINER)
   - No `to_address` column — recipient is resolved at runtime from auth.users

2. `20260512090100_email_notification_trigger.sql`
   - Created `trigger_email_notification()` PL/pgSQL function (SECURITY DEFINER)
   - Reads `PUSH_TRIGGER_SERVICE_ROLE` JWT from vault
   - Posts via `net.http_post` to `send-email-notification` Edge Function
   - Payload: `{ userId, title, message, link }` (camelCase — matches Edge Function)
   - Header: `x-trigger-source: pg_trigger` (defense-in-depth gate)
   - Created trigger `on_notification_send_email` AFTER INSERT on public.notifications

**Edge Function deployed:**
- `supabase/functions/send-email-notification/index.ts`
- SMTP via nodemailer → Hostinger smtp.hostinger.com:465 SSL

**Frontend:**
- `src/app/(admin)/settings/components/EmailSettingsCard.tsx` — VP-only SMTP settings card
- `src/app/(admin)/settings/hooks/useEmailSettings.ts` — useGetEmailSettings, useUpsertEmailSettings
- `src/app/(admin)/settings/page.tsx` — EmailSettingsCard added with VP role guard

---

### TC-006-A — CORS + Auth Split Amendment

**Trigger:** Test Verbinding (browser → supabase.functions.invoke) was blocked by CORS preflight and service_role auth mismatch.

**Fix applied to `supabase/functions/send-email-notification/index.ts`:**

1. **CORS headers** added: `Access-Control-Allow-Origin: *`, Allow-Headers, Allow-Methods
2. **OPTIONS preflight handler** added: returns 200 with CORS headers
3. **Auth split** implemented:
   - Test path (`body.test === true`): authenticated JWT + VP role check via `adminClient.rpc("has_role", { _user_id, _role: "vp" })`
   - Trigger path: service_role JWT + `x-trigger-source: pg_trigger` header (unchanged)

---

## Current Email Settings Configuration

- smtp_host: smtp.hostinger.com
- smtp_port: 465
- smtp_username: info@vpflow.app
- from_address: info@vpflow.app
- from_name: VP-Flow
- enabled: true

---

## Smoke Test Results

### Test Path (Browser → Edge Function)
- Trigger: VP clicks "Test Verbinding" in Settings
- Result: Email delivered to `info@vpflow.app` ("VP-Flow — SMTP Test Connection")
- Status: **PASS** — email received in inbox at 6:48 PM

### Trigger Path (pg_net → DB trigger → Edge Function → SMTP)
- Trigger: INSERT into `public.notifications` for VP user `df790081-3b6e-4cab-86c3-b5ecde8e37c5`
- pg_net response id 7: `{"sent":1,"messageId":"<507043c8-a1a2-c7ab-fd81-aa28a07750fe@vpflow..."}`, status 200
- Status: **PASS** — email sent to `info@devmart.sr` (VP user's email), confirmed by messageId

### Other TC deliverables
- TC-007 (Lint Cleanup): `npm run lint` exits 0, `npm run build` exits 0 — **PASS**
- TC-008 (LinkedNotes rules-of-hooks): violation fixed, lint/build both exit 0 — **PASS**

---

## What Was NOT Changed

- No changes to push notification Edge Function or trigger
- No changes to any other Edge Functions
- No changes to frozen v1.x RLS policies, triggers, or tables
- No changes outside the TC-006 / TC-006-A / TC-007 / TC-008 scope

---

## Known Issues (pre-existing, not introduced here)

- CORS origin `*` → specific domain deferred to Hostinger deployment
- Hard-coded Supabase URL in push and email triggers (MEDIUM — project-wide, separate TC)
- KI-007-02: 13 warnings in src/context/ + hooks (LOW — deferred, separate TC)

---

## Phase Gate: v2.0 Phase 1A.2 — CLOSED

Both test path and trigger path confirmed working. Phase 1A.2 Email Notifications is COMPLETE.

**Next phase (Phase 1B+) remains BLOCKED until Delroy opens a new TC.**

---

## Git State

All changes committed and pushed to remote (Delroy confirmed push complete).
