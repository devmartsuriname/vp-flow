# VP-Flow v1.2 — Scope Confirmation

## Document Metadata
| Field | Value |
|-------|-------|
| **Project** | VP-Flow |
| **Document Type** | Scope Confirmation |
| **Version** | v1.2 |
| **Status** | CLOSED & FROZEN |
| **Created** | 2026-01-25 |
| **Authority** | Office of the Vice President of Suriname |
| **Delivery Partner** | Devmart |

---

## Purpose

This document defines the authoritative scope boundary for VP-Flow v1.2.
All implementation work MUST conform to this specification.
Any deviation requires explicit re-authorization.

---

## IN SCOPE (v1.2)

| Feature | Module | Scope Definition | Status |
|---------|--------|------------------|--------|
| Notification Triggers | Notifications | Automated trigger events for case/appointment/document changes | NEW |
| Notification Recipients | Notifications | Role-based recipient routing rules | NEW |
| Notification Read/Unread | Notifications | Existing behavior documentation | COMPLETE |
| Document Upload Flow | Documents | Existing implementation documentation | COMPLETE (v1.1-A) |
| Document Entity Linking | Documents | Existing polymorphic linking documentation | COMPLETE (v1.1-A) |
| Document RLS | Documents | Existing VP/Secretary access documentation | COMPLETE (v1.1-A) |
| Document Audit Events | Documents | Existing audit logging documentation | COMPLETE (v1.1-A) |
| Case Re-opening Workflow | Cases | Existing VP-only flow documentation | COMPLETE (v1.1-A) |
| Case Re-opening Justification | Cases | Existing justification capture documentation | COMPLETE (v1.1-A) |
| Settings Version Label | Settings | Update from `1.0.0` to `1.2.0` | NEW |
| Settings PWA Indicator | Settings | Read-only PWA install status | NEW |
| Settings Environment Label | Settings | Existing environment badge documentation | COMPLETE |

---

## OUT OF SCOPE (v1.2)

| Feature | Reason | Reference |
|---------|--------|-----------|
| Email notifications | Explicitly excluded per authorization | v1.3 Deferred Record |
| Push notifications | Security review required | v1.3 Deferred Record |
| SMS notifications | Explicitly excluded per authorization | v1.3 Deferred Record |
| Document versioning | Deferred to v1.3+ | v1.3 Deferred Record |
| Document templates | Deferred to v1.3+ | v1.3 Deferred Record |
| Document OCR | Deferred to v1.3+ | v1.3 Deferred Record |
| Reopen limits | Deferred to v1.3+ | v1.3 Deferred Record |
| Reopen history visibility (Secretary) | Deferred to v1.3+ | v1.3 Deferred Record |
| Feature flags / toggles | Explicitly prohibited | v1.2 Authorization |
| Any UX redesigns | Darkone 1:1 constraint | Governance |
| Real-time subscriptions | Complexity exceeds v1.2 scope | Governance |
| Notification preferences UI | Removed in v1.0 polish | v1.0 Documentation |

---

## Implementation Phases

| Phase | Scope | Status |
|-------|-------|--------|
| v1.2-A | Notifications — Trigger implementation | COMPLETE |
| v1.2-B | Settings UI — Version + PWA indicator | COMPLETE |
| v1.2-C | Documentation freeze & validation | COMPLETE |

---

## Cross-References

- `Project Docs/v1.3/VP-Flow v1.3 — Skipped & Deferred Features (Authoritative Record).md`
- `Project Docs/v1.1-A/` — Documents & Case Re-opening implementation
- `Project Docs/v1.1-C/` — PWA implementation

---

## Governance Compliance

| Constraint | Enforcement |
|------------|-------------|
| Darkone Admin 1:1 | All UI changes must use existing Darkone components |
| No schema changes unless strictly required | Triggers only; no new tables or columns |
| No UX redesigns | Additive changes only |
| No feature expansion beyond scope | Strict scope boundary |
| Documentation-first | This document is authoritative |

---

## Approval

**v1.2 SCOPE CONFIRMED, IMPLEMENTED, CLOSED & FROZEN**

All phases complete. v1.2 is now a locked baseline. No further changes permitted.
