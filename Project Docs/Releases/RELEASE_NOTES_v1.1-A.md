# VP-Flow v1.1-A Release Notes

**Release Date:** 2026-01-22  
**Version:** 1.1-A  
**Status:** COMPLETE & FROZEN

---

## Overview

VP-Flow v1.1-A introduces two major capabilities:

1. **Case Re-opening** — VP can now re-open closed cases when additional action is required
2. **Documents Module** — Full document management with upload, view, download, and deactivation

---

## New Features

### Case Re-opening (VP Only)

Closed cases are no longer permanently sealed. The VP can:

- **Re-open** a closed case with a required justification
- **Edit** the case while in "Reopened" status
- **Re-close** the case with a new resolution summary

**Access:** VP role only  
**Audit:** All re-open actions are logged

### Documents Module

A new document management system is now available:

| Feature | Description |
|---------|-------------|
| **Document Library** | Standalone page at `/documents` showing all documents |
| **Upload** | Attach files to Cases, Appointments, or Guests |
| **View** | Open documents in a new browser tab |
| **Download** | Save documents to your device |
| **Deactivate** | VP can soft-delete documents (file remains in storage) |
| **Filter** | Filter documents by entity type |

**Supported Entities:**
- Cases
- Appointments
- Guests (Clients)

**Access:**
- VP: Full access (upload, view, download, deactivate)
- Secretary: View, upload, download
- Protocol: No access

---

## Integration Points

Documents are now visible in:

| Location | Feature |
|----------|---------|
| Case Detail | Documents section below linked appointment |
| Appointment Detail | Documents section (VP/Secretary only) |
| Guest Detail | New "Documents" tab |
| Sidebar | New "Documents" menu item |

---

## Role-Based Access Summary

| Capability | VP | Secretary | Protocol |
|------------|:--:|:---------:|:--------:|
| View Documents | ✅ | ✅ | ❌ |
| Upload Documents | ✅ | ✅ | ❌ |
| Download Documents | ✅ | ✅ | ❌ |
| Deactivate Documents | ✅ | ❌ | ❌ |
| Re-open Cases | ✅ | ❌ | ❌ |
| Edit Reopened Cases | ✅ | ❌ | ❌ |
| Re-close Cases | ✅ | ❌ | ❌ |

---

## Audit Trail

All document and case re-open actions are logged:

| Action | Event Type |
|--------|------------|
| Case re-opened | `case_reopened` |
| Reopened case edited | `case_reopen_edit` |
| Reopened case closed | `case_reclosed` |
| Document viewed | `document_viewed` |
| Document downloaded | `document_downloaded` |
| Document deactivated | `document_deactivated` |

---

## Security Notes

- **Protocol Isolation**: Protocol role has zero access to documents (enforced via RLS and UI)
- **Closed Cases**: Documents cannot be uploaded to closed cases (unless reopened)
- **Storage**: All documents stored in private Supabase bucket with RLS protection
- **Audit**: All actions logged for accountability

---

## Known Limitations

| Limitation | Status |
|------------|--------|
| No document editing | Planned for future release |
| No document versioning | Planned for future release |
| Single file upload per action | Multi-file upload deferred |
| No document preview | Opens in new tab only |

---

## Upgrade Notes

- No database schema changes required for end users
- Existing closed cases can now be re-opened by VP
- Documents storage bucket automatically provisioned

---

## Support

For issues or questions, contact the Devmart team.

---

**Client:** Office of the Vice President of Suriname  
**Maintainer:** Devmart
