# Restore Point: v1.3-B Pre-Fix
**Created:** 2026-01-25
**Phase:** v1.3-B — Case Re-opening Enhancement
**Status:** PRE-FIX (Before frontend completion)

## Context
Database layer complete, frontend implementation partial. This restore point captures state before applying frontend fixes.

## Current State

### Database Layer (COMPLETE)
- `cases.reopen_reason` column: EXISTS
- `cases.reopened_at` column: EXISTS
- `cases.reopened_by` column: EXISTS
- `validate_case_reopen()` trigger: ACTIVE (enforces 10-char min, auto-populates fields)

### Application Layer (PARTIAL)

#### useReopenCase.ts
- `justification` parameter: OPTIONAL (should be REQUIRED)
- Client-side validation: MISSING
- `reopen_reason` field in payload: MISSING (only appends to vp_notes)

#### ReopenModal.tsx
- Label: "Justification (optional)" — should be required
- 10-char validation: MISSING
- Character counter: MISSING
- Submit disabled logic: MISSING

#### CaseDetail.tsx
- Reopen indicator: MISSING (should show reopened_at + reopen_reason)

## Files to Modify
1. `src/app/(admin)/cases/hooks/useReopenCase.ts`
2. `src/app/(admin)/cases/components/ReopenModal.tsx`
3. `src/app/(admin)/cases/components/CaseDetail.tsx`

## Rollback Instructions
Restore files to current state if frontend fixes cause issues.
