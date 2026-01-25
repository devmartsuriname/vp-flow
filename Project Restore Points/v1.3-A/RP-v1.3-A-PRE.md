# Restore Point: v1.3-A Pre-Execution
**Date:** 2026-01-25
**Phase:** v1.3-A — Documents Module Expansion
**Status:** PRE-EXECUTION

## Objective
Implement document lifecycle states and logical versioning

## Current State — documents Table Schema
```
id, entity_type, entity_id, file_name, file_path, file_size, 
mime_type, title, description, uploaded_by, uploaded_at, 
is_active, owner_role
```
Total: 13 columns

## Current State — audit_action Enum
```
create, update, status_change, pdf_generate, priority_change,
deadline_change, case_reopened, case_reopen_edit, case_reclosed,
document_linked, document_viewed, document_downloaded, document_deactivated,
note_created, note_updated, note_deleted, note_linked, note_unlinked,
notification_created, notification_read
```
Total: 20 values

## Current State — Documents RLS
- VP: Full access (view, insert, update, delete)
- Secretary: View all, insert own, update own, no delete
- Protocol: No access

## Planned Changes
1. Create `document_status` enum: draft, final, archived
2. Add columns: status, version_number, parent_document_id, is_current_version, status_changed_at, status_changed_by
3. Create triggers for status validation, version chain, audit logging
4. Extend audit_action enum with document_status_changed, document_version_created
5. Add UI components for status and versioning

## Rollback
Revert to this point if migration or implementation fails
