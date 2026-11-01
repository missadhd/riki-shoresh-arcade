# Progress persistence audit (Nov 2026)

Scope: verify guest coin and furniture data persistence; protect unsynced cloud-profile changes during page refresh; do not rename, delete or change any existing saved-progress key. Add phone-sized QA for the testing notice and check Hebrew text direction without reversing English labels. Leave stylesheet and script load order unchanged.

The existing coin balance is stored in `rickyCoins`; house inventory, layout, XP and root mastery also have dedicated localStorage keys. The 🔥 streak is currently session-scoped, so a reload resets it intentionally unless product requirements change.

Pending: automated regression outcomes and deployment state.
