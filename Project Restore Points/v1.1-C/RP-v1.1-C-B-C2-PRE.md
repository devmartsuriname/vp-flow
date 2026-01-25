# Restore Point: v1.1-C Phase C2 — PRE-EXECUTION
**Created:** 2026-01-25
**Phase:** C2 — Service Worker & Cache Strategy
**Status:** PRE-EXECUTION

## Current State Snapshot

### vite.config.ts — Workbox Configuration (C1 State)
```typescript
workbox: {
  // App shell caching ONLY - no API caching
  globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
  // Explicitly exclude API routes and data
  navigateFallback: '/index.html',
  navigateFallbackDenylist: [/^\/api/, /^\/rest/],
  // No runtime caching of API responses (READ-ONLY offline enforcement)
  runtimeCaching: []
}
```

### C2 Planned Enhancements
- Add `cleanupOutdatedCaches: true`
- Add `clientsClaim: true`
- Add `skipWaiting: true`
- Add `maximumFileSizeToCacheInBytes: 3 * 1024 * 1024`

### Files to Modify
- `vite.config.ts` (workbox section only)

### Explicitly NOT Touched
- Authentication logic
- RLS policies
- Database schema
- UI components
- Navigation/routing
- v1.0, v1.1-A, v1.1-B code

## Rollback Instructions
Revert vite.config.ts workbox section to C1 state (remove C2 enhancements).

## Governance
- Option B: PWA Only
- Darkone Admin 1:1 compliance enforced
- Guardian Rules active
