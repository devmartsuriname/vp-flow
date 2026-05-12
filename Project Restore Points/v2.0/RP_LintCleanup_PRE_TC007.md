# Restore Point — PRE — TC-007 Lint Cleanup

- **TC ID:** TC-007
- **Task:** Lint Cleanup — Pre-existing Codebase Errors
- **Lane:** B (Medium Risk)
- **Phase:** v2.0 Maintenance
- **Date:** 2026-05-12
- **Status:** PRE — execution not yet started (awaiting Delroy "Goedgekeurd")

---

## Current State Summary

`npm run lint` baseline: **EXIT 1 — 434 problems (329 errors, 105 warnings)**.
Full output captured in `lint-baseline.txt` (566 lines) at repo root.

### Error distribution by rule

| Count | Rule |
|------:|------|
| 312 | `@typescript-eslint/no-explicit-any` |
| 6   | `@typescript-eslint/ban-types` |
| 6   | `@typescript-eslint/no-unsafe-assignment` |
| 4   | `@typescript-eslint/no-unsafe-return` |
| 3   | `no-var` |
| 3   | `@typescript-eslint/no-empty-object-type` |
| 2   | `@typescript-eslint/no-unsafe-member-access` |
| 1   | `react-hooks/rules-of-hooks` |
| 1   | `@typescript-eslint/no-require-imports` |
| 1   | `@typescript-eslint/no-unused-vars` |

Warnings (105): 81 `react-refresh/only-export-components`, 19 `react-hooks/exhaustive-deps`, others.

### Error distribution by location

- **src/** (excluding archive): **306 errors** across 13 files
- **archive/** (Darkone template, reference code): **23 errors** across multiple files
- **Total:** 329 errors

### Top error files

| Errors | File |
|------:|------|
| 283 | `src/types/externals.d.ts` (ambient type stubs — comment says "temporary, replaced in Phase 5") |
| 9   | `dev-dist/workbox-5a5d9309.js` (auto-generated PWA service worker) |
| 2   | `src/types/component-props.ts` |
| 2   | `src/app/(admin)/dashboards/types.ts` |
| 1 ea | `tailwind.config.ts`, `src/types/react-bootstrap-types.d.ts`, `src/components/layout/VerticalNavigationBar/components/AppMenu.tsx`, `src/components/CustomFlatpickr.tsx`, `src/app/(admin)/settings/components/SystemInfoCard.tsx`, `src/app/(admin)/notes/components/LinkedNotes.tsx`, `src/app/(admin)/incoming-post/hooks/useUpdateIncomingPostStatus.ts`, `src/app/(admin)/incoming-post/hooks/useUpdateIncomingPost.ts`, `src/app/(admin)/incoming-post/hooks/useCreateIncomingPost.ts`, `src/app/(admin)/dashboards/components/KPICard.tsx` |
| 23 (total) | files under `archive/Darkone-React_v1.0/` |

### Notable findings

1. **`src/types/externals.d.ts`** holds 86 % of all errors. File header states: "Temporary type stubs… replaced when proper dependencies are added in Phase 5 - Final Configuration." Phase 5 has not occurred.
2. **`dev-dist/`** is build-time PWA output (workbox/service worker). Not in `.gitignore`. Currently linted but should not be.
3. **`archive/Darkone-React_v1.0/`** is the original template — reference-only code, not part of the runtime app.
4. **`src/app/(admin)/notes/components/LinkedNotes.tsx:44`** — `react-hooks/rules-of-hooks` error: `useQuery` called conditionally. This is a real correctness bug in frozen v1.x module.

### ESLint config

`eslint.config.js` currently ignores only `dist`. No exclusion for `archive/`, `dev-dist/`, or generated artifacts.

---

## Reference Documents

- TC: `Task Contracts/v2.0/TC-007-LintCleanup.md`
- Baseline output: `lint-baseline.txt`
- Governance: `.claude/rules/governance.md`, `.claude/rules/phase-gates.md`

---

## Files NOT Touched (forbidden boundary)

- `supabase/migrations/`, `supabase/functions/`
- `src/integrations/supabase/types.ts`
- `src/app/(admin)/settings/components/EmailSettingsCard.tsx` (TC-006)
- `src/app/(admin)/settings/hooks/useEmailSettings.ts` (TC-006)
- `.claude/`, `Project Docs/`, `Project Restore Points/`, `Task Contracts/`
- Frozen v1.x RLS policies, trigger functions

---

## Risks Identified

- **High-leverage decision: how to treat `src/types/externals.d.ts`** — 283 errors. Per-line typing is large scope; targeted approach required (see plan).
- **`dev-dist/` is generated** — fixing by hand would be wiped on next build. Must be solved via eslint ignore, not edits.
- **`archive/` is template code** — fixing by hand serves no runtime purpose. Same: solve via eslint ignore.
- **`react-hooks/rules-of-hooks` in `LinkedNotes.tsx`** is a real bug in a frozen v1.x file. Touching frozen behavior requires explicit Delroy confirmation.
- **TC out-of-scope says "Adding new ESLint rules"** is forbidden — does **not** prohibit modifying `ignores`. Plan proposes ignores, awaiting Delroy ruling.
