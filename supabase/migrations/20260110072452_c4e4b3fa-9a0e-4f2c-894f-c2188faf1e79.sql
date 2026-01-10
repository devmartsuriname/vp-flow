-- Fix audit_events insert policy to be more restrictive
DROP POLICY "System can insert audit events" ON public.audit_events;
CREATE POLICY "VP/Secretary can insert audit events" ON public.audit_events FOR INSERT TO authenticated WITH CHECK (public.is_vp_or_secretary(auth.uid()));