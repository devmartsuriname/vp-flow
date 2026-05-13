-- TC-012 — Rich Text Notes (Phase 1C-A)
-- Adds content_format discriminator to public.notes so existing plain-text
-- notes remain readable while new/edited notes can be stored as Tiptap JSON.
--
-- Additive only. No RLS change, no trigger change, no existing column modified.
-- Default 'plain' guarantees backward compatibility for all existing rows.

ALTER TABLE public.notes
  ADD COLUMN IF NOT EXISTS content_format VARCHAR(10) NOT NULL DEFAULT 'plain'
    CHECK (content_format IN ('plain', 'json'));
