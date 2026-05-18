# Project Management Workflow

## Purpose

This document records the project-management workflow selected after researching Skills.sh options for the Screenshot to Design System project.

The project has grown beyond loose research notes. It now needs:

- a single task board
- a PRD-to-issue workflow
- implementation plans for individual slices
- verification gates before calling work complete

## Skills.sh Findings

### project-planner

Source:

- <https://skills.sh/hieutrtr/ai1-skills/project-planner>

Why it matters:

- supports breaking feature requests into implementation plans
- maps affected modules
- defines verification criteria
- identifies risks and unknowns
- writes a plan file for follow-up decomposition

Use in this project:

- create implementation plans for larger slices such as UI AST, debug viewer, clustering, reconstruction, and diffing
- maintain risk and verification notes per milestone

Fit:

- High

Decision:

- Use the workflow concept, but adapt the module map to this project instead of assuming a Python/React web app.

### task-decomposition

Source:

- <https://skills.sh/hieutrtr/ai1-skills/task-decomposition>

Why it matters:

- intended as a follow-up to `project-planner`
- useful for turning a plan into smaller implementation tasks

Fit:

- Medium

Decision:

- Do not adopt yet because the Skills.sh page does not expose a readable `SKILL.md`.
- Revisit after the first implementation plan exists.

### GSD Project Management System

Source:

- <https://skills.sh/ctsstc/get-shit-done-skills/gsd>

Why it matters:

- comprehensive project-management system for solo developers
- includes project initialization, roadmaps, phase planning, execution, verification, debugging, and progress tracking
- creates a `.planning/` structure for project context and phase artifacts

Fit:

- Medium

Decision:

- Do not adopt wholesale yet. It is powerful but heavier than the current project needs.
- Borrow the useful idea of phase-based execution and verification.

### to-prd

Source:

- <https://www.skills.sh/mattpocock/skills/to-prd>

Current use:

- Already installed and applied.
- Produced [PRD](prd.md).

Fit:

- High

Decision:

- Keep using it when major product context changes.

### to-issues

Source:

- <https://www.skills.sh/mattpocock/skills/to-issues>

Current use:

- Already installed and applied.
- Produced [Issue Breakdown Draft](issue-breakdown-draft.md).

Fit:

- High

Decision:

- Use this as the main issue-slicing model.
- Prefer vertical slices over horizontal module-only tasks.

### verification-before-completion

Source:

- <https://www.skills.sh/obra/superpowers/verification-before-completion>

Why it matters:

- requires fresh verification before claiming work is done
- fits this project because visual and structural quality need measurable evidence

Fit:

- High

Decision:

- Use as a process rule even before installing the skill.
- Every implementation task should include a verification section.

## Chosen Workflow

```text
Research docs
  -> PRD
  -> vertical issue breakdown
  -> task board
  -> implementation plan for selected task
  -> execution
  -> verification evidence
  -> task board update
```

## Project Files

- [Task Board](../TASKS.md): day-to-day task status
- [PRD](prd.md): product requirements
- [Issue Breakdown Draft](issue-breakdown-draft.md): vertical implementation slices
- `docs/plans/`: future detailed implementation plans
- `docs/verification/`: future verification notes and reports

## Current Task Policy

The project should use three task levels:

1. Product scope: PRD and roadmap.
2. Vertical slice: issue breakdown.
3. Execution task: task board and implementation plans.

Avoid creating tasks that only say "build schema" or "build UI" without an end-to-end verification artifact. Each implementation slice should produce something inspectable.

## Immediate Next Step

Approve or revise the issue breakdown, then write an implementation plan for:

> Create the First Validated UI AST Run

That plan should include:

- objective
- affected modules
- artifact outputs
- verification criteria
- risks and unknowns
- acceptance criteria

