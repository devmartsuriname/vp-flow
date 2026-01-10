-- ===========================================
-- VP-FLOW: Phase H — RLS Policies (Part 2: All Remaining Tables)
-- ===========================================

-- CLIENTS: VP/Secretary only (NO Protocol access)
CREATE POLICY "VP/Secretary can view clients" ON public.clients FOR SELECT TO authenticated USING (public.is_vp_or_secretary(auth.uid()));
CREATE POLICY "VP/Secretary can insert clients" ON public.clients FOR INSERT TO authenticated WITH CHECK (public.is_vp_or_secretary(auth.uid()));
CREATE POLICY "VP/Secretary can update clients" ON public.clients FOR UPDATE TO authenticated USING (public.is_vp_or_secretary(auth.uid()));
CREATE POLICY "VP can delete clients" ON public.clients FOR DELETE TO authenticated USING (public.is_vp(auth.uid()));

-- APPOINTMENTS: Role-based access
CREATE POLICY "VP/Secretary can view all appointments" ON public.appointments FOR SELECT TO authenticated USING (public.is_vp_or_secretary(auth.uid()));
CREATE POLICY "Protocol can view approved appointments" ON public.appointments FOR SELECT TO authenticated USING (public.is_protocol(auth.uid()) AND status = 'approved');
CREATE POLICY "VP/Secretary can insert appointments" ON public.appointments FOR INSERT TO authenticated WITH CHECK (public.is_vp_or_secretary(auth.uid()));
CREATE POLICY "VP/Secretary can update appointments" ON public.appointments FOR UPDATE TO authenticated USING (public.is_vp_or_secretary(auth.uid()));
CREATE POLICY "VP can delete appointments" ON public.appointments FOR DELETE TO authenticated USING (public.is_vp(auth.uid()));

-- APPOINTMENT_ATTENDEES
CREATE POLICY "VP/Secretary can view attendees" ON public.appointment_attendees FOR SELECT TO authenticated USING (public.is_vp_or_secretary(auth.uid()));
CREATE POLICY "Protocol can view attendees for approved" ON public.appointment_attendees FOR SELECT TO authenticated USING (public.is_protocol(auth.uid()) AND EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND a.status = 'approved'));
CREATE POLICY "VP/Secretary can manage attendees" ON public.appointment_attendees FOR ALL TO authenticated USING (public.is_vp_or_secretary(auth.uid()));

-- CASES: VP/Secretary only (NO Protocol access, NO delete)
CREATE POLICY "VP/Secretary can view cases" ON public.cases FOR SELECT TO authenticated USING (public.is_vp_or_secretary(auth.uid()));
CREATE POLICY "VP can insert cases" ON public.cases FOR INSERT TO authenticated WITH CHECK (public.is_vp(auth.uid()));
CREATE POLICY "VP/Secretary can update cases" ON public.cases FOR UPDATE TO authenticated USING (public.is_vp_or_secretary(auth.uid()));

-- REMINDERS: VP/Secretary only
CREATE POLICY "VP/Secretary can view reminders" ON public.reminders FOR SELECT TO authenticated USING (public.is_vp_or_secretary(auth.uid()));

-- NOTIFICATIONS: Users see own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- PROTOCOL_EVENTS: Protocol can manage their events
CREATE POLICY "Protocol can view events" ON public.protocol_events FOR SELECT TO authenticated USING (public.is_protocol(auth.uid()) OR public.is_vp_or_secretary(auth.uid()));
CREATE POLICY "Protocol can insert events" ON public.protocol_events FOR INSERT TO authenticated WITH CHECK (public.is_protocol(auth.uid()));
CREATE POLICY "Protocol can update events" ON public.protocol_events FOR UPDATE TO authenticated USING (public.is_protocol(auth.uid()));

-- DOCUMENTS: VP/Secretary only
CREATE POLICY "VP/Secretary can view documents" ON public.documents FOR SELECT TO authenticated USING (public.is_vp_or_secretary(auth.uid()));
CREATE POLICY "VP/Secretary can insert documents" ON public.documents FOR INSERT TO authenticated WITH CHECK (public.is_vp_or_secretary(auth.uid()));
CREATE POLICY "VP can delete documents" ON public.documents FOR DELETE TO authenticated USING (public.is_vp(auth.uid()));

-- AUDIT_EVENTS: VP only, append-only (no update/delete)
CREATE POLICY "VP can view audit events" ON public.audit_events FOR SELECT TO authenticated USING (public.is_vp(auth.uid()));
CREATE POLICY "System can insert audit events" ON public.audit_events FOR INSERT TO authenticated WITH CHECK (true);