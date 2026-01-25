# VP-Flow v1.2 — RLS & Audit Impact Summary

## Document Metadata
| Field | Value |
|-------|-------|
| **Project** | VP-Flow |
| **Document Type** | Impact Assessment |
| **Version** | v1.2 |
| **Status** | APPROVED |
| **Created** | 2026-01-25 |

---

## 1. Executive Summary

VP-Flow v1.2 introduces **minimal database changes** focused on automated notification generation. All existing RLS policies remain unchanged. Schema modifications are limited to database triggers and potential audit enum extensions.

| Impact Area | Change Level |
|-------------|--------------|
| Schema (tables/columns) | NONE |
| RLS Policies | NONE |
| Database Triggers | NEW (4 triggers) |
| Audit Enum | EXTENSION (2 values) |
| Storage Policies | NONE |

---

## 2. Schema Changes Required

### 2.1 Tables

| Table | Change | Description |
|-------|--------|-------------|
| `notifications` | NONE | Existing table sufficient |
| `cases` | NONE | No column changes |
| `appointments` | NONE | No column changes |
| `documents` | NONE | No column changes |

### 2.2 New Tables

**NONE** — No new tables required for v1.2.

### 2.3 Column Additions

**NONE** — No column additions required for v1.2.

---

## 3. RLS Policy Changes

### 3.1 Existing Policies (No Changes)

| Table | Policy | Status |
|-------|--------|--------|
| notifications | Users can view own notifications | UNCHANGED |
| notifications | Users can update own notifications | UNCHANGED |
| cases | VP/Secretary can view cases | UNCHANGED |
| cases | VP can insert cases | UNCHANGED |
| cases | VP/Secretary can update cases | UNCHANGED |
| appointments | VP/Secretary can view all appointments | UNCHANGED |
| appointments | VP/Secretary can insert appointments | UNCHANGED |
| appointments | VP/Secretary can update appointments | UNCHANGED |
| documents | VP/Secretary can view documents | UNCHANGED |
| documents | VP/Secretary can insert documents | UNCHANGED |

### 3.2 New Policies

**NONE** — No new RLS policies required for v1.2.

### 3.3 Policy Modifications

**NONE** — No RLS policy modifications required for v1.2.

---

## 4. Database Triggers (NEW)

### 4.1 Notification Generation Triggers

| Trigger Name | Table | Event | Purpose |
|--------------|-------|-------|---------|
| `trigger_notify_case_status_change` | cases | AFTER UPDATE | Generate notification on status change |
| `trigger_notify_case_reopened` | cases | AFTER UPDATE | Generate notification on reopen |
| `trigger_notify_appointment_status` | appointments | AFTER UPDATE | Generate notification on approve/reject |
| `trigger_notify_document_uploaded` | documents | AFTER INSERT | Generate notification on upload |

### 4.2 Trigger Functions

| Function Name | Security | Purpose |
|---------------|----------|---------|
| `notify_case_status_change()` | SECURITY DEFINER | Insert notifications for case status changes |
| `notify_case_reopened()` | SECURITY DEFINER | Insert notification for VP on case reopen |
| `notify_appointment_status_change()` | SECURITY DEFINER | Insert notifications for appointment approval/rejection |
| `notify_document_uploaded()` | SECURITY DEFINER | Insert notifications for document uploads |

### 4.3 Security Considerations

| Consideration | Mitigation |
|---------------|------------|
| SECURITY DEFINER bypasses RLS | Functions only INSERT to notifications table |
| Notification spam risk | Triggers are event-specific, not bulk |
| Performance impact | Minimal (single INSERT per event) |

---

## 5. Audit Event Changes

### 5.1 Existing Audit Actions (No Changes)

| Action | Entity Type | Status |
|--------|-------------|--------|
| `create` | case, appointment, document | UNCHANGED |
| `update` | case, appointment | UNCHANGED |
| `status_change` | case, appointment | UNCHANGED |
| `case_reopened` | case | UNCHANGED |
| `case_reopen_edit` | case | UNCHANGED |
| `case_reclosed` | case | UNCHANGED |
| `document_viewed` | document | UNCHANGED |
| `document_downloaded` | document | UNCHANGED |
| `document_deactivated` | document | UNCHANGED |

### 5.2 New Audit Actions (v1.2)

| Action | Entity Type | Trigger |
|--------|-------------|---------|
| `notification_created` | notification | Database trigger on INSERT |
| `notification_read` | notification | Database trigger on UPDATE (is_read change) |

### 5.3 Enum Extension Required

```sql
-- Add new audit action values
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'notification_created';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'notification_read';
```

### 5.4 Audit Trigger for Notifications

```sql
-- Optional: Log notification creation
CREATE OR REPLACE FUNCTION audit_notification_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_events (
    action,
    entity_type,
    entity_id,
    performed_by,
    new_values
  ) VALUES (
    'notification_created',
    'notification',
    NEW.id,
    NEW.user_id,  -- Recipient, not creator
    jsonb_build_object('title', NEW.title, 'message', NEW.message)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_audit_notification_created
AFTER INSERT ON notifications
FOR EACH ROW
EXECUTE FUNCTION audit_notification_created();
```

---

## 6. Storage Policy Changes

### 6.1 Existing Policies (No Changes)

| Bucket | Policy | Status |
|--------|--------|--------|
| documents | VP/Secretary can upload | UNCHANGED |
| documents | VP/Secretary can read | UNCHANGED |
| documents | VP can delete | UNCHANGED |

### 6.2 New Policies

**NONE** — No storage policy changes required for v1.2.

---

## 7. Migration Requirements

### 7.1 Migration Order

| Step | Description | Reversible |
|------|-------------|------------|
| 1 | Add audit enum values | No (enum extension) |
| 2 | Create notification trigger functions | Yes (DROP FUNCTION) |
| 3 | Create notification triggers | Yes (DROP TRIGGER) |
| 4 | Create audit trigger for notifications | Yes (DROP TRIGGER) |

### 7.2 Migration Script (Consolidated)

```sql
-- VP-Flow v1.2 Migration
-- Purpose: Add notification triggers and audit extensions

-- Step 1: Extend audit_action enum
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'notification_created';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'notification_read';

-- Step 2: Create helper function
CREATE OR REPLACE FUNCTION get_vp_user_id()
RETURNS uuid AS $$
  SELECT user_id FROM user_roles WHERE role = 'vp' LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Step 3: Create notification triggers
-- (See Notifications Technical Spec for full implementations)

-- Step 4: Create audit trigger for notifications
-- (See Section 5.4 above)
```

### 7.3 Rollback Script

```sql
-- VP-Flow v1.2 Rollback
-- WARNING: Enum values cannot be removed

-- Drop triggers
DROP TRIGGER IF EXISTS trigger_notify_case_status_change ON cases;
DROP TRIGGER IF EXISTS trigger_notify_case_reopened ON cases;
DROP TRIGGER IF EXISTS trigger_notify_appointment_status ON appointments;
DROP TRIGGER IF EXISTS trigger_notify_document_uploaded ON documents;
DROP TRIGGER IF EXISTS trigger_audit_notification_created ON notifications;

-- Drop functions
DROP FUNCTION IF EXISTS notify_case_status_change();
DROP FUNCTION IF EXISTS notify_case_reopened();
DROP FUNCTION IF EXISTS notify_appointment_status_change();
DROP FUNCTION IF EXISTS notify_document_uploaded();
DROP FUNCTION IF EXISTS audit_notification_created();
DROP FUNCTION IF EXISTS get_vp_user_id();

-- Note: audit_action enum values cannot be removed
```

---

## 8. Security Review

### 8.1 RLS Bypass Analysis

| Function | Bypasses RLS | Justification |
|----------|--------------|---------------|
| `notify_case_status_change` | Yes (SECURITY DEFINER) | Required to INSERT notifications for other users |
| `notify_appointment_status_change` | Yes (SECURITY DEFINER) | Required to INSERT notifications for other users |
| `notify_document_uploaded` | Yes (SECURITY DEFINER) | Required to INSERT notifications for other users |

### 8.2 Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Unauthorized notification insertion | Functions only triggered by legitimate DB events |
| Data leakage via notifications | Notification content uses non-sensitive data only |
| Notification spam | Event-specific triggers, no bulk operations |

### 8.3 Audit Trail Integrity

| Principle | Enforcement |
|-----------|-------------|
| All notifications logged | `trigger_audit_notification_created` |
| Read actions logged | `trigger_audit_notification_read` |
| Immutable audit log | Existing RLS prevents DELETE on audit_events |

---

## 9. Performance Considerations

### 9.1 Trigger Overhead

| Trigger | Expected Overhead |
|---------|-------------------|
| Case status change | ~5ms per status update |
| Appointment status change | ~5ms per status update |
| Document upload | ~5ms per upload |

### 9.2 Index Recommendations

| Table | Index | Exists |
|-------|-------|--------|
| notifications | `user_id` | YES |
| notifications | `is_read` | Recommended for unread count queries |
| user_roles | `role` | Recommended for VP lookup |

---

## 10. Implementation Readiness

### 10.1 Pre-Implementation Checklist

| Item | Status |
|------|--------|
| RLS impact assessed | ✓ No changes |
| Audit impact assessed | ✓ Enum extension only |
| Trigger logic reviewed | ✓ SECURITY DEFINER justified |
| Rollback plan documented | ✓ See Section 7.3 |
| Performance impact assessed | ✓ Minimal |

### 10.2 Implementation Authorization

**v1.2 database changes are APPROVED for implementation.**

No blocking issues identified.
Proceed with phase-gated execution upon explicit authorization.

---

## Cross-References

- `VP-Flow v1.2 — Scope Confirmation.md`
- `VP-Flow v1.2 — Notifications Technical Spec.md`
- `src/integrations/supabase/types.ts` — Type definitions (read-only)
- `supabase/migrations/` — Migration files (read-only)
