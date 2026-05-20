# Structure Map Decisions

## Reuse Review
- `markmap` is strong when the source is a single Markdown outline, but this project already has structured manifest data across many documents.
- `jsMind` and `Mind Elixir` are closer to editable mind-map products. They add dependency and interaction cost before the information architecture is stable.
- Native SVG is enough for a first usable read-only structure map and keeps the module easy to replace later.

## Selected Direction
Use a native SVG structure tree as the default map mode and keep the existing canvas relationship graph as a secondary analysis view.

## Deferred
- Editable node operations.
- Collapsing/expanding branches.
- Persisted manual layout.
- Importing a dedicated mind-map library.
