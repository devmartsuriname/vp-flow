-- TC-005 Path A3 — Replace hardcoded legacy anon JWT in push trigger with
-- vault-stored service_role JWT. Auth Gateway "Verify JWT" stays ENABLED on
-- send-push-notification (re-enable was Task 1 reversal for A3). The Edge
-- Function validates the JWT via auth.getClaims() and requires
-- callerRole === 'service_role' AND x-trigger-source === 'pg_trigger'
-- (defense in depth).
--
-- Prerequisite (manual, Lane C — verified by Delroy before apply):
--   1. Secret seeded once via:
--        INSERT INTO vault.secrets (name, secret)
--        VALUES ('PUSH_TRIGGER_SERVICE_ROLE', '<current service_role JWT>');
--      Rotated on key rotation; never committed to repo.
--   2. The function owner (postgres) has SELECT on vault.decrypted_secrets.
--      This is the Supabase default for SECURITY DEFINER functions owned by
--      postgres. db-guard must confirm before apply.
--
-- Additive migration — does NOT modify 20260325104819.
CREATE OR REPLACE FUNCTION public.trigger_push_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_request_id bigint;
  v_service_role_jwt text;
BEGIN
  SELECT decrypted_secret
    INTO v_service_role_jwt
    FROM vault.decrypted_secrets
    WHERE name = 'PUSH_TRIGGER_SERVICE_ROLE'
    LIMIT 1;

  IF v_service_role_jwt IS NULL THEN
    RAISE EXCEPTION 'PUSH_TRIGGER_SERVICE_ROLE secret not configured in vault';
  END IF;

  SELECT net.http_post(
    url := 'https://xjkkumclqqnjngnttabf.supabase.co/functions/v1/send-push-notification',
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
