# Site fixes — November 1, 2026

## Verified defects and repairs
- **Duplicate Shoreshim navigation:** Two older core-game layers insert separate Shorashim top tabs, in addition to the original `gamesShortcut`. One is injected after DOMContentLoaded, creating extra, partly hidden tabs and accessibility/navigation clutter. The site now exposes **one** `📚 Shoreshim` primary tab, using the existing, working original Shoresh games menu. Legacy duplicates are hidden, removed from tab order and marked `aria-hidden` even if inserted later. It works from the Home, Multiplication and Dollhouse views without editing another developer's claimed `01-game.js`.
- **Gap above Heart Kitchen Cabinet drawers:** In the actual 3D cabinet model, drawer fronts topped out around y=1.01 while the worktop underside began around y=1.11. A fixed pink, rounded apron fills that visible gap while sitting **behind** both sliding drawer fronts. The doors, drawer animation, sink, nine storage slots, purchasable price, and stored item positions remain unchanged.

## Browser testing
- **Multiplication and navigation regression** run **41297156939: PASS**, including desktop 1280px / phone 390px, one visible Shoreshim tab, both duplicate tabs hidden/removed from keyboard navigation, top Shoreshim reachable from Multiplication and Dollhouse, all three multiplication games, coin persistence after reload.
- **Heart Kitchen Cabinet purchase + storage** run **41297156956: PASS**, including desktop and phone, model trim presence, 150-coin shop purchase, placement, both doors and drawers opening/closing, storing cooking items, and persistent storage.
- Existing Recipe Studio full kitchen flow **41297156961: PASS**, interactive furniture prototype **41297157036: PASS**, preview screenshots **41297157001: PASS**, lightweight quality gate **41297157043: PASS**.
- Screenshots are captured by the existing workflows; this was automated Chromium browser testing, not hands-on physical-device touch validation.

## Safety and coordination
No saved-data formats, earned coins, existing furniture purchases, or script and stylesheet loading order changed. PR #168's core Social Skills file `assets/scripts/01-game.js` and PR #139's `COORDINATION.md` remain untouched. PR #277 records these specific file claims.
