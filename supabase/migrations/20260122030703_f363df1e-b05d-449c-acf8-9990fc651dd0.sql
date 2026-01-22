-- ==========================================
-- VP-Flow v1.1-B Phase B6.2: RLS Policies
-- Tables: notes, note_links
-- Access: VP-only (ownership enforced)
-- ==========================================

-- NOTES TABLE POLICIES

-- SELECT: VP can view own non-deleted notes
CREATE POLICY "VP can view own notes"
ON public.notes FOR SELECT
TO authenticated
USING (
  is_vp(auth.uid()) 
  AND owner_user_id = auth.uid() 
  AND deleted_at IS NULL
);

-- INSERT: VP can create notes (must set owner_user_id = self)
CREATE POLICY "VP can insert notes"
ON public.notes FOR INSERT
TO authenticated
WITH CHECK (
  is_vp(auth.uid()) 
  AND owner_user_id = auth.uid()
);

-- UPDATE: VP can update own non-deleted notes
CREATE POLICY "VP can update own notes"
ON public.notes FOR UPDATE
TO authenticated
USING (
  is_vp(auth.uid()) 
  AND owner_user_id = auth.uid() 
  AND deleted_at IS NULL
);

-- DELETE: VP can delete own notes (soft delete via UPDATE preferred)
CREATE POLICY "VP can soft delete own notes"
ON public.notes FOR DELETE
TO authenticated
USING (
  is_vp(auth.uid()) 
  AND owner_user_id = auth.uid()
);

-- NOTE_LINKS TABLE POLICIES

-- SELECT: VP can view links to own notes
CREATE POLICY "VP can view own note links"
ON public.note_links FOR SELECT
TO authenticated
USING (
  is_vp(auth.uid()) 
  AND EXISTS (
    SELECT 1 FROM public.notes n 
    WHERE n.id = note_links.note_id 
    AND n.owner_user_id = auth.uid()
    AND n.deleted_at IS NULL
  )
);

-- INSERT: VP can link own notes to entities
CREATE POLICY "VP can insert note links"
ON public.note_links FOR INSERT
TO authenticated
WITH CHECK (
  is_vp(auth.uid()) 
  AND EXISTS (
    SELECT 1 FROM public.notes n 
    WHERE n.id = note_links.note_id 
    AND n.owner_user_id = auth.uid()
  )
);

-- DELETE: VP can unlink own notes
CREATE POLICY "VP can delete note links"
ON public.note_links FOR DELETE
TO authenticated
USING (
  is_vp(auth.uid()) 
  AND EXISTS (
    SELECT 1 FROM public.notes n 
    WHERE n.id = note_links.note_id 
    AND n.owner_user_id = auth.uid()
  )
);