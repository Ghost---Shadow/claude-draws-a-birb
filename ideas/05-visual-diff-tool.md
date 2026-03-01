# Idea 05: Visual Diff Tool

## Problem
Currently, drawing quality is evaluated **subjectively** — "looks about right" or "the wing seems too big." There's no quantitative accuracy metric. This makes it hard to compare approaches (is the bezier bird more accurate than the triangle bird?) and hard to know when to stop iterating. A visual diff tool would give a **measurable score**.

## What to Build
A standalone HTML tool (`visual-diff.html`) that:

1. **Side-by-side view**: Load reference image (left) and SVG drawing (right) at matched scale
2. **Overlay mode**: SVG on top of reference at adjustable opacity (slider 0-100%)
3. **Difference heat map**: Pixel-by-pixel comparison showing where the drawing diverges from the reference
   - Render the SVG to a `<canvas>` using `drawImage()` on an `<img>` or inline SVG
   - Render the reference to another canvas at the same dimensions
   - Compute per-pixel color distance (simple Euclidean in RGB space or perceptual deltaE)
   - Display as a heat map (green = close match, red = large divergence)
4. **Accuracy score**: Single number summarizing overall match quality
   - Mean pixel error (lower = better)
   - Percentage of pixels within threshold (e.g. "87% of pixels within deltaE < 20")
   - Structural Similarity Index (SSIM) if feasible in-browser
5. **Region scores**: Click-drag to select a region and get its local accuracy score
   - "Head region: 92% match" vs "Wing region: 74% match"
6. **Comparison mode**: Load two SVG drawings and diff them against the same reference to see which is more accurate

## Technical Approach
```javascript
// Core diff logic
function computeDiff(refCanvas, svgCanvas) {
  const refData = refCtx.getImageData(0, 0, w, h).data;
  const svgData = svgCtx.getImageData(0, 0, w, h).data;
  let totalError = 0;
  for (let i = 0; i < refData.length; i += 4) {
    const dr = refData[i] - svgData[i];
    const dg = refData[i+1] - svgData[i+1];
    const db = refData[i+2] - svgData[i+2];
    const dist = Math.sqrt(dr*dr + dg*dg + db*db);
    totalError += dist;
    // Write to heat map canvas...
  }
  return totalError / (w * h);
}
```

## Why This Helps
- **Objective quality metric** — stops the guessing about "is this good enough?"
- **Guides iteration** — the heat map shows exactly WHERE to focus fixes
- **Benchmarks approaches** — compare triangle bird vs bezier bird vs flat shapes with numbers
- **Regression detection** — if a change makes the score worse, revert it
- The heat map is essentially an automated version of "zoom in and identify problems" from the render-feedback loop

## Context from This Repo
- The project has 6 drawings of the same `images/baseline.jpg` reference — perfect for comparison
- Existing drawings: `baseline.html`, `baseline-bezier.html`, `baseline-triangle.html`, `baseline-bezier-outline.html`, `baseline-bezier-outline-scanned.html`
- Server runs on port 3456 via `serve.js`
- SVG viewBox is typically 500x500, reference image is 1920x1920

## Parallel Safety
This idea is **independent** — it has no dependencies on other ideas and can be run in parallel.

**Files you create** (these are unique to this idea — no conflicts):
- `visual-diff.html`

**Shared files — do NOT modify** (other agents may be writing to these simultaneously):
- `index.html` — do NOT add a gallery card. Instead, create `ideas/05-gallery-card.html` with just the `<a class="card">` snippet to be merged later.
- `lessons-learnt.html` — do NOT edit. Instead, write any new lessons to `ideas/05-lessons.md`.
- `CLAUDE.md` — do NOT edit.

## Acceptance Criteria
- [ ] Tool loads reference image + SVG drawing
- [ ] Overlay mode with opacity slider works
- [ ] Difference heat map renders correctly
- [ ] Overall accuracy score displayed
- [ ] Region selection for local scores
- [ ] Comparison mode for two drawings against same reference
- [ ] Works in Chrome
