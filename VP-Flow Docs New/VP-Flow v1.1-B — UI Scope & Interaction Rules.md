# VP-Flow v1.1-B — UI Scope & Interaction Rules

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-B (Knowledge & Insight — Notes Module)
**Document Type:** UI Governance & Interaction Specification
**Status:** DRAFT — DOCUMENTATION ONLY (NO EXECUTION)

---

## 1. Purpose of This Document

This document defines the **allowed UI surfaces, interactions, and prohibitions** for the **Notes Module** in **VP-Flow v1.1-B**. Its purpose is to:

- Prevent UI-driven scope creep
- Ensure strict alignment with RLS and audit rules
- Guarantee that UI never introduces authority beyond backend controls

No implementation is authorized through this document.

---

## 2. Binding References

This document is governed by:

1. VP-Flow v1.1-B — Notes Module (Functional Scope & Governance)
2. VP-Flow v1.1-B — Notes Data Model & Relationships
3. VP-Flow v1.1-B — Notes RLS & Privacy Model
4. VP-Flow v1.1-B — RLS Policy Extension Matrix (DOC B8)
5. VP-Flow v1.1-B — Audit Event Implementation Map (DOC B9)
6. VP-Flow v1.1-B — Dashboard Widgets (Read-Only Rules)

In case of conflict, **RLS and Privacy documents are authoritative**.

---

## 3. UI Access Rules (Non-Negotiable)

- Notes UI is **visible only to the Vice President**
- UI must never expose data not permitted by RLS
- UI must not imply sharing, collaboration, or delegation

---

## 4. Allowed UI Surfaces

### 4.1 Notes Module — List View

**Allowed:**
- List of notes (own notes only)
- Title (if present)
- Last updated timestamp
- Link indicator icon

**Prohibited:**
- Filters
- Search
- Bulk actions

---

### 4.2 Notes Module — Detail View

**Allowed:**
- View full note content
- Edit note title and content
- Soft delete note
- Link / unlink to Guest, Appointment, or Case (single link)

**Prohibited:**
- Attachments
- Sharing controls
- Version history UI

---

### 4.3 Notes Module — Create Flow

**Allowed:**
- Create new note
- Optional title
- Content editor (plain text)

**Prohibited:**
- Templates
- Rich formatting
- Voice or pen input

---

## 5. Dashboard Interaction Rules

Dashboard widgets are governed separately and must adhere to:

- Read-only interaction
- Navigation only to Notes Module
- No inline editing or creation

---

## 6. Navigation & Entry Points

**Permitted Entry Points:**
- Main navigation: Notes
- Dashboard widget click-through
- Contextual links from Guest / Appointment / Case detail pages (VP-only)

**Prohibited Entry Points:**
- Global search
- Quick actions
- Keyboard shortcuts creating notes

---

## 7. Error Handling & Edge Cases

- Unauthorized access attempts must:
  - Render no UI
  - Fail silently or show access denied

- Deleted notes:
  - Must not appear in lists
  - May not be restored via UI (unless explicitly approved later)

---

## 8. Explicitly Forbidden UI Patterns

The following patterns are **not allowed**:

- Inline note previews in other modules
- Drag-and-drop linking
- Multi-note views
- Pins, stars, or prioritization

---

## 9. Validation Checklist

Before execution approval:

- Notes UI visible only to VP
- No prohibited UI elements present
- All actions generate audit events
- UI does not bypass RLS

---

## 10. Status

**Current State:** UI scope defined
**Next Action:** Prepare DOC B11 — Execution Checklist & Restore Points

---

**Await Further Instructions.**

