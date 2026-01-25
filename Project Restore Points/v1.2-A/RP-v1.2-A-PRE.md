# VP-Flow v1.2-A Pre-Execution Restore Point

## Document Metadata

| Field | Value |
|-------|-------|
| **Project** | VP-Flow |
| **Phase** | v1.2-A |
| **Restore Point** | RP-v1.2-A-PRE |
| **Created** | 2026-01-25 |
| **Purpose** | Pre-execution baseline for notification triggers |

---

## Current State Summary

### Database State

#### Notifications Table
- **Status:** EXISTS
- **Columns:** id, user_id, title, message, link, is_read, read_at, created_at
- **RLS:** Owner-only SELECT and UPDATE
- **Triggers:** NONE (manual inserts only)

#### Audit Action Enum
Current values:
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
- note_created
- note_updated
- note_deleted
- note_linked
- note_unlinked

**Missing:** notification_created, notification_read

#### Existing Triggers (No Changes Expected)
- `trigger_audit_case` on cases
- `trigger_audit_appointment` on appointments
- `trigger_audit_document` on documents
- `trigger_audit_document_link` on document_links
- `trigger_audit_note` on notes
- `trigger_audit_note_link` on note_links
- `trigger_prevent_closed_case_update` on cases
- `trigger_validate_case_reopen` on cases

### UI State

#### TopNavigationBar Notifications Component
- **File:** `src/components/layout/TopNavigationBar/components/Notifications.tsx`
- **Status:** FUNCTIONAL
- **Features:** Dropdown with unread badge, mark as read, view all link

#### Notifications Page
- **File:** `src/app/(admin)/notifications/page.tsx`
- **Status:** FUNCTIONAL
- **Features:** Full list, filters, mark as read, mark all as read

#### Notification Hooks
- `useNotifications` — Fetch with status filter
- `useUnreadCount` — Badge counter
- `useMarkAsRead` — Single notification
- `useMarkAllAsRead` — Bulk action

---

## Rollback Instructions

If v1.2-A execution fails, restore to this state by:

1. Dropping any created triggers:
   - `trigger_notify_case_status_change`
   - `trigger_notify_case_reopened`
   - `trigger_notify_appointment_status`
   - `trigger_notify_document_uploaded`
   - `trigger_audit_notification_events`

2. Dropping any created functions:
   - `get_vp_user_id()`
   - `notify_case_status_change()`
   - `notify_case_reopened()`
   - `notify_appointment_status_change()`
   - `notify_document_uploaded()`
   - `audit_notification_events()`

3. Note: Enum values cannot be removed once added

---

## Verification Checklist

- [x] Notifications table exists
- [x] Notifications RLS policies in place
- [x] UI components functional
- [x] Hooks operational
- [x] No automated triggers exist (baseline)

---

## Sign-Off

**Status:** BASELINE CAPTURED
**Next Action:** Execute v1.2-A migration
