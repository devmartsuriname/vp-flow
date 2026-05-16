# Release Notes — VP-Flow v2.0

Versie: 2.0
Datum: 2026-05-15
Opgesteld door: Devmart Suriname

## Overzicht

VP-Flow v2.0 markeert de productiegereedmaking van het systeem na de afronding van de v1.x-baseline. Deze release bundelt de notificatie-infrastructuur (push en e-mail), per-gebruikersvoorkeuren, rich-text-notities, het definitieve merk- en logobeeld, en een reeks gerichte verbeteringen op pagina-indeling, paginering en routering. Alle wijzigingen zijn doorgevoerd onder Devmart Guardian Rules v2.1 met een goedgekeurd Task Contract per onderdeel.

Applicatie-URL: https://vpflow.app

## Nieuwe functies en verbeteringen in v2.0

### Notificaties
- Push-notificaties via Web Push (TC-005). Service worker `sw-push.js`, Edge Function `send-push-notification`, VAPID-sleutels in de Supabase Vault.
- E-mailnotificaties via Edge Function `send-email-notification` (TC-006, TC-006-A). CORS-configuratie en gescheiden test- en triggerpaden.
- Per-gebruiker voorkeuren voor push en e-mail (TC-011). Beheer via Instellingen → Notificaties. Opt-out-model: ontbrekende rij betekent beide kanalen actief.
- Trigger-URL's worden uit de Supabase Vault gelezen (TC-010), niet hard-coded.

### Notities
- Rich-text-editor op basis van Tiptap (TC-012). Migratie `notes.content_format` toegevoegd. Editor- en viewer-componenten geïntegreerd.
- Handschriftnotities blijven beschikbaar als VP-only functionaliteit binnen de notitie-detailweergave.

### Merk en huisstijl
- Definitief logo "Authority Gate" (TC-014) doorgevoerd op alle plaatsen, inclusief authenticatiepagina's.
- PWA-iconen in de paarse merkkleur, themakleur `#7e67fe`, copyright-voettekst geactualiseerd.
- Officiële design style guide geïntroduceerd voor consistente kleuren, typografie en componenten.

### Pagina-indeling en navigatie
- Server-side paginering op alle lijstweergaven (TC-017), met paginagrootte van twintig regels. Notificatiedropdown beperkt tot vijf meest recente items.
- Routingsbug rondom `/notes` en `/audit-logs` opgelost: rolresolutie wordt afgewacht voordat de toegangscontrole loopt, waardoor onterechte doorverwijzingen naar `/dashboards` zijn vervallen.
- Vijf-tab indeling voor Instellingen (TC-018): Profiel, Weergave, Notificaties, Systeem, E-mail Config. Het tabblad E-mail Config is verborgen voor de Protocol-rol. De push-toggle is geconsolideerd binnen Notificaties. Het versienummer wordt dynamisch uit `APP_INFO.version` getoond.

### Code- en kwaliteitsbeheer
- Verwijdering van overbodige templatecomponenten en dode lay-outdirectories (TC-016). AdminLayout-voettekst gecorrigeerd.
- Lint-baseline naar nul fouten teruggebracht (TC-007).
- LinkedNotes rules-of-hooks-overtreding opgelost (TC-008).
- Globale zoek koppelt correct naar `/clients/:id` (TC-002).
- Settings-toegang voor de Protocol-rol gecorrigeerd (TC-001).

### Infrastructuur en deployment
- GitHub Actions deploymentpipeline naar Hostinger geactiveerd, met FTP-upload van de `dist/`-map naar `/public_html/`.
- `npm ci --legacy-peer-deps` voor stabiele installatie in CI.
- `.env`-bestand uit Git-historie verwijderd en in `.gitignore` opgenomen.

## Bekende beperkingen

- Achtergrondsynchronisatie en offline schrijven zijn bewust niet ondersteund. Offline-toegang via de PWA is alleen-lezen op de reeds geladen pagina.
- Service-role push-aflevering en CORS in productie staan momenteel ingesteld op de standaard configuratie. Verdere verharding is voorzien in een afzonderlijk Task Contract.
- Acceptatie van twaalf lint-waarschuwingen in `src/context/` en hooks (TC-009): structureel akkoord, geen functionele impact.

## Uitgesteld naar Phase 2

De volgende functies zijn geïdentificeerd in scope v2.0 maar zijn uitgesteld naar Phase 2:

- Device-first UX-verbeteringen.
- Documenttemplates.
- Categorie-filtering binnen meerdere lijstweergaven.
- Limiet op aantal heropeningen per zaak (Reopen Count Limits).

## Permanent uitgesloten functies

De volgende onderwerpen blijven definitief buiten scope van VP-Flow:

- Achtergrondsynchronisatie en offline-schrijftoegang.
- Publieke of externe portalen.
- Multi-tenant architectuur.
- Externe agenda-integratie.
- OCR en tekstextractie.
- AI- of ML-besluitvorming binnen de applicatie.
- Chat- of berichtenfunctionaliteit.
- Handtekeningverificatie.

## Ondersteuning

Voor functionele of technische ondersteuning kan contact worden opgenomen met Devmart Suriname.

- E-mail: devmartsuriname@gmail.com
- Applicatie-URL: https://vpflow.app
