# Documentation System Module Passport

## Readiness

Current level: **M4 - Verified**

Target level: **M5 - Reusable**

The documentation system is no longer just project notes. It is an operating module that helps humans and AI agents understand, resume, audit, and govern the project.

## Purpose

Own the project's knowledge layer:

- preserve product intent
- preserve execution context
- expose task state
- record skill usage
- support bilingual human-agent collaboration
- provide browser-readable navigation
- surface document relationships as a concept map

## Non-purpose

This module does not own:

- production screenshot-to-design algorithms
- model provider implementation
- UI AST parsing implementation
- component clustering implementation
- design token extraction implementation
- final reconstruction output

It can document those modules, but it should not hide missing technical implementation behind polished docs.

## Inputs

- English source documents
- Chinese companion documents
- user decisions and product feedback
- skill usage records
- session handoff context
- task board updates
- Markdown links between docs
- reading-path metadata in `scripts/build-docs-content.mjs`

## Outputs

- Markdown documentation
- bilingual companion docs
- task board
- session handoff
- skill usage audit log
- local browser docs site
- generated docs manifest
- generated document concept map

## Contract

Canonical content stays in Markdown:

```text
README.md
TASKS.md
START_HERE.md
docs/*.md
docs/zh-CN/*.md
.codex/handoffs/current.md
```

Generated reading artifacts are not source of truth:

```text
public/content/
public/docs-manifest.json
```

Every important documentation change should satisfy:

- English source exists for agent execution.
- Chinese companion exists for human review when the doc affects project direction.
- The doc is registered in `scripts/build-docs-content.mjs` if it should appear in the browser site.
- Skill usage is recorded when a required skill shaped the work.
- The task board or handoff is updated when the change affects future execution.

## Dependencies

- Node.js runtime for the local docs site
- `npm run build` for manifest generation
- `npm run dev` for browser reading
- Browser verification for visible docs-site changes
- Git commits for change auditability
- Codex skills used by task type

## Verification

Minimum verification for this module:

- `npm run build` succeeds.
- The docs manifest includes the expected document count.
- New important docs appear in the browser navigation.
- Concept Map still renders nodes and edges.
- Internal Markdown links resolve inside the docs site where possible.
- `git diff --check` has no whitespace errors.

Optional stronger checks:

- verify English/Chinese companion coverage
- verify every registered doc exists on disk
- verify every doc source has reading-path metadata
- verify graph edges are nonzero after manifest generation

## Failure Modes

| Failure | Signal | Response |
| --- | --- | --- |
| Doc exists but is not discoverable | Missing from browser nav or concept map | Register it in `scripts/build-docs-content.mjs`. |
| English and Chinese drift | Different decisions or priorities | Update both, preserving English execution detail and Chinese product intent. |
| Docs look complete but task state is stale | `TASKS.md` or handoff contradict current direction | Update task board and handoff in the same change. |
| Skill usage is untraceable | No entry in skill usage log | Add log entry with source, reason, outputs, deviations, verification. |
| Concept map becomes noisy | Too many edges or unclear labels | Add relationship metadata and filters before adopting a larger graph library. |
| Browser site diverges from source | Generated content stale | Run `npm run build` or restart `npm run dev`. |

## Replaceability

The docs site implementation can be replaced by VitePress, Docusaurus, Astro, Obsidian Publish, Quartz, or another tool if these contracts remain stable:

- Markdown remains canonical.
- Bilingual structure remains explicit.
- Task state remains visible.
- Session handoff remains predictable.
- Skill usage remains auditable.
- Concept map or relationship graph remains available.
- Local startup stays simple for a fresh Codex session.

## Decisions

- [Documentation System](../documentation-system.md)
- [Docs Site](../docs-site.md)
- [Information Architecture](../information-architecture.md)
- [Concept Map Research](../concept-map-research.md)
- [Module Governance First](../module-governance-first.md)
- [Skill Usage Policy](../skill-usage-policy.md)
- [Session Continuity](../session-continuity.md)

## Next Promotion Gate

To reach **M5 - Reusable**, this module needs:

- a reusable documentation-system setup checklist
- a module passport template
- automated companion coverage checks
- automated manifest consistency checks
- a short guide for transplanting this docs system into another project

The first concrete upgrade should be:

> Create a reusable module passport template and use it for the next technical module.
