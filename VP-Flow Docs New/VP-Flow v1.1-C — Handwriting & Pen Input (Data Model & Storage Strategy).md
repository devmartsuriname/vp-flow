# VP-Flow v1.1-C — Handwriting & Pen Input (Data Model & Storage Strategy)

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-C (Platform & Input Evolution)
**Document Type:** Data Model & Storage Strategy
**Status:** DRAFT — DOCUMENTATION ONLY (NO EXECUTION)

---

## 1. Purpose of This Document

This document defines the **data model, storage strategy, and hard boundaries** for **handwriting and pen-based input** in **VP-Flow v1.1-C**. The goal is to enable natural pen input while preserving:

- Audit integrity
- Security & privacy guarantees
- System performance and stability

No implementation is authorized through this document.

---

## 2. Binding References

This document must be read together with:

1. VP-Flow v1.1-C — Platform & Input Evolution (Scope & Governance)
2. VP-Flow v1.1-B — Notes Module (Functional Scope & Governance)
3. VP-Flow v1.1-B — Notes Data Model & Relationships
4. VP-Flow v1.1-B — Notes RLS & Privacy Model

In case of conflict, **v1.1-C governance overrides UX concerns**.

---

## 3. Core Principles (Non-Negotiable)

- Handwriting is an **input modality**, not a new content type
- Handwriting is always **attached to a Note** (v1.1-B)
- Handwriting is **visual**, not semantic
- No automatic interpretation or conversion

---

## 4. Storage Strategy Overview

Handwriting input is stored as **visual artifacts**, not editable text.

Two storage strategies are permitted:

1. Vector stroke data (preferred)
2. Raster image snapshot (fallback)

No other storage formats are allowed.

---

## 5. Data Model — Handwriting Artifacts

### 5.1 New Table: `note_handwriting`

| Column | Type | Constraints |
|------|------|------------|
| id | uuid | PK, default uuid_generate_v4() |
| note_id | uuid | NOT NULL, FK → notes(id) |
| owner_user_id | uuid | NOT NULL |
| storage_type | text | ENUM: vector / raster |
| storage_ref | text | NOT NULL |
| created_at | timestamptz | NOT NULL, default now() |
| deleted_at | timestamptz | NULL (soft delete) |

---

### 5.2 Constraints

- `note_id` must reference a note owned by the VP
- Exactly one handwriting artifact per note per session
- No cascade deletes from notes

---

## 6. Vector Storage Strategy (Preferred)

- Stroke data serialized (e.g. JSON)
- Stored securely (object storage or DB, implementation-dependent)
- Preserves:
  - Pen pressure
  - Stroke order
  - Resolution independence

---

## 7. Raster Storage Strategy (Fallback)

- Canvas snapshot (PNG or WebP)
- Used when vector data is unavailable
- No post-processing or compression beyond defaults

---

## 8. Explicit Exclusions

The following are **explicitly excluded**:

- OCR or handwriting-to-text
- Searching within handwriting
- Editing handwriting as text
- Multi-user handwriting
- Export of handwriting artifacts

---

## 9. RLS & Privacy Considerations

- Handwriting artifacts inherit **VP-only access** from Notes
- RLS must enforce:
  - `owner_user_id = auth.uid()`
- No separate sharing or visibility rules

---

## 10. Audit Implications

Audit events must record:

- handwriting_created
- handwriting_deleted

Audit payload must never include visual content.

---

## 11. Performance & Storage Constraints

- Handwriting artifacts must not block note loading
- Lazy loading is mandatory
- Storage quotas may be enforced later

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|----|-----------|
| Storage bloat | Single artifact per session |
| Privacy leakage | VP-only RLS inheritance |
| UX complexity | No editing or conversion |

---

## 13. Readiness for Next Step

This document enables preparation of:

- DOC C3 — Handwriting & Pen Input — UI & Interaction Rules

---

## 14. Status

**Current State:** Data model defined
**Next Action:** Prepare DOC C3 — UI & Interaction Rules

---

**Await Further Instructions.**

