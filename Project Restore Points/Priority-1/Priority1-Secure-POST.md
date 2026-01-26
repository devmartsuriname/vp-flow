# Restore Point: Priority 1 Secure — POST-EXECUTION
**Created:** 2026-01-26
**Phase:** Priority 1 — Deadline Warnings + Global Search
**Status:** POST-EXECUTION

## Execution Summary

### A) Deadline/Warning Notifications — COMPLETE
- **Function Created:** `check_and_notify_deadlines()` (SECURITY DEFINER)
- **Security Type:** DEFINER (verified)
- **No HTTP calls:** Direct SQL INSERTs only
- **No secrets in SQL:** Confirmed
- **Categories Used:** `case`, `appointment` (existing only)

### B) Global Search (Read-Only) — COMPLETE
- **Hook Created:** `src/hooks/useGlobalSearch.ts`
- **Component Created:** `src/components/layout/TopNavigationBar/components/GlobalSearch.tsx`
- **TopNavigationBar Updated:** Placeholder replaced with GlobalSearch
- **RLS Enforced:** Queries use authenticated supabase client
- **Protocol Restriction:** Cases excluded for Protocol role

## Files Created
| File | Purpose |
|------|---------|
| `src/hooks/useGlobalSearch.ts` | Search hook with parallel RLS-enforced queries |
| `src/components/layout/TopNavigationBar/components/GlobalSearch.tsx` | Search UI with categorized results |
| `Project Restore Points/Priority-1/Priority1-Secure-PRE.md` | Pre-execution restore point |

## Files Modified
| File | Change |
|------|--------|
| `src/components/layout/TopNavigationBar/page.tsx` | Replaced placeholder search with GlobalSearch component |

## Database Changes
| Type | Name | Description |
|------|------|-------------|
| Function | `check_and_notify_deadlines()` | SECURITY DEFINER deadline check function |

## pg_cron Scheduling (Manual Step Required)
The following SQL must be executed in the Supabase SQL Editor to enable automated scheduling:

```sql
-- Enable pg_cron extension (if not already)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Idempotent: Remove existing job if present
SELECT cron.unschedule('check-deadlines-hourly') 
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'check-deadlines-hourly'
);

-- Schedule the job (hourly at minute 0)
SELECT cron.schedule(
  'check-deadlines-hourly',
  '0 * * * *',
  'SELECT public.check_and_notify_deadlines()'
);
```

| Property | Value |
|----------|-------|
| Job Name | `check-deadlines-hourly` |
| Schedule | `0 * * * *` (hourly at minute 0) |
| Function | `public.check_and_notify_deadlines()` |

## Compliance Verification
- [x] No schema changes (no new tables, no enum extensions)
- [x] No secrets in SQL
- [x] No pg_net HTTP calls
- [x] Uses existing notification categories only
- [x] RLS enforced for Global Search
- [x] Darkone 1:1 UI compliance
- [x] Protocol role restricted from cases

## Rollback Instructions
1. Delete created files:
   - `src/hooks/useGlobalSearch.ts`
   - `src/components/layout/TopNavigationBar/components/GlobalSearch.tsx`
2. Restore TopNavigationBar to use placeholder search:
   - Remove GlobalSearch import
   - Restore original form element (lines 16-21)
3. Drop function: `DROP FUNCTION IF EXISTS check_and_notify_deadlines()`
4. Unschedule cron (if enabled): `SELECT cron.unschedule('check-deadlines-hourly')`
