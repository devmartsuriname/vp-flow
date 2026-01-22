-- Phase B Step 2: documents UPDATE policy (VP-only)

CREATE POLICY "VP can update documents"
ON public.documents FOR UPDATE
USING (is_vp(auth.uid()));