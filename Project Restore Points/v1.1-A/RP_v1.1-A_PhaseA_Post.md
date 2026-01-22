# VP-FLOW v1.1-A — Phase A Post-Execution Restore Point

**Created:** 2026-01-22  
**Purpose:** Baseline snapshot after Phase A (Database Foundation) completion  
**Status:** Phase A COMPLETE — Await Phase B authorization

---

## Validation Checklist

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| case_status enum has 6 values | 6 | 6 | ✅ PASS |
| case_status includes 'reopened' | Yes | Yes | ✅ PASS |
| audit_action enum has 13 values | 13 | 13 | ✅ PASS |
| document_entity_type has 4 values | 4 | 4 | ✅ PASS |
| documents.title column exists | Yes | Yes | ✅ PASS |
| documents.description column exists | Yes | Yes | ✅ PASS |
| documents.owner_role column exists | Yes | Yes | ✅ PASS |
| documents.is_active column exists | Yes | Yes | ✅ PASS |
| document_links table exists | Yes | Yes | ✅ PASS |
| document_links has 6 columns | 6 | 6 | ✅ PASS |
| prevent_closed_case_update allows reopened | Yes | Yes | ✅ PASS |
| TypeScript constants updated | Yes | Yes | ✅ PASS |

---

## Final Enum States

### case_status (6 values)
| Value | Order | NEW |
|-------|-------|-----|
| draft | 1 | |
| open | 2 | |
| in_progress | 3 | |
| parked | 4 | |
| closed | 5 | |
| reopened | 6 | ✅ |

### audit_action (13 values)
| Value | Order | NEW |
|-------|-------|-----|
| create | 1 | |
| update | 2 | |
| status_change | 3 | |
| pdf_generate | 4 | |
| priority_change | 5 | |
| deadline_change | 6 | |
| case_reopened | 7 | ✅ |
| case_reopen_edit | 8 | ✅ |
| case_reclosed | 9 | ✅ |
| document_linked | 10 | ✅ |
| document_viewed | 11 | ✅ |
| document_downloaded | 12 | ✅ |
| document_deactivated | 13 | ✅ |

### document_entity_type (4 values)
| Value | Order | NEW |
|-------|-------|-----|
| case | 1 | |
| guest | 2 | ✅ |
| appointment | 3 | ✅ |
| none | 4 | ✅ |

---

## Final documents Table Schema

| Column | Type | Nullable | Default | NEW |
|--------|------|----------|---------|-----|
| id | uuid | NO | gen_random_uuid() | |
| entity_type | document_entity_type | NO | 'case' | |
| entity_id | uuid | NO | - | |
| file_name | text | NO | - | |
| file_path | text | NO | - | |
| file_size | integer | YES | - | |
| mime_type | text | YES | - | |
| uploaded_at | timestamptz | NO | now() | |
| uploaded_by | uuid | YES | - | |
| title | text | YES | - | ✅ |
| description | text | YES | - | ✅ |
| owner_role | text | YES | - | ✅ |
| is_active | boolean | NO | true | ✅ |

---

## document_links Table Schema (NEW)

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| document_id | uuid | NO | - (FK to documents) |
| entity_type | document_entity_type | NO | - |
| entity_id | uuid | YES | - |
| linked_by | uuid | YES | - |
| linked_at | timestamptz | NO | now() |

**Indexes:**
- idx_document_links_entity (entity_type, entity_id)
- idx_document_links_document (document_id)

**RLS:** Enabled (policies deferred to Phase B)

---

## Updated prevent_closed_case_update Trigger Function

```sql
CREATE OR REPLACE FUNCTION public.prevent_closed_case_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Allow transition from closed to reopened (VP authorization enforced by RLS)
  IF OLD.status = 'closed' AND NEW.status = 'reopened' THEN
    RETURN NEW;
  END IF;
  
  -- Block all other modifications to closed cases
  IF OLD.status = 'closed' THEN
    RAISE EXCEPTION 'Cannot modify a closed case. Case ID: %', OLD.id;
  END IF;
  
  RETURN NEW;
END;
$function$;
```

---

## Files Modified

| File | Change |
|------|--------|
| src/app/(admin)/cases/constants.ts | Added 'reopened' to STATUS_BADGE_VARIANTS and STATUS_LABELS |
| src/app/(admin)/cases/types.ts | Added 'reopened' to EDITABLE_STATUSES |
| src/app/(admin)/audit-logs/constants.ts | Added 7 new audit actions to ACTION_BADGE_VARIANTS and ACTION_LABELS |

---

## Known Deferred Items

| Item | Deferred To |
|------|-------------|
| document_links RLS policies | Phase B |
| Case re-open RLS enforcement | Phase B |
| UI components for documents | Phase D |
| Re-open button and workflow | Phase D |

---

## Rollback Instructions

If Phase B or later fails:
1. This Phase A state is the baseline
2. document_links table may be dropped if not yet populated
3. Enum values cannot be removed (Postgres limitation)
4. Trigger can be reverted to previous version from Pre restore point

---

**PHASE A STATUS: COMPLETE**

**NEXT AUTHORIZED ACTION: Phase B (RLS Policy Extensions)**

---

**END OF POST-EXECUTION RESTORE POINT**
