# VP-Flow v1.1-B — RLS Policy Extension Matrix

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-B (Knowledge & Insight — Notes Module)
**Document Type:** Security & Access Control Specification (RLS)
**Status:** DRAFT — DOCUMENTATION ONLY (NO EXECUTION)

---

## 1. Purpose of This Document

This document defines the **exact Row Level Security (RLS) policy extensions** required to support the **Notes Module** in **VP-Flow v1.1-B**. It ensures that:

- Notes remain **VP-only** under all circumstances
- No implicit access is granted through linked entities
- All access paths are explicitly controlled and auditable

No RLS changes may be executed based on this document alone.

---

## 2. Binding References

This matrix is governed by:

1. VP-Flow v1.1-B — Notes Module (Functional Scope & Governance)
2. VP-Flow v1.1-B — Notes Data Model & Relationships
3. VP-Flow v1.1-B — Notes RLS & Privacy Model
4. VP-Flow v1.1-B — Database Migration Plan (DOC B7)
5. VP-Flow v1.1-B — Execution Plan (DOC B6)

In case of conflict, **DOC B3 (Notes RLS & Privacy Model)** is authoritative.

---

## 3. Roles in Scope

| Role | Description |
|------|-------------|
| Vice President | Sole authorized notes user |
| Secretary | Explicitly denied |
| Protocol | Explicitly denied |

No additional roles are permitted in v1.1-B.

---

## 4. RLS Policy Matrix — `notes` Table

### 4.1 Policy Summary

- Access is restricted by **ownership** (`owner_user_id`)
- Role verification is mandatory
- Soft-deleted notes are excluded by default

---

### 4.2 Action Matrix

| Action | Vice President | Secretary | Protocol |
|------|----------------|-----------|----------|
| SELECT | Allow (own notes only) | Deny | Deny |
| INSERT | Allow (owner_user_id = auth.uid()) | Deny | Deny |
| UPDATE | Allow (own notes only) | Deny | Deny |
| DELETE (soft) | Allow (own notes only) | Deny | Deny |

---

### 4.3 Mandatory Conditions

- `owner_user_id = auth.uid()`
- `deleted_at IS NULL` (for SELECT)
- Explicit VP role check

---

## 5. RLS Policy Matrix — `note_links` Table

### 5.1 Policy Summary

- Access permitted only via ownership of the parent note
- No visibility inheritance from linked entities

---

### 5.2 Action Matrix

| Action | Vice President | Secretary | Protocol |
|------|----------------|-----------|----------|
| SELECT | Allow (linked to own notes) | Deny | Deny |
| INSERT | Allow (own notes only) | Deny | Deny |
| DELETE | Allow (own notes only) | Deny | Deny |

---

### 5.3 Mandatory Conditions

- `note_id` must reference a note owned by `auth.uid()`
- Explicit VP role check

---

## 6. Explicitly Forbidden Access Paths

The following access patterns are **not permitted**:

- Access via Guest RLS
- Access via Appointment RLS
- Access via Case RLS
- Access via JOINs without ownership checks

---

## 7. Service Role & Admin Access

- Service role access is permitted **only** for:
  - System maintenance
  - Backups
- Service role access must never be exposed via application UI

---

## 8. Validation & Testing Requirements

Before proceeding to the next phase:

- VP can perform all allowed actions
- Secretary and Protocol are denied in all cases
- Linked entities do not leak notes
- Soft-deleted notes are excluded

---

## 9. Change Control

Any modification to this matrix requires:

- Updated documentation
- Explicit approval
- New restore point

---

## 10. Status

**Current State:** RLS policy matrix defined
**Next Action:** Prepare DOC B9 — Audit Event Implementation Map

---

**Await Further Instructions.**

