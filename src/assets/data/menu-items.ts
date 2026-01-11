import { MenuItemType } from '@/types/menu'

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: 'menu',
    label: 'MENU...',
    isTitle: true,
  },
  {
    key: 'dashboards',
    label: 'Dashboard',
    icon: 'mingcute:home-3-line',
    url: '/dashboards',
  },
  {
    key: 'clients',
    label: 'Clients',
    icon: 'bx:user',
    url: '/clients',
  },
  {
    key: 'appointments',
    label: 'Appointments',
    icon: 'bx:calendar',
    url: '/appointments',
  },
  {
    key: 'cases',
    label: 'Cases',
    icon: 'bx:briefcase',
    url: '/cases',
  },
  {
    key: 'audit-logs',
    label: 'Audit Logs',
    icon: 'bx:history',
    url: '/audit-logs',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: 'bx:bell',
    url: '/notifications',
  },
  {
    key: 'users',
    label: 'User Management',
    icon: 'bx:user-circle',
    url: '/users',
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: 'bx:cog',
    url: '/settings',
  },
]
