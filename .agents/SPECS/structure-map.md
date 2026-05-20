# Structure Map Spec

## Purpose
Add a default tree-style structure map for the documentation site so the project can be understood as a managed content system, not only as a dense relationship graph.

## Non-Goals
- Do not replace the existing relationship graph.
- Do not add editable mind-map nodes in this iteration.
- Do not introduce a new third-party dependency unless the native version cannot meet the first usable milestone.

## Interfaces
- `Concept map` opens the map page.
- The map page supports two modes:
  - `Structure Tree`: default, lifecycle/module/doc hierarchy.
  - `Relationship Graph`: existing GraphFrontier-style graph.
- Clicking a document node opens that document.
- Existing language and reading-path filters continue to constrain visible documents.

## Key Decisions
- Use native SVG for the first version instead of `markmap`, `jsMind`, or `Mind Elixir`.
- Keep relationship edges out of the tree view; tree view expresses canonical organization only.
- Group documents by project lifecycle buckets, then by existing section metadata, then by document.

## Acceptance Criteria
- Opening `Concept map` shows `Structure Tree` by default.
- The structure view has a visible root, lifecycle groups, sections, and document leaves.
- Switching to `Relationship Graph` shows the existing canvas graph.
- Language/path filters rerender the active map mode.
- Build passes with `npm run build`.
- Browser verification confirms SVG tree nodes exist and graph fallback mode still renders canvas nodes.

## Test Plan
- Run `npm run build`.
- Verify with browser automation:
  - `Concept map` opens tree mode.
  - SVG contains project root and document leaves.
  - Clicking `Relationship Graph` renders a canvas with node/edge data attributes.
