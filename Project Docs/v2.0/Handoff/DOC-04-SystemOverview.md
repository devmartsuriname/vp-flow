# Systeemoverzicht — VP-Flow

Versie: 2.0
Datum: 2026-05-15
Opgesteld door: Devmart Suriname

## 1. Wat is VP-Flow

VP-Flow is het interne systeem van het Kabinet van de Vice President van Suriname voor het beheer van afspraken, gasten, zaken, documenten, notities en inkomende correspondentie. Het systeem is ontworpen als systeem van vastlegging (system of record) voor de dagelijkse werkprocessen binnen het kabinet en levert een volledig auditeerbare administratie.

VP-Flow draait op een beveiligde infrastructuur, is uitsluitend toegankelijk voor geautoriseerde medewerkers, en kent een strikte scheiding van bevoegdheden tussen de Vice President, de Secretaris en het Protocol.

Applicatie-URL: https://vpflow.app

## 2. Rolmodel

VP-Flow kent drie rollen, elk met een eigen, op databaseniveau afgedwongen rechtenstructuur:

| Rol | Bevoegdheden |
|-----|-------------|
| Vice President (VP) | Volledige toegang. Goedkeuren en afwijzen van afspraken, statusbeheer van zaken (open, parkeer, hervat, sluit, heropen), volledige toegang tot documenten, notities (inclusief handschrift), inkomende post, audit log, gebruikersbeheer en e-mailconfiguratie. |
| Secretaris | Aanmaken en indienen van afspraken, beheer van gasten, registratie van inkomende post, lees- en uploadrechten op documenten en zaken. Geen toegang tot notities of audit log. |
| Protocol | Uitsluitend leesrechten op goedgekeurde afspraken en persoonlijke instellingen. Geen toegang tot zaken, documenten, notities of inkomende post. |

De rollen worden bewaard in een aparte databasetabel (user_roles) en gehandhaafd via Row Level Security in de database. UI-controles vormen een tweede laag bovenop deze beveiliging.

## 3. Hoofdmodules

| Module | Functie |
|--------|---------|
| Dashboard | Overzichtspagina met KPI-kaarten en recente activiteit. |
| Guests | Registratie en beheer van gastinformatie. |
| Appointments | Aanmaken, indienen, goedkeuren, afwijzen, voltooien en annuleren van afspraken. |
| Cases | Volledige zaak-administratie met statusverloop, koppelingen naar afspraken, documenten en notities. |
| Documents | Documentbibliotheek met koppelingen aan zaken, afspraken en gasten. Veilige downloadlinks en audit-registratie. |
| Notes | VP-persoonlijke notities met rich text-editor en handschriftcanvas. |
| Incoming Post | Registratie en verwerking van inkomende correspondentie, met onveranderlijk archief. |
| Notifications | In-app meldingen, met optionele push- en e-mailkanalen en per-gebruiker voorkeuren. |
| Users | Gebruikersbeheer (alleen toegankelijk voor VP en Secretaris). |
| Settings | Persoonlijke instellingen: profiel, thema, notificaties, systeeminfo en e-mailconfiguratie. |
| Audit Logs | Onveranderlijk logboek van alle relevante systeemgebeurtenissen (alleen toegankelijk voor de VP). |

## 4. Technische stack

VP-Flow is gebouwd op de volgende technische fundamenten:

- **Frontend**: React 18 met Vite, TypeScript, React Router, React Bootstrap en Tailwind. Rich text via Tiptap.
- **Backend**: Supabase (PostgreSQL met Row Level Security, Auth, Storage en Edge Functions).
- **Hosting**: Hostinger (statische bestanden via FTP-deployment).
- **Deployment**: GitHub Actions pipeline vanaf de hoofdvertakking.
- **Progressive Web App**: installeerbaar op desktop, iOS en Android. Offline-toegang is bewust beperkt tot lezen van de geladen app-shell; gegevensmodificatie offline is niet ondersteund.

## 5. Beveiligingsprincipes

- Rolopslag in aparte tabel om privilege-escalatie te voorkomen.
- Row Level Security op alle datatabellen.
- Onveranderlijke audit log voor alle gevoelige acties.
- Geheime sleutels (service role, VAPID, e-mailproviders) uitsluitend opgeslagen in beveiligde vault, nooit in code.
- Documenttoegang via tijdelijke, ondertekende URL's met audit-registratie.
- Onveranderlijkheid van gearchiveerde poststukken en gesloten zaken op databaseniveau.

## 6. Contactinformatie

VP-Flow is ontwikkeld en wordt onderhouden door Devmart Suriname.

- Leverancier: Devmart Suriname
- E-mail: devmartsuriname@gmail.com
- Applicatie-URL: https://vpflow.app
