-- v1.1-A Phase A Step 6: Update prevent_closed_case_update trigger
-- Allow VP-authorized transition from closed to reopened
CREATE OR REPLACE FUNCTION public.prevent_closed_case_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Allow transition from closed to reopened (VP authorization enforced by RLS)
  IF OLD.status = 'closed' AND NEW.status = 'reopened' THEN
    RETURN NEW;
  END IF;
  
  -- Block all other modifications to closed cases
  IF OLD.status = 'closed' THEN
    RAISE EXCEPTION 'Cannot modify a closed case. Case ID: %', OLD.id;
  END IF;
  
  RETURN NEW;
END;
$function$;