-- Assign VP role to info@devmart.sr (Primary Admin Account)
-- User ID: df790081-3b6e-4cab-86c3-b5ecde8e37c5
INSERT INTO public.user_roles (user_id, role, created_by)
VALUES (
  'df790081-3b6e-4cab-86c3-b5ecde8e37c5'::uuid,
  'vp'::app_role,
  'df790081-3b6e-4cab-86c3-b5ecde8e37c5'::uuid
);