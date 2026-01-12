# VP-Flow v1.1-A — UI Scope & Interaction Rules

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-A (Operational Control)
**Document Type:** Live UI Governance & Interaction Specification
**Status:** DRAFT — GOVERNANCE CONTROLLED

---

## 1. Purpose of This Document

This document defines **what the user interface may and may not expose** for **VP-Flow v1.1-A**. It enforces strict UI governance so that:

- No unapproved functionality is surfaced
- No UX-driven scope creep occurs
- UI behavior remains aligned with Database, RLS, and Audit constraints

This document authorizes **no design innovation** and **no implementation** by itself.

---

## 2. Binding References

This UI scope must be read together with:

1. VP-Flow v1.1 — Functional Expansion & Platform Evolution
2. VP-Flow v1.1 — Epic Prioritization & Phasing
3. VP-Flow v1.1-A — Decision & Approval Record
4. VP-Flow v1.1-A — Execution Plan
5. VP-Flow v1.1-A — Database Migration Plan
6. VP-Flow v1.1-A — RLS Policy Extension Matrix
7. VP-Flow v1.1-A — Audit Event Implementation Map

---

## 3. UI Governance Principles (Non-Negotiable)

- **UI reflects permissions; it never grants them**
- **Role-aware rendering only** (no hidden bypasses)
- **No bulk actions** introduced
- **No implicit actions** (every click is explicit)
- **No new navigation patterns**

---

## 4. Case Re-opening — UI Rules

### 4.1 Visibility Rules

- The **Re-open Case** action is visible **only** to the Vice President
- The action is visible **only** when case state = `Closed`
- Secretary and Protocol never see re-open controls

---

### 4.2 Interaction Rules

- Re-open requires an explicit confirmation step
- Optional justification text (if enabled) must be entered before confirmation
- Upon re-open:
  - Case state badge changes to `Reopened`
  - Visual warning banner is shown (read-only text)

No automatic transitions are permitted.

---

### 4.3 Editing While Reopened

- Standard edit controls are enabled for VP
- UI must visually indicate **"Editing a Reopened Case"**
- Secretary remains read-only

---

## 5. Documents Module — UI Rules

### 5.1 Entry Points

Documents may be accessed via:

- Case detail view (linked documents)
- Appointment detail view (linked documents)
- Guest detail view (linked documents)
- Dedicated Documents module (stand-alone documents)

No other entry points are allowed.

---

### 5.2 Upload Controls

- Upload button visible to:
  - VP
  - Secretary
- File selection must complete before submission
- Upload action must be explicit (no auto-upload)

---

### 5.3 Document Actions

| Action | VP | Secretary | Protocol |
|------|----|-----------|----------|
| View | Yes | Yes | No |
| Download | Yes | Yes | No |
| Deactivate | Yes | No | No |

Deletion controls must not exist in the UI.

---

### 5.4 Visual Indicators

- Deactivated documents are visibly marked (read-only)
- Document metadata (type, size, uploaded by, date) must be visible

---

## 6. Role-Specific UI Restrictions

### Vice President
- Full UI access for approved v1.1-A features

### Secretary
- Read-only for case lifecycle
- Limited document actions

### Protocol
- No UI exposure for cases or documents
- No navigation links to restricted modules

---

## 7. Explicitly Forbidden UI Elements

The following are **not allowed** in v1.1-A:

- Notes UI components
- Dashboard widgets beyond existing v1.0 widgets
- Search or filter components
- Drag-and-drop bulk upload
- Inline document previews beyond read-only

---

## 8. Error Handling & Messaging

- Permission errors must display generic access-denied messages
- System errors must not reveal internal logic
- Failed actions must not trigger audit events

---

## 9. Validation Checklist

Before execution:

- No UI element exposes unauthorized actions
- Role switching correctly updates UI visibility
- UI state matches backend permissions
- No v1.0 UI behavior is altered

---

## 10. Execution Preconditions

This UI scope may only be implemented if:

- DOC 8, DOC 9, and DOC 10 are approved
- Restore point discipline is active
- Execution proceeds strictly per DOC 7

---

## 11. Status

**Current State:** Draft
**Next Action:** Prepare DOC 12 — Execution Checklist & Restore Points

---

**Await Further Instructions.**

