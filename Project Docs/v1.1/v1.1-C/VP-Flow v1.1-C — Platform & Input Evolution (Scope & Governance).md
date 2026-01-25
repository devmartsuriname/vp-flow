# VP-Flow v1.1-C — Platform & Input Evolution (Scope & Governance)

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-C
**Document Type:** Functional Scope & Governance Definition
**Status:** IMPLEMENTED (Option B — PWA Only)
**Completion Date:** 2026-01-25
**Note:** Epic 1 (Handwriting) and Epic 3 (Device-First UX) remain DEFERRED to future version.

---

## 1. Purpose & Context

This document initiates **VP-Flow v1.1-C**, focusing on **platform evolution and advanced input methods** required by the Vice President’s daily working style.

v1.1-C is explicitly separated from v1.1-A and v1.1-B to:
- Protect stability of core workflows
- Avoid premature coupling of UX-heavy features
- Maintain audit and security guarantees

No implementation is authorized by this document.

---

## 2. Drivers for v1.1-C

The following **validated executive needs** drive v1.1-C:

- Tablet-first usage (iPad)
- Apple Pencil / pen-based interaction
- Near-native application experience
- Reduced friction during meetings

These drivers are **input- and platform-related**, not workflow-related.

---

## 3. Core Epics in v1.1-C

v1.1-C is limited to the following epics:

1. Handwriting & Pen Input Support
2. Progressive Web App (PWA)
3. Device-First UX Adaptation

No additional epics are implied.

---

## 4. Governance Principles (Non-Negotiable)

- v1.0 remains system of record
- v1.1-A and v1.1-B behavior remains unchanged
- No workflow logic changes in v1.1-C
- Input methods must not bypass audit or RLS
- Offline write is prohibited unless explicitly approved

---

## 5. Epic 1 — Handwriting & Pen Input (High-Level)

### 5.1 Intent

Enable the Vice President to **write notes using a pen** (e.g. Apple Pencil) in a natural manner during meetings.

### 5.2 In-Scope (High-Level)

- Freehand writing canvas
- Pen input stored as visual artifacts
- Association with Notes Module (v1.1-B)

### 5.3 Explicit Exclusions

- OCR / handwriting-to-text
- Search within handwriting
- Editing handwriting as text

---

## 6. Epic 2 — Progressive Web App (PWA)

### 6.1 Intent

Provide an installable, tablet-friendly experience with improved performance and usability.

### 6.2 In-Scope (High-Level)

- Installable PWA
- Home-screen launch
- Secure caching for read-only content

### 6.3 Explicit Exclusions

- Offline write capabilities
- Background sync for sensitive data

---

## 7. Epic 3 — Device-First UX Adaptation

### 7.1 Intent

Optimize layouts and interactions for tablet usage without altering business logic.

### 7.2 In-Scope (High-Level)

- Touch-optimized controls
- Responsive layout refinements
- Pen-friendly hit targets

### 7.3 Explicit Exclusions

- UI redesign
- New navigation patterns

---

## 8. Risk & Boundary Summary

| Risk | Mitigation |
|----|-----------|
| UX creep | Strict epic isolation |
| Security leakage | RLS remains authoritative |
| Offline misuse | Read-only offline only |

---

## 9. Readiness for Next Documents

This document enables preparation of:

- DOC C2 — Handwriting & Pen Input Data Model

---

## 10. Status

**Current State:** v1.1-C initiated
**Next Action:** Prepare DOC C2 — Handwriting & Pen Input Data Model

---

**Await Further Instructions.**

