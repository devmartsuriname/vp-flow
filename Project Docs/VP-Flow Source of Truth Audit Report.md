# VP-Flow Source of Truth Audit Report

## 1. Executive Summary

The active codebase is significantly more advanced than older planning docs such as `Master_Project_Plan.md` and `Tasks.md`. The best documentation match is the March 25, 2026 authoritative status report: it broadly matches the code for v1.0 through Priority 3-B.

Key conclusion: the source of truth is the current codebase plus the newer v1.3/Priority 3/March reports. `Tasks.md` and parts of `Master_Project_Plan.md` are stale and conflict with implemented code.

No files were modified, created, installed, or refactored during the original audit.

## 2. Actual Codebase State

| Area | State | Code Evidence |
|---|---:|---|
| React/Vite app | IMPLEMENTED | `package.json` |
| Auth/session | IMPLEMENTED | Supabase auth in `src/context/useAuthContext.tsx` |
| Routes/pages | IMPLEMENTED | Dashboard, guests, appointments, cases, documents, notes, incoming post, audit logs, notifications, users, settings in `src/routes/index.tsx` |
| Role model | IMPLEMENTED | `app_role` enum and `user_roles`; client helpers in `src/hooks/useUserRole.ts` |
| Documents | IMPLEMENTED | UI/hooks plus `documents` storage bucket and lifecycle/versioning migrations |
| Notes | IMPLEMENTED | VP-only notes UI/hooks, `notes`, `note_links`, audit triggers |
| Handwriting | IMPLEMENTED | Canvas components, `note_handwriting`, private `note-handwriting` bucket |
| Incoming Post | IMPLEMENTED | UI routes and `incoming_post` state machine migration |
| Archive behavior | IMPLEMENTED | Incoming post archive immutability trigger |
| Case reopening | IMPLEMENTED | Reopen hook/modal, DB trigger, reopen columns |
| Notifications | PARTIALLY IMPLEMENTED | In-app notifications implemented; push partially implemented; email/preferences missing |
| PWA/service worker | PARTIALLY IMPLEMENTED | VitePWA manifest/offline shell; push handler present |
| v2.0 work | PARTIALLY STARTED | Push subscription table, setting toggle, push Edge Function exist; other v2.0 modules missing |

## 3. Documentation vs Code Verification Matrix

| Document Claim | Source Document | Code Evidence | Status | Notes |
|---|---|---|---|---|
| v1.0 core modules complete | `Reports/VP-Flow - Authoritative Status Report` | Routes, hooks, Supabase tables for guests/appointments/cases/audit/users/settings | MATCHES CODE | Broadly supported |
| Phase 0-5 complete; Phase 6 not authorized | `Master_Project_Plan.md` | Code implements core system, but deployment cannot be verified locally | PARTIAL MATCH | Phase 6 status is governance, not code-verifiable |
| v1.1+ blocked/not implemented | `Tasks.md` | Documents, notes, PWA, handwriting, incoming post are present | CONFLICT | `Tasks.md` is stale |
| Documents module full CRUD/status/versioning | v1.1-A/v1.3-A docs | Documents page/hooks, storage bucket, status/version migrations | MATCHES CODE | Implemented |
| Case re-opening VP-only with mandatory reason | v1.3-B docs | `useReopenCase`, `ReopenModal`, `validate_case_reopen` | MATCHES CODE | Implemented |
| Notes module VP-only | v1.1-B docs | Notes routes/components/RLS policies | MATCHES CODE | Implemented |
| PWA read-only offline mode | v1.1-C docs | VitePWA config, offline context/mutation guard | PARTIAL MATCH | App shell/offline guard present; runtime behavior not tested |
| Handwriting Priority 3-A complete | Authoritative Status Report | `perfect-freehand`, handwriting components/table/storage | MATCHES CODE | Implemented |
| Incoming Post Priority 3-B complete | Authoritative Status Report | Incoming post routes/hooks/table/triggers/RLS | MATCHES CODE | Implemented |
| Global Search implemented | Authoritative Status Report | `useGlobalSearch` exists | PARTIAL MATCH | Guest result link uses `/guests/:id`, but actual route is `/clients/:id` |
| Push notifications deferred to v2.0 | v2.0 docs / Governance intake | Push code and migrations exist | CONFLICT | v2.0 Phase 1A push appears started |
| Email notifications planned | v2.0 architecture | No email Edge Function/templates found | DOC ONLY | Not implemented |
| Notification preferences planned | v2.0 architecture | No `notification_preferences` table/UI | DOC ONLY | Missing |
| Document templates planned | v2.0 architecture | No `document_templates` table/UI | DOC ONLY | Missing |
| Reopen count limits planned | v2.0 architecture | No `reopen_count` column found | DOC ONLY | Missing |
| Background sync/offline writes killed | Status/Governance docs | No background sync/offline write code found | MATCHES CODE | Must remain excluded |
| Protocol dashboard limited access | Authoritative Status Report | Protocol redirected from dashboard to appointments | PARTIAL MATCH | No separate dashboard route |
| Settings full access for Protocol | Authoritative Status Report | Settings redirects Protocol away | CONFLICT | Code says Protocol blocked |

## 4. Confirmed Implemented Items

- Supabase authentication with persistent sessions.
- Role model: VP, Secretary, Protocol via `user_roles`.
- Guest/client CRUD.
- Appointment CRUD and status workflow.
- Case CRUD, close, reopen, timeline/audit integration.
- Audit logs page, VP-only UI access, audit triggers.
- In-app notification list, dropdown, unread count, mark read/all read.
- User management with VP/Secretary distinctions and Protocol blocking.
- Settings/profile/theme/system cards plus push toggle.
- Documents upload, lifecycle states, versioning, status changes, private storage.
- Notes with entity links, dashboard widgets, VP-only visibility.
- Handwriting capture/storage linked to notes.
- Incoming post list/create/detail/status workflow/archive.
- PWA manifest/app-shell caching and offline mutation guard.
- Push notification infrastructure started: `push_subscriptions`, `sw-push.js`, Edge Function.

## 5. Partial / Missing / Conflicting Items

- `Tasks.md` conflicts with code: it says v1.1 features are blocked/missing, but they are implemented.
- v2.0 push notifications are partially implemented despite v2.0 docs saying architecture is awaiting Phase 2 authorization.
- Email notifications are documented/planned only; no `send-transactional-email` function found.
- Notification preferences are documented/planned only; no table/UI found.
- Rich text notes are missing; notes remain plain text.
- Document templates are missing.
- Reopen count limits are missing.
- Category filtering is not implemented as described in v2.0; notifications have status filtering, not cross-module category filtering.
- Global search is partially implemented but has a likely route bug: guest results link to `/guests/:id`, while routes define `/clients/:id`.
- Protocol settings access conflicts between docs and code.
- Protocol dashboard is not a dedicated dashboard; code redirects Protocol from `/dashboards` to `/appointments`.

## 6. Open Work

### v1.x Open Issues

Only items docs imply are done but code does not fully support:

- Global search guest route mismatch: `/guests/:id` vs `/clients/:id`.
- Protocol access matrix inconsistency: docs say Settings full access, code blocks Protocol.
- Protocol dashboard claim is only partially true; Protocol uses appointments, not a distinct limited dashboard.
- PWA/offline claims need manual browser verification; code is present, but runtime behavior was not tested.

### v2.0 Planned Work

- Email notifications.
- Notification preferences.
- Device-first UX audit/improvements.
- Rich text notes.
- Document templates.
- Category filtering.
- Reopen count limits.
- Complete and validate push notification delivery.

### Blocked Work

- Push delivery depends on VAPID public/private keys and `VAPID_SUBJECT`.
- Push Edge Function depends on Supabase function secrets and service-role configuration.
- Email notifications depend on email provider/domain setup and credentials.
- Deployment/handover remains governed by VP Office authorization.

### Killed / Excluded Work

Confirmed excluded and not found as implemented:

- Background sync.
- Offline write access.
- Public/external portals.
- Multi-tenant architecture.
- Third-party calendar sync.
- OCR/text extraction.
- AI/ML decisioning.
- Chat/messaging.

## 7. Security & Governance Findings

| Risk | Severity | Finding |
|---|---:|---|
| Hard-coded Supabase URL and anon JWT in push trigger migration | MEDIUM | One later migration embeds project URL and anon token in SQL. Anon key is public by design, but hard-coding environment-specific values complicates transfer and rotation. |
| Push Edge Function CORS is `*` | LOW | Function has auth checks, but broad CORS should be reviewed before production. |
| Service-role push delivery | MEDIUM | Edge Function uses service role to fetch cross-user subscriptions; intended, but secrets and invocation restrictions require manual verification. |
| RLS coverage | LOW | RLS is present for core and added tables in migrations, but actual deployed Supabase state was not queried. |
| Audit logging | MEDIUM | Broadly present for cases, appointments, documents, notes, incoming post, notifications. Coverage should be manually tested for all UI actions. |
| Protocol isolation | MEDIUM | Strong in RLS and UI for cases/documents/notes; matrix conflicts around Settings/Dashboard should be resolved. |
| Archive immutability | LOW | Incoming post archive immutability trigger exists. |
| Closed case behavior | LOW | Closed case immutability exists with explicit reopen exception. |
| Environment assumptions | MEDIUM | `.env` contains frontend Supabase and VAPID public variables only; Edge secrets are external and must be verified in Supabase. |
| Public sign-up route | LOW | Public sign-up exists. Unassigned users appear constrained by role checks/RLS, but onboarding policy should be confirmed. |

## 8. Claude Code Takeover Readiness

The repo is ready for Claude Code continuation only after documentation source-of-truth cleanup. The active codebase is coherent enough to continue, but the documentation has stale and conflicting authority layers that could cause future agents to undo implemented work or restart completed phases.

Recommended takeover stance: treat the March 25 authoritative report and active codebase as current baseline; treat `Tasks.md` and old master-plan v1.1 sections as historical unless updated.

## 9. Recommended CLAUDE.md Rules

Proposed structure:

- Project identity and current baseline.
- Source-of-truth hierarchy:
  1. Active codebase.
  2. Latest authoritative reports and restore points.
  3. Version completion reports.
  4. Older planning docs as historical only.
- Read-before-write rule for affected module, migrations, and docs.
- No changes to frozen v1.x behavior without explicit approval.
- Preserve role model: VP, Secretary, Protocol only.
- Preserve RLS-first design; UI checks are secondary.
- Do-not-touch exclusions: background sync, offline writes, OCR, public portals, multi-tenancy, calendar sync, AI/ML, chat.
- Restore point discipline before and after major implementation tasks.
- Supabase migration discipline: additive, reversible, documented.
- Never expose or hard-code service-role secrets.
- Validate with build/lint and targeted browser checks after UI changes.

## 10. Recommended Next Action

Create a documentation reconciliation task that updates `Tasks.md` and `Master_Project_Plan.md` to match the current codebase and March 25 authoritative status, without changing application code.
