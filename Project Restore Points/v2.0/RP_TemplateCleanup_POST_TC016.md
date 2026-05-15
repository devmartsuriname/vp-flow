# Restore Point — POST TC-016 Template & Dead Code Cleanup

- **TC ID:** TC-016
- **Lane:** A (LOW risk)
- **Date:** 2026-05-15
- **Status:** EXECUTED

## Current State Summary

Bootstrap Darkone template dead code removed. Codebase clean prior to Phase 2 UX work.

## What Changed

### Deleted — Dead layout routes (verified zero imports)
- `src/app/(admin)/(layouts)/dark-mode/`
- `src/app/(admin)/(layouts)/dark-sidenav/`
- `src/app/(admin)/(layouts)/dark-topnav/`
- `src/app/(admin)/(layouts)/hidden-sidenav/`
- `src/app/(admin)/(layouts)/small-sidenav/`

### Deleted — Dead component / hook files (verified zero imports)
- `src/components/ThemeCustomizer.tsx`
- `src/components/ComponentContainerCard.tsx`
- `src/components/CustomFlatpickr.tsx`
- `src/hooks/useModal.ts`
- `src/hooks/useFileUploader.ts`

### Console statements removed
- `src/app/(admin)/(layouts)/dark-mode/components/DarkMode.tsx:8` — `console.log('bvdfbgd', changeTheme)` (removed by folder deletion)

All remaining `console.error` statements in `src/` are inside explicit try/catch error-handling flows and are retained per TC constraint.
Verified scope: `src/hooks/usePushSubscription.ts`, `useUserRole.ts`, `context/useAuthContext.tsx`, `components/ErrorBoundary.tsx`, `app/(admin)/**/hooks/*`, `settings/components/*`, `documents/page.tsx`, `notes/hooks/*`, `dashboards/hooks/*`, `cases/hooks/useCaseTimeline.ts`.

### AdminLayout footer fix
- `src/layouts/AdminLayout.tsx` — added `d-flex flex-column min-vh-100` to `.page-content` and `flex-grow-1` to inner `Container` so Footer pins to bottom on short pages (Cases empty, Documents empty, User Management).

## What Was Not Touched
- No DB, RLS, auth, edge function, migration, storage policy changes.
- No spacing/padding refactor outside the AdminLayout footer fix.
- No SCSS/CSS token or Bootstrap variable changes.
- `useLayoutContext.tsx` references to `showThemeCustomizer`/`toggleThemeCustomizer` state remain (out of scope; component file removal does not affect runtime — state is never consumed by a renderer).

## Verification
- `npm run lint` → **0 errors**, 7 warnings (all pre-existing, accepted via TC-009).
- `npm run build` → **0 errors**, built in 12.80s, PWA precache 113 entries (1850.93 KiB).
- No broken imports detected in build output.

## Risk Remaining

**LOW** — One scope item from TC could not be executed as written:

- TC-016 §4 (`+` placeholder artefacten on 5 list pages) — Searched all 5 list pages (`appointments/page.tsx`, `cases/page.tsx`, `documents/page.tsx`, `notes/page.tsx`, `incoming-post/page.tsx`) and PageTitle.tsx. No literal `+` text node, no empty `IconifyIcon icon=""`, and no extraneous element above the filter card found in source. The only `bx:plus` icons present are intentional inside the "New X" action buttons. If the `+` artefact is observed at runtime, it is likely produced elsewhere (e.g. PageTitle breadcrumb whitespace, a parent layout, or a CSS pseudo-element). Reported as a finding — awaiting Delroy direction.

## Files Modified
- `src/layouts/AdminLayout.tsx` (1 line change)

## Files Deleted
- 5 layout directories + 5 component/hook files (see "What Changed" above)
