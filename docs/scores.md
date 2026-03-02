# Visual Diff Scores — Claude Draws a Birb

Scores computed via pixel-level RGB Euclidean distance against the reference photo,
using the same algorithm as `visual-diff.html`. All drawings rendered at 500×500 px,
white-backed, then compared pixel-by-pixel to the reference image scaled to 500×500.

**Score formula:** `max(0, 100 − meanError / 2)` where meanError is the mean per-pixel
RGB Euclidean distance across all 250,000 pixels (range 0–441).

**Threshold:** "within-threshold" counts pixels whose distance ≤ 132 (= 30% of 441 max).

Scores run: 2026-03-02. Tool: visual-diff.html + automated iframe/canvas pipeline.

---

## Ranked Table — All Drawings

| Rank | File | Reference | Score /100 | Mean Error | % Within Threshold | Max Error |
|-----:|------|-----------|:----------:|:----------:|:------------------:|:---------:|
| 1 | baseline-triangle.html | baseline.jpg | **94** | 12.7 | 96.8% | 376 |
| 2 | baseline-bezier-outline-scanned.html | baseline.jpg | **78** | 43.9 | 83.4% | 375 |
| 2 | baseline-bezier-outline.html | baseline.jpg | **78** | 44.3 | 83.2% | 375 |
| 4 | baseline-bezier.html | baseline.jpg | **76** | 47.6 | 82.2% | 375 |
| 5 | baseline-silhouette.html | baseline.jpg | **75** | 49.1 | 82.7% | 376 |
| 6 | baseline.html | baseline.jpg | **71** | 58.5 | 77.9% | 376 |
| 7 | baseline-css.html | baseline.jpg | **~68** | ~64 | ~76% | — |
| 8 | baseline-cutout.html | baseline.jpg | **30** | 140.7 | 53.6% | 371 |
| 9 | hummingbird.html | hummingbird.jpg | **32** | 136.6 | 59.5% | 436 |
| 10 | traced.html | robin.jpg | **25** | 149.8 | 46.8% | 431 |
| 11 | bluejay.html | bluejay.jpg | **15** | 169.0 | 27.8% | 418 |
| 12 | freehand.html | robin.jpg | **0** | 202.1 | 19.3% | 432 |

> baseline-css.html: no SVG element; scored manually via CSS coordinate/color inspection.
> Colors and geometry match baseline.html exactly but rendered via CSS polygon clip-path
> rather than SVG paths, producing slight aliasing differences. Score estimated ~68.

---

## Per-Drawing Error Breakdown

### 1. baseline-triangle.html — Score 94

**Reference:** images/baseline.jpg

| Region | Mean Error | Notes |
|--------|:----------:|-------|
| legs | 42 | Thin leg rects in SVG vs smooth photo rendering |
| body | 34 | Minor triangle seam lines visible at edges |
| head | 33 | Slight colour mismatch at head-body boundary |
| tail | 23 | Good shape match |
| background | 0 | Transparent — matches reference white/near-white |

**Dominant error type:** `seam-gap` — sub-pixel anti-aliasing gaps between same-coloured
adjacent triangles are visible in the body and head zones, causing small but consistent
per-pixel errors. Legs show minor `wrong-proportion` (slightly thicker than reference).

**Heat-map pattern:** Uniformly green across most of the canvas with faint yellow seam
lines at triangle boundaries. The background zones (outside the bird) score near-zero.

---

### 2. baseline-bezier-outline-scanned.html — Score 78

**Reference:** images/baseline.jpg

| Region | Mean Error | Notes |
|--------|:----------:|-------|
| body | 154 | Large unfilled centre — photo has solid orange, drawing has white |
| head | 130 | White interior where photo has dark navy |
| tail | 68 | Tail outline matches shape but interior is white |
| legs | 37 | Legs drawn as strokes; thin but correctly positioned |
| background | 0 | Transparent |

**Dominant error type:** `missing-detail` — stroke-only (fill="none") technique means
the interior of every bird region is white (transparent + white canvas) while the photo
shows solid colour fills. The outline paths themselves are well-placed (scanner-derived
coordinates), so shape accuracy is high; the error is purely due to missing interior fill.

---

### 3. baseline-bezier-outline.html — Score 78

**Reference:** images/baseline.jpg

| Region | Mean Error | Notes |
|--------|:----------:|-------|
| body | 156 | Same fill-missing issue as scanned variant |
| head | 130 | Same — navy head interior is white in drawing |
| tail | 73 | Slightly higher than scanned; Catmull-Rom path differs |
| legs | 37 | Good stroke placement |
| background | 0 | Transparent |

**Dominant error type:** `missing-detail` — same stroke-only constraint. Marginally worse
than the scanner variant because Catmull-Rom hand-fitted control points differ slightly
from pixel-traced coordinates (especially tail curvature).

---

### 4. baseline-bezier.html — Score 76

**Reference:** images/baseline.jpg

| Region | Mean Error | Notes |
|--------|:----------:|-------|
| body | 149 | Body ellipse approximated by 4 bezier segments — good but slight shape error |
| tail | 134 | Tail path curvature slightly off from reference |
| legs | 114 | Leg position/proportion slightly displaced |
| head | 91 | Best-matching region; k=0.5523 circle approximation accurate |
| background | 0 | Transparent |

**Dominant error type:** `wrong-curve` — all shapes are cubic bezier paths (no primitives).
The bezier approximations of the body ellipse and tail/wing boundaries introduce curve
deviation. The body region error is high because the bezier body outline doesn't perfectly
match the reference silhouette, leaving colour mismatches at the boundary. The seam
between head and body (head-body disconnect) also contributes.

---

### 5. baseline-silhouette.html — Score 75

**Reference:** images/baseline.jpg

| Region | Mean Error | Notes |
|--------|:----------:|-------|
| body | 159 | Single-path silhouette: colour boundary is accurate but interior gradient differs |
| tail | 146 | Tail shape good; colour value slightly off |
| legs | 115 | Leg rects well positioned |
| head | 107 | Head circle accurate; gradient mismatch vs photo |
| background | ~1 | Near-zero |

**Dominant error type:** `wrong-color` — the silhouette approach uses a solid/gradient fill
applied via a mask over the whole canvas, so the shape boundary is accurate but the
interior colour gradient doesn't match the photo's natural texture and shading. The
gradient goes from flat SVG colour to the reference photo's complex lighting.

---

### 6. baseline.html — Score 71

**Reference:** images/baseline.jpg

| Region | Mean Error | Notes |
|--------|:----------:|-------|
| legs | 186 | Leg rectangles displaced and shorter than reference |
| tail | 181 | Tail polygon larger and more saturated than reference |
| body | 160 | Body ellipse correct shape but gradient colour diverges from photo |
| head | 115 | Head circle too large (r=70 vs reference ~55px apparent radius) |
| background | 0 | Transparent |

**Dominant error type:** `wrong-proportion` — the original flat geometric bird uses
primitives (ellipse, circle, rect) whose sizes are estimated, not pixel-traced. The head
is too large, legs are shorter/thinner than the reference, and the tail polygon is
oversized. Colours are broadly correct but the proportion errors push region errors high.

---

### 7. baseline-css.html — Score ~68 (manual estimate)

**Reference:** images/baseline.jpg

CSS-only reimplementation of baseline.html geometry (no SVG). Same coordinates and
colours as baseline.html (comment in source confirms "Matching baseline.html SVG
coordinates exactly"). CSS clip-path polygon rendering introduces additional aliasing at
polygon edges compared to SVG path rendering. No SVG gradients available for body/belly,
replaced by CSS linear-gradient (same stops, slightly different rendering).

**Dominant error type:** `wrong-proportion` (inherited from baseline.html) +
`background-mismatch` (CSS renders the `.bird-canvas` background as semi-transparent
dark, whereas the SVG baseline.html has a dark rect fill — similar but not identical pixel
output). Score estimated 2–4 points below baseline.html.

---

### 8. baseline-cutout.html — Score 30

**Reference:** images/baseline.jpg

| Region | Mean Error | Notes |
|--------|:----------:|-------|
| tail | 213 | Tail mask boundary severely off — wrong shape carved |
| legs | 201 | Leg cutout shape diverges from reference |
| body | 163 | Body mask boundary approximately correct but interior still diverges |
| head | 152 | Head region has high error from mask boundary misalignment |
| background (bot) | 147 | Black background bleeds into bottom area |
| background (top) | 104 | Black background in top zone differs from white reference |

**Dominant error type:** `background-mismatch` + `wrong-position` — the subtractive (mask)
technique uses black as the base layer, which creates extreme error against the reference's
white/neutral background. The mask boundaries for tail and legs were not accurately fitted,
so the cutout shapes diverge significantly from the reference silhouette. Even in the bird
interior the colour layering (orange → dark → blue-gray → yellow via masks) produces
noticeable shifts compared to the expected photographic hue at each zone.

---

### 9. hummingbird.html — Score 32

**Reference:** images/hummingbird.jpg

| Region | Mean Error | Notes |
|--------|:----------:|-------|
| bg-top | 232 | SVG has dark teal gradient bg; photo has dark forest background |
| bg-bot | 203 | Same background mismatch in lower zone |
| body | 136 | Hummingbird body slightly wrong size/position |
| tail | 117 | Tail feathers direction roughly correct |
| head | 116 | Head/beak area reasonable shape |
| legs | 103 | Perch/branch contributes to lower zone error |

**Dominant error type:** `background-mismatch` — the SVG uses a decorative teal/dark-green
gradient background with blurred ellipse bokeh elements, while the reference photo has a
naturalistic dark forest background with very different hue distribution. The background
accounts for most of the error. The bird subject itself (body, head, beak) is roughly
correctly shaped and coloured in the teal-green palette, but wrong-position errors exist
because the hummingbird is centred in the 600×470 canvas while the reference photo bird
is off-centre.

---

### 10. traced.html — Score 25

**Reference:** images/robin.jpg

| Region | Mean Error | Notes |
|--------|:----------:|-------|
| bg-bot | 147 | Lower canvas area: metal perch bar vs. photo background |
| tail | 143 | Tail orientation differs — drawing faces left, photo composition differs |
| bg-top | 132 | Green background gradient vs. photo colours |
| legs | 105 | Legs on perch bar vs. reference feet on branch |
| head | 120 | Head slightly over-large |

**Dominant error type:** `background-mismatch` + `wrong-position` — the traced robin uses
a rich illustrated background (green bokeh circles, metal perch bar) that differs
completely from the reference robin.jpg which shows a bird against natural foliage.
The bird subject is better proportioned than freehand.html (body region error=100 vs 125)
but the entire scene composition diverges from the reference.

---

### 11. bluejay.html — Score 15

**Reference:** images/bluejay.jpg

| Region | Mean Error | Notes |
|--------|:----------:|-------|
| bg-bot | 207 | SVG: green tree branch area; photo: grey/brown perch area |
| head | 180 | Blue jay crest protrudes upward; reference has different framing |
| bg-top | 171 | SVG sky gradient vs. photo grey-brown background |
| body | 144 | Blue round body vs. reference's blue jay body shape |
| tail | 140 | Tail feathers direction differs |
| legs | 137 | Feet/perch zone mismatch |

**Dominant error type:** `background-mismatch` + `wrong-position` — the blue jay SVG uses
a bright sky-gradient background (light blue fading to green with branch) while the
reference photo has a uniform grey-brown background with no visible branch context. The
bird body is also centred in the 400×467 canvas while the reference bird occupies a
different fraction of the frame. The crest spike protrudes into the top zone causing extra
head error.

---

### 12. freehand.html — Score 0

**Reference:** images/robin.jpg

| Region | Mean Error | Notes |
|--------|:----------:|-------|
| bg-top | 268 | Dark green gradient background vs. reference foliage colours |
| tail | 200 | Tail drawn pointing left/down; reference tail position different |
| head | 183 | Head proportions roughly correct but position shifted |
| legs | 127 | Legs area differs |
| body | 125 | Body roughly correct colour (orange breast) but shifted |
| bg-bot | 174 | Branch/perch zone not present in reference photo framing |

**Dominant error type:** `background-mismatch` + `wrong-position` — the freehand robin uses
a richly illustrated dark green bokeh background (large blurred circles, branch texture)
which has very high pixel error against the robin.jpg reference's natural foliage green.
The bird itself is drawn at 320×480 canvas at the bottom-centre, while the reference photo
fills 500×500 with a different subject framing. The score of 0 reflects that the mean
error (202) exceeded the 200 threshold for the score formula; the actual drawing quality
of the bird is reasonable — the error is dominated by background and framing mismatch.

---

## Summary — Top 3 Error Categories Across All Drawings

| Rank | Error Category | Count | Affected Drawings |
|-----:|----------------|:-----:|-------------------|
| 1 | **background-mismatch** | 7 | baseline-cutout, hummingbird, traced, bluejay, freehand (primary); baseline-bezier-outline, baseline-bezier-outline-scanned (interior white vs solid fill) |
| 2 | **wrong-proportion** | 5 | baseline.html, baseline-css.html, baseline-bezier.html, baseline-silhouette.html, bluejay.html |
| 3 | **missing-detail** | 3 | baseline-bezier-outline.html, baseline-bezier-outline-scanned.html, baseline-cutout.html |

### Tally by drawing

| Drawing | Primary Error | Secondary Error |
|---------|--------------|----------------|
| baseline-triangle.html | seam-gap | wrong-proportion (legs) |
| baseline-bezier-outline-scanned.html | missing-detail | background-mismatch (interior) |
| baseline-bezier-outline.html | missing-detail | wrong-curve |
| baseline-bezier.html | wrong-curve | wrong-proportion |
| baseline-silhouette.html | wrong-color | wrong-proportion |
| baseline.html | wrong-proportion | wrong-color |
| baseline-css.html | wrong-proportion | background-mismatch |
| baseline-cutout.html | background-mismatch | wrong-position |
| hummingbird.html | background-mismatch | wrong-position |
| traced.html | background-mismatch | wrong-position |
| bluejay.html | background-mismatch | wrong-position |
| freehand.html | background-mismatch | wrong-position |

### Key insight

The **baseline-series drawings** (all drawn against baseline.jpg) score dramatically
better than the **non-baseline drawings** (freehand, traced, bluejay, hummingbird)
because:

1. The baseline reference photo was taken at high resolution with a white/neutral
   background, making pixel matching tractable even without pixel-perfect shapes.
2. The non-baseline drawings were created against photos with complex naturalistic
   backgrounds, but the drawings use illustrated backgrounds (gradient, bokeh, perch
   bars) that diverge strongly from the reference photo's colour distribution.
3. The pixel-diff metric penalises background colour differences equally to subject
   colour differences — drawings with matching background conventions (transparent
   SVG over white vs. white-background photo) score far higher.

**The triangle bird (score 94) is the clear winner** — pixel-scan calibration of
coordinates combined with accurate colour matching produced near-photographic accuracy
in the pixel-diff metric.
