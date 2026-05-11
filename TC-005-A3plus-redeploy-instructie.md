# TC-005 A3+ — Claude Code Redeploy Instructie

**Status:** GOEDGEKEURD door Delroy (2026-05-11)
**Taak:** Redeploy send-push-notification Edge Function na A3+ code fix

## Wat er al gedaan is (door Cowork)

`supabase/functions/send-push-notification/index.ts` is gepatcht:
- `auth.getClaims()` vervangen door handmatige JWT payload decode
- `supabaseAnonKey` env var verwijderd (niet meer nodig)
- Alle andere logica (VAPID, subscriptions, security gate) ongewijzigd
- Reden: `auth.getClaims()` gebruikt de nieuwe ECC key en rejecteert legacy HS256 tokens;
  Auth Gateway heeft de signature al geverifieerd, handmatige decode is veilig.

## Jouw taak (één commando)

```bash
supabase functions deploy send-push-notification
```

Zorg dat je linked bent op het project:
```bash
supabase link --project-ref xjkkumclqqnjngnttabf
```

## Na deploy

Meld aan Delroy:
- Deploy succesvol? ja/nee
- Eventuele errors
- Daarna voert Cowork de smoke test opnieuw uit

## Niet doen

- Geen andere bestanden wijzigen
- Geen migraties draaien
- Geen Vault of Auth Gateway wijzigingen
