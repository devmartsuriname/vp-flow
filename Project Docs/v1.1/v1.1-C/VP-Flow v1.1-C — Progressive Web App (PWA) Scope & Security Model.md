# VP-Flow v1.1-C — Progressive Web App (PWA) Scope & Security Model

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-C (Platform & Input Evolution)
**Document Type:** Platform Scope, Security & Offline Model
**Status:** IMPLEMENTED & VALIDATED
**Completion Date:** 2026-01-25

---

## 1. Purpose of This Document

This document defines the **scope, security boundaries, and offline behavior** for introducing a **Progressive Web App (PWA)** in **VP-Flow v1.1-C**. The objective is to provide a near-native tablet experience **without compromising security, auditability, or system-of-record guarantees**.

No implementation is authorized through this document.

---

## 2. Binding References

This document must be read together with:

1. VP-Flow v1.1-C — Platform & Input Evolution (Scope & Governance)
2. VP-Flow v1.1-C — Handwriting & Pen Input (Data Model & Storage Strategy)
3. VP-Flow v1.1-C — Handwriting & Pen Input (UI & Interaction Rules)
4. VP-Flow v1.1-B — Notes Module (Functional Scope & Governance)
5. VP-Flow v1.1-B — Notes RLS & Privacy Model

In case of conflict, **security and privacy documents are authoritative**.

---

## 3. PWA Intent & Non-Goals

### 3.1 Intent

- Improve tablet usability and perceived performance
- Enable home-screen installation on iPad
- Reduce friction during meetings

### 3.2 Non-Goals

- Offline-first application
- Background synchronization of sensitive data
- Replacement of native applications

---

## 4. Installation & Launch Model

- PWA is **installable** from the browser
- Launches in **standalone mode**
- Uses secure HTTPS context

No custom install prompts beyond standard browser UX.

---

## 5. Offline Behavior (Strict)

### 5.1 Allowed Offline Capabilities

- Read-only access to:
  - Cached shell UI
  - Non-sensitive static assets

### 5.2 Explicitly Prohibited Offline Capabilities

- Creating notes
- Editing notes
- Handwriting input
- Authentication refresh

Offline write is **not permitted**.

---

## 6. Caching Strategy

- Cache **application shell only**
- No caching of:
  - Notes content
  - Handwriting artifacts
  - Client data

Cache invalidation must be aggressive and predictable.

---

## 7. Authentication & Session Handling

- PWA uses existing authentication mechanisms
- No persistent auth tokens stored offline
- Session expiry behavior identical to web app

---

## 8. Security Headers & Controls

Mandatory controls:

- HTTPS enforced
- CSP aligned with main web app
- No service worker access to sensitive APIs

---

## 9. Audit & Logging Implications

- PWA usage generates no special audit events
- All audited actions remain server-side
- Offline usage generates no audit records

---

## 10. Explicit Exclusions

The following are **explicitly excluded** from v1.1-C PWA:

- Push notifications
- Background sync
- Offline data storage
- Device hardware access beyond standard web APIs

---

## 11. Risk & Mitigation Summary

| Risk | Mitigation |
|----|-----------|
| Data leakage | No sensitive caching |
| Offline misuse | Read-only offline |
| Auth persistence | No offline tokens |

---

## 12. Readiness for Next Step

This document enables preparation of:

- DOC C5 — Device-First UX Adaptation Rules

---

## 13. Status

**Current State:** PWA scope and security defined
**Next Action:** Prepare DOC C5 — Device-First UX Adaptation Rules

---

**Await Further Instructions.**

