# DEVMART TASK CONTRACT

## Task Identification

- **Task Name:** Hard-coded Supabase URL → Vault Secret (push + email triggers)
- **Project:** VP-Flow
- **Phase:** v2.0 Maintenance
- **Phase Validator:** Delroy
- **Date:** 2026-05-12
- **Control Chain Mode:** [x] Mode A — Claude.ai-Mediated
- Mode B reason: N/A

---

## Objective

Replace the hard-coded Supabase project URL in `trigger_push_notification()` and `trigger_email_notification()` with a vault secret read, using one additive migration.

---

## Execution Mode

[x] SAFE MODE — bug fixes, narrow corrections, code review
[ ] EXTENDED MODE — controlled feature work, bounded module expansion
[ ] FULL BUILD MODE — full implementation within approved PRD

---

## Risk Classification

[ ] LOW — single module, no data/auth impact
[ ] MEDIUM — multi-file within module, potential side effects
[x] HIGH — DB / auth / security / API contract / architecture / cross-module

**HIGH reason:** Migration replaces live trigger functions that drive push and email notifications for a government-grade system. A misconfigured vault secret causes silent notification failure. Lane C applies.

**HIGH approval confirmation:** Delroy — goedgekeurd 2026-05-12 via Cowork sessie

---

## Scope Definition

### In Scope

**Phase A — Soft Source of Truth Audit (MANDATORY FIRST STEP — do NOT skip)**

Before touching any file, Claude Code must perform a read-only audit:

1. Read `supabase/migrations/20260512090100_email_notification_trigger.sql` — locate the hard-coded URL in `trigger_email_notification()`
2. Read `supabase/migrations/` — find the push trigger migration, locate the hard-coded URL in `trigger_push_notification()`
3. Check Supabase Vault via SQL Editor (or note that this must be done manually): verify whether a secret named `SUPABASE_PROJECT_URL` already exists in `vault.decrypted_secrets`
4. Produce an audit report with:
   - Exact file path + line number of each hard-coded URL found
   - Current URL value
   - Whether `SUPABASE_PROJECT_URL` vault secret exists (or must be created)
   - Proposed new vault read pattern for each function
5. **STOP after audit report — do not proceed until Delroy gives second "Goedgekeurd"**

**Phase B — Fix (only after Delroy re-confirms)**

- Create one new additive migration: `supabase/migrations/20260512100000_vault_url_trigger_fix.sql`
  - Use `CREATE OR REPLACE FUNCTION` to update both `trigger_push_notification()` and `trigger_email_notification()`
  - Replace hard-coded URL with: `SELECT decrypted_secret INTO v_project_url FROM vault.decrypted_secrets WHERE name = 'SUPABASE_PROJECT_URL' LIMIT 1`
  - Add NULL check: if `v_project_url IS NULL` → `RAISE EXCEPTION 'SUPABASE_PROJECT_URL secret not configured in vault'`
  - Construct Edge Function URL as: `v_project_url || '/functions/v1/send-push-notification'` (and email equivalent)
- Apply migration via Supabase SQL Editor (manual — same as TC-006 pattern)
- Instruct Delroy to add `SUPABASE_PROJECT_URL` = `https://xjkkumclqqnjngnttabf.supabase.co` to Supabase Vault **before** applying migration

### Out of Scope

- Any change to `PUSH_TRIGGER_SERVICE_ROLE` vault secret or JWT logic
- Any change to the Edge Functions themselves
- Any change to email_settings table or RLS
- Any change to frontend files
- Any other migration files
- Changing the vault secret name pattern
- Any Phase 1B work

---

## File Boundary

### Allowed — Modified Files

- `supabase/migrations/20260512100000_vault_url_trigger_fix.sql` — new file only

### Allowed — Read Only (audit phase)

- All existing migration files in `supabase/migrations/`
- `.claude/CLAUDE.md`

### Forbidden

- All existing migration files — read only, never modify
- All Edge Functions
- All frontend files
- `.claude/`, `Project Docs/`, `Project Restore Points/`, `Task Contracts/`

---

## Pre-Execution Requirements (Lane C)

1. **PRE restore point** must be created: `RP_VaultURLFix_PRE_TC010.md` in `/Project Restore Points/v2.0/`
2. **Phase A audit must complete and be confirmed by Delroy before any file is written**
3. **Delroy must add `SUPABASE_PROJECT_URL` to Supabase Vault before migration is applied**
4. **Delroy re-confirmation required** before applying migration — Lane C gate

---

## Expected Output

- New migration file written and shown to Delroy for review
- Migration applied via SQL Editor (Delroy executes after review)
- Both trigger functions updated — no more hard-coded URL
- Silent failure replaced by explicit RAISE EXCEPTION if vault secret missing
- Smoke test: insert a notification row → verify pg_net still calls Edge Function → verify 200 response in `net._http_response`

---

## Verification Requirement

Claude Code must confirm after execution:

1. Show full diff of the new migration file
2. Query `net._http_response` after smoke test — confirm status 200
3. Confirm no other files were modified
4. Confirm vault secret `SUPABASE_PROJECT_URL` is set (Delroy confirms manually)

---

## Constraints

- Migration must be ADDITIVE — `CREATE OR REPLACE FUNCTION` only, no DROP
- Vault secret name must be exactly: `SUPABASE_PROJECT_URL`
- NULL check on vault read is mandatory — no silent failures
- Migration timestamp must be after all existing migrations (use `20260512100000` or later)
- Do not commit vault secret values to the repo
- Apply migration manually via SQL Editor — do not use `supabase db push`

---

## Stop Condition

**Phase A:** Stop after audit report delivered. Wait for Delroy's second "Goedgekeurd".
**Phase B:** Stop after migration written, reviewed, applied, smoke test passed, POST restore point created, report delivered to Delroy.

---

## Override Log

- Violation detected: —
- Instruction in conflict: —
- Execution status: NOT STARTED
- Delroy response: [ ] Corrected instruction | [ ] Override authorized

---

## Validation Checklist

- [x] Objective is single and unambiguous
- [x] Execution mode selected: SAFE MODE
- [x] Risk classified: HIGH (live trigger functions, government system)
- [x] File boundaries explicit — one new migration file only
- [x] Stop condition defined — two gates (Phase A audit + Lane C re-confirmation)
- [x] No field blank
- [x] PRE restore point required before execution
- [x] Phase A soft audit mandatory before any write
- [x] Vault secret must be set by Delroy before migration applies

---

**STATUS: DRAFT — Awaiting Delroy approval ("Goedgekeurd") before Claude Code may begin.**
