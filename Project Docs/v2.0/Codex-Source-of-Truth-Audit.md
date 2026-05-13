# Codex CLI — Source of Truth Audit / VP-Flow v2.0

## Executive Summary
VP-Flow v2.0 is functioneel breed afgedekt en de belangrijkste governance-lagen zitten in de database: RLS, audit triggers, notificatie triggers en archive immutability zijn zichtbaar in migrations. De grootste productierisico's zitten niet in ontbrekende modules, maar in schaalbaarheid en consistentie: hoofdlist-queries halen bijna overal volledige tabellen op, terwijl filtering client-side gebeurt. UX-screenshots tonen een consistente Darkone-basis, maar ook veel lege verticale ruimte op lijstpagina's en een Settings-pagina die inmiddels te lang en gemengd is voor dagelijks beheer. De enige duidelijke contractbreuk in deze audit is Rich Text Notes: de TC-flow vraagt `content_format = 'html'`, terwijl code en migration `json` gebruiken.

## Severity Overzicht
| Severity | Aantal bevindingen |
|---|---:|
| CRITICAL | 1 |
| HIGH | 6 |
| MEDIUM | 20 |
| LOW | 14 |

## Domein 1 — UX Layout & Spacing
| Module | Severity | Locatie | Bevinding |
|---|---|---|---|
| Dashboard | MEDIUM | `src/app/(admin)/dashboards/page.tsx`, screenshot `1.png` | KPI-cards en dashboardwidgets zijn consistent, maar de pagina gebruikt grote verticale tussenruimte waardoor de footer bij 1280x768 pas na veel lege ruimte logisch voelt. |
| Guests | MEDIUM | `src/app/(admin)/clients/page.tsx`, `ClientsTable.tsx`, screenshot `2.png` | Lijst is helder, maar de card is bijna leeg bij weinig records; geen compacte density/pagination-area voor grotere datasets. |
| Appointments | MEDIUM | `AppointmentsTable.tsx`, screenshot `3.png` | Lange subjects wrappen over meerdere regels en vergroten rijen sterk; bij 20+ afspraken wordt de lijst snel zwaar. |
| Cases | LOW | `CasesTable.tsx`, screenshot `4.png` | Empty state is tekst-only in tabelrij; visueel minder sterk dan Documents/Dashboard empty states. |
| Documents | LOW | `documents/page.tsx`, screenshot `5.png` | Filterkaart en lege documentenkaart staan los van elkaar; bij lege staat ontstaat veel onbenutte verticale ruimte. |
| Incoming Post | MEDIUM | `IncomingPostTable.tsx`, screenshot `6.png` | Vier filters in één rij werken desktop-only goed; bij small/medium viewports is wrapping waarschijnlijk rommelig. |
| Notes | LOW | `NotesTable.tsx`, screenshot `7.png` | Ruime card/tabelpadding bij twee notities; acceptabel, maar minder compact dan een VP-werklijst zou mogen zijn. |
| Audit Logs | HIGH | `AuditLogsTable.tsx`, screenshot `8.png` | Audit log scherm toont 33 events in één lange tabel en heeft geen paginatie; screenshot is meer dan twee viewports hoog. |
| Notifications | MEDIUM | `NotificationsTable.tsx`, screenshot `9.png` | Ongelezen rows hebben grote hoogte en sterke achtergrondvlakken; scanbaarheid daalt bij veel notificaties. |
| User Management | LOW | `UsersTable.tsx`, screenshot `10.png` | Grote lege resthoogte bij weinig users; geen blocker. |
| Settings | HIGH | `settings/page.tsx`, screenshot `11.png` | Scroll-layout mengt profile, theme, system, push, preferences en email config; pagina is ongeveer 2 viewports hoog en vraagt tabs. |
| Auth pages | LOW | `src/app/(other)/auth/*`, style guide | Split-screen classes en logo swap zijn aanwezig; geen screenshot geleverd voor auth, dus beoordeling is code-only. |

## Domein 2 — Pagination
| Lijst | Huidige staat | Query limit/range | Productie-inschatting | Aanbeveling | Severity |
|---|---|---|---:|---|---|
| Guests | NONE | Geen `.limit()`/`.range()` in `useClients.ts` | 500-5.000 | PAGINATION_NEEDED | MEDIUM |
| Appointments | NONE | Geen `.limit()`/`.range()` in `useAppointments.ts` | 1.000-20.000 | PAGINATION_NEEDED | HIGH |
| Cases | NONE | Geen `.limit()`/`.range()` in `useCases.ts` | 500-10.000 | PAGINATION_NEEDED | HIGH |
| Documents | NONE | Geen `.limit()`/`.range()` in `useDocuments.ts` | 1.000-50.000 | PAGINATION_NEEDED | HIGH |
| Notes | NONE | Geen `.limit()`/`.range()` in `useNotes.ts` | 500-10.000 | PAGINATION_NEEDED | MEDIUM |
| Incoming Post | NONE | Geen `.limit()`/`.range()` in `useIncomingPosts.ts` | 1.000-20.000 | PAGINATION_NEEDED | HIGH |
| Audit Logs | PARTIAL | `.limit(100)` in `useAuditLogs.ts`, geen pagina-offset | 10.000+ | PAGINATION_NEEDED | HIGH |
| Notifications pagina | NONE | Geen `.limit()`/`.range()` in `useNotifications.ts` | 1.000-100.000 per gebruiker | PAGINATION_NEEDED | HIGH |
| Notifications dropdown | PARTIAL UI-only | Zelfde unbounded hook, daarna `slice(0, 5)` in topbar | 1.000-100.000 | PAGINATION_NEEDED | HIGH |
| User Management | NONE | Geen `.limit()`/`.range()` in `useUsers.ts` | 10-500 | ACCEPTABLE voorlopig | LOW |
| Dashboard recente widgets | COMPLETE | `.limit(limit)` in dashboard hooks | 5-10 zichtbaar | ACCEPTABLE | LOW |
| Global Search | COMPLETE | `.limit(MAX_RESULTS_PER_CATEGORY)` | 5 per categorie | ACCEPTABLE | LOW |

## Domein 3 — Dead Code
| Type | Severity | Locatie | Bevinding |
|---|---|---|---|
| DEBUG_LOG | LOW | `src/app/(admin)/(layouts)/dark-mode/components/DarkMode.tsx:8` | `console.log('bvdfbgd', changeTheme)` staat in productiecode. |
| DEAD_FILE | MEDIUM | `src/app/(admin)/(layouts)/dark-mode/components/DarkMode.tsx` | Layout demo-route/component is niet gerouteerd of geïmporteerd. |
| DEAD_FILE | MEDIUM | `src/app/(admin)/(layouts)/dark-sidenav/components/DarkSideNav.tsx` | Template/demo component lijkt niet bereikbaar. |
| DEAD_FILE | MEDIUM | `src/app/(admin)/(layouts)/small-sidenav/components/SmallSideNav.tsx` | Template/demo component lijkt niet bereikbaar. |
| DEAD_FILE | MEDIUM | `src/app/(admin)/(layouts)/hidden-sidenav/components/HiddenSideNav.tsx` | Template/demo component lijkt niet bereikbaar. |
| DEAD_FILE | MEDIUM | `src/app/(admin)/(layouts)/dark-topnav/components/DarkTopNav.tsx` | Template/demo component lijkt niet bereikbaar. |
| DEAD_FILE | MEDIUM | `src/components/ThemeCustomizer.tsx` | Context heeft state voor theme customizer, maar component wordt niet geïmporteerd/rendered. |
| DEAD_FILE | LOW | `src/components/ComponentContainerCard.tsx` | Template helper zonder gevonden import. |
| DEAD_FILE | LOW | `src/components/CustomFlatpickr.tsx` | Niet gebruikt; forms importeren `react-flatpickr` direct. |
| DEAD_FILE | LOW | `src/hooks/useModal.ts`, `src/hooks/useFileUploader.ts` | Geen gevonden imports in huidige app-code. |
| TODO_COMMENT | LOW | `src/assets/scss/config/_variables.scss:1457` | Upstream Bootstrap TODO in vendored/template SCSS, lage prioriteit. |
| DEBUG_LOG | LOW | Diverse `console.error` in hooks/components | Error logging is bewust nuttig, maar productiebeleid kan centralisatie vragen. Niet gelijk aan blocker. |

## Domein 4 — Bugs
| Severity | Locatie | Reproduceerbaar via code review | Bevinding |
|---|---|---|---|
| CRITICAL | `src/app/(admin)/notes/types.ts`, `NoteForm.tsx`, `TiptapEditor.tsx`, `20260512120000_notes_content_format.sql` | Ja | TC-015 flow vraagt rich text met `content_format = 'html'`; implementatie en DB-check gebruiken `plain/json`. Als downstream rapportage/renderer HTML verwacht, breekt deze flow. |
| HIGH | `VerticalNavigationBar/page.tsx`, `menu-items.ts` | Ja | Protocol ziet menu-items voor Guests, Cases, Documents, Incoming Post, User Management en Settings, terwijl meerdere pagina's daarna redirect/null tonen. UI toont dus acties die voor die rol niet horen. |
| MEDIUM | `AppointmentsTable.tsx:157` | Ja | Secretary kan eigen draft-afspraken submitten via detail-actions, maar lijst toont geen edit-knop voor Secretary; dit is een workflow-frictie/zichtbaarheidsbug. |
| MEDIUM | `IncomingPostForm.tsx` | Ja | Form gebruikt alleen native `required` + silent return; geen zichtbare foutmelding als verplichte velden leeg zijn. |
| MEDIUM | `useUpdateIncomingPostStatus.ts:18-34` | Ja | `updateData as never` omzeilt typecontrole; beter typed update payload. |
| MEDIUM | `CaseForm.tsx` en `useCreateCase.ts` | Ja | Case number wordt client-side/random gegenereerd (`Math.random`); bij schaal is collision mogelijk zonder zichtbare retry. |
| MEDIUM | `GlobalSearch.tsx`, `Notifications.tsx` | Ja | `navigate(notification.link)` en search `Link` vertrouwen database/query-links zonder route-validatie. |
| LOW | `routes/index.tsx` comments vs `settings/page.tsx` | Ja | Comment zegt "Protocol redirected"; code en governance laten Protocol Settings zien. Stale comment kan toekomstige regressies veroorzaken. |
| LOW | `usePushSubscription.ts`, Edge Functions | Ja | Veel non-null env assumptions in Edge Functions (`Deno.env.get(...)!`); sommige worden later gevalideerd, Supabase URL/service key niet. |
| LOW | Async detail pages | Ja | Loading states zijn meestal aanwezig; error states bestaan niet overal even expliciet, maar global `ErrorBoundary` vangt render errors. |

## Domein 5 — Code Quality
| Severity | Locatie | Refactor complexiteit | Bevinding |
|---|---|---|---|
| HIGH | Alle hoofdlist-hooks + table components | MEDIUM | Server-side pagination ontbreekt; filtering gebeurt client-side na volledige fetch. |
| MEDIUM | `ClientsTable`, `AppointmentsTable`, `CasesTable`, `IncomingPostTable` | MEDIUM | Zoek/filter/tabel/empty-state patronen dupliceren >10 regels per module. |
| MEDIUM | `DocumentsTable`, `LinkedDocuments` | MEDIUM | Document actiemenu/status/upload logic overlapt; `LinkedDocuments.tsx` is 347 regels. |
| MEDIUM | `GlobalSearch.tsx`, `Notifications.tsx`, audit modal, detail components | LOW | Veel inline styles (`style={{ ... }}`) voor widths, z-index, max heights en white-space. |
| MEDIUM | `settings/page.tsx` | MEDIUM | Secties zijn hardcoded in één scroll-grid; tabconfig ontbreekt. |
| MEDIUM | `useUsers.ts` | LOW | User query haalt profielen en rollen apart op zonder limit; voor kleine datasets ok, maar pattern schaalt matig. |
| MEDIUM | `useEffect` in layout demo components | LOW | Demo components missen dependencies (`changeTheme`) en bevatten navigatie side effects; vooral relevant als deze ooit gerouteerd worden. |
| LOW | Hardcoded UI strings | MEDIUM | Labels/toasts staan verspreid in components; constants bestaan per module maar niet consequent. |
| LOW | Magic numbers | LOW | `limit(100)`, `3600`, `60`, inline widths `120/150/200/320/400`, notification max heights `280/350` zonder centrale tokens. |
| LOW | Props drilling | LOW | `userRole` wordt door pagina naar detail/table naar child-actions doorgegeven; acceptabel, maar consistent role-capability helpers zouden schoner zijn. |

## Domein 6 — Settings Module
Huidige secties in `src/app/(admin)/settings/page.tsx`: Profile Information, Theme Preferences, System Information, Push Notifications, Notification Preferences, Email Notifications. Screenshot `11.png` toont ongeveer twee schermhoogtes: de eerste viewport bevat profile/theme/system/push/preferences, en de emailconfig valt grotendeels onder de fold.

Rol-zichtbaarheid: Profile, Theme, System Info en Notification Preferences zijn zichtbaar voor alle rollen. PushNotificationToggle rendert intern niets voor Protocol. EmailSettingsCard is alleen `role === 'vp'`. SystemInfoCard toont VP-extra info bij VP.

Bestaand tab component: ja, `react-bootstrap` `Tab`/`Nav` wordt al gebruikt in `src/app/(admin)/clients/components/ClientDetail.tsx`. Ook `@radix-ui/react-tabs` staat in dependencies, maar er is geen bestaand Radix tabs-patroon in app-code.

Voorgestelde tabstructuur:
| Tab | Secties | Rollen |
|---|---|---|
| Profile | Profile Information | VP, Secretary, Protocol |
| Appearance | Theme Preferences | VP, Secretary, Protocol |
| Notifications | Push Notifications, Notification Preferences | VP, Secretary; Protocol zonder Push toggle of met alleen Preferences |
| Email | Email Notifications | VP |
| System | System Information | VP, Secretary, Protocol; VP extra details |

Refactor complexiteit: MEDIUM. Te wijzigen bestanden: `settings/page.tsx` primair; mogelijk kleine exports/styles in `settings/components/index.ts` en SCSS als tabs extra spacing nodig hebben. Grootste risico is rol-zichtbaarheid: Email mag VP-only blijven, Push mag Protocol niet alsnog activeren, SystemInfo moet VP-extra details behouden.

## Domein 7 — Functie Testing
| Flow | Status | Locatie | Code-review oordeel |
|---|---|---|---|
| Appointment aanmaken → insert → audit log | VERIFIED | `appointments/create/page.tsx`, `useCreateAppointment.ts`, `20260110073409...sql` | Form submit insert redirectt naar detail; audit insert trigger op appointments bestaat. |
| Appointment goedkeuren → notificatie → audit log | VERIFIED | `useApproveAppointment.ts`, `20260125220040...sql`, `20260325104712...sql`, `20260512090100...sql` | Status update naar approved; notification triggers en audit update trigger zijn aanwezig. |
| Case aanmaken vanuit Appointment → link correct | PARTIAL | `CaseForm.tsx`, `useCreateCase.ts` | `appointment_id` wordt opgeslagen; er is geen zichtbare terugkoppeling naar een `case_id` op appointment. |
| Document uploaden → storage + RLS | VERIFIED | `useUploadDocument.ts`, `20260122022652...sql`, document RLS migrations | Storage upload naar `documents` bucket + metadata insert + cleanup bij insert-fout; RLS/policies aanwezig. |
| Note met rich text → content_format = 'html' | BROKEN | `NoteForm.tsx`, `TiptapEditor.tsx`, `20260512120000_notes_content_format.sql` | Implementatie slaat Tiptap JSON op met `content_format = 'json'`, niet `html`. |
| Push notificatie trigger → Edge Function | VERIFIED | `20260325104712...sql`, `20260512100000...sql`, `send-push-notification/index.ts` | DB trigger post naar Edge Function met service-role + `x-trigger-source`; preference check aanwezig. |
| Email notificatie → preference check → CORS | VERIFIED | `20260512090100...sql`, `send-email-notification/index.ts` | OPTIONS/CORS aanwezig; trigger/test auth split en `notification_preferences.email_enabled` check aanwezig. |
| Lock screen → session preserved | PARTIAL | `auth/lock-screen/components/LockScreen.tsx`, auth context | Lock screen route bestaat; code-review bevestigt geen expliciete signOut, maar volledige session-preserve UX is zonder live run niet bewezen. |
| Audit log → elke kritieke actie | PARTIAL | audit migrations, `useDocumentAudit.ts` | Appointments/cases/documents/notes/incoming_post/notificaties hebben triggers; sommige handmatige document view/download audit inserts zijn best-effort en loggen fouten alleen. |
| Incoming Post archivering → immutability trigger | VERIFIED | `20260325005103...sql`, `useUpdateIncomingPostStatus.ts` | `prevent_archived_incoming_post_update` trigger en archived RLS/update policy zijn aanwezig. |

## Prioriteitsmatrix
| Rank | Severity | Impact | Actie |
|---:|---|---|---|
| 1 | CRITICAL | Hoog | Beslis en herstel rich text contract: `html` volgens TC-015 of documenteer formeel `json` als nieuwe source of truth. |
| 2 | HIGH | Hoog | Voeg server-side pagination/range toe aan Appointments, Cases, Documents, Incoming Post, Notifications en Guests. |
| 3 | HIGH | Hoog | Vervang Notifications dropdown fetch-all + `slice(0, 5)` door querylimit. |
| 4 | HIGH | Hoog | Maak Audit Logs echte paginering met offset/cursor in plaats van alleen `.limit(100)`. |
| 5 | HIGH | Middel | Filter sidebar menu per rol volledig, niet alleen Notes/Audit Logs. |
| 6 | HIGH | Middel | Refactor Settings naar tabs met rol-afhankelijke tabconfig. |
| 7 | MEDIUM | Middel | Maak Secretary edit/submit workflow voor eigen drafts zichtbaar vanuit Appointments lijst. |
| 8 | MEDIUM | Middel | Centraliseer list search/filter/table/empty-state patronen. |
| 9 | MEDIUM | Middel | Verplaats inline styles/magic dimensions naar SCSS utilities of module constants. |
| 10 | MEDIUM | Laag | Ruim Darkone demo layout components en productie `console.log` op. |

## Screenshots Verwerkt
Alle PNG-bestanden in `C:\Users\delro\OneDrive\Documents\VP Flow Take Over\Polish Screenshot\` konden worden geopend en visueel verwerkt.

| Bestand | Verwerkt | Herkende context |
|---|---|---|
| `1.png` | Ja | Dashboard |
| `2.png` | Ja | Guests |
| `3.png` | Ja | Appointments |
| `4.png` | Ja | Cases |
| `5.png` | Ja | Documents |
| `6.png` | Ja | Incoming Post |
| `7.png` | Ja | Notes |
| `8.png` | Ja | Audit Logs |
| `9.png` | Ja | Notifications |
| `10.png` | Ja | User Management |
| `11.png` | Ja | Settings |

Niet verwerkt: geen. Auth-page screenshots waren niet aanwezig in de folder; auth is daarom code-only beoordeeld.
