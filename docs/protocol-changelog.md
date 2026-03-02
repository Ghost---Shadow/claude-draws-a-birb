# DRAWING-PROTOCOL.md Changelog

---

## 2026-03-02 — v2: Tool-Integrated Protocol

**Motivation:** Phase 2 analysis (`docs/phase-2-analysis.md`) quantified the gap between
eyeballed freehand drawings (score 71) and pixel-scanned drawings (score 94). The 23-point
gap is almost entirely from spatial accuracy, with colour accuracy contributing an estimated
additional 3–8 points. Three verified tools now exist to address these gaps; this update
makes them mandatory steps rather than optional extras.

### Changes

#### Phase 1 — Reference Analysis: tools made mandatory

- **Added step 2 (palette extraction):** `palette-extractor.html` is now a required first
  action. The extracted hex values must be pasted into the SVG `<defs>` block as a comment
  before any shape is drawn. No colour may be invented from memory.
  - Rationale: palette-extractor-notes.md confirms all 4 bugs are fixed and the tool
    reliably recovers all target colours. Using it eliminates the "wrong-colour" error
    class entirely.
  - Workflow detail added: use Region Select for white/black-background images; use
    Click-to-Sample for small features (eye, beak tip).

- **Added step 3 (grid bounding boxes):** `grid-overlay.html` is now a required second
  action. Bounding boxes for head, body, wing, tail, breast, legs, beak must be recorded
  as comments in the SVG `<defs>` block before drawing.
  - Rationale: phase-2-analysis.md shows spatial accuracy (wrong-proportion errors) is
    the largest single error category. Grid overlay enforces a measurement step before
    drawing rather than estimating proportions freehand.

- **Added cross-check rule in Phase 2:** proportion ratios from lessons-learnt must be
  verified against grid bounding boxes; when they conflict, trust the grid.

#### Phase 5 — Render-Feedback Loop: scoring integrated

- **Added step 21 (optional visual-diff scoring):** `visual-diff.html` should be run at
  iteration 2 and iteration 4. The score and heat-map hot regions are recorded and used
  to direct the next iteration's fixes toward highest-error canvas regions.
  - Rationale: "zoom into problem areas" without a number is subjective. The heat map
    makes the highest-error region unambiguous.

- **Added step 23 (plateau stop condition):** two consecutive iterations each improving
  the score by fewer than 2 points signals a structural problem. Stop tweaking and fix
  the root cause (wrong z-order, wrong anchor, parameter cascade). Prevents wasted
  iterations on unfixable surface symptoms.

#### New section — Scoring Baseline

- Added benchmark table from `docs/scores.md` (scores run 2026-03-02).
- Added per-reference-type score targets:
  - Flat-illustration reference: ≥ 76 (5-point gain over freehand baseline of 71)
  - Photorealistic reference: ≥ 40 full-canvas; ≥ 70 subject-masked
  - Triangle/scanned technique: ≥ 90

#### New section — Quick Reference

- Consolidated tool paths table (`palette-extractor.html`, `grid-overlay.html`,
  `visual-diff.html`) with one-line purpose descriptions.
- Moved all formulas and tables from the old "Quick Reference Formulas" section here.
- Added "Proportion Rules" table summarising the numeric targets from lessons-learnt.

#### Pitfalls Checklist: 3 new items

- Pitfall 1: Colours not from palette extractor (new)
- Pitfall 2: Grid bounding boxes not recorded (new)
- Pitfall 13: Score plateau ignored — stop tweaking if <2 point gain per iteration (new)
- Previous pitfalls renumbered 3–12 (were 1–10).

#### Acceptance Criteria: 5 new items

- `palette-extractor.html` run and hex values pasted into `<defs>` comment
- `grid-overlay.html` run and bounding boxes recorded in `<defs>` comment
- All SVG colours sourced from palette comment (no invented hex values)
- `visual-diff.html` score recorded at iterations 2 and 4
- Score meets or exceeds target for reference type

#### HTML Boilerplate: placeholder comments added

- `<defs>` block now includes placeholder comment structures for both the palette
  snippet and the grid bounding box table, so an agent following the protocol has a
  clear slot to fill in at the start of each drawing.

### What did not change

- Decision Tree (all constraint options preserved as-is)
- Phase 3 (Z-Order Plan), Phase 4 (First Pass Drawing), Phase 6 (Polish and Document)
- Artist mirror check at iteration 3
- All formulas (k=0.5523, Catmull-Rom, coordinate scaling, feTurbulence recipe)
- Phase numbering (Phases 1–6 preserved; step numbers shifted due to insertions)
