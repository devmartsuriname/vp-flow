-- ===========================================
-- VP-FLOW: Phase D — Business Domain Tables
-- D1.1: clients, D1.2: appointments, D1.3: appointment_attendees, D1.4: cases
-- ===========================================

-- D1.1: Clients table (persons or organizations requesting appointments)
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_type client_type NOT NULL DEFAULT 'person',
  
  -- For persons
  first_name TEXT,
  last_name TEXT,
  
  -- For organizations
  organization_name TEXT,
  contact_person TEXT,
  
  -- Contact information
  email TEXT,
  phone TEXT,
  
  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  district TEXT,
  
  -- Notes (VP/Secretary only - NOT visible to Protocol)
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Validation: person requires first/last name, org requires org name
  CONSTRAINT client_name_check CHECK (
    (client_type = 'person' AND first_name IS NOT NULL AND last_name IS NOT NULL)
    OR (client_type = 'organization' AND organization_name IS NOT NULL)
  )
);

-- Indexes for clients
CREATE INDEX idx_clients_type ON public.clients(client_type);
CREATE INDEX idx_clients_created_at ON public.clients(created_at DESC);

-- D1.2: Appointments table (core appointment records)
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  
  -- Scheduling
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  location TEXT,
  
  -- Status workflow
  status appointment_status NOT NULL DEFAULT 'draft',
  visibility appointment_visibility NOT NULL DEFAULT 'vp_secretary',
  
  -- Content
  subject TEXT NOT NULL,
  description TEXT,
  vp_notes TEXT, -- VP-only notes
  
  -- Workflow tracking
  submitted_at TIMESTAMPTZ,
  submitted_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  rejected_at TIMESTAMPTZ,
  rejected_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indexes for appointments
CREATE INDEX idx_appointments_client ON public.appointments(client_id);
CREATE INDEX idx_appointments_date ON public.appointments(scheduled_date);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointments_created_at ON public.appointments(created_at DESC);

-- D1.3: Appointment attendees (additional people attending)
CREATE TABLE public.appointment_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  
  -- Attendee info
  name TEXT NOT NULL,
  role TEXT, -- e.g., "Legal Advisor", "Translator"
  email TEXT,
  phone TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Index for attendees
CREATE INDEX idx_attendees_appointment ON public.appointment_attendees(appointment_id);

-- D1.4: Cases table (VP-created case records from appointments)
CREATE TABLE public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  
  -- Case identification
  case_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  -- Status and priority
  status case_status NOT NULL DEFAULT 'draft',
  priority case_priority NOT NULL DEFAULT 'medium',
  
  -- Assignment and deadline
  assigned_to UUID REFERENCES auth.users(id),
  deadline DATE,
  
  -- VP notes and resolution
  vp_notes TEXT,
  resolution_summary TEXT,
  
  -- Status timestamps
  opened_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  closed_by UUID REFERENCES auth.users(id),
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Indexes for cases
CREATE INDEX idx_cases_appointment ON public.cases(appointment_id);
CREATE INDEX idx_cases_status ON public.cases(status);
CREATE INDEX idx_cases_priority ON public.cases(priority);
CREATE INDEX idx_cases_assigned ON public.cases(assigned_to);
CREATE INDEX idx_cases_deadline ON public.cases(deadline);
CREATE INDEX idx_cases_created_at ON public.cases(created_at DESC);