# VP-Flow — CLAUDE.md
# Claude Code Session Rules & Project Identity

**Status:** ACTIVE
**Governance:** Devmart Guardian Rules v2.1
**Last Updated:** 2026-05-11
**Authority:** Delroy (Devmart) — sole decision-maker

---

## 1. Project Identity

VP-Flow is the System of Record for the Office of the Vice President of Suriname.
Cabinet-level internal system. Government-grade governance applies at all times.

- **Client:** Office of the Vice President of Suriname
- **Stack:** React + Vite + Supabase (RLS-first)
- **Repo:** C:\Users\delro\OneDrive\Documents\Devmart Github Repos\vp-flow
- **Tool chain:** Devmart (Claude.ai planning) → Claude Code (execution only)

---

## 2. Current Baseline (FROZEN)

The following versions are COMPLETE and FROZEN. Do not undo, refactor, or rewrite without an explicit approved Task Contract.

| Version | Scope | Status |
|---|---|---|
| v1.0 | Auth, Guests, Appointments, Cases, Audit, Users, Settings | FROZEN |
| v1.1 | Documents, Notes, PWA | FROZEN |
| v1.2 | In-app Notifications | FROZEN |
| v1.3 | Documents expansion, Case re-opening, Notifications deepening | FROZEN |
| Priority 1 | Global search, Deadline notifications | FROZEN |
| Priority 3-A | Handwriting (Notes, VP-only) | FROZEN |
| Priority 3-B | Incoming Post & Archive | FROZEN |
| v2.0 | Push notifications (partially started) | IN PROGRESS — requires TC |

---

## 3. Source of Truth Hierarchy

When documentation and code conflict, resolve in this order:

1. Active codebase (highest authority)
2. Latest authoritative reports in /Project Restore Points/ and /Project Docs/Reports/
3. Version completion reports (v1.x, Priority 1, Priority 3)
4. Master_Project_Plan.md and Tasks.md — historical reference only (partially stale as of 2026-05-11 audit)

---

## 4. Control Chain (Mode A — always active)

Delroy → Claude.ai (Cowork) → Task Contract DRAFT → Delroy approves → Claude Code executes

Claude Code NEVER starts implementation without an approved Task Contract in /Task Contracts/.

---

## 5. Guardian Rules (always active)

1. SCOPE DISCIPLINE — Do only what the Task Contract specifies. No extras.
2. AUDIT TRAIL — Document what you do and why. Restore points before and after.
3. AUTHORITY CHAIN — Delroy is the only one who approves output. Do not self-approve.
4. PHASE GATE — No next step without Delroy's explicit signal. Stop and report.
5. NO SUGGESTIONS — No scope suggestions unless Delroy asks.
6. DRAFT LABEL — All output is DRAFT until Delroy says "Goedgekeurd".
7. CHALLENGE FIRST — At every plan: 1 weak assumption + 1 missing constraint + 1 failure risk.

---

## 6. Read Before Write

Before modifying any file, read:
- The relevant module's components in /src/
- The corresponding migration files in /supabase/migrations/
- The module's documentation in /Project Docs/
- Any restore points referencing this module in /Project Restore Points/

---

## 7. Role Model (FROZEN — never change)

| Role | Authority | Restrictions |
|---|---|---|
| VP | Full — approve, close, reopen, audit | None |
| Secretary | Create appointments, view cases | No approve, no case close/reopen |
| Protocol | View approved appointments only | No case access, no notes, no documents |

RLS enforces these boundaries. UI checks are secondary. Never bypass RLS.

---

## 8. Do Not Touch — Permanently Excluded (KILLED)

- Background sync
- Offline write access
- Public / external portals
- Multi-tenant architecture
- Third-party calendar sync
- OCR / text extraction
- AI / ML decisioning
- Chat / messaging features
- Signature verification

---

## 9. Do Not Touch — Frozen v1.x Behavior

Do not modify without an explicit approved TC:
- Audit log system (triggers, tables, UI)
- Archive immutability logic
- Closed case immutability and reopen validation
- RLS policies for all frozen modules
- Role model and app_role enum

---

## 10. Supabase Migration Discipline

- All migrations must be ADDITIVE — never modify existing migration files
- Never hard-code service-role secrets, VAPID keys, or environment-specific URLs in migrations
- VAPID keys and service-role secrets must stay in Supabase secrets — not in code or .env
- After any migration: document it in the post-execution restore point

---

## 11. Task Contract Discipline

Every implementation task requires:
1. An approved Task Contract in /Task Contracts/
2. A restore point BEFORE execution
3. Implementation within TC scope only
4. A restore point AFTER execution
5. Build/lint validation
6. Report to Delroy — await next signal

No TC = No execution. No exceptions.

---

## 12. Restore Point Discipline

- Create restore point before any significant change
- Naming: RP_[Module]_[PRE|POST]_[description].md
- Location: /Project Restore Points/
- Content: current state summary, what changed, what was not touched, risks

---

## 13. Build Validation

After any UI change: run build and lint check before reporting completion.
After any migration: document in restore point and verify no regressions.

---

## 14. Known Issues (2026-05-11 audit — do not fix without approved TC)

| Issue | Severity |
|---|---|
| Global search: /guests/:id links but route is /clients/:id | MEDIUM — DECISION: bug in hook. TC-002 DRAFT |
| Protocol settings: docs say full access, code blocks Protocol | RESOLVED 2026-05-11 — TC-001 executed. Protocol gets Profile + Theme + System Info; Push toggle guarded internally |
| Push notifications: v2.0 partially started without authorized TC | MEDIUM — DECISION: Continuation TC-003 DRAFT |
| Hard-coded Supabase URL in push migration | MEDIUM |
| Push Edge Function CORS is * | LOW |
| Service-role push delivery — secrets unverified | MEDIUM |

---

## 15. v2.0 Authorized Scope (do not exceed)

| Item | Priority | Status |
|---|---|---|
| Push Notifications | P1 | Partially started — requires TC |
| Email Notifications | P1 | Not started |
| Notification Preferences | P2 | Not started |
| Device-First UX | P2 | Not started |
| Rich Text Notes | P2 | Not started |
| Document Templates | P2 | Not started |
| Category Filtering | P3 | Not started |
| Reopen Count Limits | P3 | Not started |

---

## 16. Skills

See /.claude/skills/ for session skills:
- writing-plans.md — implementation planning discipline
- task-contract.md — Task Contract format
- governance.md — full Guardian Rules reference

## 17. Memory

See /.claude/memory/VP-Flow-Memory.md for project memory and session context.

---

## 18. Lane Discipline (required for every implementation task)

| Lane | Type | Requirements |
|---|---|---|
| Lane A | Copy, docs, non-functional CSS | TC only |
| Lane B | Components, hooks, forms, tests | TC + PRE restore point + POST restore point |
| Lane C | Migrations, RLS, auth, edge functions, storage, audit, push/email | TC + PRE + POST + Delroy re-confirmation before execution |

Lane C is the highest risk. Always stop and re-confirm with Delroy before executing any Lane C task.

## 19. Unsealed Work (as of 2026-05-11)

v2.0 Phase 1A.1 Push Notifications has recent commits without formal TC closure:
- 4e685aa Fix push toggle hang
- 9235b3b Add push toggle flow

This phase is UNSEALED. See /.claude/rules/phase-gates.md for disposition options.
