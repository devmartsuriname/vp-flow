-- Phase C Migration 1: Enhanced Case Audit Logic
-- Adds detection for case re-open lifecycle events

CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  audit_action_val audit_action;
  entity_type_val TEXT;
  old_values_json JSONB := NULL;
  new_values_json JSONB := NULL;
BEGIN
  -- Determine entity type from table name
  entity_type_val := TG_TABLE_NAME;
  
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    audit_action_val := 'create';
    new_values_json := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    -- Case-specific audit logic
    IF TG_TABLE_NAME = 'cases' THEN
      -- Check for case re-open lifecycle transitions (v1.1-A)
      IF OLD.status = 'closed' AND NEW.status = 'reopened' THEN
        audit_action_val := 'case_reopened';
      ELSIF OLD.status = 'reopened' AND NEW.status = 'closed' THEN
        audit_action_val := 'case_reclosed';
      ELSIF OLD.status = 'reopened' AND NEW.status = 'reopened' THEN
        -- Edit made while case is in reopened state
        audit_action_val := 'case_reopen_edit';
      ELSIF OLD.status IS DISTINCT FROM NEW.status THEN
        audit_action_val := 'status_change';
      ELSIF OLD.priority IS DISTINCT FROM NEW.priority THEN
        audit_action_val := 'priority_change';
      ELSIF OLD.deadline IS DISTINCT FROM NEW.deadline THEN
        audit_action_val := 'deadline_change';
      ELSE
        audit_action_val := 'update';
      END IF;
    -- Appointment-specific audit logic
    ELSIF TG_TABLE_NAME = 'appointments' THEN
      IF OLD.status IS DISTINCT FROM NEW.status THEN
        audit_action_val := 'status_change';
      ELSE
        audit_action_val := 'update';
      END IF;
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
    entity_type_val,
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