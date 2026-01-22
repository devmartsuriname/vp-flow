-- v1.1-A Phase A Step 1: Extend case_status enum
ALTER TYPE public.case_status ADD VALUE 'reopened';

-- v1.1-A Phase A Step 2: Extend audit_action enum
ALTER TYPE public.audit_action ADD VALUE 'case_reopened';
ALTER TYPE public.audit_action ADD VALUE 'case_reopen_edit';
ALTER TYPE public.audit_action ADD VALUE 'case_reclosed';
ALTER TYPE public.audit_action ADD VALUE 'document_linked';
ALTER TYPE public.audit_action ADD VALUE 'document_viewed';
ALTER TYPE public.audit_action ADD VALUE 'document_downloaded';
ALTER TYPE public.audit_action ADD VALUE 'document_deactivated';

-- v1.1-A Phase A Step 3: Extend document_entity_type enum
ALTER TYPE public.document_entity_type ADD VALUE 'guest';
ALTER TYPE public.document_entity_type ADD VALUE 'appointment';
ALTER TYPE public.document_entity_type ADD VALUE 'none';