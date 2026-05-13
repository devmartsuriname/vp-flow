# Claude Code — Source of Truth Audit
# VP-Flow v2.0 — Datum: 2026-05-13

> **Agent:** Claude Code (Devmart Guardian Rules v2.1, Mode A, SAFE MODE)
> **TC:** TC-015 Source of Truth Audit — UX Polish, Code Quality & Bug Detection
> **Status:** DRAFT — awaiting Delroy review
> **Scope:** Read-only audit. No code modified outside this rapport file.

---

## Executive Summary

VP-Flow's v2.0 baseline is functionally complete (Phases 1A–1D), maar de codebase draagt nog steeds de erfenis van een generiek Bootstrap admin template (Larkon/Inspinia). De grootste systemische zwaktes liggen in **pagination** (vrijwel alle lijstweergaven retourneren onbegrensde resultaten — Audit Logs heeft zelfs een stille 100-row cap), **template-leftover dead code** ((layouts) demo-routes en een vergeten `console.log` in productie), en **duplicatie** in pagina-shells (9 lijstpagina's herhalen hetzelfde error/header/role-guard patroon).

Een paar onmiddellijke veiligheidsklemmen zijn nodig — vooral op Audit Logs (data wordt afgebroken zonder gebruikerswaarschuwing) en op de Notifications pagina die geen role-guard heeft. De UI uit de screenshots is over het algemeen schoon, met een paar spacing-inconsistenties (extra `+` placeholders zichtbaar op Appointments/Cases/Documents headers, een lege Cases-empty-state op het dashboard met overmatige whitespace, en een dubbele subtitel-marge in Cases/Appointments). De Settings module is een sterke kandidaat voor een tab-refactor — alle benodigde componenten zijn al modulair, dus dit is LOW–MEDIUM complexiteit.

**Aanbeveling:** Vóór Phase 2 (UX Polish) twee korte voorbereidende TC's opstellen:
1. **TC — Pagination Hardening** (Lane B): voeg server-side pagination toe aan Audit Logs, Incoming Post, Appointments, Cases, Documents (volgorde van prioriteit).
2. **TC — Template Cleanup** (Lane A): verwijder (layouts)/dark-mode|dark-sidenav|dark-topnav|hidden-sidenav|small-sidenav, verwijder `console.log('bvdfbgd', …)`, normaliseer page-header padding.

---

## Severity Overzicht

| Severity | Aantal bevindingen |
|---|---|
| CRITICAL | 2 |
| HIGH | 9 |
| MEDIUM | 16 |
| LOW | 14 |

---

## Domein 1 — UX Layout & Spacing

| # | Severity | Module | Bevinding | Locatie |
|---|---|---|---|---|
| 1.1 | MEDIUM | Dashboard | Lege "No Cases" empty-state vult een halve viewport-hoogte naast Recent Appointments waardoor de pagina onevenwichtig oogt (screenshot 1). EmptyState component heeft geen min-height alignment met buur-card. | `dashboards/components/EmptyState.tsx`, `RecentCases.tsx:47-55` |
| 1.2 | LOW | Dashboard | Recent Appointments tabel toont datum, onderwerp, gast, status — geen visuele scheiding tussen lange onderwerpen die afgebroken worden (zichtbaar bij "Decoratieplechtigheid…"). Gebrek aan `title=` tooltip voor afgekapte tekst. | `dashboards/components/RecentAppointments.tsx` |
| 1.3 | HIGH | Appointments lijst (screenshot 3) | Tussen sub-title "Manage VP appointments and meetings" en de zoekbalk-card staan zichtbaar twee `+` placeholders / dev-artefacten (waarschijnlijk een ongerenderde IconifyIcon of broken plus-buttons). Komt ook terug op Cases, Documents, Incoming Post, Notes. | `appointments/page.tsx:43-58`, `cases/page.tsx:43-58`, `documents/page.tsx:110-121`, `notes/page.tsx:66-79`, `incoming-post/page.tsx:41-56` |
| 1.4 | MEDIUM | All list pages | `<Row className="mb-3">` + `<Card>` heeft 24px gap; binnen Card weer een `CardBody` met default padding → dubbele padding rond de filter-bar. Vergelijk met Guests (screenshot 2) waar het kleiner oogt door één rij filters. | List page templates (zie 1.3 paden) |
| 1.5 | LOW | Cases (screenshot 4) | Sidebar logo `VP-Flow / SYSTEM OF RECORD` wordt op deze pagina iets anders gerenderd dan op Dashboard — verschillende `MENU…` label spacing. Mogelijk caching van layout state. | `components/layout/VerticalNavigationBar` |
| 1.6 | LOW | Documents (screenshot 5) | "Showing 0 documents" tekst valt rechts uitgelijnd naast `Filter by Type` met grote whitespace bij viewport ≥1280px. | `documents/page.tsx:142-146` |
| 1.7 | MEDIUM | Audit Logs (screenshot 8) | Filterbar (Start Date / End Date / Action / Entity Type / Reset) gebruikt geen `g-2`/`g-3` consistent — visuele knelpunt op 768px breekpunt. Geen pagination-controls zichtbaar voor 100 records. | `audit-logs/components/AuditLogFiltersComponent` |
| 1.8 | MEDIUM | Notifications (screenshot 9) | Linkerkolom heeft een "Status / Category / Title / Message / Time / Action" tabel; `Status` kolom toont alleen een dot — niet semantisch toegankelijk (screen reader leest niets). | `notifications/components/NotificationsTable.tsx`, `NotificationStatusIndicator.tsx` |
| 1.9 | LOW | User Management (screenshot 10) | "All Users" filter dropdown staat naast een zoekveld zonder visuele groepering — `Row` met `align-items-end` ontbreekt. | `users/components/UserFiltersComponent` |
| 1.10 | HIGH | Settings (screenshot 11) | Pagina scrollt ~1100px op 1280×800 viewport; vijf kaarten (Profile, Theme, SystemInfo, Push, NotificationPreferences) plus de breed gestrekte EmailSettings card. Vraag van Delroy: tab-layout — zie Domein 6. | `settings/page.tsx:47-90` |
| 1.11 | LOW | Settings | "Notification Preferences" kaart heeft 2 toggles met multi-regel helper-tekst → ongelijke kaarthoogte naast SystemInfo. | `settings/components/NotificationPreferencesCard.tsx` |
| 1.12 | LOW | All pages | Footer "© 2026 VP-Flow. All rights reserved. Developed by Devmart Suriname" wordt op sommige korte pagina's (Cases empty, Documents empty, User Management) op viewport-bodem getoond, op andere niet — `min-vh-100` layout flex ontbreekt op `<AdminLayout>`. | `layouts/AdminLayout.tsx` |
| 1.13 | LOW | Auth pages | (Geen screenshot) — TC-014 heeft de logo's al hersteld. Geen extra bevindingen, baseline OK. | `app/(other)/auth/*` |
| 1.14 | MEDIUM | Cases / Appointments / Documents | Header h5 + tekst-muted subtitle staat in een Row met action-button. Tussen subtitle en filter-card komt een lege Row van `mb-3` — dubbele verticale ruimte (~32px) wat de scroll vergroot. | List page templates |

---

## Domein 2 — Pagination

| # | Severity | Lijst | Huidige staat | Geschatte max records (prod) | Huidige query limit | Aanbeveling |
|---|---|---|---|---|---|---|
| 2.1 | **CRITICAL** | Audit Logs | PARTIAL (silent cap) | 10k–100k+ | `.limit(100)` hard | PAGINATION_NEEDED — voeg `.range(from, to)` + cursor/page state toe; toon waarschuwing "max 100 events shown" is misleidend (er staan duizenden in DB). |
| 2.2 | HIGH | Appointments | NONE | 1k–5k/jaar | geen | PAGINATION_NEEDED — server-side `.range()` + filter op date range. |
| 2.3 | HIGH | Cases | NONE | 100–500/jaar | geen | PAGINATION_NEEDED — server-side `.range()`; standaard 25/page. |
| 2.4 | HIGH | Documents | NONE | 1k–10k | geen | PAGINATION_NEEDED — server-side `.range()` per entity_type. |
| 2.5 | HIGH | Incoming Post | NONE | 500–2k/jaar | geen | PAGINATION_NEEDED — `.range()` + index op `created_at`. |
| 2.6 | MEDIUM | Notifications | NONE | 100–1k/user/jaar | geen | INFINITE_SCROLL (UX-vriendelijk voor notificaties) of `.range()` met "Load more". |
| 2.7 | MEDIUM | Guests (Clients) | NONE | 200–1k | geen | PAGINATION_NEEDED — `.range()` zodra >50 guests in productie. |
| 2.8 | LOW | Notes | NONE | <100 (VP-only) | geen | ACCEPTABLE — volume blijft beperkt; herzien als >200 notes. |
| 2.9 | LOW | Users | NONE | 3–10 | geen | ACCEPTABLE — gesloten userpool. |
| 2.10 | LOW | Dashboard widgets | COMPLETE | n/a | `.limit(5)` per widget | ACCEPTABLE. |
| 2.11 | LOW | EntityLinkSelector (notes) | PARTIAL | n/a | `.limit(100)` per categorie | ACCEPTABLE; alleen gebruikt in linking UI. |
| 2.12 | MEDIUM | Global Search | PARTIAL | n/a | `.limit(MAX_RESULTS_PER_CATEGORY)` | ACCEPTABLE; aanbeveling: toon "show all results" link naar lijstpagina. |

**Hoofdrisico:** 2.1 — Audit Logs gedraagt zich als "alle gegevens" maar capt stil op 100. Voor een Cabinet-grade systeem met juridische bewijswaarde is dit een **dataverlies-visibiliteits-risico**.

---

## Domein 3 — Dead Code

| # | Severity | Type | Locatie | Notitie |
|---|---|---|---|---|
| 3.1 | HIGH | DEAD_FILE (folder) | `src/app/(admin)/(layouts)/dark-mode/` | Bootstrap template demo, niet gerouteerd. Verwijderen. |
| 3.2 | HIGH | DEAD_FILE (folder) | `src/app/(admin)/(layouts)/dark-sidenav/` | Idem. |
| 3.3 | HIGH | DEAD_FILE (folder) | `src/app/(admin)/(layouts)/dark-topnav/` | Idem. |
| 3.4 | HIGH | DEAD_FILE (folder) | `src/app/(admin)/(layouts)/hidden-sidenav/` | Idem. |
| 3.5 | HIGH | DEAD_FILE (folder) | `src/app/(admin)/(layouts)/small-sidenav/` | Idem. |
| 3.6 | MEDIUM | DEBUG_LOG | `src/app/(admin)/(layouts)/dark-mode/components/DarkMode.tsx:8` | `console.log('bvdfbgd', changeTheme)` — duidelijke per-ongeluk-debugstring. |
| 3.7 | LOW | DEBUG_LOG | `src/components/ErrorBoundary.tsx:24-26` | 3× `console.error` — acceptabel voor error boundary, maar overweeg externe logger (Sentry). |
| 3.8 | LOW | DEBUG_LOG | `src/hooks/usePushSubscription.ts:59,88,102,122,131,162` | 6× `console.error` in push flow. Acceptabel tijdens v2.0 launch; verplaats naar logger vóór productie hardening. |
| 3.9 | LOW | DEBUG_LOG (cluster) | dashboards hooks (`useRecentNotes.ts:24`, `useTodayNotes.ts:29,47`, `useRecentClients.ts:16`, `useRecentCases.ts:16`, `useRecentAppointments.ts:24`, `useDashboardStats.ts:18,28,40`) | Consistente fout-logging pattern — kandidaat voor centrale `logError()` helper. |
| 3.10 | LOW | TODO_COMMENT | `src/assets/scss/config/_variables.scss:1457` | `// TODO: remove this in v6` — komt uit Bootstrap upstream, niet acuut. |
| 3.11 | LOW | DEAD_COMMENT | `src/hooks/useLocalStorage.ts:15, 42` | `// console.error(error)` uitgecommentarieerd — verwijder. |
| 3.12 | MEDIUM | UNUSED_IMPORT | `src/components/layout/VerticalNavigationBar/components/AppMenu.tsx:1-2` | `as any` × 2 cast op menu helpers (zie 4.7) — duidt op leftover-typing van template. |
| 3.13 | LOW | ORPHANED_NAVIGATION | `src/components/layout/TopNavigationBar/components/GlobalSearch.tsx` | Heeft 3 inline styles + onbenutte dropdown-classes (zoekresultaten worden buiten de dropdown getoond via routing). Verifiëren of search-bar dropdown wel werkt. |

---

## Domein 4 — Bugs

| # | Severity | Bevinding | Locatie | Reproduceerbaar via code review |
|---|---|---|---|---|
| 4.1 | CRITICAL | Audit Logs silent truncation (zie 2.1). Geen pagination state, gebruiker ziet `events.length` (max 100) als "totaal". Voor VP een **valse zekerheid**. | `audit-logs/page.tsx:57`, `audit-logs/hooks/useAuditLogs.ts:39` | Ja |
| 4.2 | HIGH | Notifications pagina mist role-guard / redirect; UI is toegankelijk voor alle ingelogde rollen. RLS beschermt data maar UI route is open. | `notifications/page.tsx:1-83` | Ja |
| 4.3 | HIGH | IncomingPost page: `useEffect` body is leeg (Protocol-comment, geen actie), maar `navigate` blijft in dep-array → ESLint zwijgt door legitimate-uitziende dep. Bedoeling onduidelijk: zou Protocol redirect moeten zijn? | `incoming-post/page.tsx:16-22` | Ja |
| 4.4 | MEDIUM | Settings SystemInfo "Last Login" toont `new Date().toISOString()` als approximatie wanneer sessie actief is — dit is dus altijd ~"nu", niet de werkelijke login-tijd. Mismatch met label. | `settings/page.tsx:42-45` | Ja |
| 4.5 | MEDIUM | `useTodayNotes` fetcht `limit(limit * 2)` notes en filtert client-side op today's appointments — bij groei van notes-volume verkeerde resultaten als matchende notes buiten de top `limit*2` vallen. | `dashboards/hooks/useTodayNotes.ts:26` | Ja |
| 4.6 | MEDIUM | EntityLinkSelector haalt clients/appointments/cases op met `.limit(100)` — search op tekstinput werkt alleen binnen die eerste 100 records. Bij >100 entries onvindbaar. | `notes/components/EntityLinkSelector.tsx:44,62,77` | Ja |
| 4.7 | MEDIUM | AppMenu.tsx gebruikt `as any` op nav-items — geen runtime validatie, mogelijk silent crash bij menu-mismatch. | `components/layout/VerticalNavigationBar/components/AppMenu.tsx` (2 occurrences) | Partial |
| 4.8 | MEDIUM | `useCaseTimeline` slikt audit-fetch errors stil via `console.warn` ("may be RLS blocked"). Een echte fout blijft daardoor onzichtbaar voor de gebruiker. | `cases/hooks/useCaseTimeline.ts:61` | Ja |
| 4.9 | LOW | Documents `handleView` / `handleDownload` falen stil bij ontbrekende `signedUrl` (alleen console.error). Geen toast/foutmelding. | `documents/page.tsx:38-71` | Ja |
| 4.10 | LOW | Audit log "(max 100)" tekst in CardHeader stelt gebruiker niet voldoende gerust over verbergen — copy moet uitleggen dat filtering nodig is voor oudere events. | `audit-logs/page.tsx:57` | Ja |
| 4.11 | LOW | Notes Edit route check: `note.content_format === 'json' ? 'json' : 'plain'` valt terug op 'plain' voor onbekende waarden — Tiptap HTML format is correct gemapt maar 'html' string-mismatch zou stilletjes naar plain renderen. | `notes/[id]/edit/page.tsx:143`, `notes/components/NoteDetail.tsx:130` | Partial |
| 4.12 | LOW | `useRecentClients.ts:13` selecteert recente clients zonder role-check; Protocol-user die ergens een dashboard-widget triggert ziet (via RLS) lege lijst, maar query draait wel. | `dashboards/hooks/useRecentClients.ts` | Ja |
| 4.13 | LOW | Filters in lijsten worden client-side toegepast (status, urgency, category in Incoming Post) — bij ontbrekende pagination werkt het correct, maar wordt onhoudbaar zodra 2.5 wordt geadresseerd. Filters moeten dan naar server-side. | Multiple list pages | Ja |
| 4.14 | LOW | `useAuthContext.tsx:44,50,93` — console.error voor role-fetch errors zonder UI-fallback bij mislukte rol-lookup; gebruiker komt in onbepaalde rol-staat. | `context/useAuthContext.tsx` | Partial |

---

## Domein 5 — Code Quality

| # | Severity | Bevinding | Locatie | Refactor complexiteit |
|---|---|---|---|---|
| 5.1 | MEDIUM | 9 list pages herhalen ~50 regels boilerplate (auth check, redirect, error-card, header met h5+subtitle+button, CardBody met tabel). Sterk kandidaat voor `<ListPageShell>` of HOC. | `appointments/page.tsx`, `cases/page.tsx`, `documents/page.tsx`, `clients/page.tsx`, `notes/page.tsx`, `incoming-post/page.tsx`, `notifications/page.tsx`, `audit-logs/page.tsx`, `users/page.tsx` | MEDIUM |
| 5.2 | MEDIUM | Role-redirect pattern `useEffect(() => { if (!authLoading && isProtocol(role)) navigate('/dashboards', { replace: true }) }, ...)` herhaald in 7 pagina's. Extract → `useRequireRole(rolePredicate, fallback)`. | Idem | LOW |
| 5.3 | MEDIUM | 43 occurrences van `style={{…}}` over 28 bestanden — botst met global frontend.md regel "no inline styles". Project gebruikt Bootstrap (geen Tailwind), maar inline styles voor maxWidth/maxHeight horen in SCSS/utility-classes. | Zie Grep-resultaten (Domein 5 file lijst) | MEDIUM |
| 5.4 | MEDIUM | `(data as Type[])` cast pattern in ~12 hooks omzeilt strikt Zod-validation. Global rule: "narrow with Zod before use". | `useAppointments.ts:43`, `useCases.ts:41`, `useNotes.ts:22`, etc. | MEDIUM |
| 5.5 | MEDIUM | Magic numbers: `.limit(100)` audit logs, `.limit(5)` dashboard widgets, `.limit(100)` selectors, `createSignedUrl(_, 3600)` documents, `maxWidth: '150px'` cards — geen constants module. | Across multiple files | LOW |
| 5.6 | LOW | `STATUS_BADGE_VARIANTS` en `PRIORITY_BADGE_VARIANTS` worden 2–3× gedefinieerd (RecentCases + CasesTable + CaseDetail). Centraliseer in `cases/constants.ts`. | `dashboards/components/RecentCases.tsx:7-19`, `cases/components/*` | LOW |
| 5.7 | LOW | `getNoteDisplayTitle` re-import in `NotesPage` + `NoteDetail` + `LinkedNotes` — type-helper acceptabel maar overweeg memoization voor lange lijsten. | `notes/*` | LOW |
| 5.8 | LOW | Hardcoded copy in NL/EN mix: "Showing X of Y", "Geen items", "Mark Read", "Opslaan" — overweeg i18n-laag (kan ook NA Phase 2). | Multiple components | MEDIUM (i18n setup) |
| 5.9 | LOW | `as any` × 2 in AppMenu.tsx — typing-leak. | `AppMenu.tsx` | LOW |
| 5.10 | LOW | `useEffect` cleanup ontbreekt in `usePushSubscription.ts` (subscription bestaat tijdens hook-life). | `hooks/usePushSubscription.ts` | LOW |
| 5.11 | LOW | `useMemo` met grote dep-array warning (LOW per TC-009) in `context/useLayoutContext.tsx` — accepted, niet veranderen zonder TC. | `context/*` | LOW |
| 5.12 | LOW | Geen central error-toast / notification systeem zichtbaar — elk module gooit ofwel een Card-error-state of console.error. | All hooks | MEDIUM |
| 5.13 | LOW | Geen unit/component tests aanwezig (Vitest/RTL). Voor Cabinet-grade systeem MEDIUM-risico in de toekomst. | repo-wide | HIGH (test infra setup) |
| 5.14 | LOW | Lange page-componenten: `documents/page.tsx` 180 regels, `cases/[id]/page.tsx` (niet ingezien, hoogstwaarschijnlijk groter). Overweeg splitsen onder de 200-regelgrens. | `documents/page.tsx` | LOW |

---

## Domein 6 — Settings Module

### Huidige structuur

`settings/page.tsx` rendert één `<Row className="g-4 mb-4">` met zes `<Col>` kaarten:

1. `ProfileCard` (Col lg=6) — alle rollen
2. `ThemeSettingsCard` (Col lg=6) — alle rollen
3. `SystemInfoCard` (Col lg=6) — alle rollen (VP ziet extra info)
4. `PushNotificationToggle` (Col lg=6) — VP/Secretary (Protocol internal-guard)
5. `NotificationPreferencesCard` (Col lg=6) — alle rollen (TC-011)
6. `EmailSettingsCard` (Col lg=12) — VP only (TC-006)

Op 1280×800 viewport (screenshot 11): pagina scrollt ~1100–1200 px. Op 1366×768 zelfs meer.

### Rol-zichtbaarheid samenvatting

| Sectie | VP | Secretary | Protocol |
|---|---|---|---|
| Profile | ✓ | ✓ | ✓ |
| Theme | ✓ | ✓ | ✓ |
| System Info | ✓ (extra Admin badge) | ✓ | ✓ |
| Push Toggle | ✓ | ✓ | hidden (internal) |
| Notification Preferences | ✓ | ✓ | ✓ |
| Email Settings (SMTP) | ✓ | ✗ | ✗ |

### Bestaande tab-component

Project gebruikt `react-bootstrap` — `Tabs` + `Tab` components zijn beschikbaar zonder extra dependency. Geen project-eigen tab-wrapper aanwezig; eerste invoer.

### Voorgestelde tab-structuur

| Tab volgorde | Naam | Inhoud | Rol-zichtbaarheid |
|---|---|---|---|
| 1 | **Profile** | ProfileCard | Alle rollen |
| 2 | **Appearance** | ThemeSettingsCard | Alle rollen |
| 3 | **Notifications** | PushNotificationToggle + NotificationPreferencesCard | Alle rollen (Protocol ziet alleen Preferences-card) |
| 4 | **System** | SystemInfoCard | Alle rollen |
| 5 | **Integrations** (VP-only label "Email SMTP") | EmailSettingsCard | VP only — tab is verborgen voor andere rollen |

Alternatief: 4 tabs door **Appearance** in Profile op te nemen. Voorkeur is 5 tabs voor duidelijke scheiding.

### Complexiteit

**LOW–MEDIUM.** Alle componenten zijn al modulair en stand-alone. Refactor scope:
- `settings/page.tsx` — vervang Row/Col met `<Tabs defaultActiveKey="profile">` + 5× `<Tab>`.
- Voeg `settings/components/SettingsTabs.tsx` toe (optioneel) om de logica te isoleren.
- Geen wijziging in de losse Card-componenten zelf.
- Persisteer actieve tab in URL hash (`#notifications`) voor deep linking — nice-to-have.
- Test op 3 rollen: VP ziet 5 tabs, Secretary 4, Protocol 4 (zonder Integrations + zonder Push toggle binnen Notifications-tab).

### Bestanden die aangepast moeten worden

- `src/app/(admin)/settings/page.tsx` (rewrite)
- `src/app/(admin)/settings/components/index.ts` (eventueel re-export SettingsTabs)
- (Optioneel) `src/app/(admin)/settings/components/SettingsTabs.tsx` (new)

### Risico op rolverlies

LOW — rol-checks blijven binnen `page.tsx` (`role === 'vp' && <Tab eventKey="integrations">…</Tab>`). De interne guards in PushNotificationToggle blijven werken.

---

## Domein 7 — Functie Testing (code review)

| Flow | Status | Locatie / observatie |
|---|---|---|
| Appointment aanmaken (Secretary) | **VERIFIED** | `appointments/hooks/useCreateAppointment.ts:29` → insert in `appointments`; redirect via mutation onSuccess in `appointments/create/page.tsx`; audit trigger op DB-level (frozen v1.0). |
| Appointment goedkeuren (VP) | **PARTIAL** | `useApproveAppointment.ts:15` → status update. Push-trigger via DB trigger op `appointments` row update (TC-010). Code review kan trigger niet bevestigen — vereist DB-zicht (Lane C / db-guard). |
| Case aanmaken vanuit Appointment | **VERIFIED** | `cases/hooks/useCreateCase.ts:38` → insert; case-number gegenereerd in helper boven query. `cases/create/page.tsx` koppelt `appointment_id`. |
| Document uploaden | **VERIFIED** | `documents/hooks/useUploadDocument.ts:24-53` → `supabase.storage.from('documents').upload(filePath)` + insert in `documents`; RLS-policy bekend uit migrations (frozen v1.1). |
| Note aanmaken met rich text | **VERIFIED** | `useCreateNote.ts:23` schrijft `content_format`. `NoteDetail.tsx:130` rendert via TiptapViewer als `content_format === 'json'`. Mismatch met 'html'-format niet voorzien (zie 4.11). |
| Push notificatie trigger | **VERIFIED** (infra) / **PARTIAL** (delivery) | TC-005 + TC-010 bevestigden Edge Function + vault URL. Geen code-pad om delivery te traceren (Domein "service-role secrets unverified" in CLAUDE.md known-issues). |
| Email notificatie trigger | **VERIFIED** | TC-006/006-A bevestigd. `EmailSettingsCard` invokes `email-test` function; trigger pad via DB trigger op appointment/case status. Preference check + CORS header live (TC-011). |
| Lock screen activatie | **NOT_VERIFIED** | Geen lock-screen route gevonden via path-glob in `src/app/(other)/auth/` (alleen sign-in/sign-up/reset-password aanwezig). Mogelijk niet geïmplementeerd of leeft elders. |
| Audit log entry | **PARTIAL** | UI leest `audit_events` (frozen v1.0 trigger). Document-specifieke audit hook (`useDocumentAudit`) schrijft client-side; consistent met audit-table design. Code review kan trigger-coverage per actie niet bevestigen zonder DB-inspectie. |
| Incoming Post archivering (immutability) | **PARTIAL** | `useUpdateIncomingPostStatus.ts:30` voert update uit. Immutability trigger zit op DB-niveau (frozen Priority 3-B). Code review bevestigt UI respecteert status; trigger-werking vereist DB-zicht. |

---

## Prioriteitsmatrix — Top 10 acties

| # | Actie | Severity × Impact | Domein |
|---|---|---|---|
| 1 | Audit Logs pagination + duidelijke "X of N events" UI (verwijder stille 100-cap) | CRITICAL × HIGH | 2.1 / 4.1 |
| 2 | Notifications pagina role-guard toevoegen (UI-redirect voor unauth role) | HIGH × MEDIUM | 4.2 |
| 3 | Pagination toevoegen aan Appointments, Cases, Documents, Incoming Post | HIGH × HIGH | 2.2–2.5 |
| 4 | Template dead code verwijderen: 5× (layouts)/* + `console.log('bvdfbgd')` | HIGH × LOW | 3.1–3.6 |
| 5 | UI artefact "+" placeholders verwijderen uit lijstpagina headers | HIGH × LOW | 1.3 |
| 6 | Settings tab-refactor (LOW–MEDIUM complexiteit, sterke UX-win) | MEDIUM × HIGH | 6 |
| 7 | IncomingPost `useEffect` lege body opruimen of Protocol redirect correct implementeren | HIGH × LOW | 4.3 |
| 8 | Extract `<ListPageShell>` + `useRequireRole` om duplicatie in 9 lijstpagina's te elimineren | MEDIUM × HIGH | 5.1, 5.2 |
| 9 | EntityLinkSelector "linked-to" zoek breidt uit naar server-side search (>100 entities) | MEDIUM × MEDIUM | 4.6 |
| 10 | "Last Login" in Settings: vervang `new Date()` approximatie door werkelijke session start uit auth-metadata | MEDIUM × LOW | 4.4 |

---

## Screenshots Verwerkt

| # | Bestand | Module | Status |
|---|---|---|---|
| 1 | `1.png` | Dashboard | VERWERKT |
| 2 | `2.png` | Guests lijst | VERWERKT |
| 3 | `3.png` | Appointments lijst | VERWERKT |
| 4 | `4.png` | Cases lijst (leeg) | VERWERKT |
| 5 | `5.png` | Documents lijst (leeg) | VERWERKT |
| 6 | `6.png` | Incoming Post lijst | VERWERKT |
| 7 | `7.png` | Notes lijst | VERWERKT |
| 8 | `8.png` | Audit Logs lijst | VERWERKT |
| 9 | `9.png` | Notifications lijst | VERWERKT |
| 10 | `10.png` | User Management | VERWERKT |
| 11 | `11.png` | Settings (full) | VERWERKT |

Alle 11 screenshots succesvol gelezen en gecorreleerd met source-code. Geen screenshots overgeslagen.

Detail-pagina's (appointment-detail, case-detail, incoming-post-detail, note-detail, document-detail) waren niet in de screenshot-set en zijn alleen via code-review beoordeeld. Aanbeveling: aparte screenshot-set voor detail-pagina's vóór Phase 2.

---

## Audit Trail

- **TC:** TC-015
- **Lane:** A (read-only audit; geen src/ wijzigingen)
- **Mode:** SAFE
- **Files written:** `Project Docs/v2.0/Claude-Code-Source-of-Truth-Audit.md` (deze)
- **Files read:** screenshots 1–11; alle list pages onder `src/app/(admin)/*`; primary hooks per module; routes config; `.claude/CLAUDE.md`; TC-015 contract
- **Codex rapport geraadpleegd:** NEE (vereist door TC — onafhankelijke audit)
- **Status:** DRAFT — awaiting Delroy review
