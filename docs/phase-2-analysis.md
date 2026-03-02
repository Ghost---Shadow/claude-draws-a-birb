# Phase 2 Analysis: What the Scores Actually Tell Us

## The Raw Data

| Drawing | Score | Process Used |
|---------|:-----:|-------------|
| baseline-triangle | 94 | Pixel-scanned coordinates, calibration overlay |
| baseline-bezier-outline-scanned | 78 | Pixel-scanned, auto-generated paths |
| baseline-bezier-outline | 78 | Hand-fitted Catmull-Rom |
| baseline-bezier | 76 | k=0.5523 circle/ellipse conversion |
| baseline-silhouette | 75 | Single-path silhouette with overlaid regions |
| baseline | 71 | Freehand shapes, eyeballed proportions |
| baseline-css | ~68 | CSS clip-path replicating baseline.html |
| baseline-cutout | 30 | Subtractive mask technique |
| hummingbird | 32 | Freehand against photorealistic ref |
| traced | 25 | Traced with overlay |
| bluejay | 15 | Freehand against photorealistic ref |
| freehand | 0 | Freehand, no overlay |

## The Gap That Matters

```
Pixel-scanned (triangle):  94
Best freehand (baseline):  71
                          ----
Gap:                       23 points
```

That 23-point gap is **entirely from spatial accuracy** — both use the same colors,
same shapes, same z-order. The only difference is that the triangle bird used
`canvas.getImageData` to extract exact boundary coordinates, while the baseline bird
used eyeballed proportions.

23 points from proportions alone. That's the single biggest lever.

## The Metric Problem

Before we optimize against the metric, we need to fix it. Currently:

1. **Background dominates scoring.** For non-baseline drawings (hummingbird, bluejay,
   freehand, traced), 60-70% of canvas pixels are background. The SVG background
   (gradient, bokeh) diverges completely from the photo background. The bird itself
   might be decent but the score reads 0-32.

2. **Background match ≠ drawing skill.** The baseline series scores high partly because
   baseline.jpg has a white background and SVGs default to transparent-on-white. This
   is a free 60% of pixels matching for zero effort.

**Fix needed:** Score only the subject region (mask out background).

Simplest approach: exclude pixels that are near-white (deltaE < 15 from #FFFFFF) in
the reference image. This removes the background from both flat-bg and white-bg images.
For photorealistic references with complex backgrounds, a manual mask region would be
needed.

## What Compounds (in priority order)

### 1. Spatial accuracy (23-point gap)
**Evidence:** Triangle bird (pixel-scanned) vs baseline (eyeballed): 94 vs 71.
**Fix:** Grid overlay for bounding boxes OR lightweight pixel scanning.
**Expected gain:** 10-20 points on subject-masked score.

### 2. Color accuracy (~5 point gap estimated)
**Evidence:** Palette extractor found reference colors within 5-10 hex units of what
was used. The silhouette bird (score 75) has "wrong-color" as primary error — its
gradients don't match the reference's flat fills.
**Fix:** Palette extractor → mandatory protocol step.
**Expected gain:** 3-8 points.

### 3. Curve accuracy (~3 point gap estimated)
**Evidence:** Bezier bird (76) vs triangle bird (94). Both have correct proportions
(bezier used the same layout), but bezier curves approximate where triangles
interpolate exactly.
**Fix:** More control points on bezier paths, or Catmull-Rom through denser samples.
**Expected gain:** 2-5 points.

## What Doesn't Compound (deprioritize)

- **New drawing constraints** (CSS-only, cutout, animated) — fun but 0 accuracy gain
- **More subjects** without fixing the process — just adds more 71-scored drawings
- **Component library** — packages the current (unreliable) shapes, not the fix

## Next Actions

1. **Fix the metric** — add subject-mask scoring to visual-diff.html
2. **Verify grid overlay works** — it was built by a rate-limited agent, may have bugs
3. **Integrate tools into DRAWING-PROTOCOL.md** — mandate palette extraction +
   grid bounding boxes as required steps before any drawing
4. **A/B validation test** — new reference, draw twice (old vs new process), score both

If step 4 shows the new process scores higher → the loop compounds. Repeat.
If not → the fixes missed the bottleneck. Re-analyze.
