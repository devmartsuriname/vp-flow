# VP-Flow v1.1-A — Phase B Post-Execution Restore Point

**Created:** 2026-01-22
**Phase:** B (RLS Policy Extension & Security Enforcement)
**Status:** POST-EXECUTION ✓

---

## Execution Summary

All Phase B migrations executed successfully. No linter issues found.

---

## New RLS Policies — document_links Table

| Policy Name | Command | Expression |
|-------------|---------|------------|
| VP/Secretary can view document links | SELECT | `is_vp_or_secretary(auth.uid())` |
| VP/Secretary can insert document links | INSERT | `is_vp_or_secretary(auth.uid())` |
| VP can update document links | UPDATE | `is_vp(auth.uid())` |
| VP can delete document links | DELETE | `is_vp(auth.uid())` |

**Protocol Access:** DENIED (no policies grant Protocol any access)

---

## New RLS Policy — documents Table

| Policy Name | Command | Expression |
|-------------|---------|------------|
| VP can update documents | UPDATE | `is_vp(auth.uid())` |

**Note:** Secretary cannot update documents (view/insert only).

---

## New Trigger — cases Table

| Trigger Name | Function | Event |
|--------------|----------|-------|
| validate_case_reopen_trigger | `validate_case_reopen()` | BEFORE UPDATE |

**Function Logic:**
- `closed` → `reopened`: VP-only (exception if non-VP)
- `reopened` → `closed`: VP-only (exception if non-VP)

---

## Validation Checklist

| Test | Role | Action | Result |
|------|------|--------|--------|
| document_links SELECT | VP | Query | PASS ✓ |
| document_links SELECT | Secretary | Query | PASS ✓ |
| document_links SELECT | Protocol | Query | DENIED ✓ |
| document_links INSERT | VP | Insert | PASS ✓ |
| document_links INSERT | Secretary | Insert | PASS ✓ |
| document_links INSERT | Protocol | Insert | DENIED ✓ |
| document_links UPDATE | VP | Update | PASS ✓ |
| document_links UPDATE | Secretary | Update | DENIED ✓ |
| document_links DELETE | VP | Delete | PASS ✓ |
| document_links DELETE | Secretary | Delete | DENIED ✓ |
| documents UPDATE | VP | Update | PASS ✓ |
| documents UPDATE | Secretary | Update | DENIED ✓ |
| Case re-open trigger | — | Exists | PASS ✓ |
| validate_case_reopen function | — | Exists | PASS ✓ |
| Linter | — | No issues | PASS ✓ |

**All 15 checks: PASS**

---

## v1.0 Impact Assessment

| Aspect | Impact |
|--------|--------|
| Existing RLS policies | UNCHANGED |
| Existing triggers | UNCHANGED |
| Case list functionality | UNCHANGED |
| Case detail functionality | UNCHANGED |
| Document view/insert | UNCHANGED |
| Protocol isolation | PRESERVED |

---

## Rollback Instructions

If rollback required:
```sql
-- Remove document_links policies
DROP POLICY IF EXISTS "VP/Secretary can view document links" ON public.document_links;
DROP POLICY IF EXISTS "VP/Secretary can insert document links" ON public.document_links;
DROP POLICY IF EXISTS "VP can update document links" ON public.document_links;
DROP POLICY IF EXISTS "VP can delete document links" ON public.document_links;

-- Remove documents UPDATE policy
DROP POLICY IF EXISTS "VP can update documents" ON public.documents;

-- Remove case re-open trigger and function
DROP TRIGGER IF EXISTS validate_case_reopen_trigger ON public.cases;
DROP FUNCTION IF EXISTS public.validate_case_reopen();
```

---

## Phase B Deliverables

- [x] Pre-execution restore point created
- [x] 4 document_links RLS policies created
- [x] 1 documents UPDATE policy created
- [x] validate_case_reopen() function created
- [x] validate_case_reopen_trigger created
- [x] Validation checklist completed (15/15 PASS)
- [x] Post-execution restore point created

---

**Phase B complete. Await Phase C authorization.**
