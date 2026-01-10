-- ===========================================
-- VP-FLOW: Phase B — Security Functions (RETRY)
-- Now that user_roles exists, create the functions
-- ===========================================

-- B1.1: Core role check function (SECURITY DEFINER to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- B1.2: VP convenience function
CREATE OR REPLACE FUNCTION public.is_vp(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'vp'::app_role)
$$;

-- B1.3: Secretary convenience function
CREATE OR REPLACE FUNCTION public.is_secretary(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'secretary'::app_role)
$$;

-- B1.4: Protocol convenience function
CREATE OR REPLACE FUNCTION public.is_protocol(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'protocol'::app_role)
$$;

-- B1.5: VP or Secretary check (common access pattern)
CREATE OR REPLACE FUNCTION public.is_vp_or_secretary(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'vp'::app_role) 
      OR public.has_role(_user_id, 'secretary'::app_role)
$$;