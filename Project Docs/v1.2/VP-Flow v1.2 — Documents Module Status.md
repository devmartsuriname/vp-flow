# VP-Flow v1.2 — Documents Module Status

## Document Metadata
| Field | Value |
|-------|-------|
| **Project** | VP-Flow |
| **Document Type** | Module Status Report |
| **Module** | Documents |
| **Version** | v1.2 |
| **Status** | COMPLETE (v1.1-A) — Documentation Only |
| **Created** | 2026-01-25 |

---

## 1. Implementation Status

| Component | Status | Version Implemented |
|-----------|--------|---------------------|
| `documents` table | COMPLETE | v1.1-A |
| `document_links` table | COMPLETE | v1.1-A |
| Storage bucket (`documents`) | COMPLETE | v1.1-A |
| Upload flow | COMPLETE | v1.1-A |
| View/Download flow | COMPLETE | v1.1-A |
| Deactivate flow | COMPLETE | v1.1-A |
| Entity linking (guest/appointment/case) | COMPLETE | v1.1-A |
| RLS (VP/Secretary only) | COMPLETE | v1.1-A |
| Protocol access block | COMPLETE | v1.1-A |

---

## 2. Upload Flow (Documentation)

### 2.1 Process Flow

```
1. User navigates to entity detail page (Guest/Appointment/Case)
2. User clicks "Upload Document" button
3. File picker opens (accepts PDF, images, Office docs, text)
4. User selects file (max 50MB enforced)
5. MIME type validated client-side
6. File uploaded to Supabase Storage bucket `documents`
7. Storage path: `{entity_type}/{entity_id}/{timestamp}_{filename}`
8. Document record created in `documents` table
9. Audit event `create` logged with entity context
10. Success toast displayed
11. Document list refreshes
```

### 2.2 File Type Restrictions

| Category | Allowed MIME Types |
|----------|-------------------|
| PDF | `application/pdf` |
| Images | `image/jpeg`, `image/png`, `image/gif`, `image/webp` |
| Office | `application/msword`, `application/vnd.openxmlformats-officedocument.*` |
| Text | `text/plain`, `text/csv` |

### 2.3 Size Limits

| Limit | Value |
|-------|-------|
| Maximum file size | 50 MB |
| Enforced at | Client-side validation + Storage policy |

---

## 3. Linking to Case / Appointment / Guest

### 3.1 Entity Type Mapping

| Entity Type | Linking Mechanism | Storage Path Pattern |
|-------------|-------------------|---------------------|
| Case | `entity_type = 'case'`, `entity_id = case.id` | `case/{case_id}/{file}` |
| Appointment | `entity_type = 'appointment'`, `entity_id = appointment.id` | `appointment/{appointment_id}/{file}` |
| Guest | `entity_type = 'guest'`, `entity_id = client.id` | `guest/{client_id}/{file}` |

### 3.2 Polymorphic Design

The Documents module uses a polymorphic pattern where:
- `entity_type` enum determines the parent entity type
- `entity_id` UUID references the specific parent record
- No foreign key constraint (flexible linking)
- Validation occurs at application layer

---

## 4. Role-Based Access (RLS)

### 4.1 Access Matrix

| Role | Upload | View | Download | Deactivate | Delete |
|------|--------|------|----------|------------|--------|
| VP | ✓ | ✓ | ✓ | ✓ | ✓ |
| Secretary | ✓ | ✓ | ✓ | ✗ | ✗ |
| Protocol | ✗ | ✗ | ✗ | ✗ | ✗ |

### 4.2 RLS Policies (Existing)

| Policy Name | Command | Expression |
|-------------|---------|------------|
| VP/Secretary can view documents | SELECT | `is_vp_or_secretary(auth.uid())` |
| VP/Secretary can insert documents | INSERT | `is_vp_or_secretary(auth.uid())` |
| VP can update documents | UPDATE | `is_vp(auth.uid())` |
| VP can delete documents | DELETE | `is_vp(auth.uid())` |

### 4.3 Storage Bucket Policies

| Policy | Access | Expression |
|--------|--------|------------|
| VP/Secretary can upload | INSERT | `is_vp_or_secretary(auth.uid())` |
| VP/Secretary can read | SELECT | `is_vp_or_secretary(auth.uid())` |
| VP can delete | DELETE | `is_vp(auth.uid())` |

---

## 5. Audit Events (Existing)

| Audit Action | Trigger | Implementation |
|--------------|---------|----------------|
| `create` | Document uploaded | Application layer (useUploadDocument hook) |
| `document_viewed` | Signed URL generated | Application layer (useViewDocument hook) |
| `document_downloaded` | Download initiated | Application layer (useDownloadDocument hook) |
| `document_deactivated` | Document marked inactive | Database trigger on UPDATE |

### 5.1 Audit Event Payload

```typescript
{
  action: 'create' | 'document_viewed' | 'document_downloaded' | 'document_deactivated',
  entity_type: 'document',
  entity_id: document.id,
  performed_by: auth.uid(),
  new_values: {
    file_name: string,
    entity_type: 'case' | 'appointment' | 'guest',
    entity_id: uuid
  }
}
```

---

## 6. UI Components (Existing)

| Component | Location | Purpose |
|-----------|----------|---------|
| DocumentsSection | `src/app/(admin)/documents/` | Main documents list page |
| DocumentUploadModal | `src/app/(admin)/documents/components/` | Upload dialog |
| DocumentCard | `src/app/(admin)/documents/components/` | Individual document display |
| useDocuments | `src/app/(admin)/documents/hooks/` | Fetch documents query |
| useUploadDocument | `src/app/(admin)/documents/hooks/` | Upload mutation |
| useViewDocument | `src/app/(admin)/documents/hooks/` | View/download logic |
| useDeactivateDocument | `src/app/(admin)/documents/hooks/` | Deactivation mutation |

---

## 7. Explicit Exclusions (v1.2)

| Feature | Status | Earliest Version |
|---------|--------|------------------|
| Versioning | NOT IMPLEMENTED | v1.3+ |
| Templates | NOT IMPLEMENTED | v1.3+ |
| OCR/Text extraction | NOT IMPLEMENTED | v1.3+ |
| External sharing | NOT IMPLEMENTED | v1.3+ |
| Public links | NOT IMPLEMENTED | v1.3+ |
| Bulk import/export | NOT IMPLEMENTED | v1.3+ |
| Virus scanning | NOT IMPLEMENTED | v1.3+ |

---

## 8. v1.2 Changes

**NO CHANGES TO DOCUMENTS MODULE IN v1.2**

The Documents module is feature-complete as delivered in v1.1-A.
v1.2 documents the existing implementation for reference only.

The only Documents-related change in v1.2 is:
- Notification trigger on document upload (see Notifications spec)

---

## Cross-References

- `VP-Flow v1.2 — Scope Confirmation.md`
- `VP-Flow v1.2 — Notifications Technical Spec.md` — Document upload notifications
- `Project Docs/v1.1-A/` — Original implementation documentation
- `Project Docs/v1.3/VP-Flow v1.3 — Skipped & Deferred Features (Authoritative Record).md` — Extended features
