# Document Engineering Workflow

## Purpose

This project treats documentation as an engineering artifact.

The current workflow is closer to software development than casual note-taking:

- docs define product behavior
- docs define implementation boundaries
- docs drive AI execution
- docs need reviewable change history
- docs need bilingual synchronization

This document adapts Git and software-engineering practices to the project's documentation system.

## Reuse-First Rule

Before self-implementing a non-core capability, run the [Reuse-First Discovery Gate](reuse-first-discovery-gate.md).

Trigger it for:

- third-party UI or graph features
- documentation-site capabilities
- workflow automation
- parsing, OCR, image, or ML infrastructure
- changes likely to touch more than two or three files
- unclear build-vs-buy decisions

Do not treat self-implementation as the default. First document reusable tools, libraries, skills, APIs, or product patterns, then decide whether to reuse, adapt, wrap, or build.

## Skills.sh References

### commit-work

Source:

- <https://skills.sh/softaworks/agent-toolkit/commit-work>

Installed locally:

- `/Users/qyx/.codex/skills/commit-work`

Relevant ideas:

- inspect the working tree before committing
- split changes into logical commits
- stage only intended changes
- review staged diffs
- describe what changed and why
- use Conventional Commits
- run the smallest meaningful verification

Adaptation for this project:

- review documentation diffs before treating a doc change as complete
- split unrelated documentation changes into separate logical changes
- document the reason behind major PRD, roadmap, or task-board changes
- check English and Chinese companion docs together

### Conventional Commits

Relevant convention:

```text
type(scope): short summary
```

Recommended documentation scopes:

- `docs`
- `prd`
- `tasks`
- `issues`
- `workflow`
- `bilingual`
- `research`
- `planning`

Recommended commit types:

- `docs`: documentation-only change
- `feat`: new executable workflow, schema, or project capability
- `chore`: structure, tooling, or maintenance
- `refactor`: reorganize without changing project intent
- `test`: add or update verification fixtures/checks
- `fix`: correct an error or inconsistency

Examples:

```text
docs(prd): define UI AST as the central execution contract
docs(tasks): add task board for vertical issue slices
docs(bilingual): add Chinese companion docs
docs(workflow): define Git-style documentation process
```

## Current Repository Status

At the time this workflow was written, `screenshot-to-design-system` was not an independent Git repository.

Decision needed:

- initialize this directory as a standalone Git repository, or
- keep it inside the broader workspace without separate Git history

Recommendation:

- initialize it as a standalone repo once the user wants persistent version history for the documentation system.

## Documentation Change Lifecycle

### 1. Define the Change Intent

Before editing, state the intent:

- What is changing?
- Why is it changing?
- Which documents are affected?
- Does the change alter product scope, execution plan, or only wording?

### 2. Choose the Change Boundary

Keep documentation changes logically scoped.

Good boundaries:

- PRD update
- issue breakdown update
- task-board update
- bilingual sync
- research note addition
- process/workflow change

Avoid mixing:

- PRD scope changes with formatting cleanup
- task status updates with architecture decisions
- Chinese translation updates with unrelated English rewrites

### 3. Edit English Source First

English docs are the canonical execution source.

Update English first when changing:

- PRD
- issue breakdown
- implementation plans
- schema decisions
- task board
- workflow rules

### 4. Sync Chinese Companion Docs

Chinese docs are the product-control layer.

After changing English source docs:

- update the matching Chinese companion
- preserve decision intent
- clarify tradeoffs in natural Chinese
- do not translate implementation noise unless it matters

### 5. Review the Diff

Before considering a documentation change complete:

```bash
git diff --stat
git diff
```

If this project is not yet a Git repo, use file review manually until Git is initialized.

Review for:

- accidental unrelated edits
- stale links
- English/Chinese disagreement
- task-board status drift
- scope changes that should update PRD or issue breakdown

### 6. Run Lightweight Verification

Minimum checks:

- all referenced docs exist
- README links include new major docs
- Chinese index includes new Chinese docs
- task board reflects new active work

Suggested commands after Git is initialized:

```bash
find . -name "*.md" | sort
rg -n "TODO|TBD|FIXME" .
git diff --stat
```

### 7. Commit Logically

When Git is initialized, create small commits.

Commit message format:

```text
docs(scope): short summary

Explain what changed and why.
```

## Bilingual Documentation Rules

Every important English document should have one of:

- a Chinese companion document
- a Chinese summary
- a documented reason why no Chinese companion is needed

Root files:

```text
README.md -> docs/zh-CN/readme.md
TASKS.md  -> docs/zh-CN/tasks.md
```

Docs:

```text
docs/<name>.md -> docs/zh-CN/<name>.md
```

When a change touches a decision, scope, acceptance criterion, risk, or task status, update both languages.

## Review Checklist

Before a documentation change is complete:

- [ ] The change has one clear intent.
- [ ] English source docs are updated.
- [ ] Chinese companion docs are updated when needed.
- [ ] README or language index links are updated when a new major doc is added.
- [ ] Task board is updated if the work changes status or priority.
- [ ] No unrelated formatting churn is included.
- [ ] Open decisions are clearly marked.
- [ ] Verification commands or manual checks are recorded.

## Suggested Branch Names

When Git is initialized:

```text
docs/prd-update
docs/bilingual-system
docs/task-board
docs/issue-breakdown
docs/workflow-rules
```

## Suggested Project Milestone Tags

Useful labels if the project later moves to GitHub issues:

- `docs`
- `prd`
- `planning`
- `bilingual`
- `workflow`
- `research`
- `ready-for-agent`
- `needs-human-review`

## Immediate Next Step

Decide whether this project should become a standalone Git repository.

If yes, the first commit should likely be:

```text
docs(project): initialize screenshot-to-design-system documentation
```

That commit should include the current README, docs, Chinese companion docs, task board, and workflow rules.
