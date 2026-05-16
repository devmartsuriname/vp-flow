# VP-Flow — CLAUDE.md
# Claude Code Session Rules & Project Identity

**Status:** ACTIVE
**Governance:** Devmart Guardian Rules v2.1
**Last Updated:** 2026-05-15
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
| v2.0 | Hardening + Handoff (TC-016/017/018/022) | COMPLETE / FROZEN |

---

## 3. Source of Truth Hierarchy

When documentation and code conflict, resolve in this order:

1. Active codebase (highest authority)
2. Latest authoritative reports in /Project Restore Points/ and /Project Docs/Reports/
3. Version completion reports (v1.x, Priority 1, Priority 3) — archived to /archive/docs/ as of 2026-05-12
4. Master_Project_Plan.md and Tasks.md — archived to /archive/docs/ as of 2026-05-12 (do not use as authoritative source)

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

## 14. Known Issues (updated 2026-05-15)

| Issue | Severity |
|---|---|
| Global search: /guests/:id links but route is /clients/:id | RESOLVED 2026-05-11 — TC-002 executed. useGlobalSearch.ts line 70 now links to /clients/:id |
| Protocol settings: docs say full access, code blocks Protocol | RESOLVED 2026-05-11 — TC-001 executed. Protocol gets Profile + Theme + System Info; Push toggle guarded internally |
| Push notifications: v2.0 partially started without authorized TC | RESOLVED 2026-05-11 — TC-005 executed. Edge Function A3+ deployed, smoke test 200 OK |
| Email notifications CORS + auth split | RESOLVED 2026-05-12 — TC-006-A executed. CORS headers + OPTIONS handler + test/trigger auth split implemented. Both paths smoke tested. |
| LinkedNotes.tsx rules-of-hooks violation | RESOLVED 2026-05-12 — TC-008 executed. useQuery moved before early return; enabled: isVP(userRole) guard added. |
| 329 pre-existing lint errors | RESOLVED 2026-05-12 — TC-007 executed. npm run lint exits 0 errors. |
| 12 lint warnings in src/context/ + hooks | LOW — accepted 2026-05-12 via TC-009. 5 react-refresh (structural), 1 useMemo 8-dep (risky), 6 out-of-scope. No TC needed unless priority changes. |
| Hard-coded Supabase URL in push + email triggers | RESOLVED 2026-05-12 — TC-010 executed. Both trigger functions now read SUPABASE_PROJECT_URL from vault with NULL guard. Smoke test: email 200 / push 200. db-guard PASS. |
| No per-user notification opt-out for push + email | RESOLVED 2026-05-12 — TC-011 executed. notification_preferences table + Settings UI card + Edge Function preference checks live. Opt-out model: NULL/no row = send. Smoke tests A/B/C PASS. |
| Push + Email Edge Function CORS is * | LOW — deferred to Hostinger production deployment |
| Service-role push delivery — secrets unverified | MEDIUM — separate TC required |
| Auth pages wrong logo (navy PNG) | RESOLVED 2026-05-13 — TC-014 executed. All auth components now use vp-flow-logo-dark.svg. PWA icons replaced (purple). theme-color #7e67fe. Copyright footer added. |
| Template dead code + console.log | RESOLVED 2026-05-15 — TC-016. 5 dead layout dirs + 5 components/hooks verwijderd. AdminLayout footer fix. |
| Pagination ontbreekt op alle lijsten | RESOLVED 2026-05-15 — TC-017. Server-side pagination (PAGE_SIZE=20) op alle 8 lijsten. Notifications dropdown query-level .limit(5). |
| Routing bug /notes + /audit-logs redirect naar /dashboards | RESOLVED 2026-05-15 — TC-017. Race condition in render-guard opgelost in notes/page.tsx + audit-logs/page.tsx. |
| Settings scrollpagina te lang | RESOLVED 2026-05-15 — TC-018. 5-tab layout. Email Config tab verborgen voor Protocol. Push toggle geconsolideerd. Versienummer dynamisch (APP_INFO.version). |
| Deployment: Hostinger native git kopieert broncode zonder build | RESOLVED 2026-05-15 — GitHub Actions FTP deploy geconfigureerd. npm ci --legacy-peer-deps. Server IP 82.29.157.191. Auto-deploy bij push naar main. vpflow.app live. |

---

## 15. v2.0 Authorized Scope (do not exceed)

| Item | Priority | Status |
|---|---|---|
| Push Notifications | P1 | COMPLETE — TC-005. Phase 1A.1 closed 2026-05-11 |
| Email Notifications | P1 | COMPLETE — TC-006 + TC-006-A. Phase 1A.2 closed 2026-05-12 |
| Notification Preferences | P2 | COMPLETE — TC-011. Phase 1B closed 2026-05-12 |
| Device-First UX | P2 | Not started |
| Rich Text Notes | P2 | COMPLETE — TC-012. Phase 1C-A closed 2026-05-12 |
| Design Style Guide + Logo Set | P1 | COMPLETE — TC-014. Phase 1D closed 2026-05-13 |
| Document Templates | P2 | Not started |
| Category Filtering | P3 | Not started |
| Reopen Count Limits | P3 | Not started |
| Final Handoff Documentation | P1 | COMPLETE — TC-022. 7 MD bronbestanden + 7 PDFs. Closed 2026-05-15 |

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

## 19. Phase 1A Status (closed 2026-05-12)

Phase 1A.1 (Push Notifications) and Phase 1A.2 (Email Notifications) are both formally CLOSED.
See /.claude/rules/phase-gates.md for full gate status.
Phase 1B+ is BLOCKED until Delroy opens a new TC.
