# Gebruikershandleiding — Vice President

Versie: 2.0
Datum: 2026-05-15
Opgesteld door: Devmart Suriname

## Inleiding

VP-Flow is het interne systeem van het Kabinet van de Vice President van Suriname voor het beheer van afspraken, zaken, documenten, notities en inkomende post. Deze handleiding beschrijft de functionaliteiten zoals beschikbaar voor de rol Vice President (VP). De VP heeft volledige toegang tot alle modules en is de enige rol die afspraken kan goedkeuren of afwijzen, zaken kan sluiten of heropenen, en de audit log kan inzien.

De applicatie is bereikbaar via https://vpflow.app. Het systeem is geïnstalleerd als progressive web app (PWA) en kan zowel via de browser als geïnstalleerd op desktop, iOS en Android worden gebruikt.

## 1. Inloggen en wachtwoord vergeten

### Inloggen

1. Open https://vpflow.app in een browser of via de geïnstalleerde app.
2. Voer het e-mailadres en wachtwoord in op het inlogscherm.
3. Klik op "Sign In".

Na succesvolle authenticatie wordt de gebruiker doorgestuurd naar het Dashboard. Indien u rechtstreeks naar een interne pagina navigeert zonder ingelogd te zijn, wordt u eerst naar het inlogscherm geleid en daarna teruggebracht naar de oorspronkelijke pagina.

### Wachtwoord vergeten

Bij verlies van het wachtwoord kan via de optie "Reset Password" een herstellink worden aangevraagd. Deze link wordt naar het geregistreerde e-mailadres verzonden. Na het volgen van de link kan een nieuw wachtwoord worden ingesteld.

## 2. Dashboard

Het Dashboard is de startpagina voor de VP en toont:

- KPI-kaarten met actuele kerncijfers (afspraken, zaken, gasten).
- Recente afspraken.
- Recente zaken.
- Recente notities.
- Notities van vandaag.

De widgets bieden een directe doorklikmogelijkheid naar de onderliggende modules.

## 3. Afspraken

### Aanmaken

1. Navigeer naar "Appointments" in het zijmenu.
2. Klik op "Create Appointment".
3. Vul de afspraakgegevens in (gast, datum, tijd, doel, locatie).
4. Sla op als concept ("draft") of dien direct in ter goedkeuring.

### Goedkeuren of afwijzen

Afspraken met status "pending_vp" kunnen door de VP worden behandeld:

- **Approve**: de afspraak wordt goedgekeurd en zichtbaar voor de rol Protocol.
- **Reject**: de afspraak wordt afgewezen met opgaaf van reden.

### Wijzigen en beheren

De VP kan goedgekeurde of opnieuw geplande afspraken alsnog wijzigen, annuleren of als voltooid markeren. Voor afgewezen, geannuleerde of voltooide afspraken zijn geen wijzigingen meer mogelijk.

### Bekijken

Het overzicht van alle afspraken is paginagewijs beschikbaar (twintig regels per pagina). Filtering op status en datum is mogelijk. Een klik op een regel opent de detailweergave.

## 4. Zaken

### Aanmaken

1. Navigeer naar "Cases" in het zijmenu.
2. Klik op "Create Case".
3. Vul titel, beschrijving en optioneel een gekoppelde afspraak en categorie in.
4. Sla op. De zaak ontstaat in status "draft".

### Statusbeheer

Zaken doorlopen de volgende statussen, allemaal beheerd door de VP:

- **Open Case**: een conceptzaak wordt geopend.
- **Start Work**: een geopende of heropende zaak wordt actief in behandeling.
- **Park**: een actieve of geopende zaak wordt tijdelijk geparkeerd.
- **Resume**: een geparkeerde zaak wordt hervat.
- **Close Case**: de zaak wordt afgesloten.
- **Re-open Case**: een afgesloten zaak wordt heropend (met audit-registratie).

### Bekijken

Het zakenoverzicht is paginagewijs beschikbaar. In de detailweergave zijn de volledige tijdlijn, gekoppelde documenten en notities zichtbaar.

## 5. Documenten

### Uploaden

Documenten worden gekoppeld aan een entiteit (zaak, afspraak of gast). Uploaden gebeurt vanuit de detailweergave van de betreffende entiteit via de sectie "Linked Documents".

### Bekijken en downloaden

Vanuit "Documents" in het zijmenu kunnen alle documenten worden gefilterd op type. Een document kan worden bekeken in een nieuw tabblad of gedownload. Beide acties worden vastgelegd in de audit log.

### Deactiveren (archiveren)

Een document kan worden gedeactiveerd. Het bestand blijft bewaard maar verdwijnt uit de actieve lijst. Deactivatie wordt vastgelegd in de audit log.

## 6. Notities

De notitiemodule is uitsluitend toegankelijk voor de VP. Notities zijn persoonlijk.

### Aanmaken met rich text

1. Navigeer naar "Notes" in het zijmenu.
2. Klik op "New Note".
3. Voer titel en inhoud in. De editor (Tiptap) ondersteunt vet, cursief, opsommingen, koppen en lijsten.
4. Optioneel: koppel de notitie aan een afspraak, zaak of gast.
5. Sla op.

### Handschriftnotities

Binnen een notitie kan een handschriftcanvas worden gebruikt. Met de muis, touchpad of een pen kan handgeschreven inhoud worden vastgelegd. Deze functie is uitsluitend beschikbaar voor de VP-rol. Handschriftnotities worden samen met de tekstnotitie bewaard.

### Bewerken en verwijderen

Bestaande notities kunnen worden bewerkt of verwijderd via de overzichtspagina of de detailweergave.

## 7. Binnenkomende post

### Bekijken

Het overzicht van inkomende correspondentie is paginagewijs beschikbaar. Voor elke post worden onderwerp, referentienummer, urgentie en status getoond.

### Verwerken

De VP kan poststukken doorzetten in de statusketen, inclusief acties die uitsluitend voor de VP zijn voorbehouden (zoals afsluiting van bepaalde categorieën). De Secretaris kan een beperktere set acties uitvoeren.

### Archiveren

Wanneer een poststuk de status "archived" bereikt, is het onveranderlijk en kunnen er geen wijzigingen meer worden aangebracht. Deze regel wordt op databaseniveau afgedwongen.

## 8. Meldingen

### In-app meldingen

Het bel-icoon in de bovenbalk toont het aantal ongelezen meldingen. Klik op het icoon voor de meest recente meldingen, of open "Notifications" voor het volledige overzicht. Meldingen kunnen individueel of in bulk als gelezen worden gemarkeerd.

### Push-meldingen

Push-meldingen kunnen worden geactiveerd in de browser of geïnstalleerde app. Bij eerste gebruik vraagt de applicatie toestemming. De status (Active, Inactive, Blocked, Not Supported) is zichtbaar in het tabblad Notificaties van Instellingen.

### E-mailmeldingen

Voor belangrijke gebeurtenissen wordt een e-mailbericht verstuurd naar het geregistreerde e-mailadres. De gebruiker kan per kanaal (push, e-mail) zelf de voorkeuren bepalen.

### Voorkeuren

Beide kanalen kunnen worden in- of uitgeschakeld via Instellingen → Notificaties. Standaard staan beide kanalen aan voor nieuwe gebruikers.

## 9. Instellingen

Het instellingenscherm bevat vijf tabbladen:

- **Profiel**: persoonsgegevens en accountinformatie.
- **Weergave**: thema-instellingen (licht of donker).
- **Notificaties**: voorkeuren voor push en e-mail.
- **Systeem**: applicatieversie, omgeving, laatst ingelogd, rolinformatie.
- **E-mail Config**: instellingen voor de e-mailverzending (uitsluitend zichtbaar voor VP en Secretaris).

## 10. Audit Log

De audit log is uitsluitend toegankelijk voor de VP en bevat een onveranderlijk register van alle relevante gebeurtenissen in het systeem, waaronder aanmaken, wijzigen, statuswisselingen, documenttoegang en heropening van zaken.

Filtering is mogelijk op datumbereik, type actie en entiteitstype. De lijst wordt paginagewijs weergegeven. Audit-records kunnen niet worden gewijzigd of verwijderd.

## Contact

Voor technische ondersteuning of vragen over functionaliteit kunt u contact opnemen met Devmart Suriname.

Applicatie-URL: https://vpflow.app
