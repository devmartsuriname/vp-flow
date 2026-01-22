-- Phase C Migration 2: Document Audit Function + Triggers
-- Logs create and deactivation events for documents table

CREATE OR REPLACE FUNCTION public.log_document_audit()
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
  IF TG_OP = 'INSERT' THEN
    audit_action_val := 'create';
    new_values_json := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    -- Check for deactivation (is_active true -> false)
    IF OLD.is_active = true AND NEW.is_active = false THEN
      audit_action_val := 'document_deactivated';
    ELSE
      audit_action_val := 'update';
    END IF;
    old_values_json := to_jsonb(OLD);
    new_values_json := to_jsonb(NEW);
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
    'documents',
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

-- Create triggers for documents table
CREATE TRIGGER audit_documents_insert
AFTER INSERT ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.log_document_audit();

CREATE TRIGGER audit_documents_update
AFTER UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.log_document_audit();