# Restore Point: Auth Persistence Fix
**Created:** 2026-01-12
**Purpose:** Backup before fixing session persistence logout-on-refresh issue

## Pre-Change State
- **File:** `src/routes/router.tsx`
- **Issue:** Router evaluates `isAuthenticated` before session hydration completes, causing redirect to login on refresh

## Planned Change
- Add `isLoading` guard to wait for auth state hydration before route protection decisions
- Single file, 4-line addition

## Rollback Instructions
Remove the loading guard block (lines ~12-15 after change) to restore original behavior.

## Verification Criteria
- Refresh keeps user authenticated
- Hard refresh keeps user authenticated  
- Direct URL access works with valid session
- No auth flash during hydration
- Option A optimizations remain intact