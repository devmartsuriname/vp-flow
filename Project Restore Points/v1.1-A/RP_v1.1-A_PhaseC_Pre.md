# VP-Flow v1.1-A Phase C Pre-Execution Restore Point

**Created:** 2026-01-22
**Phase:** C - Audit Integration
**Status:** PRE-EXECUTION

---

## Purpose

Capture system state BEFORE Phase C audit integration changes.

---

## Current log_audit_event() Function

```sql
CREATE OR REPLACE FUNCTION public.log_audit_event()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  audit_action audit_action;
  entity_type_val TEXT;
  old_values_json JSONB := NULL;
  new_values_json JSONB := NULL;
BEGIN
  -- Determine entity type from table name
  entity_type_val := TG_TABLE_NAME;
  
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    audit_action := 'create';
    new_values_json := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    -- Check for status change
    IF TG_TABLE_NAME = 'cases' AND OLD.status IS DISTINCT FROM NEW.status THEN
      audit_action := 'status_change';
    ELSIF TG_TABLE_NAME = 'cases' AND OLD.priority IS DISTINCT FROM NEW.priority THEN
      audit_action := 'priority_change';
    ELSIF TG_TABLE_NAME = 'cases' AND OLD.deadline IS DISTINCT FROM NEW.deadline THEN
      audit_action := 'deadline_change';
    ELSIF TG_TABLE_NAME = 'appointments' AND OLD.status IS DISTINCT FROM NEW.status THEN
      audit_action := 'status_change';
    ELSE
      audit_action := 'update';
    END IF;
    old_values_json := to_jsonb(OLD);
    new_values_json := to_jsonb(NEW);
  END IF;
  
  -- Insert audit event
  INSERT INTO public.audit_events (
    entity_type,
    entity_id,
    action,
    performed_by,
    old_values,
    new_values,
    ip_address
  ) VALUES (
    entity_type_val,
    COALESCE(NEW.id, OLD.id),
    audit_action,
    auth.uid(),
    old_values_json,
    new_values_json,
    '0.0.0.0'::inet
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$
```

---

## Current Trigger Inventory

### Cases Table Triggers
- `update_cases_updated_at` - Updates timestamp
- `validate_case_reopen_trigger` - VP-only re-open enforcement (Phase B)
- `prevent_closed_case_update` - Blocks closed case modifications

### Appointments Table Triggers
- `update_appointments_updated_at` - Updates timestamp
- `audit_appointments_trigger` - Logs audit events

### Documents Table Triggers
- **NONE** (to be added in Phase C)

### Document Links Table Triggers
- **NONE** (to be added in Phase C)

---

## Current audit_action Enum Values

From database schema:
- create
- update
- status_change
- pdf_generate
- priority_change
- deadline_change
- case_reopened
- case_reopen_edit
- case_reclosed
- document_linked
- document_viewed
- document_downloaded
- document_deactivated

---

## Current Constants (src/app/(admin)/audit-logs/constants.ts)

```typescript
export const ENTITY_TYPE_OPTIONS = [
  { value: '', label: 'All Entities' },
  { value: 'appointments', label: 'Appointments' },
  { value: 'cases', label: 'Cases' },
  { value: 'clients', label: 'Clients' },
]

export const ACTION_OPTIONS: { value: AuditAction | ''; label: string }[] = [
  { value: '', label: 'All Actions' },
  { value: 'create', label: 'Created' },
  { value: 'update', label: 'Updated' },
  { value: 'status_change', label: 'Status Change' },
  { value: 'pdf_generate', label: 'PDF Generated' },
  { value: 'priority_change', label: 'Priority Change' },
  { value: 'deadline_change', label: 'Deadline Change' },
]
```

---

## Phase C Planned Changes

1. **Enhanced Case Audit Logic**
   - Detect `closed` → `reopened` as `case_reopened`
   - Detect `reopened` → `closed` as `case_reclosed`
   - Detect edits while status = `reopened` as `case_reopen_edit`

2. **Document Audit Function + Triggers**
   - INSERT → `create`
   - UPDATE with is_active false → `document_deactivated`

3. **Document Link Audit Function + Trigger**
   - INSERT → `document_linked`

4. **Constants Update**
   - Add `documents` and `document_links` to entity types
   - Add new actions to filter options

---

## Rollback Instructions

If Phase C fails, restore to this state:
1. Drop any new triggers on documents/document_links
2. Restore original `log_audit_event()` function
3. Revert constants.ts to version shown above

---

**Restore Point Status:** LOCKED
**Next Action:** Execute Phase C migrations
