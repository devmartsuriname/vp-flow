# VP-Flow v1.1-A — Audit Event Implementation Map

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-A (Operational Control)
**Document Type:** Live Audit & Compliance Specification
**Status:** DRAFT — GOVERNANCE CONTROLLED

---

## 1. Purpose of This Document

This document defines the **complete audit event map** required for **VP-Flow v1.1-A**. It ensures that every approved action introduced in v1.1-A is:

- Explicitly auditable
- Append-only and immutable
- Traceable to a user, role, entity, and timestamp

No implementation is authorized through this document.

---

## 2. Binding References

This audit map must be read together with:

1. VP-Flow v1.1 — Functional Expansion & Platform Evolution
2. VP-Flow v1.1 — Epic Prioritization & Phasing
3. VP-Flow v1.1 — Case Re-opening (Workflow, Audit & RLS)
4. VP-Flow v1.1 — Documents Module (Data Model, RLS & Audit)
5. VP-Flow v1.1 — Scope Boundary & v1.0 vs v1.1 Matrix
6. VP-Flow v1.1-A — Decision & Approval Record
7. VP-Flow v1.1-A — Execution Plan
8. VP-Flow v1.1-A — Database Migration Plan
9. VP-Flow v1.1-A — RLS Policy Extension Matrix

---

## 3. Audit Principles (Non-Negotiable)

- **Append-only** (no updates, no deletes)
- **Event-driven** (no inferred actions)
- **Actor-attributed** (user + role)
- **Entity-linked** (case, document, appointment, guest)
- **Time-accurate** (server-side timestamps)

---

## 4. Audit Event Categories

v1.1-A introduces audit events in two domains:

1. Case Lifecycle Re-opening
2. Documents Module Operations

No other audit categories are permitted in v1.1-A.

---

## 5. Case Lifecycle Re-opening — Audit Events

### 5.1 Event Map

| Event Type | Trigger | Description |
|-----------|--------|-------------|
| case_reopened | VP changes case state from Closed → Reopened | Explicit reopen action |
| case_reopen_edit | VP edits a case while in Reopened state | Any field modification |
| case_reclosed | VP changes case state from Reopened → Closed | Final re-closure |

---

### 5.2 Mandatory Payload (Case Events)

Each event must store at minimum:

- event_type
- event_timestamp
- actor_user_id
- actor_role
- case_id
- previous_state
- new_state
- change_summary (text)

---

## 6. Documents Module — Audit Events

### 6.1 Event Map

| Event Type | Trigger | Description |
|-----------|--------|-------------|
| document_uploaded | File successfully uploaded | New document created |
| document_linked | Document linked to entity | Guest / Appointment / Case |
| document_viewed | Document opened or previewed | Read access |
| document_downloaded | Document downloaded | File access |
| document_deactivated | Document marked inactive | Soft removal |

---

### 6.2 Mandatory Payload (Document Events)

Each event must store at minimum:

- event_type
- event_timestamp
- actor_user_id
- actor_role
- document_id
- entity_type (nullable)
- entity_id (nullable)
- action_context (text)

---

## 7. Cross-Cutting Audit Rules

- Viewing and downloading are **distinct events**
- Bulk actions are not permitted (1 event per action)
- Failed actions do **not** generate audit events
- System-generated actions are out of scope

---

## 8. Audit Visibility Rules

- VP: full visibility on all audit entries
- Secretary: visibility limited to entities they can access
- Protocol: no access to audit logs

Visibility must follow existing RLS inheritance rules.

---

## 9. Validation & Verification Checklist

Before execution:

- Every approved action has exactly one audit event
- No audit event can be triggered by unauthorized roles
- Audit timestamps are server-generated
- Audit records cannot be altered or deleted

---

## 10. Execution Preconditions

This audit map may only be implemented if:

- DOC 8 (Database Migration Plan) is approved
- DOC 9 (RLS Policy Extension Matrix) is approved
- This document is approved
- Restore point discipline is active

---

## 11. Status

**Current State:** Draft
**Next Action:** Prepare DOC 11 — UI Scope & Interaction Rules

---

**Await Further Instructions.**

