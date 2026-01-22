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
