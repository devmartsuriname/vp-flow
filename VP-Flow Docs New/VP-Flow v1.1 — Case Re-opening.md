# VP-Flow v1.1 — Case Re-opening

**Subtitle:** Workflow, Audit & RLS

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Document Type:** Live Technical & Governance Design Document (v1.1)
**Status:** DRAFT — DOCUMENTATION ONLY

---

## 1. Purpose of This Document

This document defines the controlled **Case Re-opening capability** for VP-Flow v1.1. It specifies:

- The **case lifecycle workflow changes**
- The **audit requirements** for re-opening
- The **Row Level Security (RLS) implications**

This capability was intentionally excluded from v1.0 and is introduced in v1.1 to address operational needs of the Vice President while preserving audit integrity.

No implementation is authorized through this document.

---

## 2. Governance Principles (Non-Negotiable)

- Closed cases remain **final by default**
- Re-opening is an **exceptional, VP-only action**
- Original closure data is **immutable**
- All re-open actions are **explicitly audited**
- No case deletion is introduced

---

## 3. Current v1.0 Case Lifecycle (Reference)

The existing case lifecycle in v1.0 is:

`Draft → Open → In Progress / Parked → Closed`

In v1.0:
- `Closed` is a terminal state
- No edits are permitted after closure

---

## 4. Proposed v1.1 Case Lifecycle Extension

### 4.1 New State Introduction

A new explicit state is introduced:

`Closed → Reopened`

- `Reopened` is **not** equivalent to `Open`
- It indicates a post-closure modification context

---

### 4.2 Allowed State Transitions

| From | To | Role |
|----|----|------|
| Closed | Reopened | Vice President only |
| Reopened | In Progress | Vice President only |
| Reopened | Closed | Vice President only |

No other transitions are permitted.

---

## 5. Edit Permissions in Reopened State

While a case is in `Reopened` state:

- VP may:
  - Edit case title
  - Edit description
  - Edit priority
  - Edit deadlines
  - Add notes
  - Attach documents

- VP may **not**:
  - Delete the case
  - Modify original closure timestamp
  - Remove historical audit entries

Secretary and Protocol retain **read-only** access according to existing permissions.

---

## 6. Audit Events (Mandatory)

All audit events are append-only and immutable.

### 6.1 New Audit Events

| Event | Trigger |
|-----|--------|
| case_reopened | VP transitions case from Closed → Reopened |
| case_reopen_edit | Any modification while in Reopened state |
| case_reclosed | VP transitions Reopened → Closed |

---

### 6.2 Audit Payload (Minimum)

Each event must capture:
- event_type
- timestamp
- user_id
- role
- case_id
- previous_state
- new_state
- summary of change (where applicable)

---

## 7. RLS Policy Impact (Conceptual)

### 7.1 Role-Based Rules

| Role | Reopen | Edit After Reopen | View |
|----|--------|------------------|------|
| Vice President | Yes | Yes | Yes |
| Secretary | No | No | Yes |
| Protocol | No | No | No |

---

### 7.2 Data Visibility Rules

- Reopened cases remain visible only to roles that had access prior to closure
- No expanded visibility is introduced by re-opening

---

## 8. Safeguards & Constraints

- Optional governance rule: limit number of re-open actions per case
- Optional warning banner when editing reopened cases
- Optional justification field for re-open action (text, audited)

These options require explicit approval.

---

## 9. Out-of-Scope (Explicit)

- Automatic re-opening
- Bulk re-open actions
- Re-opening by non-VP roles
- Removal or alteration of historical data

---

## 10. Authorization Requirements

Before any implementation:

- Approval of lifecycle changes
- Approval of audit event definitions
- Approval of RLS implications
- Phase gate authorization
- Restore point creation

---

## 11. Status

**Current State:** Draft
**Next Action:** Governance review and acceptance

---

**Await Further Instructions.**

