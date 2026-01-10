-- =============================================================
-- Phase I: Triggers for VP-Flow
-- Case Immutability, Audit Logging, Updated Timestamps
-- =============================================================

-- 1. CASE IMMUTABILITY TRIGGER
-- Prevents any updates to closed cases (status = 'closed')
-- =============================================================

CREATE OR REPLACE FUNCTION public.prevent_closed_case_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status = 'closed' THEN
    RAISE EXCEPTION 'Cannot modify a closed case. Case ID: %', OLD.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_prevent_closed_case_update
  BEFORE UPDATE ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_closed_case_update();

-- =============================================================
-- 2. AUDIT LOGGING FUNCTION
-- Logs changes to audit_events table
-- =============================================================

CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  audit_action audit_action;
  entity_type_val TEXT;
  old_values_json JSONB := NULL;
  new_values_json JSONB := NULL;
BEGIN
  -- Determine entity type from table name
  entity_type_val := TG_TABLE_NAME;
  
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    audit_action := 'create';
    new_values_json := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    -- Check for status change
    IF TG_TABLE_NAME = 'cases' AND OLD.status IS DISTINCT FROM NEW.status THEN
      audit_action := 'status_change';
    ELSIF TG_TABLE_NAME = 'cases' AND OLD.priority IS DISTINCT FROM NEW.priority THEN
      audit_action := 'priority_change';
    ELSIF TG_TABLE_NAME = 'cases' AND OLD.deadline IS DISTINCT FROM NEW.deadline THEN
      audit_action := 'deadline_change';
    ELSIF TG_TABLE_NAME = 'appointments' AND OLD.status IS DISTINCT FROM NEW.status THEN
      audit_action := 'status_change';
    ELSE
      audit_action := 'update';
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
    audit_action,
    auth.uid(),
    old_values_json,
    new_values_json,
    '0.0.0.0'::inet
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- =============================================================
-- 3. AUDIT TRIGGERS FOR CASES
-- =============================================================

CREATE TRIGGER audit_cases_insert
  AFTER INSERT ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_cases_update
  AFTER UPDATE ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION public.log_audit_event();

-- =============================================================
-- 4. AUDIT TRIGGERS FOR APPOINTMENTS
-- =============================================================

CREATE TRIGGER audit_appointments_insert
  AFTER INSERT ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_appointments_update
  AFTER UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.log_audit_event();

-- =============================================================
-- 5. UPDATED_AT TIMESTAMP TRIGGER FUNCTION
-- =============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =============================================================
-- 6. UPDATED_AT TRIGGERS FOR ALL APPLICABLE TABLES
-- =============================================================

-- appointments
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- cases
CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- clients
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- protocol_events
CREATE TRIGGER update_protocol_events_updated_at
  BEFORE UPDATE ON public.protocol_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================
-- 7. PROFILE AUTO-CREATE TRIGGER FOR NEW USERS
-- =============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, is_active)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 
    true
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();