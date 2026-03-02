# Visual Diff Tool — Bug Fixes & Notes

## What Was Fixed

### 1. Background Mismatch (Critical — caused ~97% error inflation)

**Bug:** `renderSvgBlobToImageData` drew the SVG onto a blank canvas whose default
background is transparent (composited to black by the browser). The reference photo
(`images/baseline.jpg`) has a pure white background. Every background pixel contributed
a maximum-error diff (~255 per channel), making the "Pixels Within Threshold" score as
low as 10% even for visually accurate drawings.

**Fix:** Before drawing the SVG, fill the canvas with white (`ctx.fillStyle = '#ffffff';
ctx.fillRect(...)`). This matches the reference photo background and makes the scores
reflect actual drawing accuracy rather than background contrast.

**Effect:** `baseline.html` went from mean error 359/441 (10% within threshold) to
mean error 33.8/255 (77% within threshold).

### 2. Threshold Slider Units Were Wrong

**Bug:** The threshold slider ranged 5–100 and was mapped to RGB Euclidean distance via
`threshold / 100 * 441`. A slider value of "30" meant a threshold of 132 Euclidean units,
which was unintuitive and undocumented.

**Fix:** Changed the slider range to 1–255 and the mapping to `threshold * sqrt(3)`.
Now the slider value directly represents the allowed difference per colour channel
(0–255 scale), matching the "Mean Error (0–255)" and "Max Error (0–255)" score labels.

### 3. Scores Not Shown in Side-by-Side and Overlay Modes

**Bug:** `renderSideBySide` and `renderOverlay` never called `updateScores`, so the
score bar always showed "—" in those modes.

**Fix:** Both functions now compute `computeDiff` and call `updateScores` after rendering.

### 4. Mean/Max Error Display Not Normalised

**Bug:** `updateScores` displayed raw RGB Euclidean distance (0–441 range) but the
threshold slider and user mental model expected 0–255 per-channel units.

**Fix:** `updateScores` now divides mean and max error by `sqrt(3)` before display,
converting Euclidean → per-channel equivalent. Score labels updated to say "(0–255)".

### 5. Blob URL Leaks

**Bug:** `renderSvgBlobToImageData` called `URL.revokeObjectURL(url)` unconditionally,
which would fail silently if `url` was a regular file path (not a blob URL). When called
from `renderHtmlUrlToImageData` with the serialized SVG blob, the blob URL was never
revoked at all.

**Fix:** Added `isBlobUrl` boolean parameter to `renderSvgBlobToImageData`. Callers
pass `true` only for blob URLs created via `URL.createObjectURL`. The serialized SVG
blob from `renderHtmlUrlToImageData` also now correctly passes `isBlobUrl=true`.

## How It Works

### Rendering HTML/SVG Drawings to Canvas

The tool cannot use `html2canvas` or browser screenshot APIs (cross-origin restrictions,
no `drawWindow` outside Firefox). Instead it:

1. Loads the drawing's HTML page into a hidden off-screen `<iframe>`
2. Extracts the first `<svg>` element from the iframe's DOM
3. Serialises it with `XMLSerializer`
4. Creates a blob URL and draws it via `<img>` onto a 500×500 canvas
5. Reads back `ImageData` for pixel-level comparison

This works for all same-origin HTML pages that contain a `<svg>` element.

### Diff Computation

Per-pixel RGB Euclidean distance: `sqrt(dR² + dG² + dB²)`, range 0–441.
Displayed as normalised 0–255 (divided by `sqrt(3)`).
Heatmap: green (0 error) → yellow → red (441 error).

### Accuracy Scores

| Metric | Description |
|---|---|
| Mean Error (0–255) | Average per-pixel colour distance, normalised to per-channel scale |
| Pixels Within Threshold | % of pixels where error ≤ threshold slider value |
| Max Error (0–255) | Worst single pixel, normalised |

A score of 77% within threshold at threshold=30 means 77% of pixels have all three
colour channels within ±30/255 of the reference.

## Known Limitations

- Only compares the first `<svg>` element in the HTML page (sufficient for all
  drawings in this project — they each have exactly one `<svg>`)
- The drawing SVG is rendered without its surrounding page CSS (body background,
  shadows etc.), then composited over white. Drawings that rely on a coloured body
  background to fill the SVG frame will show background mismatch in edge areas.
- `<filter>` effects that reference external resources (cross-origin) may not render
  in the serialized blob context
