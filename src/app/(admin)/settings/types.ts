/**
 * Settings Module Types
 * Module 9 - Settings & System Configuration
 */

export interface UserProfileData {
  id: string
  full_name: string | null
  email: string
  role: 'vp' | 'secretary' | 'protocol' | null
  is_active: boolean
  created_at: string
}

export interface SystemInfo {
  appName: string
  version: string
  environment: string
  currentDate: string
  lastLogin: string | null
}

export interface NotificationPreference {
  id: string
  label: string
  description: string
  enabled: boolean
  disabled: boolean // UI scaffold - all disabled in v1.0
}
