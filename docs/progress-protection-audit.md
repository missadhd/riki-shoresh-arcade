# Arcade persistence and usability audit — November 1, 2026

## What was already working
- Coins use `rickyCoins` in `localStorage`; inventory, decorated rooms, furniture positions, XP, mastery, and related saved data already have storage keys. Those keys are unchanged.
- The 🔥 streak is session-scoped (reset by reload), not a durable currency or cumulative achievement. It was intentionally left session-scoped.
- The Apple touch icon already has a valid `href` to `assets/icons/apple-touch-icon-180.png`.
- `index.html` loads **17 distinct ordered CSS files**, not 13 duplicated links. Combining them blindly would change stylesheet precedence and isn't justified without performance profiling.
- The manifest, PWA icons, service worker and manual iOS/Android install instructions already exist. iOS does not provide the same `beforeinstallprompt` browser event used by supported Chromium installs.

## Fixes made
- Protect signed-in progress if the player earns new coins or makes changes just before a refresh: detect differences from the last synced cloud snapshot, keep the newer local copy, and retry the cloud save with version-based conflict protection.
- On account/API outages, avoid automatic logout and restoring unrelated guest data. Unsynced changes block user-initiated profile switches and sign-outs until they are saved.
- Compact the phone-width testing notice without hiding it.
- Explicitly set RTL for Hebrew-only text elements and isolate Hebrew spans without reversing English controls.

## Tested
GitHub Actions **Guest and cloud progress persistence** run `41289768155` passed:
1. Guest coins, XP, furniture inventory, and furniture positions survive a normal reload.
2. Phone-size testing notice is compact and Hebrew text is correctly RTL.
3. A cloud snapshot behind the current local coin total does not overwrite it; the local total syncs to the cloud and survives another reload.
4. An authentication server outage does not log the user out automatically or roll back local progress.

The existing PWA offline smoke test is separate. This suite mocks cloud HTTP responses and does **not** assert successful real authenticated cloud sync to the production backend.

## Deferred intentionally
- A `<main>` loading fallback and any HTML loading-order changes, while another active PR claims `index.html`.
- A custom one-click Chromium PWA install prompt (optional enhancement, not required to fix installability; keep iOS instructions).
- Stylesheet bundling, pending measured performance data and explicit approval for loading-order changes.
