-- ============================================
-- Priority 3-A: Handwriting & Pen Input
-- Migration: Storage Bucket, Table, RLS, Audit
-- Date: 2026-01-26
-- ============================================

-- 1. Create note-handwriting storage bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('note-handwriting', 'note-handwriting', false);

-- 2. Storage RLS Policies for note-handwriting bucket
-- Policy: VP can view own handwriting files
CREATE POLICY "VP can view own handwriting files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'note-handwriting' 
  AND is_vp(auth.uid())
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: VP can upload to own folder
CREATE POLICY "VP can upload own handwriting files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'note-handwriting'
  AND is_vp(auth.uid())
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: VP can update own files
CREATE POLICY "VP can update own handwriting files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'note-handwriting'
  AND is_vp(auth.uid())
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: VP can delete own files
CREATE POLICY "VP can delete own handwriting files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'note-handwriting'
  AND is_vp(auth.uid())
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Extend audit_action enum with handwriting actions
ALTER TYPE public.audit_action ADD VALUE 'handwriting_created';
ALTER TYPE public.audit_action ADD VALUE 'handwriting_updated';
ALTER TYPE public.audit_action ADD VALUE 'handwriting_deleted';

-- 4. Create note_handwriting table
CREATE TABLE public.note_handwriting (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  owner_user_id uuid NOT NULL,
  storage_type text NOT NULL DEFAULT 'vector' CHECK (storage_type IN ('vector', 'raster')),
  storage_ref text NOT NULL,
  stroke_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- 5. Add unique constraint for one active handwriting per note
CREATE UNIQUE INDEX idx_note_handwriting_unique_active 
ON public.note_handwriting (note_id) 
WHERE deleted_at IS NULL;

-- 6. Add indexes for performance
CREATE INDEX idx_note_handwriting_note_id ON public.note_handwriting (note_id);
CREATE INDEX idx_note_handwriting_owner ON public.note_handwriting (owner_user_id);

-- 7. Enable RLS on note_handwriting
ALTER TABLE public.note_handwriting ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies for note_handwriting (VP-only)
-- SELECT: VP can view own non-deleted handwriting
CREATE POLICY "VP can view own handwriting"
ON public.note_handwriting FOR SELECT
USING (
  is_vp(auth.uid()) 
  AND owner_user_id = auth.uid() 
  AND deleted_at IS NULL
);

-- INSERT: VP can insert for own notes
CREATE POLICY "VP can insert handwriting"
ON public.note_handwriting FOR INSERT
WITH CHECK (
  is_vp(auth.uid())
  AND owner_user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.notes n
    WHERE n.id = note_id
      AND n.owner_user_id = auth.uid()
      AND n.deleted_at IS NULL
  )
);

-- UPDATE: VP can update own handwriting
CREATE POLICY "VP can update own handwriting"
ON public.note_handwriting FOR UPDATE
USING (
  is_vp(auth.uid())
  AND owner_user_id = auth.uid()
  AND deleted_at IS NULL
);

-- DELETE: VP can soft-delete own handwriting
CREATE POLICY "VP can delete own handwriting"
ON public.note_handwriting FOR DELETE
USING (
  is_vp(auth.uid())
  AND owner_user_id = auth.uid()
);

-- 9. Trigger for updated_at
CREATE TRIGGER update_note_handwriting_updated_at
BEFORE UPDATE ON public.note_handwriting
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Audit trigger function for handwriting
CREATE OR REPLACE FUNCTION public.log_handwriting_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  audit_action_val audit_action;
  old_values_json JSONB := NULL;
  new_values_json JSONB := NULL;
BEGIN
  -- Build sanitized payload (NO visual content in audit per security governance)
  IF TG_OP = 'INSERT' THEN
    audit_action_val := 'handwriting_created';
    new_values_json := jsonb_build_object(
      'id', NEW.id,
      'note_id', NEW.note_id,
      'owner_user_id', NEW.owner_user_id,
      'storage_type', NEW.storage_type,
      'stroke_count', NEW.stroke_count,
      'created_at', NEW.created_at
    );
  ELSIF TG_OP = 'UPDATE' THEN
    -- Check for soft delete (deleted_at set)
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      audit_action_val := 'handwriting_deleted';
    ELSE
      audit_action_val := 'handwriting_updated';
    END IF;
    old_values_json := jsonb_build_object(
      'id', OLD.id,
      'note_id', OLD.note_id,
      'owner_user_id', OLD.owner_user_id,
      'storage_type', OLD.storage_type,
      'stroke_count', OLD.stroke_count,
      'updated_at', OLD.updated_at,
      'deleted_at', OLD.deleted_at
    );
    new_values_json := jsonb_build_object(
      'id', NEW.id,
      'note_id', NEW.note_id,
      'owner_user_id', NEW.owner_user_id,
      'storage_type', NEW.storage_type,
      'stroke_count', NEW.stroke_count,
      'updated_at', NEW.updated_at,
      'deleted_at', NEW.deleted_at
    );
  END IF;
  
  -- Insert audit event
  INSERT INTO public.audit_events (
    entity_type,
    entity_id,
    action,
    performed_by,
    old_values,
    new_values,
    ip_address
  ) VALUES (
    'note_handwriting',
    COALESCE(NEW.id, OLD.id),
    audit_action_val,
    auth.uid(),
    old_values_json,
    new_values_json,
    '0.0.0.0'::inet
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 11. Attach audit trigger to note_handwriting
CREATE TRIGGER audit_note_handwriting
AFTER INSERT OR UPDATE ON public.note_handwriting
FOR EACH ROW
EXECUTE FUNCTION public.log_handwriting_audit();