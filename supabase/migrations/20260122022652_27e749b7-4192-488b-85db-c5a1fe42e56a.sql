-- =================================================================
-- VP-Flow v1.1-A Phase D2: Documents Storage Infrastructure
-- Creates private storage bucket with VP/Secretary RLS access
-- Protocol is blocked from document storage
-- =================================================================

-- Create the documents storage bucket (PRIVATE - not publicly accessible)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,  -- Private bucket
  52428800,  -- 50MB file size limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain']
);

-- =================================================================
-- Storage RLS Policies
-- =================================================================

-- Policy: VP/Secretary can view/download documents
CREATE POLICY "VP/Secretary can view documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' 
  AND public.is_vp_or_secretary(auth.uid())
);

-- Policy: VP/Secretary can upload documents
CREATE POLICY "VP/Secretary can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents'
  AND public.is_vp_or_secretary(auth.uid())
);

-- Policy: VP can update documents (e.g., metadata changes)
CREATE POLICY "VP can update documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents'
  AND public.is_vp(auth.uid())
);

-- Policy: VP can delete documents
CREATE POLICY "VP can delete documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents'
  AND public.is_vp(auth.uid())
);

-- =================================================================
-- Note: Protocol role is explicitly NOT granted any access
-- This enforces the data isolation requirement from Phase 1
-- =================================================================