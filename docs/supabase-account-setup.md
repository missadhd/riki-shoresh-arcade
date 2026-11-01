# Supabase account integration checklist

This migration creates **real server-side ownership boundaries**, but is not deployed or connected to the Arcade until a Supabase project is provisioned and authenticated.

## Required setup
1. Connect an owner-controlled Supabase workspace. Create independent TEST and PRODUCTION projects. Start with TEST.
2. Apply `supabase/migrations/20261031_guardian_profiles.sql` to TEST; inspect policies and ensure authenticated A cannot read/update guardian B, player B, progress B, or entitlement B.
3. Configure an adult-only magic-link or passkey login. Child players are guardian-managed profiles; never require child email.
4. Before enabling signup, add an appropriate privacy notice and consent/verification flow; review COPPA applicability.
5. Use a publishable Supabase key in the frontend only. Never use a service-role key in GitHub Pages or JavaScript.
6. Build opt-in migration: back up ALL protected legacy localStorage keys before any import; validate snapshot; use server-side/versioned conflict protection; verify after reload and login on second device.
7. Set up a separate TEST Supabase project, test-only adult users, and seeded currency. Do not share genuine children's progress with TEST.
8. Add server-enforced authorization for future subscription/invitation locks; keep current build open and not paid.

## Review before enabling live accounts
- Auth redirects tied to real domain
- RLS cross-guardian tests, authenticated vs anonymous
- Versioned snapshot writes (no cross-device clobber)
- Guardian delete/export and session logout
- Rate limits, retention, consent, backup/recovery
- Independent test/production keys and projects

Status: schema committed, **NOT DEPLOYED**; no real account availability claimed.
