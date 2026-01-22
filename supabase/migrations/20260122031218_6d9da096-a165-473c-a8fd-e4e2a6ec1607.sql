-- ==========================================
-- VP-Flow v1.1-B Phase B6.3: Audit Triggers
-- Tables: notes, note_links
-- Events: note_created, note_updated, note_deleted, note_linked, note_unlinked
-- Security: NO content/title in audit payload
-- ==========================================

-- Function: log_note_audit
-- Handles INSERT and UPDATE on notes table
-- CRITICAL: Excludes content and title from audit payload
CREATE OR REPLACE FUNCTION public.log_note_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  audit_action_val audit_action;
  old_values_json JSONB := NULL;
  new_values_json JSONB := NULL;
BEGIN
  -- Build sanitized payload (NO content, NO title per DOC B9)
  IF TG_OP = 'INSERT' THEN
    audit_action_val := 'note_created';
    new_values_json := jsonb_build_object(
      'id', NEW.id,
      'owner_user_id', NEW.owner_user_id,
      'created_at', NEW.created_at,
      'updated_at', NEW.updated_at,
      'deleted_at', NEW.deleted_at
    );
  ELSIF TG_OP = 'UPDATE' THEN
    -- Check for soft delete (deleted_at set)
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      audit_action_val := 'note_deleted';
    ELSE
      audit_action_val := 'note_updated';
    END IF;
    old_values_json := jsonb_build_object(
      'id', OLD.id,
      'owner_user_id', OLD.owner_user_id,
      'created_at', OLD.created_at,
      'updated_at', OLD.updated_at,
      'deleted_at', OLD.deleted_at
    );
    new_values_json := jsonb_build_object(
      'id', NEW.id,
      'owner_user_id', NEW.owner_user_id,
      'created_at', NEW.created_at,
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
    'notes',
    COALESCE(NEW.id, OLD.id),
    audit_action_val,
    auth.uid(),
    old_values_json,
    new_values_json,
    '0.0.0.0'::inet
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Function: log_note_link_audit
-- Handles INSERT and DELETE on note_links table
CREATE OR REPLACE FUNCTION public.log_note_link_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  audit_action_val audit_action;
BEGIN
  IF TG_OP = 'INSERT' THEN
    audit_action_val := 'note_linked';
    INSERT INTO public.audit_events (
      entity_type, entity_id, action, performed_by,
      old_values, new_values, ip_address
    ) VALUES (
      'note_links', NEW.id, audit_action_val, auth.uid(),
      NULL, to_jsonb(NEW), '0.0.0.0'::inet
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    audit_action_val := 'note_unlinked';
    INSERT INTO public.audit_events (
      entity_type, entity_id, action, performed_by,
      old_values, new_values, ip_address
    ) VALUES (
      'note_links', OLD.id, audit_action_val, auth.uid(),
      to_jsonb(OLD), NULL, '0.0.0.0'::inet
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Trigger: audit_notes_insert
CREATE TRIGGER audit_notes_insert
  AFTER INSERT ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.log_note_audit();

-- Trigger: audit_notes_update
CREATE TRIGGER audit_notes_update
  AFTER UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.log_note_audit();

-- Trigger: audit_note_links_insert
CREATE TRIGGER audit_note_links_insert
  AFTER INSERT ON public.note_links
  FOR EACH ROW
  EXECUTE FUNCTION public.log_note_link_audit();

-- Trigger: audit_note_links_delete
CREATE TRIGGER audit_note_links_delete
  AFTER DELETE ON public.note_links
  FOR EACH ROW
  EXECUTE FUNCTION public.log_note_link_audit();