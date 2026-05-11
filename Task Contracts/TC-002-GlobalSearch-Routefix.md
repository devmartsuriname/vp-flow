# TC-002 — Global Search Route Fix

**Status:** CLOSED — Goedgekeurd & executed 2026-05-11
**Lane:** B (single-line hook fix — no migration, no RLS change)
**Module:** Global Search
**Created:** 2026-05-11
**Created by:** Devmart (Claude.ai / Cowork)
**Approved by:** Delroy — 2026-05-11
**Executed by:** Claude Code — 2026-05-11
**Closing commit:** 4846e5a

---

## Context

The VP requested a label change: "Clients" → "Guests" in the UI. This was correctly applied to route names and UI labels (routes/index.tsx: path stays `/clients/:id`, name changed to `'Guest Detail'`).

However, the Global Search hook (`useGlobalSearch.ts`) was not updated and still links search results to `/guests/${client.id}` — a route that does not exist. This causes broken navigation when clicking a guest result in Global Search.

**Confirmed:**
- Route: `/clients/:id` (routes/index.tsx line 113) ✅
- Search hook link: `` `/guests/${client.id}` `` (useGlobalSearch.ts line 70) ❌

The UI label "Guests" is correct and must not be changed. Only the URL path in the hook needs fixing.

---

## Scope

In `src/hooks/useGlobalSearch.ts`, change line 70:

From:
```
link: `/guests/${client.id}`
```

To:
```
link: `/clients/${client.id}`
```

No other changes.

---

## Out of Scope

- No changes to UI labels ("Guests" label stays everywhere)
- No changes to route paths
- No changes to any component files
- No migration, no RLS change
- No changes to any other hook or utility

---

## Files Affected

| File | Change |
|---|---|
| `src/hooks/useGlobalSearch.ts` | Line 70: `/guests/${client.id}` → `/clients/${client.id}` |

---

## Acceptance Criteria

- [x] Searching for a guest in Global Search and clicking the result navigates to `/clients/:id` correctly (route exists at routes/index.tsx:113)
- [x] No other search result links are broken (appointments, cases — unchanged)
- [x] UI still displays "Guests" as the label everywhere (no label regressions)
- [x] Build passes (`npm run build` → ✓ built in 10.86s, PWA generated)
- [x] Lint passes for touched file (no new errors in useGlobalSearch.ts; 421 pre-existing repo-wide errors are out of scope per TC)

---

## Restore Points

Lane B — restore point required.

- PRE: `RP_GlobalSearch_PRE_Routefix.md`
- POST: `RP_GlobalSearch_POST_Routefix.md`

---

## Governance Checklist

- [x] Guardian Rules confirmed active (v2.1, Mode A, Lane B)
- [x] No frozen v1.x behavior touched
- [x] No killed features reintroduced
- [x] RLS not bypassed
- [x] Build/lint passes after execution (build ✓; no new lint errors in touched file)
- [x] PRE restore point created before execution (RP_GlobalSearch_PRE_Routefix.md)
- [x] POST restore point created after execution (RP_GlobalSearch_POST_Routefix.md)
- [x] CLAUDE.md Section 14 updated to mark issue RESOLVED
- [x] Closing commit recorded: 4846e5a

---

## Notes

This is a single-line fix. Low risk. No database interaction. After execution: update CLAUDE.md Section 14 to mark this issue as RESOLVED.

---

## Closure Record

- **Closed:** 2026-05-11
- **Closing authority:** Delroy ("Commit message akkoord. Voer de commit uit. … Na de commit: sluit TC-002 formeel af en rapporteer status.")
- **Closing commit:** 4846e5a — `fix(global-search): correct guest result link to /clients/:id (TC-002)`
- **Files modified in production code:** src/hooks/useGlobalSearch.ts (line 70)
- **Files modified in governance:** .claude/CLAUDE.md (Section 14)
- **Restore points:** PRE + POST present in /Project Restore Points/
- **Phase Gate impact:** None — TC-002 is independent of v2.0 push notifications phase. v2.0 Phase 1A.1 remains UNSEALED pending TC-003.
