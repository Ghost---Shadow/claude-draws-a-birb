# Making Claude Draw SVG Reliably

## The Core Loop

```
Measure → Identify failure modes → Build targeted fix → Measure again
```

Every step must make the next drawing **measurably better** than the last. If it doesn't move the number, it doesn't ship.

## Why Most Experiments Don't Help

Drawing the same bird 15 different ways (triangles, CSS, cutouts, outlines) is exploration, not improvement. Each new constraint is a fresh puzzle — fun, but the lessons don't transfer. The bird drawn in session 15 isn't more accurate than the one in session 5 because nothing in the process changed.

What compounds:
- Eliminating an error class permanently (wrong colors → palette extractor)
- Giving the process a feedback signal (looks okay → 73% pixel match)
- Codifying a fix so it applies to ALL future drawings (not just this one)

What doesn't compound:
- Drawing the same reference a new way
- Adding more subjects without fixing the process
- Building libraries of unreliable components

## Phase 1: Baseline Measurement

**Goal**: Score every existing drawing against its reference image. Get a number.

1. Verify `visual-diff.html` works — load `baseline.html` vs `images/baseline.jpg`, get a score
2. Score all 6 baseline variants: flat, bezier, triangle, outline, scanned-outline, silhouette
3. Score the other drawings: freehand, traced, bluejay, hummingbird, omelette
4. Record all scores in `docs/scores.md`

**Output**: A ranked table of all drawings by accuracy. This is ground truth.

## Phase 2: Failure Mode Analysis

**Goal**: Identify the top 3 systematic error categories across all drawings.

For each drawing, use the visual diff heat map to classify errors:

| Error Category | Description | Example |
|---------------|-------------|---------|
| **Wrong position** | Shape is in the wrong place | Head 20px too high |
| **Wrong proportion** | Shape is the wrong size | Wing covers 60% of body instead of 45% |
| **Wrong color** | Hex value doesn't match reference | Orange is #F09060 but should be #D47A3E |
| **Wrong curve** | Bezier path doesn't follow the contour | Back arch is too flat |
| **Seam/gap** | Visible gap between adjacent shapes | Head-body disconnect |
| **Missing detail** | Feature is absent or too simple | No toe separation on feet |

Tally errors across all drawings. Find the 2-3 categories that account for most of the total pixel error.

**Output**: `docs/failure-modes.md` with ranked error categories and evidence.

## Phase 3: Targeted Fixes

Build one fix per top failure mode. Each fix must be:
- **Automatable**: Works without human intervention
- **General**: Applies to any subject, not just this bird
- **Measurable**: Re-score the drawing after applying the fix

Likely fixes (ordered by expected impact):

### Fix A: Color accuracy
- Use `palette-extractor.html` to get exact hex values before drawing
- Inject palette into the drawing prompt/protocol
- Expected improvement: eliminates all "wrong color" errors

### Fix B: Proportion accuracy
- Use `grid-overlay.html` to establish bounding boxes before drawing
- Protocol step: "verify head is in cells C3-E5 before adding detail"
- Expected improvement: reduces "wrong position" and "wrong proportion" errors

### Fix C: Curve accuracy
- Trace reference contours at native resolution, then scale
- Use Catmull-Rom through scanned boundary points (already proven in scanner sessions)
- Expected improvement: reduces "wrong curve" errors

### Fix D: Process enforcement
- Update `DRAWING-PROTOCOL.md` to mandate tools A-C before any drawing
- Test: a fresh agent following the protocol scores higher than any freehand attempt

## Phase 4: Validate

1. Pick a NEW reference image (never drawn before)
2. Draw it twice:
   - Once with the old process (just read lessons-learnt, start drawing)
   - Once with the new process (palette extraction → grid layout → protocol)
3. Score both against the reference
4. The new process must score measurably higher

If it does: the loop works. Repeat with harder subjects.
If it doesn't: the fixes missed the real bottleneck. Go back to Phase 2.

## Success Criteria

The process is "reliable" when:
- A fresh Claude agent, given only the protocol + tools, produces a drawing that scores **>80% pixel match** against any flat-illustration reference on first attempt (5 iterations allowed)
- The same agent achieves **>60%** on photorealistic references
- Scores are reproducible across sessions (low variance)
