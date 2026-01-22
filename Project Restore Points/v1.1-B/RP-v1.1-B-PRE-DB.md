# Restore Point: v1.1-B Phase A (B6.1) — Pre-Execution

**Created:** 2026-01-22
**Phase:** B6.1 — Database Foundation
**Status:** PRE-EXECUTION

---

## Context

- v1.0: FROZEN
- v1.1-A: FROZEN
- v1.1-B Phase A: AUTHORIZED

---

## Database State Before Migration

### Existing Tables (MUST REMAIN UNCHANGED)
- appointments
- appointment_attendees
- audit_events
- cases
- clients
- documents
- document_links
- notifications
- protocol_events
- reminders
- user_profiles
- user_roles

### Existing Enums (MUST REMAIN UNCHANGED except audit_action extension)
- app_role
- appointment_status
- appointment_visibility
- audit_action (to be extended)
- case_priority
- case_status
- client_type
- document_entity_type
- protocol_status
- reminder_channel
- reminder_type

---

## Planned Changes

### New Enum
- `note_entity_type` (guest, appointment, case)

### New Tables
- `notes` (id, owner_user_id, title, content, created_at, updated_at, deleted_at)
- `note_links` (id, note_id, entity_type, entity_id, created_at)

### Enum Extension
- `audit_action` + note_created, note_updated, note_deleted, note_linked, note_unlinked

### Indexes
- idx_notes_owner_user_id
- idx_notes_deleted_at
- idx_note_links_note_id
- idx_note_links_entity

---

## Rollback Strategy

```sql
-- Rollback (if needed)
DROP TRIGGER IF EXISTS update_notes_updated_at ON public.notes;
DROP TABLE IF EXISTS public.note_links;
DROP TABLE IF EXISTS public.notes;
DROP TYPE IF EXISTS public.note_entity_type;
-- Note: audit_action enum values cannot be removed in PostgreSQL
```

---

## Guardian Compliance

- [ ] No v1.0 table modifications
- [ ] No RLS policies (Phase B6.2)
- [ ] No UI changes (Phase B6.4)
- [ ] Sequential phase execution enforced
