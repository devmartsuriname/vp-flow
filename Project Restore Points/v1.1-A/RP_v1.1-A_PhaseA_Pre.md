# VP-FLOW v1.1-A — Phase A Pre-Execution Restore Point

**Created:** 2026-01-22  
**Purpose:** Baseline snapshot before Phase A (Database Foundation) execution  
**Status:** v1.0 FROZEN — Additive changes only

---

## Current Enum States

### case_status (5 values)
| Value | Order |
|-------|-------|
| draft | 1 |
| open | 2 |
| in_progress | 3 |
| parked | 4 |
| closed | 5 |

### audit_action (6 values)
| Value | Order |
|-------|-------|
| create | 1 |
| update | 2 |
| status_change | 3 |
| pdf_generate | 4 |
| priority_change | 5 |
| deadline_change | 6 |

### document_entity_type (1 value)
| Value | Order |
|-------|-------|
| case | 1 |

---

## Current documents Table Schema

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | NO | gen_random_uuid() |
| entity_type | document_entity_type | NO | 'case' |
| entity_id | uuid | NO | - |
| file_name | text | NO | - |
| file_path | text | NO | - |
| file_size | integer | YES | - |
| mime_type | text | YES | - |
| uploaded_at | timestamptz | NO | now() |
| uploaded_by | uuid | YES | - |

---

## Current prevent_closed_case_update Trigger Function

```sql
CREATE OR REPLACE FUNCTION public.prevent_closed_case_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF OLD.status = 'closed' THEN
    RAISE EXCEPTION 'Cannot modify a closed case. Case ID: %', OLD.id;
  END IF;
  RETURN NEW;
END;
$function$;
```

---

## document_links Table

**Status:** DOES NOT EXIST (to be created in Phase A)

---

## Rollback Instructions

If Phase A fails, restore to this state:
1. Enum values remain as documented above
2. documents table columns remain as documented above
3. prevent_closed_case_update function remains unchanged
4. document_links table should not exist

---

## Phase A Planned Changes

1. Add `reopened` to case_status enum
2. Add 7 new values to audit_action enum
3. Add `guest`, `appointment`, `none` to document_entity_type enum
4. Add `title`, `description`, `owner_role`, `is_active` columns to documents table
5. Create document_links table
6. Update prevent_closed_case_update to allow closed→reopened transition

---

**END OF PRE-EXECUTION RESTORE POINT**
