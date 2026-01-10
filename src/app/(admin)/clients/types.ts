import type { Database } from '@/integrations/supabase/types'

// Client type from database
export type Client = Database['public']['Tables']['clients']['Row']
export type ClientInsert = Database['public']['Tables']['clients']['Insert']
export type ClientUpdate = Database['public']['Tables']['clients']['Update']

// Client type enum
export type ClientType = Database['public']['Enums']['client_type']

// Client form data for create/edit operations
export type ClientFormData = {
  client_type: ClientType
  first_name: string
  last_name: string
  organization_name: string
  contact_person: string
  email: string
  phone: string
  address_line1: string
  address_line2: string
  city: string
  district: string
  notes: string
}

// Suriname districts for dropdown
export const SURINAME_DISTRICTS = [
  'Brokopondo',
  'Commewijne',
  'Coronie',
  'Marowijne',
  'Nickerie',
  'Para',
  'Paramaribo',
  'Saramacca',
  'Sipaliwini',
  'Wanica',
] as const

// Helper to get display name for a client
export function getClientDisplayName(client: Client): string {
  if (client.client_type === 'organization') {
    return client.organization_name || 'Unnamed Organization'
  }
  const firstName = client.first_name || ''
  const lastName = client.last_name || ''
  return `${firstName} ${lastName}`.trim() || 'Unnamed Person'
}
