# Restore Point: v1.3-C PRE-Execution
**Date:** 2026-01-25
**Phase:** v1.3-C — Notifications Deepening
**Status:** PRE-EXECUTION

## Baseline
- v1.0, v1.1-A/B/C, v1.2, v1.3-A, v1.3-B: ALL FROZEN

## Objective
Extend internal notifications with:
- Notification category system (case, appointment, document, system)
- New triggers: case_assigned, document_status_changed
- Update notify_case_reopened to include Secretary recipients
- UI category badges in table and TopNav dropdown

## State Before Execution

### Database
- `notifications` table: NO `category` column
- `notification_category` enum: DOES NOT EXIST
- `get_secretary_user_ids()` function: DOES NOT EXIST
- `notify_case_assigned` trigger: DOES NOT EXIST
- `notify_document_status_changed` trigger: DOES NOT EXIST
- `notify_case_reopened`: VP-only (no Secretary)

### UI Components
- `NotificationCategoryBadge.tsx`: DOES NOT EXIST
- `NotificationsTable.tsx`: No category column
- `TopNavigationBar/Notifications.tsx`: Generic bell icon only

### Files to Create
- `src/app/(admin)/notifications/components/NotificationCategoryBadge.tsx`

### Files to Modify
- `src/app/(admin)/notifications/types.ts`
- `src/app/(admin)/notifications/components/NotificationsTable.tsx`
- `src/app/(admin)/notifications/components/index.ts`
- `src/components/layout/TopNavigationBar/components/Notifications.tsx`

## Rollback
Revert to this point if v1.3-C introduces regressions or breaks existing notification functionality.
