# SVG Drawing Protocol

A step-by-step recipe distilled from 10 drawing sessions and validated against pixel-diff scoring. Follow every phase in order. Do not skip the render-feedback loop.

---

## Phase 1: Reference Analysis (tools mandatory)

1. Load `lessons-learnt.html` using the Read tool (not a screenshot) to pull all accumulated knowledge into context.

2. **Palette extraction** — open `palette-extractor.html` in the browser with the reference image:
   - Load the reference via the file picker.
   - Set k=7 (default) and click Re-analyze.
   - If the image has a plain white/black background, use Region Select to drag a box around the subject only — this weights percentages over subject pixels, not background.
   - For specific feature colours (eye, beak tip, leg), use Click-to-Sample to pin individual pixels.
   - Click "Copy SVG snippet" and paste the result into your new HTML file as a `<!-- palette -->` comment block inside `<defs>`. This is the ground truth for every `fill` and `stroke` value you will write. Do not invent colors from memory.

3. **Grid bounding boxes** — open `grid-overlay.html` in the browser with the same reference image:
   - Load the reference and enable the grid (default 10×10 is adequate).
   - For each major region, note its bounding box in grid coordinates (e.g. "head: cols C–E, rows 2–4").
   - Record at minimum: head, body, wing, tail, breast/bib, legs, beak.
   - For food/objects: main subject, plate/surface, garnish, any distinctive sub-regions.
   - Write these down as comments in your SVG `<defs>` block before writing any shapes.

4. Note the reference image's pixel dimensions (width × height). Decide whether to use a square `viewBox="0 0 500 500"` or one matched to the image (e.g. `0 0 516 780` for a portrait photo). Matching the photo simplifies coordinate mapping.

---

## Phase 2: Skeleton Layout

5. Choose a drawing constraint from the Decision Tree below.

6. Using the grid coordinates from Phase 1, sketch the bounding box for each major region in comments. Convert grid cells to pixel coordinates: `x = col_index × (canvas_width / grid_cols)`.

7. Apply these proportion checks before writing any shape:

   **For a perched bird on a 500×500 canvas:**
   - Head radius: 30–35% of canvas width → ~75–87 px. (r=70 is 47% — too big; r=50 is 34% — correct.)
   - Body aspect ratio: rx/ry ≈ 1.8–2.0. A circular body reads as a ball, not a perched bird.
   - Wing coverage: 45–55% of body area. Its right boundary at mid-height should sit near body center-x.
   - Orange breast (robin): ~55% of frontal body area — the dominant visible colour.
   - Legs: 15–20% of canvas height from body-bottom to foot.

   Cross-check each of these against your grid bounding boxes from Phase 1. If a ratio contradicts the grid position, trust the grid.

8. Run the **dominant colour test**: does your skeleton allocate enough area to the largest colour region? If the wing is larger than the breast on a robin, the skeleton is wrong before you start.

---

## Phase 3: Z-Order Plan

9. List every shape in back-to-front order (SVG painter model — later shapes cover earlier ones).

10. Identify **free masking opportunities**: draw a shape early so a later shape covers most of it, leaving only the visible portion. Example: draw yellow belly before the dark wing — the wing covers 80% of it naturally, leaving a crescent. No `clipPath` needed when overlapping shapes share colour.

11. Rule: **each shape drawn exactly once**. Never double-draw a shape to achieve masking — it doubles coverage and hides underlying layers.

A typical bird z-order:
```
background → branch/perch → tail → body → belly → wing → neck fluff →
head → orange face/bib → eye ring → eye → beak → legs & feet
```

---

## Phase 4: First Pass Drawing

12. Create the HTML file. Use this boilerplate for the SVG container:
    ```html
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
    ```
    Adjust `viewBox` if matching the photo's native resolution for tracing.

13. Add `<defs>` first: paste the palette comment block from Phase 1. Then add gradients, filters, clipPaths. Name them descriptively (`bodyGrad`, `spotFilter`, `bellyClip`).

14. Draw shapes back-to-front per the z-order plan. Use only the hex values from the palette comment block — no placeholder grays, no invented colours.

15. **Seam management**: when two adjacent same-colour shapes must meet without a gap, place the earlier shape's anchor point *inside* the later shape's boundary so the later shape covers the join. For head/body seam: verify `dist(wing_start, head_center) < head_radius`. Keep the anchor at least 10 px inside for safety margin.

16. **Parameter cascade awareness**: if you change body `ry`, that shifts body-bottom y, which shifts leg-start y, which shifts foot y, which shifts shadow y. Work top-to-bottom in a single pass when adjusting proportions — do not fix one number without tracing its downstream effects.

---

## Phase 5: Render-Feedback Loop (5 iterations — mandatory)

This is the single highest-value practice. Never submit a single-pass SVG for a complex subject.

For each iteration:

17. View in browser at 1× zoom — check overall proportions, dominant colour balance, and pose.
18. Zoom to 2× — check seams, gaps, misaligned edges, bleeding filters.
19. Identify the **top 3 most visible problems** specifically (e.g. "head is too large", "orange breast is being hidden by the wing", "beak angle is wrong"). Do not list vague problems.
20. Fix exactly those 3 problems. Do not touch anything else in that iteration.
21. **Optional (recommended at iteration 2 and 4):** open `visual-diff.html`, load the reference and the SVG output side-by-side, and record the score. Note which canvas regions are shown in red on the heat map — these are your highest-error areas. Focus the next iteration's fixes on those regions.
22. Repeat from step 17. Do this **5 times total**.
23. **Stop early** if two consecutive iterations each improve the visual-diff score by fewer than 2 points — the remaining error is structural and needs a different approach, not more tweaking.

If a problem reappears after fixing, it indicates a structural issue (wrong z-order, wrong anchor point, cascaded parameter not updated). Fix the root cause, not the symptom.

**Artist mirror check** (use at iteration 3): add `transform="translate(W,0) scale(-1,1)"` to the root `<g>` and compare the mirrored drawing to the mirrored reference. Proportional errors your brain has adapted to become obvious when flipped.

---

## Phase 6: Polish and Document

24. Add interactive features if useful:
    - **Flip button**: `document.querySelector('.comparison').classList.toggle('flipped')` with CSS `transform: scaleX(-1)` on both SVG and reference image simultaneously.
    - **Fill toggle** for stroke-outline drawings: store colours in `data-fill` attributes on closed paths; JS swaps `fill` between stored colour and `"none"`.
    - **Trace overlay**: `<image>` element inside SVG at `opacity="0"`, toggled by JS.

25. Add a gallery card to `index.html`.

26. Write new lessons to `lessons-learnt.html` (or to `ideas/NN-lessons.md` if running in parallel with other agents). New lessons should be concrete, not generic — state what failed, what fixed it, and the exact numbers or formula if applicable.

---

## Decision Tree: Choosing a Drawing Constraint

```
What effect do you want?
│
├── Painterly, naturalistic, photorealistic
│   └── Filled shapes with gradients + feTurbulence texture
│       → Use: <ellipse>, <path>, radialGradient/linearGradient,
│              feTurbulence filter for spots/feathers
│       → Examples: freehand.html, traced.html, hummingbird.html
│
├── Flat geometric / illustration style
│   └── Solid-fill paths, no blurs
│       → Use: <path> with flat fills and clear colour boundaries
│       → Accuracy demands: get boundary paths right first,
│         no filter to rescue wrong shapes
│       → Example: baseline.html
│
├── Mathematical constraint — all curves, no primitives
│   └── Bezier-only (no <circle>, <ellipse>, <rect>)
│       → Use: <path> with M/C/Z only
│       → Convert ellipses with k=0.5523 formula (see Quick Reference)
│       → Example: baseline-bezier.html
│
├── Geometric-minimal / low-poly aesthetic
│   └── Triangle tessellation
│       → Use: <polygon> triangles only
│       → Fan tessellation for convex regions; strip tessellation for bands
│       → Pixel-scan first to get accurate boundary points
│       → Example: baseline-triangle.html
│
├── Expressive line art / sketch aesthetic
│   └── Stroke-only outlines (fill="none" on every path)
│       → Use: <path> with stroke, no fill
│       → Colour-code strokes by region (not black outlines)
│       → Catmull-Rom → cubic bezier for smooth curves through scanned pts
│       → Example: baseline-bezier-outline.html
│
└── Automated boundary extraction
    └── Pixel scanning + RDP simplification
        → Use: canvas.getImageData, H-scan/V-scan, RDP ε≈12
        → Scan output is a starting point — needs stitching + Catmull-Rom pass
        → Example: baseline-scanner.html, baseline-bezier-outline-scanned.html
```

---

## Common Pitfalls Checklist

Check each item before finalising. If the answer is "yes", fix it.

| # | Pitfall | Check |
|---|---------|-------|
| 1 | Colours not from palette extractor | Did you use hex values from `palette-extractor.html`? If any colour was typed from memory, replace it. |
| 2 | Grid bounding boxes not recorded | Did you note head/body/wing/tail positions from `grid-overlay.html` before drawing? If not, check proportions against the grid now. |
| 3 | Radial gradient on a flat surface | Does any flat food/plate/table use a center-bright `radialGradient`? → Looks like a sphere. Switch to `linearGradient`. |
| 4 | Head too large | Is `head_radius > 35% of canvas_width`? On a 500px canvas r=70 is 47% — too big. Target r≈50 (34%). |
| 5 | Body too circular | Is body `rx/ry < 1.5`? A circle reads as a ball. Perched birds need rx/ry ≈ 1.8–2.0. |
| 6 | Filter bleeding | Does the filter's `x/y/width/height` region extend beyond the associated `clipPath`? Constrain to match. |
| 7 | Parameter cascade not propagated | Did you change body `ry` (or any anchor shape) without updating all downstream coordinates? Fix top-to-bottom in one pass. |
| 8 | Shape drawn twice for masking | Is any shape drawn more than once? Remove all but the first occurrence; use z-order instead. |
| 9 | Wing too dominant | Does the wing cover more than half the frontal body area on a robin? The orange breast should be the largest visible region. |
| 10 | Seam gap at head/body join | Is `dist(wing_start, head_center) >= head_radius`? Place anchor inside head circle (≥10px margin). |
| 11 | Single-pass drawing | Did you skip the 5-iteration render-feedback loop? Go back to Phase 5. |
| 12 | Wrong scan axis | Using H-scan for the back arch (mostly-horizontal boundary)? Use V-scan instead. H-scan suits vertical boundaries (breast, tail sides). |
| 13 | Score plateau ignored | Two iterations with <2 point gain? Stop tweaking and fix the structural root cause. |

---

## Scoring Baseline

Scores computed by `visual-diff.html` using pixel-level RGB Euclidean distance. Formula: `max(0, 100 − meanError / 2)`. All drawings rendered at 500×500 px against the reference scaled to 500×500.

**Benchmark table (baseline.jpg reference, measured 2026-03-02):**

| Drawing | Score | Method |
|---------|:-----:|--------|
| baseline-triangle.html | **94** | Pixel-scanned coordinates + calibration overlay |
| baseline-bezier-outline-scanned.html | **78** | Auto-scanned paths, stroke-only |
| baseline-bezier-outline.html | **78** | Hand-fitted Catmull-Rom, stroke-only |
| baseline-bezier.html | **76** | k=0.5523 ellipse conversion |
| baseline-silhouette.html | **75** | Single-path silhouette |
| baseline.html | **71** | Eyeballed primitives, no tools |

**Targets for new drawings:**

- Flat-illustration reference (white/neutral background): score **≥ 76** using this protocol. The freehand baseline without tools scores ~71; the 5-point minimum gain comes from palette accuracy + grid proportions.
- Photorealistic reference (complex background): score **≥ 40** on full-canvas metric. Background-mismatch dominates these scores — the subject region will look better than the number suggests. A subject-masked score of ≥ 70 is achievable with pixel-scanned coordinates.
- Triangle/scanned technique on any reference: aim for **≥ 90**.

**Key insight from the data:** the 23-point gap between the best freehand drawing (71) and the pixel-scanned drawing (94) is entirely from spatial accuracy. Palette tools address colour error (~5 points estimated). Grid overlay addresses proportion error (10–20 points estimated). Together they should close most of the freehand-to-scanned gap without requiring pixel scanning.

---

## Quick Reference

### Tool Paths

| Tool | Purpose |
|------|---------|
| `palette-extractor.html` | Extract exact hex values from any reference image (k-means++ in Lab space) |
| `grid-overlay.html` | Overlay a grid on the reference to record bounding boxes per feature |
| `visual-diff.html` | Pixel-diff score + heat map between SVG output and reference |

### Cubic Bezier Approximation of an Ellipse (k = 0.5523)

Convert `<ellipse cx cy rx ry>` to four cubic bezier segments:

```
M  cx,      cy-ry
C  cx+k·rx, cy-ry    cx+rx,  cy-k·ry   cx+rx,  cy
C  cx+rx,   cy+k·ry  cx+k·rx,cy+ry     cx,     cy+ry
C  cx-k·rx, cy+ry    cx-rx,  cy+k·ry   cx-rx,  cy
C  cx-rx,   cy-k·ry  cx-k·rx,cy-ry     cx,     cy-ry  Z
```

### Catmull-Rom to Cubic Bezier (smooth curve through scanned points)

For the segment Pᵢ → Pᵢ₊₁ in a sequence P₀ … Pₙ:

```
CP1 = Pᵢ   + (Pᵢ₊₁ − Pᵢ₋₁) / 6
CP2 = Pᵢ₊₁ − (Pᵢ₊₂ − Pᵢ)   / 6
```

At endpoints, mirror the missing neighbor: P₋₁ = P₀ (start), Pₙ₊₁ = Pₙ (end).

### Fan Tessellation Centroid

Place the fan center near the **geometric centroid** of the region (average of all perimeter points). This minimises the longest spoke and avoids thin slivers. The centroid becomes the visual focal point of all seam lines — choose it deliberately.

### Coordinate Scaling (calibration overlay → drawing canvas)

```
scale = drawing_canvas_size / reference_photo_size
      = 500 / 1920  =  0.2604   (for baseline.jpg)

x_drawing = x_photo × scale
y_drawing = y_photo × scale
```

### Proportion Rules (perched bird, 500×500 canvas)

| Proportion | Rule |
|-----------|------|
| Head radius | 30–35% of canvas width (r ≈ 50 on 500px canvas) |
| Body rx/ry | 1.8–2.0 (not circular) |
| Wing coverage | 45–55% of body area |
| Orange breast (robin) | ~55% of frontal body area |
| Legs height | 15–20% of canvas height |
| Head-to-body width | 30–35% |

### Pixel Scan Guidance

| Feature geometry | Scan type | Method |
|-----------------|-----------|--------|
| Mostly-vertical boundary (breast, tail sides) | H-scan | leftmost / rightmost x per row y |
| Mostly-horizontal boundary (back arch, belly bottom) | V-scan | topmost / bottommost y per column x |
| RDP simplification step | — | ε ≈ 12 at step 4 for 1920 px ref → 500 px drawing |

### feTurbulence Organic Texture Recipe

```svg
<filter id="spotFilter" color-interpolation-filters="sRGB">
  <feTurbulence type="turbulence" baseFrequency="0.038 0.028"
    numOctaves="3" seed="11" result="noise"/>
  <feColorMatrix type="matrix"
    values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  8 0 0 0 -3.2"
    in="noise" result="blobAlpha"/>
  <feComposite in="SourceGraphic" in2="blobAlpha" operator="in"/>
  <feGaussianBlur stdDeviation="1.2"/>
</filter>
```

Tuning: lower `baseFrequency` → bigger blobs. Higher alpha multiplier (the `8`) → sharper edges. Asymmetric frequency (e.g. `0.042 0.024`) → horizontal streaks, good for cooked food textures.

---

## HTML File Boilerplate

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claude Draws a Birb - [Subject]</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      background: linear-gradient(135deg, #2d5016 0%, #4a7c23 30%, #3d6b1c 60%, #1a3a0a 100%);
      font-family: Georgia, serif;
      color: #e8dcc8;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1.5rem;
    }
    .comparison {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      justify-content: center;
      align-items: flex-start;
    }
    .comparison.flipped svg,
    .comparison.flipped img { transform: scaleX(-1); }
    svg {
      background: rgba(255,255,255,0.05);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    img {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      max-height: 500px;
    }
  </style>
</head>
<body>
  <h1>Claude Draws a Birb</h1>
  <button onclick="document.querySelector('.comparison').classList.toggle('flipped')">
    Flip Both (Artist Mirror)
  </button>
  <div class="comparison">
    <div>
      <p>My SVG Drawing</p>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
        <defs>
          <!--
            PALETTE (from palette-extractor.html — replace with actual values):
            #XXXXXX  color-name  XX%  (region: body / wing / breast / etc.)
          -->
          <!--
            GRID BOUNDING BOXES (from grid-overlay.html — replace with actual values):
            head:   cols X–X, rows X–X  → approx (x1,y1)–(x2,y2) px
            body:   cols X–X, rows X–X
            wing:   cols X–X, rows X–X
            tail:   cols X–X, rows X–X
            breast: cols X–X, rows X–X
            legs:   cols X–X, rows X–X
            beak:   cols X–X, rows X–X
          -->
          <!-- gradients, filters, clipPaths here -->
        </defs>
        <!-- shapes back-to-front -->
      </svg>
    </div>
    <div>
      <p>Reference Photo</p>
      <img src="images/[reference].jpg" alt="[Subject] reference photo">
    </div>
  </div>
</body>
</html>
```

---

## Acceptance Criteria for a Session

Before marking a drawing complete, confirm:

- [ ] All 6 phases followed in order
- [ ] `palette-extractor.html` run; hex values pasted into SVG `<defs>` comment
- [ ] `grid-overlay.html` run; bounding boxes recorded in SVG `<defs>` comment
- [ ] All colours in the SVG sourced from the palette comment — no invented hex values
- [ ] Dominant colour test passed (largest colour region is visually largest)
- [ ] Proportion checks passed (head radius, body aspect ratio, wing coverage)
- [ ] 5 render-feedback iterations completed
- [ ] `visual-diff.html` score recorded at iteration 2 and iteration 4
- [ ] Score meets or exceeds target for reference type (≥76 flat-illustration, ≥40 photorealistic)
- [ ] Artist mirror check done at iteration 3
- [ ] All 13 pitfalls in the checklist reviewed
- [ ] New lessons written to `lessons-learnt.html` (or `ideas/NN-lessons.md`)
- [ ] Gallery card added to `index.html`
- [ ] File committed with a descriptive message
