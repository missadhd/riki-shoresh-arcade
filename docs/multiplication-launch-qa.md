# Multiplication Arcade + permanent top tabs — November 1, 2026

## Implemented
- **Separate Multiplication** section, accessible from the permanent top bar and a large home hub tile; Shoreshim and Social Skills stay separate.
- **Dollhouse** restored as a visible top-level destination on desktop and mobile, bypassing the old hidden-button rule without modifying the other assistant's claimed core game file.
- Seven top destinations: Home, Shoresh Games, Multiply, Dollhouse, Social Skills, Dolls & Pets, Shop. Four essential tabs are visible in the first row on small phones, with the other three directly below.
- Three distinct math games: **Recipe Studio** (visual trays with equal groups), **Array Builder** (child constructs rows one tap at a time), **Fact Match** (matching equations to products).
- Select 2× through 9× families, with 3, 4, 6, 7, 8 selected initially and wrong facts reintroduced preferentially.
- No timer, hints and retries, short activities (5 orders/builds or 4 matching pairs), **6 standard coins per correct answer**.
- Namespaced `rikiMathProgressV1` with selected tables, attempts, correct answers, difficult facts and activities completed; now included in guardian cloud profile snapshots. All preexisting 18 stored progress keys and data formats remain unchanged.
- New file: `assets/scripts/15-multiplication.js`; stylesheet `assets/styles/18-multiplication.css`; both appended to the HTML *without reordering preexisting assets*.

## Browser verification
GitHub Actions **Multiplication arcade and navigation regression** run **41295164734**: **success**, on 1280px desktop and 390px mobile.

The Playwright browser:
1. Opens the real Arcade home and verifies seven visible navigation destinations without horizontal overflow.
2. Opens standalone multiplication; verifies 3 activities are offered.
3. Solves a Recipe Studio order from its shown equation and verifies +6 coins.
4. Builds all required rows in Array Builder, solves the total and verifies +6 coins.
5. Completes four shuffled multiplication matching pairs and verifies +24 coins.
6. Checks previously owned furniture and Hebrew progress are untouched.
7. Clicks top Dollhouse from Multiplication, verifies the Dollhouse opens.
8. Reloads and verifies total coin balance and math-progress history persisted.

Also passed: PWA offline smoke **41295164735**, guest/cloud progress **41295164732**, lightweight quality gate **41295164730**, preview screenshots **41295164733**.

## Visual limits
The three new math games are **responsive 2D interactive cards/boards** styled to fit the Arcade’s existing pastel theme. The earlier AI-generated bakery inspiration pictures are *not* screenshots of the current app, and these games are not photorealistic, Blender models, or a rendered 3D bakery. Screenshots of the actual math UI were captured and reviewed. A future 3D cooking upgrade is a separate project.

## Coordination
Respected PR #168’s claim to `assets/scripts/01-game.js` and PR #139’s claims to `COORDINATION.md` and browser-tooling files. All changed files are claimed in PR #275; no other active PR claims overlap.
