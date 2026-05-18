# Docs Site

## Purpose

This project includes a local browser documentation site so the documentation system can be read as a navigable web app instead of only raw Markdown files.

The site is intentionally lightweight:

- no framework dependency
- no install step required beyond Node.js
- generated content is copied from the canonical Markdown docs
- English and Chinese docs are both available
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
```

## Features

- Sidebar grouped by documentation section
- Language filter: all, English, Chinese
- Text search across title, path, section, and summary
- Markdown rendering for headings, lists, tables, links, code blocks, and blockquotes
- Right-side table of contents on wide screens
- Responsive navigation on smaller screens
- Internal Markdown links resolve to docs-site navigation where possible

## Verification

Verified locally with the browser at:

```text
http://127.0.0.1:4173
```

Checks performed:

- default document loads as `START_HERE.md`
- 43 documentation files appear in navigation
- Chinese language filter shows Chinese docs
- Chinese docs index opens correctly
- table of contents is generated for headings

## Notes

This docs site is a reading layer, not the source of truth.

Canonical docs remain:

- root Markdown files
- `docs/*.md`
- `docs/zh-CN/*.md`
