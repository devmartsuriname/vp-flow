-- TC-010 — Replace hard-coded Supabase project URL in notification triggers
-- with a vault read of SUPABASE_PROJECT_URL. Removes the only project-wide
-- hard-coded URL surface; aligns push and email triggers with the existing
-- vault-secret pattern already proven by TC-005 (PUSH_TRIGGER_SERVICE_ROLE).
--
-- Prerequisite (manual, Lane C — verified by Delroy before apply):
--   1. Vault secret seeded once via SQL Editor:
--        INSERT INTO vault.secrets (name, secret)
--        VALUES ('SUPABASE_PROJECT_URL', 'https://xjkkumclqqnjngnttabf.supabase.co');
--      Value must have NO trailing slash and NO '/functions/...' suffix.
--   2. Function owner (postgres) retains SELECT on vault.decrypted_secrets
--      (Supabase default; already confirmed by TC-005 smoke test).
--
-- Behavioral guarantee: if SUPABASE_PROJECT_URL is missing, the trigger
-- raises an exception — no silent notification failure.
--
-- Additive migration — does NOT modify any existing migration file.
-- Trigger bindings on public.notifications are NOT recreated.

CREATE OR REPLACE FUNCTION public.trigger_push_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_request_id       bigint;
  v_service_role_jwt text;
  v_project_url      text;
BEGIN
  SELECT decrypted_secret
    INTO v_service_role_jwt
    FROM vault.decrypted_secrets
    WHERE name = 'PUSH_TRIGGER_SERVICE_ROLE'
    LIMIT 1;

  IF v_service_role_jwt IS NULL THEN
    RAISE EXCEPTION 'PUSH_TRIGGER_SERVICE_ROLE secret not configured in vault';
  END IF;

  SELECT decrypted_secret
    INTO v_project_url
    FROM vault.decrypted_secrets
    WHERE name = 'SUPABASE_PROJECT_URL'
    LIMIT 1;

  IF v_project_url IS NULL THEN
    RAISE EXCEPTION 'SUPABASE_PROJECT_URL secret not configured in vault';
  END IF;

  SELECT net.http_post(
    url := v_project_url || '/functions/v1/send-push-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_service_role_jwt,
      'x-trigger-source', 'pg_trigger'
    ),
    body := jsonb_build_object(
      'userId', NEW.user_id,
      'title', NEW.title,
      'message', NEW.message,
      'link', NEW.link
    )
  ) INTO v_request_id;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_email_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_request_id       bigint;
  v_service_role_jwt text;
  v_project_url      text;
BEGIN
  SELECT decrypted_secret
    INTO v_service_role_jwt
    FROM vault.decrypted_secrets
    WHERE name = 'PUSH_TRIGGER_SERVICE_ROLE'
    LIMIT 1;

  IF v_service_role_jwt IS NULL THEN
    RAISE EXCEPTION 'PUSH_TRIGGER_SERVICE_ROLE secret not configured in vault';
  END IF;

  SELECT decrypted_secret
    INTO v_project_url
    FROM vault.decrypted_secrets
    WHERE name = 'SUPABASE_PROJECT_URL'
    LIMIT 1;

  IF v_project_url IS NULL THEN
    RAISE EXCEPTION 'SUPABASE_PROJECT_URL secret not configured in vault';
  END IF;

  SELECT net.http_post(
    url := v_project_url || '/functions/v1/send-email-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_service_role_jwt,
      'x-trigger-source', 'pg_trigger'
    ),
    body := jsonb_build_object(
      'userId', NEW.user_id,
      'title', NEW.title,
      'message', NEW.message,
      'link', NEW.link
    )
  ) INTO v_request_id;

  RETURN NEW;
END;
$$;
