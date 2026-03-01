# Idea 10: SVG Component Library

## Problem
Across 10 drawings, Claude has repeatedly built the same elements: eyes (circle + pupil + highlight), beaks (triangular paths), legs (thin rects with toes), branches, backgrounds with bokeh/vignette, etc. Each time these are rebuilt from scratch with slightly different coordinates. A **reusable component library** would let Claude compose drawings from pre-built, parameterized parts — faster and more consistent.

## What to Build
Two things:

### Part A: Component Library File (`svg-components.js`)
A JavaScript module that exports functions returning SVG element strings. Each component is parameterized:

```javascript
// Example API
svgComponents.eye({ cx: 200, cy: 150, r: 12, pupilRatio: 0.55, highlightAngle: 315 })
// Returns: <g class="eye">...<circle>...<circle>...<circle>...</g>

svgComponents.beak({ x: 180, y: 170, length: 20, angle: -15, color: '#4A3728', style: 'conical' })
// Returns: <path class="beak" d="..."/>

svgComponents.body({ cx: 250, cy: 280, rx: 120, ry: 65, color: '#F09060', gradient: true })
// Returns: <ellipse.../> or <path.../> (bezier approximation)

svgComponents.legs({ x: 250, y: 380, spread: 30, toeCount: 3, color: '#5C4033' })
// Returns: <g class="legs">...<line>...<line>...</g>

svgComponents.branch({ x1: 100, y1: 390, x2: 400, y2: 385, thickness: 8, color: '#5C3A1E' })
svgComponents.vignette({ width: 500, height: 500, opacity: 0.55 })
svgComponents.bokehBackground({ width: 500, height: 500, colors: ['#2d5016', '#4a7c23'], circleCount: 12 })
```

### Part B: Demo / Playground (`component-playground.html`)
An interactive page where you can:
1. See all available components rendered with default parameters
2. Adjust parameters with sliders/inputs and see live updates
3. Compose a bird by selecting components and positioning them
4. "Export SVG" button that outputs the composed SVG as a standalone file

### Components to Include
Derived from the 10 existing drawings:

| Component | Parameters | Source |
|-----------|-----------|--------|
| `eye` | cx, cy, r, pupilRatio, highlightAngle, color | All bird drawings |
| `beak` | x, y, length, angle, color, style (conical/hooked/thin) | robin, bluejay, hummingbird |
| `body` | cx, cy, rx, ry, color, gradient, style (bezier/ellipse) | All drawings |
| `head` | cx, cy, r, color | All drawings |
| `wing` | points[], color, style (flat/feathered) | baseline, bezier |
| `tail` | x, y, width, height, color, angle | baseline, bezier |
| `legs` | x, y, spread, toeCount, gripping, color | robin, baseline |
| `branch` | x1, y1, x2, y2, thickness, color, bark | robin, hummingbird |
| `vignette` | w, h, opacity | omelette, hummingbird |
| `bokeh` | w, h, colors, count, minR, maxR | freehand |
| `featherTexture` | region, baseFreq, seed, color | hummingbird |

## Why This Helps
- **Faster drawing**: Compose from parts instead of building from scratch each time
- **Consistency**: Eye always has the same highlight style, legs always have the right toe anatomy
- **Parameterized accuracy**: Claude only needs to get positions and sizes right, not rebuild complex shapes
- **Combinatorial exploration**: Easy to try "cardinal body + hooked beak + crest" compositions
- **Testable**: Each component can be verified independently

## Context from This Repo
- Extract patterns from: `freehand.html`, `traced.html`, `bluejay.html`, `hummingbird.html`, `baseline.html`, `baseline-bezier.html`
- Server on port 3456
- Add card to `index.html`

## Parallel Safety
This idea is **independent** — it has no dependencies on other ideas and can be run in parallel.

**Files you create** (these are unique to this idea — no conflicts):
- `svg-components.js`
- `component-playground.html`

**Shared files — do NOT modify** (other agents may be writing to these simultaneously):
- `index.html` — do NOT add a gallery card. Instead, create `ideas/10-gallery-card.html` with just the `<a class="card">` snippet to be merged later.
- `lessons-learnt.html` — do NOT edit. Instead, write any new lessons to `ideas/10-lessons.md`.
- `CLAUDE.md` — do NOT edit.

## Acceptance Criteria
- [ ] `svg-components.js` with at least 8 parameterized components
- [ ] Each component returns valid SVG string
- [ ] `component-playground.html` shows all components with live parameter controls
- [ ] Can compose a recognizable bird from components in the playground
- [ ] Export button produces standalone SVG
- [ ] Lessons written to `ideas/10-lessons.md`
