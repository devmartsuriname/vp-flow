# RP_NotificationPreferences_PRE_TC011

**Type:** PRE-execution restore point
**TC:** TC-011 — Notification Preferences (Phase 1B)
**Date:** 2026-05-12
**Lane:** C (Step 1 migration + Step 3 Edge Function deploy)
**Status:** DRAFT — pre-execution snapshot

---

## Current State Summary

VP-Flow is at the close of v2.0 Phase 1A:
- Phase 1A.1 (Push Notifications) — CLOSED via TC-005
- Phase 1A.2 (Email Notifications) — CLOSED via TC-006 + TC-006-A
- TC-010 (vault-read SUPABASE_PROJECT_URL) — CLOSED 2026-05-12
- Phase 1B — OPEN as of 2026-05-12 via approval of TC-011

No `notification_preferences` table exists. Both Edge Functions (`send-push-notification`, `send-email-notification`) currently deliver unconditionally — there is no per-user opt-out mechanism. The Settings page has no preferences card.

## What This TC Will Change

**Step 1 — Migration (Lane C):**
- New file: `supabase/migrations/20260512110000_notification_preferences.sql`
- Creates `public.notification_preferences` table (user_id PK, push_enabled, email_enabled, timestamps)
- Enables RLS with owner-only SELECT/INSERT/UPDATE policies
- No seed rows — opt-out model (NULL = send)

**Step 2 — Settings UI (Lane B):**
- New: `src/app/(admin)/settings/hooks/useNotificationPreferences.ts`
- New: `src/app/(admin)/settings/components/NotificationPreferencesCard.tsx`
- Modified: `src/app/(admin)/settings/page.tsx` (add card)

**Step 3 — Edge Function delivery logic (Lane C):**
- Modified: `supabase/functions/send-push-notification/index.ts` — check push_enabled before send
- Modified: `supabase/functions/send-email-notification/index.ts` — check email_enabled before send (trigger path only)

## What Will NOT Be Touched

- Existing migration files (read-only — additive only)
- Frozen v1.x modules and RLS policies
- DB trigger functions (`trigger_push_notification`, `trigger_email_notification`)
- `email_settings` table or SMTP logic
- `src/integrations/supabase/types.ts` (auto-generated)
- Any auth, role, or audit logic

## Risk Profile

- **Step 1 (migration):** Low — pure additive table + RLS. No data backfill. No existing rows.
- **Step 3 (Edge Functions):** Medium — a bug here could silently disable all notifications. Mitigated by opt-out model (NULL = send) and explicit smoke tests after deploy.
- **Rollback:** Step 1 reversible via `DROP TABLE public.notification_preferences CASCADE;`. Step 3 reversible via redeploy of previous Edge Function version.

## Approval Trail

- TC-011 approved by Delroy via Cowork sessie 2026-05-12
- Lane C re-confirmation pending for:
  - Step 1 migration apply (after PRE RP + migration shown)
  - Step 3 Edge Function deploy (after Step 2 closed)

## Pre-Execution Verification

- [x] PRE restore point created (this file)
- [ ] Step 1 migration file written and shown to Delroy
- [ ] Delroy re-confirms before SQL Editor apply
