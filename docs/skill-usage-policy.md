# Skill Usage Policy

## Purpose

This project uses skills as auditable execution procedures, not as vague inspiration.

When a task says a skill is required, the agent should leave evidence that the skill was actually consulted and applied.

## Policy

For every task that lists a required skill in [TASKS.md](../TASKS.md), the agent must:

1. Announce the skill before doing the task.
2. Read or reference the local `SKILL.md` when available.
3. Follow the relevant workflow steps.
4. Record evidence in [Skill Usage Log](skill-usage-log.md).
5. Record deviations when a skill step cannot be followed.

## Minimum Evidence

Each skill usage log entry should include:

- date
- task id or task name
- skill name
- local skill path or source URL
- reason for using the skill
- workflow steps followed
- output artifacts
- deviations or skipped steps
- verification performed

## Required Skill Declaration

Before work begins, the agent should state:

```text
Required skill: <skill-name>
Skill source: <local SKILL.md path or source URL>
Why: <task-specific reason>
Expected output: <artifact path or result>
```

## Output Annotation

When a document is produced using a skill, it should mention the skill in one of these ways:

- in the document introduction
- in a "Method" section
- in the skill usage log
- in the final task summary

For example:

```text
This issue breakdown applies the `to-issues` skill and uses vertical slices, HITL/AFK labels, dependencies, and acceptance criteria.
```

## Deviations

If a skill requires a step that is not possible in this project, the agent must record the deviation.

Examples:

- `to-prd` asks to publish to an issue tracker, but no issue tracker is configured.
- `to-issues` asks to publish tracker issues, but this project currently stores local issue drafts.
- `commit-work` expects Git staging and commits, but a task is only creating a planning draft and does not need a commit yet.

## Review Checklist

Before a task is considered complete:

- [ ] Required skill was named before execution.
- [ ] Local `SKILL.md` or source URL was checked.
- [ ] The output follows the skill's core structure.
- [ ] Deviations are explicitly recorded.
- [ ] Skill usage is logged.
- [ ] Verification evidence is included.

## Current Required Skill Map

| Work type | Required skill |
| --- | --- |
| PRD generation | `to-prd` |
| Issue breakdown | `to-issues` |
| Implementation planning | `project-planner` |
| Completion verification | `verification-before-completion` |
| Git-style documentation change or commit | `commit-work` |
| Project/task workflow updates | `project-planner` or `commit-work` |

