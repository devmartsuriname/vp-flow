import type { AppRole } from './types'

/**
 * Badge color variants for each role (Bootstrap/Darkone variants)
 */
export const ROLE_BADGE_VARIANTS: Record<AppRole, string> = {
  vp: 'danger',
  secretary: 'primary',
  protocol: 'info',
}

/**
 * Human-readable labels for roles
 */
export const ROLE_LABELS: Record<AppRole, string> = {
  vp: 'Vice President',
  secretary: 'Secretary',
  protocol: 'Protocol',
}

/**
 * Status filter options
 */
export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Users' },
  { value: 'active', label: 'Active Only' },
  { value: 'inactive', label: 'Inactive Only' },
] as const
