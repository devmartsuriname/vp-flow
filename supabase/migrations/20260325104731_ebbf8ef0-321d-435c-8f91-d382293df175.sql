-- Update trigger function to use Supabase's built-in config via supabase_functions schema
CREATE OR REPLACE FUNCTION public.trigger_push_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_request_id bigint;
  v_supabase_url text := 'https://xjkkumclqqnjngnttabf.supabase.co';
  v_service_role_key text;
BEGIN
  -- Get service role key from vault
  SELECT decrypted_secret INTO v_service_role_key
  FROM vault.decrypted_secrets
  WHERE name = 'SUPABASE_SERVICE_ROLE_KEY'
  LIMIT 1;
  
  -- Graceful degradation if key not available
  IF v_service_role_key IS NULL THEN
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