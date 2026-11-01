# Recipe Studio kitchen — interactive order flow

## Scope
The existing Recipe Studio in Multiplication Arcade is now a small **2D illustrated bakery** with a customer order ticket, pink tiled wall and window, prep counter, individually filled trays, working oven phases, pickup counter, and food visibly served. It fits the app's actual pastel visual style, **not** a Blender model, a fake rendered image, or an unrelated 3D bakery.

The child performs five distinct actions for each order:
1. Read the customer's requested equal groups and count the trays.
2. Tap **Fill tray** repeatedly, one group per tap, seeing the matching ingredients appear.
3. Solve the multiplication total, with concrete skip-counting hints after mistakes.
4. Tap **Put the trays in the oven** to activate the baking animation.
5. Tap **Serve the order** to deliver food and receive exactly **six standard arcade coins**.

Each five-order session still has no timer. Each successfully served order earns coins once, not when the answer is first typed. Subsequent orders reset the preparation and oven states. Existing multiplication and coin progress remains in the same keys, and both other multiplication games are unchanged.

## Browser verification
- **Recipe Studio full kitchen flow** run **41296153191: PASSED** (desktop 1280px and phone 390px).
- Played all five complete orders per viewport; verified number of trays, one tray per tap, wrong-answer hints, right-answer gating, animated baking state, food on serving counter, one-and-only-one reward per served order, correct total 30 earned coins, and persistence after reload.
- Existing owned items and Hebrew progress were unchanged relative to the initialized account.
- **Multiplication arcade and navigation regression** run **41296153169: PASSED** (all three math games, top tabs, coin persistence).
- Existing light quality gate and preview checks also passed. Screenshots of prep, baking and served screens on desktop/phone are attached to Actions run **41296153191**.

## Limits
This is a responsive **2D interactive kitchen**, not a 3D kitchen simulation or photorealistic asset. Browser automation checked phone-sized viewport, not physical handheld finger testing. The main Dollhouse and furniture remain separate, and no catalog purchases, saved room placements or stylesheet/script load order were changed.

## Coordination
Only `assets/scripts/15-multiplication.js`, `assets/styles/18-multiplication.css`, the existing math regression test, this document, a new focused browser test and its workflow were changed. PR #139's `COORDINATION.md` and PR #168's `01-game.js` remain untouched; this PR is the claim record.
