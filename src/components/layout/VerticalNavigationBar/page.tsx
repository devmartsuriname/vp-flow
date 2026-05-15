import { useMemo } from 'react'
import { getMenuItems } from '@/helpers/Manu'
import SimplebarReactClient from '@/components/wrapper/SimplebarReactClient'
import LogoBox from '@/components/wrapper/LogoBox'
import AppMenu from './components/AppMenu'
import { useAuthContext } from '@/context/useAuthContext'
import { isVP, isProtocol } from '@/hooks/useUserRole'
import type { MenuItemType } from '@/types/menu'

/** Menu item keys that require VP role */
const VP_ONLY_MENU_KEYS = ['notes', 'audit-logs']

/** Menu item keys visible to Protocol role (title + allowed pages + Settings per TC-018) */
const PROTOCOL_VISIBLE_MENU_KEYS = ['menu', 'dashboards', 'appointments', 'settings']

const VerticalNavigationBar = () => {
  const { role } = useAuthContext()
  const allMenuItems = getMenuItems()

  // Filter menu items based on user role
  const menuItems = useMemo<MenuItemType[]>(() => {
    if (isVP(role)) {
      // VP sees all menu items
      return allMenuItems
    }
    if (isProtocol(role)) {
      // Protocol: restricted to Dashboard + Appointments + Settings (TC-019)
      return allMenuItems.filter(item => PROTOCOL_VISIBLE_MENU_KEYS.includes(item.key))
    }
    // Other non-VP users (Secretary): filter out VP-only menu items
    return allMenuItems.filter(item => !VP_ONLY_MENU_KEYS.includes(item.key))
  }, [allMenuItems, role])

  return (
    <div className="app-sidebar">
      <LogoBox />
      <SimplebarReactClient className="scrollbar" data-simplebar>
        <AppMenu menuItems={menuItems} />
      </SimplebarReactClient>
    </div>
  )
}

export default VerticalNavigationBar
