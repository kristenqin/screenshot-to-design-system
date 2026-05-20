# Navigation Interaction Research

## Purpose

This document records the interaction research for improving the docs-site map navigator after the first two-column workbench implementation.

The goal is to make the map navigator feel like a usable ToB documentation workspace rather than a visually large prototype.

## Problems Observed

- The filter area consumed too much vertical space in the map pane.
- Reading path filters were visually heavy compared with their frequency of use.
- Clicking map leaves could leave the mouse interaction feeling sticky.
- The active document location was not visually obvious in the mind map.
- Navigation state was still mostly document hash replacement, which did not fully support browser back and forward.

## References Checked

| Reference | Relevant pattern |
| --- | --- |
| [Stripe Docs](https://docs.stripe.com/) | Search remains prominent; navigation categories are compact and task-oriented. |
| [Microsoft Learn](https://learn.microsoft.com/) | Filters are compact chips/dropdowns and preserve reading focus. |
| [Atlassian Design System](https://atlassian.design/) | Enterprise navigation favors dense controls, breadcrumbs, and clear active state. |
| [MDN History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API) | User navigation should use `pushState`; passive correction should use `replaceState`; back/forward should restore route state through `popstate`. |
| [Mind Elixir API](https://docs.mind-elixir.com/docs/api/) | Keep the library as the map rendering engine, then adapt document-opening, active-node marking, and pointer cleanup locally. |

## Design Direction

### Filters

Use progressive density:

- keep search visible
- compress reading paths into small chips
- keep language as a compact segmented control
- avoid large filter cards in the persistent map pane

The map area should receive most of the left-pane height because it is the primary navigation object.

### Map Node Interaction

The mind map should behave like navigation, not editing:

- document leaves open the reader
- branch nodes can remain selectable and expandable
- after a document leaf opens, the interaction should release pointer state
- the active document should be marked visibly
- the map panel should scroll the active visible document into view when possible

### History State

Route state should include:

```text
doc
lang
path
mapMode
```

Use:

- `pushState` for user-initiated document navigation
- `replaceState` for initialization, search input, and passive filter correction
- `popstate` to restore document, language, path, and map mode

Search should not push browser history on every keystroke.

## Recommendation

Implement a compact filter bar and a route-state adapter before adding more map features.

This keeps the reusable pieces clear:

- Mind Elixir: visual map engine
- History API: browser navigation semantics
- local adapter: project-specific route and active-node behavior

## Acceptance Criteria

- Filter controls take less vertical space than the first workbench version.
- The map stage starts visibly in the first viewport.
- The current document node has a visible active style when present in the map.
- Clicking a document leaf opens the document and does not leave an obvious stuck pointer state.
- Browser back and forward restore document route state.
