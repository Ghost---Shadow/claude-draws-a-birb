# SVG Drawing Protocol

A step-by-step recipe distilled from 10 drawing sessions. Follow every phase in order. Do not skip the render-feedback loop.

---

## Phase 1: Reference Analysis

1. Load `lessons-learnt.html` using the Read tool (not a screenshot) to load all accumulated knowledge into context.
2. Load the reference image. Note its pixel dimensions (width × height).
3. Extract the dominant color palette — identify the 4–8 most prominent colors and estimate their area percentage. Orange breast ~55%? Dark wing ~25%? Use these to set expectations before drawing a single shape.
4. Identify the major regions and approximate their bounding boxes in image-pixel coordinates:
   - For birds: head, body, wing, tail, breast/bib, belly, legs, beak, eye
   - For food/objects: main subject, plate/surface, garnish, background
5. Note the aspect ratio of the subject. Decide whether to use a square viewBox (500×500) or one matched to the image (e.g. 516×780 for a portrait photo). Matching the photo simplifies tracing.

---

## Phase 2: Skeleton Layout

6. Choose a drawing constraint from the Decision Tree below.
7. Sketch the bounding box for each major region mentally or in comments, using the coordinates from step 4.
8. Apply these proportion checks before writing any SVG:

   **For a perched bird on a 500×500 canvas:**
   - Head radius: 30–35% of canvas width → ~75–87 px. (r=70 is 47% of 500 — too big; r=50 is 34% — correct.)
   - Body aspect ratio: rx/ry ≈ 1.8–2.0. A circular body reads as a ball, not a perched bird.
   - Wing coverage: 45–55% of body area. Its right boundary at mid-height should sit near body center-x.
   - Orange breast (robin): ~55% of the frontal body area — it should be the dominant visible color.
   - Legs: 15–20% of canvas height from body-bottom to foot.

9. Run the **dominant color test**: does your skeleton give enough area to the largest color region? If the wing is bigger than the breast on a robin, the skeleton is wrong before you start.

---

## Phase 3: Z-Order Plan

10. List every shape in back-to-front order (SVG painter model — later shapes cover earlier ones).
11. Identify **free masking opportunities**: draw a shape early so a later shape covers most of it, leaving only the visible portion. Example: draw yellow belly before the dark wing — the wing covers 80% of it naturally, leaving a crescent. No `clipPath` needed.
12. Rule: **each shape drawn exactly once**. Never double-draw a shape to achieve masking — it doubles coverage and hides underlying layers.

A typical bird z-order:
```
background → branch/perch → tail → body → belly → wing → neck fluff →
head → orange face/bib → eye ring → eye → beak → legs & feet
```

---

## Phase 4: First Pass Drawing

13. Create the HTML file. Use this boilerplate for the SVG container:
    ```html
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
    ```
    Adjust `viewBox` if matching the photo's native resolution for tracing.

14. Add `<defs>` first: gradients, filters, clipPaths. Name them descriptively (`bodyGrad`, `spotFilter`, `bellyClip`).

15. Draw shapes back-to-front per the z-order plan. Use the color palette from Phase 1 — no placeholder grays.

16. **Seam management**: when two adjacent same-color shapes must meet without a gap, place the earlier shape's anchor point *inside* the later shape's boundary so the later shape covers the join. For head/body seam: verify `dist(wing_start, head_center) < head_radius`. Keep the anchor at least 10 px inside for safety margin.

17. **Parameter cascade awareness**: if you change body `ry`, that shifts body-bottom y, which shifts leg-start y, which shifts foot y, which shifts shadow y. Work top-to-bottom in a single pass when adjusting proportions — do not fix one number without tracing its downstream effects.

---

## Phase 5: Render-Feedback Loop (5 iterations — mandatory)

This is the single highest-value practice. Never submit a single-pass SVG for a complex subject.

For each iteration:

18. View in browser at 1× zoom — check overall proportions, dominant color balance, and pose.
19. Zoom to 2× — check seams, gaps, misaligned edges, bleeding filters.
20. Identify the **top 3 most visible problems** specifically (e.g. "head is too large", "orange breast is being hidden by the wing", "beak angle is wrong"). Do not list vague problems.
21. Fix exactly those 3 problems. Do not touch anything else in that iteration.
22. Repeat from step 18. Do this **5 times total**.

If a problem reappears after fixing, it indicates a structural issue (wrong z-order, wrong anchor point, cascaded parameter not updated). Fix the root cause, not the symptom.

**Artist mirror check** (use at iteration 3): add `transform="translate(W,0) scale(-1,1)"` to the root `<g>` and compare the mirrored drawing to the mirrored reference. Proportional errors your brain has adapted to become obvious when flipped.

---

## Phase 6: Polish and Document

23. Add interactive features if useful:
    - **Flip button**: `document.querySelector('.comparison').classList.toggle('flipped')` with CSS `transform: scaleX(-1)` on both SVG and reference image simultaneously.
    - **Fill toggle** for stroke-outline drawings: store colors in `data-fill` attributes on closed paths; JS swaps `fill` between stored color and `"none"`.
    - **Trace overlay**: `<image>` element inside SVG at `opacity="0"`, toggled by JS.

24. Add a gallery card to `index.html`.

25. Write new lessons to `lessons-learnt.html` (or to `ideas/NN-lessons.md` if running in parallel with other agents). New lessons should be concrete, not generic — state what failed, what fixed it, and the exact numbers or formula if applicable.

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
│       → Use: <path> with flat fills and clear color boundaries
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
│       → Color-code strokes by region (not black outlines)
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
| 1 | Radial gradient on a flat surface | Does any flat food/plate/table use a center-bright `radialGradient`? → Looks like a sphere. Switch to `linearGradient`. |
| 2 | Head too large | Is `head_radius > 35% of canvas_width`? On a 500px canvas r=70 is 47% — too big. Target r≈50 (34%). |
| 3 | Body too circular | Is body `rx/ry < 1.5`? A circle reads as a ball. Perched birds need rx/ry ≈ 1.8–2.0. |
| 4 | Filter bleeding | Does the filter's `x/y/width/height` region extend beyond the associated `clipPath`? Constrain to match. |
| 5 | Parameter cascade not propagated | Did you change body `ry` (or any anchor shape) without updating all downstream coordinates? Fix top-to-bottom in one pass. |
| 6 | Shape drawn twice for masking | Is any shape drawn more than once? Remove all but the first occurrence; use z-order instead. |
| 7 | Wing too dominant | Does the wing cover more than half the frontal body area on a robin? The orange breast should be the largest visible region. |
| 8 | Seam gap at head/body join | Is `dist(wing_start, head_center) >= head_radius`? Place anchor inside head circle (≥10px margin). |
| 9 | Single-pass drawing | Did you skip the 5-iteration render-feedback loop? Go back to Phase 5. |
| 10 | Wrong scan axis | Using H-scan for the back arch (mostly-horizontal boundary)? Use V-scan instead. H-scan suits vertical boundaries (breast, tail sides). |

---

## Quick Reference Formulas

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
      = 500 / 1920  =  0.2604   (for the baseline.jpg reference)

x_drawing = x_photo × scale
y_drawing = y_photo × scale
```

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
- [ ] Dominant color test passed (largest color region is visually largest)
- [ ] 5 render-feedback iterations completed
- [ ] Artist mirror check done at iteration 3
- [ ] All 10 pitfalls in the checklist reviewed
- [ ] New lessons written to `lessons-learnt.html` (or `ideas/NN-lessons.md`)
- [ ] Gallery card added to `index.html`
- [ ] File committed with a descriptive message
