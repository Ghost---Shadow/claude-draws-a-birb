# Idea 11: Multi-Subject Scene Composition

## Problem
Every drawing in this project depicts **a single subject in isolation**. Real illustrations often have multiple subjects interacting in a scene — two birds on a branch, a bird in a landscape, a bird near its nest. This tests whether Claude can handle **relative sizing, spatial composition, depth, and visual hierarchy** — skills that don't appear in single-subject drawings.

## What to Build
A new file (`scene.html`) depicting a scene with **2-3 subjects and an environment**:

### Suggested Scene Options (pick one)

**Option A: Two Robins on a Branch**
- One robin facing left, one facing right, on a horizontal branch
- Different sizes (adult + juvenile, or near + far)
- Branch extends across the canvas with leaves/moss
- Soft blurred background (trees/sky)

**Option B: Bird at a Feeder**
- Robin perched on a hanging bird feeder
- Feeder has geometric shape (cylinder or house shape)
- Seeds/food visible inside
- String/chain connecting feeder to top of frame
- Background: garden blur

**Option C: Bird in a Tree**
- Robin sitting in a nest in a tree fork
- Tree trunk and branches frame the scene
- 2-3 eggs in the nest
- Leaves/foliage around the edges
- Depth layers: background sky → mid-ground branches → foreground bird+nest

### Key Challenges
1. **Relative scale**: Two birds at different distances must have consistent size difference. A bird 2x farther should be ~half the size.
2. **Composition**: Rule of thirds? Golden ratio? Where does the eye go first?
3. **Depth/atmosphere**: Background elements should be less saturated, slightly blurred, lower contrast (atmospheric perspective).
4. **Interaction**: Subjects should relate to each other and the environment — not just float in space.
5. **Complexity budget**: More elements means each one needs to be simpler. Can't have photorealistic detail on everything.

### Technical Approach
- Use `<g>` groups with `transform="translate() scale()"` for positioning subjects
- Background depth via:
  - `<feGaussianBlur>` on background group
  - Desaturated/lighter colors for distant elements
  - Overlapping layers (sky → hills → trees → branch → bird)
- Reuse shape patterns from existing drawings (e.g. eye construction from `freehand.html`, body ellipse from `baseline.html`)

## Reference Material
- **Style**: Flat geometric (like `baseline.html`) or lightly textured
- **Color palette**: Nature tones — greens, browns, sky blue, plus bird colors
- Read `lessons-learnt.html` for all techniques
- All previous drawings for shape construction knowledge

## Workflow
1. **Thumbnail sketch phase**: Before any SVG, describe the composition in words — what goes where, what size, what's in front of what
2. **Bounding box layout**: Place approximate rectangles for each major element
3. **Build back-to-front**: Sky → background elements → mid-ground → foreground subjects → overlays (vignette)
4. **5 render-feedback iterations** (even more important here — composition errors compound)
5. Add card to `index.html`, write scene-composition lessons

## Parallel Safety
This idea is **independent** — it has no dependencies on other ideas and can be run in parallel.

**Files you create** (these are unique to this idea — no conflicts):
- `scene.html`

**Shared files — do NOT modify** (other agents may be writing to these simultaneously):
- `index.html` — do NOT add a gallery card. Instead, create `ideas/11-gallery-card.html` with just the `<a class="card">` snippet to be merged later.
- `lessons-learnt.html` — do NOT edit. Instead, write any new lessons to `ideas/11-lessons.md`.
- `CLAUDE.md` — do NOT edit.

## Acceptance Criteria
- [ ] Scene contains at least 2 distinct subjects plus environment
- [ ] Subjects have correct relative scale
- [ ] Clear visual depth (foreground, mid-ground, background)
- [ ] Composition feels balanced (not cluttered, not empty)
- [ ] Total SVG is performant (renders without jank in Chrome)
- [ ] Lessons written to `ideas/11-lessons.md`: composition rules, depth techniques, complexity management
