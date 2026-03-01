# Idea 06: CSS-Only Bird (No SVG)

## Problem
All 10 drawings in this project use SVG. But can the shape-understanding and layering techniques transfer to **pure CSS**? CSS has its own shape primitives (`border-radius`, `clip-path`, `box-shadow`, gradients) that can create surprisingly complex illustrations. This is both a constraint exercise and a test of whether Claude's SVG drawing knowledge generalizes.

## What to Build
A new file (`baseline-css.html`) that recreates the baseline bird (`images/baseline.jpg`) using **only HTML `<div>` elements and CSS** — no `<svg>`, no `<canvas>`, no images.

### Allowed Techniques
- `border-radius` for circles and ovals (head, body, eye)
- `clip-path: polygon(...)` or `clip-path: ellipse(...)` for complex shapes (wing, tail)
- `background: linear-gradient(...)` and `radial-gradient(...)` for fills
- `box-shadow` for soft edges, glow effects, or duplicating shapes
- `transform: rotate()`, `scale()`, `skew()` for positioning
- `::before` and `::after` pseudo-elements for extra shapes (max 2 per element)
- `z-index` for layering (analogous to SVG z-order)
- Absolute positioning within a fixed-size container

### NOT Allowed
- SVG elements of any kind
- Canvas
- Images / background-image with URLs
- JavaScript (pure CSS only)

## Key Challenges
- **Wing shape**: Not a simple ellipse. Need `clip-path: polygon()` with enough points to approximate the curve
- **Beak**: Small triangle — `clip-path` or border hack
- **Legs**: Thin rectangles with `transform: rotate()` for toes
- **Color regions**: CSS can't do per-path fills like SVG; instead use overlapping colored divs with `clip-path`
- **Eye detail**: Nested divs with `border-radius: 50%` and a highlight pseudo-element

## Reference Material
- **Reference image**: `images/baseline.jpg`
- **Color palette** (from baseline.html):
  - Orange body: `#F09060` → `#D86838`
  - Dark wing: `#1D2B3A`
  - Blue-gray strip: `#90B4BC`
  - Yellow belly: `#F4B830` → `#F5A028`
  - Tail: `#E06040`
  - Eye: white sclera, black pupil, white highlight dot
  - Beak: `#4A3728`
  - Legs: `#5C4033`
- **Known proportions**: Head ~30-35% of total width, body rx/ry ~1.8-2.0

## Workflow
1. Read `lessons-learnt.html` for accumulated knowledge
2. Set up the HTML structure: container div (500x500px), nested divs for each feature
3. Style back-to-front using z-index (same painter-model thinking as SVG)
4. 5 render-feedback iterations
5. Add a card to `index.html`
6. Write CSS-specific lessons to `lessons-learnt.html`

## Parallel Safety
This idea is **independent** — it has no dependencies on other ideas and can be run in parallel.

**Files you create** (these are unique to this idea — no conflicts):
- `baseline-css.html`

**Shared files — do NOT modify** (other agents may be writing to these simultaneously):
- `index.html` — do NOT add a gallery card. Instead, create `ideas/06-gallery-card.html` with just the `<a class="card">` snippet to be merged later.
- `lessons-learnt.html` — do NOT edit. Instead, write any new lessons to `ideas/06-lessons.md`.
- `CLAUDE.md` — do NOT edit.

## Acceptance Criteria
- [ ] Bird is recognizable and matches the baseline reference
- [ ] Zero SVG, zero canvas, zero images — pure HTML + CSS
- [ ] No JavaScript
- [ ] Renders correctly in Chrome
- [ ] Head-body junction looks smooth (the CSS equivalent of the seam problem)
- [ ] Lessons written to `ideas/06-lessons.md` (what transfers from SVG, what doesn't)
