# Restore Point: Priority 1 Secure — PRE-EXECUTION
**Created:** 2026-01-26
**Phase:** Priority 1 — Deadline Warnings + Global Search
**Status:** PRE-EXECUTION

## Frozen Baseline
- v1.0 through v1.3: FROZEN
- All governance rules intact
- Darkone 1:1 compliance maintained

## Execution Scope

### A) Deadline/Warning Notifications
- Create `check_and_notify_deadlines()` SQL function (SECURITY DEFINER)
- pg_cron scheduling (manual SQL Editor step)
- Uses existing notification categories only: `case`, `appointment`
- No schema changes

### B) Global Search (Read-Only)
- Create `useGlobalSearch.ts` hook
- Create `GlobalSearch.tsx` component
- Modify `TopNavigationBar/page.tsx`
- RLS-enforced, read-only

## Files to Create
| File | Purpose |
|------|---------|
| `src/hooks/useGlobalSearch.ts` | Search hook with parallel queries |
| `src/components/layout/TopNavigationBar/components/GlobalSearch.tsx` | Search UI component |

## Files to Modify
| File | Change |
|------|--------|
| `src/components/layout/TopNavigationBar/page.tsx` | Replace placeholder search with GlobalSearch |

## Database Changes
| Type | Description |
|------|-------------|
| Function | `check_and_notify_deadlines()` — SECURITY DEFINER |
| Cron | `check-deadlines-hourly` — hourly at minute 0 |

## State Before Execution
- TopNavigationBar has placeholder search input (lines 16-21)
- No global search hook exists
- No deadline notification function exists
- Notification categories: `case`, `appointment`, `document`, `system`

## Compliance Verification
- [ ] No schema changes
- [ ] No enum extensions
- [ ] No secrets in SQL
- [ ] No pg_net HTTP calls
- [ ] Uses existing categories only

## Rollback Instructions
1. Delete created files:
   - `src/hooks/useGlobalSearch.ts`
   - `src/components/layout/TopNavigationBar/components/GlobalSearch.tsx`
2. Restore TopNavigationBar placeholder search
3. Drop function: `DROP FUNCTION IF EXISTS check_and_notify_deadlines()`
4. Unschedule cron: `SELECT cron.unschedule('check-deadlines-hourly')`
