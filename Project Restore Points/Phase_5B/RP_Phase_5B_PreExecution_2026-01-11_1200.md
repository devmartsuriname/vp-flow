# VP-Flow — Restore Point: Phase 5B Pre-Execution

**Created:** 2026-01-11 12:00  
**Phase:** 5B — Controlled Consolidation  
**Type:** Pre-Execution Restore Point

---

## Summary of Intended Changes

Phase 5B consolidation will:
1. Remove duplicate `FallbackLoading.tsx` component
2. Update `AuthLayout.tsx` to use `LoadingFallback.tsx`
3. Delete dead Darkone demo directories
4. Delete unused components with zero imports

---

## Files Targeted for DELETION

### Duplicate Component
- `src/components/FallbackLoading.tsx`

### Demo Directories (Not Routed/Imported)
- `src/app/(admin)/base-ui/` (entire directory)
- `src/app/(admin)/forms/` (entire directory)
- `src/app/(admin)/tables/` (entire directory)
- `src/app/(admin)/maps/` (entire directory)
- `src/app/(admin)/apex-chart/` (entire directory)

### Unused Components (Zero Imports)
- `src/components/Spinner.tsx`
- `src/components/Preloader.tsx`
- `src/components/ComingSoon.tsx`
- `src/components/from/` (entire directory)
- `src/components/VectorMap/` (entire directory)

---

## Files Targeted for MODIFICATION

- `src/layouts/AuthLayout.tsx` — Import change only (FallbackLoading → LoadingFallback)

---

## Files Targeted for CREATION

- `Project Docs/Phase_5B_Execution_Report.md`
- `Project Restore Points/Phase_5B/RP_Phase_5B_PostExecution_2026-01-11_HHMM.md`

---

## Verification Criteria

After execution:
1. Admin routes work (no missing imports)
2. AdminLayout renders correctly
3. AuthLayout renders correctly
4. No console errors
5. Identical runtime behavior

---

## Rollback Instructions

If rollback is needed:
1. Restore deleted files from git history
2. Revert `AuthLayout.tsx` import change
3. Delete created restore point and execution report

---

**Status:** READY FOR EXECUTION
