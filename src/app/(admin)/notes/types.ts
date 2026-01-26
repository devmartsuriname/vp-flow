import type { Database } from '@/integrations/supabase/types'

// Note type from database
export type Note = Database['public']['Tables']['notes']['Row']
export type NoteInsert = Database['public']['Tables']['notes']['Insert']
export type NoteUpdate = Database['public']['Tables']['notes']['Update']

// Note link type from database
export type NoteLink = Database['public']['Tables']['note_links']['Row']
export type NoteLinkInsert = Database['public']['Tables']['note_links']['Insert']

// Entity type enum
export type NoteEntityType = Database['public']['Enums']['note_entity_type']

// Note with optional link for display (single link per note)
export type NoteWithLink = Note & {
  note_links: NoteLink | NoteLink[] | null
}

// Form data for create/edit operations
export interface NoteFormData {
  title: string
  content: string
  entityType: NoteEntityType | null
  entityId: string | null
}

// Linked entity display info
export interface LinkedEntityInfo {
  type: NoteEntityType
  id: string
  displayName: string
}

// Entity type labels for UI
export const ENTITY_TYPE_LABELS: Record<NoteEntityType, string> = {
  guest: 'Guest',
  appointment: 'Appointment',
  case: 'Case',
}

// Get display title for a note (fallback for untitled)
export function getNoteDisplayTitle(note: Note): string {
  return note.title?.trim() || 'Untitled Note'
}

// ============================================
// Handwriting Types (Priority 3-A)
// ============================================

// Single stroke point from perfect-freehand
export interface StrokePoint {
  x: number
  y: number
  pressure?: number
}

// A complete stroke (collection of points)
export interface StrokeData {
  points: StrokePoint[]
  size: number // pen size used
  color: string // pen color used
  timestamp: number // when stroke was drawn
}

// Complete handwriting canvas data (stored as JSON)
export interface HandwritingCanvasData {
  version: 1 // schema version for future compatibility
  canvasWidth: number
  canvasHeight: number
  strokes: StrokeData[]
  createdAt: string // ISO timestamp
  updatedAt: string // ISO timestamp
}

// Note handwriting record from database
export interface NoteHandwriting {
  id: string
  note_id: string
  owner_user_id: string
  storage_type: 'vector' | 'raster'
  storage_ref: string
  stroke_count: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// Insert type for creating handwriting records
export interface NoteHandwritingInsert {
  note_id: string
  owner_user_id: string
  storage_type?: 'vector' | 'raster'
  storage_ref: string
  stroke_count?: number
}

// Update type for updating handwriting records
export interface NoteHandwritingUpdate {
  storage_ref?: string
  stroke_count?: number
  deleted_at?: string | null
}

// Pen size presets
export const PEN_SIZES = {
  thin: 2,
  medium: 4,
  thick: 8,
} as const

export type PenSize = keyof typeof PEN_SIZES
