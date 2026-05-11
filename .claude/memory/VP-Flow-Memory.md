# VP-Flow — Project Memory
# For Claude Code session context

**Last Updated:** 2026-05-11
**Source:** 2026-05-11 Codex Source of Truth Audit

---

## What This System Is

VP-Flow is the appointment and case management system for the Office of the Vice President of Suriname. It is an internal, cabinet-level system. No public access. No external integrations beyond Supabase.

---

## What Is Built (verified by 2026-05-11 audit)

All of the following are confirmed implemented in code:

- Supabase auth with persistent sessions
- Role model: VP, Secretary, Protocol (app_role enum, user_roles table, useUserRole hook)
- Guest/client CRUD
- Appointment CRUD and status workflow
- Case CRUD, close, reopen (VP-only), timeline
- Audit logs page and triggers (VP-only UI)
- In-app notification list, dropdown, unread count, mark read
- User management (VP/Secretary distinctions, Protocol blocking)
- Settings, profile, theme, push toggle UI
- Documents: upload, lifecycle states, versioning, status changes, private storage
- Notes: entity links, dashboard widgets, VP-only visibility
- Handwriting: canvas capture, note_handwriting table, private storage bucket
- Incoming Post: list, create, detail, status workflow, archive (immutable)
- PWA: manifest, app-shell caching, offline mutation guard
- Push notification infrastructure: push_subscriptions table, sw-push.js, Edge Function (partially)

---

## What Is NOT Built (v2.0 remaining)

- Email notifications (no send-transactional-email function)
- Notification preferences (no table, no UI)
- Rich text notes (notes are plain text)
- Document templates (no table, no UI)
- Reopen count limits (no reopen_count column)
- Category filtering (cross-module)
- Complete push notification delivery (VAPID secrets, Edge Function completion)
- Device-first UX improvements

---

## Known Conflicts (awaiting Delroy decision)

1. Protocol settings access:
   - Docs say: Protocol has full Settings access
   - Code says: Protocol is blocked from Settings
   - Status: OPEN — do not touch until decision

2. Global search route:
   - Bug: guest results link to /guests/:id
   - Actual route: /clients/:id
   - Status: OPEN — awaiting TC

3. Push notifications:
   - v2.0 docs say: awaiting Phase 2 authorization
   - Code: partially started (push_subscriptions, sw-push.js, Edge Function exist)
   - Status: continuation requires approved TC

---

## Security Notes (do not ignore)

- Hard-coded Supabase URL in one push migration — must be fixed via TC
- Push Edge Function CORS is * — review before production
- Service-role push delivery — secrets require manual Supabase verification
- Public sign-up route exists — onboarding policy must be confirmed

---

## Governance Context

- Delroy is the sole decision-maker
- All implementation requires an approved Task Contract in /Task Contracts/
- Devmart Guardian Rules v2.1 are always active
- No code changes without TC. No TC without Delroy's "Goedgekeurd"

---

## Key Files to Know

| File | Purpose |
|---|---|
| src/routes/index.tsx | All app routes |
| src/context/useAuthContext.tsx | Auth and session |
| src/hooks/useUserRole.ts | Role model client |
| supabase/migrations/ | All DB migrations (additive only) |
| Project Docs/Master_Project_Plan.md | Phase overview (partially stale) |
| Project Docs/Tasks.md | Task list (partially stale — v1.1+ marked as blocked but implemented) |
| Project Docs/Reports/ | Authoritative status reports |
| Task Contracts/ | All approved TCs |
| Project Restore Points/ | All restore points |
