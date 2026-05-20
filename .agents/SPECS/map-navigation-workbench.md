# Map Navigation Workbench Spec

## Purpose

Replace the docs site's traditional sidebar-first navigation with a two-column workbench: a Structure Tree mind-map navigator on the left and the document reader on the right.

The goal is to let users read documents while continuously seeing how the current document fits into the documentation system.

## Non-Goals

- Do not replace Mind Elixir with another renderer.
- Do not remove search, language filters, or reading path filters.
- Do not implement full editable mind-map operations.
- Do not implement a custom browser history stack in this pass.
- Do not remove the Relationship Graph audit view.

## Interfaces

- Structure Tree data continues to come from `buildStructureTree()`.
- Mind Elixir remains the renderer for the tree.
- Document opening continues through `loadDoc(source)`.
- Sidebar list becomes fallback/search results, not the primary navigation model.

## Key Decisions

- Use a permanent two-column layout on desktop:
  - left: map navigation surface
  - right: document reader
- Keep the top controls inside the map panel.
- Remove the `Concept map` toggle as the primary access path because the map is now always present.
- Keep Relationship Graph as an audit mode inside the map panel.
- Preserve the fallback document list for search, mobile, and accessibility.

## Edge Cases and Failure Modes

- If Mind Elixir fails, SVG fallback must still render in the map panel.
- If the active document is not visible under current filters, the fallback list should still let users recover through search or All scope.
- Small screens should stack map and reader rather than forcing a cramped two-column layout.
- Relationship Graph must not break when the map panel is no longer inside the article content.

## Acceptance Criteria

- The first viewport uses a two-column workbench on desktop.
- The left column contains Structure Tree by default.
- Clicking a document leaf opens the document in the right column.
- The right column shows the existing Markdown reader and table of contents.
- The old section list is no longer the main visible navigation.
- Search, reading path filters, and language filters still update the map and fallback list.
- Relationship Graph can still be opened from the map panel.
- `npm run build` succeeds.
- Browser verification confirms the map renders and a document can be opened from it.

## Test Plan

- Run `npm run build`.
- Run `git diff --check`.
- Browser-test desktop:
  - map panel renders with Mind Elixir
  - document reader opens default doc
  - Chinese filter updates map labels
  - clicking a document leaf opens it in the right reader
  - Relationship Graph mode still renders
- Browser-test mobile viewport:
  - layout stacks without text overlap

