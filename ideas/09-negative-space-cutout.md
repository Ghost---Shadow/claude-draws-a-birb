# Idea 09: Negative Space / Cutout Drawing

## Problem
Every drawing in this project uses **additive** construction — shapes are placed on top of each other to build up the image. But there's an opposite approach: **subtractive drawing**, where you start with filled rectangles and carve away material using masks and clip paths. This forces thinking about boundaries and negative space rather than fills, which is a fundamentally different (and potentially more accurate) way to define shapes.

## What to Build
A new file (`baseline-cutout.html`) recreating the baseline bird using a **subtractive / cutout approach**:

### Technique
1. Start with solid colored rectangles covering the full canvas:
   - A full-canvas `<rect>` in the background color
   - Overlapping color blocks for each major region
2. **Carve out** the bird shape using `<mask>` or `<clipPath>`:
   - The bird silhouette is defined as what's **removed** from (or kept within) the color blocks
   - Think of it like stencil art or paper cutting
3. Use SVG `<mask>` with white = visible, black = hidden:
   ```svg
   <mask id="birdMask">
     <rect width="100%" height="100%" fill="black"/>
     <path d="M... (bird silhouette)" fill="white"/>
   </mask>
   ```
4. Layer multiple masks for interior features:
   - Wing shape cuts into the body color to reveal wing color underneath
   - Eye is a cutout revealing white, with a smaller cutout revealing black pupil

### Conceptual Model
Think of it as layers of colored paper stacked up, with shapes cut out of each layer to reveal the layer below:
- **Bottom layer**: Background (sky/green)
- **Layer 1**: Orange body (full rect, masked to body shape)
- **Layer 2**: Dark navy (full rect, masked to wing + head shape)
- **Layer 3**: Blue-gray strip (full rect, masked to strip shape)
- **Layer 4**: Yellow belly (full rect, masked to belly crescent)
- **Layer 5**: Details (eye, beak, legs — small cutouts)

## Why This Helps
- **Forces boundary thinking**: You must define exact outlines to create masks. No fuzzy "place a shape roughly here" — the cutout must be precise or you see the wrong color bleeding through.
- **Natural anti-seam**: Masks inherently handle boundaries cleanly — no overlapping shapes with seam gaps.
- **Tests mask/clipPath mastery**: These are powerful SVG features the project hasn't deeply explored.
- **Different mental model**: If additive construction is "painting", subtractive is "sculpting". Trying both reveals which problems are technique-specific vs. fundamental.

## Reference Material
- **Reference image**: `images/baseline.jpg`
- **Color palette**: `#F09060`, `#1D2B3A`, `#90B4BC`, `#F4B830`, `#E06040`
- Read `lessons-learnt.html` — especially notes on filters bleeding outside clipPaths
- `baseline.html` for the additive version to compare against

## Parallel Safety
This idea is **independent** — it has no dependencies on other ideas and can be run in parallel.

**Files you create** (these are unique to this idea — no conflicts):
- `baseline-cutout.html`

**Shared files — do NOT modify** (other agents may be writing to these simultaneously):
- `index.html` — do NOT add a gallery card. Instead, create `ideas/09-gallery-card.html` with just the `<a class="card">` snippet to be merged later.
- `lessons-learnt.html` — do NOT edit. Instead, write any new lessons to `ideas/09-lessons.md`.
- `CLAUDE.md` — do NOT edit.

## Acceptance Criteria
- [ ] Bird drawn entirely using subtractive technique (masks/clipPaths, NOT additive shape stacking)
- [ ] Each color region defined by what's carved away, not what's placed on top
- [ ] No visible seams at region boundaries
- [ ] Visual quality comparable to `baseline.html`
- [ ] Toggle to show the mask layers individually (for debugging/education)
- [ ] Lessons written to `ideas/09-lessons.md`: how does subtractive compare to additive?
