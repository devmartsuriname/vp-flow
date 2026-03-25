-- =============================================
-- INCOMING POST & ARCHIVE MODULE
-- Priority 3-B Implementation
-- =============================================

-- 1. Create enums
CREATE TYPE public.incoming_post_status AS ENUM (
  'received',
  'registered',
  'waiting_advice',
  'advice_received',
  'forwarded',
  'rejected',
  'appointment_created',
  'closed',
  'archived'
);

CREATE TYPE public.incoming_post_urgency AS ENUM (
  'normal',
  'urgent',
  'confidential'
);

CREATE TYPE public.incoming_post_category AS ENUM (
  'letter',
  'memo',
  'invitation',
  'legal',
  'report',
  'other'
);

-- 2. Extend document_entity_type with 'incoming_post'
ALTER TYPE public.document_entity_type ADD VALUE IF NOT EXISTS 'incoming_post';

-- 3. Extend audit_action with incoming_post actions
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'incoming_post_created';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'incoming_post_updated';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'incoming_post_status_changed';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'incoming_post_archived';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'incoming_post_forwarded';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'incoming_post_appointment_linked';

-- 4. Create incoming_post table
CREATE TABLE public.incoming_post (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number text UNIQUE NOT NULL,
  subject text NOT NULL,
  sender_name text NOT NULL,
  sender_organization text,
  received_date date NOT NULL DEFAULT CURRENT_DATE,
  category incoming_post_category NOT NULL DEFAULT 'letter',
  urgency incoming_post_urgency NOT NULL DEFAULT 'normal',
  status incoming_post_status NOT NULL DEFAULT 'received',
  description text,
  advice_request text,
  advice_response text,
  forwarding_destination text,
  rejection_reason text,
  linked_appointment_id uuid REFERENCES public.appointments(id),
  registered_by uuid,
  registered_at timestamptz,
  forwarded_by uuid,
  forwarded_at timestamptz,
  rejected_by uuid,
  rejected_at timestamptz,
  closed_by uuid,
  closed_at timestamptz,
  archived_by uuid,
  archived_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Reference number generation function
CREATE OR REPLACE FUNCTION public.generate_incoming_post_reference()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_year int;
  v_seq int;
  v_ref text;
BEGIN
  v_year := EXTRACT(YEAR FROM COALESCE(NEW.received_date, CURRENT_DATE));
  
  -- Use advisory lock to prevent race conditions
  PERFORM pg_advisory_xact_lock(hashtext('incoming_post_ref_' || v_year::text));
  
  -- Count existing posts for this year + 1
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(reference_number FROM 'SECVP-\d{4}-(\d{4})') AS int)
  ), 0) + 1
  INTO v_seq
  FROM incoming_post
  WHERE reference_number LIKE 'SECVP-' || v_year::text || '-%';
  
  v_ref := 'SECVP-' || v_year::text || '-' || LPAD(v_seq::text, 4, '0');
  NEW.reference_number := v_ref;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_generate_incoming_post_reference
  BEFORE INSERT ON public.incoming_post
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_incoming_post_reference();

-- 6. Updated_at trigger (reuse existing function)
CREATE TRIGGER trg_update_incoming_post_updated_at
  BEFORE UPDATE ON public.incoming_post
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Archive immutability trigger
CREATE OR REPLACE FUNCTION public.prevent_archived_incoming_post_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.status = 'archived' THEN
    RAISE EXCEPTION 'Cannot modify an archived incoming post. ID: %', OLD.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_prevent_archived_incoming_post_update
  BEFORE UPDATE ON public.incoming_post
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_archived_incoming_post_update();

-- 8. Status transition validation trigger
CREATE OR REPLACE FUNCTION public.validate_incoming_post_status_transition()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_is_vp boolean;
  v_valid boolean := false;
BEGIN
  -- Only validate when status actually changes
  IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
    RETURN NEW;
  END IF;

  v_is_vp := is_vp(auth.uid());

  -- Define valid transitions
  IF OLD.status = 'received' AND NEW.status = 'registered' THEN
    v_valid := true;
    NEW.registered_by := auth.uid();
    NEW.registered_at := now();
  
  ELSIF OLD.status = 'registered' AND NEW.status = 'forwarded' THEN
    IF NOT v_is_vp THEN
      RAISE EXCEPTION 'Only VP can forward incoming post';
    END IF;
    v_valid := true;
    NEW.forwarded_by := auth.uid();
    NEW.forwarded_at := now();

  ELSIF OLD.status = 'registered' AND NEW.status = 'waiting_advice' THEN
    IF NOT v_is_vp THEN
      RAISE EXCEPTION 'Only VP can request advice';
    END IF;
    v_valid := true;

  ELSIF OLD.status = 'registered' AND NEW.status = 'rejected' THEN
    IF NOT v_is_vp THEN
      RAISE EXCEPTION 'Only VP can reject incoming post';
    END IF;
    v_valid := true;
    NEW.rejected_by := auth.uid();
    NEW.rejected_at := now();

  ELSIF OLD.status = 'waiting_advice' AND NEW.status = 'advice_received' THEN
    v_valid := true;

  ELSIF OLD.status = 'advice_received' AND NEW.status = 'forwarded' THEN
    IF NOT v_is_vp THEN
      RAISE EXCEPTION 'Only VP can forward incoming post';
    END IF;
    v_valid := true;
    NEW.forwarded_by := auth.uid();
    NEW.forwarded_at := now();

  ELSIF OLD.status = 'advice_received' AND NEW.status = 'rejected' THEN
    IF NOT v_is_vp THEN
      RAISE EXCEPTION 'Only VP can reject incoming post';
    END IF;
    v_valid := true;
    NEW.rejected_by := auth.uid();
    NEW.rejected_at := now();

  ELSIF OLD.status = 'advice_received' AND NEW.status = 'appointment_created' THEN
    IF NOT v_is_vp THEN
      RAISE EXCEPTION 'Only VP can create appointment from incoming post';
    END IF;
    v_valid := true;

  ELSIF OLD.status = 'forwarded' AND NEW.status = 'appointment_created' THEN
    IF NOT v_is_vp THEN
      RAISE EXCEPTION 'Only VP can create appointment from incoming post';
    END IF;
    v_valid := true;

  ELSIF OLD.status = 'forwarded' AND NEW.status = 'closed' THEN
    IF NOT v_is_vp THEN
      RAISE EXCEPTION 'Only VP can close incoming post';
    END IF;
    v_valid := true;
    NEW.closed_by := auth.uid();
    NEW.closed_at := now();

  ELSIF OLD.status = 'appointment_created' AND NEW.status = 'closed' THEN
    IF NOT v_is_vp THEN
      RAISE EXCEPTION 'Only VP can close incoming post';
    END IF;
    v_valid := true;
    NEW.closed_by := auth.uid();
    NEW.closed_at := now();

  ELSIF OLD.status = 'rejected' AND NEW.status = 'closed' THEN
    IF NOT v_is_vp THEN
      RAISE EXCEPTION 'Only VP can close incoming post';
    END IF;
    v_valid := true;
    NEW.closed_by := auth.uid();
    NEW.closed_at := now();

  ELSIF OLD.status = 'closed' AND NEW.status = 'archived' THEN
    IF NOT v_is_vp THEN
      RAISE EXCEPTION 'Only VP can archive incoming post';
    END IF;
    v_valid := true;
    NEW.archived_by := auth.uid();
    NEW.archived_at := now();
  END IF;

  IF NOT v_valid THEN
    RAISE EXCEPTION 'Invalid status transition from % to %', OLD.status, NEW.status;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_incoming_post_status_transition
  BEFORE UPDATE ON public.incoming_post
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_incoming_post_status_transition();

-- 9. Audit logging trigger
CREATE OR REPLACE FUNCTION public.log_incoming_post_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  audit_action_val audit_action;
  old_values_json JSONB := NULL;
  new_values_json JSONB := NULL;
BEGIN
  IF TG_OP = 'INSERT' THEN
    audit_action_val := 'incoming_post_created';
    new_values_json := jsonb_build_object(
      'id', NEW.id,
      'reference_number', NEW.reference_number,
      'subject', NEW.subject,
      'sender_name', NEW.sender_name,
      'category', NEW.category::text,
      'urgency', NEW.urgency::text,
      'status', NEW.status::text,
      'created_by', NEW.created_by
    );
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      IF NEW.status = 'archived' THEN
        audit_action_val := 'incoming_post_archived';
      ELSIF NEW.status = 'forwarded' THEN
        audit_action_val := 'incoming_post_forwarded';
      ELSIF NEW.status = 'appointment_created' THEN
        audit_action_val := 'incoming_post_appointment_linked';
      ELSE
        audit_action_val := 'incoming_post_status_changed';
      END IF;
    ELSE
      audit_action_val := 'incoming_post_updated';
    END IF;
    
    old_values_json := jsonb_build_object(
      'id', OLD.id,
      'reference_number', OLD.reference_number,
      'status', OLD.status::text,
      'subject', OLD.subject
    );
    new_values_json := jsonb_build_object(
      'id', NEW.id,
      'reference_number', NEW.reference_number,
      'status', NEW.status::text,
      'subject', NEW.subject
    );
  END IF;

  INSERT INTO public.audit_events (
    entity_type, entity_id, action, performed_by,
    old_values, new_values, ip_address
  ) VALUES (
    'incoming_post',
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

CREATE TRIGGER trg_log_incoming_post_audit
  AFTER INSERT OR UPDATE ON public.incoming_post
  FOR EACH ROW
  EXECUTE FUNCTION public.log_incoming_post_audit();

-- 10. Notification trigger
CREATE OR REPLACE FUNCTION public.notify_incoming_post_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_vp_id uuid;
  v_secretary_id uuid;
  v_is_vp_user boolean;
BEGIN
  IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
    RETURN NEW;
  END IF;

  v_vp_id := get_vp_user_id();
  v_is_vp_user := is_vp(auth.uid());

  -- Notify VP when item is registered by Secretary
  IF NEW.status = 'registered' AND NOT v_is_vp_user AND v_vp_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, link, category)
    VALUES (
      v_vp_id,
      'Incoming Post Registered',
      format('New post registered: %s — %s', NEW.reference_number, NEW.subject),
      format('/incoming-post/%s', NEW.id),
      'system'
    );
  END IF;

  -- Notify Secretaries when VP makes decisions
  IF NEW.status IN ('forwarded', 'rejected', 'waiting_advice') AND v_is_vp_user THEN
    FOR v_secretary_id IN SELECT * FROM get_secretary_user_ids() LOOP
      INSERT INTO notifications (user_id, title, message, link, category)
      VALUES (
        v_secretary_id,
        CASE NEW.status::text
          WHEN 'forwarded' THEN 'Post Forwarded'
          WHEN 'rejected' THEN 'Post Rejected'
          WHEN 'waiting_advice' THEN 'Advice Requested'
        END,
        format('%s — %s', NEW.reference_number, NEW.subject),
        format('/incoming-post/%s', NEW.id),
        'system'
      );
    END LOOP;
  END IF;

  -- Notify VP when advice is provided by Secretary
  IF NEW.status = 'advice_received' AND NOT v_is_vp_user AND v_vp_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, link, category)
    VALUES (
      v_vp_id,
      'Advice Received',
      format('Advice provided for: %s — %s', NEW.reference_number, NEW.subject),
      format('/incoming-post/%s', NEW.id),
      'system'
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_incoming_post_status_change
  AFTER UPDATE ON public.incoming_post
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_incoming_post_status_change();

-- 11. RLS
ALTER TABLE public.incoming_post ENABLE ROW LEVEL SECURITY;

CREATE POLICY "VP can view all incoming post"
  ON public.incoming_post FOR SELECT
  TO authenticated
  USING (is_vp(auth.uid()));

CREATE POLICY "VP can insert incoming post"
  ON public.incoming_post FOR INSERT
  TO authenticated
  WITH CHECK (is_vp(auth.uid()));

CREATE POLICY "VP can update incoming post"
  ON public.incoming_post FOR UPDATE
  TO authenticated
  USING (is_vp(auth.uid()) AND status != 'archived');

CREATE POLICY "Secretary can view all incoming post"
  ON public.incoming_post FOR SELECT
  TO authenticated
  USING (is_secretary(auth.uid()));

CREATE POLICY "Secretary can insert incoming post"
  ON public.incoming_post FOR INSERT
  TO authenticated
  WITH CHECK (is_secretary(auth.uid()));

CREATE POLICY "Secretary can update incoming post"
  ON public.incoming_post FOR UPDATE
  TO authenticated
  USING (
    is_secretary(auth.uid()) 
    AND status IN ('received', 'registered', 'waiting_advice')
  );

CREATE POLICY "Protocol can view forwarded invitations"
  ON public.incoming_post FOR SELECT
  TO authenticated
  USING (
    is_protocol(auth.uid()) 
    AND category = 'invitation' 
    AND status NOT IN ('received', 'registered')
  );

-- 12. Indexes
CREATE INDEX idx_incoming_post_status ON public.incoming_post(status);
CREATE INDEX idx_incoming_post_category ON public.incoming_post(category);
CREATE INDEX idx_incoming_post_urgency ON public.incoming_post(urgency);
CREATE INDEX idx_incoming_post_received_date ON public.incoming_post(received_date);
CREATE INDEX idx_incoming_post_created_by ON public.incoming_post(created_by);
