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

## Latest Commits

```text
3a210ef docs(workflow): add auditable skill usage process
a52c37a docs(project): initialize screenshot-to-design-system documentation
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
- [Chinese Docs Index](../../docs/zh-CN/index.md)

## Decisions Made

- English docs are canonical for execution.
- Chinese companion docs are used for product understanding and quality control.
- Required skill usage must be logged.
- Documentation changes should follow Git-style review and Conventional Commit discipline.
- New sessions should start from `START_HERE.md` and this handoff file instead of relying on previous chat history.
- Major workflow friction should trigger a retrospective and at least one concrete project update.
- The docs site is a reading layer; canonical content remains in Markdown files.

## Current Tasks

Likely next task:

```text
T-003: Write implementation plan for UI AST run
```

Required skill:

```text
project-planner
```

Related docs:

- [Task Board](../../TASKS.md)
- [Project Management Workflow](../../docs/project-management.md)
- [Issue Breakdown Draft](../../docs/issue-breakdown-draft.md)

## Immediate Next Steps

1. Read [START_HERE.md](../../START_HERE.md).
2. Read [TASKS.md](../../TASKS.md).
3. Install or read the `project-planner` skill before starting T-003.
4. Create an implementation plan for `Create the First Validated UI AST Run`.
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

## Blockers

- No blocker for continuing documentation planning.
- Issue tracker is not configured; issue drafts are local Markdown docs.
- `project-planner` workflow may need to be installed or read before use.

## Verification Status

Last known clean Git state after commit:

```text
3a210ef docs(workflow): add auditable skill usage process
```

New session should still run:

```bash
git status --short
git branch --show-current
git log --oneline -5
```
