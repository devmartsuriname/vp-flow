# VP-Flow v1.1-B — Notes Data Model & Relationships

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-B (Knowledge & Insight)
**Document Type:** Live Data Model Specification
**Status:** DRAFT — DOCUMENTATION ONLY (NO EXECUTION)

---

## 1. Purpose of This Document

This document defines the **conceptual data model and relationships** for the **Notes Module** in **VP-Flow v1.1-B**. It translates the functional scope defined in **DOC B1** into a structured, auditable, and governable data foundation.

No database migration or implementation is authorized through this document.

---

## 2. Binding References

This document must be read together with:

1. VP-Flow v1.1-B — Notes Module (Functional Scope & Governance)
2. VP-Flow v1.1 — Functional Expansion & Platform Evolution
3. VP-Flow v1.1 — Epic Prioritization & Phasing
4. VP-Flow v1.1 — Scope Boundary & v1.0 vs v1.1 Matrix

In case of conflict, **DOC B1** is authoritative for scope.

---

## 3. Data Modeling Principles

- Notes are **first-class entities**, separate from cases and documents
- Notes are **owned by a single creator**
- Notes may be linked to **one and only one** primary entity
- All deletions are **soft deletes**
- The model must support **auditability** without bloating core entities

---

## 4. Core Table — `notes`

### 4.1 Purpose

Stores the core content and metadata of each note.

### 4.2 Conceptual Schema

| Column | Type | Notes |
|------|------|------|
| id | uuid (PK) | Generated server-side |
| title | text | Optional |
| content | text | Required |
| owner_user_id | uuid | Creator (VP) |
| owner_role | enum | VP |
| is_deleted | boolean | Soft delete flag |
| created_at | timestamp | Server-generated |
| updated_at | timestamp | Updated on edit |

---

## 5. Relationship Table — `note_links`

### 5.1 Purpose

Defines the optional linkage between a note and a single domain entity.

### 5.2 Conceptual Schema

| Column | Type | Notes |
|------|------|------|
| id | uuid (PK) | Generated server-side |
| note_id | uuid (FK) | References notes.id |
| entity_type | enum | guest / appointment / case |
| entity_id | uuid | Target entity |
| linked_at | timestamp | Server-generated |

---

## 6. Relationship Rules

- A note may have **zero or one** `note_links` record
- Multiple links per note are **not allowed**
- Entity types are mutually exclusive
- Unlinking a note deletes the `note_links` record only

---

## 7. Interaction With Other Modules

### 7.1 Guests

- Notes may be linked to a Guest
- Deleting a Guest does **not** delete linked notes

### 7.2 Appointments

- Notes may be linked to an Appointment
- Appointment lifecycle does not affect notes

### 7.3 Cases

- Notes may be linked to a Case
- Case closure does not restrict note editing

---

## 8. Audit Considerations (Conceptual)

The following actions must be auditable:

- Note creation
- Note edit
- Note deletion (soft)
- Note link
- Note unlink

Audit payload must include note_id and entity context where applicable.

---

## 9. Explicit Exclusions

The following are intentionally excluded:

- Attachments in notes
- Multiple entity links
- Version history beyond audit log
- Rich content blocks (drawings, files)

---

## 10. Data Retention & Cleanup (Deferred)

- Retention policy for deleted notes is not defined in v1.1-B
- Permanent purge rules require separate approval

---

## 11. Readiness for Next Step

This document enables preparation of:

- DOC B3 — Notes RLS & Privacy Model

No further data modeling is required before RLS definition.

---

## 12. Status

**Current State:** Draft
**Next Action:** Prepare DOC B3 — Notes RLS & Privacy Model

---

**Await Further Instructions.**

