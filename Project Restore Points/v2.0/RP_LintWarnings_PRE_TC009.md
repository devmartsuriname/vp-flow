# RP_LintWarnings_PRE_TC009

**Type:** PRE restore point
**TC:** TC-009 — Lint Warnings Cleanup — src/context/ + Hooks (KI-007-02)
**Lane:** B (MEDIUM)
**Date:** 2026-05-12
**Mode:** Mode A — Claude.ai-mediated
**Status:** PRE — baseline captured, awaiting Delroy second "Goedgekeurd" before fixes

---

## Current State

- Branch: main
- Last commit: 72ca93f (TC-006-A: CORS + auth split for email Test Verbinding)
- `npm run lint` exit: non-zero (warnings present)
- Lint result: **0 errors, 13 warnings**

## Lint Baseline — Full Warning Inventory (13)

### In TC-009 Scope (src/context/ + directly-consumed hooks) — 7 warnings

| # | File | Line | Rule | Description |
|---|---|---|---|---|
| 1 | src/context/useAuthContext.tsx | 19:17 | react-refresh/only-export-components | Non-component export alongside component |
| 2 | src/context/useLayoutContext.tsx | 91:6 | react-hooks/exhaustive-deps | useCallback missing dep `offcanvasStates` |
| 3 | src/context/useLayoutContext.tsx | 125:9 | react-hooks/exhaustive-deps | useMemo missing deps: `activityStream`, `changeMenuSize`, `changeMenuTheme`, `changeTheme`, `changeTopbarTheme`, `resetSettings`, `themeCustomizer`, `toggleBackdrop` |
| 4 | src/context/useLayoutContext.tsx | 133:26 | react-refresh/only-export-components | Non-component export alongside component |
| 5 | src/context/useNotificationContext.tsx | 41:17 | react-refresh/only-export-components | Non-component export alongside component |
| 6 | src/context/useOfflineContext.tsx | 35:14 | react-refresh/only-export-components | Non-component export alongside component |
| 7 | src/hooks/useLocalStorage.ts | 32:6 | react-hooks/exhaustive-deps | useEffect missing dep `getStoredItem` — directly imported by `src/context/useLayoutContext.tsx` |

### Out of TC-009 Scope — 6 warnings (informational only, NOT to be fixed under TC-009)

| File | Line | Rule |
|---|---|---|
| src/app/(admin)/(layouts)/dark-mode/components/DarkMode.tsx | 13:6 | react-hooks/exhaustive-deps |
| src/app/(admin)/(layouts)/dark-sidenav/components/DarkSideNav.tsx | 11:6 | react-hooks/exhaustive-deps |
| src/app/(admin)/(layouts)/dark-topnav/components/DarkTopNav.tsx | 11:6 | react-hooks/exhaustive-deps |
| src/app/(admin)/(layouts)/hidden-sidenav/components/HiddenSideNav.tsx | 11:6 | react-hooks/exhaustive-deps |
| src/app/(admin)/(layouts)/small-sidenav/components/SmallSideNav.tsx | 11:6 | react-hooks/exhaustive-deps |
| src/components/layout/TopNavigationBar/components/LeftSideBarToggle.tsx | 33:6 | react-hooks/exhaustive-deps |

## Hook Consumption Verification

`src/hooks/useLocalStorage.ts` is directly imported by `src/context/useLayoutContext.tsx` — therefore in scope per TC-009 File Boundary clause ("hook file in src/hooks/ that is directly imported by a context file and flagged by lint").

No other `src/hooks/` files in the lint baseline are imported by `src/context/`.

## Risk Notes (Lane B — MEDIUM)

- `useLayoutContext.tsx` is the layout/theme provider — consumed widely. The 8-dep useMemo and offcanvasStates useCallback fixes may add references to functions that change identity → potential render side effects. Type/dep additions must preserve current behavior; if a fix forces a behavior change, **STOP and escalate** per TC stop condition.
- `react-refresh/only-export-components` fixes typically require splitting the non-component export (hook / context constant) into a sibling file. This is a structural change. Per TC: "Do not extract hooks or contexts into new files without Delroy approval." → This warning class will need Delroy direction before fix.
- `useLocalStorage.ts` is also consumed outside src/context/. Behavior must remain identical.

## TC-009 Stop Condition Reminder

After baseline presentation: STOP. Await second "Goedgekeurd" from Delroy before any code change.

## Files NOT Touched

All src/, supabase/, .claude/, Project Docs/, Task Contracts/, eslint.config.js — unchanged. No code modified in this PRE step.
