# Idea 12: Logo Recreation (Accuracy Benchmark)

## Problem
Birds and food are subjective — there's no "correct" robin SVG. But **logos have precise, known geometry**. Recreating famous logos in SVG gives an objective accuracy test: you can overlay the original and the recreation pixel-for-pixel. This is the ultimate benchmark for "can Claude draw SVG reliably?"

## What to Build
Recreate **3 well-known logos** as standalone SVG files, from visual reference only (not from inspecting existing SVG source code):

### Logo 1: Twitter/X Bird (`logo-twitter-bird.html`)
- The classic Twitter bird silhouette (the Larry bird)
- Single color (#1DA1F2), pure shape — tests bezier path accuracy
- Known to be constructible from overlapping circles, but should be drawn as a single `<path>`
- Extremely well-known shape — any proportion error is immediately visible

### Logo 2: Apple Logo (`logo-apple.html`)
- The Apple silhouette with bite mark and leaf
- Single color (black or any solid), pure shape
- Smooth bezier curves, the bite is a circular subtraction
- Tests: bezier smoothness, circle-path intersection, leaf detail

### Logo 3: Firefox/Mozilla Logo (`logo-firefox.html`)
- Much more complex: flame/fox wrapping around globe
- Multiple colors, gradients, complex overlapping shapes
- Tests: multi-color composition, gradient accuracy, complex path work
- Acceptable to simplify to a flat-color version

### Rules
- **Visual reference only**: Look at the logo, then draw it. Do NOT inspect SVG source code from brand asset pages.
- **From memory/description if possible**: For well-known logos like the Twitter bird, try drawing from species-level description first ("a bird in profile, wing raised, head tilted up, composed of overlapping circles"). Then compare to reference and iterate.
- **Use the drawing protocol**: Skeleton first, then refine with 5 render-feedback loops.
- **Measure accuracy**: After completing each logo, overlay on a reference image at matched scale (e.g. render both to canvas and compare visually or compute per-pixel difference). Note the divergence.

## Why This Helps
- **Objective ground truth**: Logos have exact, published geometry. There's no ambiguity about whether your version is "close enough."
- **Tests bezier mastery**: Logos are almost entirely smooth bezier curves — the core SVG skill.
- **Graduated difficulty**: Twitter bird (one path) → Apple (one path + subtraction) → Firefox (many paths + gradients).
- **Demonstrates practical value**: Logo recreation is a real-world use case for SVG generation.

## Evaluation Criteria
For each logo, rate:
1. **Silhouette accuracy**: Does the outline match? (overlay test)
2. **Proportion accuracy**: Are the ratios correct? (width:height, bite position, leaf angle)
3. **Curve smoothness**: Are bezier curves smooth or lumpy?
4. **Detail fidelity**: Are small features (leaf, bite, flame tips) captured?
5. **Color accuracy**: For multi-color logos, are hues and gradients correct?

## Context from This Repo
- Bezier technique documented in `lessons-learnt.html` (k=0.5523 for circles, Catmull-Rom conversion)
- `baseline-bezier.html` demonstrates all-bezier construction
- Server on port 3456
- Server on port 3456

## Parallel Safety
This idea is **independent** — it has no dependencies on other ideas and can be run in parallel.

**Files you create** (these are unique to this idea — no conflicts):
- `logo-twitter-bird.html`
- `logo-apple.html`
- `logo-firefox.html`

**Shared files — do NOT modify** (other agents may be writing to these simultaneously):
- `index.html` — do NOT add gallery cards. Instead, create `ideas/12-gallery-card.html` with the `<a class="card">` snippets to be merged later.
- `lessons-learnt.html` — do NOT edit. Instead, write any new lessons to `ideas/12-lessons.md`.
- `CLAUDE.md` — do NOT edit.

## Acceptance Criteria
- [ ] 3 HTML files, one per logo
- [ ] No SVG source code copied from brand assets
- [ ] Twitter bird recognizable and proportionally correct
- [ ] Apple logo recognizable with correct bite and leaf
- [ ] Firefox logo recognizable (simplified is acceptable)
- [ ] Each logo compared to reference with accuracy notes
- [ ] Lessons written to `ideas/12-lessons.md`: what makes logos harder/easier than organic subjects?
