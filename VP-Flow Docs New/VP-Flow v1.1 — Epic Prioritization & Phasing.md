# VP-Flow v1.1 — Epic Prioritization & Phasing

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Document Type:** Live Prioritization & Phasing Document (v1.1)
**Status:** DRAFT — GOVERNANCE ALIGNMENT REQUIRED

---

## 1. Purpose of This Document

This document establishes the **priority order and phased delivery structure** for all approved v1.1 epics. Its purpose is to:

- Prevent scope overload
- Protect v1.0 stability during live use
- Sequence high-impact features first
- Ensure audit, security, and UX risks are controlled

This document does **not** authorize implementation.

---

## 2. Governing Principles for Prioritization

All prioritization decisions are based on the following non-negotiable principles:

1. **v1.0 Stability First** — No epic may destabilize live operations
2. **VP Operational Value** — Direct daily value to the Vice President
3. **Audit & Legal Safety** — Changes must preserve traceability
4. **Security Isolation** — No expansion of Protocol visibility
5. **Incremental Risk** — High-risk epics are isolated and sequenced later

---

## 3. v1.1 Epic Inventory (Complete List)

The following epics are in scope for v1.1 consideration:

1. Case Lifecycle Re-opening
2. Notes System (Core)
3. Notes Dashboard Integration
4. Handwriting & Pen Input Support
5. Progressive Web App (PWA)
6. Documents Module (Guest-Linked & Stand-alone)

No additional epics may be introduced without governance approval.

---

## 4. Priority Classification Framework

Each epic is classified using four dimensions:

- **VP Value** (Low / Medium / High)
- **Technical Risk** (Low / Medium / High)
- **Security & Audit Impact** (Low / Medium / High)
- **Dependency Load** (Independent / Dependent)

This classification determines delivery order.

---

## 5. Epic Evaluation Matrix

| Epic | VP Value | Technical Risk | Audit Impact | Dependencies |
|-----|---------|----------------|--------------|--------------|
| Case Lifecycle Re-opening | High | Medium | High | Core Case Model |
| Documents Module | High | Medium | Medium | Storage + RLS |
| Notes System (Core) | High | High | Medium | New Module |
| Notes Dashboard Integration | Medium | Medium | Low | Notes System |
| Progressive Web App (PWA) | Medium | Medium | Low | Stable UI |
| Handwriting & Pen Input | Medium | High | Medium | Notes System |

---

## 6. Proposed Phasing Strategy

### Phase v1.1-A — Operational Control & Record Integrity

**Objective:** Extend core operational control without introducing new UX paradigms.

**Included Epics:**
1. Case Lifecycle Re-opening
2. Documents Module (Guest-Linked & Stand-alone)

**Rationale:**
- Direct VP operational need
- Builds on existing data structures
- High audit value
- No dependency on new interaction models

---

### Phase v1.1-B — Knowledge Capture & Insight

**Objective:** Introduce structured knowledge capture without device-specific complexity.

**Included Epics:**
3. Notes System (Core)
4. Notes Dashboard Integration

**Rationale:**
- Strong VP productivity gains
- Requires stable data and security foundation
- Dashboard widget depends on Notes core

---

### Phase v1.1-C — Experience & Platform Enhancements

**Objective:** Enhance usability and platform reach once functional stability is proven.

**Included Epics:**
5. Progressive Web App (PWA)
6. Handwriting & Pen Input Support

**Rationale:**
- UX/platform focused
- Higher technical and device risk
- No impact on core business logic

---

## 7. Explicit Sequencing Rules

- v1.1-A must be completed and stabilized before v1.1-B begins
- v1.1-B must be completed before v1.1-C begins
- No parallel execution across phases
- Each phase requires:
  - Updated documentation
  - Restore point creation
  - Explicit authorization

---

## 8. Items Explicitly Excluded from v1.1

The following remain out of scope:

- Global cross-module search
- External integrations (calendar, email, messaging)
- OCR / handwriting-to-text
- Dynamic branding configuration
- External user access

These may be considered for v1.2 or later.

---

## 9. Risk Mitigation Summary

| Risk | Phase | Mitigation |
|-----|-------|------------|
| Audit dilution | v1.1-A | Explicit reopen events, immutable originals |
| Storage abuse | v1.1-A | File size/type limits + RLS |
| Data sprawl | v1.1-B | VP-only Notes access |
| UX fragmentation | v1.1-C | Device-scoped enablement |

---

## 10. Decision Points Required

Before execution, the following must be explicitly approved:

1. Confirmation of v1.1-A scope
2. Confirmation of role access per epic
3. Acceptance of phased rollout (A → B → C)
4. Agreement that v1.0 remains untouched

---

## 11. Status

**Current State:** Draft
**Next Action:** VP & Devmart governance alignment

---

**Await Further Instructions.**

