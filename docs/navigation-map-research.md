# Navigation Map Research

## Purpose

This document records the research behind using the Structure Tree mind map as the primary documentation navigation model.

The goal is not to build another custom navigation widget from scratch. The goal is to reuse mature interaction primitives, keep the project documentation navigable, and preserve browser-level navigation behavior such as back and forward.

## Problem

The current docs site has two parallel navigation surfaces:

- a traditional sidebar list grouped by documentation section
- a Concept Map Structure Tree rendered with Mind Elixir

The Structure Tree is now better at expressing the documentation system's conceptual hierarchy. The sidebar is still useful, but it duplicates another structure and makes the navigation model feel split.

The next question is:

> Can the Structure Tree become the main navigation data structure for the docs site?

## Navigation Requirements

The navigation model should support:

- showing navigation items and their parent-child relationships
- opening document leaves
- focusing, expanding, and collapsing branch nodes
- showing the current path from root to active document
- supporting browser back and forward
- preserving URL state for reload and session handoff
- keeping search and language filters usable
- keeping a fallback for small screens, accessibility, or failed mind-map initialization

## Candidates Checked

| Candidate | Source | Fit |
| --- | --- | --- |
| Mind Elixir | <https://docs.mind-elixir.com/docs/getting-started/intro> | Best fit because it already renders the Structure Tree and supports mind-map interactions. |
| Markmap | <https://markmap.js.org/docs/markmap> | Strong for Markdown-outline mind maps, weaker for manifest-driven navigation data. |
| jsTree | <https://www.jstree.com/docs/html/> | Mature tree navigation widget, but it returns to a traditional tree rather than a mind-map interface. |
| Fancytree | <https://github-wiki-see.page/m/mar10/fancytree/wiki/TutorialLoadData> | Mature tree widget with rich navigation features, but visually and conceptually closer to file navigation. |
| React Flow | <https://reactflow.dev/learn/concepts/terms-and-definitions> | Strong graph UI library, but adopting it would imply a larger React-oriented surface than this vanilla docs site needs. |
| Browser History API | <https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API> | Best fit for back, forward, reloadable URL state, and session history. |

## Evaluation

### Mind Elixir

Mind Elixir should remain the primary visual navigation shell.

It already handles the most expensive part of the interaction:

- mind-map layout
- branch expansion and collapse
- zoom and pan
- node selection
- read-only map rendering

What it does not provide by itself is documentation navigation semantics. We still need an adapter that knows:

- which nodes are branches
- which nodes are documents
- how to open a document
- how to update URL state
- how to restore the active document and selected node after reload

### Markmap

Markmap is a good reference for generated mind-map navigation from Markdown.

It is not the best primary implementation here because the documentation structure is not a single Markdown outline. It is generated from `docs-manifest.json`, reading paths, language filters, and Structure Tree grouping rules.

Using Markmap would require synthesizing a Markdown outline from the manifest, then mapping clicks back to docs. That is possible, but it would add an avoidable conversion layer.

### jsTree and Fancytree

Both are mature navigation tree widgets.

They are useful fallback references for:

- keyboard navigation
- tree state persistence
- node activation events
- lazy loading patterns

They are not a good match for the requested direction because they turn the experience back into a traditional sidebar tree. That solves navigation mechanics, but loses the concept-map reading experience.

### React Flow

React Flow is a strong option for custom node and edge applications.

It is too large a shift for the current docs site because:

- the current app is vanilla JavaScript
- the Structure Tree is hierarchical, not a free-form editable graph
- adopting React Flow would likely mean rebuilding the UI shell around React concepts

It remains a reference if the docs site later becomes a full graph workspace.

### History API

Browser navigation should use the native History API rather than a custom history stack.

The current docs site mostly uses hash state and `replaceState`. For mind-map navigation, user-initiated document opens should use `pushState` so the browser back button can return to the previous document.

Non-user-initiated state changes, such as initialization and filter normalization, can continue to use `replaceState`.

## Recommendation

Use this architecture:

```text
Structure Tree data
  -> Mind Elixir renderer
  -> Navigation Adapter
  -> History API URL state
  -> Document reader
```

The sidebar should not remain the primary mental model. It should become one of these:

- a compact fallback list for search, accessibility, and mobile
- a collapsible secondary surface
- or a temporary compatibility layer until the map navigator proves stable

The recommended near-term direction is not to remove the sidebar immediately. First, make the Structure Tree a real map navigator.

## Proposed Implementation

### Phase 1: Navigation Adapter

Add a thin adapter around Structure Tree nodes:

- branch node click: select, expand/collapse, and focus node
- document node click: open document through a navigation function
- current node path: derive breadcrumbs from root to active document
- active node styling: visually mark the current document

### Phase 2: URL and History State

Change navigation state from document-only hash replacement to explicit route state:

```text
doc
node
lang
path
view
mapMode
```

Use:

- `history.pushState` for user-initiated document opens
- `history.replaceState` for initialization and passive state correction
- `popstate` to restore document, filters, map mode, and selected node

### Phase 3: Sidebar Reduction

After the map navigator works:

- keep search available
- collapse the old sidebar by default
- use the map as the primary navigation index
- keep a list fallback for small screens and accessibility

## Decision

Do not introduce a new primary navigation library yet.

Reuse Mind Elixir for the visual navigation surface and use the browser History API for navigation history. Build only the product-specific adapter layer that connects mind-map nodes to documentation routes.

This follows the project's reuse-first rule: buy or reuse the generic interaction engine, and build only the project-specific navigation semantics.

## Risks

- Mind-map navigation may be slower than a list for users who already know the exact document name.
- Browser history can become noisy if every expand/collapse action pushes a state entry.
- Mobile layout may need a separate compact navigation mode.
- Accessibility may require a list or tree fallback even if the map becomes primary.

## Validation Plan

Validate with task-based checks:

- From a fresh session, open the current handoff from the map.
- Navigate from Product to Work Plan to Next Tasks and use browser back to return.
- Switch to Chinese view and open 文档入口 from the map.
- Search for a document, open it from the fallback list, and confirm the map can still focus it.
- Reload a URL with `doc`, `node`, `lang`, and `mapMode` and confirm the same document and map context return.

