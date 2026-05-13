# Cowork — Visuele Audit Rapport / VP-Flow v2.0
**Datum:** 2026-05-13
**Auditor:** Cowork (Claude.ai — visuele browser audit)
**Methode:** Live browser walkthrough via Chrome op localhost:8080
**Rol ingelogd als:** Admin (Vice President)
**Status:** DRAFT — ter aanvulling op TC-015 agent rapporten

---

## Executive Summary

De visuele browser audit van alle VP-Flow modules laat een systeem zien dat functioneel solide is maar enkele kritieke UX- en routingproblemen heeft die aandacht vereisen voor productie. De zwaarste bevinding is een routing bug waarbij directe URL-navigatie naar `/notes`, `/audit-logs` en vermoedelijk andere routes doorverwijst naar `/dashboards` — dit maakt bookmarks en gedeelde links kapot. De Audit Logs hebben een hard cap van 100 events zonder paginering, wat in productie stille data-truncatie veroorzaakt. Settings toont SMTP-configuratie aan de VP-rol wat een informatiebeveiligingsrisico is. Verder is de UX consistent en herkenbaar, maar vertonen alle lijstpagina's excessieve lege ruimte en bevat de Appointment detail-pagina een dubbele VP Notes sectie (HIGH bug).

---

## Severity Overzicht

| Severity | Aantal bevindingen |
|---|---|
| CRITICAL | 0 |
| HIGH | 5 |
| MEDIUM | 9 |
| LOW | 15 |
| **Totaal** | **29** |

---

## Module-voor-module Bevindingen

### Dashboard

**HIGH — geen**

**MEDIUM**
- Geanimeerde decoratieve lijnen (blauwe asterisk-achtige animatie) in alle paginaheaders: visueel storend en afleiding van content. Consistent over alle modules.
- "Recent Notes" kolom "Linked To" toont alleen een pictogram (kalender/persoon icoon), geen tekst label. Niet duidelijk wat het icoon betekent voor nieuwe gebruikers.

**LOW**
- 4e stat card ("Unread Notifications") valt iets buiten het zichtbare gebied op 1280px breedte — de rechterrand is licht afgeknipt.
- Geen beschrijvende subtitle onder "Dashboard" (andere modules hebben wel een subtitle zoals "Incoming Post Management").

---

### Guests (`/clients`)

**HIGH**
- **Routing bug**: Directe URL-navigatie naar `/guests` toont een lege pagina. De werkelijke route is `/clients`. Dit breekt externe links, bookmarks en eventuele e-mailverwijzingen naar de Guests module.

**MEDIUM**
- Guest detail pagina heeft geen naam van de gast in de breadcrumb of paginatitel — toont generiek "Guest Detail". Navigatie-context ontbreekt.

**LOW**
- "Contact Person" veld leeg, geen placeholder tekst.
- Grote lege ruimte onder de tabel met 4 records (consistent patroon over alle lijsten).

---

### Appointments

**HIGH**
- **VP Notes duplicatie**: In de Appointment detail pagina verschijnt de "VP Notes" sectie zowel in het rechterzijpaneel als in de hoofdbody. Dezelfde inhoud op twee plekken — HIGH UX blocker die verwarring veroorzaakt bij de VP.

**MEDIUM**
- "Mark Complete" knop zichtbaar op een appointment met status "approved". De knop zou verborgen of uitgeschakeld moeten zijn als de appointment al goedgekeurd is.
- "Cancel" knop heeft dezelfde grootte en prominentie als "Mark Complete" — destructieve actie heeft te veel visueel gewicht.
- Tijdformaat inconsistentie: zijpaneel toont "DD/MM/YYYY" (bv. 26/01/2026), hoofdbody toont Engels formaat (bv. "Jan 26, 2026"). Zelfde appointment, twee notaties.

**LOW**
- Eerste appointment toont "12:00 AM" als tijd — mogelijk default/placeholder data in plaats van werkelijke tijd.

---

### Cases

**LOW**
- 0 records — empty state "No cases yet" rendert correct.
- Grote lege ruimte onder de lege tabel (consistent patroon).

---

### Documents

**LOW**
- 0 documenten — empty state "No documents found" rendert correct.
- Geen "Upload Document" knop op de lijstpagina: dit is by design (documenten worden geüpload vanuit cases/appointments context), maar voor nieuwe gebruikers is dit niet duidelijk.

---

### Incoming Post

**LOW**
- Datumformaat inconsistentie in detail pagina: "Received" veld toont "Mar 24, 2026" (geen tijd), terwijl "Created" in het informatiepaneel "Mar 25, 2026, 11:37 AM" toont (met tijd). Inconsistent op dezelfde pagina.
- Geen audit trail / history sectie op de detail pagina.

---

### Notes

**HIGH**
- **Routing bug**: Directe URL-navigatie naar `/notes` verwijst door naar `/dashboards`. Navigatie vanuit de sidebar werkt correct. Zelfde bug als `/audit-logs`.

**LOW**
- Geen zoek- of filterfunctie op de Notes lijst (andere modules zoals Incoming Post hebben dit wel).
- Empty Category badge voor smoke test notificaties (inconsistent met andere rijen).

---

### Audit Logs

**HIGH**
- **Routing bug**: Directe URL-navigatie naar `/audit-logs` verwijst door naar `/dashboards`. Navigatie vanuit de sidebar werkt correct.
- **Paginering ontbreekt — hard cap**: De pagina toont "33 events (max 100)". Er zijn geen paginering controls, geen "load more" knop. In productie zullen audit logs de 100-grens overschrijden en worden oudere events stilzwijgend niet meer getoond. Voor een systeem van record is dit een HIGH bevinding.

**LOW**
- Vroege events (pre-maart 2026) tonen "Admin" als Actor in plaats van de werkelijke gebruikersnaam.
- Entity ID kolom toont afgekorte UUIDs (bv. `6719ed4e...`) — geen klikbare link naar de entiteit.

---

### Notifications

**LOW**
- Filter dropdown label afgekapt: "All No..." (te smal). Volledig label niet zichtbaar.
- "Mark Read" / "Mark Unread" knoppen op de notificatielijst zijn tekst-knoppen, inconsistent met het icoon-only stijl elders in het systeem (Appointments, Notes, etc. gebruiken iconen).
- Smoke test notificaties zichtbaar in de lijst (TC-011 Resume Test, TC-011 Skip Test, TC-010 smoke, Email Trigger Smoke Test) — development test data in production UI.
- Bell dropdown toont max 3 notificaties dan "View All Notifications →". Correct gedrag, goed.

---

### User Management

**MEDIUM**
- Klikken op een gebruikersrij doet niets — geen navigatie, geen modal, geen edit mogelijkheid. User Management is volledig read-only. Geen knop voor "Deactiveer gebruiker", "Wijzig rol", of "Uitnodigen". In een productie government-systeem is minimale beheerfunctionaliteit verwacht.

---

### Settings

**HIGH**
- **SMTP credentials zichtbaar voor VP-rol**: De "Email Notifications" sectie toont SMTP Host (`smtp.hostinger.com`), SMTP Username (`info@vpflow.app`), From Address, en Port aan de ingelogde VP. Het wachtwoord is gemaskeerd maar de overige configuratie is zichtbaar. Systeem-configuratie van dit niveau hoort verborgen te zijn voor niet-admin rollen.

**MEDIUM**
- **Dubbele push notificatie toggle**: Er zijn twee push notification controls in dezelfde Settings pagina: (1) "Push Notifications" kaart rechtsboven met Status "Inactive" en toggle UIT, en (2) "Notification Preferences" sectie lager op de pagina met "Push notificaties" toggle AAN. Dit zijn twee verschillende concepten (browser subscription status vs. user preference), maar ze zien er visueel identiek uit en veroorzaken verwarring.
- **Versie outdated**: System Information toont "v1.3.0" — het systeem is op v2.0 (TC-005 t/m TC-014 uitgevoerd). Hardcoded versiestring moet geüpdated worden.
- Rechterkolom volledig leeg naast de "Notification Preferences" kaart — dode whitespace in een 2-koloms grid.

**LOW**
- Taalmenging in Email Notifications sectie: "Test Verbinding" en "Opslaan" zijn Nederlands, de rest van de UI is Engels. Inconsistent.
- Geen "Profiel bewerken" knop — Profile Information is volledig read-only. Naam en e-mailadres kunnen niet aangepast worden vanuit de UI.

---

### Auth Pagina's

**LOW**
- `/sign-in` en `/lock-screen` tonen een blanco pagina bij directe navigatie terwijl ingelogd. Dit is verwacht gedrag (redirect naar dashboard), maar `/lock-screen` zou programmatisch bereikbaar moeten zijn (via timeout of lock-knop). Lock screen trigger is niet zichtbaar vanuit de huidige UI.

---

## Cross-Cutting Bevindingen

**HIGH**
- **Routing bug — directe URL-navigatie broken**: `/notes` en `/audit-logs` redirecten naar `/dashboards` bij directe URL-navigatie (browser adresbalk, bookmark, externe link). Sidebar-navigatie werkt correct. Vermoedelijk zijn meer routes getroffen. Dit suggereert een probleem met de ProtectedRoute / route guard implementatie waarbij de auth-state nog niet geladen is bij directe page load, waarna de guard doorstuurt naar dashboard in plaats van te wachten.

**MEDIUM**
- **Animatie in alle paginaheaders**: Geanimeerde blauwe asterisk/ster-achtige lijnen zijn aanwezig in vrijwel elke paginaheader. Visueel opvallend en storend in een government-grade systeem. Zou uitschakelbaar moeten zijn of verwijderd worden.
- **Excessieve lege ruimte onder tabellen**: Alle lijstpagina's met weinig records (0–5) tonen een grote lege ruimte na de tabel, gevolgd door een footer. Dit geeft de indruk dat er content ontbreekt. Zou opgelost worden door een min-height of de empty state groter/gecentreerder te tonen.

---

## Settings — Tab Structuur Analyse

Huidige secties op de Settings pagina (van boven naar beneden):

| Sectie | Type | Zichtbaar voor |
|---|---|---|
| Profile Information | Readonly info | Alle rollen |
| Theme Preferences | Interactief (4 opties) | Alle rollen |
| System Information | Readonly info | Alle rollen |
| Push Notifications (kaart) | Toggle (browser sub) | Alle rollen |
| Notification Preferences | 2 toggles | Alle rollen |
| Email Notifications (SMTP) | Form (gevoelig) | VP / Admin |

**Voorgestelde tab structuur:**

| Tab | Inhoud | Rollen |
|---|---|---|
| Profiel | Profile Information | Alle |
| Weergave | Theme Preferences (kleurschema, topbar, menu, sidebar) | Alle |
| Notificaties | Push Notifications kaart + Notification Preferences samengevoegd (1 overzichtelijke sectie) | Alle |
| Systeem | System Information (readonly) | Alle |
| E-mail Configuratie | Email Notifications SMTP form | VP / Admin |

**Samenvoegen van Notificaties is essentieel** — de huidige dubbele toggle is het meest verwarrende UX-probleem in Settings.

**Complexiteit van refactor:** MEDIUM
- Bestaand tab component in het project aanwezig? Controleer `src/components/` — de Appointment detail pagina heeft tabs (Overview / Documents / Notes / History), dus een werkend tab-component bestaat al.
- Bestanden die aangepast worden: `src/pages/Settings.tsx` (of equivalent), mogelijk een nieuw `SettingsTabs.tsx` component
- Risico op rollen-zichtbaarheid: "E-mail Configuratie" tab moet conditioneel verborgen worden voor Protocol-rol (alleen VP/Admin mogen SMTP zien)

---

## Prioriteitsmatrix — Top 10 Acties

| # | Bevinding | Severity | Impact | Module |
|---|---|---|---|---|
| 1 | Routing bug: directe URL-navigatie broken voor /notes, /audit-logs (en mogelijk meer) | HIGH | Hoog — bookmarks, externe links, browser refresh kapot | Cross-cutting |
| 2 | Audit Logs: paginering ontbreekt, hard cap 100 events | HIGH | Hoog — silent data loss in productie | Audit Logs |
| 3 | Settings: SMTP credentials zichtbaar voor VP-rol | HIGH | Hoog — informatiebeveiliging | Settings |
| 4 | Appointment detail: VP Notes dubbel (sidebar + body) | HIGH | Hoog — VP ziet dubbele content | Appointments |
| 5 | /guests route leeg — alleen /clients werkt | HIGH | Medium — externe links kapot | Guests |
| 6 | Settings: dubbele push notification toggle (verwarrend) | MEDIUM | Hoog — gebruiker weet niet welke toggle geldig is | Settings |
| 7 | Settings: versie hardcoded op v1.3.0 | MEDIUM | Medium — misleidende systeeminformatie | Settings |
| 8 | Appointments: "Mark Complete" zichtbaar op goedgekeurd item | MEDIUM | Medium — UX inconsistentie | Appointments |
| 9 | Animatie in alle paginaheaders — professional appearance | MEDIUM | Medium — first impression government systeem | Cross-cutting |
| 10 | User Management volledig read-only — geen rol/status beheer | MEDIUM | Medium — operationeel beperkt in productie | User Management |

---

## Methodiek & Scope

Deze audit is uitgevoerd als VP-rol (Admin account) en dekt de volgende routes:

| Module | Route | Bezocht |
|---|---|---|
| Dashboard | /dashboards | Ja |
| Guests list | /clients | Ja |
| Guest detail | /clients/:id | Ja |
| Appointments list | /appointments | Ja |
| Appointment detail | /appointments/:id | Ja |
| Cases list | /cases | Ja |
| Documents list | /documents | Ja |
| Incoming Post list | /incoming-post | Ja |
| Incoming Post detail | /incoming-post/:id | Ja |
| Notes list | /notes | Ja (via sidebar) |
| Note detail | /notes/:id | Ja |
| Audit Logs | /audit-logs | Ja (via sidebar) |
| Notifications | /notifications | Ja |
| User Management | /users | Ja |
| Settings | /settings | Ja (volledig gescrolled) |
| Sign-in | /sign-in | N/A (redirect bij inlog) |
| Lock-screen | /lock-screen | Niet bereikbaar via directe URL |

Niet getest: Protocol-rol weergave, Secretary-rol weergave, Document upload flow, Note aanmaken met rich text editor, Case aanmaken.

---

*DRAFT — Cowork visuele audit ter aanvulling op TC-015 Claude Code en Codex rapporten. Wacht op Delroy's signaal voor vervolgstap.*
