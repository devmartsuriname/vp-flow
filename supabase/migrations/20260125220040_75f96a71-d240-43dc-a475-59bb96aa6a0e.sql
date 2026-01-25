-- VP-Flow v1.2-A: Internal Notifications System
-- Implements automated notification triggers for system events

-- ============================================
-- PHASE 1: Extend audit_action enum
-- ============================================
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'notification_created';
ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'notification_read';

-- ============================================
-- PHASE 2: Helper function to get VP user ID
-- ============================================
CREATE OR REPLACE FUNCTION get_vp_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id FROM user_roles WHERE role = 'vp' LIMIT 1;
$$;

-- ============================================
-- PHASE 3: Case Status Change Notification Trigger
-- ============================================
CREATE OR REPLACE FUNCTION notify_case_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_vp_id uuid;
  v_case_number text;
BEGIN
  -- Only trigger on status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    v_vp_id := get_vp_user_id();
    v_case_number := NEW.case_number;
    
    -- Notify VP
    IF v_vp_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, title, message, link)
      VALUES (
        v_vp_id,
        'Case Status Updated',
        format('Case %s status changed to %s', v_case_number, NEW.status),
        format('/cases/%s', NEW.id)
      );
    END IF;
    
    -- Notify assigned Secretary (if different from VP)
    IF NEW.assigned_to IS NOT NULL AND NEW.assigned_to IS DISTINCT FROM v_vp_id THEN
      INSERT INTO notifications (user_id, title, message, link)
      VALUES (
        NEW.assigned_to,
        'Case Status Updated',
        format('Case %s status changed to %s', v_case_number, NEW.status),
        format('/cases/%s', NEW.id)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_case_status_change
AFTER UPDATE ON cases
FOR EACH ROW
EXECUTE FUNCTION notify_case_status_change();

-- ============================================
-- PHASE 4: Case Re-opened Notification Trigger
-- ============================================
CREATE OR REPLACE FUNCTION notify_case_reopened()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_vp_id uuid;
BEGIN
  -- Only trigger on closed -> reopened transition
  IF OLD.status = 'closed' AND NEW.status = 'reopened' THEN
    v_vp_id := get_vp_user_id();
    
    IF v_vp_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, title, message, link)
      VALUES (
        v_vp_id,
        'Case Re-opened',
        format('Case %s has been re-opened', NEW.case_number),
        format('/cases/%s', NEW.id)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_case_reopened
AFTER UPDATE ON cases
FOR EACH ROW
EXECUTE FUNCTION notify_case_reopened();

-- ============================================
-- PHASE 5: Appointment Status Change Notification Trigger
-- ============================================
CREATE OR REPLACE FUNCTION notify_appointment_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_vp_id uuid;
  v_client_name text;
  v_title text;
  v_message text;
BEGIN
  -- Only trigger on approved/rejected status changes
  IF NEW.status IN ('approved', 'rejected') AND OLD.status IS DISTINCT FROM NEW.status THEN
    v_vp_id := get_vp_user_id();
    
    -- Get client name
    SELECT COALESCE(
      organization_name,
      CONCAT(first_name, ' ', last_name)
    ) INTO v_client_name
    FROM clients WHERE id = NEW.client_id;
    
    IF NEW.status = 'approved' THEN
      v_title := 'Appointment Approved';
      v_message := format('Appointment with %s on %s has been approved', 
        COALESCE(v_client_name, 'Unknown'), NEW.scheduled_date);
    ELSE
      v_title := 'Appointment Rejected';
      v_message := format('Appointment with %s on %s has been rejected', 
        COALESCE(v_client_name, 'Unknown'), NEW.scheduled_date);
    END IF;
    
    -- Notify VP
    IF v_vp_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, title, message, link)
      VALUES (v_vp_id, v_title, v_message, format('/appointments/%s', NEW.id));
    END IF;
    
    -- Notify submitting Secretary (if different from VP)
    IF NEW.submitted_by IS NOT NULL AND NEW.submitted_by IS DISTINCT FROM v_vp_id THEN
      INSERT INTO notifications (user_id, title, message, link)
      VALUES (NEW.submitted_by, v_title, v_message, format('/appointments/%s', NEW.id));
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_appointment_status
AFTER UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION notify_appointment_status_change();

-- ============================================
-- PHASE 6: Document Uploaded Notification Trigger
-- ============================================
CREATE OR REPLACE FUNCTION notify_document_uploaded()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_vp_id uuid;
  v_entity_label text;
  v_link text;
BEGIN
  v_vp_id := get_vp_user_id();
  
  -- Build entity label and link
  v_entity_label := CASE NEW.entity_type::text
    WHEN 'case' THEN 'case'
    WHEN 'appointment' THEN 'appointment'
    WHEN 'guest' THEN 'guest'
    ELSE 'record'
  END;
  
  v_link := CASE NEW.entity_type::text
    WHEN 'case' THEN format('/cases/%s', NEW.entity_id)
    WHEN 'appointment' THEN format('/appointments/%s', NEW.entity_id)
    WHEN 'guest' THEN format('/guests/%s', NEW.entity_id)
    ELSE NULL
  END;
  
  -- Notify VP (if not the uploader)
  IF v_vp_id IS NOT NULL AND (NEW.uploaded_by IS NULL OR NEW.uploaded_by IS DISTINCT FROM v_vp_id) THEN
    INSERT INTO notifications (user_id, title, message, link)
    VALUES (
      v_vp_id,
      'Document Added',
      format('New document "%s" uploaded to %s', NEW.file_name, v_entity_label),
      v_link
    );
  END IF;
  
  -- Notify uploader if Secretary (confirmation)
  IF NEW.uploaded_by IS NOT NULL 
     AND NEW.uploaded_by IS DISTINCT FROM v_vp_id 
     AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = NEW.uploaded_by AND role = 'secretary')
  THEN
    INSERT INTO notifications (user_id, title, message, link)
    VALUES (
      NEW.uploaded_by,
      'Document Uploaded',
      format('Your document "%s" has been uploaded successfully', NEW.file_name),
      v_link
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_document_uploaded
AFTER INSERT ON documents
FOR EACH ROW
EXECUTE FUNCTION notify_document_uploaded();

-- ============================================
-- PHASE 7: Audit Trigger for Notification Events
-- ============================================
CREATE OR REPLACE FUNCTION audit_notification_events()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_action audit_action;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'notification_created';
    INSERT INTO audit_events (
      entity_type,
      entity_id,
      action,
      performed_by,
      new_values,
      ip_address
    ) VALUES (
      'notifications',
      NEW.id,
      v_action,
      COALESCE(auth.uid(), NEW.user_id),
      jsonb_build_object('title', NEW.title, 'message', NEW.message),
      '0.0.0.0'::inet
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Only audit read status changes
    IF OLD.is_read IS DISTINCT FROM NEW.is_read AND NEW.is_read = true THEN
      v_action := 'notification_read';
      INSERT INTO audit_events (
        entity_type,
        entity_id,
        action,
        performed_by,
        old_values,
        new_values,
        ip_address
      ) VALUES (
        'notifications',
        NEW.id,
        v_action,
        COALESCE(auth.uid(), NEW.user_id),
        jsonb_build_object('is_read', OLD.is_read),
        jsonb_build_object('is_read', NEW.is_read, 'read_at', NEW.read_at),
        '0.0.0.0'::inet
      );
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trigger_audit_notification_events
AFTER INSERT OR UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION audit_notification_events();