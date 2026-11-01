# Dollhouse interaction and touch audit — November 1, 2026

## Actual defects repaired

1. **Two-finger pinch could be interpreted as a furniture drag or one-finger camera movement.** The old editor independently observed drag and pinch pointers. Pinch gestures now take control before the drag/orbit handler, retain pointer capture, prevent browser page scrolling on the canvas, and suppress placement until both fingers are lifted. Zoom is clamped as before. If the first finger briefly moved an item before the second touched, its uncommitted visual position is restored on pinch initiation. Mouse dragging and single-finger furniture interactions remain supported.
2. **Overlapping mobile camera controls.** Screenshots of the 390px kitchen showed the "Drag to look around" label truncated behind camera controls and the front-view button. On phone widths the redundant hint is hidden, the room name gets its own readable row, and zoom/reset buttons have 44px minimum touch targets, leaving space for the front-view control. Screenshot review verified the updated layout.

## Six-room browser verification

The dedicated end-to-end **Six-room dollhouse touch and storage QA** workflow run **41299046889** completed **successfully** against the final code, with both **1280px desktop** and **390px Chromium mobile emulation**.

The test deliberately seeds a separate browser profile with existing furniture and no real student data. For each of the six actual 3D rooms it navigates through the site's existing room editor, previews a purchased model, taps the **Place here** action, verifies the physical 3D model is in the scene and that the room's layout is saved, and captures a screenshot:

| Room | Placed item |
| --- | --- |
| Bedroom | Heart rug |
| Living Room | Pink guitar |
| Kitchen | Heart Kitchen Cabinet |
| Garden | Garden bench |
| Bathroom | Bath candles |
| Playroom | Doll |

The kitchen tests also:
- Use a multi-touch pinch (actual Chromium DevTools touch events on mobile; simulated browser PointerEvents on desktop), verify zoom changes, room azimuth/elevation do **not** rotate, 3D item coordinates stay in the same locations, and neither placement nor saved positions are modified.
- Check the phone HUD hint is not obstructing buttons and controls are touch-sized.
- Tap the **Turn** and **Smaller** controls and verify the existing saved 45-degree rotation and furniture size.
- Tap the real **Open** toolbar button, pick a utensil crock, store it in the cabinet, and close the storage overlay.
- Switch through all six rooms, then refresh the page; verify every placement and the cabinet contents persist, with the original coins and Hebrew progress preserved.

Other CI on this branch: **Dollhouse full-room opening QA** (41299046731), **Guest/cloud progress persistence** (41299046751), **Preview screenshots** (41299046824), **Lightweight quality gate** (41299046712) all passed.

## Limits

The QA covers the **six room types and representative furniture**, not every one of the 271+ catalog items. It does not test every drawer of every model, physical phone hardware, real customer accounts, or all animations by human visual inspection. The mobile multi-touch test does use Chromium's actual touch input pipeline, but that remains emulation. No coins, inventory ownership counts, placements, or other saved-data schema were changed. No existing JS or CSS load order was modified.

## Coordination

This PR only modifies `assets/scripts/11-game.js`, `assets/styles/16-styles.css`, and adds the regression script/workflow plus this audit note. `assets/scripts/01-game.js` (PR #168) and `COORDINATION.md` (PR #139) remain untouched; the draft PR is the file-claim record.
