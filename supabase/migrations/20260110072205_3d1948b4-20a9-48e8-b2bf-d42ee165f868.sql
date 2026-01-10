-- ===========================================
-- VP-FLOW: Phase C — User Domain Tables
-- Migration C1.1: user_roles table (MUST EXIST BEFORE SECURITY FUNCTIONS)
-- ===========================================

-- C1.1: User roles table (stores role assignments separately from profiles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Ensure one role per user (users can only have one role in VP-Flow)
  CONSTRAINT user_roles_user_unique UNIQUE (user_id)
);

-- Add index for role lookups
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- C1.2: User profiles table (extended profile information)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add index for active users lookup
CREATE INDEX idx_user_profiles_active ON public.user_profiles(is_active) WHERE is_active = true;