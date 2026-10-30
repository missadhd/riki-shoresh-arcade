# Working on Riki's Shoresh Sparkle Arcade

This repo is edited by two AI assistants (ChatGPT and Claude), sometimes at the same time.
Rachel owns the project. Follow these rules on every task, without being reminded.

## Before you start any task

1. Pull the latest `main`.
2. Check what the other assistant is doing:
   - List open pull requests, including drafts. Each PR description has a "Files I'm editing" list.
   - Check remote branches that start with `chatgpt/` or `claude/`, and see which files they change compared to `main`.
3. Read `COORDINATION.md` for the current file claims.
4. If a file you need appears in someone else's open PR or branch, do not edit it. Either pick another approach or ask Rachel.

## Claiming files

1. Create a branch: `chatgpt/<short-name>` or `claude/<short-name>`.
2. Before editing anything, open a draft pull request into `main`. List every file you plan to edit under a heading **Files I'm editing**.
3. If you need another file later, add it to that list before editing it, and check again that nobody else has claimed it.

## While working

- Before every push, fetch, then check open PRs and branches again for overlap.
- Merge the latest `main` into your branch. Never force-push, never rewrite someone else's commits.
- Never commit directly to `main`.

## Hard rules

- Keep the script and stylesheet load order in `index.html` exactly as it is unless Rachel approves a change.
- Never rename or remove these localStorage keys, or Riki loses her progress and purchases:
  `rickyCoins`, `rickyHouseInventoryV1`, `rickyHouseDecorV1`, `rickyHouseWallsV1`, `rickyDreamStorageV2`,
  `rickyDreamPetsV2`, `rickyDreamPositionsV2`, `rickyRoomInteriorsV3`, `rickyTinyOwnedV1`, `rickyTinyPlacedV1`,
  `rickyAdventureXPV1`, `rickySpatialMusicV1`, `riki3dOrbit`, `rikiReal3dAz`.
- Test in a phone-sized browser (about 390 px wide) before marking a PR ready.
- Only Rachel merges into `main`, which deploys to the live Netlify site.

## Finishing

1. Mark the PR ready for review and write what changed and how you tested it.
2. Remove your claim from `COORDINATION.md` in the same PR.
3. Tell Rachel the PR is ready. She merges it.

## If you collide

If both of you changed the same file, stop. Do not resolve it by overwriting. Leave a comment on both PRs
describing the overlap and ask Rachel which goes first.
