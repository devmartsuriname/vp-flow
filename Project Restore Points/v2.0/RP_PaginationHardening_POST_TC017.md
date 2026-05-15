# Restore Point — POST — TC-017 Pagination Hardening + Routing Fix

**Date:** 2026-05-15
**Task Contract:** TC-017
**Lane:** B (MEDIUM)
**Mode:** EXTENDED

## State Summary (AFTER execution)

### Server-side pagination implemented (PAGE_SIZE = 20)

| List | Hook | Change | Page-size constant |
|---|---|---|---|
| Audit Logs | `useAuditLogs(role, filters, page)` | replaced `.limit(100)` with `.range()` + `.select('*', { count: 'exact' })` | `AUDIT_LOGS_PAGE_SIZE = 20` |
| Appointments | `useAppointments(role, page)` | added `.range()` + `.select(..., { count: 'exact' })` | `APPOINTMENTS_PAGE_SIZE = 20` |
| Cases | `useCases(role, page)` | added `.range()` + `.select(..., { count: 'exact' })` | `CASES_PAGE_SIZE = 20` |
| Incoming Post | `useIncomingPosts(role, page)` | added `.range()` + `.select('*', { count: 'exact' })` | `INCOMING_POST_PAGE_SIZE = 20` |
| Documents | `useDocumentsPaginated(options, page)` (new sibling) | added paginated hook with `.range()` + count | `DOCUMENTS_PAGE_SIZE = 20` |
| Notes | `useNotes(page)` | added `.range()` + `.select(..., { count: 'exact' })` | `NOTES_PAGE_SIZE = 20` |
| Notifications | `useNotificationsPaginated(filters, page)` (new sibling) | added paginated hook with `.range()` + count | `NOTIFICATIONS_PAGE_SIZE = 20` |
| Guests | `useClientsPaginated(page)` (new sibling) | added paginated hook with `.range()` + count | `CLIENTS_PAGE_SIZE = 20` |

Hooks kept unchanged where other consumers exist (full-list use):
- `useClients()` — still used by `ClientSelector` (appointments form)
- `useDocuments()` — still used by `LinkedDocuments` (entity-scoped, naturally small)
- `useNotifications()` — extended with optional `limit?: number` (additive); used by topbar dropdown

### Notifications dropdown — query-level limit
- File: `src/components/layout/TopNavigationBar/components/Notifications.tsx`
- Before: `useNotifications({ status: 'all' })` + `.slice(0, 5)` after full fetch
- After: `useNotifications({ status: 'all', limit: 5 })` → query becomes `.select('*').order(...).limit(5)` at Supabase level

### Routing bug — root cause + fix
- **Root cause:** `AuthContext` sets `isLoading = false` *before* the asynchronous role fetch resolves (the role fetch is deferred via `setTimeout(0)` after auth state hydrates). On direct URL navigation to `/notes` or `/audit-logs`, the page's redirect-guard `useEffect` fires the redirect because `!authLoading && !isVP(null)` evaluates to true.
- **Fix location (NOT in auth layer):**
  - `src/app/(admin)/notes/page.tsx`
  - `src/app/(admin)/audit-logs/page.tsx`
- **Fix:** changed redirect condition from `!authLoading && !isVP(role)` to `!authLoading && role !== null && !isVP(role)`. The page now waits for role to be resolved (non-null) before deciding to redirect. The same guard is applied to the render-time `return null` short-circuit. AuthContext is NOT modified — stays Lane-C-protected.

### UI
- Pagination footer per list: `Showing X–Y of Z` label + `Page N of M` + react-bootstrap `<Pagination.Prev />` / `<Pagination.Next />`.
- Filter changes reset to page 1 where applicable (audit-logs filters, documents entity-type filter, notifications status filter).

### Validation
- `npm run lint`: 0 errors, 7 pre-existing warnings (unchanged from TC-009 baseline).
- `npm run build`: PASS, built in 11.37s, 114 PWA precache entries.

### Files Modified
- `src/app/(admin)/audit-logs/hooks/useAuditLogs.ts`
- `src/app/(admin)/audit-logs/hooks/index.ts`
- `src/app/(admin)/audit-logs/page.tsx`
- `src/app/(admin)/appointments/hooks/useAppointments.ts`
- `src/app/(admin)/appointments/hooks/index.ts`
- `src/app/(admin)/appointments/page.tsx`
- `src/app/(admin)/cases/hooks/useCases.ts`
- `src/app/(admin)/cases/hooks/index.ts`
- `src/app/(admin)/cases/page.tsx`
- `src/app/(admin)/incoming-post/hooks/useIncomingPosts.ts`
- `src/app/(admin)/incoming-post/hooks/index.ts`
- `src/app/(admin)/incoming-post/page.tsx`
- `src/app/(admin)/documents/hooks/useDocuments.ts`
- `src/app/(admin)/documents/hooks/index.ts`
- `src/app/(admin)/documents/page.tsx`
- `src/app/(admin)/notes/hooks/useNotes.ts`
- `src/app/(admin)/notes/hooks/index.ts`
- `src/app/(admin)/notes/page.tsx`
- `src/app/(admin)/notifications/hooks/useNotifications.ts`
- `src/app/(admin)/notifications/hooks/index.ts`
- `src/app/(admin)/notifications/page.tsx`
- `src/app/(admin)/clients/hooks/useClients.ts`
- `src/app/(admin)/clients/hooks/index.ts`
- `src/app/(admin)/clients/page.tsx`
- `src/components/layout/TopNavigationBar/components/Notifications.tsx`

### NOT touched
- `src/context/useAuthContext.tsx` (Lane C boundary respected)
- Supabase auth hooks
- RLS policies / migrations / edge functions
- Filter logic (preserved — pagination resets to page 1 on filter change, no filter removal)
- Out-of-scope lists: Global Search, Dashboard recent widgets, User Management

### Risks
- Low. All changes additive and use standard Supabase range + count pattern.
- No DB schema changes. No RLS policy changes.
