---
name: floorplan-to-3d
description: Turn a floor plan image into an interactive 3D three.js model (orbit, walk-inside, layout variants, restyled interior) and publish it as a claude.ai artifact and as a page on dkauzi.github.io. Use when the user shares a floor plan or apartment render and asks to visualise, restyle or improve it.
---

# Floor plan to interactive 3D model

Reference implementation: `apartment-3d/index.html` in this repo. It is one self-contained HTML file with four modes (as drawn, improved, pro upgrade, studio), two unit sizes, walk-inside mode and evening light. Read it before building a new model and reuse its helpers rather than starting from scratch. If that file has no "Walk inside" button it is an older copy; the newest version is the claude.ai artifact "Apartment 3D — To Plan".

## What the user wants, in order

1. A model that follows the drawn plan **exactly**. The first version of this model was rejected with "does not follow the design 100%" because the layout was invented. Fidelity to the plan comes first; style comes second.
2. The new interior style applied on top of that layout.
3. An optional improved layout, shown next to the as-drawn one, never instead of it.

## Steps

1. **Read the plan carefully.** Open the image and write down every room, wall, door, window, balcony and each piece of furniture with its position. Note things that are ambiguous (the two small rooms on the right of the Warm Minimal plan were unclear) and say how you read them, so the user can correct you.
2. **Pick a coordinate system.** x = width, z = depth (front glazing at small z), y = up, in metres. Scale from a known size (a door is about 0.9 m). Keep every room as a named box so labels and checks are easy.
3. **Build the shell first, then furniture.** Walls, openings and glazing, then each room, then plants and balcony pieces. Compare against the original image after the shell and again after furniture.
4. **Style.** Warm Minimal palette used so far: chalk walls `#EFE7DB`, oak `#C2945F`, terracotta `#B05A36`, olive `#6E7744`, bronze `#3A332C`. Textures are drawn on a canvas in code (oak planks, travertine, bouclé, zellige, fluted oak); no image files.
5. **Variants.** Keep the as-drawn layout as its own mode. Put each variant in its own group so toggling is a visibility flip.
6. **Interaction.** Orbit and zoom, a full-height-walls toggle, top view, evening light, labels. Walk-inside mode with WASD and a touch joystick. Buttons at least 44 px tall. Real `<button>` elements.
7. **Test, then publish** (below).

## three.js setup that works in artifacts

- Load `three@r128` from cdnjs and `OrbitControls` from `cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/`. Those hosts are on the artifact allow-list; others are blocked silently.
- Renderer: sRGB output, ACES tone mapping, exposure about 0.82, soft shadows.
- Lights that read well: hemisphere about 0.5, one shadow-casting directional about 1.25, small ambient 0.15. Higher values wash everything out.
- Evening mode: lower the sun and hemisphere, switch on warm point lights at the pendant and bedside lamps, give the pendant an emissive material.
- Phones: widen the field of view when the viewport is portrait, and keep labels as HTML elements positioned from projected 3D points.

## Cut-away view: clip each mesh, do not scale the group

Scaling the whole walls group to a low height squashes tall units (wall cupboards, wardrobes, tall fridge) down onto the counters and the kitchen looks broken. Instead, for every mesh in the walls group, store its bottom and top once, then at the cut height (about 1.2 m) hide it if it is entirely above, keep it if entirely below, and scale and reposition it if it crosses. Restore everything when "full-height walls" is on.

## Walk-inside mode (turn the model into a first-person walk-through)

Every model should offer a "Walk inside" button next to the orbit view. It works on desktop and on phones. The reference code is the "walk-through mode" block near the end of `apartment-3d/index.html`.

**State and entry point**
- Keep `walk`, `yaw`, `pitch`, a `keys` map, a `joy` vector, and per-model `entry` (where you start) and `bounds` (the inside edges of the flat). Set `entry` just inside the front door, about 0.5 m in.
- `spawn()`: yaw 0, pitch about -0.05, camera at `entry.x, 1.6, entry.z` (eye height 1.6 m).
- `setWalk(on)`: toggle a `walking` class on `<body>`, turn OrbitControls off (`controls.enabled = !on`), show the ceiling plane, force full-height walls, widen the field of view (68 landscape, 80 portrait), then `spawn()`. On exit restore orbit or top view. Escape also exits.

**Ceiling.** Walls must be full height while walking. Add a ceiling plane at wall height, visible only in walk mode, so the camera never sees the sky through the roof. Rebuild it whenever the unit size changes.

**Look.** Drag on the canvas: `yaw -= dx * 0.005`, `pitch` clamped to ±1.2. Use pointer events with pointer capture so touch and mouse behave the same. Set the camera rotation order to `'YXZ'`.

**Move.**
- Keyboard: W/S and Up/Down walk, A/D strafe, Left/Right arrows turn. Clear `keys` on window blur so a key never sticks.
- Touch: a 110 px on-screen joystick at bottom-left. Compute `x, y` in -1..1 from the pointer position relative to the circle, clamp to length 1, move the knob with a transform, reset on pointer up or cancel. Stop propagation on the joystick so it does not also rotate the view.
- Speed 1.5 m/s times `dt`, with `dt` capped at 0.05 s so a stalled tab cannot teleport you through a wall.
- Direction: `dx = (-sin(yaw)*f + cos(yaw)*s) * speed`, `dz = (-cos(yaw)*f - sin(yaw)*s) * speed`.

**Collision.** Build `wallBoxes` once per build from the box meshes in the walls group that are at least 1 m tall and are not glass (so you cannot walk through walls or tall units, but the glazing line is handled by `bounds`). Test x and z moves separately, with a 0.22 m body radius, so you slide along walls instead of sticking. Then clamp to `bounds`.

**UI while walking.** Hide the layout, view and label buttons; keep only walk, evening light and the unit size toggles. Show a one-line hint ("Drag to look around · W A S D or arrow keys, or the joystick, to walk"). Hide the room labels.

**Check it.** Load the page with walk mode on in the headless browser, screenshot from the entry point, and confirm you see the lobby, not the outside of a wall. Re-check after every layout change, because `entry` and `bounds` depend on the model's dimensions.

## Testing before you publish

Headless Chrome needs software GL:

```
npm i three@0.128.0
# copy the page, point the two <script src> tags at node_modules, then:
chromium --use-gl=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist
```

Use Playwright with `executable_path='/usr/bin/google-chrome'`, collect `pageerror` events, click every mode button and screenshot each. The Google Fonts request failing offline is harmless. Look at the screenshots; a clean console does not mean the model looks right. Compare the as-drawn mode side by side with the original image.

## Deep links

Modes read `location.hash`: `#plan`, `#imp`, `#studio`, default pro; `A` in the hash picks the smaller unit. Add a hash for every mode you want linkable. `#studio` was missing at first, so check each mode has one.

## Publishing

**Artifact (claude.ai):** publish the single `index.html` with `publish_files`. Before republishing, read the live version first. The same artifact may have been edited in another chat, and a publish from an old copy conflicts or overwrites newer work. If a conflict names a newer live version, read it, port your change onto it, then publish with the new `base_version`.

**GitHub Pages (`dkauzi/dkauzi.github.io`):** copy the page to `apartment-3d/index.html`, on a branch, then open a pull request. The default branch deploys automatically. Notes:

- `gh pr create` fails (GraphQL is blocked here). Use `gh api repos/dkauzi/dkauzi.github.io/pulls -f title=... -f head=... -f base=main -f body=...`.
- Push **all** commits before the pull request is merged. PR #9 was merged with only its first commit and the live page stayed on the old model until PR #10.
- After a merge, check `main` really holds the latest file (`git fetch`, then compare `sha256sum` with the artifact's sha from `list_files`). Do not trust the PR page alone.
- Do not touch the site homepage unless asked. Keep the page standalone like the privacy policies.
- Commits in dkauzi repos show dkauzi as the only author: no Co-Authored-By or session trailers.

## Things Claude cannot do here

- Make a photorealistic render or photo of the apartment. Offer the 3D model, real photos of similar interiors, or a prompt to paste into an image editor that supports edits on the original plan.
- Change who can see an artifact. The user shares it from the artifact page.
