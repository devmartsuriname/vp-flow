# VP-Flow v1.1 — Scope Boundary & v1.0 vs v1.1 Matrix

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Document Type:** Live Scope Control & Comparison Document
**Status:** DRAFT — GOVERNANCE CONTROL

---

## 1. Purpose of This Document

This document establishes **hard scope boundaries** between **VP-Flow v1.0** (live system) and **VP-Flow v1.1** (approved functional expansion). It exists to:

- Prevent scope creep
- Avoid mixing live fixes with new functionality
- Provide a clear decision record for the Vice President and Devmart
- Serve as a reference during execution and review

No implementation is authorized through this document.

---

## 2. Non‑Negotiable Scope Rules

- v1.0 remains **live, stable, and untouched**
- v1.1 introduces **new capabilities only**, never silent changes
- No item may move between versions without documented approval
- All v1.1 work follows epic‑level authorization and phase gates

---

## 3. v1.0 — In Scope (LIVE & FROZEN)

The following capabilities are **final** in v1.0 and may only receive critical bug fixes if explicitly approved:

### Core Functionality
- Appointment creation, approval, rescheduling, and completion
- VP‑initiated case creation from appointments
- Case lifecycle: Draft → Open → In Progress / Parked → Closed
- Priority management (High / Medium / Low)
- Deadline tracking and reminders (internal)
- Manual PDF generation

### Roles & Access
- Vice President: full authority
- Secretary: support + read
- Protocol: execution‑only on approved appointments

### Security & Audit
- Append‑only audit logging
- Immutable closed cases
- Strict RLS enforcement
- Protocol isolation

---

## 4. v1.1 — In Scope (AUTHORIZED EXPANSION)

The following items are **explicitly planned** for v1.1 and must not be back‑ported to v1.0:

### v1.1‑A — Operational Control
- Case Lifecycle Re‑opening (VP‑only, audited)
- Documents Module (Guest‑linked & stand‑alone)

### v1.1‑B — Knowledge & Insight
- Notes Module (core)
- Notes Dashboard widgets

### v1.1‑C — Experience & Platform
- Progressive Web App (PWA)
- Handwriting / Pen input support

---

## 5. v1.0 vs v1.1 Capability Matrix

| Capability | v1.0 | v1.1 |
|-----------|------|------|
| Appointment management | ✓ | ✓ |
| Case creation & closure | ✓ | ✓ |
| Case re‑opening | ✗ | ✓ |
| Documents storage | ✗ | ✓ |
| Notes system | ✗ | ✓ |
| Dashboard notes widget | ✗ | ✓ |
| Pen / handwriting input | ✗ | ✓ |
| PWA support | ✗ | ✓ |
| Global search | ✗ | ✗ |
| External integrations | ✗ | ✗ |

---

## 6. Explicitly Deferred (Beyond v1.1)

The following are **not** part of v1.1 and require a future version decision:

- Global cross‑module search & advanced filters
- External calendar, email, or messaging integrations
- OCR / handwriting‑to‑text
- Public or external user access
- Custom theming or branding configuration

---

## 7. Change Control Rules

- Any request impacting v1.0 must be escalated and documented
- Any new v1.1 item requires:
  - Epic documentation
  - RLS review
  - Audit impact assessment
  - Phase gate approval

Verbal or ad‑hoc approvals are invalid.

---

## 8. Decision Checkpoints

This document must be referenced at:
- v1.1‑A authorization
- Any discussion on "small changes" or "quick fixes"
- VP review meetings

---

## 9. Status

**Current State:** Draft
**Next Action:** Governance sign‑off and alignment with VP

---

**Await Further Instructions.**

