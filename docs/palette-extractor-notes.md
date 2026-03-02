# Palette Extractor — Test Report

Date: 2026-03-02

## Tool summary

`palette-extractor.html` loads an image via drag-drop or file picker, runs k-means++ clustering
in Lab colour space on a sub-sampled pixel set (~8 000 points), and displays swatches with hex,
colour name, and area percentage. Additional features: click-to-sample, region-select, and three
copy formats (SVG comment block, CSS vars, plain hex list).

---

## baseline.jpg results (flat geometric robin — white background)

Tested at k=7 (default). Image is 1920×1920, scaled to 520×520, step=34, ~7 950 pts sampled.

### Full-image palette (k=7)

| # | Hex       | Name                  | %     |
|---|-----------|-----------------------|-------|
| 1 | `#FFFFFF` | white                 | 83.0% |
| 2 | `#20253D` | dark blue             |  6.9% |
| 3 | `#F89956` | vivid pale orange     |  5.0% |
| 4 | `#FBAE44` | vivid pale orange     |  2.1% |
| 5 | `#9EBBC3` | muted pale blue       |  1.9% |
| 6 | `#ED7450` | vivid pale red        |  0.8% |
| 7 | `#535565` | gray                  |  0.1% |

The white background dominates at 83 %, which is expected for this flat-on-white illustration.

### Bird-only palette (near-white pixels excluded, k=7)

Pixels with r>240 AND g>240 AND b>240 excluded; re-percentaged over remaining bird pixels only.

| # | Hex       | Name                  | %     |
|---|-----------|-----------------------|-------|
| 1 | `#21253D` | muted dark blue       | 40.1% |
| 2 | `#F89955` | vivid pale orange     | 28.2% |
| 3 | `#FBAE44` | vivid pale orange     | 12.2% |
| 4 | `#9CB9C1` | muted pale blue       | 10.9% |
| 5 | `#EF7451` | vivid pale red        |  4.6% |
| 6 | `#E9E6E3` | muted light orange    |  3.1% |
| 7 | `#E7AD93` | warm pale orange      |  0.8% |

### Match against spec colours

| Spec colour       | Hex spec    | Extracted nearest     | Match? |
|-------------------|-------------|-----------------------|--------|
| orange breast     | `#F09060`   | `#F89956` / `#EF7451` | yes    |
| dark navy wing    | `#1D2B3A`   | `#20253D`             | yes    |
| blue-gray strip   | `#90B4BC`   | `#9EBBC3` / `#9CB9C1` | yes    |
| yellow belly      | `#F4B830`   | `#FBAE44`             | yes    |
| red-orange tail   | `#E06040`   | `#EF7451`             | yes    |

All five target colours are recovered. The orange breast splits across two clusters (#F89956 and
#FBAE44 / #EF7451) because JPEG compression creates a gradient band; using region-select on the
breast area resolves this to a single centroid.

---

## robin.jpg results (photorealistic robin — natural background)

Image is 516×780, scaled to 344×520, step=22, ~8 131 pts sampled.

| # | Hex       | Name                  | %     |
|---|-----------|-----------------------|-------|
| 1 | `#709487` | muted cyan            | 23.3% |
| 2 | `#84808A` | gray                  | 20.5% |
| 3 | `#948EB8` | muted pale blue       | 19.0% |
| 4 | `#517353` | muted deep green      | 17.6% |
| 5 | `#4A4041` | dark gray             |  9.7% |
| 6 | `#D08B2E` | warm orange           |  7.0% |
| 7 | `#AB8967` | muted orange          |  2.8% |

Expected: a naturalistic palette of muted greens, greys, and warm brown/orange for the breast.
The tool correctly identifies the blurred green-grey foliage background as the dominant hue family
and picks up the orange breast (#D08B2E, 7 %) and darker body plumage (#4A4041, 9.7 %).
The relatively low orange percentage is accurate — the photorealistic robin's breast occupies a
smaller fraction of the frame than in the flat illustration.

---

## Bugs found and fixed

### Bug 1 — Label click opens file picker twice (double-trigger)

**Location:** `dropZone.addEventListener('click', ...)` (line ~549)

**Cause:** The drop zone div listens for clicks and calls `fileInput.click()`. The "Browse image"
button is a `<label for="file-input">` inside that div. Clicking the label triggers its native
behaviour (opens picker) AND the click event bubbles up to the div, which calls `fileInput.click()`
a second time — opening two picker dialogs back-to-back in some browsers.

**Fix:** Guard the click handler by skipping when the event target is or is inside a `<label>`:
```js
dropZone.addEventListener('click', e => {
  if (e.target.tagName === 'LABEL' || e.target.closest('label')) return;
  fileInput.click();
});
```

### Bug 2 — "Copy SVG snippet" flashes on wrong button

**Location:** `copyTextArea()` function (line ~930)

**Cause:** `copyTextArea()` hardcoded `btnCopySVG.textContent = 'Copied!'` regardless of which
copy button the user actually clicked. Clicking "Copy CSS vars" or "Copy hex list" would flash
the "Copied!" label on the wrong button.

**Fix:** Pass the clicked button and its original label as parameters:
```js
function copyTextArea(btn, originalLabel) {
  navigator.clipboard.writeText(paletteOutput.value).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = originalLabel; }, 1400);
  });
}
// Callers now pass themselves:
btnCopyCSS.addEventListener('click', () => { ...; copyTextArea(btnCopyCSS, 'Copy CSS vars'); });
btnCopyHex.addEventListener('click', () => { ...; copyTextArea(btnCopyHex, 'Copy hex list'); });
```

### Bug 3 — Sampled colours excluded from SVG snippet output

**Location:** `renderOutput()` (line ~912)

**Cause:** `renderOutput()` correctly built an `allColors` array merging palette + sampled colours,
but then passed only `paletteColors` to `buildSVGSnippet()`, silently discarding the sampled ones.
The click-to-sample feature was therefore invisible in the copy output.

**Fix:** Pass `allColors` instead of `paletteColors` to `buildSVGSnippet`:
```js
paletteOutput.value = buildSVGSnippet(allColors);  // was: paletteColors
```
The "Copy SVG snippet" button handler is also updated to include sampled colours for consistency.

### Bug 4 (CRITICAL) — Missing IIFE closing bracket; entire script never executed

**Location:** `<script>` block, end of file (line ~1152)

**Cause:** The script opens an IIFE `(function () { 'use strict'; ... })();` on line 481 but the
closing `})();` was absent. The browser parsed the entire script as a function declaration that was
never called. As a result, none of the event listeners, DOM queries, or logic was ever registered —
the tool was completely non-functional when loaded in a browser.

**Fix:** Added the closing `})(); // end IIFE` before `</script>`.

This was confirmed by `new Function(scriptContent)` throwing "Unexpected end of input" before the
fix and returning "OK" after. The algorithm was verified to work correctly via direct eval in a
separate context (which is how the extraction tests above were run before the fix).

---

## Assessment: ready for drawing protocol use?

**Yes, with caveats.**

The core extraction pipeline (Lab k-means++, hex output, swatch display) works correctly and
reliably identifies the key colours in both flat and photorealistic images. All four bugs above
have been fixed — including the critical one that prevented the page from functioning at all.

**Recommended workflow for SVG authoring:**

1. Load reference image via file picker.
2. Set k=7 (default) and click Re-analyze.
3. If the image has a plain white/black background, use Region Select to drag a box around the
   subject only — this gives better percentage weights for the actual subject colours.
4. For specific feature colours (eye, beak tip, leg), use Click-to-Sample to pin-point exact
   pixel values; these appear in the Sampled Colors list and are included in the copy output.
5. Click "Copy SVG snippet" and paste directly into the SVG file as a colour reference comment.

**Known limitations (not bugs):**

- k-means results are stochastic; similar colours may split across two clusters on one run and
  merge on the next. Click "Re-analyze" a second time if the palette looks wrong.
- JPEG compression creates colour gradients that split pure flat colours into 2-3 nearby clusters
  (observed with the orange breast in baseline.jpg). Region-select resolves this.
- The colour naming heuristic is HSL-based and coarse; "vivid pale orange" for both a pure orange
  and a yellow-orange is expected and harmless.
