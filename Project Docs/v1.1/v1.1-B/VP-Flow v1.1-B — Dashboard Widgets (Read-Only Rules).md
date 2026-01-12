# VP-Flow v1.1-B — Dashboard Widgets (Read-Only Rules)

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-B (Knowledge & Insight)
**Document Type:** Live UI Governance & Read-Only Specification
**Status:** DRAFT — DOCUMENTATION ONLY (NO EXECUTION)

---

## 1. Purpose of This Document

This document defines the **governance rules and functional boundaries** for **dashboard widgets** related to the **Notes Module** in **VP-Flow v1.1-B**. It ensures that any dashboard exposure:

- Is strictly **read-only**
- Does **not** bypass RLS or privacy guarantees
- Does **not** introduce workflow or task behavior

No implementation is authorized through this document.

---

## 2. Binding References

This document must be read together with:

1. VP-Flow v1.1-B — Notes Module (Functional Scope & Governance)
2. VP-Flow v1.1-B — Notes Data Model & Relationships
3. VP-Flow v1.1-B — Notes RLS & Privacy Model
4. VP-Flow v1.1 — Epic Prioritization & Phasing
5. VP-Flow v1.1 — Scope Boundary & v1.0 vs v1.1 Matrix

In case of conflict, **DOC B3 (Notes RLS & Privacy Model)** is authoritative.

---

## 3. Dashboard Governance Principles

- Dashboard widgets are **informational only**
- No widget may introduce new actions
- Widgets must respect **role-based visibility**
- Widgets must not expose sensitive content by default

---

## 4. Roles & Visibility

| Role | Notes Widgets Visible |
|------|-----------------------|
| Vice President | Yes |
| Secretary | No |
| Protocol | No |

There is **no future expansion implied** by this visibility.

---

## 5. Allowed Widgets (v1.1-B)

### 5.1 Recent Notes Widget

**Purpose:**
- Provide quick visibility into recently created or updated notes

**Allowed Content:**
- Note title (if present)
- Last updated timestamp
- Linked entity type (icon only)

**Explicitly Excluded:**
- Note body preview beyond first line (optional)
- Linked entity identifiers (names, IDs)

---

### 5.2 Contextual Notes Widget (Today)

**Purpose:**
- Surface notes linked to:
  - Today’s appointments

**Allowed Content:**
- Note title
- Link indicator

**Explicitly Excluded:**
- Editing controls
- Creation controls

---

## 6. Interaction Rules (Strict)

- Widgets are **read-only**
- Clicking a widget item may:
  - Navigate to the full Notes Module (VP-only)

- Widgets may **not**:
  - Create notes
  - Edit notes
  - Delete notes
  - Link or unlink notes

---

## 7. Privacy & Data Minimization

- Widgets must never render full note content
- Widgets must not expose sensitive text
- All data shown must already be permitted by RLS

---

## 8. Performance & Load Constraints

- Widgets must use lightweight queries
- No joins that increase dashboard load time
- Lazy loading is preferred

---

## 9. Explicitly Forbidden Widgets

The following are **not allowed** in v1.1-B:

- Search widgets
- Notes analytics or statistics
- Pinned or starred notes widgets
- Multi-day or historical summaries

---

## 10. Validation Checklist

Before any future implementation:

- Widget visibility limited to VP
- No write-capable UI elements present
- No note content leakage
- Dashboard performance unchanged

---

## 11. Readiness for Next Step

This document enables preparation of:

- DOC B5 — Scope Boundary & Deferrals (v1.1-B)

---

## 12. Status

**Current State:** Draft
**Next Action:** Prepare DOC B5 — Scope Boundary & Deferrals

---

**Await Further Instructions.**

