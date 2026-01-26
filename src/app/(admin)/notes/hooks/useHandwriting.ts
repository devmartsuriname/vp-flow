import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { NoteHandwriting, HandwritingCanvasData } from '../types'

// Query key factory for handwriting
export const handwritingKeys = {
  all: ['handwriting'] as const,
  byNote: (noteId: string) => [...handwritingKeys.all, 'note', noteId] as const,
}

// Fetch handwriting record for a note
async function fetchHandwriting(noteId: string): Promise<{
  record: NoteHandwriting | null
  data: HandwritingCanvasData | null
}> {
  // 1. Get handwriting record from database
  const { data: rawRecord, error } = await supabase
    .from('note_handwriting')
    .select('*')
    .eq('note_id', noteId)
    .is('deleted_at', null)
    .maybeSingle()

  if (error) throw error
  if (!rawRecord) return { record: null, data: null }

  // Cast to proper type with storage_type validation
  const record: NoteHandwriting = {
    ...rawRecord,
    storage_type: rawRecord.storage_type as 'vector' | 'raster',
  }

  // 2. Download JSON data from storage
  const { data: blob, error: downloadError } = await supabase.storage
    .from('note-handwriting')
    .download(record.storage_ref)

  if (downloadError) {
    console.error('Failed to download handwriting data:', downloadError)
    return { record, data: null }
  }

  // 3. Parse JSON
  const text = await blob.text()
  const canvasData = JSON.parse(text) as HandwritingCanvasData

  return { record, data: canvasData }
}

// Hook to fetch handwriting for a specific note
export function useHandwriting(noteId: string | undefined) {
  return useQuery({
    queryKey: handwritingKeys.byNote(noteId ?? ''),
    queryFn: () => fetchHandwriting(noteId!),
    enabled: !!noteId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}
