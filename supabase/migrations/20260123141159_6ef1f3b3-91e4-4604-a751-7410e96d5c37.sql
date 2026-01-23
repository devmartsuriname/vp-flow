-- VP-Flow: Assign Secretary role to Secretariaat VP account
-- Authorization: Approved role promotion (no schema changes)
INSERT INTO public.user_roles (user_id, role, created_by)
VALUES (
  '43c5a786-2161-49a3-a5f8-67157f6ae5d7',  -- Secretariaat VP user
  'secretary',                              -- Role assignment
  'df790081-3b6e-4cab-86c3-b5ecde8e37c5'   -- Created by Admin/VP
);