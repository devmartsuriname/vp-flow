# RP_RichTextNotes_PRE_TC012

**Type:** PRE-execution restore point
**TC:** TC-012 — Rich Text Notes (Phase 1C-A, Tiptap integration)
**Date:** 2026-05-12
**Lane:** C (Step 1 migration) + Lane B (Step 2 UI)
**Status:** DRAFT — pre-execution snapshot

---

## Current State Summary

VP-Flow is at the close of v2.0 Phase 1B:
- Phase 1A.1 (Push Notifications) — CLOSED via TC-005
- Phase 1A.2 (Email Notifications) — CLOSED via TC-006 + TC-006-A
- TC-010 (vault-read SUPABASE_PROJECT_URL) — CLOSED 2026-05-12
- Phase 1B (Notification Preferences) — CLOSED via TC-011 (commit 4af306f)
- Phase 1C-A — OPEN as of 2026-05-12 via approval of TC-012

The Notes module currently uses a plain `<textarea>` for note content. The `notes` table has no `content_format` column — all content is treated as plain text. The VP-only handwriting note feature (Priority 3-A) is FROZEN and out of scope.

## What This TC Will Change

**Step 1 — Migration (Lane C):**
- New file: `supabase/migrations/20260512120000_notes_content_format.sql`
- Adds column `content_format VARCHAR(10) NOT NULL DEFAULT 'plain'` with CHECK constraint (`'plain'` or `'json'`) to `public.notes`
- No RLS change, no trigger change, no existing column modified
- Applied manually via Supabase SQL Editor after Delroy re-confirmation

**Step 2 — Tiptap integration (Lane B):**
- Install Tiptap packages: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`
- Replace `<textarea>` with Tiptap `<EditorContent>` in Notes editor component
- Notes list/read view renders plain text vs. JSON based on `content_format`
- On save: serialize editor content to JSON, set `content_format = 'json'`
- Existing plain notes remain readable (initialized as plain text node when `content_format = 'plain'`)

## What Will NOT Be Touched

- Existing migration files (read-only — additive only)
- Frozen v1.x RLS policies, triggers, and audit logic on `notes`
- VP handwriting note component (Priority 3-A)
- Files outside `src/app/(admin)/notes/` and the migration
- `eslint.config.js`
- Any other module

## Risk Profile

- **Step 1 (migration):** Low — pure additive column with safe default. Backward compatible (existing rows get `'plain'` automatically).
- **Step 2 (UI):** Medium — replacing the editor in a frozen v1.x module. Mitigated by `content_format` discriminator and explicit plain/json render branches.
- **Rollback:** Step 1 reversible via `ALTER TABLE public.notes DROP COLUMN content_format;`. Step 2 reversible via git revert.

## Approval Trail

- TC-012 approved by Delroy via Cowork sessie 2026-05-12
- Lane C re-confirmation pending for:
  - Step 1 migration apply (after PRE RP + migration file shown to Delroy)

## Pre-Execution Verification

- [x] PRE restore point created (this file)
- [x] Step 1 migration file written and shown to Delroy
- [ ] Delroy re-confirms before SQL Editor apply
