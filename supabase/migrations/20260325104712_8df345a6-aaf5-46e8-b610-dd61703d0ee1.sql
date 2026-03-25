-- Enable pg_net extension for HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Trigger function to send push notifications on new notification inserts
CREATE OR REPLACE FUNCTION public.trigger_push_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_supabase_url text;
  v_service_role_key text;
  v_request_id bigint;
BEGIN
  -- Get config from vault/env
  v_supabase_url := current_setting('app.settings.supabase_url', true);
  v_service_role_key := current_setting('app.settings.service_role_key', true);
  
  -- Only proceed if we have config (graceful degradation)
  IF v_supabase_url IS NULL OR v_service_role_key IS NULL THEN
    RETURN NEW;
  END IF;

  -- Call send-push-notification Edge Function
  SELECT net.http_post(
    url := v_supabase_url || '/functions/v1/send-push-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_service_role_key
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

-- Trigger on notifications table INSERT
CREATE TRIGGER on_notification_send_push
  AFTER INSERT ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_push_notification();