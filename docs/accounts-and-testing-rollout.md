# Account and testing rollout — Riki's Shoresh Sparkle Arcade

## Current state and non-negotiables
The deployed GitHub Pages arcade is a **public, unlocked testing build**. Its existing progress is in per-browser localStorage, not a server-side account. No email/password login or cross-device sync currently exists. Never present a browser-only nickname as a secure account.

Before public signups, provision an authenticated backend with server-side authorization and a privacy review for a game intended for children. GitHub Pages serves static assets and is not an authentication backend.

## Product states
- `TEST_OPEN` (current): existing arcade unlocked; label it TEST VERSION. Purchases and coins use current browser progress. No real-money payment.
- `TEST_INVITE` (future): signed-in adult testers with approved invitations; separate test environment/data.
- `PRODUCTION_OPEN` (future): adult/guardian registration and independently saved child profiles; no public child contact information.
- `PRODUCTION_RESTRICTED` (future): server-authorized subscription or invitation check. Never gate access with client-only JavaScript or CSS; configure policy only when owner approves.

## Architecture
1. Adult/guardian identity: vetted managed authentication (e.g. provider-supported email link/passkey), with session handling in supported API/backend. Don't invent account credentials or store passwords in localStorage.
2. Child player profiles: opaque profile ID; optional display nickname; age-appropriate setup under an adult account; no public profile; parent can edit/delete.
3. Ownership: `adult_users` -> `child_profiles`; `progress_snapshots` scoped to profile ID + environment; `entitlements` checked server-side. Authorization must prevent access to unrelated profiles even if IDs are guessed.
4. Separate environments: development/test accounts and progress in **different backend projects/database schemas** from production. Seed test accounts with demo coins, sample purchases, mock transactions; no real purchases or real children copied into test.
5. Migration: explicitly opt in on Riki's existing device. Show the current name, saved progress and inventory before migration; make a complete local backup/export; import to a newly authenticated profile with idempotency key; verify totals and rooms; retain legacy localStorage until verified; provide rollback. **Do not silently rename or delete any of the 17 protected keys.**
6. Saved objects: versioned typed data for coins, XP, purchases, room layouts, pets, settings, game progress; avoid last-write-wins loss from simultaneous devices. Use server-issued profile/house ownership for transactions.
7. Permissions: parent is account owner; child has gameplay access only; test operator is restricted to test environment; administrator controls cannot be inferred from a local client flag.
8. Security: backend row-level permissions/ACLs, minimum data collection, rate limiting, encrypted transit, CSRF/XSS protections, privacy notices, retention/deletion requests, incident logging that never includes student progress details. Assess COPPA and other applicable children's privacy rules before registration.
9. Tests: unauthorized profile access denied; data persists after logout/login and across browsers; no progress bleeding between profiles; Riki legacy migration/rollback; repeated import; offline reconciliation; separate test/prod; real purchase/entitlement disabled until approved; future invite/paid gates enforced server-side.

## Implementation gates
- **Now (safe):** visible TEST VERSION banner; preserve current progression and existing live access.
- **Next (requires service provisioning):** choose and provision authentication/database provider and custom domain/API endpoint; secure environment variables in hosting, not repository; build guardian signup, child profiles, schema and policies.
- **Then:** add explicit one-time local migration and multi-device sync, QA, preview deploy with independent seed data.
- **Later:** invitation/subscription rules, with Rachel's separate decision about who gets gated and how; no paywall enabled today.

## Acceptance criteria
Public signup and real accounts are **not complete** until live login, logout, separate users, server-side access-control tests, cross-device sync, migration, delete/export, and parent flows pass. A TEST banner or client-side profile picker alone does not satisfy these criteria.
