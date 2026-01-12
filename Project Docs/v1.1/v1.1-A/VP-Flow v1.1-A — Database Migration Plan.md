# VP-Flow v1.1-A — Database Migration Plan

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-A (Operational Control)
**Document Type:** Live Database Migration Blueprint (Documentation Only)
**Status:** DRAFT — GOVERNANCE CONTROLLED

---

## 1. Purpose of This Document

This document defines the **controlled database migration plan** required to support **VP-Flow v1.1-A**. It specifies:

- New tables and schema extensions
- Non-breaking changes to existing entities
- Migration order and safeguards
- Rollback principles (conceptual)

This document authorizes **no execution** by itself.

---

## 2. Binding References

This plan must be read together with:

1. VP-Flow v1.1 — Functional Expansion & Platform Evolution
2. VP-Flow v1.1 — Epic Prioritization & Phasing
3. VP-Flow v1.1 — Documents Module (Data Model, RLS & Audit)
4. VP-Flow v1.1 — Case Re-opening (Workflow, Audit & RLS)
5. VP-Flow v1.1 — Scope Boundary & v1.0 vs v1.1 Matrix
6. VP-Flow v1.1-A — Decision & Approval Record
7. VP-Flow v1.1-A — Execution Plan

---

## 3. Migration Principles (Non-Negotiable)

- **No destructive changes** to existing v1.0 tables
- **Append-only extensions** only
- Existing data must remain valid and accessible
- Schema changes must be **backward compatible**
- All migrations must be reversible at a logical level

---

## 4. Overview of Required Schema Changes

### 4.1 New Tables

- `documents`
- `document_links`

### 4.2 Existing Tables (Extensions Only)

- `cases` — additional state handling for `reopened`
- `audit_logs` — new event types only (no schema break)

No other tables may be altered in v1.1-A.

---

## 5. New Table Definitions (Conceptual)

### 5.1 `documents`

Purpose: Store immutable document records.

| Column | Type | Notes |
|------|------|------|
| id | uuid (PK) | Generated server-side |
| title | text | Required |
| description | text | Optional |
| file_path | text | Storage reference |
| file_type | text | MIME type |
| file_size | bigint | Size in bytes |
| owner_role | enum | VP / Secretary |
| created_by | uuid | User ID |
| created_at | timestamp | Default now() |
| is_active | boolean | Default true |

---

### 5.2 `document_links`

Purpose: Polymorphic linkage between documents and entities.

| Column | Type | Notes |
|------|------|------|
| id | uuid (PK) | Generated server-side |
| document_id | uuid (FK) | References documents.id |
| entity_type | enum | guest / appointment / case / none |
| entity_id | uuid | Nullable for stand-alone |
| linked_by | uuid | User ID |
| linked_at | timestamp | Default now() |

---

## 6. Existing Table Extensions

### 6.1 `cases`

Allowed change:
- Extend state enum to include `reopened`

Constraints:
- Existing states remain unchanged
- Historical records remain valid

---

### 6.2 `audit_logs`

Allowed change:
- Add new event types:
  - `case_reopened`
  - `case_reopen_edit`
  - `case_reclosed`
  - `document_uploaded`
  - `document_linked`
  - `document_viewed`
  - `document_downloaded`
  - `document_deactivated`

No column changes allowed.

---

## 7. Migration Order (Mandatory)

1. Create restore point (pre-migration)
2. Create `documents` table
3. Create `document_links` table
4. Extend `cases` state enum
5. Register new audit event types
6. Validate schema integrity
7. Create restore point (post-schema)

---

## 8. Rollback Principles (Conceptual)

In case of failure:

- New tables may be dropped if unused
- Enum extension must be preserved (no rollback removal)
- No data deletion is permitted
- System must remain operable under v1.0 behavior

Rollback is **logical**, not destructive.

---

## 9. Validation Checklist

- All existing v1.0 queries still function
- No RLS policies are broken
- No orphaned foreign keys
- Audit log accepts new event types

---

## 10. Execution Preconditions

This migration may only be executed if:

- This document is approved
- DOC 9 (RLS Policy Extension Matrix) is approved
- Restore point discipline is enforced

---

## 11. Status

**Current State:** Draft
**Next Action:** Prepare DOC 9 — RLS Policy Extension Matrix

---

**Await Further Instructions.**