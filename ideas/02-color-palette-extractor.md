# Idea 02: Color Palette Extractor Tool

## Problem
When Claude draws SVG, it frequently **guesses colors wrong**. It picks "#F09060" when the reference is actually "#D47A3E". This is a completely avoidable error class — the colors are right there in the image pixels. The existing baseline drawings hardcode colors that were manually eyeballed and iteratively corrected across render-feedback loops.

## What to Build
A standalone HTML tool (`palette-extractor.html`) that:

1. Loads any reference image (drag-drop or file picker)
2. Uses `canvas.getImageData()` to analyze all pixels
3. Extracts the **dominant color palette** (5-10 colors) using k-means clustering or median-cut quantization
4. Displays each color as a swatch with:
   - Hex value (e.g. `#D47A3E`)
   - Percentage of image area it covers
   - A descriptive name guess (e.g. "warm orange", "dark navy")
5. Click-to-sample mode: click anywhere on the image to get the exact color at that pixel
6. "Copy palette" button that outputs a ready-to-use SVG snippet:
   ```svg
   <!-- Palette extracted from reference -->
   <!-- 34% warm-orange --> #D47A3E
   <!-- 22% dark-navy  --> #1D2B3A
   <!-- 15% sky-blue   --> #90B4BC
   <!-- etc. -->
   ```
7. Optional: region-aware sampling — draw a lasso/rectangle on the image to extract colors from just that area (useful for "what color is just the wing?")

## Why This Helps
- Eliminates color guessing entirely — Claude starts with verified hex values
- Percentage breakdown helps with the "dominant colour test" from lessons-learnt (orange breast should be ~55% of body)
- Region sampling lets you extract per-feature palettes
- Cheap to build, immediately useful for every future drawing session

## Context from This Repo
- The project lives at `C:\Users\soura\Desktop\claude-draws-a-birb\`
- Existing color values used across drawings:
  - Orange body: `#F09060` → `#D86838` (linear gradient)
  - Dark wing: `#1D2B3A`
  - Blue-gray strip: `#90B4BC`
  - Yellow belly: `#F4B830` → `#F5A028`
  - Tail: `#E06040`
- Server runs on port 3456 via `serve.js`
- Server runs on port 3456 via `serve.js`

## Parallel Safety
This idea is **independent** — it has no dependencies on other ideas and can be run in parallel.

**Files you create** (these are unique to this idea — no conflicts):
- `palette-extractor.html`

**Shared files — do NOT modify** (other agents may be writing to these simultaneously):
- `index.html` — do NOT add a gallery card. Instead, create `ideas/02-gallery-card.html` with just the `<a class="card">` snippet to be merged later.
- `lessons-learnt.html` — do NOT edit. Instead, write any new lessons to `ideas/02-lessons.md`.
- `CLAUDE.md` — do NOT edit.

## Acceptance Criteria
- [ ] Tool loads images and extracts a dominant color palette
- [ ] Colors shown with hex values, swatches, and area percentages
- [ ] Click-to-sample mode works
- [ ] Palette is easily copy-pasteable
- [ ] Works in Chrome
