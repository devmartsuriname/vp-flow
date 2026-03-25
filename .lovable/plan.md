# v2.0 Phase 1: Architecture & Implementation Plan

## Scope

Create `Project Docs/v2.0/v2.0_Architecture_and_Execution_Plan.md` with full module breakdown, database impact, service design, sequencing, and risk controls. Restore point discipline enforced.

## Findings from Codebase Exploration

**Current state relevant to v2.0:**

- **Notifications module exists** (`src/app/(admin)/notifications/`) — in-app notifications with `notifications` table, RLS, unread count, mark-as-read. Categories: case, appointment, document, system. Triggers generate notifications on status changes.
- **No service worker** — no push notification infrastructure exists.
- **No Edge Functions** — `supabase/functions/` is empty.
- **No email sending** — no email integration of any kind.
- **Notes module** (`src/app/(admin)/notes/`) — plain text only, no rich text editor.
- **Documents module** (`src/app/(admin)/documents/`) — has status workflow (draft/final/archived), version chain.
- **Incoming Post module** (`src/app/(admin)/incoming-post/`) — 9-status state machine.
- **Cases module** — has reopen logic but no reopen count limits.
- **11 existing tables** with full RLS and audit triggers.

## Deliverables

### File 1: `Project Restore Points/v2.0/RP-v2.0-Phase1-PRE.md`

Pre-execution snapshot: no architecture doc exists, no code/schema changes planned.

### File 2: `Project Docs/v2.0/v2.0_Architecture_and_Execution_Plan.md`

Contents:

**1. Module Breakdown (8 modules)**


| Module                   | Description                                             | Affected Existing Modules                         |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------------- |
| Push Notifications       | Browser push via service worker + Web Push API          | notifications (extends), settings (permission UI) |
| Email Notifications      | Email delivery for critical events via Edge Functions   | notifications (extends), no existing module       |
| Notification Preferences | Per-user channel/category preferences                   | notifications (extends), settings                 |
| Device-First UX          | Responsive improvements for mobile/tablet               | All UI modules (CSS/layout only)                  |
| Rich Text Notes          | Replace plain text with rich text editor (e.g., Tiptap) | notes                                             |
| Document Templates       | Predefined document templates for standardized creation | documents                                         |
| Category Filtering       | Advanced filtering by category across modules           | cases, appointments, incoming-post                |
| Reopen Count Limits      | VP-configurable max reopen count per case               | cases, settings                                   |


**2. Database Impact Analysis**


| Module                   | New Tables                                                                                  | Existing Tables Impacted                                     | RLS Implications                          | Migration Type                         |
| ------------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------- | -------------------------------------- |
| Push Notifications       | `push_subscriptions` (user_id, endpoint, keys, created_at)                                  | None                                                         | Owner-only RLS (user_id = auth.uid())     | Additive                               |
| Email Notifications      | None (uses Lovable email infra tables)                                                      | None                                                         | N/A (Edge Function with service role)     | Additive                               |
| Notification Preferences | `notification_preferences` (user_id, category, push_enabled, email_enabled, in_app_enabled) | None                                                         | Owner-only RLS                            | Additive                               |
| Device-First UX          | None                                                                                        | None                                                         | None                                      | No schema change                       |
| Rich Text Notes          | None                                                                                        | `notes` (content column: text→text, format stays compatible) | No RLS change                             | Additive (add `content_format` column) |
| Document Templates       | `document_templates` (id, name, description, entity_type, file_path, created_by)            | None                                                         | VP: full; Secretary: read; Protocol: none | Additive                               |
| Category Filtering       | None                                                                                        | None                                                         | None                                      | No schema change (UI-only)             |
| Reopen Count Limits      | None                                                                                        | `cases` (add `reopen_count` column, default 0)               | No RLS change                             | Additive (column + trigger update)     |


**3. Service Layer Design**

- **Push Notifications**: Service worker registration (`public/sw.js`), Web Push API, Edge Function `send-push-notification` to call Web Push endpoints. Requires VAPID key pair (stored as Supabase secrets).
- **Email Notifications**: Lovable email infrastructure (setup_email_infra + scaffold). Edge Function `send-transactional-email` with templates for: case deadline, appointment approved/rejected, document finalized, incoming post status change. Uses existing notification triggers as event source.
- **Notification Preferences**: Queried by push/email delivery logic before sending. No external dependency.
- **All others**: No service layer needed (UI-only or simple DB changes).

**4. Execution Sequencing**

```text
Phase 1A — Core Notifications (P1)
  ├── Step 1: Push Notifications infrastructure (service worker, VAPID, Edge Function)
  ├── Step 2: Email Notifications (Lovable email setup, templates, Edge Function wiring)
  └── Dependency: None (extends existing notification triggers)

Phase 1B — Notification Preferences (P2)
  ├── Step 1: Preferences table + RLS
  ├── Step 2: Settings UI for preferences
  ├── Step 3: Wire preferences into push/email delivery logic
  └── Dependency: Phase 1A (push + email must exist first)

Phase 1C — UX Improvements (P2)
  ├── Step 1: Rich Text Notes (Tiptap editor integration)
  ├── Step 2: Device-First UX (responsive audit across all modules)
  └── Dependency: None (independent of 1A/1B)

Phase 1D — System Extensions (P2/P3)
  ├── Step 1: Document Templates
  ├── Step 2: Category Filtering (UI-only)
  ├── Step 3: Reopen Count Limits
  └── Dependency: None (independent)
```

**5. Risk Control Plan (P1 Items)**


| Item                | RLS Risk Mitigation                                                                                        | Rollback Strategy                                                               | Failure Scenarios                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Push Notifications  | New `push_subscriptions` table: owner-only RLS. No v1.x table changes.                                     | Drop `push_subscriptions` table, remove service worker. Restore point per step. | Service worker registration fails → graceful fallback to in-app only. VAPID key rotation → re-subscribe flow.      |
| Email Notifications | No new RLS on v1.x tables. Edge Function uses service role. Email infra tables managed by Lovable tooling. | Remove Edge Functions, disable email domain.                                    | Email delivery failure → queue retry (pgmq). Domain not verified → emails queued but not sent until DNS completes. |


**6. Phase Breakdown Summary**


| Phase | Scope                          | Priority | Dependencies | Estimated Complexity |
| ----- | ------------------------------ | -------- | ------------ | -------------------- |
| 1A    | Push + Email Notifications     | P1       | None         | High                 |
| 1B    | Notification Preferences       | P2       | 1A           | Medium               |
| 1C    | Rich Text Notes + Device UX    | P2       | None         | Medium               |
| 1D    | Templates + Filtering + Limits | P2/P3    | None         | Low-Medium           |


### File 3: `Project Restore Points/v2.0/RP-v2.0-Phase1-POST.md`

Post-execution: confirms architecture doc created, no code/schema changes.

**NOTE — PHASE 2 PRE-IMPLEMENTATION GATE (SECURITY & SCHEMA CONTROL)**

---

## CONTEXT

v2.0 Phase 1 (Architecture Planning) is approved.  
Before any implementation begins, strict validation is required.

---

## REQUIRED PRE-CONDITIONS FOR PHASE 2

### 1. Schema Change Control

For EACH schema change:

- Explicit migration plan
- Rollback plan per change
- Trigger compatibility validation
- Audit logging verification

No schema change allowed without full validation.

---

### 2. RLS Validation (MANDATORY)

- All new tables must define RLS BEFORE use
- Owner-based policies must be explicit
- No temporary open access allowed

---

### 3. Service Layer Security

For Edge Functions:

- Define who can trigger each function
- Enforce authentication checks
- Apply rate limiting (where applicable)
- Ensure all actions are audit logged

---

### 4. External Dependencies

- Email service must be verified before activation
- Push notification keys must be securely stored (Supabase secrets)
- No hardcoded credentials

---

## CONSTRAINTS

- No implementation without passing this gate
- No partial execution
- No bypassing validation

---

## STOP CONDITION

- Validation complete
- Await Phase 2 authorization

---

**Governance:**

- No assumptions
- Security first
- RLS is mandatory
- Audit logging is non-negotiable

---

**Await Further Instructions**  
  
What is NOT touched

- No v1.x files
- No code, schema, RLS, or UI changes
- No implementation
- All content sourced from verified scope definition and codebase analysis