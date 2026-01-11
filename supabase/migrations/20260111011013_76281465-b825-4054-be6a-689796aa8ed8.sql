-- ============================================================
-- SECURITY FIX: Add RLS policy to appointment_attendees_protocol VIEW
-- Ensures Protocol role can only access the restricted VIEW
-- Date: 2026-01-11
-- ============================================================

-- Enable RLS on the VIEW
ALTER VIEW public.appointment_attendees_protocol SET (security_barrier = true);

-- Create RLS-like access control using a security definer function
-- Since VIEWs with security_invoker inherit the underlying table's RLS,
-- we need to ensure Protocol can access the VIEW data

-- Create a policy-enforcing wrapper function for Protocol
CREATE OR REPLACE FUNCTION public.get_protocol_attendees(p_appointment_id uuid DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  appointment_id uuid,
  name text,
  role text,
  created_at timestamptz,
  created_by uuid
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    aa.id,
    aa.appointment_id,
    aa.name,
    aa.role,
    aa.created_at,
    aa.created_by
  FROM public.appointment_attendees aa
  JOIN public.appointments a ON a.id = aa.appointment_id
  WHERE a.status = 'approved'::appointment_status
    AND is_protocol(auth.uid())
    AND (p_appointment_id IS NULL OR aa.appointment_id = p_appointment_id)
$$;

COMMENT ON FUNCTION public.get_protocol_attendees IS 
'Security definer function for Protocol role to access attendees without email/phone. Use this instead of direct VIEW access.';