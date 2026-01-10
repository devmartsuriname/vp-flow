# Restore Point: Authentication Replacement - PRE-EXECUTION

**Date:** 2026-01-10  
**Step:** Authentication Replacement  
**Status:** PRE-EXECUTION

## Files to Remove
- `src/helpers/fake-backend.ts` — DELETE ENTIRELY

## Files to Modify
- `src/App.tsx` — Remove fake backend import/call
- `src/types/auth.ts` — Replace with Supabase-compatible types
- `src/context/useAuthContext.tsx` — Full rewrite with Supabase auth
- `src/app/(other)/auth/sign-in/useSignIn.ts` — Use Supabase signIn
- `src/app/(other)/auth/sign-in/components/SignIn.tsx` — Remove demo defaults
- `src/app/(other)/auth/sign-up/components/SignUp.tsx` — Implement Supabase signUp

## New Files to Create
- `src/hooks/useUserRole.ts` — Fetch role from user_roles table

## Current State (FAKE AUTH)
- Cookie-based fake authentication
- Demo credentials: user@demo.com / 123456
- Axios mock adapter intercepting /login

## Target State (SUPABASE AUTH)
- Real Supabase authentication
- Session-based auth with onAuthStateChange
- Role resolution from user_roles table
- No demo credentials

---
**Governance:** VP-Flow Phase 3 Execution  
**Guardian Rules:** Active
