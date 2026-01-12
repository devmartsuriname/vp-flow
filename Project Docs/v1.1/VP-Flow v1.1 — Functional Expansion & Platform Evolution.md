# VP-Flow v1.1 — Functional Expansion & Platform Evolution

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Document Type:** Live Scope & Design Document (v1.1)
**Status:** DRAFT — GOVERNANCE REVIEW REQUIRED

---

## 1. Purpose & Context

This document defines the proposed scope for **VP-Flow v1.1**, based on:
- Live usage readiness of v1.0
- Explicit feedback from the Vice President
- Deferred and newly identified functional requirements

v1.1 introduces **new functional capabilities** that were intentionally excluded from v1.0 to protect stability, audit integrity, and security guarantees.

No implementation is authorized through this document.

---

## 2. Governance Boundaries (Non‑Negotiable)

- v1.0 remains **stable, immutable, and in live use**
- v1.1 changes must not retroactively weaken v1.0 audit guarantees
- All changes require:
  - Updated PRD sections
  - Updated Architecture & Data Model
  - Updated Workflow Diagrams
  - Updated RLS Policy Matrix
- Lovable execution is **blocked** until explicit authorization

---

## 3. Scope Overview — v1.1 Epics

v1.1 is organized into the following major epics:

1. Case Lifecycle Re‑opening
2. Notes System (Core)
3. Notes Dashboard Integration
4. Handwriting & Pen Input Support
5. Progressive Web App (PWA)
6. Documents Module (Guest‑Linked & Stand‑alone)

Each epic is documented independently below.

---

## 4. Epic 1 — Case Lifecycle Re‑opening

### 4.1 Problem Statement
Closed cases are currently immutable. The Vice President requires the ability to reopen and edit a closed case under controlled conditions.

### 4.2 Proposed Capability
- Allow VP‑only case re‑opening
- Re‑opened cases enter a controlled state (e.g. `reopened`)
- Full audit trail of reopen events

### 4.3 Governance & Audit Constraints
- Re‑open action must be explicitly logged
- Original closure timestamp must remain immutable
- No delete capability introduced

### 4.4 Open Decisions
- Maximum number of allowed re‑opens
- Whether Secretary may view reopen history

---

## 5. Epic 2 — Notes System (Core Module)

### 5.1 Problem Statement
The VP requires a flexible note‑taking system comparable to Microsoft OneNote for operational memory and personal annotations.

### 5.2 Proposed Capability
- Dedicated Notes module
- Notes can exist:
  - Linked to a specific Client (Guest)
  - Linked to an Appointment
  - Linked to a Case
  - Stand‑alone (personal notes)

### 5.3 Core Functional Requirements
- Rich text editing
- Manual note creation and editing
- Secure storage and retrieval

### 5.4 Security & Access
- VP‑only access by default
- Future expansion requires explicit authorization

### 5.5 Open Decisions
- Versioning of notes
- Retention policy

---

## 6. Epic 3 — Notes Dashboard Integration

### 6.1 Problem Statement
Notes must be immediately visible in the VP’s daily operational context.

### 6.2 Proposed Capability
- Dashboard widget showing:
  - Recent notes
  - Notes linked to today’s appointments
- Quick access from dashboard to full Notes module

### 6.3 Constraints
- No performance regression on dashboard
- Role‑aware rendering

---

## 7. Epic 4 — Handwriting & Pen Input Support

### 7.1 Problem Statement
The VP frequently works on an iPad using Apple Pencil and requires handwriting input.

### 7.2 Proposed Capability
- Pen‑based note input
- Handwriting stored as:
  - Vector data or
  - Image snapshots

### 7.3 Technical Considerations
- Canvas‑based input
- Sanitization and storage strategy
- Device‑specific UX handling

### 7.4 Open Decisions
- Handwriting‑only notes vs mixed content
- Conversion to text (OCR) — out of scope for v1.1 unless approved

---

## 8. Epic 5 — Progressive Web App (PWA)

### 8.1 Problem Statement
The VP requires near‑native experience on tablet devices.

### 8.2 Proposed Capability
- Installable PWA
- Offline read access (limited)
- Home‑screen launch

### 8.3 Constraints
- No offline write for sensitive data unless explicitly approved
- Security headers and caching rules mandatory

---

## 9. Epic 6 — Documents Module (Guest‑Linked & Stand‑alone)

### 9.1 Problem Statement
Guests (Clients) frequently provide physical or digital documents (letters, IDs, proposals, reports) that must be retained, reviewed, and referenced by the Vice President. These documents must be centrally stored and retrievable within VP‑Flow.

### 9.2 Proposed Capability
- Dedicated **Documents module**
- Documents can be:
  - Linked to a specific Guest (Client)
  - Linked to a Case
  - Linked to an Appointment
  - Stored as stand‑alone reference documents
- Support for upload, download, and preview (read‑only)

### 9.3 Core Functional Requirements
- Secure file upload
- Metadata capture (title, type, related entity, upload date)
- Download access for authorized roles
- Read‑only preview where supported (PDF, images)

### 9.4 Security & Access
- VP: full access
- Secretary: upload + view (no delete)
- Protocol: **no access**
- Strict RLS enforcement per document ownership and linkage

### 9.5 Governance & Audit Constraints
- No document deletion without explicit authorization
- All uploads logged in audit trail
- Original files immutable (replace = new version, not overwrite)

### 9.6 Open Decisions
- Supported file types and size limits
- Versioning strategy (per document or per upload)
- Storage strategy (Supabase Storage buckets vs future external storage)

---

## 10. Out‑of‑Scope for v1.1 (Explicit)

The following remain **excluded** unless separately authorized:
- Global cross‑module search
- Third‑party integrations (calendar, email, messaging)
- External user access
- OCR / handwriting‑to‑text
- Custom theming or branding configuration

---

## 10. Risk & Impact Summary

| Area | Risk | Mitigation |
|----|----|----|
| Audit integrity | Case reopen weakens finality | Explicit reopen events + immutable closure |
| Security | Notes expose sensitive data | VP‑only RLS |
| Performance | Dashboard widgets | Query limits, lazy loading |
| UX complexity | Pen input | Isolated module, device‑aware |

---

## 11. Authorization Requirements

Before execution:
- Formal approval per epic
- Updated Phase Gate authorization
- Restore point creation
- Security review

---

## 12. Status

**Current State:** Draft
**Next Action:** Governance review and scope confirmation

---

**Await Further Instructions.**

