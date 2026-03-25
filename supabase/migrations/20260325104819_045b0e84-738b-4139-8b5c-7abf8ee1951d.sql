-- Update trigger to use anon key (publishable, already public in codebase)
CREATE OR REPLACE FUNCTION public.trigger_push_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_request_id bigint;
BEGIN
  -- Call send-push-notification Edge Function using anon key
  -- The Edge Function will use service role key from its own env for DB access
  SELECT net.http_post(
    url := 'https://xjkkumclqqnjngnttabf.supabase.co/functions/v1/send-push-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhqa2t1bWNscXFuam5nbnR0YWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMjgzNTgsImV4cCI6MjA4MzYwNDM1OH0.ScqfBEHeOUwyrOYbjRxt2vf4GAbAo24jWjFRFgsvQDA',
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