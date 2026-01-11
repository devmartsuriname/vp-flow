-- ============================================================
-- SECURITY FIX: Option 2 Enforcement for appointment_attendees
-- Protocol access restricted to non-sensitive columns only
-- Date: 2026-01-11
-- Authorization: Limited Security Remediation (Post-Phase 4)
-- ============================================================

-- Step 1: Create a restricted VIEW for Protocol role
-- This VIEW excludes email and phone columns for privacy

CREATE OR REPLACE VIEW public.appointment_attendees_protocol AS
SELECT 
  aa.id,
  aa.appointment_id,
  aa.name,
  aa.role,
  aa.created_at,
  aa.created_by
FROM public.appointment_attendees aa
JOIN public.appointments a ON a.id = aa.appointment_id
WHERE a.status = 'approved'::appointment_status;

-- Step 2: Enable RLS on the VIEW (required for security)
ALTER VIEW public.appointment_attendees_protocol SET (security_invoker = true);

-- Step 3: Grant SELECT on the VIEW to authenticated users
-- (RLS policies on underlying table still apply)
GRANT SELECT ON public.appointment_attendees_protocol TO authenticated;

-- Step 4: Drop the existing Protocol SELECT policy on appointment_attendees
-- Protocol should now use the VIEW instead of the table directly
DROP POLICY IF EXISTS "Protocol can view attendees for approved " ON public.appointment_attendees;

-- Step 5: Comment for documentation
COMMENT ON VIEW public.appointment_attendees_protocol IS 
'Restricted view for Protocol role. Excludes email/phone per VP Office decision (Option 2, 2026-01-11). Protocol must query this VIEW, not the base table.';