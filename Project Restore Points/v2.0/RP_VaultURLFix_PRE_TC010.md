# Restore Point — PRE — TC-010 Vault URL Fix

**TC:** TC-010 — Hard-coded Supabase URL → Vault Secret (push + email triggers)
**Lane:** C (HIGH RISK — live trigger functions, government system)
**Phase:** v2.0 Maintenance
**Date:** 2026-05-12
**Authority:** Delroy

---

## Current State Summary

Two production trigger functions on `public.notifications` contain a hard-coded
Supabase project URL (`https://xjkkumclqqnjngnttabf.supabase.co`):

1. `public.trigger_push_notification()` — last redefined in
   `supabase/migrations/20260511214742_fix_push_trigger_auth.sql` (TC-005).
   Hard-coded URL at line 39.
2. `public.trigger_email_notification()` — defined in
   `supabase/migrations/20260512090100_email_notification_trigger.sql` (TC-006).
   Hard-coded URL at line 38.

Both functions already read a vault secret (`PUSH_TRIGGER_SERVICE_ROLE`) for
the service-role JWT. The vault-read pattern (with `IS NULL` guard + RAISE
EXCEPTION) is therefore already established in this codebase and proven by
smoke tests passing 200 OK after TC-005 and TC-006-A.

Trigger bindings:
- `on_notification_send_push` AFTER INSERT on `public.notifications`
- `on_notification_send_email` AFTER INSERT on `public.notifications`

Both bindings continue to exist and must NOT be re-created (additive
`CREATE OR REPLACE FUNCTION` only — no DROP TRIGGER).

---

## What Is About To Change

**Phase A (this step — read-only audit):** no file changes.
**Phase B (only after Delroy's second Goedgekeurd):**
- One new additive migration: `supabase/migrations/20260512100000_vault_url_trigger_fix.sql`
- `CREATE OR REPLACE FUNCTION` for both trigger functions, replacing the
  hard-coded URL with a vault read of `SUPABASE_PROJECT_URL` and an explicit
  NULL guard that raises an exception (no silent failure).

---

## What Is NOT Touched

- No existing migration file is modified
- No Edge Function is modified
- No frontend code is modified
- No RLS policy is modified
- No table schema is modified
- No vault secret named `PUSH_TRIGGER_SERVICE_ROLE` is touched
- Trigger bindings on `public.notifications` are untouched

---

## Known Risks

- Vault secret `SUPABASE_PROJECT_URL` must exist BEFORE the migration is
  applied. If it is missing, both notification triggers will raise on insert
  and notification inserts will fail. Delroy must seed the secret in Supabase
  Vault first.
- Function owner (`postgres`) must retain SELECT on `vault.decrypted_secrets`
  (Supabase default, already verified for the PUSH_TRIGGER_SERVICE_ROLE
  read in TC-005).
- `CREATE OR REPLACE FUNCTION` is online — no lock window long enough to
  affect an interactive request, but inserts that race the swap may hit the
  old body. Acceptable for this system.

---

## Rollback

If Phase B fails or notifications break after apply:
1. Re-run the previous function bodies via SQL Editor — copy from
   `20260511214742_fix_push_trigger_auth.sql` (push) and
   `20260512090100_email_notification_trigger.sql` (email).
2. No data is mutated by this migration — rollback is a function-body revert.
3. Vault secret `SUPABASE_PROJECT_URL` can stay; it is harmless if unused.

---

## Validation Required Before Phase B Begins

- Delroy issues second "Goedgekeurd" on the Phase A audit report
- Delroy confirms `SUPABASE_PROJECT_URL` is seeded in Supabase Vault
