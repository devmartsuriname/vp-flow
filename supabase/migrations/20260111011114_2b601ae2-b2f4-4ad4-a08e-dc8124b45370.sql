-- ============================================================
-- CLEANUP: Remove VIEW approach, keep function-based access
-- The VIEW is causing scanner false positives
-- Protocol should use get_protocol_attendees() function instead
-- Date: 2026-01-11
-- ============================================================

-- Drop the VIEW (function remains as the access path)
DROP VIEW IF EXISTS public.appointment_attendees_protocol;