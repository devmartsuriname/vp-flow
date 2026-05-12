# RP_LintWarnings_POST_TC009

**Type:** POST restore point
**TC:** TC-009 — Lint Warnings Cleanup — src/context/ + Hooks (KI-007-02)
**Lane:** B (MEDIUM)
**Date:** 2026-05-12
**Mode:** Mode A — Claude.ai-mediated
**Status:** POST — fixes applied, validation green, awaiting Delroy acceptance

---

## Outcome Summary

TC-009 executed with two Delroy decisions during execution:

1. **Beslispunt 1 (4 react-refresh warnings):** Optie B — accept warnings. Premise of original fix (remove `export` from raw Context constants) did not match code reality — no raw Context constant is exported in any of the 4 context files; the warnings target hook exports. Files not modified.
2. **Item 3 (useMemo 8 deps):** Accepted — not touched.
3. **Item 7 (useLocalStorage.ts:32):** Initial fix triggered a new dependent warning at line 20:9 (`getStoredItem` recreated each render). Per Optie C: fix reverted. File restored to original state.

Net result: **1 of 7 in-scope warnings fixed** (item 2). The other 6 in-scope warnings remain by Delroy decision.

---

## Lint Result — Before / After

| Metric | Before | After |
|---|---|---|
| Errors | 0 | 0 |
| Warnings | 13 | 12 |
| Fixed warnings | — | 1 (item 2) |
| In-scope warnings remaining | 7 | 6 (accepted) |
| Out-of-scope warnings | 6 | 6 (untouched) |

### Remaining warnings (12)

In-scope (accepted by Delroy):
- `src/context/useAuthContext.tsx:19:17` — react-refresh/only-export-components
- `src/context/useLayoutContext.tsx:125:9` — react-hooks/exhaustive-deps (useMemo 8 deps)
- `src/context/useLayoutContext.tsx:133:26` — react-refresh/only-export-components
- `src/context/useNotificationContext.tsx:41:17` — react-refresh/only-export-components
- `src/context/useOfflineContext.tsx:35:14` — react-refresh/only-export-components
- `src/hooks/useLocalStorage.ts:32:6` — react-hooks/exhaustive-deps (reverted per Optie C)

Out-of-scope (never targeted by TC-009):
- 5x `src/app/(admin)/(layouts)/*` (DarkMode, DarkSideNav, DarkTopNav, HiddenSideNav, SmallSideNav)
- 1x `src/components/layout/TopNavigationBar/components/LeftSideBarToggle.tsx`

---

## Build Result

`npm run build` → exit 0. Production bundle generated. PWA service worker generated. No regressions.

---

## Diff — Modified Lines

### src/context/useLayoutContext.tsx

```diff
@@ line 91 (toggleBackdrop useCallback dependency array)
-  }, [offcanvasStates.showBackdrop])
+  }, [offcanvasStates])
```

Rationale: callback body uses `{ ...offcanvasStates, showBackdrop: !offcanvasStates.showBackdrop }` (line 90) — references the whole `offcanvasStates` object, not just `.showBackdrop`. The fix declares the actual dependency. Behavior: callback identity now changes when any property of `offcanvasStates` changes, not only `showBackdrop`. Functionally equivalent — the spread already reads the full object on each invocation.

### src/hooks/useLocalStorage.ts

No net change — line 32 reverted to original `}, [])` per Optie C.

---

## Files Modified (net)

- `src/context/useLayoutContext.tsx` — 1 line changed (line 91)

## Files Not Modified

- All other `src/context/*.tsx` files
- `src/hooks/useLocalStorage.ts` (reverted to baseline)
- All frozen v1.x components, RLS policies, migrations, Edge Functions
- `eslint.config.js`

---

## Validation

- `npm run lint` → 0 errors, 12 warnings (1 in-scope warning eliminated, others accepted by Delroy)
- `npm run build` → exit 0
- No behavior change in shared frozen surface
- No file outside TC-009 boundary touched
- No new dependencies added
- No eslint-disable comments introduced

---

## Risk Note

LOW. Single-line dep change on a useCallback in the layout provider; functionally equivalent to prior behavior since the callback body already reads the full `offcanvasStates` object.

---

## Stop Status

Stopped after POST RP creation, awaiting Delroy acceptance per Lane B stop condition.
