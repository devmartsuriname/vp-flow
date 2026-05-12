-- TC-006 Phase 1A.2 — Email Notifications (Part D: email notification trigger)
-- Fires AFTER INSERT on public.notifications and posts to send-email-notification
-- Edge Function via pg_net. Reuses the existing PUSH_TRIGGER_SERVICE_ROLE vault
-- secret (confirmed valid by Delroy, exp 2036) — same service_role JWT works for
-- both push and email Edge Functions.
--
-- Auth pattern mirrors trigger_push_notification:
--   - Authorization: Bearer <service_role JWT>
--   - x-trigger-source: pg_trigger (defense-in-depth header verified by Edge Fn)
--
-- URL pattern: hard-coded Supabase project URL — consistent with existing push
-- trigger (Delroy CHALLENGE FIRST decision A, 2026-05-12). Known MEDIUM issue
-- (CLAUDE.md §14) is project-wide, not new.
--
-- Additive migration — does NOT modify any existing migration or trigger.

CREATE OR REPLACE FUNCTION public.trigger_email_notification()
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
    url := 'https://xjkkumclqqnjngnttabf.supabase.co/functions/v1/send-email-notification',
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

-- Trigger fires after every notification insert. The Edge Function decides
-- whether to actually send (checks email_settings.enabled and per-target rules).
CREATE TRIGGER on_notification_send_email
AFTER INSERT ON public.notifications
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_email_notification();
