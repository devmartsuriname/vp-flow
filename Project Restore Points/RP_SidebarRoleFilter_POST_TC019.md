# RP — Sidebar Protocol Role Filtering — POST (TC-019)

**Date:** 2026-05-15
**TC:** TC-019
**Lane:** B
**Phase:** v2.0 Pre-Deployment
**Status:** COMPLETE

## Changed Files
- `src/components/layout/VerticalNavigationBar/page.tsx` — added Protocol filter branch

## Implementation
- Imported `isProtocol` alongside `isVP` from `@/hooks/useUserRole`
- Added constant `PROTOCOL_VISIBLE_MENU_KEYS = ['menu', 'dashboards', 'appointments', 'settings']`
- Inserted `isProtocol(role)` branch in `useMemo` filter that whitelists only those keys
- VP and Secretary branches unchanged

## Visibility Matrix

| Menu Item | VP | Secretary | Protocol |
|---|---|---|---|
| Dashboard | ✓ | ✓ | ✓ |
| Guests | ✓ | ✓ | — hidden |
| Appointments | ✓ | ✓ | ✓ |
| Cases | ✓ | ✓ | — hidden |
| Documents | ✓ | ✓ | — hidden |
| Incoming Post | ✓ | ✓ | — hidden |
| Notes | ✓ | — hidden | — hidden |
| Audit Logs | ✓ | — hidden | — hidden |
| Notifications (page) | ✓ | ✓ | — hidden |
| User Management | ✓ | ✓ | — hidden |
| Settings | ✓ | ✓ | ✓ (retained per TC-018) |

## Validation
- `npm run lint` → 0 errors (7 pre-existing warnings, accepted via TC-009)
- `npm run build` → 0 errors, built in 11.08s, PWA generated
- VP/Secretary menus unchanged — verified by code path (existing branches untouched)
- Topbar Notifications bell unchanged (separate component, not in sidebar list)

## What Was Not Touched
- `src/assets/data/menu-items.ts` — no changes
- `src/components/layout/VerticalNavigationBar/components/AppMenu.tsx` — no changes
- Auth, RLS, routing, role-detection — no changes
- TopNavigationBar/Notifications.tsx (bell icon) — no changes

## Risk
LOW. UI-only filter. RLS remains the enforcement layer for any direct URL navigation
attempt by Protocol; this change only hides nav links.

## Interpretation Note
TC stated "Protocol ziet alleen: Dashboard en Appointments" but listed forbidden items
explicitly. Settings was not in forbidden list, and TC-018 grants Protocol access to
Settings (Profile + Theme + System Info). Simplest valid interpretation applied:
Settings remains visible. Flag for Delroy review if intent was stricter.
