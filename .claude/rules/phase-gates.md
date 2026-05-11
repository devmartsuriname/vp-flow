# VP-Flow — Phase Gate Rules

A phase gate is a hard stop between execution phases. No phase may begin without passing through its gate.

## Current Phase Gate Status

| Phase | Status | Gate Decision |
|---|---|---|
| v1.0 → v1.3 + Priority 1 + Priority 3 | COMPLETE | FROZEN |
| v2.0 Phase 1A.1 — Push Notifications | CLOSED | Closed 2026-05-11 via TC-005. Smoke test passed (200 OK). POST restore point: RP_PushNotifications_POST_TC005.md |
| v2.0 Phase 1A.2 — Email Notifications | BLOCKED | Cannot start until 1A.1 is formally closed |
| v2.0 Phase 1B+ | BLOCKED | Cannot start until 1A is complete |

## Gate Rules

1. A phase is only OPEN when Delroy has said "Goedgekeurd" on the preceding TC.
2. A phase is only CLOSED when a POST restore point exists and Delroy has confirmed closure.
3. Claude Code must STOP after each phase and report. It does NOT self-advance.
4. Mid-flight phases (like v2.0 Phase 1A.1) must be formally closed via a TC before new work begins.
5. If a phase has active uncommitted work (recent commits without TC), it is considered UNSEALED — treat as blocked until Delroy decides.

## Lane Discipline (required per implementation task)

| Lane | Type | Gate Requirement |
|---|---|---|
| Lane A | Copy, docs, non-functional CSS, comments | Single TC, no restore point required |
| Lane B | Components, hooks, non-RLS forms, tests | TC + PRE restore point + POST restore point |
| Lane C | Migrations, RLS, auth, edge functions, storage policies, audit logic, push/email infra | TC + PRE restore point + POST restore point + explicit Delroy re-confirmation before execution |

Lane C tasks are the highest risk category. Always stop and confirm with Delroy before executing.

## Unsealed Work (2026-05-11)

v2.0 Phase 1A.1 (Push Notifications) has recent commits that were not formally closed via TC:
- 4e685aa — Fix push toggle hang
- 9235b3b — Add push toggle flow
- 5dc8d43 — Split phase 1A.1 post-execution

This work is UNSEALED. Before any new v2.0 work begins, Delroy must decide:
- Option A: Issue a closing TC that formally seals Phase 1A.1 as complete (with final POST restore point)
- Option B: Issue a continuation TC that picks up from current state and defines remaining push work
