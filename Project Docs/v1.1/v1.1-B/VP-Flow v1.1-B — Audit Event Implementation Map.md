# VP-Flow v1.1-B — Audit Event Implementation Map

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-B (Knowledge & Insight — Notes Module)
**Document Type:** Audit & Traceability Specification
**Status:** DRAFT — DOCUMENTATION ONLY (NO EXECUTION)

---

## 1. Purpose of This Document

This document defines the **mandatory audit events, structure, and safeguards** for the **Notes Module** in **VP-Flow v1.1-B**. Its purpose is to:

- Guarantee executive-level traceability
- Preserve legal and operational integrity
- Prevent sensitive note content leakage via audit logs

No implementation is authorized through this document.

---

## 2. Binding References

This audit map is governed by:

1. VP-Flow v1.1-B — Notes Module (Functional Scope & Governance)
2. VP-Flow v1.1-B — Notes Data Model & Relationships
3. VP-Flow v1.1-B — Notes RLS & Privacy Model
4. VP-Flow v1.1-B — RLS Policy Extension Matrix (DOC B8)
5. VP-Flow v1.1-B — Execution Plan (DOC B6)

In case of conflict, **privacy and RLS documents override audit verbosity**.

---

## 3. Audit Principles (Non-Negotiable)

- Audit logs are **append-only**
- Audit logs never store full note content
- Audit logs must not weaken RLS guarantees
- All VP note actions are traceable

---

## 4. Audited Entities

Audit coverage applies to:

- `notes`
- `note_links`

No other entities are in scope.

---

## 5. Audit Event Catalog

### 5.1 Notes Events

| Event Code | Trigger |
|----------|--------|
| note_created | New note inserted |
| note_updated | Note content or title updated |
| note_deleted | Soft delete applied |
| note_restored | Soft delete reversed (if allowed later) |

---

### 5.2 Note Linking Events

| Event Code | Trigger |
|-----------|--------|
| note_linked | Note linked to entity |
| note_unlinked | Note unlinked from entity |

---

## 6. Audit Payload Structure

Each audit record must include:

| Field | Description |
|------|-------------|
| event_code | One of the defined audit events |
| entity_type | notes / note_links |
| entity_id | UUID of affected record |
| actor_user_id | VP user ID |
| actor_role | Vice President |
| timestamp | Event timestamp |

---

## 7. Explicitly Excluded From Audit Payload

To prevent sensitive leakage, the following must **never** be stored in audit logs:

- Note content
- Note title text
- Linked entity identifiers beyond UUID

---

## 8. Visibility of Audit Records

| Role | Audit Visibility |
|------|------------------|
| Vice President | Full visibility |
| Secretary | No access |
| Protocol | No access |

Audit data may not be surfaced in dashboards or reports for non-VP roles.

---

## 9. Failure & Risk Scenarios

### 9.1 Risk: Sensitive Content Leakage

Mitigation:
- Strict payload allowlist
- No text fields in audit payload

### 9.2 Risk: Missing Audit Coverage

Mitigation:
- Mandatory audit hooks on all write operations

---

## 10. Validation Checklist

Before execution is approved:

- All events fire correctly
- No sensitive content logged
- Audit is append-only
- Audit respects RLS boundaries

---

## 11. Status

**Current State:** Audit event map prepared
**Next Action:** Prepare DOC B10 — UI Scope & Interaction Rules

---

**Await Further Instructions.**

