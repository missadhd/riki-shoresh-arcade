# File claims

Open draft pull requests are the live record of who is editing what. This file is the summary.
Add a row when you open your draft PR and remove it in the same PR when you finish.

| Who | Branch | Files | Status |
| Grok | grok/dollhouse-ceilings | assets/scripts/11-game.js, COORDINATION.md | In progress — adding 3D ceilings + toggle |

## Map of the code

- `assets/scripts/01-game.js` — core: word list `W`, menu, quiz games, header, Social Skills, old 2D "Play inside" house
- `assets/scripts/02`–`10` — earlier layers: drag and drop, older games, interiors, older pseudo-3D room
- `assets/scripts/11-game.js` — shared Three.js engine, 3D room editor, whole-house view
- `assets/scripts/12-game.js` — 3D models for every shop item, shop thumbnails
- `assets/scripts/13-game.js` — 3D studio games (Cupcake Café, Cake, Dress-Up, Pet Spa, Boutique, Claw, Aquarium, Missions, Gift Wrap, Garden) and their 2D fallback
- `assets/styles/15-styles.css` — sparkle theme
- `assets/styles/16-styles.css` — quiz game polish
