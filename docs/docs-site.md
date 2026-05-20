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

- Sidebar grouped by documentation section
- Language filter: all, English, Chinese
- Text search across title, path, section, and summary
- Markdown rendering for headings, lists, tables, links, code blocks, and blockquotes
- Right-side table of contents on wide screens
- Responsive navigation on smaller screens
- Internal Markdown links resolve to docs-site navigation where possible
- Cytoscape-powered Concept Map view for document nodes, reading-path edges, bilingual companion edges, and Markdown reference edges
- Node selection highlights relationship neighborhoods and summarizes edge types in the right panel

## Verification

Verified locally with the browser at:

```text
http://127.0.0.1:4173
```

Checks performed:

- default document loads as `START_HERE.md`
- 51 documentation files appear in navigation
- Reading-path filters reduce the navigation to task-focused sets
- Concept Map view renders with Cytoscape canvas, 57 nodes, and 321 relationship edges
- Chinese language filter shows Chinese docs
- Chinese docs index opens correctly
- table of contents is generated for headings

## Notes

This docs site is a reading layer, not the source of truth.

Canonical docs remain:

- root Markdown files
- `docs/*.md`
- `docs/zh-CN/*.md`
