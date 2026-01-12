# VP-Flow v1.1-B — Database Migration Plan

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Scope:** v1.1-B (Knowledge & Insight — Notes Module)
**Document Type:** Database Migration & Schema Control Plan
**Status:** DRAFT — DOCUMENTATION ONLY (NO EXECUTION)

---

## 1. Purpose of This Document

This document defines the **exact database changes** required to support the **Notes Module** in **VP-Flow v1.1-B**. It exists to:

- Prevent schema drift
- Protect v1.0 production stability
- Ensure migrations are reversible and auditable

No database changes may be executed based on this document alone.

---

## 2. Binding References

This plan is governed by:

1. VP-Flow v1.1-B — Notes Module (Functional Scope & Governance)
2. VP-Flow v1.1-B — Notes Data Model & Relationships
3. VP-Flow v1.1-B — Notes RLS & Privacy Model
4. VP-Flow v1.1-B — Execution Plan (DOC B6)
5. VP-Flow v1.1 — Scope Boundary & v1.0 vs v1.1 Matrix

In case of conflict, **DOC B2 (Data Model)** is authoritative.

---

## 3. Migration Principles (Non-Negotiable)

- No changes to existing v1.0 tables
- No column modifications on production entities
- All new tables must be namespaced logically
- All migrations must be reversible

---

## 4. New Tables Overview

v1.1-B introduces exactly **two new tables**:

1. `notes`
2. `note_links`

No additional tables are permitted.

---

## 5. Table: `notes`

### 5.1 Purpose

Stores VP-only personal notes, either stand-alone or linked to a single entity.

---

### 5.2 Columns

| Column | Type | Constraints |
|------|------|------------|
| id | uuid | PK, default uuid_generate_v4() |
| owner_user_id | uuid | NOT NULL |
| title | text | NULL |
| content | text | NOT NULL |
| created_at | timestamptz | NOT NULL, default now() |
| updated_at | timestamptz | NOT NULL, default now() |
| deleted_at | timestamptz | NULL (soft delete) |

---

### 5.3 Constraints

- `owner_user_id` references authenticated VP user
- No foreign keys to other domain tables

---

## 6. Table: `note_links`

### 6.1 Purpose

Defines an optional **single relationship** between a note and one domain entity.

---

### 6.2 Columns

| Column | Type | Constraints |
|------|------|------------|
| id | uuid | PK, default uuid_generate_v4() |
| note_id | uuid | NOT NULL, FK → notes(id) |
| entity_type | text | NOT NULL |
| entity_id | uuid | NOT NULL |
| created_at | timestamptz | NOT NULL, default now() |

---

### 6.3 Constraints

- `entity_type` ENUM-like constraint:
  - guest
  - appointment
  - case

- Unique constraint:
  - One link per note

---

## 7. Indexing Strategy

- `notes.owner_user_id`
- `notes.deleted_at`
- `note_links.note_id`
- Composite: `(entity_type, entity_id)`

Indexes must prioritize read performance without impacting write latency.

---

## 8. Migration Order

1. Create `notes` table
2. Create `note_links` table
3. Apply constraints and indexes
4. Verify no conflicts with existing schemas

---

## 9. Rollback Strategy

- Rollback must:
  - Drop `note_links`
  - Drop `notes`
- Rollback must not affect v1.0 data

---

## 10. Validation Checklist

Before moving to next phase:

- Tables created successfully
- Constraints enforced
- No impact on existing entities
- Rollback tested

---

## 11. Status

**Current State:** Database migration plan prepared
**Next Action:** Prepare DOC B8 — RLS Policy Extension Matrix

---

**Await Further Instructions.**