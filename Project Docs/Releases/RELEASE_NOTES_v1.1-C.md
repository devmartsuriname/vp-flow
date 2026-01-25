# VP-Flow v1.1-C Release Notes

**Version:** 1.1-C (Option B — PWA Only)
**Release Date:** 2026-01-25
**Status:** RELEASED

---

## Overview

VP-Flow v1.1-C introduces **Progressive Web App (PWA) capabilities**, enabling the application to be installed on tablets, phones, and desktops for a near-native experience.

---

## What's New

### 🚀 Installable Application

VP-Flow can now be installed directly from the browser:

- **iPad/iPhone:** Tap Share → Add to Home Screen
- **Android:** Tap menu → Install app
- **Desktop (Chrome/Edge):** Click install icon in address bar

Once installed, VP-Flow opens in standalone mode without browser navigation elements.

### 📡 Offline Awareness

The application now gracefully handles offline scenarios:

- **Offline Banner:** A warning banner appears when you lose internet connection
- **Read-Only Mode:** Data viewing is blocked when offline — connection required
- **Write Protection:** All create/update/delete operations are blocked when offline to prevent data loss

### ⚡ Improved Performance

- Application shell is cached for faster subsequent loads
- Static assets (CSS, JavaScript, icons) cached locally
- Service worker enables instant app launch after installation

---

## What's Not Included

The following features remain for future versions:

- Handwriting & Pen Input support
- Device-specific UX optimizations
- Push notifications
- Offline data access (data requires connection)

---

## Technical Details

| Component | Implementation |
|-----------|----------------|
| PWA Framework | VitePWA (vite-plugin-pwa) |
| Service Worker | Workbox (autoUpdate strategy) |
| Caching | App shell only (no API caching) |
| Offline Detection | Browser online/offline events |

---

## Security Notes

- **No sensitive data cached:** Only the application shell is cached
- **Authentication required:** Users must be online to authenticate
- **Write operations blocked offline:** Prevents accidental data corruption
- **No background sync:** All operations are synchronous and online

---

## Installation Instructions

### iOS (Safari)

1. Open VP-Flow in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to confirm

### Android (Chrome)

1. Open VP-Flow in Chrome
2. Tap the three-dot menu
3. Tap "Install app" or "Add to Home Screen"
4. Tap "Install" to confirm

### Desktop (Chrome/Edge)

1. Open VP-Flow in Chrome or Edge
2. Look for the install icon (⊕) in the address bar
3. Click "Install"

---

## Compatibility

| Platform | Browser | Status |
|----------|---------|--------|
| iPad | Safari | ✅ Supported |
| iPhone | Safari | ✅ Supported |
| Android | Chrome | ✅ Supported |
| Windows | Chrome/Edge | ✅ Supported |
| macOS | Chrome/Safari | ✅ Supported |

---

## Known Limitations

1. **Offline = Read-Only:** No data access when offline
2. **Re-authentication:** May need to log in again after extended offline periods
3. **No Push Notifications:** Notifications are in-app only

---

## Upgrade Notes

No database changes or migrations required. Update is automatic via service worker.

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| v1.1-C | 2026-01-25 | PWA capabilities (Option B) |
| v1.1-B | 2026-01-20 | Notes Module |
| v1.1-A | 2026-01-15 | Document Links |
| v1.0 | 2026-01-10 | Initial Release |

---

**End of Release Notes**
