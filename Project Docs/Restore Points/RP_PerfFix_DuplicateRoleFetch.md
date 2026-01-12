# Restore Point: Performance Fix — Duplicate Role Fetch Elimination
**Created:** 2026-01-12
**Purpose:** Backup before removing useUserRole() from data hooks

## Pre-Change State
- **Files:** 
  - `src/app/(admin)/appointments/hooks/useAppointments.ts`
  - `src/app/(admin)/cases/hooks/useCases.ts`
  - `src/app/(admin)/audit-logs/hooks/useAuditLogs.ts`
- **Issue:** Each hook calls useUserRole() internally, causing duplicate network requests on every navigation

## Planned Change
- Remove useUserRole() from hooks
- Accept `role` as parameter instead
- Update call-sites to pass role from useAuthContext()

## Rollback Instructions
Restore the three hook files to use internal useUserRole() calls.

## Verification Criteria
- Single role request per navigation
- No duplicate spinners
- Module switching delay reduced
- All role-based filtering still works
