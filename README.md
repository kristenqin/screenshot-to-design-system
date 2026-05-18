# Screenshot to Design System

This project collects the product and technical research for an automated workflow that reconstructs editable design files and design systems from software screenshots.

The core thesis is:

> Screenshot-to-design is not a one-shot image generation task. It should be treated as an iterative reverse-engineering workflow: infer structure from the visual result, extract reusable components and design tokens, then rebuild the page from those reusable primitives.

## Goals

- Turn complete software screenshots into editable design drafts.
- Avoid rebuilding mature capabilities from scratch when reliable APIs or existing models are available.
- Extract repeated UI patterns as component candidates.
- Generate a reusable design system instead of only a static visual copy.
- Use screenshot diff and OCR diff as feedback signals for iterative refinement.

## Current Position

The wireframe generation step should be treated as a black-box module for now. The current Doubao image generation API result is already strong enough and likely cheaper than building a custom alternative.

The main product risk is not wireframe generation. The real challenge is converting screenshots into a structured representation:

- UI element hierarchy
- reusable component candidates
- color and typography tokens
- layout rules
- editable design output

## Proposed Workflow

```text
User screenshots
  -> image preprocessing
  -> wireframe generation
  -> UI element detection
  -> OCR and visual parsing
  -> structured UI AST
  -> component candidate clustering
  -> design token extraction
  -> design system generation
  -> page reconstruction
  -> screenshot diff feedback loop
```

## Documents

New session startup:

- Start here: [START_HERE.md](START_HERE.md)
- Current handoff: [.codex/handoffs/current.md](.codex/handoffs/current.md)
- Session continuity workflow: [Session Continuity](docs/session-continuity.md)

Language:

- English source docs live at the project root and `docs/`.
- Chinese companion docs live in [docs/zh-CN](docs/zh-CN/index.md).
- Documentation system rules live in [Documentation System](docs/documentation-system.md).
- Git-style documentation workflow lives in [Document Engineering Workflow](docs/document-engineering-workflow.md).
- Skill usage policy and audit log live in [Skill Usage Policy](docs/skill-usage-policy.md) and [Skill Usage Log](docs/skill-usage-log.md).
- Local browser docs site instructions live in [Docs Site](docs/docs-site.md).

- [Task Board](TASKS.md)
- [Start Here](START_HERE.md)
- [Session Continuity](docs/session-continuity.md)
- [Workflow Retrospective](docs/workflow-retrospective.md)
- [Docs Site](docs/docs-site.md)
- [Workflow Overview](docs/workflow-overview.md)
- [Existing Tools and Algorithms](docs/existing-tools-and-algorithms.md)
- [Component Clustering Strategy](docs/component-clustering-strategy.md)
- [Design Token Extraction](docs/design-token-extraction.md)
- [Product Requirements Document](docs/prd.md)
- [Issue Breakdown Draft](docs/issue-breakdown-draft.md)
- [Project Management Workflow](docs/project-management.md)
- [Document Engineering Workflow](docs/document-engineering-workflow.md)
- [Skill Usage Policy](docs/skill-usage-policy.md)
- [Skill Usage Log](docs/skill-usage-log.md)
- [MVP Roadmap](docs/mvp-roadmap.md)
- [Next Tasks](docs/next-tasks.md)
- [Skills Research](docs/skills-research.md)
- [Open Questions](docs/open-questions.md)
