# Mind Map Library Evaluation

## Purpose

This document corrects the Structure Tree implementation process.

The current SVG Structure Tree is useful as a product prototype, but it should not become the long-term implementation by default. Before adding collapse, expand, drag, zoom, search, or editing behavior, the project should evaluate mature libraries and decide what to reuse.

## Problem

The documentation site now has two concept-map views:

- Structure Tree for project management and reading paths.
- Relationship Graph for coupling and reference audits.

The Structure Tree should eventually behave more like a real mind map:

- clear root-to-concept paths
- collapsible branches
- zoom and pan
- node focus/search
- click-to-open document leaves
- possibly drag/reorder or lightweight editing
- stable rendering as the document set grows

The question is:

> Should we replace the custom SVG tree with an existing mind-map/tree library before adding more features?

## Candidates Checked

| Candidate | Source | Package signal | Fit |
| --- | --- | --- | --- |
| Markmap | <https://markmap.js.org/> / <https://github.com/markmap/markmap> | `markmap-view@0.18.12`, MIT, depends on D3 | Good for Markdown-outline-to-mind-map; weaker for manifest-driven project IA. |
| Mind Elixir | <https://github.com/SSShooter/mind-elixir-core> | `mind-elixir@5.11.0`, MIT | Strongest direct mind-map core candidate. |
| jsMind | <https://github.com/hizzgdev/jsmind> | `jsmind@0.9.1`, BSD-3-Clause | Lightweight classic mind-map candidate; API and visual style need a spike. |
| d3-hierarchy | <https://github.com/d3/d3-hierarchy> / <https://d3js.org/d3-hierarchy> | `d3-hierarchy@3.1.2`, ISC | Best layout-engine candidate if we keep our own SVG renderer. |
| Current native SVG | Local implementation | No new dependency | Good prototype and fallback; poor long-term feature leverage. |

## Evaluation

### Markmap

Strengths:

- Mature and focused on turning Markdown structure into a mind map.
- Uses D3 internally and has a browser renderer package.
- Strong fit if the canonical source is one Markdown outline.

Weaknesses:

- This project's source of truth is not one Markdown outline. It is a generated docs manifest plus reading-path metadata.
- To use Markmap cleanly, we would either synthesize Markdown from the manifest or bypass its strongest feature.
- Rich document metadata, bilingual filtering, and click-to-open behavior would need adapter work.

Decision:

- Keep as a reference for visual style and Markdown export.
- Do not choose as the primary structure-tree engine unless we intentionally convert the project IA into a generated Markdown outline.

### Mind Elixir

Strengths:

- It is a dedicated open source mind-map core, not just a layout helper.
- It is likely to cover the feature backlog that the current SVG version would otherwise need to grow manually: pan/zoom, branch interaction, node operations, styling, and mind-map behaviors.
- MIT license is friendly for this project.

Weaknesses:

- It is more product-like than a small layout primitive, so integration should be tested before committing.
- We need to verify read-only mode, custom node data, click handlers, keyboard behavior, and whether it can be styled to match the docs site.

Decision:

- Best candidate for the next spike.
- Run a focused spike that maps `docs-manifest.json` into Mind Elixir's data model and verifies read-only navigation plus collapse/expand.

### jsMind

Strengths:

- Lightweight and specifically built for browser mind maps.
- BSD-3-Clause license is usable.
- Good backup if Mind Elixir feels too heavy.

Weaknesses:

- Older visual model and API surface may need more adaptation.
- Need to verify responsiveness and styling quality before choosing it.

Decision:

- Keep as a fallback candidate.
- Test only if Mind Elixir fails the spike or proves too hard to style.

### d3-hierarchy

Strengths:

- Excellent fit for replacing the hand-written tree layout while keeping our own SVG renderer.
- Small, stable, and purpose-built for hierarchical layouts.
- Lets us retain full control over markup, styling, accessibility, and click behavior.

Weaknesses:

- It is a layout library, not a mind-map product.
- Collapse/expand, pan/zoom, search, and editing still need to be implemented or paired with other D3 modules.

Decision:

- Best fallback if we decide not to adopt a full mind-map library.
- Prefer `d3-hierarchy` over continuing the current custom layout math.

## Recommendation

Do not continue adding features to the current native SVG implementation as if it were the long-term architecture.

Recommended path:

1. Keep current SVG Structure Tree as the validated prototype and fallback.
2. Run a one-commit Mind Elixir spike:
   - add the dependency
   - convert manifest tree data into Mind Elixir data
   - render the same project lifecycle tree
   - verify collapse/expand, zoom/pan, read-only click-to-open, and styling control
3. If Mind Elixir passes, replace the native SVG tree with a small adapter around Mind Elixir.
4. If Mind Elixir fails, test `d3-hierarchy` as a layout-only replacement for the custom tree layout.
5. Keep Markmap as an export/reference option, not the main engine.

## Acceptance Criteria for the Spike

- Structure Tree still opens by default.
- Tree renders the same lifecycle groups as the current SVG prototype.
- Branches can collapse and expand.
- Pan/zoom behavior works without breaking the rest of the docs page.
- Clicking a document node opens the corresponding Markdown doc.
- Language and reading-path filters still constrain visible documents.
- The integration can be removed without affecting the relationship graph.

## Current Decision

The Mind Elixir spike passed the first usability gate.

Mind Elixir is now the primary Structure Tree renderer, with the previous native SVG tree retained as fallback.

Verified behavior:

- Structure Tree opens with Mind Elixir by default.
- The adapter maps the manifest tree into Mind Elixir `nodeData`.
- Initial rendering shows a readable root/module/section view instead of expanding all document leaves.
- Branch expanders are available for progressive disclosure.
- Scope filters still rerender the tree.
- Relationship Graph remains isolated and renders through the existing canvas path.
- Switching to Relationship Graph destroys the Mind Elixir host.

Follow-up hardening:

- Add an explicit "reset view" control for the Structure Tree.
- Improve initial camera positioning for different viewport widths.
- Add a browser test for expanding a section and opening a document leaf.
- Decide whether SVG fallback should remain permanently or be removed after another validation pass.
