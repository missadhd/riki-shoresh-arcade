# Heart Kitchen Cabinet — shipped

## Catalog
- SKU: `heartkitchencabinet`
- Display name: **Heart Kitchen Cabinet**
- Price: **150 coins** (25 typical correct answers at 6 coins each)
- Shop: **Kitchen → Storage**; available in the existing kitchen furniture tray after purchase.
- Not auto-granted; a child must have enough earned coins. Buying uses the existing purchase and saved data systems.

## Furniture design
A substantial main sink base with cream countertop, inset light-blue sink, faucet, pastel-pink cabinet front and heart-shaped knobs. Two hinged lower cupboard doors and two independently sliding upper drawers open inside the **actual** 3D dollhouse, not only in the standalone prototype. Nine reachable storage positions use the existing `rickyDreamStorageV2` key.

## Storage eligibility
Stores purchased small items for cooking or the kitchen: utensils, spice racks, dishes, cups, teapots, cooking jars, food and treats. Rejects unrelated toys, beds, fridges and other storage furniture. Purchasing a cabinet does not add free cooking supplies; those remain rewards/purchases.

## Browser QA
GitHub Actions run **41294040542** passed on **1280px desktop** and **390px mobile**. Tests performed the real Kitchen → Storage shop purchase, coin reduction 200 → 50, ownership save, furniture-tray placement, WebGL model checks (4 working hinges/drawers, sink/faucet), in-room storage of an owned utensil crock and teapot, rejection of a teddy, and refresh persistence for coins and stored contents. Screenshot artifacts are available from the run. Automated browser verification was completed; hands-on physical mobile gestures were not tested.

## Coordination
`assets/scripts/12-game.js` is the only existing game file edited. No localStorage keys, load order, or unrelated PR-owned files were changed.
