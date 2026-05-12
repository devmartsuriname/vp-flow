# DEVMART TASK CONTRACT

## Task Identification

- **Task Name:** LinkedNotes.tsx — rules-of-hooks Fix (KI-007-01)
- **Project:** VP-Flow
- **Phase:** v2.0 Maintenance
- **Phase Validator:** Delroy
- **Date:** 2026-05-12
- **Control Chain Mode:** [x] Mode A — Claude.ai-Mediated
- Mode B reason: N/A

---

## Objective

Fix the `rules-of-hooks` violation in `LinkedNotes.tsx` (frozen v1.x Notes module): a `useQuery` hook is called conditionally after an early return. The fix must resolve the lint violation without changing the component's rendered output or runtime behavior.

---

## Execution Mode

[x] SAFE MODE — bug fixes, narrow corrections, code review
[ ] EXTENDED MODE — controlled feature work, bounded module expansion
[ ] FULL BUILD MODE — full implementation within approved PRD

---

## Risk Classification

[ ] LOW — single module, no data/auth impact
[ ] MEDIUM — multi-file within module, potential side effects
[x] HIGH — DB / auth / security / API contract / architecture / cross-module

**HIGH reason:** Frozen v1.x module (Notes — frozen since v1.1). Any change to frozen behavior requires HIGH classification and Delroy re-confirmation before execution (Lane C gate).

---

## Scope Definition

### In Scope

- `src/app/(admin)/notes/components/LinkedNotes.tsx` — single file
- Fix: restructure hook call order so no hook is called after an early return
- Preferred fix: add `enabled: <condition>` to the `useQuery` options so the hook is always called but conditionally fetches — this preserves render behavior exactly
- After fix: `npm run lint` must show 0 errors (including this file), `npm run build` must exit 0

### Out of Scope

- Any other file in the Notes module
- Any behavior change to LinkedNotes component output
- Any RLS, migration, or Edge Function changes
- Any other frozen v1.x module
- Refactoring beyond the single hook restructure

---

## File Boundary

### Allowed — Modified Files

- `src/app/(admin)/notes/components/LinkedNotes.tsx` — one file only

### Forbidden

- All other files in `/src/app/(admin)/notes/`
- All migration files
- All Edge Functions
- All frozen RLS policies
- `.claude/`, `Project Docs/`, `Project Restore Points/`, `Task Contracts/`

---

## Pre-Execution Requirements (Lane C)

1. **PRE restore point** must be created: `RP_LinkedNotesHookFix_PRE_TC008.md` in `/Project Restore Points/v2.0/`
2. **Read the file first** — confirm exact line of violation before touching anything
3. **Delroy re-confirmation required** before touching `LinkedNotes.tsx` — Lane C gate on frozen module

---

## Expected Output

- `LinkedNotes.tsx` passes `rules-of-hooks` — zero lint errors in this file
- Component renders identically to before the fix
- `npm run lint` exits 0 (or same adjusted baseline as TC-007, minus this violation)
- `npm run build` exits 0

---

## Verification Requirement

Claude Code must confirm after execution:

1. `npm run lint` — exit code and error count
2. `npm run build` — exit code
3. Show the before/after diff of the changed lines only
4. Confirm no other Notes module files were touched

---

## Constraints

- Preferred fix: `enabled` parameter on `useQuery` — do not restructure component logic
- If `enabled` fix is not possible without behavior change: STOP and escalate to Delroy
- Do not add `// eslint-disable` comments — fix the actual violation
- Do not extract hooks into a wrapper component without Delroy approval

---

## Stop Condition

Stop after: lint passes, build passes, POST restore point created, diff shown to Delroy.

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
- [x] Risk classified: HIGH (frozen v1.x)
- [x] File boundaries explicit — one file only
- [x] Stop condition defined
- [x] No field blank
- [x] PRE restore point required before execution
- [x] Lane C re-confirmation by Delroy required before LinkedNotes.tsx is touched

---

**STATUS: DRAFT — Awaiting Delroy approval ("Goedgekeurd") before Claude Code may begin.**
