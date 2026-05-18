# Workflow Retrospective

## Purpose

This document analyzes friction from the previous collaboration and turns it into workflow upgrades.

It applies the `context-retrospective` skill:

- `/Users/qyx/.codex/skills/context-retrospective/SKILL.md`

The goal is not to blame the agent or user. The goal is to identify which context, navigation, guidance, and workflow structures were missing, then reduce future friction.

## Retrospective Summary

The project advanced quickly from product idea to:

- research docs
- PRD
- issue breakdown
- project management workflow
- bilingual documentation
- Git-based document engineering
- auditable skill usage
- session handoff protocol

The main friction was not lack of effort. The friction came from missing process scaffolding that had to be invented mid-stream.

## Limitations Observed

### 1. Skills Were Sometimes Simulated Before Being Audited

Pattern:

- A skill was discussed or conceptually followed before its local `SKILL.md` was installed and read.

Impact:

- The user could not easily tell whether a skill was actually used.
- Outputs could look plausible but not be auditable.

Root cause:

- No skill usage policy existed at the start.
- Tasks did not declare required skills.
- There was no usage log.

Upgrade already made:

- Added [Skill Usage Policy](skill-usage-policy.md).
- Added [Skill Usage Log](skill-usage-log.md).
- Added `Required Skill` column to [TASKS.md](../TASKS.md).

Remaining improvement:

- Every future task should start with a required-skill declaration when applicable.

### 2. Project Context Was Initially Conversation-Centered

Pattern:

- Important decisions lived in chat before being converted into project files.

Impact:

- Switching sessions would lose context.
- The user had to ask whether a new session could resume smoothly.

Root cause:

- No fixed startup file.
- No handoff file.
- No session resumption protocol.

Upgrade already made:

- Added [START_HERE.md](../START_HERE.md).
- Added [Session Continuity](session-continuity.md).
- Added [.codex/handoffs/current.md](../.codex/handoffs/current.md).

Remaining improvement:

- Update the handoff file after any meaningful work session.

### 3. Documentation Grew Faster Than Navigation

Pattern:

- New docs were created quickly, but navigation and hierarchy had to be added afterward.

Impact:

- It became harder to know which doc was the entry point, source of truth, or execution artifact.

Root cause:

- No documentation system existed before docs started growing.
- English and Chinese roles were not defined early.

Upgrade already made:

- Added [Documentation System](documentation-system.md).
- Added [Chinese Docs Index](zh-CN/index.md).
- Added bilingual companion docs.

Remaining improvement:

- Every new major doc must be linked from README and, when relevant, the Chinese index.

### 4. Task Management Was Initially Implicit

Pattern:

- The conversation moved naturally from idea to docs to PRD to issue breakdown, but the project did not initially have a task board.

Impact:

- It was harder to distinguish "discussion", "decision", "next action", and "done".

Root cause:

- No task status system existed.
- No shared definition of `Next`, `Backlog`, or `Done`.

Upgrade already made:

- Added [TASKS.md](../TASKS.md).
- Added status legend.
- Added task IDs.
- Added required skills.

Remaining improvement:

- Move tasks from `Next` to `Done` only after verification and, when needed, a commit.

### 5. Git Discipline Was Added After Several Docs Already Existed

Pattern:

- The project became substantial before Git was initialized.

Impact:

- Early document evolution was not captured in small commits.
- The first commit had to include many files.

Root cause:

- Git workflow was not established at project creation time.

Upgrade already made:

- Initialized repository.
- Added [Document Engineering Workflow](document-engineering-workflow.md).
- Added `.gitignore`.
- Adopted Conventional Commits.

Remaining improvement:

- Future changes should be smaller and scoped to one workflow intent.

### 6. Verification Was Mostly Manual

Pattern:

- Verification relied on `rg`, `find`, `git status`, and human review.

Impact:

- Good enough for documentation setup, but not yet sufficient for implementation work.

Root cause:

- No automated doc validation or link checking exists yet.
- No implementation artifacts exist yet.

Recommended upgrade:

- Add a lightweight docs verification script later.
- Before implementation begins, define verification commands per task.

### 7. The Workflow Did Not Yet Have a Retrospective Loop

Pattern:

- Process improvements happened reactively when the user noticed friction.

Impact:

- The system improved, but only after the user had to ask.

Root cause:

- No trigger existed for "after significant interaction, run retrospective".

Upgrade introduced now:

- Add this retrospective doc.
- Add task `T-016`.
- Add operating rule: major interaction blocks should produce at least one process improvement.

## Root Cause Themes

### Missing Entry Points

Many friction points came from not having a single obvious place to start:

- no `START_HERE.md`
- no current handoff
- no Chinese index
- no task board at first

Pattern fix:

- Every workflow should have an entry-point doc.

### Missing Audit Trails

The user wanted proof that skills were actually used.

Pattern fix:

- Skill usage log.
- Git commits.
- Handoff updates.

### Missing Role Separation

English and Chinese docs served different purposes, but this was not explicit.

Pattern fix:

- English is execution source.
- Chinese is product-control layer.

### Missing Stage Gates

The project moved from idea to docs to planning without explicit gates.

Pattern fix:

- Each major phase should have:
  - required skill
  - output artifact
  - verification
  - commit
  - handoff update if substantial

## Workflow Upgrade Protocol

Use this loop after major interactions:

```text
1. Observe friction.
2. Classify the friction.
3. Identify root cause.
4. Find or select a relevant skill.
5. Read the skill.
6. Apply only the parts that fit this project.
7. Add or update project workflow docs.
8. Update skill usage log.
9. Review diff.
10. Commit.
```

## Friction Classification

| Friction | Likely Fix |
| --- | --- |
| Agent cannot resume context | Update handoff and startup docs |
| User cannot tell if skill was used | Update skill usage log |
| Task scope feels fuzzy | Use `project-planner` |
| Task breakdown feels too horizontal | Use `to-issues` |
| Completion feels unproven | Use `verification-before-completion` |
| Docs become hard to navigate | Add or update hub docs |
| Decisions become hard to trace | Add decision record or update PRD |
| Changes feel mixed | Use `commit-work` and split commits |

## Recommended New Operating Rules

- Start every non-trivial task by identifying the current task ID.
- If a task has `Required Skill`, read the skill before acting.
- Log skill usage before final response.
- Keep English and Chinese docs synchronized for decisions, not necessarily every sentence.
- Update `.codex/handoffs/current.md` after substantial work.
- Run a retrospective after major workflow changes or repeated friction.
- Each retrospective must produce at least one concrete project update.

## Candidate Skills Researched

### context-retrospective

Status:

- Installed and applied.

Use:

- Analyze interaction friction.
- Identify context gaps.
- Turn insights into workflow improvements.

### self-improvement

Status:

- Considered but not adopted.

Reason:

- Installation failed during initial attempt.
- Not reviewed locally, so it should not be treated as an active project workflow.

Potential future use:

- If reviewed successfully later, it may help maintain a long-term improvement log.

### verification-before-completion

Status:

- Recommended but not yet installed in this session.

Use:

- Gate implementation tasks before claiming completion.

### project-planner

Status:

- Recommended for next implementation-planning task.

Use:

- Plan `T-003` and later implementation slices.

## Next Process Improvements

1. Install and review `project-planner` before `T-003`.
2. Install and review `verification-before-completion` before the first implementation task.
3. Add a docs verification script when the documentation system changes again.
4. Add decision records if PRD or architecture decisions become frequent.

