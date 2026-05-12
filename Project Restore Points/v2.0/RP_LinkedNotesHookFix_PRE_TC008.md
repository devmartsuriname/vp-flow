# Restore Point — PRE — TC-008 LinkedNotes Hook Fix

- **TC:** TC-008-LinkedNotes-HookFix
- **Lane:** C (frozen v1.x — Notes module)
- **Date:** 2026-05-12
- **Mode:** Mode A (Delroy → Claude.ai → Claude Code)
- **Phase:** v2.0 Maintenance
- **Author:** Claude Code (execution)

---

## Current State (PRE)

File: `src/app/(admin)/notes/components/LinkedNotes.tsx`
Lines: 1–223

### Hook order (current, violating)

1. `useState(showDeleteModal)` — line 34
2. `useState(selectedNote)` — line 35
3. `useDeleteNote()` — line 36
4. **Early return `null` if `!isVP(userRole)`** — line 39 ❌ guard before remaining hook
5. `useQuery(...)` — line 44 ❌ conditional hook call

### Lint violation

- Rule: `react-hooks/rules-of-hooks`
- Location: `LinkedNotes.tsx` line 44 (`useQuery` called after early return at line 39)
- Reported by: `npm run lint` (per TC-007 baseline — KI-007-01)

---

## What Will Change (POST plan)

- Move the `if (!isVP(userRole)) return null` guard to AFTER the `useQuery` call.
- Add `enabled: isVP(userRole)` to `useQuery` options so the query does not fetch when the user is not VP.
- No other change. No restructuring. No new imports. No behavior change to render output.

## What Will NOT Change

- Component rendered output for any role (VP, Secretary, Protocol)
- All other Notes module files
- RLS policies, migrations, Edge Functions
- All hooks above the original early return (useState x2, useDeleteNote)
- Imports, prop types, JSX structure, modal logic

---

## Risks

- **Low** — Render output preserved exactly. `enabled: false` prevents network call for non-VP. Component still returns `null` for non-VP via relocated guard.
- Frozen v1.x behavior preserved bit-for-bit at runtime.

---

## Rollback

If POST verification fails: `git checkout HEAD -- src/app/(admin)/notes/components/LinkedNotes.tsx`

---

**STATUS:** PRE restore point recorded. Awaiting Delroy second "Goedgekeurd" before file modification.
