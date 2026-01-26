# VP-Flow Priority 3-A — Execution-Ready Specification

**Project:** VP-Flow (Appointments & Case Management System)  
**Client:** Office of the Vice President of Suriname  
**Document Type:** Execution-Ready Specification — DOCUMENTATION ONLY  
**Status:** PLANNING COMPLETE — NOT AUTHORIZED FOR EXECUTION  
**Date:** 2026-01-26  
**Baseline:** v1.0-v1.3 + Priority 1-2 COMPLETE & FROZEN

---

## 1. Executive Summary

This document provides the complete technical specification for Priority 3-A (Handwriting & Pen Input). It defines all implementation requirements in sufficient detail to enable execution upon authorization.

**EXECUTION STATUS: NOT AUTHORIZED**

---

## 2. Locked Technical Decisions

### 2.1 Canvas Library

| Aspect | Decision |
|--------|----------|
| **Library** | `perfect-freehand` |
| **Version** | Latest stable (to be determined at execution) |
| **Rendering** | Native HTML5 `<canvas>` element |
| **Approach** | perfect-freehand generates smooth stroke paths from input points; paths rendered via Canvas 2D API |

### 2.2 Rendering Flow

```
User Pen Input → PointerEvent capture → Point array accumulation
    → perfect-freehand getStroke() → SVG path data
    → Canvas 2D fill/stroke rendering
```

### 2.3 Storage Format

| Aspect | Decision |
|--------|----------|
| **Primary** | Vector stroke data (JSON) |
| **Structure** | Array of strokes, each stroke is array of points with x, y, pressure |
| **Fallback** | Raster PNG (if vector rendering fails) |
| **Location** | Supabase Storage bucket: `note-handwriting` (private) |

---

## 3. Data Model (Tables & Columns)

### 3.1 New Table: `note_handwriting`

```sql
-- Priority 3-A: Handwriting artifacts table
CREATE TABLE public.note_handwriting (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  owner_user_id uuid NOT NULL,
  storage_type text NOT NULL CHECK (storage_type IN ('vector', 'raster')),
  storage_ref text NOT NULL,
  stroke_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz DEFAULT NULL
);

-- Constraints
ALTER TABLE note_handwriting ADD CONSTRAINT note_handwriting_note_unique 
  UNIQUE (note_id) WHERE deleted_at IS NULL;

-- Indexes
CREATE INDEX idx_note_handwriting_note_id ON note_handwriting(note_id);
CREATE INDEX idx_note_handwriting_owner ON note_handwriting(owner_user_id);

-- Updated timestamp trigger
CREATE TRIGGER update_note_handwriting_updated_at
  BEFORE UPDATE ON note_handwriting
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 3.2 Column Definitions

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| note_id | uuid | NO | - | FK to notes table |
| owner_user_id | uuid | NO | - | User who created the handwriting |
| storage_type | text | NO | - | 'vector' or 'raster' |
| storage_ref | text | NO | - | Path in storage bucket |
| stroke_count | integer | YES | 0 | Number of strokes (metadata) |
| created_at | timestamptz | NO | now() | Creation timestamp |
| updated_at | timestamptz | NO | now() | Last update timestamp |
| deleted_at | timestamptz | YES | NULL | Soft delete timestamp |

### 3.3 Storage Bucket

| Bucket | Name | Public | RLS |
|--------|------|--------|-----|
| Handwriting | `note-handwriting` | NO | VP-only via signed URLs |

---

## 4. Storage Strategy

### 4.1 Vector Storage (Primary)

**File Format:** JSON

```json
{
  "version": 1,
  "strokes": [
    {
      "points": [
        { "x": 100, "y": 150, "pressure": 0.5 },
        { "x": 102, "y": 148, "pressure": 0.6 },
        ...
      ],
      "color": "#000000",
      "size": 3
    }
  ],
  "canvasWidth": 800,
  "canvasHeight": 600,
  "createdAt": "2026-01-26T10:00:00Z"
}
```

**Storage Path Pattern:**
```
{user_id}/{note_id}/handwriting.json
```

### 4.2 Raster Fallback

**File Format:** PNG or WebP

**Storage Path Pattern:**
```
{user_id}/{note_id}/handwriting.png
```

**Trigger Conditions:**
- Device does not support vector rendering
- Vector data corrupted
- Explicit user preference (future, not in scope)

---

## 5. RLS Policy Requirements

### 5.1 Table RLS: `note_handwriting`

```sql
-- Enable RLS
ALTER TABLE note_handwriting ENABLE ROW LEVEL SECURITY;

-- SELECT: VP can view own handwriting (non-deleted)
CREATE POLICY "VP can view own handwriting"
  ON note_handwriting FOR SELECT
  USING (
    is_vp(auth.uid()) 
    AND owner_user_id = auth.uid() 
    AND deleted_at IS NULL
  );

-- INSERT: VP can insert handwriting for own notes
CREATE POLICY "VP can insert handwriting"
  ON note_handwriting FOR INSERT
  WITH CHECK (
    is_vp(auth.uid()) 
    AND owner_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM notes 
      WHERE id = note_id 
      AND owner_user_id = auth.uid()
    )
  );

-- UPDATE: VP can update own handwriting
CREATE POLICY "VP can update own handwriting"
  ON note_handwriting FOR UPDATE
  USING (
    is_vp(auth.uid()) 
    AND owner_user_id = auth.uid()
  );

-- DELETE: VP can soft-delete own handwriting
CREATE POLICY "VP can delete own handwriting"
  ON note_handwriting FOR DELETE
  USING (
    is_vp(auth.uid()) 
    AND owner_user_id = auth.uid()
  );
```

### 5.2 Storage Bucket RLS

```sql
-- Storage bucket policies for note-handwriting bucket

-- SELECT: VP can download own files
CREATE POLICY "VP can download own handwriting files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'note-handwriting'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- INSERT: VP can upload to own folder
CREATE POLICY "VP can upload own handwriting files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'note-handwriting'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- UPDATE: VP can update own files
CREATE POLICY "VP can update own handwriting files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'note-handwriting'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- DELETE: VP can delete own files
CREATE POLICY "VP can delete own handwriting files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'note-handwriting'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## 6. Audit Trigger Requirements

### 6.1 New Audit Actions

Add to `audit_action` enum:
- `handwriting_created`
- `handwriting_updated`
- `handwriting_deleted`

### 6.2 Audit Trigger Function

```sql
CREATE OR REPLACE FUNCTION public.log_handwriting_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  audit_action_val audit_action;
  old_values_json JSONB := NULL;
  new_values_json JSONB := NULL;
BEGIN
  -- Build sanitized payload (NO visual content per governance)
  IF TG_OP = 'INSERT' THEN
    audit_action_val := 'handwriting_created';
    new_values_json := jsonb_build_object(
      'id', NEW.id,
      'note_id', NEW.note_id,
      'owner_user_id', NEW.owner_user_id,
      'storage_type', NEW.storage_type,
      'stroke_count', NEW.stroke_count,
      'created_at', NEW.created_at
    );
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      audit_action_val := 'handwriting_deleted';
    ELSE
      audit_action_val := 'handwriting_updated';
    END IF;
    old_values_json := jsonb_build_object(
      'id', OLD.id,
      'note_id', OLD.note_id,
      'storage_type', OLD.storage_type,
      'stroke_count', OLD.stroke_count,
      'deleted_at', OLD.deleted_at
    );
    new_values_json := jsonb_build_object(
      'id', NEW.id,
      'note_id', NEW.note_id,
      'storage_type', NEW.storage_type,
      'stroke_count', NEW.stroke_count,
      'deleted_at', NEW.deleted_at
    );
  END IF;
  
  INSERT INTO public.audit_events (
    entity_type, entity_id, action, performed_by,
    old_values, new_values, ip_address
  ) VALUES (
    'note_handwriting', COALESCE(NEW.id, OLD.id), audit_action_val, auth.uid(),
    old_values_json, new_values_json, '0.0.0.0'::inet
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Trigger
CREATE TRIGGER audit_note_handwriting_changes
  AFTER INSERT OR UPDATE ON note_handwriting
  FOR EACH ROW
  EXECUTE FUNCTION log_handwriting_audit();
```

---

## 7. UI Integration Points

### 7.1 Routes (No Changes Required)

Handwriting integrates into existing Notes routes:
- `/notes` — Notes list (no handwriting preview)
- `/notes/:id` — Note detail (handwriting canvas displayed here)
- `/notes/new` — Create note (optional handwriting mode)

### 7.2 Components to Create

| Component | Path | Purpose |
|-----------|------|---------|
| `HandwritingCanvas` | `src/app/(admin)/notes/components/HandwritingCanvas.tsx` | Main canvas input component |
| `HandwritingToolbar` | `src/app/(admin)/notes/components/HandwritingToolbar.tsx` | Pen size, color, clear controls |
| `HandwritingViewer` | `src/app/(admin)/notes/components/HandwritingViewer.tsx` | Read-only rendering of saved handwriting |

### 7.3 Hooks to Create

| Hook | Path | Purpose |
|------|------|---------|
| `useHandwriting` | `src/app/(admin)/notes/hooks/useHandwriting.ts` | Fetch handwriting artifact for a note |
| `useHandwritingMutations` | `src/app/(admin)/notes/hooks/useHandwritingMutations.ts` | Save/delete handwriting |

### 7.4 Integration with Note Detail

```tsx
// NoteDetail.tsx integration point
<Card.Body>
  {/* Existing text content */}
  <div className="note-content">{note.content}</div>
  
  {/* Handwriting section (VP only) */}
  {isVP && (
    <div className="mt-4">
      <h6>Handwriting</h6>
      {handwriting ? (
        <HandwritingViewer data={handwriting} />
      ) : (
        <Button onClick={() => setShowCanvas(true)}>
          Add Handwriting
        </Button>
      )}
    </div>
  )}
  
  {/* Canvas modal/panel */}
  {showCanvas && (
    <HandwritingCanvas 
      noteId={note.id}
      onSave={handleSaveHandwriting}
      onCancel={() => setShowCanvas(false)}
    />
  )}
</Card.Body>
```

### 7.5 Darkone Admin Compliance

| Pattern | Compliance |
|---------|------------|
| Card structure | Use existing `Card` components |
| Button styles | Use `Button` with Bootstrap variants |
| Modal/Panel | Use existing offcanvas or modal patterns |
| Loading states | Use `Spinner` component |
| Error handling | Use `toast` notifications |

---

## 8. Scope Boundaries

### 8.1 IN SCOPE (Priority 3-A)

- [ ] Install `perfect-freehand` dependency
- [ ] Create `note-handwriting` storage bucket
- [ ] Create `note_handwriting` table with RLS
- [ ] Add audit enum values and trigger
- [ ] Build `HandwritingCanvas` component
- [ ] Build `HandwritingToolbar` component
- [ ] Build `HandwritingViewer` component
- [ ] Create data hooks
- [ ] Integrate with Note detail page
- [ ] Implement lazy loading
- [ ] Test on iPad with Apple Pencil

### 8.2 OUT OF SCOPE (Priority 3-A)

- OCR / handwriting-to-text
- Search within handwriting content
- Export handwriting as image/PDF
- Multi-stroke selection
- Eraser tool (individual stroke level)
- Undo/redo gestures
- Zoom-based editing
- Dashboard handwriting previews
- Secretary/Protocol access

### 8.3 DEFERRED

- Raster fallback automatic detection
- Handwriting thumbnail in note list
- Multi-color/multi-size stroke history
- Palm rejection configuration

---

## 9. Test Plan

### 9.1 Device Testing Matrix

| Device | Input | Priority | Test Cases |
|--------|-------|----------|------------|
| iPad + Apple Pencil | Stylus | HIGH | Pressure sensitivity, palm rejection, stroke smoothing |
| Surface + Surface Pen | Stylus | MEDIUM | Pressure sensitivity, hover detection |
| Android tablet + stylus | Stylus | LOW | Basic stroke capture |
| Desktop + mouse | Mouse | HIGH | Fallback functionality |
| Laptop + trackpad | Touch | MEDIUM | Fallback functionality |

### 9.2 Functional Test Cases

| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| HW-01 | VP draws on canvas | Strokes render smoothly |
| HW-02 | VP saves handwriting | Data persisted to storage |
| HW-03 | VP views saved handwriting | Rendered correctly |
| HW-04 | VP deletes handwriting | Soft-deleted, not visible |
| HW-05 | Secretary views note with handwriting | Handwriting section not visible |
| HW-06 | Protocol views note with handwriting | Note not accessible (existing RLS) |
| HW-07 | Canvas load on slow network | Lazy loading indicator shown |
| HW-08 | Save fails due to network | Error toast, data not lost locally |

### 9.3 Security Test Cases

| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| SEC-01 | Non-VP attempts to access storage bucket | 403 Forbidden |
| SEC-02 | VP accesses another user's handwriting | 404 Not Found |
| SEC-03 | Audit log for handwriting_created | Entry created with metadata only |
| SEC-04 | Audit log for handwriting_deleted | Entry created with metadata only |

---

## 10. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Poor pen performance on iPad | LOW | HIGH | Test early; use requestAnimationFrame for rendering |
| Storage bloat from large canvases | MEDIUM | MEDIUM | Limit canvas size; compress JSON |
| perfect-freehand compatibility issues | LOW | MEDIUM | Fallback to raw stroke rendering |
| Palm rejection conflicts | MEDIUM | LOW | Document as known limitation; defer config |
| Offline save attempts | LOW | HIGH | Block offline writes; show error state |

---

## 11. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Notes Module (v1.1-B) | Prerequisite | ✅ COMPLETE |
| PWA Foundation (v1.1-C) | Prerequisite | ✅ COMPLETE |
| `perfect-freehand` npm package | Runtime | ⏳ NOT INSTALLED |
| `note-handwriting` storage bucket | Infrastructure | ⏳ NOT CREATED |
| iPad test device | Test environment | ⚠️ DECISION REQUIRED |

---

## 12. Execution Estimate

| Phase | Effort | Notes |
|-------|--------|-------|
| Infrastructure (bucket, table, RLS) | 1 session | Single migration |
| Core components (canvas, viewer) | 2-3 sessions | Complex canvas logic |
| Integration (note detail) | 1 session | Straightforward |
| Testing & refinement | 1-2 sessions | Device-dependent |
| **Total** | **5-7 sessions** | Conservative estimate |

---

## 13. Formal Authorization Statement

**This document provides the complete technical specification for Priority 3-A.**

**EXECUTION IS NOT AUTHORIZED.**

To authorize execution:
1. Approve this specification
2. Confirm "Ready for Execution" checklist completion
3. Provide explicit instruction: "Authorize Priority 3-A execution"

---

**Document Version:** 1.0  
**Created:** 2026-01-26  
**Authority:** Devmart / Office of the Vice President
