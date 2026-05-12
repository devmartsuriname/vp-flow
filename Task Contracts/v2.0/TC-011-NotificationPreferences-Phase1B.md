# DEVMART TASK CONTRACT

## Task Identification

- **Task Name:** Notification Preferences — Phase 1B (per-user channel toggles)
- **Project:** VP-Flow
- **Phase:** v2.0 Phase 1B
- **Phase Validator:** Delroy
- **Date:** 2026-05-12
- **Control Chain Mode:** [x] Mode A — Claude.ai-Mediated
- Mode B reason: N/A

---

## Objective

Implement per-user notification preferences: a `notification_preferences` table (one row per user, push_enabled + email_enabled toggles), a Settings UI for users to manage their own preferences, and preference-aware delivery logic in both Edge Functions — so disabled channels are silently skipped before sending.

---

## Execution Mode

[ ] SAFE MODE — bug fixes, narrow corrections, code review
[x] EXTENDED MODE — controlled feature work, bounded module expansion
[ ] FULL BUILD MODE — full implementation within approved PRD

---

## Risk Classification

[ ] LOW — single module, no data/auth impact
[ ] MEDIUM — multi-file within module, potential side effects
[x] HIGH — DB / auth / security / API contract / architecture / cross-module

**HIGH reason:** Step 1 is a Lane C migration (new table + RLS). Step 3 modifies both Edge Functions that drive live push and email delivery. A bug in Step 3 could silently disable all notifications for all users.

**HIGH approval confirmation:** Delroy — goedgekeurd 2026-05-12 via Cowork sessie

---

## Scope Definition

### In Scope

**Step 1 — Migration (Lane C)**

- Create new additive migration: `supabase/migrations/20260512110000_notification_preferences.sql`
  - Table: `public.notification_preferences`
    - `user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`
    - `push_enabled BOOLEAN NOT NULL DEFAULT TRUE`
    - `email_enabled BOOLEAN NOT NULL DEFAULT TRUE`
    - `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
    - `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`
  - RLS: ENABLED. Owner-only policy: `user_id = auth.uid()` for SELECT, INSERT, UPDATE. No DELETE needed (toggle model).
  - SECURITY DEFINER policy functions: use `has_role` pattern consistent with existing RLS.
  - No seed rows — NULL/no row = send (opt-out model, handled in Edge Functions).
- Apply migration via Supabase SQL Editor (same manual pattern as TC-006/TC-010).

**Step 2 — Settings UI (Lane B)**

- Add a "Notification Preferences" card to `src/app/(admin)/settings/page.tsx`
  - Visible to all roles (VP, Secretary, Protocol) — each user manages own preferences
  - Two toggles: "Push notificaties" and "E-mail notificaties"
  - On toggle: upsert row in `notification_preferences` for auth.uid()
  - Initial load: fetch current preferences; if no row exists, render both toggles ON
  - Create hook: `src/app/(admin)/settings/hooks/useNotificationPreferences.ts`
    - `useGetNotificationPreferences()` — SELECT from notification_preferences WHERE user_id = auth.uid()
    - `useUpsertNotificationPreferences()` — UPSERT (insert or update) on notification_preferences
  - Create component: `src/app/(admin)/settings/components/NotificationPreferencesCard.tsx`
- After UI changes: `npm run lint` must exit 0, `npm run build` must exit 0.

**Step 3 — Edge Function delivery logic (Lane C)**

- Update `supabase/functions/send-push-notification/index.ts`:
  - After resolving `userId` from the trigger payload, query `notification_preferences` WHERE `user_id = userId`
  - If row exists AND `push_enabled = false` → return `{ sent: 0, skipped: 1 }` with status 200 (no error, intentional skip)
  - If no row exists → continue sending (opt-out model: NULL = enabled)
  - Use `adminClient` for the preferences query (service role, same pattern already in use)
- Update `supabase/functions/send-email-notification/index.ts`:
  - Same pattern: check `email_enabled` before sending
  - Trigger path only — test path (`body.test === true`) bypasses preference check
  - Return `{ sent: 0, skipped: 1 }` with status 200 if email disabled
- Deploy both Edge Functions via `supabase functions deploy` (Delroy executes or approves)

### Out of Scope

- Category-level preferences (appointment, case, document, incoming_post) — deferred
- In-app notification preferences — deferred
- Any change to existing DB trigger functions (`trigger_push_notification`, `trigger_email_notification`)
- Any change to existing migration files
- Any change to frozen v1.x modules
- Any change to email_settings table or SMTP logic
- Admin override of user preferences
- Bulk preference management

---

## File Boundary

### Allowed — New Files

- `supabase/migrations/20260512110000_notification_preferences.sql`
- `src/app/(admin)/settings/hooks/useNotificationPreferences.ts`
- `src/app/(admin)/settings/components/NotificationPreferencesCard.tsx`

### Allowed — Modified Files

- `src/app/(admin)/settings/page.tsx` — add NotificationPreferencesCard
- `supabase/functions/send-push-notification/index.ts` — add preference check (trigger path)
- `supabase/functions/send-email-notification/index.ts` — add preference check (trigger path only)

### Forbidden

- All existing migration files — read only, never modify
- All frozen v1.x components
- `.claude/`, `Project Docs/`, `Project Restore Points/`, `Task Contracts/`
- `src/integrations/supabase/types.ts` — do not hand-edit
- DB trigger functions in migrations — do not touch

---

## Pre-Execution Requirements (Lane C — Steps 1 + 3)

1. **PRE restore point** must be created: `RP_NotificationPreferences_PRE_TC011.md` in `/Project Restore Points/v2.0/`
2. **Step 1** (migration) requires Delroy re-confirmation before apply — Lane C gate
3. **Step 3** (Edge Function updates) requires Delroy re-confirmation before deploy — Lane C gate
4. Step 2 (UI) may proceed after Step 1 migration is applied and confirmed

---

## Expected Output

- `notification_preferences` table live in Supabase with owner-only RLS
- Settings page shows Notification Preferences card for all users
- Toggling push or email off prevents delivery for that user on that channel
- Toggling back on restores delivery
- No row = send (opt-out model verified)
- `npm run lint` exits 0, `npm run build` exits 0

---

## Verification Requirement

Claude Code must confirm after each step:

**After Step 1:**
1. Show full migration file diff
2. Confirm table exists: `SELECT * FROM notification_preferences LIMIT 1;`
3. Confirm RLS enabled: `SELECT relrowsecurity FROM pg_class WHERE relname = 'notification_preferences';`

**After Step 2:**
1. `npm run lint` exit 0
2. `npm run build` exit 0
3. Show diff of changed UI files

**After Step 3:**
1. Show diff of both Edge Function files
2. Smoke test — disable push for VP user, insert notification, verify `net._http_response` shows `{"sent":0,"skipped":1}` (or equivalent)
3. Re-enable push, insert notification, verify delivery resumes (status 200, sent:1)
4. Confirm test path for email bypasses preference check

---

## Constraints

- Migration must be ADDITIVE — CREATE TABLE only, no ALTER on existing tables
- RLS must be enabled BEFORE table is used by any client
- NULL/no row in notification_preferences = send (not block) — opt-out model
- Edge Function preference check: trigger path only; test path for email is exempt
- `skipped` response must return HTTP 200 (not an error) — pg_net treats non-2xx as failure
- No hardcoded user IDs or credentials
- Apply migration manually via SQL Editor — do not use `supabase db push`
- Deploy Edge Functions via `supabase functions deploy` only after Delroy re-confirms Step 3

---

## Stop Conditions

- **After Step 1:** Stop, show migration + RLS verification, await Delroy signal before Step 2
- **After Step 2:** Stop, show lint/build results + UI diff, await Delroy signal before Step 3
- **After Step 3:** Stop, show Edge Function diffs + smoke test results, create POST restore point, deliver final report

---

## Override Log

- Violation detected: —
- Instruction in conflict: —
- Execution status: NOT STARTED
- Delroy response: [ ] Corrected instruction | [ ] Override authorized

---

## Validation Checklist

- [x] Objective is single and unambiguous
- [x] Execution mode selected: EXTENDED MODE
- [x] Risk classified: HIGH (Lane C migration + Lane C Edge Function updates)
- [x] File boundaries explicit
- [x] Stop conditions defined — 3 gates (after each step)
- [x] No field blank
- [x] PRE restore point required before execution
- [x] Lane C re-confirmation required at Step 1 (migration apply) and Step 3 (Edge Function deploy)
- [x] Opt-out model documented: NULL = send
- [x] Category preferences explicitly out of scope

---

**STATUS: DRAFT — Awaiting Delroy approval ("Goedgekeurd") before Claude Code may begin.**
