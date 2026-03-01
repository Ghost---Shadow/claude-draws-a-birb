# Idea 04: Structured Drawing Protocol

## Problem
Each drawing session currently starts by reading `lessons-learnt.html` and CLAUDE.md, but the **process** for drawing is implicit — it lives in accumulated experience, not a codified protocol. A new Claude agent (or a fresh context window) has to rediscover the workflow. This means drawing quality varies by session. The goal is to create a **reusable, step-by-step protocol** that any Claude agent can follow to reliably produce accurate SVGs.

## What to Build
A new file `DRAWING-PROTOCOL.md` at the project root that codifies the drawing process as a numbered checklist. The protocol should distill everything learned across 10 drawing sessions into a repeatable recipe.

### Proposed Protocol Structure

```markdown
# SVG Drawing Protocol

## Phase 1: Reference Analysis
1. Load the reference image and note its pixel dimensions
2. Extract the dominant color palette (hex values + area percentages)
3. Identify major regions/features and their approximate bounding boxes
4. Note the aspect ratio — set viewBox to match or use a standard (e.g. 500x500)

## Phase 2: Skeleton Layout
5. Decide drawing constraint (filled shapes / bezier only / triangles / strokes / etc.)
6. Lay out bounding boxes for each major region (head, body, wing, tail, legs, eye)
7. Verify proportions: head-to-body width should be ~30-35%, body rx/ry ~1.8-2.0 for standing bird
8. Run "dominant colour test" — which region should be largest? Does skeleton match?

## Phase 3: Z-Order Plan
9. List shapes back-to-front (SVG painter model — later shapes cover earlier ones)
10. Identify masking opportunities (e.g. draw belly before wing, wing covers most of belly)
11. Rule: each shape drawn exactly ONCE. No double-drawing for masking.

## Phase 4: First Pass Drawing
12. Set up the HTML file with SVG, viewBox, background
13. Draw shapes back-to-front per the z-order plan
14. Use the correct color palette from Phase 1
15. For seams: place anchor points inside overlapping shapes (e.g. wing start inside head)

## Phase 5: Render-Feedback Loop (5 iterations)
16. View in browser at 1x zoom — check overall proportions and colors
17. Zoom to 2x — check seams, gaps, misaligned edges
18. Identify the TOP 3 most visible problems
19. Fix those specific problems (don't touch anything else)
20. Repeat from step 16 (do this 5 times total)

## Phase 6: Polish & Document
21. Add any interactive features (toggle, flip, etc.)
22. Add card to index.html gallery
23. Write new lessons to lessons-learnt.html
```

## Additional Content to Include
- **Common pitfalls checklist** (derived from lessons-learnt):
  - Radial gradient on flat surface → looks like bubble (use linear instead)
  - Head too big (>35% of canvas width)
  - Body too circular (rx/ry < 1.5)
  - Filter bleeding outside clipPath
  - Parameter cascade not propagated top-to-bottom
- **Decision tree** for choosing drawing constraint (when to use fills vs bezier vs triangles vs strokes)
- **Quick-reference formulas**: bezier k=0.5523, Catmull-Rom CP1/CP2, fan tessellation centroid placement

## Why This Helps
- Any Claude agent can pick up the protocol and produce consistent results
- Eliminates the "rediscovery tax" each session
- Makes the 5-iteration render-feedback loop mandatory (it's the single highest-value practice)
- Provides guard rails against the most common mistakes

## Context from This Repo
- Read `lessons-learnt.html` for all accumulated knowledge
- Read CLAUDE.md for existing project instructions
- The protocol should complement (not duplicate) these files
- Look at the existing 10 drawings to understand the range of approaches

## Parallel Safety
This idea is **independent** — it has no dependencies on other ideas and can be run in parallel.

**Files you create** (these are unique to this idea — no conflicts):
- `DRAWING-PROTOCOL.md`

**Shared files — do NOT modify** (other agents may be writing to these simultaneously):
- `index.html` — do NOT modify.
- `lessons-learnt.html` — do NOT edit. Instead, write any new lessons to `ideas/04-lessons.md`.
- `CLAUDE.md` — do NOT edit. Instead, note in `ideas/04-lessons.md` that CLAUDE.md should reference the protocol.

## Acceptance Criteria
- [ ] `DRAWING-PROTOCOL.md` exists at project root
- [ ] Covers all phases: analysis, skeleton, z-order, drawing, iteration, documentation
- [ ] Includes common pitfalls checklist
- [ ] Includes decision tree for constraint choice
- [ ] Tested: a fresh Claude agent following only this protocol + lessons-learnt should produce a reasonable SVG
