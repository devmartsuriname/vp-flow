# VP-Flow v1.1-A — Execution Checklist & Restore Points

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-A (Operational Control)
**Document Type:** Live Execution Control & Verification Checklist
**Status:** DRAFT — GOVERNANCE ENFORCED

---

## 1. Purpose of This Document

This document defines the **mandatory execution checklist** and **restore point discipline** for implementing **VP-Flow v1.1-A**. It exists to:

- Prevent partial or skipped implementation
- Enforce phase-by-phase execution
- Provide objective verification criteria
- Protect v1.0 stability at all times

No implementation may begin without adhering to this checklist.

---

## 2. Binding References (Authoritative)

Execution must comply with the following documents:

1. VP-Flow v1.1-A — Decision & Approval Record
2. VP-Flow v1.1-A — Execution Plan
3. VP-Flow v1.1-A — Database Migration Plan
4. VP-Flow v1.1-A — RLS Policy Extension Matrix
5. VP-Flow v1.1-A — Audit Event Implementation Map
6. VP-Flow v1.1-A — UI Scope & Interaction Rules

Any deviation invalidates execution.

---

## 3. Global Execution Rules (Non-Negotiable)

- Execution is **linear**, never parallel
- Each phase requires a **verified restore point**
- No phase may start without written confirmation
- Undocumented changes are prohibited
- v1.0 behavior must remain unchanged

---

## 4. Restore Point Discipline

A restore point must:

- Be created **before and after** each phase
- Be clearly named and timestamped
- Be referenced in the execution report

Restore point naming convention:

`Restore_Point_v1.1-A_<Phase>_<YYYY-MM-DD>`

---

## 5. Phase-by-Phase Execution Checklist

### Phase A — Database & Schema

**Before Execution:**
- [ ] DOC 8 approved
- [ ] Pre-migration restore point created

**Execution:**
- [ ] `documents` table created
- [ ] `document_links` table created
- [ ] `cases` state extended with `reopened`
- [ ] Audit event types registered

**Verification:**
- [ ] No v1.0 queries broken
- [ ] No destructive schema changes

**After Execution:**
- [ ] Post-schema restore point created

---

### Phase B — RLS Policy Extensions

**Before Execution:**
- [ ] DOC 9 approved
- [ ] Restore point confirmed

**Execution:**
- [ ] Case re-opening RLS applied
- [ ] Document access RLS applied
- [ ] Protocol isolation verified

**Verification:**
- [ ] Unauthorized access blocked
- [ ] VP permissions validated

**After Execution:**
- [ ] Restore point created

---

### Phase C — Audit Event Wiring

**Before Execution:**
- [ ] DOC 10 approved
- [ ] Restore point confirmed

**Execution:**
- [ ] Case reopen events wired
- [ ] Document events wired

**Verification:**
- [ ] All events logged correctly
- [ ] No audit event missing

**After Execution:**
- [ ] Restore point created

---

### Phase D — UI Exposure

**Before Execution:**
- [ ] DOC 11 approved
- [ ] Restore point confirmed

**Execution:**
- [ ] Re-open Case UI exposed (VP only)
- [ ] Documents UI exposed

**Verification:**
- [ ] UI matches RLS permissions
- [ ] No forbidden UI elements present

**After Execution:**
- [ ] Restore point created

---

### Phase E — Validation & Stabilization

**Execution:**
- [ ] Role-based testing completed
- [ ] v1.0 regression testing passed
- [ ] Audit trail validated

**Acceptance:**
- [ ] VP functional acceptance
- [ ] Devmart technical sign-off

**After Execution:**
- [ ] Final restore point created

---

## 6. Execution Stop Conditions

Execution must halt immediately if:

- v1.0 functionality regresses
- RLS violations occur
- Audit logs are incomplete
- Unauthorized UI appears

Resume requires documented resolution.

---

## 7. Completion Criteria

v1.1-A is considered complete only when:

- All checklist items are checked
- All restore points are verified
- No open governance issues remain
- Documentation is updated

---

## 8. Status

**Current State:** Draft
**Next Action:** Formal approval and authorization to execute v1.1-A

---

**Await Further Instructions.**

