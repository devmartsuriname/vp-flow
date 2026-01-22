-- Phase C Migration 3: Document Link Audit Function + Trigger
-- Logs document_linked events for document_links table

CREATE OR REPLACE FUNCTION public.log_document_link_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only INSERT is audited for document links (linking action)
  INSERT INTO public.audit_events (
    entity_type,
    entity_id,
    action,
    performed_by,
    old_values,
    new_values,
    ip_address
  ) VALUES (
    'document_links',
    NEW.id,
    'document_linked',
    auth.uid(),
    NULL,
    to_jsonb(NEW),
    '0.0.0.0'::inet
  );
  
  RETURN NEW;
END;
$function$;

-- Create trigger for document_links table
CREATE TRIGGER audit_document_links_insert
AFTER INSERT ON public.document_links
FOR EACH ROW
EXECUTE FUNCTION public.log_document_link_audit();