# Docs Site

## Purpose

This project includes a local browser documentation site so the documentation system can be read as a navigable web app instead of only raw Markdown files.

The site is intentionally lightweight:

- no framework dependency
- one npm install step for the graph dependency
- generated content is copied from the canonical Markdown docs
- English and Chinese docs are both available
- concept map graph data is generated from Markdown links and docs metadata
- generated files are ignored by Git

## Run Locally

From the project root:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:4173
```

## Build Content

To refresh the docs manifest and copied Markdown content:

```bash
npm run build
```

This runs:

```bash
node scripts/build-docs-content.mjs
```

Generated files:

```text
public/content/
public/docs-manifest.json
public/vendor/
```

These are build artifacts and are ignored by Git.

## Files

```text
index.html
src/main.js
src/styles.css
scripts/build-docs-content.mjs
scripts/dev-server.mjs
package.json
package-lock.json
```

## Features

- Two-column workbench: Structure Tree map navigator on the left and document reader on the right
- Fallback document list for search, small screens, and accessibility
- Language filter: all, English, Chinese
- Text search across title, path, section, and summary
- Markdown rendering for headings, lists, tables, links, code blocks, and blockquotes
- Right-side table of contents on wide screens
- Responsive navigation on smaller screens
- Internal Markdown links resolve to docs-site navigation where possible
- Map navigator with two modes:
  - Structure Tree for project lifecycle, module, section, topic, and document hierarchy, rendered with Mind Elixir
  - Relationship Graph for document nodes, reading-path edges, bilingual companion edges, and Markdown reference edges
- Structure Tree is the default navigation view; Relationship Graph is the audit view
- Structure Tree labels are normalized across root, module, section, topic, and document levels
- Dense Structure Tree sections are split into topic groups; Workflow is organized into Reading System, Structure Views, Agent Workflow, Reuse Rules, and Audit Trail
- Document leaves use short concept labels while retaining full document titles in metadata
- Relationship Graph selection highlights relationship neighborhoods and summarizes edge types in the right panel
- Concept Map scope switcher: Chinese decision graph, English execution graph, and full audit graph
- Low-value relationship types are visually downweighted so strong document references are easier to inspect
- Obsidian-inspired graph rendering: circular nodes, hidden default labels, hover/selection neighborhoods, and quieter canvas density
- Obsidian-style graph controls: global/local view, local depth, labels, arrows, bilingual links, path links, node size, link thickness, repel force, and link distance

## Verification

Verified locally with the browser at:

```text
http://127.0.0.1:4173
```

Checks performed:

- default document loads as `START_HERE.md`
- Reading-path filters reduce the navigation to task-focused sets
- 59 documentation files appear in navigation
- Two-column workbench renders `.map-pane` and `.reader-pane`
- Structure Tree renders through Mind Elixir with 87 tree nodes, 59 visible docs, and 10 topic groups for dense Workflow sections
- Chinese Structure Tree scope renders 29 docs and 46 tree nodes, with redundant Chinese prefixes removed
- Relationship Graph view renders with canvas; the default global graph shows 59 document nodes and 254 visible relationships
- Local graph mode narrows the active document neighborhood to 8 nodes and 20 edges at depth 1
- Chinese and English graph scopes can be switched independently
- Graph settings expose 4 toggles and 4 sliders
- Chinese language filter shows Chinese docs
- Chinese docs index opens correctly
- table of contents is generated for headings

## Notes

This docs site is a reading layer, not the source of truth.

Canonical docs remain:

- root Markdown files
- `docs/*.md`
- `docs/zh-CN/*.md`
