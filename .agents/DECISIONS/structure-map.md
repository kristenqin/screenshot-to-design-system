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

Before adding more custom tree features, run a Mind Elixir spike. If Mind Elixir fails, evaluate `d3-hierarchy` as the layout-only replacement for the custom layout math.

## Deferred
- Editable node operations.
- Collapsing/expanding branches.
- Persisted manual layout.
- Importing a dedicated mind-map library.
