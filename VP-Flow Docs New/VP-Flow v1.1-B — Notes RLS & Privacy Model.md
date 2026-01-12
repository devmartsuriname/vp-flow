# VP-Flow v1.1-B — Notes RLS & Privacy Model

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-B (Knowledge & Insight)
**Document Type:** Live Security, Privacy & Access Control Specification
**Status:** DRAFT — DOCUMENTATION ONLY (NO EXECUTION)

---

## 1. Purpose of This Document

This document defines the **Row Level Security (RLS) rules and privacy guarantees** for the **Notes Module** in **VP-Flow v1.1-B**. Its purpose is to ensure that notes:

- Remain strictly private to the Vice President
- Cannot be accessed, inferred, or leaked to other roles
- Do not weaken existing security boundaries

No implementation is authorized through this document.

---

## 2. Binding References

This document must be read together with:

1. VP-Flow v1.1-B — Notes Module (Functional Scope & Governance)
2. VP-Flow v1.1-B — Notes Data Model & Relationships
3. VP-Flow v1.1 — Functional Expansion & Platform Evolution
4. VP-Flow v1.1 — Epic Prioritization & Phasing
5. VP-Flow v1.1 — Scope Boundary & v1.0 vs v1.1 Matrix

In case of conflict, **DOC B1** governs functional intent.

---

## 3. Privacy Principles (Non-Negotiable)

- Notes are **private executive artifacts**
- Notes are **not shared by default**
- Notes visibility does **not inherit** from linked entities
- No role other than VP may access notes

---

## 4. Roles in Scope

| Role | Description |
|----|-------------|
| Vice President | Sole authorized notes user |
| Secretary | Explicitly excluded |
| Protocol | Explicitly excluded |

No future role expansion is implied.

---

## 5. RLS Rules — `notes` Table

### 5.1 Access Matrix

| Action | Vice President | Secretary | Protocol |
|------|----------------|-----------|----------|
| Select | Allow (own notes only) | Deny | Deny |
| Insert | Allow | Deny | Deny |
| Update | Allow (own notes only) | Deny | Deny |
| Soft Delete | Allow (own notes only) | Deny | Deny |

Ownership is enforced via `owner_user_id`.

---

### 5.2 Ownership Enforcement

- A note is visible only if:
  - `owner_user_id = auth.uid()`
- Role checks are mandatory in all policies

---

## 6. RLS Rules — `note_links` Table

### 6.1 Access Matrix

| Action | Vice President | Secretary | Protocol |
|------|----------------|-----------|----------|
| Select | Allow (linked to own notes) | Deny | Deny |
| Insert | Allow | Deny | Deny |
| Delete | Allow | Deny | Deny |

---

### 6.2 Isolation From Parent Entities

- Access to Guests, Appointments, or Cases does **not** grant access to notes
- Notes remain private even when linked

---

## 7. Cross-Module Privacy Guarantees

- Notes are excluded from:
  - Global search
  - Reports
  - Exports
  - Secretary dashboards

- No joins may expose notes indirectly

---

## 8. Audit Considerations

The following actions must be auditable:

- Note creation
- Note update
- Note deletion
- Note link / unlink

Audit visibility:
- VP: full visibility
- Secretary / Protocol: none

Audit records must not expose note content to unauthorized roles.

---

## 9. Failure & Risk Scenarios

### 9.1 Risk: Accidental Exposure via UI

Mitigation:
- UI elements rendered only for VP
- Backend RLS enforces final authority

### 9.2 Risk: Leakage via Linked Entities

Mitigation:
- No inheritance of visibility
- Strict join constraints

---

## 10. Explicit Exclusions

The following are intentionally excluded from v1.1-B:

- Shared notes
- Delegated access
- Team notes
- External note export

---

## 11. Readiness for Next Step

This document enables preparation of:

- DOC B4 — Dashboard Widgets (Read-Only Rules)

UI documentation must comply strictly with this privacy model.

---

## 12. Status

**Current State:** Draft
**Next Action:** Prepare DOC B4 — Dashboard Widgets (Read-Only Rules)

---

**Await Further Instructions.**