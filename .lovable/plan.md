

# Incoming Post & Archive — Implementation Plan

## Overview
Full implementation of the Incoming Post module: database schema, triggers, RLS, audit trail, and complete UI module following existing Darkone patterns.

## Phase 1: Database Migration

Single migration containing all schema changes:

### Enums
- `incoming_post_status`: received, registered, waiting_advice, advice_received, forwarded, rejected, appointment_created, closed, archived
- `incoming_post_urgency`: normal, urgent, confidential
- `incoming_post_category`: letter, memo, invitation, legal, report, other
- Extend `document_entity_type` with `'incoming_post'`
- Extend `audit_action` with 6 new values: `incoming_post_created`, `incoming_post_updated`, `incoming_post_status_changed`, `incoming_post_archived`, `incoming_post_forwarded`, `incoming_post_appointment_linked`

### Table: `incoming_post`
All columns per locked spec, including `linked_appointment_id` FK to appointments, `reference_number` (unique, auto-generated via sequence per year).

### Reference Number Generation
- Yearly sequence + trigger: `generate_incoming_post_reference()` auto-assigns `SECVP-YYYY-NNNN` on INSERT.

### Triggers
1. `prevent_archived_incoming_post_update` — blocks all updates on archived rows
2. `validate_incoming_post_status_transition` — enforces transition table + VP-only authority checks
3. `log_incoming_post_audit` — sanitized audit logging (SECURITY DEFINER)
4. `update_incoming_post_updated_at` — reuses `update_updated_at_column()`

### RLS Policies (6 total)
- VP: SELECT all, INSERT, UPDATE all non-archived, no DELETE (soft archive)
- Secretary: SELECT all, INSERT, UPDATE own registered + limited statuses
- Protocol: SELECT where `category = 'invitation'` AND `status NOT IN ('received','registered')`

### Notification Trigger
- `notify_incoming_post_status_change` — notifies VP on registration, notifies Secretary on forwarding decisions

## Phase 2: Frontend — Types & Hooks

### Files to create under `src/app/(admin)/incoming-post/`:

**types.ts** — TypeScript types mirroring DB schema, status config, transition rules, helper functions (following cases/types.ts pattern)

**constants.ts** — Status badge variants, urgency labels, category labels, filter options

**hooks/**
- `useIncomingPosts.ts` — List query with filters (status, category, urgency)
- `useIncomingPost.ts` — Single record fetch
- `useCreateIncomingPost.ts` — Insert mutation (Secretary/VP)
- `useUpdateIncomingPost.ts` — Metadata update mutation
- `useUpdateIncomingPostStatus.ts` — Status transition mutation with authority validation
- `index.ts` — barrel export

## Phase 3: Frontend — UI Components

**components/**
- `IncomingPostTable.tsx` — List table with status badges, urgency indicators, category tags
- `IncomingPostStatusBadge.tsx` — Color-coded status badge
- `IncomingPostUrgencyBadge.tsx` — Urgency indicator
- `IncomingPostDetail.tsx` — Full detail view with metadata, status actions, linked documents
- `IncomingPostForm.tsx` — Registration form (subject, sender, category, urgency, received date)
- `StatusTransitionModal.tsx` — Confirmation modal for status changes (advice request, forward, reject, close, archive)
- `AdviceResponseModal.tsx` — Modal for Secretary/VP to provide advice
- `index.ts` — barrel export

**Pages:**
- `page.tsx` — List page with filters (category, status, urgency)
- `create/page.tsx` — Registration page
- `[id]/page.tsx` — Detail page with status workflow actions

## Phase 4: Integration

1. **Routes** — Add to `src/routes/index.tsx`: `/incoming-post`, `/incoming-post/create`, `/incoming-post/:id`
2. **Navigation** — Add menu item to `src/assets/data/menu-items.ts` (icon: `bx:mail-send`, positioned after Documents)
3. **Documents constants** — Add `'incoming_post'` option to `ENTITY_TYPE_OPTIONS` and `ENTITY_TYPE_LABELS` in documents/constants.ts
4. **Audit logs constants** — Add 6 new audit actions to badge variants, labels, and action options
5. **Document notification trigger** — Update `notify_document_uploaded` to handle `incoming_post` entity type link

## Phase 5: Documentation

- PRE restore point before execution
- POST restore point after completion

## Technical Notes

- No new storage buckets — documents attached via existing `documents` table with `entity_type = 'incoming_post'`
- Secretary CANNOT forward/reject/close/archive — enforced at DB trigger level AND UI level (buttons hidden)
- Archive is terminal — trigger-enforced immutability identical to `prevent_closed_case_update` pattern
- Reference numbers use a DB function with advisory lock to prevent race conditions

