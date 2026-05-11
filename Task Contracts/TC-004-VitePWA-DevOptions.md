# TC-004 — VitePWA DevOptions (Dev Mode Service Worker)

**Status:** APPROVED
**Lane:** A (config change — non-functional, dev-only)
**Module:** PWA / vite.config.ts
**Created:** 2026-05-11
**Created by:** Devmart (Claude.ai / Cowork)
**Approved by:** Delroy (2026-05-11 — "Optie A, doe dit")

---

## Context

TC-003 Task 3 (push smoke test) is geblokkeerd op localhost: VitePWA registreert
de service worker niet in dev mode zonder `devOptions`. Hierdoor resolveert
`navigator.serviceWorker.ready` nooit en blijft de push toggle spinner hangen.

Root cause (gediagnosticeerd door Claude Code tijdens TC-003 Task 1):
- `vite.config.ts` VitePWA block heeft geen `devOptions` → service worker disabled in dev
- Fix: voeg `devOptions: { enabled: true, type: 'module' }` toe aan de VitePWA config

Impact: dev-only. Productie builds zijn niet geraakt. Geen RLS, geen migraties, geen DB.

---

## Scope

Één wijziging in `vite.config.ts`:
- Voeg `devOptions: { enabled: true, type: 'module' }` toe aan de `VitePWA({})` config block

---

## Out of Scope

- Geen andere wijzigingen aan vite.config.ts
- Geen wijzigingen aan sw-push.js of enig ander bestand
- Geen migraties, geen RLS, geen components

---

## Files Affected

| File | Change |
|---|---|
| `vite.config.ts` | Add `devOptions: { enabled: true, type: 'module' }` inside VitePWA({}) |

---

## Acceptance Criteria

- [ ] `devOptions` toegevoegd aan vite.config.ts VitePWA block
- [ ] `npm run dev` herstart — geen build errors
- [ ] Service worker zichtbaar in Chrome DevTools → Application → Service Workers
- [ ] Push toggle in Settings resolveert zonder eeuwig spinner

---

## Governance Checklist

- [ ] Scope beperkt tot één config toevoeging
- [ ] Geen frozen v1.x behavior aangeraakt
- [ ] Build/lint check na wijziging
- [ ] Lane A — geen restore point vereist

---

## Notes

Lane A — directe uitvoering na Delroy goedkeuring. Geen PRE/POST restore point vereist.
Na uitvoering: hervat TC-003 Task 3 smoke test.
