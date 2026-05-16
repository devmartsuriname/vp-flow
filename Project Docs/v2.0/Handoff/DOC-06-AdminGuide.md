# Beheerdershandleiding — VP-Flow

Versie: 2.0
Datum: 2026-05-15
Opgesteld door: Devmart Suriname

## Inleiding

Deze handleiding is bestemd voor de beheerder van VP-Flow binnen het Kabinet van de Vice President en voor het technische team dat verantwoordelijk is voor het onderhoud van de infrastructuur. De handleiding beschrijft gebruikersbeheer, rolbeheer, toegang tot Supabase en Hostinger, deploymentbewaking en het beheer van geheimen. Werkzaamheden die de bevroren onderdelen van het systeem raken, mogen uitsluitend door Devmart worden uitgevoerd.

Applicatie-URL: https://vpflow.app

## 1. Gebruikersbeheer

De module "User Management" toont alle systeemgebruikers. Aanmaken, rol toewijzen en deactiveren is voorbehouden aan de Vice President. De Secretaris ziet dezelfde lijst maar uitsluitend met leesrechten en zonder rolbadges van anderen. De Protocol-rol heeft geen toegang tot deze module.

### Nieuwe gebruiker aanmaken

1. De VP maakt een nieuwe gebruiker aan via het Supabase-dashboard (Auth → Users) of via de in-app procedure indien beschikbaar.
2. Aan de aangemaakte gebruiker wordt een rol toegekend in de tabel `user_roles` (waarden: `vp`, `secretary`, `protocol`).
3. De gebruiker ontvangt zijn of haar inloggegevens en kan het wachtwoord bij eerste login wijzigen.

### Rol wijzigen of intrekken

Rolwijzigingen worden uitsluitend uitgevoerd via de tabel `user_roles`. Het verwijderen van een rolregel onttrekt de gebruiker direct alle rechten binnen VP-Flow. Wijzigingen worden vastgelegd in de audit log.

## 2. Rollen en rechten

| Rol | Rechten |
|-----|---------|
| VP | Volledige toegang. Goedkeuren en afwijzen van afspraken, statusbeheer van zaken, beheer van notities, audit log, e-mailconfiguratie, gebruikersbeheer. |
| Secretaris | Aanmaken van afspraken (concept en indienen ter goedkeuring), beheer van gasten, registratie van inkomende post, lees- en uploadtoegang tot documenten en zaken. Geen notities of audit log. |
| Protocol | Uitsluitend leesrechten op goedgekeurde afspraken en eigen instellingen. |

Het rolmodel is bevroren en mag niet worden aangepast zonder goedgekeurd Task Contract.

## 3. Supabase-dashboard

Toegang tot het Supabase-dashboard is voorbehouden aan Devmart en de aangewezen technische beheerder. Het dashboard bevat:

- **Database**: tabellen, RLS-policies, migraties en SQL-editor.
- **Auth**: gebruikersbeheer, e-mailtemplates, sessieconfiguratie.
- **Storage**: bucket `documents` met privé-toegang.
- **Edge Functions**: `send-push-notification` en `send-email-notification`.
- **Vault**: opslag van geheime sleutels.
- **Logs**: queries, Auth-events, Edge Function-logs.

### Wat te beheren

- Aanmaken van auth-gebruikers en bijbehorende rollen.
- Inzicht in fouten via de log-secties.
- Beheer van e-mailtemplates (uitnodiging, wachtwoord-reset).
- Vault-beheer in samenwerking met Devmart.

### Wat niet aan te raken zonder Devmart

- RLS-policies op bevroren tabellen (guests, appointments, cases, documents, notes, incoming_post, audit_logs, notifications, user_roles).
- Audit-triggers en -tabellen.
- Bestaande migratiebestanden (uitsluitend additieve migraties toegestaan).
- `app_role`-enum en gerelateerde functies.
- Edge Functions configuratie en deployments.

## 4. Hostinger hPanel

De productieapplicatie wordt geserveerd vanaf Hostinger. In hPanel zijn onder meer beschikbaar:

- **Bestandsbeheer**: inhoud van `/public_html/` (statische builduitvoer).
- **FTP-accounts**: aanmelding voor GitHub Actions FTP-deployment.
- **Domeinen**: configuratie voor `vpflow.app`.
- **SSL-certificaat**: HTTPS-instelling voor `vpflow.app`.

Wijzigingen in `/public_html/` worden in de regel uitsluitend doorgevoerd door de geautomatiseerde deployment. Handmatige bestandswijziging via hPanel of FTP wordt afgeraden.

## 5. GitHub Actions

De CI/CD-pijplijn is gedefinieerd in `.github/workflows/deploy.yml`. Bij elke push naar de hoofdvertakking `main` wordt de productie-build gegenereerd en geüpload via FTP.

### Bewaken

1. Open de GitHub-repository.
2. Klik op het tabblad "Actions".
3. Controleer de status van de meest recente run.

### Opnieuw uitvoeren bij fout

Indien een run faalt, kan deze worden heruitgevoerd via de knop "Re-run jobs" in de GitHub Actions-interface. Bij herhaalde fout dient de logregel te worden geraadpleegd en eventueel overlegd met Devmart.

## 6. Geheimen

| Locatie | Geheim |
|---------|--------|
| GitHub Secrets | `FTP_USERNAME`, `FTP_PASSWORD`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| Supabase Vault | `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_PROJECT_URL`, `VAPID_PRIVATE_KEY`, `VAPID_PUBLIC_KEY`, e-mailprovider-sleutels |

Geheimen worden nooit in de broncode of in `.env`-bestanden van de repository opgeslagen. Toegang tot de Vault is voorbehouden aan Devmart en de aangewezen beheerder.

## 7. Niet wijzigen zonder Devmart

De volgende onderdelen zijn bevroren en mogen uitsluitend door Devmart worden aangepast op basis van een goedgekeurd Task Contract:

- Het rolmodel (`app_role`-enum, `user_roles`-tabel, helperfuncties).
- Alle RLS-policies op bevroren tabellen.
- Audit-triggers, audit-tabel en audit-functies.
- Trigger voor onveranderlijkheid van gearchiveerde poststukken.
- Validatie voor heropening van gesloten zaken.
- Bestaande migratiebestanden (uitsluitend nieuwe additieve migraties).
- Authenticatieconfiguratie en sessiebeheer.
- Configuratie van Edge Functions en CORS.

## 8. Verboden activiteiten

De volgende handelingen zijn permanent niet toegestaan binnen VP-Flow:

- Achtergrondsynchronisatie of offline schrijven.
- Externe of publieksgerichte portalen.
- Multi-tenant uitbreiding.
- Koppeling met externe agendasystemen.
- OCR of tekstextractie van documenten.
- AI- of machine-learning-besluitvorming binnen de applicatie.
- Chat- of berichtenfunctionaliteit.
- Handtekeningverificatie.

## 9. Ondersteuning

Voor functionele of technische ondersteuning kan contact worden opgenomen met Devmart Suriname.

- E-mail: devmartsuriname@gmail.com
- Applicatie-URL: https://vpflow.app
