/**
 * Settings Module Constants
 * Module 9 - Settings & System Configuration
 */

import type { SystemInfo } from './types'

export const APP_INFO: Omit<SystemInfo, 'currentDate' | 'lastLogin'> = {
  appName: 'VP-Flow',
  version: '1.2.0',
  environment: 'Production',
}

export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  vp: 'Vice President',
  secretary: 'Secretary',
  protocol: 'Protocol',
}
