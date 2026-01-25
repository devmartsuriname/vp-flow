# Restore Point: v1.1-C Phase C3 — PRE-EXECUTION
**Created:** 2026-01-25
**Phase:** C3 — Offline Read-Only Enforcement
**Status:** PRE-EXECUTION

## Current State Snapshot

### Offline Detection
- None exists in current codebase

### AppProvidersWrapper.tsx — QueryClient Configuration
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})
```

### Error Handling Pattern (Per-Page)
Each page has inline error handling with Darkone-compliant cards:
- IconifyIcon for error icon
- Card/CardBody wrapper
- "Try Again" button with page reload

### Files to Create
- `src/context/useOfflineContext.tsx`
- `src/components/OfflineBanner.tsx`
- `src/components/OfflineAwareError.tsx`
- `src/hooks/useOfflineMutationGuard.ts`

### Files to Modify
- `src/components/wrapper/AppProvidersWrapper.tsx`

## Explicitly NOT Touched
- Database schema
- RLS policies
- Audit triggers
- Navigation/routing
- Authentication logic
- Individual page components
- vite.config.ts
- v1.0, v1.1-A, v1.1-B code

## Rollback Instructions
Remove all C3 files and revert AppProvidersWrapper to pre-C3 state.

## Governance
- Option B: PWA Only
- Darkone Admin 1:1 compliance enforced
- Guardian Rules active
