# Lessons from Idea 04 — Structured Drawing Protocol

## What was built

`DRAWING-PROTOCOL.md` at the project root. It codifies the drawing workflow as a numbered, phase-based checklist derived from all 10 drawing sessions. It covers reference analysis, skeleton layout, z-order planning, first-pass drawing, the mandatory 5-iteration render-feedback loop, and post-session documentation.

## Lessons learned writing the protocol

### Distillation is harder than accumulation

`lessons-learnt.html` contains excellent atomic facts (formulas, rules, anti-patterns). The challenge in writing the protocol was sequencing them: a formula is useless if you don't know *when* to reach for it. Grouping by phase (analysis → layout → z-order → draw → iterate → document) gave each lesson a natural home.

### The decision tree is the most valuable addition

Sessions to date had never codified *when* to choose filled shapes vs bezier-only vs triangles vs stroke outlines. Each session chose its constraint implicitly. Making that decision explicit — with a branching tree tied to the desired aesthetic — means a fresh agent no longer has to reverse-engineer the session intent from the filename.

### The pitfall checklist replaces rediscovery

At least 4 of the 10 common pitfalls (head too large, body too circular, radial gradient on flat surface, shape drawn twice) were rediscovered independently in multiple sessions. A checklist consulted before finalising eliminates this redundancy.

### CLAUDE.md should reference the protocol

`CLAUDE.md` currently describes the workflow at a high level (read lessons, open Chrome, draw, iterate, write lessons). It should add a line pointing to `DRAWING-PROTOCOL.md` for the detailed, phase-by-phase procedure. Suggested addition:

```markdown
## Drawing Protocol
For the full step-by-step drawing process, see [DRAWING-PROTOCOL.md](DRAWING-PROTOCOL.md).
Follow all 6 phases, especially the mandatory 5-iteration render-feedback loop in Phase 5.
```

This keeps `CLAUDE.md` as the entry point while delegating procedural detail to the protocol file.

### Pixel scanning deserves its own section in the protocol

The scanner tool (`baseline-scanner.html`) and the scanned drawing (`baseline-bezier-outline-scanned.html`) introduced a whole sub-workflow: H-scan vs V-scan axis selection, RDP simplification at ε≈12, and the fact that scan output is a starting point not a finished path. These were included in the Quick Reference table in the protocol. If the project adds more scanner-assisted drawings, this section may need to grow into a full Phase 2b.

### The boilerplate saves setup time

Every drawing session started by copying the same CSS skeleton (green gradient background, Georgia font, flex comparison layout, flip button). Including it verbatim in the protocol means a fresh agent can paste it and skip the mental overhead of reconstructing the project's visual style.
