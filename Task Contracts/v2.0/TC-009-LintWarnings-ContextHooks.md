# DEVMART TASK CONTRACT

## Task Identification

- **Task Name:** Lint Warnings Cleanup — src/context/ + Hooks (KI-007-02)
- **Project:** VP-Flow
- **Phase:** v2.0 Maintenance
- **Phase Validator:** Delroy
- **Date:** 2026-05-12
- **Control Chain Mode:** [x] Mode A — Claude.ai-Mediated
- Mode B reason: N/A

---

## Objective

Fix all remaining ESLint warnings in `src/context/` and related hooks so that `npm run lint` exits 0 with 0 errors and 0 warnings.

---

## Execution Mode

[x] SAFE MODE — bug fixes, narrow corrections, code review
[ ] EXTENDED MODE — controlled feature work, bounded module expansion
[ ] FULL BUILD MODE — full implementation within approved PRD

---

## Risk Classification

[ ] LOW — single module, no data/auth impact
[x] MEDIUM — multi-file within module, potential side effects
[ ] HIGH — DB / auth / security / API contract / architecture / cross-module

**MEDIUM reason:** Context and hooks may be shared across frozen and unfrozen modules. Type changes in shared context providers can have side effects in frozen v1.x components that consume them. No auth/DB impact.

---

## Scope Definition

### In Scope

- Run `npm run lint` first — capture exact warning list (file, line, rule) as baseline
- Fix all ESLint warnings flagged in `src/context/` and any hooks directly consumed by context files
- After all fixes: `npm run lint` must exit 0 with 0 warnings
- After all fixes: `npm run build` must exit 0

### Out of Scope

- Any ESLint errors (TC-007 already cleared these — if new errors appear, escalate)
- Any file outside `src/context/` and its directly consumed hooks
- Any change to frozen v1.x components that consume these contexts
- Any RLS, migration, or Edge Function changes
- Any logic or behavior change — type-only fixes only
- Adding new ESLint rules or changing eslint.config.js

---

## File Boundary

### Allowed — Modified Files

- Any file inside `src/context/` flagged by `npm run lint`
- Any hook file in `src/hooks/` that is directly imported by a context file and flagged by lint
- No other files

### Forbidden

- `/supabase/migrations/` — read only
- `/supabase/functions/` — read only
- `.claude/`, `Project Docs/`, `Project Restore Points/`, `Task Contracts/`
- `src/integrations/supabase/types.ts` — do not hand-edit
- All frozen v1.x RLS policies and trigger functions
- All files outside `src/context/` and directly consumed hooks
- `eslint.config.js` — do not modify

---

## Pre-Execution Requirements (Lane B)

1. **PRE restore point** must be created: `RP_LintWarnings_PRE_TC009.md` in `/Project Restore Points/v2.0/`
2. Run `npm run lint` and capture exact warning list before any change — use as baseline

---

## Expected Output

- `npm run lint` exits 0 with 0 warnings
- `npm run build` exits 0 (no regressions)
- No frozen module behavior changed
- No logic changes — type annotations only

---

## Verification Requirement

Claude Code must confirm after execution:

1. `npm run lint` — exit code 0, warning count 0
2. `npm run build` — exit code 0
3. Show before/after diff — changed lines only
4. Confirm no file outside src/context/ and directly consumed hooks was modified
5. **STOP CONDITION:** If fixing a warning requires changing logic or behavior (not just types) in a shared frozen hook → STOP and escalate to Delroy

---

## Constraints

- Fix only what lint flags — no speculative type improvements
- Prefer `unknown` over `any` where type is genuinely unknown
- Do not add `// eslint-disable` comments — fix the actual violation
- If a shared context hook is consumed by a frozen v1.x component and fixing it requires a behavior change → STOP and escalate
- Do not extract hooks or contexts into new files without Delroy approval

---

## Stop Condition

Stop after: lint exits 0 (0 warnings), build exits 0, POST restore point created, diff shown to Delroy.

---

## Override Log

- Violation detected: —
- Instruction in conflict: —
- Execution status: NOT STARTED
- Delroy response: [ ] Corrected instruction | [ ] Override authorized

---

## Validation Checklist

- [x] Objective is single and unambiguous
- [x] Execution mode selected: SAFE MODE
- [x] Risk classified: MEDIUM
- [x] File boundaries explicit — src/context/ + directly consumed hooks only
- [x] Stop condition defined
- [x] No field blank
- [x] PRE restore point required before execution
- [x] Escalation condition defined for shared frozen hooks

---

**STATUS: DRAFT — Awaiting Delroy approval ("Goedgekeurd") before Claude Code may begin.**
