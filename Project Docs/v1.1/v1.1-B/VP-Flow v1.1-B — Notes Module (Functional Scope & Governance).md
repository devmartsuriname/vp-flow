# VP-Flow v1.1-B — Notes Module (Functional Scope & Governance)

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-B (Knowledge & Insight)
**Document Type:** Live Functional & Governance Specification
**Status:** DRAFT — DOCUMENTATION ONLY (NO EXECUTION)

---

## 1. Purpose of This Document

This document defines the **functional scope and governance rules** for the **Notes Module** introduced in **VP-Flow v1.1-B**. It establishes clear boundaries to ensure that notes:

- Support executive memory and decision-making
- Do not weaken security, audit integrity, or role isolation
- Remain clearly distinct from cases, documents, and official records

No implementation is authorized through this document.

---

## 2. Governance Positioning

- The Notes Module is an **auxiliary knowledge layer**, not a system of record
- Notes do **not** replace:
  - Cases
  - Appointments
  - Documents
- Notes are **non-binding** and **non-official** by default
- Notes never alter workflow state or deadlines

---

## 3. Core Concepts & Definitions

### 3.1 What a Note Is

A **Note** is:
- A free-form textual annotation
- Created intentionally by a user
- Used for context, reminders, or personal insights

### 3.2 What a Note Is NOT

A Note is **not**:
- A document attachment
- A case action or decision
- An audit substitute
- A task or workflow item

---

## 4. Note Types (Functional Scope)

The Notes Module supports the following note types:

1. **Linked Notes**
   - Linked to a Guest
   - Linked to an Appointment
   - Linked to a Case

2. **Stand-alone Notes**
   - Personal notes
   - Not linked to any entity

Notes may only be linked to **one primary entity**.

---

## 5. Ownership & Visibility Model

### 5.1 Ownership

- Notes are owned by the **creator**
- Ownership does not transfer automatically

### 5.2 Visibility (High-Level)

| Role | Create | View | Edit | Delete |
|------|--------|------|------|--------|
| Vice President | Yes | Yes | Yes | Yes |
| Secretary | No | No | No | No |
| Protocol | No | No | No | No |

Notes are **VP-only** in v1.1-B.

---

## 6. Functional Capabilities

The following capabilities are in scope:

- Create a note
- Edit a note
- Delete a note (soft delete only)
- Link a note to one entity
- Unlink a note from an entity

The following are **out of scope**:

- Sharing notes
- Assigning notes to others
- Converting notes into cases or tasks

---

## 7. Lifecycle Rules

- Notes have no workflow states
- Notes do not block or trigger actions
- Deleted notes are not permanently removed (soft delete)

---

## 8. Audit & Compliance Position

- Note creation, editing, and deletion **must be auditable**
- Notes are **not** legal records
- Audit events must clearly distinguish notes from cases and documents

---

## 9. Explicit Exclusions (v1.1-B)

The following are explicitly excluded from v1.1-B:

- Rich document formatting
- Attachments inside notes
- Handwriting or pen input
- OCR or text recognition
- Global search across notes
- External integrations

---

## 10. Dependencies

This module depends on:

- Existing authentication and role model
- Guest / Appointment / Case identifiers

No dependency on Documents Module storage.

---

## 11. Open Decisions (Deferred)

- Whether notes can be exported
- Retention period for deleted notes

These require separate approval.

---

## 12. Status

**Current State:** Draft
**Next Action:** Prepare DOC B2 — Notes Data Model & Relationships

---

**Await Further Instructions.**

