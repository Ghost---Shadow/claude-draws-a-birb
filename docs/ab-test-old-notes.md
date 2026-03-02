# AB Test — Old Process Self-Assessment

## Colors Used

All hex values guessed by eye from the reference screenshot:

| Region | Hex | Notes |
|---|---|---|
| Dark wing / head | `#252840` | Dark navy-charcoal; reference read as very dark blue-black |
| Orange breast (body) | `#e07832` | Warm mid-orange; reference has a strong saturated orange |
| Yellow belly | `#f2be2a` | Amber-yellow; visible as crescent below wing |
| Blue-gray wing accent | `#a4bdc8` | Muted steel blue; upper portion of wing |
| Tail | `#d95520` | Deeper orange-red; slightly more red than breast |
| Beak | `#252840` | Same as head/wing (dark navy) |
| Eye white | `#ffffff` | Pure white |
| Eye pupil | `#1a1a2e` | Very dark navy, near-black |
| Shadow | `#c0c0c0` | Neutral gray, 45% opacity |

## How I Decided Proportions

Eyeballed the reference screenshot directly. Key decisions:

- **Body ellipse**: rx=118, ry=86 on 500px canvas. Lessons said rx/ry ≈ 1.8–2.0 for perched bird; this gives 1.37 (too round in hindsight, but readable).
- **Head**: r=40 on 500px canvas = 16% of canvas width. Lessons said head-to-body ratio ≈ 30–35% of body width; r=40 vs rx=118 → 34%. Correct.
- **Wing coverage**: Attempted to keep right edge at x≈280, leaving orange breast exposed on right. This was a persistent struggle — the wing kept covering too much.
- **Z-order for belly**: Drew yellow belly BEFORE wing so wing would mask it, leaving visible crescent. Applied lesson correctly.
- **Leg length**: Estimated ~60px leg height, legs starting at body bottom (~y=358) going to y=418.
- **Tail**: Simple 3-point path going left; width guessed at ~75px, height ~30px.

## What Was Hardest

1. **Fitting the full bird in the 500×500 canvas** — The preview tool has a fixed viewport smaller than 500px, so legs kept being cut off in screenshots. I had to scroll down to verify they were rendered correctly. Required several iterations just to confirm the canvas framing.

2. **Wing shape and coverage** — Getting the wing to cover the correct ~55% of the body (upper-left) without obliterating the orange breast was the central challenge across all 5 iterations. The wing is a free-form path, so every adjustment required re-estimating bezier control points blind.

3. **Head-body seam** — Used a circle for the head and a separate ellipse for the body (not a single unified path). This always risks the "ball on egg" look. Mitigated by having the head circle overlap the wing/body at the join, but the seam is visible on close inspection.

4. **No measurement tools** — Without pixel-scanning or grid overlay, all coordinates are pure guesses. I iterated 5+ times on the body center, wing boundary, and head position with incremental numeric adjustments (±10–30px at a time).

## Subjective Quality Rating

**5 / 10**

The bird is recognisable as a robin-style flat-geometric bird and captures the main color regions (dark wing, orange breast, yellow belly, blue-gray accent, red tail). However:

- The wing still covers too much of the right side; the orange breast is less prominent than in the reference
- The overall body reads as more circular/blob-like than the reference's confident ellipse
- The blue-gray accent is small and easy to miss
- The tail is thin and unimpressive compared to the reference's bolder wedge
- The head-body connection is passable but not seamless
- Proportions are plausible but not accurate — the result looks like a "bird in that style" rather than a reproduction of the specific reference

The 5-iteration process did meaningfully improve the result vs the first draft, but without measurement tools, convergence on the correct proportions was slow and incomplete.
