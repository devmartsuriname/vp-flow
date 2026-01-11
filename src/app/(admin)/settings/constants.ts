/**
 * Settings Module Constants
 * Module 9 - Settings & System Configuration
 */

import type { NotificationPreference, SystemInfo } from './types'

export const APP_INFO: Omit<SystemInfo, 'currentDate' | 'lastLogin'> = {
  appName: 'VP-Flow',
  version: '1.0.0',
  environment: 'Production',
}

/**
 * Notification preferences scaffold
 * All are disabled in v1.0 (UI scaffold only)
 */
export const DEFAULT_NOTIFICATION_PREFS: NotificationPreference[] = [
  {
    id: 'email_notifications',
    label: 'Email Notifications',
    description: 'Receive notifications via email',
    enabled: true,
    disabled: true, // Disabled in v1.0
  },
  {
    id: 'in_app_notifications',
    label: 'In-App Notifications',
    description: 'Receive notifications within the application',
    enabled: true,
    disabled: true, // Disabled in v1.0
  },
  {
    id: 'appointment_reminders',
    label: 'Appointment Reminders',
    description: 'Get reminders for upcoming appointments',
    enabled: true,
    disabled: true, // Disabled in v1.0
  },
  {
    id: 'case_updates',
    label: 'Case Updates',
    description: 'Receive updates when cases change status',
    enabled: true,
    disabled: true, // Disabled in v1.0
  },
]

export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  vp: 'Vice President',
  secretary: 'Secretary',
  protocol: 'Protocol',
}
