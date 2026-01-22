-- v1.1-A Phase A Step 4: Extend documents table
ALTER TABLE public.documents 
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS owner_role text,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Backfill existing records
UPDATE public.documents SET is_active = true WHERE is_active IS NULL;
UPDATE public.documents SET title = file_name WHERE title IS NULL;

-- Add NOT NULL constraint after backfill
ALTER TABLE public.documents ALTER COLUMN is_active SET NOT NULL;