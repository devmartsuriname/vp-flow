-- Phase B Step 1: document_links RLS Policies

-- SELECT: VP/Secretary can view all document links
CREATE POLICY "VP/Secretary can view document links"
ON public.document_links FOR SELECT
USING (is_vp_or_secretary(auth.uid()));

-- INSERT: VP/Secretary can create document links
CREATE POLICY "VP/Secretary can insert document links"
ON public.document_links FOR INSERT
WITH CHECK (is_vp_or_secretary(auth.uid()));

-- UPDATE: VP only
CREATE POLICY "VP can update document links"
ON public.document_links FOR UPDATE
USING (is_vp(auth.uid()));

-- DELETE: VP only
CREATE POLICY "VP can delete document links"
ON public.document_links FOR DELETE
USING (is_vp(auth.uid()));