# Idea 01: Reference Grid Overlay Tool

## Problem
When Claude draws SVG from a reference photo, the biggest source of error is **wrong positions**. Claude guesses pixel coordinates and gets proportions wrong — heads too big, wings shifted, legs misplaced. The existing pixel scanner (`baseline-scanner.html`) helps but is complex. There's no simple way for Claude to say "the eye is at grid cell B3" instead of guessing "(247, 183)".

## What to Build
A standalone HTML tool (`grid-overlay.html`) that:

1. Loads any reference image (drag-drop or file picker)
2. Overlays a **labeled grid** on top (columns A-Z, rows 1-N)
3. Grid density is adjustable (e.g. 8x8, 16x16, 32x32)
4. Clicking a cell shows the **pixel coordinates** of its center and corners
5. Clicking a point shows which **grid cell** it falls in
6. Has a "copy coordinates" button that outputs JSON like:
   ```json
   {"cell": "D7", "center": [245, 340], "topLeft": [220, 320], "bottomRight": [270, 360]}
   ```
7. Optional: color-samples the center pixel of each cell and shows a color swatch

## Why This Helps
- Claude can describe layouts in grid terms ("head spans C3-E5") which is far more reliable than raw pixel guessing
- The grid naturally enforces proportion checking — if head takes 6 cells but body only takes 4, something is wrong
- Grid coordinates are easy to convert to SVG viewBox coordinates with simple math
- Works with ANY reference image, not just the baseline bird

## Context from This Repo
- The project lives at `C:\Users\soura\Desktop\claude-draws-a-birb\`
- Existing tools: `baseline-scanner.html` (pixel boundary scanner), `baseline-lineart.html` (calibration overlay)
- Server runs on port 3456 via `serve.js`
- All drawings use HTML+SVG, viewBox typically 500x500
- Add a card to `index.html` gallery and mention in `lessons-learnt.html` if you discover anything new

## Parallel Safety
This idea is **independent** — it has no dependencies on other ideas and can be run in parallel.

**Files you create** (these are unique to this idea — no conflicts):
- `grid-overlay.html`

**Shared files — do NOT modify** (other agents may be writing to these simultaneously):
- `index.html` — do NOT add a gallery card. Instead, create `ideas/01-gallery-card.html` with just the `<a class="card">` snippet to be merged later.
- `lessons-learnt.html` — do NOT edit. Instead, write any new lessons to `ideas/01-lessons.md`.
- `CLAUDE.md` — do NOT edit.

## Acceptance Criteria
- [ ] Tool loads images and renders a labeled grid overlay
- [ ] Grid density is adjustable
- [ ] Click-to-get-coordinates works
- [ ] Output is easily copy-pasteable for use in SVG authoring
- [ ] Works in Chrome (the project's target browser)
