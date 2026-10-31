# Doll rig handoff

Six existing doll designs use parent-relative joints through assets/scripts/riki-doll-runtime.js and assets/characters/doll-joints.json. Integration is in 13-game.js; existing script order and saved-data formats are preserved. Riki uses the approved layered art; other dolls reuse their existing art, avoiding image-generation cost.

Known limits: source-art blur under Riki's ear remains. Other dolls use mesh deformation for facial motion rather than separately painted mouth/eyelid layers. Wave is a small continuous arm/wrist gesture. Three.js characters receive updated static textures; continuous mesh animation currently runs on SVG/DOM characters. Broader wardrobe fit needs further visual review. No claim of natural voice quality on every device.

Validation: tests/live-doll-joints.cjs checks six dolls, eight actions, three phases, wardrobe loading, game texture generation, and browser errors. Phone collection and room screenshots were inspected.

Continue here next time: read this file and AGENTS.md, fetch main, review open claims. Focus next on source ear retouch and wardrobe fitting, then richer facial layers for other dolls. Do not regenerate the whole collection or change saved purchases. Use one agent and targeted tests to conserve usage.
