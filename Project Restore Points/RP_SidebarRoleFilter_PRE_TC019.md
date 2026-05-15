# RP — Sidebar Protocol Role Filtering — PRE (TC-019)

**Date:** 2026-05-15
**TC:** TC-019
**Lane:** B
**Phase:** v2.0 Pre-Deployment

## Current State

File: `src/components/layout/VerticalNavigationBar/page.tsx`
- Reads role via `useAuthContext()`
- Uses `VP_ONLY_MENU_KEYS = ['notes', 'audit-logs']` to hide notes + audit-logs from non-VP users
- No filtering specific to Protocol role — Protocol currently sees all non-VP items
  (Dashboard, Guests, Appointments, Cases, Documents, Incoming Post, Notifications, User Management, Settings)

File: `src/assets/data/menu-items.ts`
- Single central definition of MENU_ITEMS (12 entries including title)
- Keys: menu (title), dashboards, clients, appointments, cases, documents,
  incoming-post, notes, audit-logs, notifications, users, settings

Role helpers in `src/hooks/useUserRole.ts`: `isVP`, `isSecretary`, `isProtocol`, `isVPOrSecretary`.

## What Will Change
Extend filter logic in `VerticalNavigationBar/page.tsx` to hide additional menu items
from Protocol role per TC-019 scope.

## What Will NOT Change
- menu-items.ts (no menu definition changes)
- AppMenu.tsx (rendering unchanged)
- Auth, RLS, routing logic
- Topbar Notifications bell (separate component)
