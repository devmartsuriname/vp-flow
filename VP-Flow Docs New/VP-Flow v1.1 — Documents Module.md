# VP-Flow v1.1 — Documents Module

**Subtitle:** Data Model, RLS Concept & Audit Events

**Project:** VP-Flow (Appointments & Case Management System)
**Client:** Office of the Vice President of Suriname
**Document Type:** Live Technical Design Document (v1.1)
**Status:** DRAFT — DOCUMENTATION ONLY

---

## 1. Purpose of This Document

This document deepens the **Documents Module** introduced in VP-Flow v1.1. It defines:

- The proposed **data model**
- The **Row Level Security (RLS) access concept**
- The required **audit events**

This document is strictly **design-level documentation**. No implementation or configuration is authorized.

---

## 2. Design Principles (Non-Negotiable)

- Documents are **append-only** (no destructive deletes)
- Original files are **immutable**
- All access is **role-scoped** and **entity-bound**
- Protocol role remains **fully isolated**
- VP-Flow remains the **system of record**

---

## 3. Conceptual Data Model

### 3.1 Core Tables

#### 3.1.1 `documents`

| Field | Type | Description |
|-----|-----|------------|
| id | uuid (PK) | Unique document identifier |
| title | text | Document title |
| description | text | Optional description |
| file_path | text | Storage path reference |
| file_type | text | MIME type |
| file_size | bigint | File size in bytes |
| owner_role | enum | Role that uploaded the document |
| created_by | uuid | User ID |
| created_at | timestamp | Upload timestamp |
| is_active | boolean | Soft-state flag |

Documents are never overwritten. Updates create a **new document row**.

---

#### 3.1.2 `document_links`

| Field | Type | Description |
|-----|-----|------------|
| id | uuid (PK) | Unique link identifier |
| document_id | uuid (FK) | References documents.id |
| entity_type | enum | guest / appointment / case / none |
| entity_id | uuid | Referenced entity ID |
| linked_at | timestamp | Link creation time |
| linked_by | uuid | User ID |

Allows polymorphic linkage without duplicating files.

---

## 4. Storage Concept (Logical)

- Files stored in **isolated storage buckets**
- Bucket access enforced via RLS-mapped paths
- Public access **disabled**
- Downloads proxied via authenticated requests

Exact storage provider configuration is **out of scope**.

---

## 5. RLS Access Concept

### 5.1 Role Matrix

| Role | Upload | View | Download | Delete |
|----|-------|------|----------|--------|
| Vice President | Yes | Yes | Yes | No |
| Secretary | Yes | Yes | Yes | No |
| Protocol | No | No | No | No |

Delete is intentionally excluded; deactivation requires governance approval.

---

### 5.2 Entity-Based Visibility Rules

- Documents linked to a **Guest** are visible only if the role has access to that Guest
- Documents linked to a **Case** inherit case-level visibility
- Stand-alone documents are VP-only by default

---

## 6. Audit Events (Mandatory)

All events are **append-only** and immutable.

### 6.1 Document Events

| Event | Trigger |
|-----|--------|
| document_uploaded | File successfully stored |
| document_linked | Document linked to entity |
| document_viewed | Document accessed |
| document_downloaded | File downloaded |
| document_deactivated | Document marked inactive |

Each event logs:
- timestamp
- user_id
- role
- document_id
- related entity (if any)

---

## 7. Security Considerations

- Virus scanning is recommended but not required for v1.1
- File size and type limits must be enforced at upload
- No inline execution of files
- Strict MIME validation

---

## 8. Open Design Decisions

- Maximum file size
- Allowed MIME types
- Versioning semantics (explicit vs implicit)
- Retention and archival policy

These require explicit VP and governance approval.

---

## 9. Out-of-Scope (Explicit)

- OCR / text extraction
- External document sharing
- Public links
- Bulk import/export

---

## 10. Authorization Requirements

Before any implementation:
- Approval of data model
- Approval of RLS matrix
- Approval of audit event list
- Phase gate authorization
- Restore point creation

---

## 11. Status

**Current State:** Draft
**Next Action:** Governance review and acceptance

---

**Await Further Instructions.**

