-- =====================================================
-- VP-Flow v1.3-A Migration: Documents Lifecycle & Versioning
-- =====================================================

-- 1. Create document_status enum
CREATE TYPE public.document_status AS ENUM ('draft', 'final', 'archived');

-- 2. Add lifecycle and versioning columns to documents table
ALTER TABLE public.documents
  ADD COLUMN status document_status NOT NULL DEFAULT 'draft',
  ADD COLUMN version_number integer NOT NULL DEFAULT 1,
  ADD COLUMN parent_document_id uuid REFERENCES public.documents(id),
  ADD COLUMN is_current_version boolean NOT NULL DEFAULT true,
  ADD COLUMN status_changed_at timestamptz,
  ADD COLUMN status_changed_by uuid;

-- 3. Backfill existing documents: active = final, inactive = archived
UPDATE public.documents 
SET status = CASE 
  WHEN is_active = false THEN 'archived'::document_status 
  ELSE 'final'::document_status 
END,
status_changed_at = uploaded_at,
status_changed_by = uploaded_by;

-- 4. Add indexes for version chain queries
CREATE INDEX idx_documents_parent ON public.documents(parent_document_id);
CREATE INDEX idx_documents_current_version ON public.documents(is_current_version) WHERE is_current_version = true;
CREATE INDEX idx_documents_status ON public.documents(status);

-- 5. Extend audit_action enum with new document actions
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'document_status_changed';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'document_version_created';

-- 6. Create trigger function for status transition validation
CREATE OR REPLACE FUNCTION public.validate_document_status_transition()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Record who changed status and when
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.status_changed_at := now();
    NEW.status_changed_by := auth.uid();
    
    -- Enforce transition rules:
    -- archived -> anything: PROHIBITED
    IF OLD.status = 'archived' THEN
      RAISE EXCEPTION 'Cannot change status of archived document';
    END IF;
    
    -- final -> draft: PROHIBITED (no reversion)
    IF OLD.status = 'final' AND NEW.status = 'draft' THEN
      RAISE EXCEPTION 'Cannot revert finalized document to draft';
    END IF;
    
    -- final -> archived: VP only
    IF OLD.status = 'final' AND NEW.status = 'archived' THEN
      IF NOT is_vp(auth.uid()) THEN
        RAISE EXCEPTION 'Only VP can archive documents';
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_validate_document_status_transition
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_document_status_transition();

-- 7. Create trigger function for document edit permission validation
CREATE OR REPLACE FUNCTION public.validate_document_edit_permission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Skip if user is VP (VP has full control)
  IF is_vp(auth.uid()) THEN
    RETURN NEW;
  END IF;

  -- Secretary can only edit documents they uploaded
  IF is_secretary(auth.uid()) THEN
    IF OLD.uploaded_by IS DISTINCT FROM auth.uid() THEN
      -- Allow only status changes by non-owner secretaries (draft -> final)
      IF (OLD.title IS DISTINCT FROM NEW.title) OR 
         (OLD.description IS DISTINCT FROM NEW.description) OR
         (OLD.file_name IS DISTINCT FROM NEW.file_name) THEN
        RAISE EXCEPTION 'Secretary can only edit documents they uploaded';
      END IF;
    END IF;
  END IF;
  
  -- Finalized/archived documents: no metadata edits (except status changes by authorized users)
  IF OLD.status IN ('final', 'archived') THEN
    IF (OLD.title IS DISTINCT FROM NEW.title) OR 
       (OLD.description IS DISTINCT FROM NEW.description) THEN
      RAISE EXCEPTION 'Cannot edit metadata of finalized or archived documents';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_validate_document_edit_permission
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_document_edit_permission();

-- 8. Create trigger function for version chain management
CREATE OR REPLACE FUNCTION public.manage_document_version_chain()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- When creating a new version, mark parent as not current
  IF NEW.parent_document_id IS NOT NULL THEN
    UPDATE public.documents
    SET is_current_version = false
    WHERE id = NEW.parent_document_id
      AND is_current_version = true;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_manage_document_version_chain
  AFTER INSERT ON public.documents
  FOR EACH ROW
  WHEN (NEW.parent_document_id IS NOT NULL)
  EXECUTE FUNCTION public.manage_document_version_chain();

-- 9. Create audit trigger for document status changes
CREATE OR REPLACE FUNCTION public.log_document_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only trigger if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.audit_events (
      entity_type, entity_id, action, performed_by,
      old_values, new_values, ip_address
    ) VALUES (
      'documents', NEW.id, 'document_status_changed', auth.uid(),
      jsonb_build_object('status', OLD.status::text),
      jsonb_build_object('status', NEW.status::text, 'changed_at', NEW.status_changed_at),
      '0.0.0.0'::inet
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_log_document_status_change
  AFTER UPDATE ON public.documents
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.log_document_status_change();

-- 10. Create audit trigger for document version creation
CREATE OR REPLACE FUNCTION public.log_document_version_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only for version 2+ (has parent)
  IF NEW.parent_document_id IS NOT NULL THEN
    INSERT INTO public.audit_events (
      entity_type, entity_id, action, performed_by,
      old_values, new_values, ip_address
    ) VALUES (
      'documents', NEW.id, 'document_version_created', auth.uid(),
      NULL,
      jsonb_build_object(
        'version_number', NEW.version_number,
        'parent_document_id', NEW.parent_document_id,
        'file_name', NEW.file_name
      ),
      '0.0.0.0'::inet
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_log_document_version_created
  AFTER INSERT ON public.documents
  FOR EACH ROW
  WHEN (NEW.parent_document_id IS NOT NULL)
  EXECUTE FUNCTION public.log_document_version_created();