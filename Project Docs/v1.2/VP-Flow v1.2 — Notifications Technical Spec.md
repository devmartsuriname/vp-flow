# VP-Flow v1.2 — Notifications Technical Specification

## Document Metadata
| Field | Value |
|-------|-------|
| **Project** | VP-Flow |
| **Document Type** | Technical Specification |
| **Module** | Notifications |
| **Version** | v1.2 |
| **Status** | IMPLEMENTED — CLOSED & FROZEN |
| **Created** | 2026-01-25 |

---

## 1. Current State

| Component | Status |
|-----------|--------|
| `notifications` table | EXISTS |
| RLS (owner-only SELECT) | EXISTS |
| RLS (owner-only UPDATE) | EXISTS |
| UI (NotificationsDropdown) | EXISTS |
| UI (NotificationsPage with filters) | EXISTS |
| Mark as read | EXISTS |
| Mark all as read | EXISTS |
| Trigger-based generation | ✓ IMPLEMENTED (v1.2-A) |

---

## 2. Trigger Events (v1.2 Scope)

| Event ID | Trigger Condition | Source Table | Priority |
|----------|-------------------|--------------|----------|
| `case_status_changed` | Case status updated (any transition) | `cases` | HIGH |
| `case_deadline_approaching` | Case deadline within 3 days | `cases` | HIGH |
| `appointment_approved` | Appointment status → `approved` | `appointments` | MEDIUM |
| `appointment_rejected` | Appointment status → `rejected` | `appointments` | MEDIUM |
| `document_uploaded` | New document created | `documents` | LOW |
| `case_reopened` | Case status → `reopened` | `cases` | HIGH |

---

## 3. Recipient Rules

| Trigger Event | Recipients | Routing Logic |
|---------------|------------|---------------|
| `case_status_changed` | VP, assigned Secretary | Query `user_roles` for VP; use `assigned_to` for Secretary |
| `case_deadline_approaching` | VP, assigned Secretary | Query `user_roles` for VP; use `assigned_to` for Secretary |
| `appointment_approved` | VP, submitting Secretary | Query `user_roles` for VP; use `submitted_by` for Secretary |
| `appointment_rejected` | VP, submitting Secretary | Query `user_roles` for VP; use `submitted_by` for Secretary |
| `document_uploaded` | VP, document uploader | Query `user_roles` for VP; use `uploaded_by` |
| `case_reopened` | VP only | Query `user_roles` for VP |

### Recipient Resolution Function (Proposed)

```sql
-- Function to get VP user_id
CREATE OR REPLACE FUNCTION get_vp_user_id()
RETURNS uuid AS $$
  SELECT user_id FROM user_roles WHERE role = 'vp' LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;
```

---

## 4. Notification Content Templates

| Event | Title Template | Message Template |
|-------|----------------|------------------|
| `case_status_changed` | Case Status Updated | Case {case_number} status changed to {new_status} |
| `case_deadline_approaching` | Deadline Approaching | Case {case_number} deadline is in {days_remaining} days |
| `appointment_approved` | Appointment Approved | Appointment with {client_name} on {date} has been approved |
| `appointment_rejected` | Appointment Rejected | Appointment with {client_name} on {date} has been rejected |
| `document_uploaded` | Document Added | New document "{file_name}" uploaded to {entity_type} |
| `case_reopened` | Case Re-opened | Case {case_number} has been re-opened |

---

## 5. Read/Unread Behavior

| Behavior | Implementation | Status |
|----------|----------------|--------|
| Initial state | `is_read = false` | EXISTS |
| Mark as read | User clicks notification → `is_read = true`, `read_at = now()` | EXISTS |
| Mark all as read | Bulk update for `user_id = auth.uid()` | EXISTS |
| Auto-read on navigation | NOT IMPLEMENTED | OUT OF SCOPE |
| Unread count badge | Real-time count in TopNavigationBar | EXISTS |

---

## 6. Database Trigger Implementation (v1.2-A)

### 6.1 Case Status Change Trigger

```sql
CREATE OR REPLACE FUNCTION notify_case_status_change()
RETURNS TRIGGER AS $$
DECLARE
  v_vp_id uuid;
  v_case_number text;
BEGIN
  -- Only trigger on status change
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Get VP user_id
    SELECT user_id INTO v_vp_id FROM user_roles WHERE role = 'vp' LIMIT 1;
    
    v_case_number := NEW.case_number;
    
    -- Notify VP
    IF v_vp_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, title, message, link)
      VALUES (
        v_vp_id,
        'Case Status Updated',
        format('Case %s status changed to %s', v_case_number, NEW.status),
        format('/cases/%s', NEW.id)
      );
    END IF;
    
    -- Notify assigned Secretary (if different from VP)
    IF NEW.assigned_to IS NOT NULL AND NEW.assigned_to != v_vp_id THEN
      INSERT INTO notifications (user_id, title, message, link)
      VALUES (
        NEW.assigned_to,
        'Case Status Updated',
        format('Case %s status changed to %s', v_case_number, NEW.status),
        format('/cases/%s', NEW.id)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_case_status_change
AFTER UPDATE ON cases
FOR EACH ROW
EXECUTE FUNCTION notify_case_status_change();
```

### 6.2 Case Re-opened Trigger

```sql
CREATE OR REPLACE FUNCTION notify_case_reopened()
RETURNS TRIGGER AS $$
DECLARE
  v_vp_id uuid;
BEGIN
  -- Only trigger on reopened status
  IF OLD.status = 'closed' AND NEW.status = 'reopened' THEN
    SELECT user_id INTO v_vp_id FROM user_roles WHERE role = 'vp' LIMIT 1;
    
    IF v_vp_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, title, message, link)
      VALUES (
        v_vp_id,
        'Case Re-opened',
        format('Case %s has been re-opened', NEW.case_number),
        format('/cases/%s', NEW.id)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_case_reopened
AFTER UPDATE ON cases
FOR EACH ROW
EXECUTE FUNCTION notify_case_reopened();
```

### 6.3 Appointment Approved/Rejected Trigger

```sql
CREATE OR REPLACE FUNCTION notify_appointment_status_change()
RETURNS TRIGGER AS $$
DECLARE
  v_vp_id uuid;
  v_client_name text;
  v_title text;
  v_message text;
BEGIN
  -- Only trigger on approved or rejected
  IF NEW.status IN ('approved', 'rejected') AND OLD.status != NEW.status THEN
    SELECT user_id INTO v_vp_id FROM user_roles WHERE role = 'vp' LIMIT 1;
    
    -- Get client name
    SELECT COALESCE(
      organization_name,
      CONCAT(first_name, ' ', last_name)
    ) INTO v_client_name
    FROM clients WHERE id = NEW.client_id;
    
    IF NEW.status = 'approved' THEN
      v_title := 'Appointment Approved';
      v_message := format('Appointment with %s on %s has been approved', 
        v_client_name, NEW.scheduled_date);
    ELSE
      v_title := 'Appointment Rejected';
      v_message := format('Appointment with %s on %s has been rejected', 
        v_client_name, NEW.scheduled_date);
    END IF;
    
    -- Notify VP
    IF v_vp_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, title, message, link)
      VALUES (v_vp_id, v_title, v_message, format('/appointments/%s', NEW.id));
    END IF;
    
    -- Notify submitting Secretary
    IF NEW.submitted_by IS NOT NULL AND NEW.submitted_by != v_vp_id THEN
      INSERT INTO notifications (user_id, title, message, link)
      VALUES (NEW.submitted_by, v_title, v_message, format('/appointments/%s', NEW.id));
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_appointment_status
AFTER UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION notify_appointment_status_change();
```

### 6.4 Document Uploaded Trigger

```sql
CREATE OR REPLACE FUNCTION notify_document_uploaded()
RETURNS TRIGGER AS $$
DECLARE
  v_vp_id uuid;
  v_entity_label text;
BEGIN
  SELECT user_id INTO v_vp_id FROM user_roles WHERE role = 'vp' LIMIT 1;
  
  -- Build entity label
  v_entity_label := CASE NEW.entity_type
    WHEN 'case' THEN 'case'
    WHEN 'appointment' THEN 'appointment'
    WHEN 'guest' THEN 'guest'
    ELSE 'record'
  END;
  
  -- Notify VP
  IF v_vp_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, link)
    VALUES (
      v_vp_id,
      'Document Added',
      format('New document "%s" uploaded to %s', NEW.file_name, v_entity_label),
      format('/%ss/%s', NEW.entity_type, NEW.entity_id)
    );
  END IF;
  
  -- Notify uploader if Secretary (and not VP)
  IF NEW.uploaded_by IS NOT NULL 
     AND NEW.uploaded_by != v_vp_id 
     AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = NEW.uploaded_by AND role = 'secretary')
  THEN
    INSERT INTO notifications (user_id, title, message, link)
    VALUES (
      NEW.uploaded_by,
      'Document Uploaded',
      format('Your document "%s" has been uploaded', NEW.file_name),
      format('/%ss/%s', NEW.entity_type, NEW.entity_id)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_document_uploaded
AFTER INSERT ON documents
FOR EACH ROW
EXECUTE FUNCTION notify_document_uploaded();
```

---

## 7. Audit Logging Requirements

| Event | Audit Action | Implementation |
|-------|--------------|----------------|
| Notification created | `notification_created` | Database trigger on INSERT |
| Notification read | `notification_read` | Database trigger on UPDATE where `is_read` changes |

### Audit Enum Extension Required

```sql
-- Add new audit action values (if not exists)
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'notification_created';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'notification_read';
```

---

## 8. Explicit Exclusions

| Feature | Status | Rationale |
|---------|--------|-----------|
| Email delivery | NOT IN v1.2 | Requires external service integration |
| Push notifications | NOT IN v1.2 | Security review required |
| SMS delivery | NOT IN v1.2 | Requires external service integration |
| Notification preferences UI | NOT IN v1.2 | Removed in v1.0 polish |
| Real-time subscriptions | NOT IN v1.2 | Complexity exceeds scope |
| Deadline scheduler | NOT IN v1.2 | Requires cron/edge function |

---

## 9. RLS Policy Confirmation

| Policy | Table | Status |
|--------|-------|--------|
| `Users can view own notifications` | notifications | EXISTS — No change |
| `Users can update own notifications` | notifications | EXISTS — No change |
| No INSERT by users | notifications | CORRECT — Triggers use SECURITY DEFINER |
| No DELETE by users | notifications | CORRECT — Intentional |

---

## 10. Implementation Checklist

| Task | Phase | Status |
|------|-------|--------|
| Create `notify_case_status_change` trigger | v1.2-A | ✓ COMPLETE |
| Create `notify_case_reopened` trigger | v1.2-A | ✓ COMPLETE |
| Create `notify_appointment_status_change` trigger | v1.2-A | ✓ COMPLETE |
| Create `notify_document_uploaded` trigger | v1.2-A | ✓ COMPLETE |
| Add audit action enum values | v1.2-A | ✓ COMPLETE |
| Create notification audit triggers | v1.2-A | ✓ COMPLETE |
| Validate existing UI compatibility | v1.2-A | ✓ VERIFIED |

---

## Cross-References

- `VP-Flow v1.2 — Scope Confirmation.md`
- `VP-Flow v1.2 — RLS & Audit Impact.md`
- `src/app/(admin)/notifications/` — Existing UI implementation
