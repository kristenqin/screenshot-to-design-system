# Map Navigation Workbench Decisions

## Direction

Use the Structure Tree mind map as the primary docs-site navigation surface.

## Chosen Approach

Two-column workbench:

- left: persistent map navigator
- right: document reader

## Why

This keeps document reading connected to the documentation system's conceptual structure. Users can read while repeatedly reinforcing where the current document sits in the project.

## Rejected Alternatives

- Keep sidebar as primary navigation: preserves existing behavior but does not solve the split navigation model.
- Remove fallback list immediately: cleaner visually, but risky for search, mobile, and accessibility.
- Replace Mind Elixir: unnecessary because the renderer is already good enough and the next problem is navigation semantics.

## Open Follow-Ups

- Add full History API navigation state.
- Add active node focus and breadcrumb from root to current document.
- Decide when the fallback list can be hidden by default.

