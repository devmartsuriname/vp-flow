# VP-Flow v1.1-A — RLS Policy Extension Matrix

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-A (Operational Control)
**Document Type:** Live Security & Access Control Document
**Status:** DRAFT — GOVERNANCE CONTROLLED

---

## 1. Purpose of This Document

This document defines the **Row Level Security (RLS) extensions** required for **VP-Flow v1.1-A**. It ensures that new capabilities (Case Re-opening and Documents Module) are enforced with **least-privilege access**, without weakening existing v1.0 security guarantees.

No implementation is authorized through this document.

---

## 2. Binding References

This matrix must be read together with:

1. VP-Flow v1.1 — Functional Expansion & Platform Evolution
2. VP-Flow v1.1 — Epic Prioritization & Phasing
3. VP-Flow v1.1 — Documents Module (Data Model, RLS & Audit)
4. VP-Flow v1.1 — Case Re-opening (Workflow, Audit & RLS)
5. VP-Flow v1.1 — Scope Boundary & v1.0 vs v1.1 Matrix
6. VP-Flow v1.1-A — Decision & Approval Record
7. VP-Flow v1.1-A — Execution Plan
8. VP-Flow v1.1-A — Database Migration Plan

---

## 3. RLS Principles (Non-Negotiable)

- **Explicit allow only** (deny-by-default)
- **Role-scoped visibility**
- **Entity-bound access**
- **No privilege escalation**
- **Protocol isolation remains absolute**

---

## 4. Roles in Scope

- Vice President (VP)
- Secretary
- Protocol

No new roles are introduced.

---

## 5. Existing v1.0 RLS (Baseline)

The following guarantees from v1.0 remain unchanged:

- Protocol cannot access cases, notes, or documents
- Secretary has no approval or lifecycle transition rights
- Closed cases are read-only for non-VP roles
- Audit logs are append-only and read-only

---

## 6. RLS Extensions — Case Lifecycle Re-opening

### 6.1 Case State Visibility

| Role | Draft | Open | In Progress | Parked | Closed | Reopened |
|------|-------|------|-------------|--------|--------|----------|
| VP | Read/Write | Read/Write | Read/Write | Read/Write | Read | Read/Write |
| Secretary | Read | Read | Read | Read | Read | Read |
| Protocol | No Access | No Access | No Access | No Access | No Access | No Access |

---

### 6.2 Case State Transitions

| Transition | VP | Secretary | Protocol |
|------------|----|-----------|----------|
| Closed → Reopened | Allow | Deny | Deny |
| Reopened → In Progress | Allow | Deny | Deny |
| Reopened → Closed | Allow | Deny | Deny |

No other transitions are permitted.

---

## 7. RLS Extensions — Documents Module

### 7.1 Document Record Access

| Role | Create | View | Download | Deactivate |
|------|--------|------|----------|------------|
| VP | Allow | Allow | Allow | Allow |
| Secretary | Allow | Allow | Allow | Deny |
| Protocol | Deny | Deny | Deny | Deny |

Deletion is not supported.

---

### 7.2 Entity-Based Document Visibility

- Documents linked to a **Guest** are visible only if the role can view that Guest
- Documents linked to a **Case** inherit case visibility
- Documents linked to an **Appointment** inherit appointment visibility
- Stand-alone documents are **VP-only**

---

## 8. Cross-Module Safeguards

- No document access via indirect joins
- No document visibility through search (search is out of scope)
- Reopened cases do not expand visibility scope

---

## 9. Audit Log RLS

- All roles: read-only access to permitted audit entries
- No role may delete or alter audit records
- Audit entries for documents and case re-open events follow the same visibility as their parent entity

---

## 10. Validation Rules

Before execution, the following must be verified:

- Protocol role cannot access any document endpoints
- Secretary cannot trigger state transitions
- VP actions are fully auditable
- v1.0 access paths remain unchanged

---

## 11. Execution Preconditions

This RLS matrix may only be implemented if:

- DOC 8 (Database Migration Plan) is approved
- This document is approved
- Restore point discipline is active

---

## 12. Status

**Current State:** Draft
**Next Action:** Prepare DOC 10 — Audit Event Implementation Map

---

**Await Further Instructions.**

