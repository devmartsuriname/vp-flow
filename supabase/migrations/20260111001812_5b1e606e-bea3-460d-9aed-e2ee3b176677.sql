-- SECURITY FIX: Align user_profiles RLS with Phase 1 RLS Matrix
-- Issue: "Authenticated users can view profiles" policy uses USING (true) allowing enumeration
-- Fix: Role-based access per Phase 1 specification

-- Step 1: Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.user_profiles;

-- Step 2: Create VP/Secretary policy (can view all profiles)
CREATE POLICY "VP/Secretary can view all profiles"
ON public.user_profiles
FOR SELECT
USING (public.is_vp_or_secretary(auth.uid()));

-- Step 3: Create self-view policy (all users can view own profile)
-- Note: id column is the auth.uid() reference per existing policies
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
USING (id = auth.uid());