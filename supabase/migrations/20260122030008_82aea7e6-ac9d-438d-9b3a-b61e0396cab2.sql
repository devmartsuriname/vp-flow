-- =====================================================
-- VP-Flow v1.1-B Phase A (B6.1): Database Foundation
-- Notes System Schema Migration
-- =====================================================

-- 1. Create note_entity_type enum
CREATE TYPE public.note_entity_type AS ENUM ('guest', 'appointment', 'case');

-- 2. Create notes table
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- 3. Create note_links table
CREATE TABLE public.note_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  entity_type public.note_entity_type NOT NULL,
  entity_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_links_one_per_note UNIQUE (note_id)
);

-- 4. Create indexes
CREATE INDEX idx_notes_owner_user_id ON public.notes(owner_user_id);
CREATE INDEX idx_notes_deleted_at ON public.notes(deleted_at);
CREATE INDEX idx_note_links_note_id ON public.note_links(note_id);
CREATE INDEX idx_note_links_entity ON public.note_links(entity_type, entity_id);

-- 5. Add updated_at trigger
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Extend audit_action enum with note-related actions
ALTER TYPE public.audit_action ADD VALUE 'note_created';
ALTER TYPE public.audit_action ADD VALUE 'note_updated';
ALTER TYPE public.audit_action ADD VALUE 'note_deleted';
ALTER TYPE public.audit_action ADD VALUE 'note_linked';
ALTER TYPE public.audit_action ADD VALUE 'note_unlinked';

-- 7. Enable RLS on new tables (policies deferred to Phase B6.2)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_links ENABLE ROW LEVEL SECURITY;