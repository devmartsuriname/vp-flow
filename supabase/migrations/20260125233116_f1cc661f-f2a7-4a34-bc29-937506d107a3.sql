-- ============================================================
-- VP-Flow v1.3-C: Notifications Deepening
-- Database Migration
-- Date: 2026-01-25
-- ============================================================

-- 1. Create notification category enum
CREATE TYPE public.notification_category AS ENUM (
  'case',
  'appointment', 
  'document',
  'system'
);

-- 2. Add category column to notifications table
ALTER TABLE public.notifications
  ADD COLUMN category notification_category;

-- 3. Add index for category filtering
CREATE INDEX idx_notifications_category 
ON public.notifications(category) 
WHERE category IS NOT NULL;

-- 4. Add documentation comment
COMMENT ON COLUMN public.notifications.category IS 
  'Logical category for notification grouping (case, appointment, document, system)';

-- 5. Create helper function to get all Secretary user IDs
CREATE OR REPLACE FUNCTION public.get_secretary_user_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT user_id FROM user_roles WHERE role = 'secretary';
$$;

-- 6. Update notify_case_reopened to include Secretary and category
CREATE OR REPLACE FUNCTION public.notify_case_reopened()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_vp_id uuid;
BEGIN
  -- Only trigger on closed -> reopened transition
  IF OLD.status = 'closed' AND NEW.status = 'reopened' THEN
    v_vp_id := get_vp_user_id();
    
    -- Notify VP
    IF v_vp_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, title, message, link, category)
      VALUES (
        v_vp_id,
        'Case Re-opened',
        format('Case %s has been re-opened: %s', 
          NEW.case_number, 
          COALESCE(LEFT(NEW.reopen_reason, 50), 'No reason provided')),
        format('/cases/%s', NEW.id),
        'case'
      );
    END IF;
    
    -- Notify assigned Secretary (if different from VP)
    IF NEW.assigned_to IS NOT NULL AND NEW.assigned_to IS DISTINCT FROM v_vp_id THEN
      INSERT INTO notifications (user_id, title, message, link, category)
      VALUES (
        NEW.assigned_to,
        'Case Re-opened',
        format('Case %s has been re-opened', NEW.case_number),
        format('/cases/%s', NEW.id),
        'case'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 7. Create notify_case_assigned function
CREATE OR REPLACE FUNCTION public.notify_case_assigned()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_vp_id uuid;
BEGIN
  -- Only trigger when assigned_to changes to a non-null value
  IF NEW.assigned_to IS NOT NULL 
     AND (OLD.assigned_to IS NULL OR OLD.assigned_to IS DISTINCT FROM NEW.assigned_to) 
  THEN
    v_vp_id := get_vp_user_id();
    
    -- Notify new assignee (if not VP)
    IF NEW.assigned_to IS DISTINCT FROM v_vp_id THEN
      INSERT INTO notifications (user_id, title, message, link, category)
      VALUES (
        NEW.assigned_to,
        'Case Assigned',
        format('Case %s has been assigned to you', NEW.case_number),
        format('/cases/%s', NEW.id),
        'case'
      );
    END IF;
    
    -- Notify VP of assignment (if they weren't the one making the change)
    IF v_vp_id IS NOT NULL AND v_vp_id IS DISTINCT FROM auth.uid() THEN
      INSERT INTO notifications (user_id, title, message, link, category)
      VALUES (
        v_vp_id,
        'Case Assignment Changed',
        format('Case %s has been assigned', NEW.case_number),
        format('/cases/%s', NEW.id),
        'case'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 8. Create trigger for case assignment
CREATE TRIGGER trigger_notify_case_assigned
  AFTER UPDATE ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION notify_case_assigned();

-- 9. Create notify_document_status_changed function
CREATE OR REPLACE FUNCTION public.notify_document_status_changed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_vp_id uuid;
  v_title text;
  v_message text;
  v_link text;
BEGIN
  -- Only trigger on status changes (draft->final or final->archived)
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    v_vp_id := get_vp_user_id();
    
    -- Build link based on entity type
    v_link := CASE NEW.entity_type::text
      WHEN 'case' THEN format('/cases/%s', NEW.entity_id)
      WHEN 'appointment' THEN format('/appointments/%s', NEW.entity_id)
      WHEN 'guest' THEN format('/guests/%s', NEW.entity_id)
      ELSE NULL
    END;
    
    -- Document Finalized (draft -> final)
    IF OLD.status = 'draft' AND NEW.status = 'final' THEN
      v_title := 'Document Finalized';
      v_message := format('Document "%s" has been finalized', NEW.file_name);
      
      -- Notify VP (if not the one who finalized)
      IF v_vp_id IS NOT NULL AND (NEW.status_changed_by IS NULL OR v_vp_id IS DISTINCT FROM NEW.status_changed_by) THEN
        INSERT INTO notifications (user_id, title, message, link, category)
        VALUES (v_vp_id, v_title, v_message, v_link, 'document');
      END IF;
      
      -- Notify uploader (if Secretary and not the one who finalized)
      IF NEW.uploaded_by IS NOT NULL 
         AND NEW.uploaded_by IS DISTINCT FROM v_vp_id
         AND (NEW.status_changed_by IS NULL OR NEW.uploaded_by IS DISTINCT FROM NEW.status_changed_by)
      THEN
        INSERT INTO notifications (user_id, title, message, link, category)
        VALUES (NEW.uploaded_by, v_title, v_message, v_link, 'document');
      END IF;
    
    -- Document Archived (final -> archived)
    ELSIF OLD.status = 'final' AND NEW.status = 'archived' THEN
      v_title := 'Document Archived';
      v_message := format('Document "%s" has been archived', NEW.file_name);
      
      -- Notify VP (if not the one who archived - though only VP can archive)
      IF v_vp_id IS NOT NULL AND (NEW.status_changed_by IS NULL OR v_vp_id IS DISTINCT FROM NEW.status_changed_by) THEN
        INSERT INTO notifications (user_id, title, message, link, category)
        VALUES (v_vp_id, v_title, v_message, v_link, 'document');
      END IF;
      
      -- Notify original uploader (if Secretary)
      IF NEW.uploaded_by IS NOT NULL 
         AND NEW.uploaded_by IS DISTINCT FROM v_vp_id
      THEN
        INSERT INTO notifications (user_id, title, message, link, category)
        VALUES (NEW.uploaded_by, v_title, v_message, v_link, 'document');
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 10. Create trigger for document status changes
CREATE TRIGGER trigger_notify_document_status_changed
  AFTER UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION notify_document_status_changed();

-- 11. Update notify_case_status_change to include category
CREATE OR REPLACE FUNCTION public.notify_case_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
      INSERT INTO notifications (user_id, title, message, link, category)
      VALUES (
        v_vp_id,
        'Case Status Updated',
        format('Case %s status changed to %s', v_case_number, NEW.status),
        format('/cases/%s', NEW.id),
        'case'
      );
    END IF;
    
    -- Notify assigned Secretary (if different from VP)
    IF NEW.assigned_to IS NOT NULL AND NEW.assigned_to IS DISTINCT FROM v_vp_id THEN
      INSERT INTO notifications (user_id, title, message, link, category)
      VALUES (
        NEW.assigned_to,
        'Case Status Updated',
        format('Case %s status changed to %s', v_case_number, NEW.status),
        format('/cases/%s', NEW.id),
        'case'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 12. Update notify_appointment_status_change to include category
CREATE OR REPLACE FUNCTION public.notify_appointment_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
      INSERT INTO notifications (user_id, title, message, link, category)
      VALUES (v_vp_id, v_title, v_message, format('/appointments/%s', NEW.id), 'appointment');
    END IF;
    
    -- Notify submitting Secretary (if different from VP)
    IF NEW.submitted_by IS NOT NULL AND NEW.submitted_by IS DISTINCT FROM v_vp_id THEN
      INSERT INTO notifications (user_id, title, message, link, category)
      VALUES (NEW.submitted_by, v_title, v_message, format('/appointments/%s', NEW.id), 'appointment');
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 13. Update notify_document_uploaded to include category
CREATE OR REPLACE FUNCTION public.notify_document_uploaded()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    INSERT INTO notifications (user_id, title, message, link, category)
    VALUES (
      v_vp_id,
      'Document Added',
      format('New document "%s" uploaded to %s', NEW.file_name, v_entity_label),
      v_link,
      'document'
    );
  END IF;
  
  -- Notify uploader if Secretary (confirmation)
  IF NEW.uploaded_by IS NOT NULL 
     AND NEW.uploaded_by IS DISTINCT FROM v_vp_id 
     AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = NEW.uploaded_by AND role = 'secretary')
  THEN
    INSERT INTO notifications (user_id, title, message, link, category)
    VALUES (
      NEW.uploaded_by,
      'Document Uploaded',
      format('Your document "%s" has been uploaded successfully', NEW.file_name),
      v_link,
      'document'
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 14. Backfill existing notifications with category based on title patterns
UPDATE public.notifications
SET category = 
  CASE 
    WHEN title ILIKE '%case%' THEN 'case'::notification_category
    WHEN title ILIKE '%appointment%' THEN 'appointment'::notification_category
    WHEN title ILIKE '%document%' THEN 'document'::notification_category
    ELSE 'system'::notification_category
  END
WHERE category IS NULL;