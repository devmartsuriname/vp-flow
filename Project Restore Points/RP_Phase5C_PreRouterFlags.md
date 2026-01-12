# Restore Point: Pre-Router Flags
**Date:** 2026-01-12
**Phase:** Phase 5C — Technical Consistency
**Status:** PRE-EXECUTION

## Objective
Add React Router v7 future flags to eliminate deprecation warnings

## Target File
- `src/main.tsx`

## Planned Changes
- Add `future` prop to `BrowserRouter` with:
  - `v7_startTransition: true`
  - `v7_relativeSplatPath: true`

## State Before Execution
- BrowserRouter has no future flags
- Console shows 2 deprecation warnings

## Rollback
Revert to this point if router behavior breaks after flag addition
