# Current Handoff

## Project

Screenshot to Design System

Project path:

```text
/Users/qyx/Desktop/project/screenshot-to-design-system
```

## Created

2026-05-18

## Current State Summary

The project is now a standalone Git repository on branch `main`.

It contains a bilingual documentation system for a screenshot-to-design-system product workflow. The docs cover product framing, PRD, issue breakdown, project management, document engineering, skill usage auditing, and session continuity.

The project now also includes a workflow retrospective loop for analyzing collaboration friction and converting it into concrete process improvements.

The project now includes a zero-dependency local browser documentation site for reading the Markdown system at `http://127.0.0.1:4173`.

The docs site navigation now uses task-based reading paths in addition to language and section filters.

The docs site now includes a Concept Map view. The build script generates a graph from reading-path membership, bilingual companion docs, and Markdown links. The browser view lets users inspect document nodes and relationship edges directly.

The project now follows a module-governance-first planning model: mature module boundaries, contracts, verification, and readiness levels should precede a broad product MVP.

## Latest Commits

```text
docs(workflow): add module-governance-first model
feat(docs): add concept map navigation
516cce8 feat(docs): add reading-path navigation
```

## Important Files

- [START_HERE.md](../../START_HERE.md)
- [TASKS.md](../../TASKS.md)
- [PRD](../../docs/prd.md)
- [Issue Breakdown Draft](../../docs/issue-breakdown-draft.md)
- [Skill Usage Policy](../../docs/skill-usage-policy.md)
- [Skill Usage Log](../../docs/skill-usage-log.md)
- [Document Engineering Workflow](../../docs/document-engineering-workflow.md)
- [Session Continuity](../../docs/session-continuity.md)
- [Workflow Retrospective](../../docs/workflow-retrospective.md)
- [Docs Site](../../docs/docs-site.md)
- [Information Architecture](../../docs/information-architecture.md)
- [Concept Map Research](../../docs/concept-map-research.md)
- [Module Governance First](../../docs/module-governance-first.md)
- [Chinese Docs Index](../../docs/zh-CN/index.md)

## Decisions Made

- English docs are canonical for execution.
- Chinese companion docs are used for product understanding and quality control.
- Required skill usage must be logged.
- Documentation changes should follow Git-style review and Conventional Commit discipline.
- New sessions should start from `START_HERE.md` and this handoff file instead of relying on previous chat history.
- Major workflow friction should trigger a retrospective and at least one concrete project update.
- The docs site is a reading layer; canonical content remains in Markdown files.
- Documentation navigation should prioritize reader tasks before file categories.
- Documentation can be represented as a graph: documents are concept nodes and relationships are edges.
- Graph rendering should stay zero-dependency until the project needs Cytoscape.js, Sigma.js, or another dedicated graph library.
- Product MVP should be composed from modules that have explicit readiness levels.

## Current Tasks

Likely next task:

```text
T-020: Promote UI AST parsing from M1 to M3
```

Required skill:

```text
project-planner
```

Related docs:

- [Task Board](../../TASKS.md)
- [Module Governance First](../../docs/module-governance-first.md)
- [Project Management Workflow](../../docs/project-management.md)
- [Issue Breakdown Draft](../../docs/issue-breakdown-draft.md)

## Immediate Next Steps

1. Read [START_HERE.md](../../START_HERE.md).
2. Read [TASKS.md](../../TASKS.md).
3. Install or read the `project-planner` skill before starting T-003.
4. Create an implementation plan for promoting `UI AST parsing` from M1 to M3.
5. Record skill usage in [Skill Usage Log](../../docs/skill-usage-log.md).
6. Update this handoff after completing the plan.

To browse docs locally:

```bash
npm run dev
```

Then open:

```text
http://127.0.0.1:4173
```

Click `Concept map` in the top bar to inspect the document graph.

## Blockers

- No blocker for continuing documentation planning.
- Issue tracker is not configured; issue drafts are local Markdown docs.
- `project-planner` workflow may need to be installed or read before use.

## Verification Status

Last known clean Git state after commit:

```text
docs(workflow): add module-governance-first model
```

New session should still run:

```bash
git status --short
git branch --show-current
git log --oneline -5
```
