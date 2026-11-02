# Clay model pipeline
Turns low-poly furniture GLBs into small matte "clay" GLBs that match the art references: pastel pink, peach, cream, sage, lavender and sky.

    npm i @gltf-transform/core@3 @gltf-transform/functions@3 @gltf-transform/extensions@3
    node tools/clay-models/restyle.mjs <folder of source glbs> assets/models/clay tools/clay-models/list.json

- Each entry in `list.json` has `src` (the source file), `out` (the output name) and an optional `map` (material name to palette key). Materials without a `map` entry get a colour picked automatically from the original hue.
- At runtime, the clay fingerprint noise (bump), contact shadows and warm lighting are added by the scene. See `samples/clay-room.html`.
- Choose models selectively: only add what fits each game or room's theme.
