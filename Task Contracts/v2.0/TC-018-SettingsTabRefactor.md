# DEVMART TASK CONTRACT

## Task Identification

- **Task Name:** Settings Tab Refactor
- **Project:** VP-Flow
- **Phase:** v2.0 Pre-Phase 2 — UX Polish
- **Phase Validator:** Delroy
- **Date:** 2026-05-16
- **Control Chain Mode:** [x] Mode A — Claude.ai-Mediated
- Mode B reason: N/A

---

## Objective

Refactor de Settings pagina van een lange scroll-layout naar een 5-tab structuur, consolideer de dubbele push notification toggle, verberg de Email Configuratie sectie voor de Protocol-rol, en corrigeer het hardcoded versienummer.

---

## Mandatory Challenge (Rule 7)

**Zwakke aanname:** Het bestaande tab-component uit de Appointment detail pagina is direct herbruikbaar voor Settings. In werkelijkheid kan de tab-component styling of state-management specifiek voor Appointment detail zijn. Claude Code moet het component eerst inspecteren vóór hergebruik — als het niet geschikt is, bouw een minimale tab-implementatie in lijn met de huidige Bootstrap stijl.

**Ontbrekende constraint:** Er is geen definitie van hoe de dubbele push toggle geconsolideerd moet worden. Constraint: verwijder de standalone "Push Notifications" kaart (met Status/Inactive badge en losse toggle) — de "Notification Preferences" sectie (met Push notificaties + E-mail notificaties toggles) blijft als de enige toggle-interface. Zorg dat de browser subscription-status (Inactive/Active) zichtbaar blijft als een status-label naast de Push toggle, niet als een aparte kaart.

**Failure risico:** De Email Configuratie tab has rol-afhankelijke zichtbaarheid — als de rol-check niet correct geïmplementeerd is, ziet Protocol de SMTP-configuratie. Dit is een beveiligingsrisico. Claude Code moet de rol-check verifiëren met een console-test vóór als compleet rapporteren.

---

## Execution Mode

[x] EXTENDED MODE — gecontroleerde feature refactor binnen één module

---

## Risk Classification

[x] MEDIUM — één module, meerdere componenten, rol-afhankelijke zichtbaarheid
- Geen DB-migraties
- Geen RLS-wijzigingen
- Rol-check op tab-niveau (UI-only, RLS blijft ongewijzigd)
- PRE restore point vereist vóór uitvoering

---

## Scope Definition

### In Scope

**1. Tab-structuur implementeren:**

| Tab | Inhoud | Zichtbaar voor |
|---|---|---|
| Profiel | Profile Information (naam, e-mail, rol, status — readonly) | Alle rollen |
| Weergave | Theme Preferences (kleurschema, topbar, menu, sidebar-size, reset) | Alle rollen |
| Notificaties | Geconsolideerde push + email toggles + browser-subscription status | Alle rollen |
| Systeem | System Information (readonly: app, versie, env, PWA, datum, tijd, sessie, access) | Alle rollen |
| E-mail Config | Email Notifications SMTP form (host, port, user, password, from, from name, enable toggle, test, opslaan) | VP en Secretary — NIET Protocol |

**2. Dubbele push toggle consolideren:**
- Verwijder de standalone "Push Notifications" kaart
- Voeg browser subscription-status toe als label naast de Push notificaties toggle in de Notificaties tab
- Één duidelijke toggle per kanaal (push / email)

**3. E-mail Configuratie tab — rol-afhankelijke zichtbaarheid:**
- Tab volledig verbergen voor Protocol-rol (tab niet renderen, niet alleen disablen)
- VP en Secretary zien de tab

**4. Versienummer corrigeren:**
- Vervang hardcoded `"v1.3.0"` door dynamische waarde uit `package.json` of een centrale constante
- Locatie: `settings/page.tsx:` (of equivalent System Information component)

**5. Taalmenging oplossen in Email Configuratie:**
- "Test Verbinding" → "Test Connection"
- "Opslaan" → "Save"
- Scope: alleen deze twee labels in de Email Configuratie sectie

### Out of Scope

- Geen wijzigingen aan de Settings data-logica (SMTP opslaan, push subscription flow, preference save)
- Geen profiel-bewerking toevoegen (Profile tab blijft readonly)
- Geen User Management functionaliteit toevoegen
- Geen wijzigingen aan RLS of auth-logica
- Geen migraties
- TC-016 en TC-017 scope

---

## File Boundary

### Allowed to READ
- `src/app/(admin)/settings/` — volledig
- `src/components/` — tab-component opzoeken
- `src/context/` — rol-check pattern opzoeken
- `package.json` — versienummer

### Allowed to WRITE
- `src/app/(admin)/settings/page.tsx`
- `src/app/(admin)/settings/components/` — alle bestaande + nieuw `SettingsTabs.tsx` indien nodig
- Geen andere bestanden

### Forbidden
- Geen auth, RLS, migraties
- Geen wijzigingen buiten `src/app/(admin)/settings/`
- Geen git push (Delroy pusht zelf)

---

## Expected Output

- Settings pagina heeft 5 tabs: Profiel, Weergave, Notificaties, Systeem, E-mail Config
- Protocol-rol ziet 4 tabs (geen E-mail Config)
- Geen dubbele push toggle — één geconsolideerde Notificaties tab
- Versienummer dynamisch (niet hardcoded v1.3.0)
- "Test Connection" en "Save" in plaats van Dutch labels
- `npm run lint` → 0 errors
- `npm run build` → 0 errors
- PRE restore point aangemaakt vóór uitvoering
- POST restore point aangemaakt na uitvoering

---

## Verification Requirement

Na aflevering bevestigt Claude Code:
1. Tab-structuur screenshot-beschrijving (welke tabs, welke volgorde)
2. Rol-check implementatie: hoe wordt Protocol gefilterd
3. Versienummer: bron van de dynamische waarde
4. Consolidated push toggle: wat is verwijderd, wat is toegevoegd
5. `npm run lint` output
6. `npm run build` output
7. Pad PRE + POST restore points

---

## Constraints

- Hergebruik bestaand tab-component als het past — bouw geen custom tab-component tenzij bestaande echt niet bruikbaar is
- Protocol-rol check via bestaand `useAuthContext` / `userRole` patroon — niet zelf een nieuwe auth-hook bouwen
- Geen enkel bestaand Settings functionaliteit mag breken (SMTP opslaan, preference toggles, theme switching)
- Tab state niet persisteren in localStorage — gebruik React state (actieve tab reset bij page refresh is acceptabel)

---

## Stop Condition

Stop na: 5 tabs live, rol-check gevalideerd, lint 0, build 0, POST restore point aangemaakt. Rapporteer aan Delroy. Wacht op signaal.

---

## Override Log

- Violation detected: —
- Instruction in conflict: —
- Execution status: NOT STARTED
- Delroy response: [ ] Corrected instruction | [ ] Override authorized

---

## Validation Checklist

- [x] Objective is single and unambiguous
- [x] Execution mode: EXTENDED MODE
- [x] Risk classified: MEDIUM
- [x] File boundaries explicit
- [x] Stop condition defined
- [x] No field blank
- [x] Mandatory Challenge aanwezig
- [x] Lane B — PRE + POST restore point vereist
- [x] Rol-afhankelijke zichtbaarheid expliciet gedocumenteerd

---

**STATUS: DRAFT — Awaiting Delroy approval ("Goedgekeurd") before Claude Code begins.**
