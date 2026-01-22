-- Phase B Step 3: VP-only case re-open enforcement trigger

CREATE OR REPLACE FUNCTION public.validate_case_reopen()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- VP-only: closed -> reopened
  IF OLD.status = 'closed' AND NEW.status = 'reopened' THEN
    IF NOT is_vp(auth.uid()) THEN
      RAISE EXCEPTION 'Only VP can re-open a closed case';
    END IF;
  END IF;
  
  -- VP-only: reopened -> closed (reclosure)
  IF OLD.status = 'reopened' AND NEW.status = 'closed' THEN
    IF NOT is_vp(auth.uid()) THEN
      RAISE EXCEPTION 'Only VP can close a reopened case';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE TRIGGER validate_case_reopen_trigger
BEFORE UPDATE ON public.cases
FOR EACH ROW
EXECUTE FUNCTION public.validate_case_reopen();