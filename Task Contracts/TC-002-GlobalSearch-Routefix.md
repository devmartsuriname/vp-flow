# TC-002 — Global Search Route Fix

**Status:** DRAFT
**Lane:** B (single-line hook fix — no migration, no RLS change)
**Module:** Global Search
**Created:** 2026-05-11
**Created by:** Devmart (Claude.ai / Cowork)
**Approved by:** — awaiting Delroy

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

- [ ] Searching for a guest in Global Search and clicking the result navigates to `/clients/:id` correctly
- [ ] No other search result links are broken (appointments, cases)
- [ ] UI still displays "Guests" as the label everywhere (no label regressions)
- [ ] Build passes (`npm run build`)
- [ ] Lint passes (`npm run lint`)

---

## Restore Points

Lane B — restore point required.

- PRE: `RP_GlobalSearch_PRE_Routefix.md`
- POST: `RP_GlobalSearch_POST_Routefix.md`

---

## Governance Checklist

- [ ] Guardian Rules confirmed active
- [ ] No frozen v1.x behavior touched
- [ ] No killed features reintroduced
- [ ] RLS not bypassed
- [ ] Build/lint passes after execution
- [ ] PRE restore point created before execution
- [ ] POST restore point created after execution

---

## Notes

This is a single-line fix. Low risk. No database interaction. After execution: update CLAUDE.md Section 14 to mark this issue as RESOLVED.
