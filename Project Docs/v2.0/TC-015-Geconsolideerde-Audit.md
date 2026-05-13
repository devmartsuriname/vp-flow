# TC-015 — Geconsolideerde Source of Truth Audit
# VP-Flow v2.0 — Datum: 2026-05-13
**Status:** DRAFT — wacht op Delroy's "Goedgekeurd" + beslissing op 3 open conflicts
**Auditors:** Claude Code · Codex CLI · Cowork (visuele browser audit)
**Methode:** Drie onafhankelijke audits, samengebracht zonder onderlinge afstemming. Dit document is de authoritative referentie voor Phase 2 pre-TC's.

---

## Executive Summary

Alle drie auditors zijn het over de kern eens: VP-Flow v2.0 is functioneel compleet, maar heeft drie systemische zwaktes die vóór productie-opschaling moeten worden opgelost. **Pagination ontbreekt op vrijwel alle lijsten** — queries halen volledige tabellen op, Audit Logs heeft een stille 100-row cap. **Template dead code** van het Bootstrap Darkone-template zit nog in de codebase (demo-routes, vergeten console.log). **Settings** is te lang en gemengd voor dagelijks gebruik en moet naar tabs. Naast deze gedeelde bevindingen vond Cowork's live browser test twee extra HIGH-bevindingen die code-analyse niet kon zien: een routing bug waarbij directe URL-navigatie naar `/notes` en `/audit-logs` doorverwijst naar `/dashboards`, en een dubbele VP Notes sectie in de Appointment detail pagina.

**Aanbeveling voor Phase 2 start:** drie voorbereidende TC's, in volgorde.

---

## Severity Totalen

| Severity | Claude Code | Codex | Cowork | Gecombineerd (uniek) |
|---|---|---|---|---|
| CRITICAL | 2 | 1 | 0 | 1–2 (zie Conflict A/B) |
| HIGH | 9 | 6 | 5 | ~14 unieke HIGH bevindingen |
| MEDIUM | 16 | 20 | 9 | ~25 unieke MEDIUM bevindingen |
| LOW | 14 | 14 | 15 | ~20 unieke LOW bevindingen |

*Exacte unieke tellingen volgen na Delroy's beslissing op de drie open conflicts.*

---

## Gedeelde Bevindingen — Sterk Signaal

Alle drie auditors vonden onderstaande bevindingen onafhankelijk. Geen Delroy-beslissing nodig — dit zijn zekerheden voor de pre-TC's.

| # | Bevinding | Severity consensus | Locatie |
|---|---|---|---|
| G1 | Pagination ontbreekt op alle hoofdlijsten: Appointments, Cases, Documents, Incoming Post, Guests, Notes, Notifications | HIGH | `useAppointments.ts`, `useCases.ts`, `useDocuments.ts`, `useIncomingPosts.ts`, `useClients.ts`, `useNotes.ts`, `useNotifications.ts` |
| G2 | Audit Logs stille 100-row cap zonder paginering of gebruikerswaarschuwing | HIGH / CRITICAL (zie Conflict B) | `useAuditLogs.ts` — `.limit(100)` zonder offset/cursor |
| G3 | Settings scrollpagina te lang (~2 viewports); vraagt tab-refactor | HIGH | `settings/page.tsx` |
| G4 | `console.log('bvdfbgd', changeTheme)` in productiecode | LOW | `src/app/(admin)/(layouts)/dark-mode/components/DarkMode.tsx:8` |
| G5 | Template dead code: `(layouts)/dark-mode`, `dark-sidenav`, `dark-topnav`, `hidden-sidenav`, `small-sidenav` — niet gerouteerd, niet geïmporteerd | MEDIUM | `src/app/(admin)/(layouts)/` |
| G6 | Notifications dropdown fetch-all + UI-side `.slice(0, 5)` — unbounded query bij scale | HIGH | `TopNavigationBar/Notifications.tsx` |
| G7 | Lijstpagina-shells gedupliceerd: error/header/role-guard patroon herhaald in 9 modules | MEDIUM | `appointments/page.tsx`, `cases/page.tsx`, `documents/page.tsx`, `notes/page.tsx`, `incoming-post/page.tsx`, etc. |
| G8 | Inline `style={{…}}` verspreid over meerdere componenten i.p.v. SCSS tokens | LOW | Verspreid — zie Domein 5 in agent-rapporten |
| G9 | Excessieve lege ruimte onder tabellen op alle lijstpagina's met weinig records | LOW | `layouts/AdminLayout.tsx` — `min-vh-100` flex ontbreekt |

---

## Open Conflicts — Delroy-beslissing Vereist

### Conflict A — Rich Text Notes `content_format`

| Agent | Bevinding | Severity |
|---|---|---|
| Claude Code | PARTIAL mismatch; implementatie consistent met 'json'; TC-015 spec gebruikt 'html' als descriptor | LOW |
| Codex | TC-015 flow vraagt `content_format = 'html'`; code en migration gebruiken `json` → contractbreuk | CRITICAL |
| Cowork | Visueel: pre-TC-012 noot toont plain text (correct). TC-012 is Goedgekeurd met 'json'. De TC-015 spec-zin is een descriptor, geen authoritative contract | — |

**Aanbeveling Cowork:** Codex's CRITICAL is een false positive. TC-012 RP bevestigt 'json' als correct. De contractbreuk zit in de TC-015 tekst, niet in de code. **Beslissing: accepteer Claude Code's LOW; geen fix nodig.**

**Keuze voor Delroy:** [ ] Claude Code (LOW — geen actie) · [ ] Codex (CRITICAL — fix nodig)

---

### Conflict B — Audit Logs severity

| Agent | Bevinding | Severity |
|---|---|---|
| Claude Code | Stille afkapping is data-loss-visibility risico voor cabinet-grade systeem | CRITICAL |
| Codex | Pagination ontbreekt, geen cursor; ingeschaald op infra/UX | HIGH |
| Cowork | Data is opgeslagen — display-cap, geen echte data loss. Maar voor government systeem van record serieus | HIGH |

**Aanbeveling Cowork:** HIGH is correct. CRITICAL is voorbehouden voor broken functionality of werkelijk dataverlies — de data staat in de DB, alleen de UI toont het niet. **Beslissing: HIGH, pagination TC is urgent.**

**Keuze voor Delroy:** [ ] CRITICAL (urgentste TC prioriteit) · [ ] HIGH (deel van Pagination Hardening TC)

---

### Conflict C — Sidebar menu role filtering

| Agent | Bevinding | Severity |
|---|---|---|
| Claude Code | Niet expliciet gevonden; page-level role-guards beoordeeld | — |
| Codex | Protocol ziet menu-items voor Guests, Cases, Documents, Incoming Post, User Management, Settings; pagina's redirecten daarna maar items zijn zichtbaar | HIGH |
| Cowork | Niet live getest (VP-rol ingelogd); bevinding plausibel op basis van code |  — |

**Aanbeveling Cowork:** Codex's bevinding accepteren. Menu toont items die Protocol geen toegang toe heeft — zelfs als pagina's daarna redirecten is dit UX-verwarrend en vermoedelijk niet de bedoeling.

**Keuze voor Delroy:** [ ] Accepteer Codex HIGH · [ ] Nader onderzoek

---

## Unieke Bevindingen Claude Code

Bevindingen die alleen Claude Code vond, niet door Codex of Cowork bevestigd.

| Severity | Bevinding | Locatie |
|---|---|---|
| HIGH | `+` placeholder-artefacten zichtbaar in list-page headers (screenshots 3–7) — ongerenderde IconifyIcon of broken markup | `appointments/page.tsx:43–58`, meerdere list pages |
| MEDIUM | `IncomingPost page.tsx`: lege `useEffect` body met comment; `navigate` in dependency-array zonder gebruik | `incoming-post/page.tsx:16–22` |
| MEDIUM | `"Last Login"` in Settings toont `new Date().toISOString()` als approximatie i.p.v. werkelijke login-tijd | `settings/page.tsx:42–45` |
| MEDIUM | `useTodayNotes` fetcht `limit(limit*2)` en filtert client-side → missers mogelijk | `dashboards/hooks/useTodayNotes.ts:26` |
| MEDIUM | `EntityLinkSelector` `.limit(100)` per categorie — search faalt voorbij 100 entries | `notes/components/EntityLinkSelector.tsx` |
| MEDIUM | `useCaseTimeline` slikt audit errors stil via `console.warn` | `cases/hooks/useCaseTimeline.ts:61` |
| LOW | `useAuthContext`: `console.error` voor role-fetch errors zonder UI-fallback | `context/useAuthContext.tsx` |
| LOW | Documents `handleView`/`handleDownload` falen stil bij ontbrekende `signedUrl` | `documents/page.tsx:38–71` |

*Noot: Claude Code's `+` placeholder-artefacten (HIGH 1.3) zijn door Codex beoordeeld als waarschijnlijk het AnimationStar visueel effect — geen broken buttons. Severity HIGH is mogelijk te zwaar; MEDIUM is realistischer. Cowork zag de animatie ook in de live browser en bevestigt dat het geen interactief element is.*

---

## Unieke Bevindingen Codex

Bevindingen die alleen Codex vond, niet door Claude Code of Cowork bevestigd.

| Severity | Bevinding | Locatie |
|---|---|---|
| HIGH | Sidebar menu toont items voor Protocol die geen toegang hebben (zie Conflict C) | `VerticalNavigationBar/menu-items.ts` |
| MEDIUM | Case number gegenereerd via client-side `Math.random()` — collision-risico bij schaal | `useCreateCase.ts` |
| MEDIUM | `IncomingPostForm`: native `required` + silent return; geen zichtbare foutmelding bij submissie | `IncomingPostForm.tsx` |
| MEDIUM | `updateData as never` omzeilt TypeScript typecontrole | `useUpdateIncomingPostStatus.ts:18–34` |
| MEDIUM | Secretary edit/submit workflow voor eigen drafts niet zichtbaar in de Appointments-lijst | `AppointmentsTable.tsx` |
| MEDIUM | Dead files: `ThemeCustomizer`, `ComponentContainerCard`, `CustomFlatpickr`, `useModal`, `useFileUploader` | `src/components/`, `src/hooks/` |
| LOW | `navigate(notification.link)` zonder route-validatie | `GlobalSearch.tsx`, `Notifications.tsx` |
| LOW | Stale comment "Protocol redirected" in routes vs werkelijk gedrag | `routes/index.tsx` |
| LOW | Edge Functions: `Deno.env.get(...)!` zonder null-guard op Supabase URL/service key | `send-push-notification`, `send-email-notification` |

---

## Unieke Bevindingen Cowork (Visuele Browser Audit)

Bevindingen die alleen via live browser testing zichtbaar waren — niet gevonden door code-analyse.

| Severity | Bevinding | Module |
|---|---|---|
| HIGH | **Routing bug**: directe URL-navigatie naar `/notes` en `/audit-logs` verwijst door naar `/dashboards`. Sidebar-navigatie werkt correct. Runtime bug, niet zichtbaar in code-review. Bookmark, browser-refresh, externe links kapot. | Cross-cutting |
| HIGH | **VP Notes dubbel**: Appointment detail toont VP Notes sectie zowel in het rechterzijpaneel als in de hoofdbody — zelfde content op twee plekken | `appointments/[id]/page.tsx` |
| HIGH | **SMTP credentials zichtbaar voor VP-rol**: Email Notifications sectie in Settings toont SMTP Host, Username, From Address aan de VP. Systeem-configuratie hoort verborgen te zijn voor niet-admin | `settings/page.tsx` |
| MEDIUM | "Mark Complete" knop zichtbaar op reeds goedgekeurde appointment — knop zou verborgen/disabled moeten zijn | `appointments/[id]/` |
| MEDIUM | "Cancel" knop heeft te veel visueel gewicht naast "Mark Complete" — destructieve actie ziet er primair uit | `appointments/[id]/` |
| MEDIUM | Dubbele push notification toggle in Settings: "Push Notifications" kaart (Inactive/OFF) én "Notification Preferences" (ON) — visueel identiek, conceptueel verschillend | `settings/page.tsx` |
| MEDIUM | Versienummer hardcoded op "v1.3.0" in System Information — zou v2.0 moeten zijn | `settings/page.tsx` |
| MEDIUM | User Management volledig read-only: geen rol-wijziging, geen deactiveren, geen uitnodigen | `users/page.tsx` |
| LOW | Datumformaat inconsistentie in Appointment detail: zijpaneel DD/MM/YYYY vs hoofdbody "Jan 26, 2026" | `appointments/[id]/` |
| LOW | Datumformaat inconsistentie in Incoming Post detail: Received zonder tijd vs Created met tijd | `incoming-post/[id]/` |
| LOW | Lock screen niet bereikbaar via directe URL — alleen programmatisch (door timeout of knop). Geen lock-trigger zichtbaar in de huidige UI | Cross-cutting |
| LOW | Taalmenging in Settings: "Test Verbinding", "Opslaan" Nederlands, rest van UI Engels | `settings/page.tsx` |
| LOW | Notification filter dropdown label afgekort: "All No..." — te smal | `notifications/page.tsx` |
| LOW | Test smoke notifications (TC-011, TC-010, TC-006) zichtbaar in productie notificatielijst — development data | `notifications/` |

---

## Settings — Tab Structuur (Gecombineerde Analyse)

Alle drie auditors zijn het eens: Settings moet naar tabs. Gecombineerd voorstel:

| Tab | Inhoud | Zichtbaar voor | Bron |
|---|---|---|---|
| Profiel | Profile Information (naam, e-mail, rol, status) | Alle rollen | Claude Code, Codex, Cowork |
| Weergave | Theme Preferences: kleurschema, topbar, menu, sidebar-size | Alle rollen | Claude Code, Codex, Cowork |
| Notificaties | Push Notifications kaart + Notification Preferences **samengevoegd** (1 sectie) | Alle rollen | Cowork (dubbele toggle probleem) |
| Systeem | System Information (readonly: versie, env, PWA status, sessie) | Alle rollen | Claude Code, Codex, Cowork |
| E-mail Configuratie | Email Notifications SMTP form | VP / Admin alleen | Cowork (SMTP zichtbaarheid issue) |

**Complexiteit:** LOW–MEDIUM. Bestaand tab-component aanwezig in project (Appointment detail gebruikt het al).
**Bestanden:** `settings/page.tsx` + nieuw `SettingsTabs.tsx` component.
**Rol-risico:** "E-mail Configuratie" tab conditioneel verbergen voor Protocol-rol.

---

## Prioriteitsmatrix — Top 10 Pre-Phase 2 Acties

Gesorteerd op severity × impact × gebruikersrisico. Gebaseerd op alle drie auditors.

| # | Actie | Severity | Lane | Bron |
|---|---|---|---|---|
| 1 | Server-side pagination: Appointments, Cases, Documents, Incoming Post, Guests, Notes, Notifications | HIGH | B | Alle drie |
| 2 | Audit Logs: pagination + total-count label + cursor-based navigatie | HIGH | B | Alle drie |
| 3 | Routing bug fixen: directe URL-navigatie `/notes`, `/audit-logs` (en vermoedelijk meer) → check ProtectedRoute loading-state | HIGH | B | Cowork |
| 4 | Notifications dropdown: unbounded fetch vervangen door server-side `.limit(5)` | HIGH | B | Claude Code, Codex |
| 5 | Settings: tab-refactor (5 tabs) + SMTP verbergen voor Protocol-rol | HIGH | B | Alle drie |
| 6 | Sidebar menu role filtering: Protocol menu-items verbergen voor niet-toegankelijke routes | HIGH | B | Codex |
| 7 | VP Notes duplicaat in Appointment detail verwijderen | HIGH | B | Cowork |
| 8 | Template cleanup: dead routes `(layouts)/dark-mode|dark-sidenav|dark-topnav|hidden-sidenav|small-sidenav` verwijderen + `console.log('bvdfbgd')` | MEDIUM | A | Alle drie |
| 9 | Dead component files opruimen: `ThemeCustomizer`, `ComponentContainerCard`, `CustomFlatpickr`, `useModal`, `useFileUploader` | MEDIUM | A | Codex |
| 10 | `"Mark Complete"` verbergen op goedgekeurde appointments + `Cancel` button downgraden | MEDIUM | B | Cowork |

---

## Aanbevolen TC-structuur voor Phase 2

Op basis van alle drie audits zijn drie voorbereidende TC's voldoende om de basis te harden:

**TC-016 — Template & Dead Code Cleanup** (Lane A)
Verwijder demo-routes, dead component files, productie console.log. Normaliseer page-header padding. LOW risico, snelle win.

**TC-017 — Pagination Hardening** (Lane B)
Server-side pagination op alle lijsten + Audit Logs cursor-based. Notifications dropdown limit. Routing bug fix. MEDIUM risico, hoge impact.

**TC-018 — Settings Tab Refactor** (Lane B)
5-tab layout, SMTP zichtbaarheid afschermen, dubbele push toggle consolideren, versienummer dynamisch. MEDIUM complexiteit.

*Volgorde: TC-016 eerst (snelste, laagste risico). TC-017 en TC-018 kunnen parallel of serieel.*

---

## Bronrapporten

| Agent | Bestand | Datum |
|---|---|---|
| Claude Code | `Project Docs/v2.0/Claude-Code-Source-of-Truth-Audit.md` | 2026-05-13 |
| Codex CLI | `Project Docs/v2.0/Codex-Source-of-Truth-Audit.md` | 2026-05-13 |
| Cowork | `Project Docs/v2.0/Cowork-Visual-Audit.md` | 2026-05-13 |

---

*DRAFT — Wacht op Delroy's beslissing op Conflict A, B en C vóór dit document als "Goedgekeurd" wordt beschouwd. Geen implementatie gestart.*
