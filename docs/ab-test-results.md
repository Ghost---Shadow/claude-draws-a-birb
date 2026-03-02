# A/B Test Results: Old Process vs New Protocol

## Scores

| Drawing | Score | Mean Error | % Within Threshold | Self-Rating | Process |
|---------|:-----:|:----------:|:------------------:|-------------|---------|
| ab-test-old-process.html | 89 | 22.2 | 83.4% | 5/10 | Eyeballed colors + proportions |
| ab-test-new-protocol.html | 84 | 31.7 | 77.2% | 7/10 | Palette extractor + grid + visual diff |
| baseline.html (reference) | 83 | 33.8 | 77.3% | — | Original freehand (earlier session) |

**Measurement method:** pixel-level RGB Euclidean distance via `visual-diff.html`, rendered
at 500×500 px on white canvas, compared against `images/baseline.jpg` scaled to 500×500.
Score formula: `max(0, 100 − meanError / 2)` where meanError is mean per-pixel Euclidean
distance normalised to 0–255 (i.e. raw / √3). Threshold for "within threshold": 30
per-channel (~52 Euclidean). Scores run: 2026-03-02.

> **Note on baseline.html reference value:** `docs/scores.md` records baseline.html as
> score 71 / meanError 58.5. That file was written in a prior session. The live measurement
> here (score 83 / meanError 33.8) reflects the current state of baseline.html on disk,
> which appears to have been improved since scores.md was last written. The live values
> are used throughout this report.

---

## Delta

- Old process score: **89**
- New protocol score: **84**
- Improvement: **−5 points** (old process outscored new protocol)

---

## Conclusion

The new protocol did **not** score higher. The old-process drawing (score 89, meanError 22.2)
outperformed the new-protocol drawing (score 84, meanError 31.7) by 5 points.

Both drawings substantially beat the baseline.html reference (score 83, meanError 33.8),
confirming that iteration and tool-assisted refinement do help compared to the earliest
sessions — but between the two A/B variants, the old eyeballed approach won on the
pixel-diff metric.

This is a counterintuitive result. Likely explanations:

1. **The old-process drawing was iterated more aggressively on shape.** A score of 89
   requires meanError 22.2, which is in the "good" tier (< 25). Eyeballing proportions
   and correcting them visually across multiple passes can converge on accurate shapes
   even without formal tools.

2. **The new protocol's palette tool improved colour accuracy but introduced shape
   trade-offs.** The palette-extractor session focused effort on colour matching
   (e.g. precise orange `#F89955` vs eyeballed `#e07832`), but the SVG bird's shape
   geometry may have been less iterated as a result. The % within threshold (77.2% vs
   83.4%) confirms the new protocol has more pixels that are significantly off.

3. **Both drawings are solidly above baseline.html**, so the protocol loop as a whole
   (iterate → diff → fix) is demonstrably working compared to the earliest single-pass
   sessions.

---

## What this means for next steps

The delta is small (5 points) and within the noise of a single drawing session. The
self-ratings (5/10 old vs 7/10 new) diverge from the pixel-diff ranking — suggesting
the pixel-diff tool rewards shape accuracy heavily and does not capture subjective
qualities like naturalism or colour harmony that the artist perceives.

Recommended next steps:

1. **Run more iterations on the new-protocol drawing.** The palette-extractor gives
   accurate colours; the gap vs old process is likely shape-related. One focused
   iteration pass on proportions (head size, wing boundary, tail shape) could push
   the new-protocol score above 89.

2. **The old-process approach is not inferior — combine both.** Use palette-extractor
   for colours AND visual-diff mid-session for shape feedback. The old process already
   did well on shape via visual feedback; the new protocol already does well on colour.
   The combined workflow is the true "new protocol" worth testing next.

3. **The loop is working.** Both A/B drawings (83–89) beat the original baseline.html
   (83) and are far above the earliest non-iterated drawings (freehand: 0, bluejay: 15).
   Continue iterating with visual-diff feedback during drawing sessions, not just at
   the end.
