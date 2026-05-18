# Start Here

Use this file when starting a fresh Codex session in this project.

## Project Path

```text
/Users/qyx/Desktop/project/screenshot-to-design-system
```

## First Commands

```bash
pwd
git status --short
git branch --show-current
git log --oneline -5
```

Expected branch:

```text
main
```

## Read These First

Read in this order:

1. [Current Handoff](.codex/handoffs/current.md)
2. [Task Board](TASKS.md)
3. [Skill Usage Policy](docs/skill-usage-policy.md)
4. [Document Engineering Workflow](docs/document-engineering-workflow.md)
5. [PRD](docs/prd.md), only if product context is needed
6. [Chinese Docs Index](docs/zh-CN/index.md), when the user wants Chinese-facing context

## Current Project State

This is a documentation-first project for building a screenshot-to-design-system workflow.

The project already has:

- bilingual documentation system
- PRD
- issue breakdown
- task board
- document engineering workflow
- skill usage audit policy
- Git repository on `main`

## Next Likely Work

Current likely next task:

```text
T-003: Write implementation plan for UI AST run
```

Required skill:

```text
project-planner
```

Before doing that task:

1. Read the required skill's `SKILL.md`.
2. Record usage in [Skill Usage Log](docs/skill-usage-log.md).
3. Update [Current Handoff](.codex/handoffs/current.md) if the session changes project state.

## Session Rules

- Do not rely on previous chat history.
- Treat project files as the source of truth.
- Use English docs for execution detail.
- Use Chinese docs for product intent and user-facing review.
- Keep changes scoped.
- Review diffs before commit.
- Update bilingual companion docs when decisions change.
- Record required skill usage.

