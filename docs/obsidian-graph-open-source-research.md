# Obsidian Graph Open Source Research

## Purpose

This document corrects the earlier gap in the Concept Map workflow: before trying to make the graph look more like Obsidian by custom tuning, the project should first evaluate open source implementations that already solve part of the problem.

The goal is not to avoid reuse. The goal is to reuse aggressively while still understanding license, architecture, and maintenance risk.

## Evaluation Problem

We want the documentation Concept Map to feel much closer to Obsidian Graph View:

- dark graph canvas
- smooth pan and zoom
- hover focus and dimming
- local graph exploration
- visual groups
- display and force controls
- filter/search behavior
- stable interaction for a growing documentation graph

The question is:

> Should we import, adapt, or study an existing open source Obsidian-style graph implementation before continuing custom work?

## Sources Checked

| Project | Source | License signal | Notes |
| --- | --- | --- | --- |
| Obsidian Graph View | <https://help.obsidian.md/plugins/graph> | Product reference, not reusable source | Baseline behavior: filters, groups, display controls, forces, and local graph depth. |
| Juggl | <https://github.com/HEmile/juggl> | GPL-3.0 | Mature Obsidian plugin, Cytoscape-adjacent, strong local graph reference. |
| Obsidian Extended Graph | <https://github.com/ElsaTam/obsidian-extended-graph> | GPL-style repository signal / unclear in API summary | Strong reference for advanced graph settings inside Obsidian. |
| GraphFrontier | <https://github.com/pikiby/GraphFrontier> | MIT | Independent Obsidian graph plugin with custom physics/rendering; strongest direct reuse candidate. |
| Obsidian Digital Garden | <https://github.com/oleeskild/obsidian-digital-garden> | MIT | Strong reference for publishing Obsidian-style content; weaker fit for graph interaction reuse. |

## Candidate Assessment

### GraphFrontier

Fit: High as a reuse/reference candidate.

Why it matters:

- MIT license.
- Independent graph view rather than a wrapper over Obsidian's built-in graph.
- Uses plain JavaScript, custom canvas rendering, and its own physics engine.
- Source structure is small and understandable:
  - `src/render.js`
  - `src/physics.js`
  - `src/view.js`
  - `src/constants.js`
- Feature set maps well to this project's needs: pin nodes, save layout, orbit layout, edge painting, hide edges, find/filter behavior, orphan separation, and physics controls.

Main limitation:

- It is still an Obsidian plugin. The data collection and UI lifecycle are tied to Obsidian APIs.
- Direct import is unlikely to be clean, but rendering and physics ideas are very reusable.

Recommendation:

- Use GraphFrontier as the primary implementation reference.
- Do not copy wholesale into the docs site yet.
- First extract a small compatibility design:
  - graph model adapter from our docs manifest
  - canvas renderer module
  - physics module
  - side-panel controls
  - local graph/filter behavior

### Juggl

Fit: High as product and Cytoscape interaction reference, low as direct dependency.

Why it matters:

- It is a mature graph-oriented Obsidian plugin.
- It explicitly targets an advanced local graph experience.
- It is closer to our current Cytoscape direction than GraphFrontier's custom canvas renderer.

Main limitation:

- GPL-3.0 license makes direct integration risky for a commercial or proprietary product.
- It is deeply shaped around Obsidian plugin constraints.

Recommendation:

- Study interaction model, not implementation copy.
- Especially useful for local graph behavior, node styling, and graph expansion concepts.

### Obsidian Extended Graph

Fit: High as settings reference, low as direct dependency.

Why it matters:

- Extends Obsidian graph with advanced settings.
- Useful reference for group rules, node/edge styling, statistics-driven size, and filtering.

Main limitation:

- Obsidian plugin dependency surface is high.
- License/reuse posture is less attractive than MIT candidates.

Recommendation:

- Use as a reference for settings taxonomy and group/filter capabilities.
- Do not import directly before a license and architecture review.

### Obsidian Digital Garden

Fit: Medium as docs publishing reference, low as graph interaction implementation.

Why it matters:

- MIT license.
- Strong ecosystem reference for publishing Obsidian-style content.
- Aligns with our broader docs-site problem.

Main limitation:

- It is not primarily a graph interaction engine.
- It is more relevant if we decide to replace the custom docs site with a publishing framework.

Recommendation:

- Keep as a future docs-site replacement candidate.
- Not the main path for the graph interaction rewrite.

## Decision

Do not continue tuning the current Cytoscape graph blindly.

Preferred path:

1. Use GraphFrontier as the primary open source reference because it has the best mix of license safety, graph-specific interaction, and implementation clarity.
2. Keep Cytoscape in place for the next small iteration only if we are still validating the interaction model.
3. If the user wants a truly Obsidian-like result, run a focused spike to port GraphFrontier-style canvas rendering and physics into the docs site.
4. Treat Juggl and Extended Graph as interaction references, not direct imports, because of license and Obsidian API coupling.

## Build-vs-Buy Decision

Discovery gate:

- Problem: replicate Obsidian-like graph interaction in the docs site.
- Existing options checked: Obsidian Graph View, Juggl, Extended Graph, GraphFrontier, Digital Garden.
- Recommended path: build a small graph module using GraphFrontier as the primary reference, while retaining the current manifest data model.
- Why not pure self-build: GraphFrontier already solves many interaction and physics problems we would otherwise rediscover.
- Why not direct import immediately: GraphFrontier is an Obsidian plugin, so data collection and lifecycle code must be separated from reusable rendering ideas.
- Verification: create a spike that proves one canvas graph can render docs nodes, focus dimming, label threshold, pan/zoom, and local graph behavior.
- Reversibility: keep the graph module behind the existing `manifest.graph` interface so Cytoscape can be restored if the spike fails.

## Proposed Spike

Create a branch or scoped commit that does only the following:

1. Add a `src/graph/` module boundary.
2. Keep `manifest.graph` unchanged.
3. Implement or adapt:
   - canvas render loop
   - node radius formula
   - label zoom threshold
   - hover focus dimming
   - edge alpha and color helpers
   - simple physics loop or static force layout import
4. Keep current Cytoscape view behind a fallback flag until the spike is validated.
5. Verify with the same browser checks:
   - graph is nonblank
   - global graph renders
   - local graph renders
   - hover dimming works
   - labels appear at expected zoom/focus state
   - no major overlap on desktop viewport

## Open Questions

- Is GPL-derived interaction study acceptable if no GPL code is copied?
- Should the next spike prioritize visual fidelity or interaction correctness?
- Should saved node layout become part of the docs module contract?
- Should hidden edges and edge painting be exposed now, or deferred until the graph has explicit relationship metadata?
