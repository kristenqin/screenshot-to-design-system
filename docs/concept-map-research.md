# Concept Map Research

This document evaluates whether the documentation system should move beyond a tree-shaped sidebar and expose the project as a concept map.

## Why This Matters

The current documentation set is no longer a simple folder of notes. Each document represents a project concept: product intent, implementation plan, research evidence, operating policy, skill audit, or session memory.

A tree can only express one primary parent-child path. This is too narrow for the current workflow because one document can serve several roles at once. For example, the skill usage policy is both an operating rule and an audit artifact. The session handoff is both a startup document and a continuity mechanism.

The better model is a graph:

- A document is a node.
- A relationship is an edge.
- Navigation can be filtered by purpose, language, topic, or current task.
- A document can belong to multiple conceptual neighborhoods without being duplicated.

## Tool Survey

| Tool | Fit | Strength | Limitation |
| --- | --- | --- | --- |
| [Markmap](https://markmap.js.org/docs/markmap) | Medium | Turns Markdown hierarchy into an interactive mind map quickly. | Best for one document's internal heading tree, not cross-document relationships. |
| [Obsidian Graph View](https://help.obsidian.md/plugins/graph) | High as a product reference | Treats notes as nodes and internal links as edges; includes graph filtering and local graph depth. | It is an external authoring app, not directly embedded in this docs site. |
| [Cytoscape.js](https://js.cytoscape.org/) | High and adopted | Full graph model, layouts, traversal, filtering, directed and compound graph support. | Adds dependency weight and implementation surface. |
| [Sigma.js](https://v4.sigmajs.org/) | High when graph grows large | WebGL rendering, pan/zoom/hover, and Graphology ecosystem for graph algorithms. | More useful for larger network exploration than for the current small docs set. |
| [D3 Force](https://d3js.org/d3-force) | Medium | Flexible force simulation with SVG or Canvas rendering. | Requires more custom interaction, layout, and accessibility work. |
| [React Flow](https://reactflow.dev/learn/concepts/terms-and-definitions) | Medium | Strong node-edge UI model for editable workflows and diagrams. | Better for flow editors than passive knowledge-graph browsing; current site is vanilla JS. |

## Recommendation

Use a staged approach.

Phase 1 was a zero-dependency built-in concept map. It proved the data model but did not make document-to-document relationships clear enough.

The current implementation uses Cytoscape.js for graph rendering. The docs manifest still compiles graph data from existing documentation metadata:

- Reading path membership creates `organizes` edges.
- English and Chinese companion documents create `companion` edges.
- Markdown links create `references` edges.

This keeps Markdown as the source of truth while using a graph-native renderer for layout, interaction, and relationship inspection.

Phase 2 should add explicit relationship metadata when the implicit graph is no longer enough. Candidate relationship types:

- `depends_on`
- `updates`
- `evidence_for`
- `implements`
- `supersedes`
- `blocks`
- `belongs_to`

If the graph becomes very large or needs WebGL-scale rendering, Sigma.js remains the next candidate. For the current docs graph, Cytoscape.js is the better fit because it emphasizes interactive graph structure rather than only large-network rendering.

## Current Decision

The project should adopt the concept map now, but keep its data model conservative:

- Keep Markdown as the source of truth.
- Generate graph data during `npm run prepare:docs`.
- Render the graph with Cytoscape.js in the browser docs site.
- Use reading path, language, and search filters to keep the graph understandable.
- Select a node to highlight its relationship neighborhood.
- Use the right panel to inspect relationship counts and edge types.

This matches the document-engineering direction: the documentation system behaves more like a codebase, where relationships between modules matter as much as the folder layout.
