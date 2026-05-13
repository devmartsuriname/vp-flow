# DEVMART TASK CONTRACT

## Task Identification

- **Task Name:** Rich Text Notes — Phase 1C-A (Tiptap editor integration)
- **Project:** VP-Flow
- **Phase:** v2.0 Phase 1C-A
- **Phase Validator:** Delroy
- **Date:** 2026-05-12
- **Control Chain Mode:** [x] Mode A — Claude.ai-Mediated
- Mode B reason: N/A

---

## Objective

Replace the plain text input in the Notes module with a Tiptap rich text editor. Existing notes remain readable. New and edited notes are saved as Tiptap JSON. One additive migration adds a `content_format` column to the `notes` table.

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

**MEDIUM reason:** Migration adds one column to a frozen v1.x table (`notes`). UI component replaces the existing textarea. No RLS change, no trigger change, no existing column modified. Backward compat enforced via `content_format` column.

---

## Scope Definition

### In Scope

**Step 1 — Migration (Lane C)**

- Create new additive migration: `supabase/migrations/20260512120000_notes_content_format.sql`
  - Add column: `ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS content_format VARCHAR(10) NOT NULL DEFAULT 'plain' CHECK (content_format IN ('plain', 'json'));`
  - No other changes to `notes` table — no RLS change, no trigger change, no existing column modified
- Apply migration via Supabase SQL Editor (manual — same pattern as TC-006/TC-010/TC-011)
- Stop after migration applied — confirm with Delroy before Step 2

**Step 2 — Tiptap integration (Lane B)**

- Install Tiptap packages (exact versions to be resolved at install time):
  - `@tiptap/react`
  - `@tiptap/starter-kit`
  - `@tiptap/extension-placeholder`
  - No other Tiptap extensions — starter-kit only in this TC
- Update Notes editor component (locate via `src/app/(admin)/notes/` or equivalent path):
  - Replace `<textarea>` with Tiptap `<EditorContent>` component
  - On load: if `content_format = 'plain'` → initialize editor with note content as plain text node
  - On load: if `content_format = 'json'` → initialize editor with stored JSON
  - On save: serialize editor content to JSON string, set `content_format = 'json'`
  - Placeholder text: "Schrijf hier uw notitie..." (or existing placeholder if present)
- Notes list/read view: render plain text as `<p>` if `content_format = 'plain'`; render Tiptap JSON via `generateHTML` if `content_format = 'json'`
- VP-only handwriting note (Priority 3-A) — do NOT touch: leave as-is
- After UI changes: `npm run lint` must exit 0, `npm run build` must exit 0

### Out of Scope

- Tiptap extensions beyond starter-kit (images, tables, mentions, collaboration, etc.)
- Migrating existing plain text notes to JSON format
- Changing any existing note RLS policies
- Changing the notes trigger or audit logic
- VP handwriting note (Priority 3-A) — frozen, do not touch
- Any other module outside `src/app/(admin)/notes/`
- Adding toolbar buttons beyond starter-kit defaults (bold, italic, lists, headings)

---

## File Boundary

### Allowed — New Files

- `supabase/migrations/20260512120000_notes_content_format.sql`
- Any new Tiptap-specific component files inside `src/app/(admin)/notes/`

### Allowed — Modified Files

- Notes editor component(s) inside `src/app/(admin)/notes/` — replace textarea with Tiptap
- Notes list/read component(s) inside `src/app/(admin)/notes/` — render plain vs json
- `package.json` + `package-lock.json` — Tiptap package additions only
- `src/integrations/supabase/types.ts` — if Supabase type regeneration is needed for new column (read-only update via `supabase gen types`)

### Forbidden

- All existing migration files — read only, never modify
- All frozen v1.x RLS policies and triggers
- VP handwriting note component (Priority 3-A)
- `.claude/`, `Project Docs/`, `Project Restore Points/`, `Task Contracts/`
- `eslint.config.js`
- Any file outside `src/app/(admin)/notes/` and the migration

---

## Pre-Execution Requirements (Lane C — Step 1)

1. **PRE restore point** must be created: `RP_RichTextNotes_PRE_TC012.md` in `/Project Restore Points/v2.0/`
2. **Step 1** (migration apply) requires Delroy re-confirmation — Lane C gate
3. Step 2 (UI) may proceed after migration is confirmed applied

---

## Expected Output

- `notes` table has `content_format` column (default 'plain')
- Notes editor shows Tiptap rich text editor (bold, italic, lists, headings via starter-kit)
- Existing plain text notes render correctly without corruption
- New/edited notes saved as JSON with `content_format = 'json'`
- `npm run lint` exits 0, `npm run build` exits 0

---

## Verification Requirement

Claude Code must confirm after each step:

**After Step 1:**
1. Show migration file diff
2. Confirm column exists: `SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = 'notes' AND column_name = 'content_format';`

**After Step 2:**
1. `npm run lint` exit 0
2. `npm run build` exit 0
3. Show diff of all changed UI files
4. Confirm VP handwriting note component was not touched

---

## Constraints

- Migration must be ADDITIVE — `ALTER TABLE ADD COLUMN IF NOT EXISTS` only
- `content_format` default must be `'plain'` — existing notes must not break
- Tiptap packages: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder` only
- No eslint-disable comments — fix any lint violations properly
- Apply migration manually via SQL Editor — do not use `supabase db push`
- Do not touch VP handwriting note (Priority 3-A) under any circumstance

---

## Stop Conditions

- **After Step 1:** Stop, show migration + column verification, await Delroy signal before Step 2
- **After Step 2:** Stop, show lint/build + diff, create POST restore point, deliver final report

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
- [x] Risk classified: MEDIUM (one additive column on frozen table, UI replacement)
- [x] File boundaries explicit — notes module only
- [x] Stop conditions defined — 2 gates
- [x] No field blank
- [x] PRE restore point required before execution
- [x] Lane C re-confirmation required at Step 1 (migration apply)
- [x] Backward compat documented: content_format = 'plain' default, existing notes safe
- [x] VP handwriting note explicitly excluded
- [x] Tiptap packages pinned to starter-kit only

---

**STATUS: DRAFT — Awaiting Delroy approval ("Goedgekeurd") before Claude Code may begin.**
