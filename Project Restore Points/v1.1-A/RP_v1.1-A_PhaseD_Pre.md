# VP-Flow v1.1-A Phase D Pre-Execution Restore Point

**Created:** 2026-01-22
**Phase:** D - UI Integration
**Status:** PRE-EXECUTION

---

## Current State Snapshot

### Phase D Scope
- D1: Case Re-opening UI (VP-only)
- D2: Documents Storage Infrastructure
- D3: Documents Module UI
- D4: UI-driven Audit Events (view/download)

### Pre-D1 State: Case Module

#### CaseActions.tsx
Current actions available:
- Edit (Link to edit page)
- Open Case (draft → open)
- Start Work (open → in_progress)
- Park (open/in_progress → parked)
- Resume (parked → in_progress)
- Close Case (any non-draft → closed)

**Missing:** Re-open Case button (closed → reopened)

#### CaseDetail.tsx
- Displays case information
- No reopened state banner

#### useUpdateCaseStatus.ts
- Handles status transitions
- Supports: open, in_progress, parked, closed
- Missing: reopened transition

### Pre-D2 State: Storage
- No storage buckets exist
- documents table references file_path but no actual storage

### Pre-D3 State: Documents Module
- No UI module exists at src/app/(admin)/documents/
- documents table exists with RLS policies
- document_links table exists with RLS policies

### Pre-D4 State: Audit Events
- document_viewed audit action exists in enum
- document_downloaded audit action exists in enum
- No frontend hooks to trigger these events

---

## Existing Audit Infrastructure (from Phase C)
- log_audit_event() - Enhanced for case lifecycle
- log_document_audit() - CREATE/UPDATE triggers on documents
- log_document_link_audit() - INSERT trigger on document_links

---

## Guardian Rules Compliance
- v1.0: FROZEN
- Darkone patterns: TO BE REUSED
- Protocol isolation: ENFORCED
- Restore points: ACTIVE

---

## Execution Plan
1. D1: Case Re-opening UI → RP_v1.1-A_PhaseD1_Post.md
2. D2: Storage Infrastructure → RP_v1.1-A_PhaseD2_Post.md
3. D3: Documents Module UI → RP_v1.1-A_PhaseD3_Post.md
4. D4: Audit Triggers UI → RP_v1.1-A_PhaseD_Post.md

---

**STOP CONDITION:** Execute D1, validate, create restore point, then proceed to D2.
