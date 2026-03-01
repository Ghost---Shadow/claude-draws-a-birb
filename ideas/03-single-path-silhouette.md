# Idea 03: Single-Path Silhouette Bird

## Problem
The longest-standing unsolved problem in this project: **the head-body seam**. When head and body are separate shapes (`<circle>` + `<ellipse>`), there's always either a visible gap or an awkward "ball sitting on an egg" look. The lessons-learnt document explicitly calls out the fix: *"The real fix is a single `<path>` for the whole silhouette, with colour regions overlaid on top."* But no drawing in the repo has actually done this yet.

## What to Build
A new drawing (`baseline-silhouette.html`) of the same baseline bird reference (`images/baseline.jpg`) using this approach:

1. **One continuous `<path>`** that traces the entire outer silhouette of the bird (head + body + tail + legs as a single closed shape)
2. **Color regions as overlaid paths** clipped to the silhouette:
   - Orange breast/body region
   - Dark navy wing region
   - Blue-gray accent strip
   - Yellow belly crescent
   - Orange-red tail
   - Dark head/cap
3. The silhouette path should use cubic bezier curves (the k=0.5523 technique is documented in `lessons-learnt.html`)
4. A toggle button to show/hide just the silhouette outline (to verify the shape is correct before adding color)

## Key Technical Challenges
- Tracing a single continuous path around head→back→tail→legs→belly→breast→chin→back to head
- Smooth transitions at the head-body junction (no visible kink)
- The wing doesn't change the silhouette (it's interior), but the tail extends it
- Legs are thin appendages branching off the main body — how to include them in one path without self-intersection? Options:
  - Treat legs as separate paths (only body+head+tail as single silhouette)
  - Use a compound path with "holes" (M...Z M...Z)

## Reference Material
- **Reference image**: `images/baseline.jpg` (flat geometric robin illustration)
- **Existing flat drawing**: `baseline.html` (uses separate shapes — this is what we're improving on)
- **Bezier conversion math**: documented in `lessons-learnt.html` under "Bezier Primitives" (k=0.5523)
- **Known proportions**: Head r≈50 on 500px canvas, body rx/ry≈1.8-2.0, head-to-body width ≈30-35%
- **Color palette**: Orange `#F09060`→`#D86838`, wing `#1D2B3A`, strip `#90B4BC`, belly `#F4B830`→`#F5A028`, tail `#E06040`

## Workflow
Follow the project's standard process:
1. Read `lessons-learnt.html` for prior knowledge
2. Start the dev server (port 3456, `serve.js`)
3. Build the SVG iteratively with 5 render-feedback loops (view → zoom → identify problems → fix → repeat)
4. Add a card to `index.html`
5. Write new lessons to `lessons-learnt.html`

## Parallel Safety
This idea is **independent** — it has no dependencies on other ideas and can be run in parallel.

**Files you create** (these are unique to this idea — no conflicts):
- `baseline-silhouette.html`

**Shared files — do NOT modify** (other agents may be writing to these simultaneously):
- `index.html` — do NOT add a gallery card. Instead, create `ideas/03-gallery-card.html` with just the `<a class="card">` snippet to be merged later.
- `lessons-learnt.html` — do NOT edit. Instead, write any new lessons to `ideas/03-lessons.md`.
- `CLAUDE.md` — do NOT edit.

## Acceptance Criteria
- [ ] Entire outer silhouette is ONE `<path>` element (verify in DOM inspector)
- [ ] No visible seam at head-body junction
- [ ] Color regions overlay correctly within the silhouette
- [ ] Toggle to show silhouette-only view
- [ ] Visual quality matches or exceeds `baseline.html`
- [ ] Lessons written to `ideas/03-lessons.md`
