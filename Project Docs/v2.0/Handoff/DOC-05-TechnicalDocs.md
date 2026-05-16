# Technische Documentatie — VP-Flow

Versie: 2.0
Datum: 2026-05-15
Opgesteld door: Devmart Suriname

## 1. Technische stack

VP-Flow is opgebouwd uit een single-page React-applicatie met Supabase als backend.

| Laag | Technologie |
|------|-------------|
| UI-framework | React 18 (functionele componenten, hooks) |
| Buildtool | Vite 5 |
| Programmeertaal | TypeScript (strict mode) |
| Routing | React Router 6 |
| Componentbibliotheken | React Bootstrap 5, Radix UI, shadcn-componenten |
| Styling | Tailwind CSS, SCSS, Bootstrap-thema |
| State en data-fetching | TanStack React Query |
| Formulieren | React Hook Form met Yup/Zod validatie |
| Rich text-editor | Tiptap |
| Iconen | Iconify |
| Backend-as-a-service | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| Hosting | Hostinger (statische bestanden, FTP-deployment) |
| CI/CD | GitHub Actions |
| Progressive Web App | vite-plugin-pwa met Workbox |

## 2. Architectuur

VP-Flow volgt een client-side single-page architectuur. Alle interactie met data vindt plaats via de Supabase JavaScript-client. Beveiliging wordt uitsluitend afgedwongen op de server (PostgreSQL) door middel van Row Level Security (RLS); client-side controles dienen als gebruikersinterface-laag.

- **Client (browser of geïnstalleerde PWA)**: levert de gebruikersinterface en stuurt geauthenticeerde verzoeken naar Supabase.
- **Supabase Auth**: e-mail/wachtwoord-authenticatie, sessiebeheer, password-reset.
- **PostgreSQL met RLS**: alle persistente data, met rolgebaseerde policies per tabel.
- **Supabase Storage**: documentopslag in een privé-bucket, met tijdelijk-ondertekende download-URL's.
- **Edge Functions**: serverless eindpunten voor push- en e-mailverzending.

## 3. Mappenstructuur (samengevat)

- `src/app/` — routegebaseerde pagina's per module (admin en auth).
- `src/components/` — herbruikbare UI-componenten.
- `src/hooks/` — gedeelde React-hooks (rol, push-abonnement, globale zoek).
- `src/integrations/supabase/` — Supabase-client en gegenereerde typen.
- `src/context/` — auth- en thema-context.
- `src/routes/` — routedefinities en `AppRouter`.
- `supabase/migrations/` — PostgreSQL-migraties (uitsluitend additief).
- `supabase/functions/` — Edge Functions (`send-push-notification`, `send-email-notification`).
- `.github/workflows/` — CI/CD-pijplijn.
- `public/` — statische assets (logo's, iconen, service worker).

## 4. Rollen en autorisatie

Rollen worden bewaard in de tabel `user_roles` en via PostgreSQL-functies gecontroleerd. De applicatie biedt een hook `useUserRole` met de helpers `isVP`, `isSecretary`, `isProtocol` en `isVPOrSecretary`. Deze helpers worden gebruikt voor:

- Filtering van het zijmenu (zie `VerticalNavigationBar`).
- Redirects op rolspecifieke pagina's (notes, audit-logs, users, documents, incoming-post).
- Conditionele actieknoppen (goedkeuren, statuswisselingen).

De definitieve handhaving vindt plaats in de database via RLS-policies.

## 5. Modules en routes

| Route | Module | Toegang |
|-------|--------|---------|
| `/dashboards` | Dashboard | Alle ingelogde gebruikers (Protocol wordt doorgeleid naar `/appointments`) |
| `/clients`, `/clients/create`, `/clients/:id`, `/clients/:id/edit` | Guests | VP, Secretaris |
| `/appointments`, `/appointments/create`, `/appointments/:id`, `/appointments/:id/edit` | Appointments | VP (volledig), Secretaris (concepten), Protocol (alleen goedgekeurd) |
| `/cases`, `/cases/create`, `/cases/:id`, `/cases/:id/edit` | Cases | VP (volledig), Secretaris (lezen) |
| `/documents` | Documents | VP, Secretaris |
| `/incoming-post`, `/incoming-post/create`, `/incoming-post/:id` | Incoming Post | VP, Secretaris |
| `/notes`, `/notes/create`, `/notes/:id`, `/notes/:id/edit` | Notes | VP |
| `/audit-logs` | Audit Logs | VP |
| `/notifications` | Notifications | Alle ingelogde gebruikers |
| `/users` | User Management | VP, Secretaris |
| `/settings` | Settings | Alle ingelogde gebruikers |
| `/auth/sign-in`, `/auth/reset-password`, `/auth/lock-screen` | Authenticatie | Publiek |

## 6. Edge Functions

VP-Flow gebruikt twee Supabase Edge Functions, gehost binnen het Supabase-project:

- `send-push-notification`: ontvangt een notificatieverzoek, controleert per-gebruikersvoorkeuren en stuurt push-berichten via de Web Push API (VAPID).
- `send-email-notification`: ontvangt een notificatieverzoek, controleert per-gebruikersvoorkeuren en verstuurt e-mail via de geconfigureerde e-mailprovider.

Beide functies worden aangeroepen via databasetriggers en valideren JWT-tokens of service-role authenticatie. CORS is geconfigureerd voor de productieomgeving.

## 7. Progressive Web App

De PWA-configuratie staat in `vite.config.ts`:

- Manifest met naam VP-Flow, themakleur `#7e67fe`, achtergrondkleur `#191e23`, weergave standalone.
- Service worker met Workbox: caching van de app-shell, expliciete uitsluiting van API-aanroepen (`/api`, `/rest`).
- Geen runtime-caching van API-responses — offline-toegang is alleen-lezen op reeds geladen scherm.
- Push-handler in `/sw-push.js`.

## 8. Deployment

De productie-deploymentpipeline is gedefinieerd in `.github/workflows/deploy.yml` en draait bij elke push naar de hoofdvertakking `main`:

1. Checkout van de broncode.
2. Node.js 20 met npm-cache.
3. `npm ci --legacy-peer-deps` voor installatie van de afhankelijkheden.
4. `npm run build` met inlezen van de Vite-variabelen (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
5. Upload van de `dist/`-map via FTP naar Hostinger (`/public_html/`).

Het build-commando voor lokale uitvoering is:

```
npm run build
```

## 9. Omgevingsvariabelen

De applicatie verwacht de volgende variabelen tijdens build of runtime (geen waarden vermeld):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (publishable key)
- `VITE_SUPABASE_PUBLISHABLE_KEY` (alias indien gebruikt)

Voor Edge Functions en triggers worden in de Supabase Vault de volgende geheimen bewaard:

- `SUPABASE_SERVICE_ROLE_KEY`
- `VAPID_PRIVATE_KEY` en `VAPID_PUBLIC_KEY`
- E-mailprovider-sleutels
- `SUPABASE_PROJECT_URL`

Voor deployment naar Hostinger worden in GitHub Secrets bewaard:

- `FTP_USERNAME`
- `FTP_PASSWORD`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 10. Repository

Bronbestanden van VP-Flow zijn opgeslagen in een private Git-repository, beheerd door Devmart Suriname. Migratiebestanden zijn nooit destructief: nieuwe wijzigingen worden uitsluitend via nieuwe migratiebestanden doorgevoerd.

## 11. Versie

Applicatieversie: 2.0.0 (geregistreerd in `src/app/(admin)/settings/constants.ts`).
Releasedatum: 2026-05-15.

Applicatie-URL: https://vpflow.app
