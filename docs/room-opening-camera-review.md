# Room opening and visual review

## What changed

- Every room now opens in the **full-room cutaway view** rather than a close interior camera stuck against a wall.
- The child's choice to enter the close **Look inside** view remains available; re-entering a room restores the full-room view.
- Initial cutaway zoom has a small clearance margin, with consistent Zoom In, Zoom Out, Front/Reset, double-tap, mouse-wheel, and pinch controls.
- The 3D room stage now uses a more focused maximum width on desktop to reduce unused background, without cropping the shell.
- Permanent architecture is distinct: bedroom pink wainscoting; living room warm raised panels; kitchen sage subway tile; bathroom aqua square tile; playroom lilac color blocking and bunting; garden outdoor fencing. Purchased furniture and wall/floor inventory remain unchanged.

## Automated checks

- V8 JavaScript syntax parse: passed on the edited 11-game.js.
- Preserved all existing named saved-progress keys: verified no new or removed occurrences of the 17 protected keys compared with main.
- GitHub Actions `Dollhouse full-room opening QA`, run **41288409657**: **12/12 passed**, testing bedroom, living room, kitchen, bathroom, playroom, and garden in 1280px desktop and 390px phone-sized Chromium.
- Each browser check opens a room, confirms the cutaway is selected, validates WebGL canvas dimensions, clicks zoom buttons, and switches into and back out of inside view.
- Desktop and phone screenshots from run 41288409657 were retrieved and visually inspected. The complete shell and floors were visible, the six rooms were recognizable, and the initial desktop background area was reduced versus the first QA pass.

## Limits and follow-up

- Screenshot QA covers initial room state but does not inspect every possible purchased furniture combination or every older device/GPU.
- Because the scene is an angled 3D room, modest background around its diagonal silhouette is intentional; it cannot literally occupy a rectangular viewport without cropping or distorting the scene.
- There are no changes to purchased items, coin/XP balances, storage keys, or `index.html` loading order.
