# Structure Map Decisions

## Reuse Review
- `markmap` is strong when the source is a single Markdown outline, but this project already has structured manifest data across many documents.
- `jsMind` and `Mind Elixir` are closer to editable mind-map products. They add dependency and interaction cost before the information architecture is stable.
- Native SVG is enough for a first usable read-only structure map and keeps the module easy to replace later.

## Reuse Review Correction

The initial reuse review was too shallow for a feature that is likely to need collapse, zoom, drag, search, and node operations.

See [Mind Map Library Evaluation](../../docs/mind-map-library-evaluation.md).

## Selected Direction
Use a native SVG structure tree as the default map mode and keep the existing canvas relationship graph as a secondary analysis view.

## Updated Direction

Treat the native SVG structure tree as a validated prototype and fallback, not as the default long-term implementation.

Mind Elixir passed the first spike and is now the primary Structure Tree renderer. The SVG tree remains as fallback.

Next hardening should focus on adapter quality, viewport reset, and document-leaf click verification after branch expansion.

## Content Structure Update

The renderer is no longer the bottleneck. The tree content now follows a deeper IA model:

- Project -> Module -> Section -> Topic -> Document
- Dense Workflow sections are split into topic groups instead of exposing 14 document leaves at one level.
- Document leaves use short concept labels in the tree; full titles remain available as metadata.

## Deferred
- Editable node operations.
- Collapsing/expanding branches.
- Persisted manual layout.
- Further tree-testing of topic labels with real project tasks.
