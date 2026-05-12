# DEVMART TASK CONTRACT

## Task Identification

- **Task Name:** Lint Cleanup — Pre-existing Codebase Errors
- **Project:** VP-Flow
- **Phase:** v2.0 Maintenance
- **Phase Validator:** Delroy
- **Date:** 2026-05-12
- **Control Chain Mode:** [x] Mode A — Claude.ai-Mediated
- Mode B reason: N/A

---

## Objective

Fix all pre-existing ESLint errors in the codebase so that `npm run lint` exits 0. These 329 errors and 105 warnings were present before TC-006 and were not introduced by TC-006. Primary error types: `@typescript-eslint/no-explicit-any` and `@typescript-eslint/no-require-imports`.

---

## Execution Mode

[ ] SAFE MODE — bug fixes, narrow corrections, code review
[x] EXTENDED MODE — controlled feature work, bounded module expansion
[ ] FULL BUILD MODE — full implementation within approved PRD

---

## Risk Classification

[ ] LOW — single module, no data/auth impact
[x] MEDIUM — multi-file within module, potential side effects
[ ] HIGH — DB / auth / security / API contract / architecture / cross-module

---

## Scope Definition

### In Scope

- Fix all ESLint errors reported by `npm run lint` that existed before TC-006
- Primary fixes:
  - Replace `any` types with explicit types or `unknown` where appropriate (`@typescript-eslint/no-explicit-any`)
  - Replace `require()` imports with ES module `import` syntax (`@typescript-eslint/no-require-imports`)
- All files flagged by lint — except those listed under Out of Scope
- After all fixes: `npm run lint` must exit 0

### Out of Scope

- Introducing new features or logic
- Modifying frozen v1.x behavior
- Modifying RLS, migrations, or Edge Functions
- Modifying TC-006 files (EmailSettingsCard.tsx, useEmailSettings.ts) — these are already clean
- Refactoring beyond what is needed to satisfy the lint rule
- Adding new ESLint rules
- Changing tsconfig.json strictness settings

---

## File Boundary

### Allowed — Modified Files

- Any file flagged by `npm run lint` with pre-existing errors, except frozen files listed below

### Forbidden

- `/supabase/migrations/` (all — read only)
- `/supabase/functions/` (all — read only)
- `.claude/`, `Project Docs/`, `Project Restore Points/`, `Task Contracts/`
- `src/integrations/supabase/types.ts` — do not hand-edit
- All frozen v1.x RLS policies and trigger functions
- `src/app/(admin)/settings/components/EmailSettingsCard.tsx`
- `src/app/(admin)/settings/hooks/useEmailSettings.ts`

---

## Pre-Execution Requirements (Lane B)

1. **PRE restore point** must be created: `RP_LintCleanup_PRE_TC007.md` in `/Project Restore Points/v2.0/`
2. Run `npm run lint` and capture the full error list before making any changes — use this as the baseline

---

## Expected Output

- `npm run lint` exits 0
- `npm run build` still exits 0 (no regressions)
- No functional behavior changed

---

## Verification Requirement

Claude Code must confirm after execution:

1. `npm run lint` — exit code 0
2. `npm run build` — exit code 0
3. No TC-006 files modified
4. No frozen module files modified

---

## Constraints

- Fix only what lint flags — no speculative type improvements
- If a `require()` replacement would break module resolution, stop and escalate
- If fixing `any` requires understanding runtime behavior of a frozen module, stop and escalate
- Prefer `unknown` over `any` where the type is genuinely unknown

---

## Stop Condition

Stop after: lint exits 0, build exits 0, POST restore point created, report delivered to Delroy.

---

## Override Log

- Violation detected: —
- Instruction in conflict: —
- Execution status: NOT STARTED
- Delroy response: [ ] Corrected instruction | [ ] Override authorized

---

## Validation Checklist

- [x] Objective is single and unambiguous
- [x] Execution mode selected: EXTENDED MODE
- [x] Risk classified: MEDIUM
- [x] File boundaries explicit
- [x] Stop condition defined
- [x] No field blank
- [x] PRE restore point required before execution

---

**STATUS: DRAFT — Awaiting Delroy approval ("Goedgekeurd") before Claude Code may begin.**
