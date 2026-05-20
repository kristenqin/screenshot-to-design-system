# Map Navigation Workbench TODO

- [x] Create the two-column shell and move controls into the map panel.
  Verify: browser DOM has `.map-pane` and `.reader-pane`.

- [x] Render Structure Tree in the map panel by default.
  Verify: browser DOM has `[data-tree-renderer="mind-elixir"]`.

- [x] Keep document loading in the right reader pane.
  Verify: default document and clicked document render in `#content`.

- [x] Convert the old sidebar list into fallback search results.
  Verify: fallback list is present but not the main navigation surface.

- [x] Keep Relationship Graph available in the map panel.
  Verify: switching to Relationship Graph renders `[data-graph-renderer="canvas"]`.

- [x] Update docs and skill usage logs.
  Verify: `npm run build`.

- [x] Run final verification and commit.
  Verify: `npm run build && git diff --check`.
