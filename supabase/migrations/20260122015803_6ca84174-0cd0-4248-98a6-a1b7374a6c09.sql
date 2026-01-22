-- v1.1-A Phase A Step 5: Create document_links table
CREATE TABLE public.document_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  entity_type public.document_entity_type NOT NULL,
  entity_id uuid,
  linked_by uuid,
  linked_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS (policies will be added in Phase B)
ALTER TABLE public.document_links ENABLE ROW LEVEL SECURITY;

-- Create indexes for efficient lookups
CREATE INDEX idx_document_links_entity ON public.document_links(entity_type, entity_id);
CREATE INDEX idx_document_links_document ON public.document_links(document_id);