# Phase 4 — Module 7: User & Role Management
## PRE-Implementation Restore Point

**Created:** 2026-01-10
**Module:** 7 — User & Role Management (UI Layer)
**Status:** PRE-implementation snapshot

---

## Authorization Reference

- Module 7 authorized per user instruction
- Scope: Read-only User Management UI
- Constraints: No schema/RLS changes, Darkone 1:1 only

---

## Completed Modules (1-6)

| Module | Status | Files |
|--------|--------|-------|
| 1. Clients | Complete | 14 files |
| 2. Appointments | Complete | 18 files |
| 3. Cases | Complete | 14 files |
| 4. Audit Logs | Complete | 7 files |
| 5. Notifications | Complete | 14 files |
| 6. Case Timeline | Complete | 10 files |

---

## Module 7 Scope

**Implementing:**
- Users list page (`/users`)
- Role badges (VP/Secretary/Protocol)
- Status badges (Active/Inactive)
- Search and status filters
- Role-based data fetching

**Role Access:**
- VP: Full access (all profiles + all roles)
- Secretary: Limited (all profiles, own role only)
- Protocol: Blocked (redirect to dashboard)

**Exclusions:**
- Create/edit/delete user capabilities
- Role assignment/modification
- User detail pages

---

## Files to Create

1. `src/app/(admin)/users/types.ts`
2. `src/app/(admin)/users/constants.ts`
3. `src/app/(admin)/users/hooks/useUsers.ts`
4. `src/app/(admin)/users/hooks/index.ts`
5. `src/app/(admin)/users/components/RoleBadge.tsx`
6. `src/app/(admin)/users/components/StatusBadge.tsx`
7. `src/app/(admin)/users/components/UserFilters.tsx`
8. `src/app/(admin)/users/components/EmptyState.tsx`
9. `src/app/(admin)/users/components/UsersTable.tsx`
10. `src/app/(admin)/users/components/index.ts`
11. `src/app/(admin)/users/page.tsx`

## Files to Modify

1. `src/routes/index.tsx` — Add /users route
2. `src/assets/data/menu-items.ts` — Add Users menu item

---

## Guardian Rules Compliance

- [x] Darkone Admin 1:1 only
- [x] No custom Bootstrap
- [x] No custom icons (bx:* family only)
- [x] No schema changes
- [x] No RLS changes
- [x] Read-only v1.0

---

**Snapshot captured. Proceeding with Module 7 implementation.**
