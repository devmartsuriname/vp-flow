# Restore Point: v1.2-B Post-Execution
**Created:** 2026-01-25
**Phase:** v1.2-B — Settings UI Alignment
**Status:** POST-EXECUTION

## Changes Applied

### constants.ts
- `APP_INFO.version`: Updated from `1.0.0` to `1.2.0`

### SystemInfoCard.tsx
- Added `isPWAInstalled()` detection function
- Added PWA Status row with conditional badge:
  - "Installed" (soft-success) when running in standalone mode
  - "Browser" (soft-secondary) when running in browser tab

## Files Modified
- `src/app/(admin)/settings/constants.ts`
- `src/app/(admin)/settings/components/SystemInfoCard.tsx`

## Verification Checklist
- [x] Version displays as v1.2.0
- [x] PWA Status indicator appears in System Information card
- [x] Darkone 1:1 compliance (ListGroup.Item + Badge patterns)
- [x] No schema changes
- [x] No scope creep

## Rollback Instructions
Restore files from RP-v1.2-B-PRE.md state.
