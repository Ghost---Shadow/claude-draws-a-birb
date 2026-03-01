# Idea 08: Drawing From Description Only (No Reference Photo)

## Problem
Every drawing in this repo has used a reference photo with pixel scanning, tracing, or at minimum visual comparison. But many real-world use cases for AI SVG generation don't have a pixel-perfect reference — someone says "draw me a cardinal" or "draw a penguin" and expects a recognizable result. This tests whether Claude's accumulated SVG knowledge **generalizes beyond traced coordinates**.

## What to Build
A series of 3 small SVG drawings, each from a **text description only** — no reference photo, no pixel scanning, no tracing overlay:

### Drawing 1: Cardinal (`description-cardinal.html`)
- Prompt: "A male Northern Cardinal perching on a branch. Distinctive red plumage, black face mask, prominent crest, orange-red conical beak."
- Test: Can Claude produce a recognizable cardinal using only species knowledge?

### Drawing 2: Penguin (`description-penguin.html`)
- Prompt: "An Emperor Penguin standing upright. Black back, white belly, yellow-orange neck patches, small flippers at sides, orange feet."
- Test: Very different body plan from all previous birds (upright, no visible wings/tail).

### Drawing 3: Flamingo (`description-flamingo.html`)
- Prompt: "A Greater Flamingo standing in water on one leg. Pink body, long curved neck in S-shape, downward-bent black-tipped beak, very long thin legs."
- Test: Extreme proportions (long neck, long legs) that are totally unlike the round robin.

## Rules / Constraints
- **NO reference photos** — no downloading, no opening images, no pixel scanning
- Use the flat geometric style from `baseline.html` (not photorealistic)
- Apply ALL relevant lessons from `lessons-learnt.html`:
  - Dominant colour test
  - Z-order masking
  - Head-to-body proportions (adapted for each species)
  - 5 render-feedback iterations per drawing
  - Bezier curves for smooth shapes
- Use the structured drawing approach: skeleton layout first, then fill in details
- Each drawing gets its own HTML file, 500x500 viewBox

## Why This Helps
- Tests **generalization**: do the techniques work without a reference, or are they only good for tracing?
- Identifies which parts of the protocol are reference-dependent vs. general
- If these come out recognizable, it proves the protocol + lessons are sufficient for reliable SVG drawing from description alone
- If they come out poorly, it reveals exactly what's missing (proportion knowledge? shape vocabulary? species-specific features?)

## Evaluation
After drawing, search for a reference photo of each species and do a **subjective comparison**:
- Is the species recognizable?
- Are key identifying features present? (crest, mask, patches, beak shape, leg length)
- Are proportions plausible for the species?

## Context from This Repo
- Read `lessons-learnt.html` for all accumulated techniques
- `baseline.html` is the target style (flat, geometric, clean)
- Server on port 3456
- Add cards to `index.html` for each drawing

## Parallel Safety
This idea is **independent** — it has no dependencies on other ideas and can be run in parallel.

**Files you create** (these are unique to this idea — no conflicts):
- `description-cardinal.html`
- `description-penguin.html`
- `description-flamingo.html`

**Shared files — do NOT modify** (other agents may be writing to these simultaneously):
- `index.html` — do NOT add gallery cards. Instead, create `ideas/08-gallery-card.html` with the `<a class="card">` snippets to be merged later.
- `lessons-learnt.html` — do NOT edit. Instead, write any new lessons to `ideas/08-lessons.md`.
- `CLAUDE.md` — do NOT edit.

## Acceptance Criteria
- [ ] 3 HTML files, one per species
- [ ] No reference photos used at any point during creation
- [ ] Each species is recognizable to a human viewer
- [ ] Key identifying features are present for each species
- [ ] Flat geometric style consistent with baseline.html
- [ ] 5 render-feedback iterations per drawing
- [ ] Lessons written to `ideas/08-lessons.md`: what worked without a reference, what was hardest
