# RP — Global Search POST Routefix

**Type:** POST restore point
**TC:** TC-002 — Global Search Route Fix
**Lane:** B
**Created:** 2026-05-11
**Module:** Global Search
**Author:** Claude Code (under Delroy authority)

---

## What Changed

`src/hooks/useGlobalSearch.ts` line 70:

```diff
-        link: `/guests/${client.id}`
+        link: `/clients/${client.id}`
```

Single-line change. Guest search results in Global Search now navigate to the
correct route `/clients/:id` (defined in `src/routes/index.tsx:113`).

---

## What Was NOT Touched

- Route definitions in `src/routes/index.tsx`
- UI labels ("Guests" label remains everywhere)
- `type: 'guest'` discriminator (internal identifier, not URL)
- `queryKey: ['global-search', 'guests', ...]` (internal cache key)
- Appointment links (`/appointments/:id`) — unchanged
- Case links (`/cases/:id`) — unchanged
- Any other hook, component, or utility
- Migrations, RLS, auth, storage policies

---

## Verification Performed

1. Pre-edit grep across `src/` for `/guests/` → exactly 1 occurrence at
   `src/hooks/useGlobalSearch.ts:70`. No other references existed.
2. Post-edit `npm run build` → `✓ built in 10.86s`. Clean production build.
   PWA generated successfully (102 precache entries).
3. Post-edit `npm run lint` → 421 pre-existing problems repo-wide
   (320 errors, 101 warnings). NONE in `src/hooks/useGlobalSearch.ts`.
   No new lint issues introduced by this change.

---

## Acceptance Criteria Status

- [x] Guest search → navigates to `/clients/:id` correctly (route exists)
- [x] Appointment and case search links unchanged
- [x] UI label "Guests" preserved everywhere
- [x] `npm run build` passes
- [x] `npm run lint` — no new errors in modified file (pre-existing repo-wide
      errors are out of scope per TC-002)

---

## Risks Remaining

None. Single-line URL fix with no side effects. RLS unaffected. No migration.
No auth change. No frozen v1.x behavior modified.

---

## Follow-up

- CLAUDE.md Section 14: Global search issue marked RESOLVED 2026-05-11.
- Phase Gate: TC-002 is the only active TC in this session; no phase advance.
- Commit pending Delroy confirmation.
