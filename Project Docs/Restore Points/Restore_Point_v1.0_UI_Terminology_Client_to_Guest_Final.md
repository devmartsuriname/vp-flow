# Restore Point: v1.0 UI Terminology Update (Client → Guest) — FINAL

**Created:** 2026-01-16  
**Status:** COMPLETE  
**Phase:** Final Remediation

---

## Scope

Final remediation pass to fix 5 remaining UI text instances where "Client" was not updated to "Guest".

---

## Files Modified

| File | Change |
|------|--------|
| `src/app/(admin)/dashboards/components/RecentAppointments.tsx` | Line 76: `<th>Client</th>` → `<th>Guest</th>` |
| `src/app/(admin)/appointments/components/AppointmentsTable.tsx` | Line 70: placeholder "client" → "guest", Line 111: `<th>Client</th>` → `<th>Guest</th>` |
| `src/app/(admin)/cases/components/CasesTable.tsx` | Line 76: placeholder "client" → "guest", Line 130: `<th>Client</th>` → `<th>Guest</th>` |

---

## Constraints Enforced

- ✅ UI text changes ONLY
- ✅ NO database, schema, RLS, or logic changes
- ✅ NO file renaming
- ✅ NO URL path changes
- ✅ Darkone 1:1 compliance maintained

---

## Rollback

To rollback, revert the 3 files listed above to restore "Client" labels in table headers and search placeholders.

---

## Status

- [x] RecentAppointments.tsx updated
- [x] AppointmentsTable.tsx updated
- [x] CasesTable.tsx updated
- [x] Verification complete
