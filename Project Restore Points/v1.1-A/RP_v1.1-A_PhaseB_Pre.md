# VP-Flow v1.1-A — Phase B Pre-Execution Restore Point

**Created:** 2026-01-22
**Phase:** B (RLS Policy Extension & Security Enforcement)
**Status:** PRE-EXECUTION

---

## Purpose

Snapshot of RLS and trigger state BEFORE Phase B execution to enable rollback if needed.

---

## Current RLS Policies — documents Table

| Policy Name | Command | Expression |
|-------------|---------|------------|
| VP can delete documents | DELETE | `is_vp(auth.uid())` |
| VP/Secretary can insert documents | INSERT | `is_vp_or_secretary(auth.uid())` |
| VP/Secretary can view documents | SELECT | `is_vp_or_secretary(auth.uid())` |

**Missing:** No UPDATE policy exists.

---

## Current RLS Policies — document_links Table

| Policy Name | Command | Expression |
|-------------|---------|------------|
| (none) | — | — |

**Status:** RLS enabled but NO policies defined (all access denied by default).

---

## Current RLS Policies — cases Table

| Policy Name | Command | Expression |
|-------------|---------|------------|
| VP can insert cases | INSERT | `is_vp(auth.uid())` |
| VP/Secretary can update cases | UPDATE | `is_vp_or_secretary(auth.uid())` |
| VP/Secretary can view cases | SELECT | `is_vp_or_secretary(auth.uid())` |

**Note:** DELETE not permitted.

---

## Current Triggers — cases Table

| Trigger Name | Function | Event |
|--------------|----------|-------|
| prevent_closed_case_update | `prevent_closed_case_update()` | BEFORE UPDATE |
| update_cases_updated_at | `update_updated_at_column()` | BEFORE UPDATE |

---

## Phase B Planned Changes

1. **document_links RLS:** 4 policies (SELECT, INSERT, UPDATE, DELETE)
2. **documents UPDATE policy:** VP-only
3. **Case re-open trigger:** `validate_case_reopen()` function + trigger

---

## Rollback Instructions

If Phase B fails:
1. Drop any created policies on document_links
2. Drop UPDATE policy on documents if created
3. Drop validate_case_reopen_trigger if created
4. Drop validate_case_reopen() function if created
5. Restore to Phase A post-execution state

---

**Checkpoint:** Ready for Phase B execution.
