-- TC-011 Phase 1B — Notification Preferences (per-user channel toggles)
-- One row per user. push_enabled + email_enabled. Opt-out model:
-- NULL / no row = send (Edge Functions only skip when row exists AND flag = false).
-- Owner-only RLS — each user manages their own preferences.
-- Service role (used by Edge Functions) bypasses RLS implicitly.
-- Additive migration — does NOT modify any existing migration or table.

CREATE TABLE public.notification_preferences (
  user_id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  push_enabled   BOOLEAN NOT NULL DEFAULT TRUE,
  email_enabled  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at maintenance
CREATE OR REPLACE FUNCTION public.notification_preferences_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW EXECUTE PROCEDURE public.notification_preferences_set_updated_at();

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Owner-only SELECT
CREATE POLICY "Users can view own notification preferences"
  ON public.notification_preferences
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Owner-only INSERT (user can only create their own row)
CREATE POLICY "Users can insert own notification preferences"
  ON public.notification_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Owner-only UPDATE
CREATE POLICY "Users can update own notification preferences"
  ON public.notification_preferences
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- No DELETE policy — toggle model, rows are upserted not removed.
-- No seed rows — opt-out model: absence of row = both channels enabled.
