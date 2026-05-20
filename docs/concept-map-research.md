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

## Relationship Governance

The concept map should not treat every relationship as equally important. Dense graphs quickly become unreadable and can hide document coupling problems.

Language should be treated as graph scope:

- `中文决策图`: default decision-making view for Chinese companion docs.
- `English execution`: execution-oriented view for English source docs.
- `All audit`: full coverage view for checking bilingual parity and cross-language relationships.

This reduces visual noise from language companion links and lets each audience inspect the graph it actually needs.

Relationship weights:

| Relationship | Purpose | Default visual weight |
| --- | --- | --- |
| `references` | Knowledge or execution relationship between docs. | High |
| `companion` | Bilingual mapping between English and Chinese docs. | Low, mostly useful in audit mode |
| `path` | Reading-path membership and navigation aid. | Ambient, hidden outside audit mode |

The graph should also expose coupling signals:

- `degree`: total number of connected relationships.
- `weighted degree`: degree adjusted by relationship importance.
- `max degree`: highest degree in the current graph scope.
- `high coupling nodes`: nodes above the current coupling threshold.

A high-degree document is not always wrong. It may be a legitimate hub, index, or policy. But high degree should be intentional. If a normal module document accumulates too many strong links, it may need to be split, converted into a hub, or given a clearer interface.

Software engineering principles applied to document graphs:

- **Separation of concerns**: Chinese decision docs and English execution docs should be inspectable separately.
- **High cohesion, low coupling**: a document should have a clear responsibility and avoid unnecessary strong links.
- **Stable dependencies**: stable principle or contract docs may be referenced widely; temporary task or log docs should not become dependency hubs.
- **Layered architecture**: principles, product docs, module contracts, plans, evidence, and logs should not form uncontrolled cycles.
- **Interface segregation**: if one document serves too many readers or jobs, split it into explanation, how-to, reference, decision, or audit surfaces.

## Obsidian-Inspired Rendering

Obsidian's graph view is useful as a product reference because it does not try to display every piece of graph information at once. Its graph settings separate the problem into:

- filters for what nodes and links enter the graph
- groups for visual categorization
- display controls such as arrows, text fade threshold, node size, and link thickness
- force controls such as center force, repel force, link force, and link distance
- local graph depth for inspecting a smaller neighborhood

The docs site should borrow this interaction model:

- Nodes are rendered as circles rather than text-heavy boxes.
- Labels are hidden by default and only shown for selected nodes.
- Hovering or selecting a node highlights its local neighborhood.
- Weak navigation edges stay ambient or hidden outside audit mode.
- Layout uses stronger repel force and longer link distance to reduce overlap.
- The right panel carries the details, so the graph canvas can stay visually quiet.

This makes the graph closer to a coupling and relationship inspection tool, rather than a diagram that attempts to label every document at once.

## Obsidian-Style Interaction Applied

The current docs site applies the Obsidian interaction model through reusable Cytoscape.js behavior rather than a new custom renderer.

Important correction:

- The next fidelity pass should not continue from product reference alone.
- The project has now separately researched open source implementations in [Obsidian Graph Open Source Research](obsidian-graph-open-source-research.md).
- GraphFrontier is the leading reuse/reference candidate for a higher-fidelity implementation spike.

Discovery gate:

- Problem: make the knowledge graph readable and controllable in the same spirit as Obsidian Graph View.
- Existing options checked: Obsidian Graph View as a product reference, Cytoscape.js as the already-adopted renderer, Sigma.js as a future large-graph option.
- Recommended path: keep Cytoscape.js and add Obsidian-style controls around it.
- Why not self-build: force-directed rendering, pan/zoom, selection, and graph traversal are already handled by Cytoscape.
- Verification: browser checks should confirm global/local mode, local depth, graph settings, and node/edge counts.
- Reversibility: controls are plain state and can be replaced without changing the Markdown manifest.

Implemented interaction controls:

- `Scope`: Chinese decision graph, English execution graph, or all-audit graph.
- `View`: global graph or local graph around the active document.
- `Local depth`: 1, 2, or 3 hops from the active document.
- `Graph settings`: labels, arrows, bilingual links, path links, node size, link thickness, repel force, and link distance.

Default behavior now keeps the graph quieter:

- Document reference links are visible by default.
- Bilingual links are available but hidden by default.
- Reading-path links are available but hidden by default.
- Labels are hidden by default and can be enabled when the user wants a more literal map.

This gives the user an Obsidian-like exploration loop:

1. Start from the global graph.
2. Switch to a language scope for decision or execution work.
3. Switch to local graph when inspecting one document's neighborhood.
4. Increase local depth only when the neighborhood is too narrow.
5. Turn on labels, arrows, path links, or bilingual links only when needed.
