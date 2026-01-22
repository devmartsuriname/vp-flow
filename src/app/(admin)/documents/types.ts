import type { Database } from '@/integrations/supabase/types'

// Document type from database
export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']
export type DocumentUpdate = Database['public']['Tables']['documents']['Update']

// Document Link type from database
export type DocumentLink = Database['public']['Tables']['document_links']['Row']
export type DocumentLinkInsert = Database['public']['Tables']['document_links']['Insert']

// Enums
export type DocumentEntityType = Database['public']['Enums']['document_entity_type']

// Document with entity information for display
export interface DocumentWithEntity extends Document {
  entity_name?: string
}

// Upload form data
export interface DocumentUploadData {
  file: File
  title?: string
  description?: string
  entity_type: DocumentEntityType
  entity_id: string
}

// Allowed MIME types (matching storage bucket config)
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
] as const

// Max file size (50MB)
export const MAX_FILE_SIZE = 52428800

// Check if file type is allowed
export function isAllowedFileType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType as typeof ALLOWED_MIME_TYPES[number])
}

// Check if file size is valid
export function isValidFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE
}

// Format file size for display
export function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// Get file extension from mime type
export function getFileExtension(mimeType: string | null): string {
  if (!mimeType) return ''
  const map: Record<string, string> = {
    'application/pdf': 'PDF',
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'text/plain': 'TXT',
  }
  return map[mimeType] || 'FILE'
}

// Get icon for file type
export function getFileIcon(mimeType: string | null): string {
  if (!mimeType) return 'bx:file'
  if (mimeType.startsWith('image/')) return 'bx:image'
  if (mimeType === 'application/pdf') return 'bx:file-pdf'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'bx:file-doc'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'bx:file-excel'
  if (mimeType === 'text/plain') return 'bx:file-txt'
  return 'bx:file'
}
