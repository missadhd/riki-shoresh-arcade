# Working on Riki's Shoresh Sparkle Arcade

Two AI assistants, ChatGPT and Claude, develop this project, often at the same time.
Rachel owns it and decides what to build. These rules are permanent. Follow them on every task without being reminded.

Both assistants have Rachel's standing permission to develop, test, and publish changes on their own.
Rachel should never have to carry messages between you: coordinate through GitHub.

## 1. Before every task

1. Read this file.
2. Fetch the latest `main`.
3. Review all open pull requests, including drafts. Each one lists its claimed files under **Files I'm editing**.
4. Check active branches (`claude/*`, `chatgpt/*`, and any others) and which files they change compared to `main`.
5. Read `COORDINATION.md`.

## 2. Claim files before editing

1. Create your own branch: `claude/<short-name>` or `chatgpt/<short-name>`.
2. Before editing anything, open a draft pull request into `main` that lists exactly which files you will modify,
   under the heading **Files I'm editing**. Add a matching row to `COORDINATION.md`.
3. If you need another file later, check that nobody has claimed it, then add it to your list before editing it.

## 3. Respect each other's work

- Never edit a file claimed by the other assistant.
- If you both need the same file, whoever claimed it first finishes and merges first. The second waits, then builds on the updated `main`.
- Never overwrite, revert, or force-push the other assistant's work. Never rewrite shared history.
- Never commit directly to `main`.

## 4. Publishing

Publish completed changes to `main` without waiting for Rachel's approval. Test when testing tools are available; if testing cannot be performed, publishing is still permitted. Disclose exactly what was not tested and any known risks. Never publish with known file-claim conflicts, destructive saved-progress changes, or unauthorized script/style loading-order changes.
Merging into `main` deploys to the live Netlify site.

## 5. Recheck before merging

1. Fetch the latest `main` and look for anything merged since you started.
2. Check open pull requests and `COORDINATION.md` again for new claims on your files.
3. Bring your branch up to date by merging `main` into it.
4. Run relevant tests when feasible. If testing tools are unavailable, document the untested areas and proceed.
5. Merge when there are no unresolved file-claim conflicts; unavailable testing alone must not block publication.

If the other assistant published while you were working, incorporate the latest `main` before publishing.
- If their change touched **different files** from yours, a quick check is enough: syntax check, open the site, play your feature once. Publish, then run fuller tests afterward.
- If their change touched **the same files** or the same feature, rerun the full relevant tests before publishing.

## 6. Protect saved progress

- Preserve Riki's purchases, coins, XP, furniture, pets, room layouts, and all other saved data.
- Never rename, remove, or change the format of these 17 localStorage keys:
  `rickyCoins`, `rickyHouseInventoryV1`, `rickyHouseDecorV1`, `rickyHouseWallsV1`, `rickyDreamStorageV2`,
  `rickyDreamPetsV2`, `rickyDreamPositionsV2`, `rickyRoomInteriorsV3`, `rickyTinyOwnedV1`, `rickyTinyPlacedV1`,
  `rickyAdventureXPV1`, `rickySpatialMusicV1`, `riki3dOrbit`, `rikiReal3dAz`, `rikiRootProgressV1` (per-word learning progress), `rikiDreamRotationV1` (furniture rotation, shared 2D/3D), `rikiClawPlushV1` (Claw plushies won).
- Never change the script or stylesheet loading order in `index.html` without Rachel's approval.

## 7. Testing is your job

- Test your own changes when tools permit. Include phone-sized layouts (about 390 px wide), and saved progress when your change touches it, whenever those checks are possible.
- Don't rely on Rachel to test fixes.
- Never say a test passed unless it actually ran and passed. If you couldn't test something, say so and publish anyway when there are no known blocking conflicts or data-loss risks.

## 8. Communicate through GitHub

Use branches, draft pull requests, PR comments, and `COORDINATION.md`. When you finish:

1. Mark your pull request ready and describe what changed and how you tested it.
2. Remove your row from `COORDINATION.md` in the same pull request.

If you find the other assistant changed the same file, stop. Don't resolve it by overwriting. Leave a comment on both
pull requests describing the overlap, and let whoever claimed first finish first.

## 9. Keep Rachel updated, briefly

After publishing, tell Rachel in a few lines: what changed, what was tested, and whether anything is unresolved.
