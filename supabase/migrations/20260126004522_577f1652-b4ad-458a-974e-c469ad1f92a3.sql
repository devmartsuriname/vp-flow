-- ============================================
-- Priority 1: Deadline Notification Function
-- SECURITY DEFINER - No secrets, no HTTP calls
-- ============================================

CREATE OR REPLACE FUNCTION public.check_and_notify_deadlines()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_vp_id uuid;
  v_case record;
  v_appt record;
  v_notification_exists boolean;
BEGIN
  -- Get VP user ID
  v_vp_id := get_vp_user_id();
  
  -- Exit if no VP configured
  IF v_vp_id IS NULL THEN
    RETURN;
  END IF;
  
  -- ========================================
  -- CASE DEADLINE WARNINGS (48 hours)
  -- Status filter: Exclude only 'closed'
  -- 'reopened' cases still receive warnings
  -- ========================================
  FOR v_case IN
    SELECT id, case_number, title, deadline, assigned_to
    FROM cases
    WHERE status <> 'closed'
      AND deadline IS NOT NULL
      AND deadline BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '2 days')
  LOOP
    -- Check for duplicate (same case, same title in last 24h)
    SELECT EXISTS (
      SELECT 1 FROM notifications
      WHERE link = format('/cases/%s', v_case.id)
        AND title = 'Case Deadline Approaching'
        AND created_at > (now() - INTERVAL '24 hours')
    ) INTO v_notification_exists;
    
    IF NOT v_notification_exists THEN
      -- Notify VP
      INSERT INTO notifications (user_id, title, message, link, category)
      VALUES (
        v_vp_id,
        'Case Deadline Approaching',
        format('Case %s deadline is %s', v_case.case_number, v_case.deadline),
        format('/cases/%s', v_case.id),
        'case'
      );
      
      -- Notify assigned Secretary (if applicable and different from VP)
      IF v_case.assigned_to IS NOT NULL AND v_case.assigned_to IS DISTINCT FROM v_vp_id THEN
        INSERT INTO notifications (user_id, title, message, link, category)
        VALUES (
          v_case.assigned_to,
          'Case Deadline Approaching',
          format('Case %s deadline is %s', v_case.case_number, v_case.deadline),
          format('/cases/%s', v_case.id),
          'case'
        );
      END IF;
    END IF;
  END LOOP;
  
  -- ========================================
  -- OVERDUE CASES
  -- Deadline < today, status not 'closed'
  -- ========================================
  FOR v_case IN
    SELECT id, case_number, title, deadline, assigned_to
    FROM cases
    WHERE status <> 'closed'
      AND deadline IS NOT NULL
      AND deadline < CURRENT_DATE
  LOOP
    -- Check for duplicate (same case, same title in last 24h)
    SELECT EXISTS (
      SELECT 1 FROM notifications
      WHERE link = format('/cases/%s', v_case.id)
        AND title = 'OVERDUE: Case Past Deadline'
        AND created_at > (now() - INTERVAL '24 hours')
    ) INTO v_notification_exists;
    
    IF NOT v_notification_exists THEN
      -- Notify VP
      INSERT INTO notifications (user_id, title, message, link, category)
      VALUES (
        v_vp_id,
        'OVERDUE: Case Past Deadline',
        format('Case %s was due on %s', v_case.case_number, v_case.deadline),
        format('/cases/%s', v_case.id),
        'case'
      );
      
      -- Notify assigned Secretary
      IF v_case.assigned_to IS NOT NULL AND v_case.assigned_to IS DISTINCT FROM v_vp_id THEN
        INSERT INTO notifications (user_id, title, message, link, category)
        VALUES (
          v_case.assigned_to,
          'OVERDUE: Case Past Deadline',
          format('Case %s was due on %s', v_case.case_number, v_case.deadline),
          format('/cases/%s', v_case.id),
          'case'
        );
      END IF;
    END IF;
  END LOOP;
  
  -- ========================================
  -- UPCOMING APPOINTMENTS (24 hours)
  -- Approved appointments scheduled for tomorrow
  -- ========================================
  FOR v_appt IN
    SELECT a.id, a.subject, a.scheduled_date, a.scheduled_time, a.submitted_by,
           COALESCE(c.organization_name, CONCAT(c.first_name, ' ', c.last_name)) AS client_name
    FROM appointments a
    LEFT JOIN clients c ON c.id = a.client_id
    WHERE a.status = 'approved'
      AND a.scheduled_date = CURRENT_DATE + INTERVAL '1 day'
  LOOP
    -- Check for duplicate (same appointment, same title in last 24h)
    SELECT EXISTS (
      SELECT 1 FROM notifications
      WHERE link = format('/appointments/%s', v_appt.id)
        AND title = 'Upcoming Appointment Tomorrow'
        AND created_at > (now() - INTERVAL '24 hours')
    ) INTO v_notification_exists;
    
    IF NOT v_notification_exists THEN
      -- Notify VP
      INSERT INTO notifications (user_id, title, message, link, category)
      VALUES (
        v_vp_id,
        'Upcoming Appointment Tomorrow',
        format('Appointment with %s at %s', COALESCE(v_appt.client_name, 'Guest'), v_appt.scheduled_time),
        format('/appointments/%s', v_appt.id),
        'appointment'
      );
      
      -- Notify submitting Secretary (if different from VP)
      IF v_appt.submitted_by IS NOT NULL AND v_appt.submitted_by IS DISTINCT FROM v_vp_id THEN
        INSERT INTO notifications (user_id, title, message, link, category)
        VALUES (
          v_appt.submitted_by,
          'Upcoming Appointment Tomorrow',
          format('Appointment with %s at %s', COALESCE(v_appt.client_name, 'Guest'), v_appt.scheduled_time),
          format('/appointments/%s', v_appt.id),
          'appointment'
        );
      END IF;
    END IF;
  END LOOP;
  
END;
$$;

-- Grant execute permission to authenticated users (function enforces VP logic internally)
GRANT EXECUTE ON FUNCTION public.check_and_notify_deadlines() TO authenticated;