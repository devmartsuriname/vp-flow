# VP-Flow v1.3 — Scope Definition & Planning

## Document Metadata

| Field | Value |
|-------|-------|
| **Project** | VP-Flow |
| **Document Type** | Scope Definition (Planning Only) |
| **Version** | v1.3 |
| **Status** | APPROVED — AWAITING EXECUTION AUTHORIZATION |
| **Created** | 2026-01-25 |
| **Approved** | 2026-01-25 |
| **Authority** | Office of the Vice President of Suriname |
| **Delivery Partner** | Devmart |

---

## Executive Summary

v1.3 completes VP-Flow's operational maturity by implementing three focused modules:

1. **Documents Module Expansion** — Lifecycle states and logical versioning
2. **Case Re-opening Enhancement** — Mandatory justification and audit deepening
3. **Notifications Deepening** — Extended trigger coverage (no external channels)

All work builds on frozen v1.0, v1.1, and v1.2 baselines without scope creep.

---

## Section 1: Scope Boundaries

### 1.1 IN SCOPE (v1.3)

| Feature | Module | Priority |
|---------|--------|----------|
| Document lifecycle states (draft/final/archived) | Documents | HIGH |
| Document logical versioning (immutable history) | Documents | HIGH |
| Document-to-entity linkage enforcement | Documents | MEDIUM |
| Document audit trail requirements | Documents | HIGH |
| Mandatory reopen justification | Case Re-opening | HIGH |
| Reopen audit compliance | Case Re-opening | HIGH |
| Reopen state machine validation | Case Re-opening | MEDIUM |
| Extended notification triggers | Notifications | MEDIUM |
| Notification categorization (logical labels) | Notifications | LOW |
| Read/unread lifecycle clarity | Notifications | LOW |

### 1.2 OUT OF SCOPE (v1.3)

| Feature | Status | Rationale |
|---------|--------|-----------|
| Document templates | DEFERRED | Complexity exceeds v1.3 scope |
| External document sharing | PROHIBITED | Security/governance risk |
| Public document links | PROHIBITED | No external access in v1.x |
| OCR/text extraction | DEFERRED | Requires third-party integration |
| Virus/malware scanning | DEFERRED | Requires external service |
| Bulk document import/export | DEFERRED | v1.4+ consideration |
| Email notifications | PROHIBITED | External channel — v2.0 scope |
| Push notifications | PROHIBITED | External channel — v2.0 scope |
| SMS notifications | PROHIBITED | External channel — v2.0 scope |
| Notification preferences UI | PROHIBITED | Removed in v1.0 polish |
| Real-time subscriptions | DEFERRED | Complexity exceeds scope |
| Reopen count limits | DEFERRED | Awaiting usage pattern data |
| Secretary reopen visibility | DEFERRED | Role boundary expansion not authorized |
| Cross-module global search | DEFERRED | Requires dedicated architecture |
| Handwriting/pen input | DEFERRED | v1.1-C Option A — not authorized |
| Background sync | KILLED | Security risk — RLS bypass |
| Offline write capability | KILLED | Security risk — audit integrity |

---

## Section 2: Module Planning — Documents Expansion

### 2.1 Document Lifecycle States

**Current State:**
- `is_active` boolean (true = active, false = deactivated/soft-deleted)
- No workflow states

**Proposed v1.3 State:**
- Add `document_status` enum: `draft`, `final`, `archived`
- Default: `draft` on upload
- Transitions: `draft` -> `final` (VP/Secretary), `final` -> `archived` (VP only)

**State Machine:**

```
  draft ────────> final ────────> archived
    │               │                 │
    │               │                 │
    └───────────────┴─────────────────┘
                    │
              (VP only: deactivate)
```

**Rules:**
- `draft`: Editable (title, description)
- `final`: Read-only, official record
- `archived`: Hidden from default views, preserved for audit
- VP can deactivate any state (soft-delete via `is_active = false`)

### 2.2 Document Versioning Strategy

**Model:** Logical versioning (immutable history)

**Proposed Schema Extension:**

| Column | Type | Purpose |
|--------|------|---------|
| `version_number` | integer | Sequential version (default: 1) |
| `parent_document_id` | uuid (nullable) | Links to previous version |
| `is_current_version` | boolean | Marks latest version in chain |

**Behavior:**
- New upload creates v1 (`version_number = 1`, `parent_document_id = NULL`, `is_current_version = true`)
- "Upload new version" creates v2+ linked to parent
- Previous version marked `is_current_version = false`
- All versions remain accessible (no destructive updates)
- Query default filters: `is_current_version = true`

**Constraints:**
- Version chain is immutable once created
- Deactivation affects all versions in chain
- Archive affects only target version

### 2.3 Entity Linkage Rules

**Current State:**
- Documents linked via `entity_type` enum + `entity_id` UUID
- Supported entities: `case`, `appointment`, `guest`

**v1.3 Enforcement:**
- Validate `entity_id` exists in target table before INSERT
- Prevent orphan documents (entity deleted but document remains)
- Option: Cascade soft-delete when parent entity deleted

**Implementation:**
- Database trigger to validate entity existence on document INSERT
- No cross-entity shortcuts (document must have exactly one primary entity)
- `document_links` table already exists for secondary linkage

### 2.4 Document Role-Based Access

| Role | View | Upload | Edit Metadata | Change Status | Deactivate |
|------|------|--------|---------------|---------------|------------|
| VP | All | Yes | Yes | Yes (all) | Yes |
| Secretary | All | Yes | Own uploads | draft->final only | No |
| Protocol | None | No | No | No | No |

**RLS Confirmation:**
- Protocol isolation ABSOLUTE — no document access
- Secretary can promote own drafts to final
- VP has full control

### 2.5 Document Audit Trail

**Required Audit Events:**

| Event | Action Type | Logged Values |
|-------|-------------|---------------|
| Document uploaded | `document_created` | file_name, entity_type, entity_id |
| Document metadata edited | `document_updated` | changed fields |
| Document status changed | `document_status_changed` | old_status, new_status |
| New version uploaded | `document_version_created` | version_number, parent_id |
| Document deactivated | `document_deactivated` | deactivated_by |

**Implementation:**
- Extend `audit_action` enum with new values
- Trigger functions for each action type
- VP-only audit visibility (existing policy)

---

## Section 3: Module Planning — Case Re-opening

### 3.1 Current Implementation (v1.1-A)

| Aspect | Current State |
|--------|---------------|
| Who can reopen | VP only |
| Justification | Optional (captured in vp_notes) |
| Status transition | `closed` -> `reopened` |
| Edit window | Enabled in `reopened` status |
| Re-closure | Required to return to `closed` |
| Notification | Trigger exists (v1.2-A) |

### 3.2 Proposed v1.3 Enhancements

**3.2.1 Mandatory Justification**

- Change justification from optional to **required**
- Minimum 10 characters
- UI validation before submission
- Database trigger validation (NOT NULL constraint on audit event)

**3.2.2 Dedicated Reopen Reason Field**

**Option A:** Continue using `vp_notes` append (current)
**Option B:** Add dedicated `reopen_reason` column (recommended for clarity)

If Option B:
| Column | Type | Nullable | Purpose |
|--------|------|----------|---------|
| `reopen_reason` | text | YES | Populated on reopen; cleared on close |
| `reopened_at` | timestamptz | YES | Timestamp of last reopen |
| `reopened_by` | uuid | YES | User who reopened |

**3.2.3 State Machine Validation**

**Allowed Transitions:**
- `closed` -> `reopened` (VP only, with justification)
- `reopened` -> `closed` (VP only, with resolution)
- `reopened` -> Any editable status (VP only)

**Prohibited:**
- Bulk reopen (no batch operations)
- History edits (all transitions logged)
- Secretary/Protocol reopen (role boundary)

### 3.3 Audit Compliance Requirements

**Existing Audit Coverage:**
- Case status changes logged via `audit_events`
- `notify_case_reopened` trigger (v1.2-A)

**v1.3 Extension:**
- Log `reopen_reason` in audit `new_values` JSON
- Include `reopened_at` and `reopened_by` in audit payload
- No changes to VP-only audit visibility

### 3.4 Explicit Constraints

| Constraint | Enforcement |
|------------|-------------|
| No bulk reopen | UI: No multi-select action; API: Single-record only |
| No history edits | Audit table is immutable (existing) |
| VP-only action | RLS + UI gate (existing) |
| Minimum justification | UI validation + optional DB trigger |

---

## Section 4: Module Planning — Notifications Deepening

### 4.1 Current Implementation (v1.2-A)

| Trigger | Event | Recipients |
|---------|-------|------------|
| `notify_case_status_change` | Any case status change | VP, assigned Secretary |
| `notify_case_reopened` | `closed` -> `reopened` | VP only |
| `notify_appointment_status` | `approved` or `rejected` | VP, submitting Secretary |
| `notify_document_uploaded` | New document INSERT | VP, uploader |

### 4.2 Proposed v1.3 Extensions

**4.2.1 Additional Trigger Coverage**

| Trigger | Event | Recipients | Priority |
|---------|-------|------------|----------|
| `notify_case_assigned` | `assigned_to` changed | VP, new assignee | MEDIUM |
| `notify_case_deadline_warning` | Deadline within 3 days | VP, assigned Secretary | HIGH |
| `notify_document_status_changed` | Document status transition | VP, uploader | LOW |

**4.2.2 Notification Categorization**

Add logical `category` column to `notifications` table:

| Category | Events |
|----------|--------|
| `case` | All case-related notifications |
| `appointment` | All appointment-related notifications |
| `document` | All document-related notifications |
| `system` | System/administrative notifications |

**Purpose:** Enable future filtering/grouping in UI (read-only display, not configurable)

**4.2.3 Read/Unread Lifecycle Clarity**

**Current State:**
- `is_read` boolean (false -> true on click)
- `read_at` timestamp (set when marked read)
- Mark all as read (bulk update)

**v1.3 Confirmation:**
- No auto-read on navigation (explicitly out of scope)
- Retain manual mark as read
- Retain bulk mark all as read
- Add optional "unread only" filter in notifications list

### 4.3 Explicit Exclusions

| Feature | Status | Rationale |
|---------|--------|-----------|
| Email delivery | PROHIBITED | External service required |
| Push notifications | PROHIBITED | Security review pending |
| SMS delivery | PROHIBITED | External service required |
| User preferences | PROHIBITED | Removed in v1.0 polish |
| Real-time updates | DEFERRED | WebSocket complexity |
| Deadline scheduler | DEFERRED | Requires cron/edge function |

---

## Section 5: RLS & Audit Impact Overview

### 5.1 RLS Policy Changes

| Table | Change | Impact |
|-------|--------|--------|
| `documents` | Update policies for `document_status` transitions | Secretary limited to `draft`->`final` |
| `documents` | Add versioning query default | Filter `is_current_version = true` |
| `cases` | No RLS change | Existing VP-only reopen enforced |
| `notifications` | Add category column (default policies) | No visibility change |

### 5.2 Audit Schema Changes

**Enum Extension:**

```sql
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'document_status_changed';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'document_version_created';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'case_assigned';
```

**Trigger Additions:**
- `log_document_status_change` — Logs status transitions
- `log_document_version_created` — Logs new version uploads
- `log_case_assignment_change` — Logs assignee changes

### 5.3 No External Channel Integration

All notifications remain internal (`notifications` table only). No email, push, SMS, or external service integration in v1.3.

---

## Section 6: Phase Split Proposal

### 6.1 Proposed Sub-Phases

| Phase | Scope | Estimated Complexity |
|-------|-------|---------------------|
| **v1.3-A** | Documents Lifecycle & Versioning | HIGH |
| **v1.3-B** | Case Re-opening Enhancement | MEDIUM |
| **v1.3-C** | Notifications Deepening | LOW |

### 6.2 v1.3-A: Documents Module Expansion

**Deliverables:**
1. `document_status` enum + column migration
2. `version_number`, `parent_document_id`, `is_current_version` columns
3. Status transition RLS enforcement
4. Version chain management hooks
5. UI: Status badge, version history view, "Upload New Version" action
6. Audit triggers for status/versioning events

**Dependencies:** None (builds on v1.1-A Documents baseline)

### 6.3 v1.3-B: Case Re-opening Enhancement

**Deliverables:**
1. Mandatory justification validation (UI + optional DB)
2. Optional: `reopen_reason`, `reopened_at`, `reopened_by` columns
3. Enhanced ReopenModal with required field
4. State machine validation trigger
5. Audit payload enrichment

**Dependencies:** None (builds on v1.1-A Case Reopen baseline)

### 6.4 v1.3-C: Notifications Deepening

**Deliverables:**
1. `category` column on `notifications` table
2. `notify_case_assigned` trigger
3. `notify_document_status_changed` trigger
4. Category backfill for existing notifications (optional)
5. UI: Category badges in notification list

**Dependencies:** v1.3-A (document status changes)

---

## Section 7: Guardian Rules Compliance

| Rule | v1.3 Approach |
|------|---------------|
| Darkone Admin 1:1 | All UI uses existing patterns only |
| No external channels | Confirmed — internal notifications only |
| No role expansion | VP/Secretary/Protocol unchanged |
| Protocol isolation | Absolute — no document access |
| Restore point discipline | Pre/post for each sub-phase |
| Documentation-first | This document created before execution |
| No scope creep | Explicit OUT OF SCOPE section enforced |

---

## Section 8: Readiness Statement

**v1.3 Scope Definition is COMPLETE and APPROVED.**

This document establishes:
- Clear IN SCOPE / OUT OF SCOPE boundaries
- Module-by-module technical planning
- RLS and audit impact analysis
- Phase split proposal (v1.3-A, v1.3-B, v1.3-C)
- Guardian Rules compliance

**v1.3 is ready for execution authorization.**

Recommended execution order:
1. v1.3-A (Documents) — Foundation for document lifecycle
2. v1.3-B (Case Re-opening) — Independent, can parallel with A
3. v1.3-C (Notifications) — Depends on v1.3-A completion

---

## Section 9: Authorization Status

| Phase | Status |
|-------|--------|
| v1.3-A (Documents Expansion) | AWAITING AUTHORIZATION |
| v1.3-B (Case Re-opening Enhancement) | AWAITING AUTHORIZATION |
| v1.3-C (Notifications Deepening) | AWAITING AUTHORIZATION |

---

**End of v1.3 Scope Definition**

**Document Status:** APPROVED — 2026-01-25
**Execution Status:** AWAITING AUTHORIZATION
