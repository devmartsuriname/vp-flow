-- TC-006 Phase 1A.2 — Email Notifications (Part A: email_settings table)
-- Single-row config table. Single fixed UUID seeded so UI always has a row to UPDATE.
-- RLS: VP can SELECT + UPDATE. Service role bypasses RLS implicitly (Supabase default)
-- and is what the Edge Function uses to read SMTP credentials.
-- Additive migration — does NOT modify any existing migration.

CREATE TABLE public.email_settings (
  id           UUID PRIMARY KEY,
  smtp_host    TEXT NOT NULL DEFAULT '',
  smtp_port    INTEGER NOT NULL DEFAULT 465,
  smtp_username TEXT NOT NULL DEFAULT '',
  smtp_password TEXT NOT NULL DEFAULT '',
  from_address TEXT NOT NULL DEFAULT '',
  from_name    TEXT NOT NULL DEFAULT '',
  enabled      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at maintenance
CREATE OR REPLACE FUNCTION public.email_settings_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER email_settings_updated_at
BEFORE UPDATE ON public.email_settings
FOR EACH ROW EXECUTE PROCEDURE public.email_settings_set_updated_at();

-- Enable RLS
ALTER TABLE public.email_settings ENABLE ROW LEVEL SECURITY;

-- VP-only SELECT (explicit role check — no USING (true))
CREATE POLICY "VP can view email settings"
  ON public.email_settings
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'vp'::app_role));

-- VP-only UPDATE (explicit role check — no USING (true))
CREATE POLICY "VP can update email settings"
  ON public.email_settings
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'vp'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'vp'::app_role));

-- No INSERT/DELETE policies — single-row pattern, seeded once below.
-- Service role bypasses RLS and is used by send-email-notification Edge Function.

-- Seed single row with fixed UUID. ON CONFLICT DO NOTHING for idempotency.
INSERT INTO public.email_settings (id, smtp_host, smtp_port, smtp_username, smtp_password, from_address, from_name, enabled)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '',
  465,
  '',
  '',
  '',
  '',
  FALSE
)
ON CONFLICT (id) DO NOTHING;
