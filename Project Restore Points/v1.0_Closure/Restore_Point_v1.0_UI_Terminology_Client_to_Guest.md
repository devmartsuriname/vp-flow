# Restore Point: v1.0 UI Terminology Update (Client → Guest)
**Date:** 2026-01-16
**Phase:** v1.0 Final Polish
**Status:** COMPLETE
**Execution Timestamp:** 2026-01-16T06:XX:XXZ

## Scope
Replace all user-facing "Client" terminology with "Guest" across UI components.

## Files to Modify (19 files)

### Navigation & Routing
1. `src/assets/data/menu-items.ts`
2. `src/routes/index.tsx`

### Clients Module Pages
3. `src/app/(admin)/clients/page.tsx`
4. `src/app/(admin)/clients/[id]/page.tsx`
5. `src/app/(admin)/clients/create/page.tsx`
6. `src/app/(admin)/clients/[id]/edit/page.tsx`

### Clients Components
7. `src/app/(admin)/clients/components/ClientsTable.tsx`
8. `src/app/(admin)/clients/components/DeleteClientModal.tsx`
9. `src/app/(admin)/clients/components/ClientForm.tsx`
10. `src/app/(admin)/clients/components/ClientDetail.tsx`
11. `src/app/(admin)/clients/components/ClientAppointmentHistory.tsx`

### Appointments Module
12. `src/app/(admin)/appointments/components/ClientSelector.tsx`
13. `src/app/(admin)/appointments/components/AppointmentDetail.tsx`
14. `src/app/(admin)/appointments/components/AppointmentForm.tsx`
15. `src/app/(admin)/appointments/schema.ts`

### Cases Module
16. `src/app/(admin)/cases/components/CaseDetail.tsx`

### Dashboard Components
17. `src/app/(admin)/dashboards/components/RecentClients.tsx`
18. `src/app/(admin)/dashboards/components/KPICards.tsx`

### Hooks (Toast Messages)
19. `src/app/(admin)/clients/hooks/useCreateClient.ts`
20. `src/app/(admin)/clients/hooks/useUpdateClient.ts`
21. `src/app/(admin)/clients/hooks/useDeleteClient.ts`

## Confirmation
- ✓ NO database schema changes
- ✓ NO RLS policy changes
- ✓ NO URL path changes
- ✓ NO file renaming
- ✓ NO logic changes
- ✓ UI text replacement ONLY

## Rollback
If issues occur:
1. Use Lovable History to revert to this restore point
2. All changes are text-only, easily reversible