# VP-Flow v1.1-A — Execution Plan

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-A (Operational Control)
**Document Type:** Live Execution Blueprint (Documentation Only)
**Status:** DRAFT — AUTHORIZED, NO IMPLEMENTATION YET

---

## 1. Purpose of This Document

This document translates the **approved v1.1-A scope** into a **controlled, execution-ready blueprint**. It defines:

- The exact execution sequence
- Domain-specific responsibilities (DB, RLS, Audit, UI)
- Mandatory checkpoints and restore points

This document does **not** authorize code execution by itself. It is a prerequisite for controlled execution via Lovable.

---

## 2. Binding References (Must Be Read Together)

1. VP-Flow v1.1 — Functional Expansion & Platform Evolution
2. VP-Flow v1.1 — Epic Prioritization & Phasing
3. VP-Flow v1.1 — Documents Module (Data Model, RLS & Audit)
4. VP-Flow v1.1 — Case Re-opening (Workflow, Audit & RLS)
5. VP-Flow v1.1 — Scope Boundary & v1.0 vs v1.1 Matrix
6. VP-Flow v1.1-A — Decision & Approval Record

Any ambiguity is resolved by the Decision & Approval Record.

---

## 3. Execution Principles (Non-Negotiable)

- v1.0 behavior must remain unchanged
- Execution is **sequential**, never parallel
- Each step requires a **restore point**
- No undocumented changes are allowed
- Audit and RLS changes precede UI changes

---

## 4. Execution Scope — v1.1-A

### Approved Epics

- Case Lifecycle Re-opening
- Documents Module (Guest-Linked & Stand-alone)

No other epics may be touched during this execution.

---

## 5. High-Level Execution Phases

### Phase A — Database & Schema Preparation

**Objective:** Prepare structural foundations without altering existing behavior.

Includes:
- New tables (documents, document_links)
- New case state handling (reopened)
- Non-breaking schema extensions only

**Output:** Database ready, no functional exposure.

---

### Phase B — RLS Policy Extensions

**Objective:** Enforce correct access rules before functionality is exposed.

Includes:
- RLS rules for documents
- RLS rules for reopened cases
- Explicit Protocol isolation validation

**Output:** Security guaranteed.

---

### Phase C — Audit Event Wiring

**Objective:** Ensure every new action is fully traceable.

Includes:
- Audit events for case reopen lifecycle
- Audit events for document actions
- Validation of append-only behavior

**Output:** Audit completeness confirmed.

---

### Phase D — Controlled UI Exposure

**Objective:** Surface approved functionality without UX innovation.

Includes:
- Re-open action (VP-only)
- Visual indicators for reopened cases
- Documents upload/view surfaces

**Output:** Functionality visible and usable.

---

### Phase E — Validation & Stabilization

**Objective:** Confirm no regressions and validate end-to-end behavior.

Includes:
- Role-based testing
- Regression checks against v1.0
- Audit log verification

**Output:** v1.1-A ready for live use.

---

## 6. Step-by-Step Execution Order (Mandatory)

1. Create restore point — pre-v1.1-A
2. Execute Phase A — Database & Schema
3. Create restore point
4. Execute Phase B — RLS Extensions
5. Create restore point
6. Execute Phase C — Audit Wiring
7. Create restore point
8. Execute Phase D — UI Exposure
9. Create restore point
10. Execute Phase E — Validation
11. Final restore point

Skipping steps invalidates execution.

---

## 7. Roles & Responsibilities

- **Lovable:** Executes only what is documented
- **Devmart:** Reviews outputs per phase
- **Vice President:** Business acceptance (post-validation)

---

## 8. Execution Stop Conditions

Execution must stop immediately if:

- v1.0 behavior changes unexpectedly
- RLS violations are detected
- Audit logs are incomplete
- Undocumented changes appear

---

## 9. Readiness to Proceed

This document becomes executable only when:

- DOC 8 (Database Migration Plan) is approved
- DOC 9 (RLS Policy Extension Matrix) is approved
- DOC 10 (Audit Event Implementation Map) is approved
- DOC 11 (UI Scope & Interaction Rules) is approved
- DOC 12 (Execution Checklist & Restore Points) is approved

---

## 10. Status

**Current State:** Draft
**Next Action:** Prepare supporting execution documents (DOC 8–DOC 12)

---

**Await Further Instructions.**

