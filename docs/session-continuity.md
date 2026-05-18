# Session Continuity

## Purpose

This project may be opened from different Codex sessions and paths. New sessions do not automatically inherit chat history, so the project needs a standard recovery protocol.

The goal is not perfect continuity. The goal is low-friction resumption.

## Required Skill

Use `session-handoff` when:

- starting a new session from this project
- ending a meaningful work session
- context is getting long
- handing work to another agent
- resuming after a pause

Skill source:

- `/Users/qyx/.codex/skills/session-handoff/SKILL.md`

## Startup Protocol

When a fresh Codex session is opened in this project:

1. Read [START_HERE.md](../START_HERE.md).
2. Run:

```bash
git status --short
git branch --show-current
git log --oneline -5
```

3. Read [.codex/handoffs/current.md](../.codex/handoffs/current.md).
4. Read [TASKS.md](../TASKS.md).
5. Identify the current task and required skill.
6. Read the required skill's `SKILL.md`.
7. Record skill usage in [Skill Usage Log](skill-usage-log.md) if work begins.

## Handoff Protocol

When ending a meaningful work session, update:

```text
.codex/handoffs/current.md
```

The handoff should include:

- current state
- latest commits
- files changed
- active task
- required skill for next task
- decisions made
- blockers
- immediate next steps
- verification status

## Why Use a Fixed Current Handoff

The upstream `session-handoff` skill stores timestamped files in `.claude/handoffs/`.

For this project, we use a stable file:

```text
.codex/handoffs/current.md
```

Reason:

- new sessions need one predictable file to read first
- the latest state is easier to find
- Git history still preserves previous versions

If long-running work needs a historical chain later, timestamped handoff files can be added.

## New Session Bootstrap Prompt

When opening a fresh Codex session pointed at this project path, use:

```text
Please resume this project from the repository state. Start by reading START_HERE.md and .codex/handoffs/current.md, then check TASKS.md and the required skill for the current task. Do not rely on previous chat history. Record any required skill usage in docs/skill-usage-log.md.
```

## Resume Checklist

- [ ] Confirm project path is `/Users/qyx/Desktop/project/screenshot-to-design-system`.
- [ ] Confirm Git branch is `main` or explain why not.
- [ ] Confirm working tree status.
- [ ] Read `START_HERE.md`.
- [ ] Read `.codex/handoffs/current.md`.
- [ ] Read `TASKS.md`.
- [ ] Identify current task.
- [ ] Identify required skill.
- [ ] Read required `SKILL.md`.
- [ ] Continue from the handoff's immediate next steps.

