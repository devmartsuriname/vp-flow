# Restore Point — POST — TC-008 LinkedNotes Hook Fix

- **TC:** TC-008-LinkedNotes-HookFix
- **Lane:** C (frozen v1.x — Notes module)
- **Date:** 2026-05-12
- **Mode:** Mode A
- **Phase:** v2.0 Maintenance
- **Status:** EXECUTED — Awaiting Delroy confirmation

---

## Changes Applied

File: `src/app/(admin)/notes/components/LinkedNotes.tsx` (one file only)

### Edit 1 — remove early-return guard placed before `useQuery`

Lines 38–43 (before):
```tsx
  // Only VP can see notes
  if (!isVP(userRole)) {
    return null
  }

  // Fetch notes linked to this entity
```

After:
```tsx
  // Fetch notes linked to this entity (hook must be called unconditionally;
  // `enabled` guards the network call for non-VP roles).
```

### Edit 2 — add `enabled` and relocate the role guard after `useQuery`

End of `useQuery` options (before):
```tsx
    },
  })

  const handleDelete = () => {
```

After:
```tsx
    },
    enabled: isVP(userRole),
  })

  // Only VP can see notes (guard placed after hooks to satisfy rules-of-hooks)
  if (!isVP(userRole)) {
    return null
  }

  const handleDelete = () => {
```

---

## Verification

- `npm run lint` → exit 0 — **0 errors, 13 warnings** (matches TC-007 baseline; the LinkedNotes `rules-of-hooks` error from KI-007-01 is resolved)
- `npm run build` → exit 0 — clean production build, PWA generated, no TS errors
- Files touched: `src/app/(admin)/notes/components/LinkedNotes.tsx` only
- All other Notes module files untouched
- No migrations, no RLS, no Edge Functions touched

## Behavior

- VP user: `enabled: true` → `useQuery` fetches as before, full UI rendered. Unchanged.
- Non-VP user: `enabled: false` → `useQuery` does not run; component returns `null`. Render output unchanged.

## Risk Remaining

- **None.** Render output identical; no network call for non-VP roles; hook order is now stable across all renders.

---

**STATUS:** POST restore point recorded. Awaiting Delroy confirmation to seal TC-008.
