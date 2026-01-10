-- ===========================================
-- VP-FLOW: Phase H — RLS Policies (Part 1: User Domain)
-- user_roles and user_profiles
-- ===========================================

-- =========================================
-- USER_ROLES POLICIES
-- =========================================

-- VP can view all user roles
CREATE POLICY "VP can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.is_vp(auth.uid()));

-- VP can assign roles
CREATE POLICY "VP can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.is_vp(auth.uid()));

-- VP can update roles
CREATE POLICY "VP can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.is_vp(auth.uid()));

-- VP can delete roles
CREATE POLICY "VP can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.is_vp(auth.uid()));

-- Users can view their own role
CREATE POLICY "Users can view own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- =========================================
-- USER_PROFILES POLICIES
-- =========================================

-- All authenticated users can view profiles
CREATE POLICY "Authenticated users can view profiles"
ON public.user_profiles FOR SELECT
TO authenticated
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE
TO authenticated
USING (id = auth.uid());

-- VP can update any profile
CREATE POLICY "VP can update any profile"
ON public.user_profiles FOR UPDATE
TO authenticated
USING (public.is_vp(auth.uid()));

-- VP can insert profiles
CREATE POLICY "VP can insert profiles"
ON public.user_profiles FOR INSERT
TO authenticated
WITH CHECK (public.is_vp(auth.uid()) OR id = auth.uid());