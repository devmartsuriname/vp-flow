# VP-Flow v1.1-C — Storage & Service Worker Plan

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-C (Platform & Input Evolution)
**Document Type:** Storage Architecture & Service Worker Governance
**Status:** IMPLEMENTED (PWA Portion — Option B)
**Completion Date:** 2026-01-25
**Note:** Handwriting artifact storage sections remain DEFERRED to future version.

---

## 1. Purpose of This Document

This document defines the **storage architecture, caching boundaries, and service worker governance** for **VP-Flow v1.1-C**. It ensures that handwriting artifacts and PWA behavior:

- Do not introduce new data exposure paths
- Do not weaken RLS or audit guarantees
- Remain reversible and controllable

No implementation is authorized through this document.

---

## 2. Binding References

This document must be read together with:

1. DOC C1 — Platform & Input Evolution (Scope & Governance)
2. DOC C2 — Handwriting & Pen Input (Data Model & Storage Strategy)
3. DOC C3 — Handwriting & Pen Input (UI & Interaction Rules)
4. DOC C4 — PWA Scope & Security Model
5. DOC C6 — Execution Plan (Documentation Only)
6. VP-Flow v1.1-B — Notes RLS & Privacy Model

In case of conflict, **security and privacy documents are authoritative**.

---

## 3. Storage Principles (Non-Negotiable)

- No sensitive data stored client-side
- Handwriting artifacts are server-controlled
- Storage must be segregated from core domain data
- All storage operations are auditable (metadata only)

---

## 4. Handwriting Artifact Storage

### 4.1 Storage Location

- Primary: Secure object storage (server-side)
- Secondary (fallback): Database blob/text reference

Client-side persistent storage is **not permitted**.

---

### 4.2 Stored Content

Permitted:
- Vector stroke data (serialized)
- Raster snapshots (PNG/WebP)

Prohibited:
- OCR output
- Text representations
- Derived analytics

---

### 4.3 Access Control

- Access inherits from Notes RLS
- `owner_user_id = auth.uid()` enforced
- No public URLs or signed links exposed to client

---

## 5. Service Worker Scope & Restrictions

### 5.1 Allowed Service Worker Responsibilities

- Cache application shell (HTML, CSS, JS)
- Cache non-sensitive static assets

---

### 5.2 Explicitly Forbidden Responsibilities

- Caching API responses
- Caching Notes or handwriting content
- Background sync
- Push notifications
- Intercepting authenticated write requests

---

## 6. Cache Invalidation Strategy

- Versioned cache names
- Immediate invalidation on deploy
- No long-lived caches

---

## 7. Offline Behavior Enforcement

- Offline mode is read-only
- Any write attempt while offline:
  - Blocked
  - User notified

No queuing or deferred writes permitted.

---

## 8. Security Controls

Mandatory controls:

- HTTPS only
- CSP aligned with main app
- Service worker registered only on approved scope

---

## 9. Failure & Risk Scenarios

| Risk | Mitigation |
|----|-----------|
| Data leakage via cache | No API caching |
| Offline misuse | Hard block on writes |
| Storage bloat | Single artifact per session |

---

## 10. Validation Checklist

Before proceeding:

- No sensitive data in client storage
- Service worker scope verified
- Offline write attempts blocked
- Storage access restricted to VP

---

## 11. Status

**Current State:** Storage & service worker plan defined
**Next Action:** Prepare DOC C8 — RLS & Audit Impact Review

---

**Await Further Instructions.**

