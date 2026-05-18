# Task Board

This is the working task board for the Screenshot to Design System project.

The canonical product inputs are:

- [PRD](docs/prd.md)
- [Issue Breakdown Draft](docs/issue-breakdown-draft.md)
- [Project Management Workflow](docs/project-management.md)

## Status Legend

- `Backlog`: known task, not ready to start
- `Next`: ready to pick up
- `In Progress`: currently being worked on
- `Blocked`: waiting on a decision or dependency
- `Done`: completed

## Current Focus

The project is moving from research documentation into implementation planning.

The next concrete implementation task is:

> Create the first validated UI AST run.

## Next

| ID | Task | Type | Required Skill | Blocked By | Source |
| --- | --- | --- | --- | --- | --- |
| T-001 | Approve or revise the vertical issue breakdown | HITL | `to-issues` | None | [Issue Breakdown Draft](docs/issue-breakdown-draft.md) |
| T-002 | Create first validated UI AST run | AFK | `project-planner`, `verification-before-completion` | T-001 approval preferred | [Issue 1](docs/issue-breakdown-draft.md#create-the-first-validated-ui-ast-run) |
| T-003 | Write implementation plan for UI AST run | AFK | `project-planner` | T-001 | [Project Management Workflow](docs/project-management.md) |
| T-013 | Decide whether to initialize this documentation project as a standalone Git repo | HITL | `commit-work` | None | [Document Engineering Workflow](docs/document-engineering-workflow.md) |
| T-014 | Maintain skill usage policy and audit log | AFK | `commit-work` | None | [Skill Usage Policy](docs/skill-usage-policy.md) |
| T-015 | Maintain session startup and handoff docs | AFK | `session-handoff`, `commit-work` | None | [Session Continuity](docs/session-continuity.md) |
| T-016 | Run workflow retrospectives after major interaction blocks | AFK | `context-retrospective`, `commit-work` | None | [Workflow Retrospective](docs/workflow-retrospective.md) |
| T-017 | Maintain local browser documentation site | AFK | `browser`, `commit-work` | None | [Docs Site](docs/docs-site.md) |
| T-018 | Maintain documentation information architecture | AFK | `information-architecture`, `context-retrospective`, `commit-work` | None | [Information Architecture](docs/information-architecture.md) |

## Backlog

| ID | Task | Type | Required Skill | Blocked By | Source |
| --- | --- | --- | --- | --- | --- |
| T-004 | Normalize OCR output into UI AST text runs | AFK | `project-planner`, `verification-before-completion` | T-002 | [Issue 2](docs/issue-breakdown-draft.md#normalize-ocr-output-into-ui-ast-text-runs) |
| T-005 | Compare screenshot and wireframe detection inputs | HITL | `project-planner` | T-002 | [Issue 3](docs/issue-breakdown-draft.md#compare-screenshot-and-wireframe-detection-inputs) |
| T-006 | Build visual debug viewer for one sample | AFK | `project-planner`, `verification-before-completion` | T-002, T-004 | [Issue 4](docs/issue-breakdown-draft.md#build-the-visual-debug-viewer-for-one-sample) |
| T-007 | Generate component candidates from repeated fixture elements | AFK | `project-planner`, `verification-before-completion` | T-002 | [Issue 5](docs/issue-breakdown-draft.md#generate-component-candidates-from-repeated-fixture-elements) |
| T-008 | Visualize component candidates in the debug viewer | AFK | `project-planner`, `verification-before-completion` | T-006, T-007 | [Issue 6](docs/issue-breakdown-draft.md#visualize-component-candidates-in-the-debug-viewer) |
| T-009 | Extract basic design tokens from one sample | AFK | `project-planner`, `verification-before-completion` | T-002 | [Issue 7](docs/issue-breakdown-draft.md#extract-basic-design-tokens-from-one-sample) |
| T-010 | Generate first HTML reconstruction from UI AST | AFK | `project-planner`, `verification-before-completion` | T-002, T-007, T-009 | [Issue 8](docs/issue-breakdown-draft.md#generate-first-html-reconstruction-from-ui-ast) |
| T-011 | Render reconstruction and produce a diff report | AFK | `project-planner`, `verification-before-completion` | T-010 | [Issue 9](docs/issue-breakdown-draft.md#render-reconstruction-and-produce-a-diff-report) |
| T-012 | Package the first demo run | HITL | `verification-before-completion` | T-002 through T-011 | [Issue 10](docs/issue-breakdown-draft.md#package-the-first-demo-run) |

## Done

| ID | Task | Output |
| --- | --- | --- |
| D-001 | Capture initial workflow research | [Workflow Overview](docs/workflow-overview.md) |
| D-002 | Capture existing tools and algorithms research | [Existing Tools and Algorithms](docs/existing-tools-and-algorithms.md) |
| D-003 | Capture component clustering strategy | [Component Clustering Strategy](docs/component-clustering-strategy.md) |
| D-004 | Capture design token extraction strategy | [Design Token Extraction](docs/design-token-extraction.md) |
| D-005 | Create PRD using `to-prd` workflow | [PRD](docs/prd.md) |
| D-006 | Create vertical issue breakdown using `to-issues` workflow | [Issue Breakdown Draft](docs/issue-breakdown-draft.md) |
| D-007 | Research Skills.sh project-management skills | [Project Management Workflow](docs/project-management.md) |
| D-008 | Define Git-style documentation workflow | [Document Engineering Workflow](docs/document-engineering-workflow.md) |
| D-009 | Define auditable skill usage workflow | [Skill Usage Policy](docs/skill-usage-policy.md) |
| D-010 | Define new-session startup and handoff workflow | [Session Continuity](docs/session-continuity.md) |
| D-011 | Analyze workflow friction and define upgrade protocol | [Workflow Retrospective](docs/workflow-retrospective.md) |
| D-012 | Add local browser documentation site | [Docs Site](docs/docs-site.md) |
| D-013 | Add reading-path navigation and IA audit | [Information Architecture](docs/information-architecture.md) |

## Operating Rules

- Prefer vertical slices that produce a verifiable artifact.
- Keep task status updated in this file when work starts or finishes.
- Put detailed plans in `docs/plans/` when a task needs more than a short checklist.
- Treat Doubao wireframe generation as an external black-box capability during the MVP.
- Do not promote component candidates into final components without review until the pipeline proves reliable.
- Treat documentation changes like code changes: keep them scoped, review diffs, update bilingual companions, and record why the change exists.
- When a task lists a required skill, record actual usage in [Skill Usage Log](docs/skill-usage-log.md), including any deviations.
- When ending a meaningful work session, update [.codex/handoffs/current.md](.codex/handoffs/current.md) so a new session can resume quickly.
- After several rounds of workflow-building or a high-friction interaction, run a retrospective and convert at least one insight into a project change.
