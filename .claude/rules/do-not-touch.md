# VP-Flow — Do Not Touch List

This list is authoritative. Items here require an explicit approved Task Contract to modify.

## Permanently Killed (never reintroduce)

- Background sync
- Offline write access
- Public / external portals
- Multi-tenant architecture
- Third-party calendar sync (Google Calendar, etc.)
- OCR / text extraction
- AI / ML decisioning
- Chat / messaging features
- Signature verification (requires external PKI)
- Handwriting export
- Citizen-facing portals
- Reporting / analytics dashboards

## Frozen v1.x Behavior (do not modify without TC)

- Audit log triggers and tables (audit_logs, all audit trigger functions)
- Archive immutability trigger for incoming_post
- Closed case immutability and reopen validation (validate_case_reopen)
- RLS policies for: guests, appointments, cases, documents, notes, incoming_post, audit_logs, notifications, user_roles
- Role model: app_role enum (values: vp, secretary, protocol)
- user_roles table and role assignment logic
- Auth flow and session management

## Frozen Files (read-only unless TC specifies otherwise)

- All migration files in /supabase/migrations/ (additive new files only)
- /Project Docs/ (documentation updates via Cowork, not Claude Code)
- /Project Restore Points/ (only add new ones, never modify existing)

## Environment Variables (never commit to repo)

- SUPABASE_SERVICE_ROLE_KEY
- VAPID_PRIVATE_KEY
- Any email provider API keys
- Any webhook secrets
