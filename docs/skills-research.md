# Skills Research

## Purpose

This document records Skills.sh research for reusable project-management and workflow skills that may help build the screenshot-to-design-system project.

The current project needs two kinds of skills:

- project-management skills for turning research into PRDs, issues, implementation plans, and checkpoints
- domain-adjacent skills for design-system extraction and validation

## Skills.sh Context

Skills.sh describes skills as reusable capabilities for AI agents that provide procedural knowledge for specific tasks. Skills can be installed with the `skills` CLI and made available to compatible agents.

Important caveat from Skills.sh: skills should be reviewed before installation because ecosystem quality and security are not guaranteed for every listed skill.

## Recommended Skills

### 1. project-planner

Source:

- <https://skills.sh/shubhamsaboo/awesome-llm-apps/project-planner>

Install:

```bash
npx skills add https://github.com/shubhamsaboo/awesome-llm-apps --skill project-planner
```

What it does:

- breaks complex projects into structured tasks
- defines timelines, dependencies, and milestones
- supports work breakdown structures
- includes estimation, buffers, resource allocation, and risk matrices

Use in this project:

- turn the current MVP roadmap into a milestone plan
- estimate the schema, detection, clustering, viewer, token extraction, and diff phases
- maintain a project-level risk matrix
- produce weekly checkpoints

Fit:

- High

Notes:

- This is the closest direct match for project management.
- It is useful before execution starts, especially while the project still has many uncertain dependencies.

### 2. to-prd

Source:

- <https://www.skills.sh/mattpocock/skills/to-prd>

Install:

```bash
npx skills add https://github.com/mattpocock/skills --skill to-prd
```

What it does:

- turns conversation context and codebase understanding into a PRD
- sketches major modules needed for implementation
- encourages domain vocabulary and module boundaries

Use in this project:

- convert the current research docs into a formal PRD
- define product scope, non-goals, user journeys, constraints, and acceptance criteria
- clarify which modules should exist in the prototype

Fit:

- High

Notes:

- Best used after the current docs stabilize.
- Good next step before creating implementation tickets.

### 3. to-issues

Source:

- <https://www.skills.sh/mattpocock/skills/to-issues>

Install:

```bash
npx skills add https://github.com/mattpocock/skills --skill to-issues
```

What it does:

- breaks a plan, spec, or PRD into independently grabbable issues
- uses vertical slices rather than purely horizontal layers
- produces issue-sized implementation tasks

Use in this project:

- convert `docs/next-tasks.md` or a PRD into GitHub issues
- create implementation tickets such as:
  - define UI AST schema
  - normalize OCR output into UI AST
  - build visual debug viewer
  - run detector comparison experiment
  - prototype component clustering

Fit:

- High

Notes:

- Especially useful once there is a repo issue tracker.
- The "vertical slice" framing is helpful because this project could otherwise get trapped in horizontal research tasks.

### 4. writing-plans

Source:

- <https://www.skills.sh/obra/superpowers/writing-plans>

Install:

```bash
npx skills add https://github.com/obra/superpowers --skill writing-plans
```

What it does:

- creates comprehensive implementation plans for multi-step tasks
- breaks work into small, testable steps
- maps file structure, test commands, and execution boundaries upfront

Use in this project:

- write detailed implementation plans for each milestone
- turn a ticket like "prototype component clustering" into exact files, commands, tests, and checkpoints
- reduce ambiguity before coding sessions

Fit:

- Medium to high

Notes:

- More execution-focused than project-planner.
- Best used after PRD and issue breakdown.

### 5. executing-plans

Source:

- <https://www.skills.sh/obra/superpowers/executing-plans>

Install:

```bash
npx skills add https://github.com/obra/superpowers --skill executing-plans
```

What it does:

- executes written implementation plans with checkpoints
- reviews the plan before execution
- stops on blockers instead of guessing
- marks progress as tasks complete

Use in this project:

- execute a previously written plan for schema, viewer, clustering, or diff phases
- enforce step-by-step progress tracking

Fit:

- Medium

Notes:

- Useful once plans become concrete.
- Less useful during early research.

### 6. brainstorming

Source:

- <https://www.skills.sh/obra/superpowers/brainstorming>

Install:

```bash
npx skills add https://github.com/obra/superpowers --skill brainstorming
```

What it does:

- guides structured design dialogue before implementation
- clarifies intent, requirements, alternatives, and assumptions
- produces design/spec direction before execution

Use in this project:

- refine uncertain areas such as:
  - whether output should start as HTML, Figma, or JSON
  - how much human review should exist in component candidate confirmation
  - whether Doubao wireframe output should feed detection or only reconstruction

Fit:

- Medium

Notes:

- We have already done some brainstorming manually.
- Useful again when starting a new ambiguous subsystem.

### 7. triage

Source:

- <https://www.skills.sh/mattpocock/skills/triage>

Install:

```bash
npx skills add https://github.com/mattpocock/skills --skill triage
```

What it does:

- moves issues through a small triage state machine
- classifies and routes issue tracker items

Use in this project:

- manage incoming research tasks, bugs, experiments, and follow-up questions
- keep labels consistent after issues exist

Fit:

- Medium

Notes:

- Not needed until the project has a real issue tracker.
- More useful for team collaboration than solo prototyping.

### 8. verification-before-completion

Source:

- <https://www.skills.sh/obra/superpowers/verification-before-completion>

Install:

```bash
npx skills add https://github.com/obra/superpowers --skill verification-before-completion
```

What it does:

- enforces fresh verification before claiming work is complete
- requires actual commands and evidence for success claims

Use in this project:

- verify schema validation, detector outputs, clustering metrics, viewer rendering, and screenshot diff generation
- prevent false confidence in experimental pipeline stages

Fit:

- Medium to high

Notes:

- Particularly useful because this project depends heavily on measurable output quality.

### 9. extract-design-system

Source:

- <https://www.skills.sh/arvindrk/extract-design-system/extract-design-system>

Install:

```bash
npx skills add https://github.com/arvindrk/extract-design-system --skill extract-design-system
```

What it does:

- reverse-engineers a public website's design primitives into starter token files
- focuses on tokens and starter assets, not full component libraries

Use in this project:

- reference workflow for design token extraction
- compare its token output assumptions against our screenshot-based token extraction
- borrow ideas for token naming and starter file structure

Fit:

- Medium

Notes:

- It targets public websites rather than arbitrary screenshots.
- It is not a direct solution for component clustering.
- Still useful as a reference for token extraction workflow.

### 10. project-planner from hieutrtr/ai1-skills

Source:

- <https://skills.sh/hieutrtr/ai1-skills/project-planner>

Install:

```bash
npx skills add https://github.com/hieutrtr/ai1-skills --skill project-planner
```

What it does:

- breaks feature requests into implementation plans
- maps affected modules
- defines verification criteria
- identifies risks and unknowns
- writes plan files for follow-up task decomposition

Use in this project:

- create implementation plans for the UI AST, debug viewer, clustering, reconstruction, and diff slices
- maintain risks and verification criteria before coding begins
- turn the next task into a plan with explicit artifacts and checks

Fit:

- High

Notes:

- This is currently the most relevant project-management skill for the next phase.
- Its examples assume a Python/React app, so adapt the workflow rather than copying the stack.

### 11. task-decomposition

Source:

- <https://skills.sh/hieutrtr/ai1-skills/task-decomposition>

Install:

```bash
npx skills add https://github.com/hieutrtr/ai1-skills --skill task-decomposition
```

What it does:

- appears intended to break a project plan into smaller implementation tasks

Use in this project:

- possible follow-up after writing implementation plans

Fit:

- Medium

Notes:

- Do not adopt until its source has been reviewed.

### 12. gsd

Source:

- <https://skills.sh/ctsstc/get-shit-done-skills/gsd>

Install:

```bash
npx skills add https://github.com/ctsstc/get-shit-done-skills --skill gsd
```

What it does:

- provides a full project-management system for solo developers
- covers initialization, roadmap planning, phase execution, verification, debugging, and progress tracking

Use in this project:

- possible future upgrade if the project becomes a sustained multi-phase build

Fit:

- Medium

Notes:

- Too heavy to adopt wholesale right now.
- Borrow phase and verification ideas without introducing the full system yet.

### 13. commit-work

Source:

- <https://skills.sh/softaworks/agent-toolkit/commit-work>

Installed locally:

- `/Users/qyx/.codex/skills/commit-work`

What it does:

- creates high-quality Git commits
- inspects working tree changes before staging
- splits changes into logical commits
- reviews staged diffs
- writes Conventional Commit messages
- runs the smallest meaningful verification before completion

Use in this project:

- adapt Git commit discipline to documentation development
- keep PRD, issue, task-board, bilingual, and workflow changes logically scoped
- review documentation diffs before declaring the project state complete
- define commit message conventions once the project becomes a standalone Git repo

Fit:

- High

Notes:

- This skill is especially relevant because the project is becoming a document-driven engineering system.
- See [Document Engineering Workflow](document-engineering-workflow.md).

## Recommended Adoption Order

1. `project-planner` from `hieutrtr/ai1-skills`
2. `to-prd`
3. `to-issues`
4. `verification-before-completion`
5. `writing-plans`
6. `extract-design-system`
7. `executing-plans`
8. `triage`
9. `brainstorming`
10. `gsd`, only if the project needs heavier phase management
11. `commit-work`, once the project is managed as a Git repository

## Practical Workflow for This Project

```text
Current research docs
  -> project-planner creates implementation plans with risks and verification
  -> to-prd turns the research into a formal PRD
  -> to-issues turns the PRD into vertical implementation tickets
  -> verification-before-completion gates each completed stage
  -> task board tracks current work inside the project
  -> commit-work discipline keeps documentation changes reviewable
```

## Recommendation

Install only a small set first:

```bash
npx skills add https://github.com/hieutrtr/ai1-skills --skill project-planner
npx skills add https://github.com/mattpocock/skills --skill to-prd
npx skills add https://github.com/mattpocock/skills --skill to-issues
npx skills add https://github.com/obra/superpowers --skill writing-plans
npx skills add https://github.com/obra/superpowers --skill verification-before-completion
```

Do not install everything at once. The project should first test whether these skills produce useful artifacts for the current docs.

## Security and Quality Notes

- Review each skill before installing.
- Prefer skills with security audit passes.
- Avoid skills that execute large scripts without inspection.
- Pin or vendor critical project workflow skills if they become part of the long-term process.
