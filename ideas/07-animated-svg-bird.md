# Idea 07: Animated SVG Bird

## Problem
Every drawing in the project is static. Animation tests whether Claude's spatial understanding extends to **temporal sequences** — can it make a bird breathe, blink, hop, or turn its head? SVG has built-in animation via `<animate>`, `<animateTransform>`, and `<animateMotion>`, plus CSS `@keyframes` works on SVG elements. This is a new axis of complexity.

## What to Build
A new file (`baseline-animated.html`) based on the baseline bird, with **3-5 subtle, looping animations**:

### Suggested Animations (pick at least 3)
1. **Breathing**: Gentle body scale oscillation (scaleY 1.0 → 1.02 → 1.0 over ~3s). The body inflates/deflates slightly. Anchor the transform at the belly-bottom so it grows upward.
2. **Blinking**: Eye closes and reopens every ~4s. The pupil circle shrinks vertically to a thin line, holds 0.1s, then reopens. Use `<animate attributeName="ry" values="..." />`.
3. **Tail bob**: Tail rotates ±3 degrees slowly, as if balancing. `<animateTransform type="rotate" from="-3" to="3" />` with `repeatCount="indefinite"` and `dur="2s"`.
4. **Head tilt**: Head group rotates ±5 degrees on a slow cycle, as if the bird is looking around.
5. **Feather ruffle**: Wing path control points shift slightly using CSS `@keyframes` on a `<path>` element's `d` attribute (only works in Chrome with `d: path(...)` in CSS).
6. **Foot grip**: Toes flex slightly, as if adjusting grip on a branch.

### Animation Approach Options
- **SMIL (`<animate>`)**: Native SVG, no JS needed, declarative timing. Best for attribute animations.
- **CSS `@keyframes`**: Works on SVG elements, easier to chain. Better for transforms.
- **Hybrid**: SMIL for geometry changes (ry, d), CSS for transforms (rotate, scale).

## Key Technical Challenges
- **Transform origins**: SVG `transform-origin` defaults to (0,0), not center. Must set explicitly per element or use `transform-box: fill-box`.
- **Coordinating timing**: Breathing and head-tilt shouldn't sync perfectly — offset their start times for naturalism.
- **Path morphing**: Animating `d` attribute requires same number of control points in start/end states.
- **Performance**: Keep it simple. Too many concurrent animations on complex paths can jank.

## Reference Material
- **Base drawing**: `baseline.html` or `baseline-bezier.html` (bezier version has explicit control points, easier to animate)
- **Color palette**: Same as baseline (`#F09060`, `#1D2B3A`, `#90B4BC`, etc.)
- Read `lessons-learnt.html` for shape proportions and z-order conventions

## Workflow
1. Start from a copy of the baseline bird (flat shapes version or bezier version)
2. Group SVG elements into logical groups (`<g id="head">`, `<g id="body">`, `<g id="tail">`, etc.)
3. Add animations one at a time, verify each in the browser
4. Tune timing to feel natural (not robotic)
5. 5 render-feedback iterations (now including timing/motion review)
6. Add card to `index.html`, write animation-specific lessons

## Parallel Safety
This idea is **independent** — it has no dependencies on other ideas and can be run in parallel.

**Files you create** (these are unique to this idea — no conflicts):
- `baseline-animated.html`

**Shared files — do NOT modify** (other agents may be writing to these simultaneously):
- `index.html` — do NOT add a gallery card. Instead, create `ideas/07-gallery-card.html` with just the `<a class="card">` snippet to be merged later.
- `lessons-learnt.html` — do NOT edit. Instead, write any new lessons to `ideas/07-lessons.md`.
- `CLAUDE.md` — do NOT edit.

## Acceptance Criteria
- [ ] At least 3 distinct animations running simultaneously
- [ ] Animations loop seamlessly (no visible reset/snap)
- [ ] Movement looks natural, not mechanical
- [ ] No JavaScript required for core animations (SMIL and/or CSS only)
- [ ] Optional: pause/play button (this can use JS)
- [ ] Renders smoothly in Chrome
- [ ] Lessons written to `ideas/07-lessons.md`
