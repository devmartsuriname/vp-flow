# VP-Flow — Source of Truth Audit Report (Canonical)

**Date:** 2026-05-11
**Auditors:** Codex (OpenAI) + Claude Code (Anthropic) — independent parallel audits
**Compiled by:** Devmart (Claude.ai / Cowork)
**Type:** Read-only audit — no files modified during audit
**Status:** AUTHORITATIVE — supersedes individual audit files

---

## 1. Executive Summary

Both independent audits (Codex and Claude Code) reached the same macro conclusion: the VP-Flow codebase is substantially ahead of the original planning documentation. v1.0 through Priority 3-B are fully implemented. v2.0 Phase 1A.1 (Push Notifications) is mid-implementation and unsealed. Phase 6 (Deployment & Handover) remains blocked by VP Office authorization.

**Source of truth hierarchy (confirmed):**
1. Active codebase
2. March 25, 2026 Authoritative Status Report + restore points
3. Per-version completion reports
4. Master_Project_Plan.md and Tasks.md — stale, corrected 2026-05-11 (use for history only)

**Repo readiness:** READY for Claude Code continuation — governance scaffolding installed 2026-05-11.

---

## 2. Confirmed Implemented (verified in code by both audits)

- Auth / session management (Supabase auth, persistent sessions)
- Role model: VP, Secretary, Protocol (app_role enum, user_roles, useUserRole)
- Guest/Client CRUD (route: /clients/:id, UI label: Guests)
- Appointment CRUD and status workflow
- Case CRUD, close, reopen (VP-only), timeline, audit integration
- Audit logs: append-only, VP-only UI, triggers on all modules
- In-app notifications: list, dropdown, unread count, mark read/all read
- User management: VP/Secretary distinctions, Protocol blocking
- Settings: profile, theme, system info, push toggle (Protocol currently excluded — TC-001 pending)
- Documents: upload, lifecycle states, versioning, status changes, private storage (50MB)
- Notes: VP-only, entity links, dashboard widgets
- Handwriting: perfect-freehand dep, note_handwriting table, private storage bucket, RLS, audit (UI canvas component existence requires manual verification)
- Incoming Post: list, create, detail, 9-state status workflow, archive (immutable)
- PWA: manifest, app-shell caching, offline mutation guard (offline writes deliberately disabled)
- Push notification infrastructure: push_subscriptions table, sw-push.js, Edge Function (JWT + trigger-source gate), PushNotificationToggle in Settings — PARTIALLY COMPLETE, Phase 1A.1 unsealed

---

## 3. Documentation vs Code — Key Findings

| Item | Status | Action |
|---|---|---|
| v1.0 core | MATCHES CODE | No action |
| v1.1 Documents, Notes, PWA | MATCHES CODE (Tasks.md was stale — corrected) | Corrected 2026-05-11 |
| v1.2 In-app Notifications | MATCHES CODE | No action |
| v1.3 deepening | MATCHES CODE | No action |
| Priority 1 Global Search | CONFLICT — route bug | TC-002 |
| Priority 3-A Handwriting | MATCHES CODE (canvas UI needs manual confirm) | Manual verify |
| Priority 3-B Incoming Post | MATCHES CODE | No action |
| v2.0 Push Notifications | PARTIALLY STARTED — unsealed | TC-003 |
| v2.0 Email / Prefs / Templates etc. | DOC ONLY — not started | Future TCs |
| Phase 6 Deployment | BLOCKED — VP Office authorization | No code action |
| Protocol Settings access | CONFLICT — code vs docs | TC-001 |
| Protocol dashboard | Redirect to /appointments — not a dedicated dashboard | Doc update needed |

---

## 4. Open Conflicts — Decisions Made (2026-05-11)

| Conflict | Decision | Action |
|---|---|---|
| Protocol Settings access | Protocol GETS access (3 cards: Profile, Theme, System Info) | TC-001 DRAFT |
| Global Search /guests/:id vs /clients/:id | Label "Guests" is correct; route /clients/:id is correct; link in hook is a bug | TC-002 DRAFT |
| v2.0 Phase 1A.1 unsealed | Optie B — continuation TC from current state | TC-003 DRAFT |

---

## 5. Security Findings

| # | Finding | Severity | Source | Action |
|---|---|---|---|---|
| S1 | Hard-coded Supabase URL + anon JWT in push-trigger SQL migration | MEDIUM | Codex | Future Lane C TC (anon key is public-by-design, but complicates rotation) |
| S2 | Push Edge Function CORS: * | LOW | Codex | TC-003 — narrow before Phase 1A.1 closure |
| S3 | Service-role push delivery scope | LOW | Both | Acceptable — narrowly scoped read of push_subscriptions |
| S4 | Protocol Settings access discrepancy | MEDIUM | Both | TC-001 (resolved by decision) |
| S5 | Public sign-up route — onboarding policy unconfirmed | LOW | Codex | Awaiting Delroy confirmation |
| S6 | pg_net extension — new outbound surface | LOW | Claude Code | Acceptable — outbound HTTPS to fixed Edge Function URL only |
| S7 | Lovable-tagger dev residue | — | Claude Code | Production-safe, cleanup optional (Lane A) |

No CRITICAL or HIGH findings.

---

## 6. Open Work

### v1.x Issues (not fully resolved)
- TC-001: Protocol Settings access (DRAFT — awaiting approval)
- TC-002: Global Search route bug (DRAFT — awaiting approval)
- Handwriting canvas UI component — manual verification pending
- Protocol dashboard — doc update needed (it redirects to /appointments, not a dedicated dashboard)

### v2.0 Remaining Scope
| Item | Priority | Status |
|---|---|---|
| Push Notifications | P1 | TC-003 DRAFT |
| Email Notifications | P1 | BLOCKED (Phase 1A.1 must close first) |
| Notification Preferences | P2 | Not started |
| Device-First UX | P2 | Not started |
| Rich Text Notes | P2 | Not started |
| Document Templates | P2 | Not started |
| Category Filtering | P3 | Not started |
| Reopen Count Limits | P3 | Not started |

### Blocked
- Phase 6: VP Office authorization required
- Email Notifications: Phase 1A.1 must close first + email provider/DNS setup

### Killed (confirmed not in codebase)
Background sync, offline write, public portals, multi-tenant, calendar sync, OCR, AI/ML, chat, signature verification.

---

## 7. Audit Divergences (Codex vs Claude Code)

Codex caught (missed by Claude Code): hard-coded URL in migration (S1), CORS * (S2), Protocol dashboard redirect detail, public sign-up policy question.

Claude Code caught (missed by Codex): in-flight unsealed Phase 1A.1 commits, exact migration count (40), Lovable-tagger residue, pg_net surface, tighter governance framing with Lane model.

Both audits are consistent on all macro findings. This merged report is authoritative.

---

## 8. Governance Scaffolding Installed (2026-05-11)

The following were created on 2026-05-11 by Devmart (Cowork):

| Item | Location |
|---|---|
| CLAUDE.md | /.claude/CLAUDE.md |
| settings.json | /.claude/settings.json |
| governance.md | /.claude/rules/governance.md |
| do-not-touch.md | /.claude/rules/do-not-touch.md |
| phase-gates.md | /.claude/rules/phase-gates.md |
| writing-plans.md | /.claude/skills/writing-plans.md |
| task-contract.md | /.claude/skills/task-contract.md |
| VP-Flow-Memory.md | /.claude/memory/VP-Flow-Memory.md |
| Task Contracts/ | /Task Contracts/ |
| PHASE-GATE.md | /Project Restore Points/PHASE-GATE.md |

---

## 9. Next Actions (in order)

1. Delroy reviews and approves TC-001 (Protocol Settings) — Lane B
2. Delroy reviews and approves TC-002 (Global Search route) — Lane B
3. Claude Code executes TC-001 and TC-002 (can run sequentially)
4. Delroy reviews and approves TC-003 (Push Notifications Phase 1A.1 continuation) — Lane C
5. Delroy re-confirms before Claude Code begins Lane C execution on TC-003
6. After TC-003 CLOSED: Phase 1A.2 (Email Notifications) unblocks — new TC required
