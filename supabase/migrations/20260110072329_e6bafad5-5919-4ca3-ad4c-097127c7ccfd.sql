-- ===========================================
-- VP-FLOW: Phase E — Supporting Tables
-- E1.1: reminders, E1.2: notifications, E1.3: protocol_events, E1.4: documents, E1.5: audit_events
-- ===========================================

-- E1.1: Reminders (deadline tracking for cases)
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  
  -- Reminder configuration
  reminder_type reminder_type NOT NULL,
  reminder_date DATE NOT NULL,
  channel reminder_channel NOT NULL DEFAULT 'in_app',
  
  -- Status
  is_sent BOOLEAN NOT NULL DEFAULT false,
  sent_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for reminders
CREATE INDEX idx_reminders_case ON public.reminders(case_id);
CREATE INDEX idx_reminders_date ON public.reminders(reminder_date);
CREATE INDEX idx_reminders_unsent ON public.reminders(is_sent) WHERE is_sent = false;

-- E1.2: Notifications (user notification queue)
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT, -- Optional link to related resource
  
  -- Status
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for notifications
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);

-- E1.3: Protocol events (day-of execution tracking)
CREATE TABLE public.protocol_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  
  -- Status tracking
  status protocol_status NOT NULL DEFAULT 'expected',
  status_changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status_changed_by UUID REFERENCES auth.users(id),
  
  -- Notes (Protocol officer notes)
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for protocol events
CREATE INDEX idx_protocol_events_appointment ON public.protocol_events(appointment_id);
CREATE INDEX idx_protocol_events_status ON public.protocol_events(status);

-- E1.4: Documents (case document metadata)
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Polymorphic association (currently only cases)
  entity_type document_entity_type NOT NULL DEFAULT 'case',
  entity_id UUID NOT NULL,
  
  -- Document info
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  
  -- Metadata
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- Indexes for documents
CREATE INDEX idx_documents_entity ON public.documents(entity_type, entity_id);
CREATE INDEX idx_documents_uploaded ON public.documents(uploaded_at DESC);

-- E1.5: Audit events (immutable audit log)
CREATE TABLE public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- What was changed
  entity_type TEXT NOT NULL, -- 'case', 'appointment', etc.
  entity_id UUID NOT NULL,
  action audit_action NOT NULL,
  
  -- Change details
  old_values JSONB,
  new_values JSONB,
  
  -- Who made the change
  performed_by UUID NOT NULL REFERENCES auth.users(id),
  performed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Additional context
  ip_address INET,
  user_agent TEXT
);

-- Indexes for audit events
CREATE INDEX idx_audit_entity ON public.audit_events(entity_type, entity_id);
CREATE INDEX idx_audit_performed_by ON public.audit_events(performed_by);
CREATE INDEX idx_audit_performed_at ON public.audit_events(performed_at DESC);
CREATE INDEX idx_audit_action ON public.audit_events(action);