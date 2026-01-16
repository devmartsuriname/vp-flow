# Restore Point: v1.0 Types & Context Cleanup

**Created:** 2026-01-16  
**Purpose:** Pre-cleanup snapshot for v1.0 Final Hygiene  
**Authority:** Devmart / Office of the Vice President

---

## Files Preserved

### 1. src/context/useEmailContext.tsx (TO BE DELETED)

```tsx
import { createContext, useContext, useState } from 'react'

import type { ChildrenType } from '@/types/component-props'
import type { EmailContextType, EmailOffcanvasStatesType, OffcanvasControlType } from '@/types/context'
import type { EmailLabelType, EmailType } from '@/types/data'

const EmailContext = createContext<EmailContextType | undefined>(undefined)

export const useEmailContext = () => {
  const context = useContext(EmailContext)
  if (!context) {
    throw new Error('useEmailContext can only be used within EmailProvider')
  }
  return context
}

export const EmailProvider = ({ children }: ChildrenType) => {
  const [activeLabel, setActiveLabel] = useState<EmailLabelType>('Primary')
  const [activeMail, setActiveMail] = useState<EmailType['id']>('2001')
  const [offcanvasStates, setOffcanvasStates] = useState<EmailOffcanvasStatesType>({
    showNavigationMenu: false,
    showEmailDetails: false,
    showComposeEmail: false,
  })

  const changeActiveLabel: EmailContextType['changeActiveLabel'] = (newLabel) => {
    setActiveLabel(newLabel)
  }

  const changeActiveMail: EmailContextType['changeActiveMail'] = (newMail) => {
    setActiveMail(newMail)
    toggleEmailDetails()
  }

  const toggleNavigationMenu: OffcanvasControlType['toggle'] = () => {
    setOffcanvasStates({ ...offcanvasStates, showNavigationMenu: !offcanvasStates.showNavigationMenu })
  }

  const toggleEmailDetails: OffcanvasControlType['toggle'] = () => {
    setOffcanvasStates({ ...offcanvasStates, showEmailDetails: !offcanvasStates.showEmailDetails })
  }

  const toggleComposeEmail: OffcanvasControlType['toggle'] = () => {
    setOffcanvasStates({ ...offcanvasStates, showComposeEmail: !offcanvasStates.showComposeEmail })
  }

  const navigationBar: EmailContextType['navigationBar'] = {
    open: offcanvasStates.showNavigationMenu,
    toggle: toggleNavigationMenu,
  }

  const emailDetails: EmailContextType['emailDetails'] = {
    open: offcanvasStates.showEmailDetails,
    toggle: toggleEmailDetails,
  }

  const composeEmail: EmailContextType['composeEmail'] = {
    open: offcanvasStates.showComposeEmail,
    toggle: toggleComposeEmail,
  }

  return (
    <EmailContext.Provider
      value={{
        activeLabel,
        changeActiveLabel,
        activeMail,
        changeActiveMail,
        navigationBar,
        emailDetails,
        composeEmail,
      }}>
      {children}
    </EmailContext.Provider>
  )
}
```

---

### 2. src/types/context.ts (TYPES TO BE REMOVED)

**Original content (lines 1, 49-63 to be removed):**

```typescript
import { EmailLabelType, EmailType } from './data'

export type ThemeType = 'light' | 'dark'

export type OffcanvasControlType = {
  open: boolean
  toggle: () => void
}

export type MenuType = {
  theme: ThemeType
  size: 'default' | 'condensed' | 'hidden' | 'sm-hover'
}

export type LayoutState = {
  theme: ThemeType
  topbarTheme: ThemeType
  menu: MenuType
}

export type LayoutOffcanvasStatesType = {
  showThemeCustomizer: boolean
  showActivityStream: boolean
  showBackdrop: boolean
}

export type LayoutType = LayoutState & {
  themeMode: ThemeType
  changeTheme: (theme: ThemeType) => void
  changeTopbarTheme: (theme: ThemeType) => void
  changeMenu: {
    theme: (theme: MenuType['theme']) => void
    size: (size: MenuType['size']) => void
  }
  themeCustomizer: OffcanvasControlType
  activityStream: OffcanvasControlType
  toggleBackdrop: () => void
  resetSettings: () => void
}

export type ChatOffcanvasStatesType = {
  showChatList: boolean
  showUserProfile: boolean
  showVoiceCall: boolean
  showVideoCall: boolean
  showUserSetting: boolean
}

export type EmailOffcanvasStatesType = {
  showNavigationMenu: boolean
  showEmailDetails: boolean
  showComposeEmail: boolean
}

export type EmailContextType = {
  activeLabel: EmailLabelType
  changeActiveLabel: (label: EmailLabelType) => void
  activeMail: EmailType['id']
  changeActiveMail: (newMail: EmailType['id']) => void
  navigationBar: OffcanvasControlType
  emailDetails: OffcanvasControlType
  composeEmail: OffcanvasControlType
}
```

---

### 3. src/types/data.ts (TYPES TO BE REMOVED)

**Types removed:**

| Type | Lines |
|------|-------|
| `EmailLabelType` | 6 |
| `EmailType` | 8-24 |
| `Employee` | 30-38 |
| `PaginationType` | 40-46 |
| `SearchType` | 47-53 |
| `SortingType` | 55-61 |
| `LoadingType` | 63-69 |
| `HiddenType` | 70-75 |
| `NotificationType` | 77-81 |
| `GroupType` | 169-177 |
| `EmailCountType` | 179-186 |
| `PricingType` | 196-203 |
| `ProjectType` | 205-213 |

---

## Rollback Instructions

To restore any file:
1. Copy the content from this document
2. Create/overwrite the target file
3. Run `npm run build` to verify

---

**Document Version:** 1.0  
**Status:** ACTIVE RESTORE POINT
