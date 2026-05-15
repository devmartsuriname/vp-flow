# Restore Point — PRE — TC-017 Pagination Hardening + Routing Fix

**Date:** 2026-05-15
**Task Contract:** TC-017
**Lane:** B (MEDIUM risk)
**Mode:** EXTENDED

## State Summary (BEFORE execution)

### Lists without server-side pagination (target: add `.range()` + `.count('exact')`)
- `src/app/(admin)/audit-logs/hooks.ts` — has `.limit(100)` only, no pagination
- `src/app/(admin)/appointments/hooks.ts` — unbounded
- `src/app/(admin)/incoming-post/hooks.ts` — unbounded
- `src/app/(admin)/cases/hooks.ts` — unbounded
- `src/app/(admin)/documents/hooks.ts` — unbounded
- `src/app/(admin)/notes/hooks.ts` — unbounded
- `src/app/(admin)/notifications/hooks.ts` — unbounded
- `src/app/(admin)/clients/hooks.ts` — unbounded

### Notifications dropdown
- `src/components/layout/TopNavigationBar/Notifications.tsx` — currently uses unbounded fetch + `.slice(0, 5)` (to be confirmed during execution)

### Routing bug — root cause identified
- `src/app/(admin)/notes/page.tsx` lines 23-30: useEffect redirects to `/dashboards` when `!isVP(role)`. Race condition: AuthContext sets `isLoading=false` BEFORE async role fetch resolves, so `role` is `null` briefly and `!isVP(null)` returns true → redirect fires.
- `src/app/(admin)/audit-logs/page.tsx` lines 24-29: identical pattern.
- Root cause is in the page components (NOT in auth/session files). Fix: add `role !== null` guard to the redirect condition. AuthContext is NOT modified.

## What is being touched
- 8 hook files + 8 page components (pagination)
- 1 notifications dropdown component
- 2 page components (routing bug — notes + audit-logs)

## What is NOT being touched
- AuthContext, useSession, Supabase auth hooks (frozen — Lane C)
- RLS policies, migrations, edge functions (frozen)
- Filter logic (must not break)
- Out-of-scope lists (Global Search, Dashboard recent, Users)

## Risks
- Low — additive pagination, no schema changes
- Filter + pagination interaction must keep current filter behavior
- Routing fix must not break sign-in redirect
