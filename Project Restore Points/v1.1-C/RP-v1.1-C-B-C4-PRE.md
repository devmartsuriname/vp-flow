# Restore Point: v1.1-C Phase C4 PRE-VALIDATION
**Created:** 2026-01-25
**Phase:** C4 — Security & RLS Validation
**Status:** PRE-VALIDATION

## Purpose
Snapshot before security validation of PWA implementation (C1-C3).

## C1-C3 Completion Status
- C1: PWA Manifest & Icons — COMPLETE
- C2: Service Worker Setup — COMPLETE
- C3: Offline Read-Only Enforcement — COMPLETE

## Current Security Configuration

### RLS Status (All 12 Tables)
| Table | RLS Enabled | Policy Count |
|-------|-------------|--------------|
| appointments | Yes | 5 |
| appointment_attendees | Yes | 3 |
| cases | Yes | 3 |
| clients | Yes | 4 |
| documents | Yes | 4 |
| document_links | Yes | 4 |
| notes | Yes | 4 |
| note_links | Yes | 3 |
| notifications | Yes | 2 |
| user_profiles | Yes | 5 |
| user_roles | Yes | 5 |
| audit_events | Yes | 2 |
| protocol_events | Yes | 3 |
| reminders | Yes | 1 |

### Service Worker Configuration
- runtimeCaching: [] (empty — no API caching)
- globPatterns: static assets only
- navigateFallbackDenylist: [/^\/api/, /^\/rest/]
- maximumFileSizeToCacheInBytes: 3MB

### localStorage Usage
- `sb-*`: Supabase auth tokens (required)
- `__REBACK_NEXT_CONFIG__`: Darkone theme settings

### IndexedDB Usage
- None (not used in codebase)

### Offline Enforcement (C3)
- OfflineProvider context active
- OfflineBanner component active
- useOfflineMutationGuard hook available
- QueryClient networkMode: 'online'

## Validation Scope
1. RLS enforcement unchanged
2. Auth session gating functional
3. Service worker caches only static assets
4. No API response caching
5. No sensitive data in localStorage/IndexedDB
6. Offline mode is read-only
7. Audit posture unchanged

## Rollback
If security issues found, document and remediate before POST snapshot.
