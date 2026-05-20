# Skill Usage Log

This log records actual skill usage for the Screenshot to Design System project.

## 2026-05-18 - `to-prd`

Task:

- Generate the project PRD from accumulated research docs.

Skill source:

- `/Users/qyx/.codex/skills/to-prd/SKILL.md`

Reason:

- Convert research context into a formal PRD using the required PRD sections.

Workflow steps followed:

- Read local `SKILL.md`.
- Used the required structure:
  - Problem Statement
  - Solution
  - User Stories
  - Implementation Decisions
  - Testing Decisions
  - Out of Scope
  - Further Notes
- Identified major modules and deep modules.
- Included testing decisions.

Output artifacts:

- [PRD](prd.md)

Deviations:

- Did not publish to issue tracker because no issue tracker or triage label vocabulary is configured.

Verification:

- Checked required headings existed in `docs/prd.md`.

## 2026-05-18 - `to-issues`

Task:

- Break the PRD into vertical issue slices.

Skill source:

- `/Users/qyx/.codex/skills/to-issues/SKILL.md`

Reason:

- Convert the PRD into independently grabbable tracer-bullet issues.

Workflow steps followed:

- Read local `SKILL.md`.
- Used vertical slices rather than horizontal module-only tasks.
- Added HITL / AFK labels.
- Added dependencies.
- Mapped user stories covered.
- Added acceptance criteria.

Output artifacts:

- [Issue Breakdown Draft](issue-breakdown-draft.md)

Deviations:

- Did not publish issues to an issue tracker because no issue tracker is configured.

Verification:

- Checked issue draft contained types, blocked-by dependencies, and approval questions.

## 2026-05-18 - `commit-work`

Task:

- Define Git-style documentation workflow and initialize the project Git repository.

Skill source:

- `/Users/qyx/.codex/skills/commit-work/SKILL.md`

Reason:

- Adapt Git commit discipline to documentation engineering and create the initial documentation commit.

Workflow steps followed:

- Read local `SKILL.md`.
- Checked repository state before initialization.
- Initialized Git repository.
- Renamed default branch to `main`.
- Added `.gitignore`.
- Reviewed `git status`.
- Reviewed staged diff stats.
- Checked for likely placeholder or secret strings.
- Created a Conventional Commit.

Output artifacts:

- [Document Engineering Workflow](document-engineering-workflow.md)
- [Chinese Document Engineering Workflow](zh-CN/document-engineering-workflow.md)
- Initial Git commit:
  - `a52c37a docs(project): initialize screenshot-to-design-system documentation`

Deviations:

- No separate branch was used because this was the initial repository setup.

Verification:

- Confirmed branch was `main`.
- Confirmed working tree was clean after commit.

## 2026-05-18 - `commit-work`

Task:

- Create auditable skill usage policy.

Skill source:

- `/Users/qyx/.codex/skills/commit-work/SKILL.md`

Reason:

- Treat the skill usage policy as a scoped documentation governance change.

Workflow steps followed:

- Checked working tree was clean before editing.
- Kept the change scoped to skill usage auditability.
- Updated English docs and Chinese companion docs.
- Updated task board with required skill metadata.

Output artifacts:

- [Skill Usage Policy](skill-usage-policy.md)
- [Skill Usage Log](skill-usage-log.md)
- [Chinese Skill Usage Policy](zh-CN/skill-usage-policy.md)
- [Chinese Skill Usage Log](zh-CN/skill-usage-log.md)
- [Task Board](../TASKS.md)

Deviations:

- None after completion.

Verification:

- Diff was reviewed and committed in `3a210ef docs(workflow): add auditable skill usage process`.

## 2026-05-18 - `session-handoff`

Task:

- Define a startup and handoff protocol for switching into this project from a fresh Codex session.

Skill source:

- `/Users/qyx/.codex/skills/session-handoff/SKILL.md`

Reason:

- Reduce context recovery cost when opening a new session pointed at this project path.

Workflow steps followed:

- Read local `SKILL.md`.
- Adapted the handoff concept to a stable project-local handoff file.
- Created a startup checklist.
- Created a current handoff file.
- Added new-session bootstrap prompt.
- Added bilingual companion documentation.

Output artifacts:

- [START_HERE.md](../START_HERE.md)
- [Session Continuity](session-continuity.md)
- [Current Handoff](../.codex/handoffs/current.md)
- [Chinese Session Continuity](zh-CN/session-continuity.md)

Deviations:

- Did not use the upstream `.claude/handoffs/` timestamped file structure.
- This project uses `.codex/handoffs/current.md` as a stable entry point because new sessions need one predictable file to read.

Verification:

- Diff was reviewed and committed in `a2079ed docs(workflow): add session handoff startup protocol`.

## 2026-05-18 - `context-retrospective`

Task:

- Reflect on workflow friction from prior collaboration and upgrade the project workflow.

Skill source:

- `/Users/qyx/.codex/skills/context-retrospective/SKILL.md`

Reason:

- Identify context gaps, navigation issues, task-context alignment problems, and guidance improvements from the collaboration history.

Workflow steps followed:

- Read local `SKILL.md`.
- Classified friction into context gaps, navigation problems, audit gaps, task alignment issues, and guidance issues.
- Identified root cause themes.
- Converted retrospective findings into operating rules and project updates.
- Recorded candidate skills and adoption status.

Output artifacts:

- [Workflow Retrospective](workflow-retrospective.md)
- [Chinese Workflow Retrospective](zh-CN/workflow-retrospective.md)
- Updated [Task Board](../TASKS.md)

Deviations:

- The full transcript is not stored in the repo, so the retrospective uses the current conversation context and project artifacts instead of a standalone transcript file.
- `self-improvement` was considered but not adopted because installation failed and the local skill was not reviewed.

Verification:

- Diff review and commit are handled as part of this workflow-retrospective change.

## 2026-05-18 - `browser`

Task:

- Build and verify a local browser documentation site for the project docs.

Skill source:

- `/Users/qyx/.codex/plugins/cache/openai-bundled/browser/0.1.0-alpha2/skills/browser/SKILL.md`

Reason:

- The user wanted a browser-readable deployment for the growing documentation system.

Workflow steps followed:

- Read the Browser skill.
- Built a local docs site.
- Started the local dev server.
- Opened `http://127.0.0.1:4173` in the in-app browser.
- Verified default page, navigation count, Chinese filter, Chinese index, and table of contents.

Output artifacts:

- [Docs Site](docs-site.md)
- [Chinese Docs Site](zh-CN/docs-site.md)
- `index.html`
- `src/main.js`
- `src/styles.css`
- `scripts/build-docs-content.mjs`
- `scripts/dev-server.mjs`
- `package.json`

Deviations:

- Avoided external frontend dependencies because `npm install` stalled.
- Implemented a zero-dependency local server and lightweight Markdown renderer instead.

Verification:

- `npm run build` prepared 45 documentation files after the IA update.
- Browser verification confirmed the docs site renders and Chinese navigation works.

## 2026-05-18 - `information-architecture`

Task:

- Audit and improve the documentation site's navigation structure.

Skill source:

- `/Users/qyx/.codex/skills/information-architecture/SKILL.md`

Reason:

- The user reported that the sidebar felt mixed together and structurally uncomfortable.

Workflow steps followed:

- Read local `SKILL.md`.
- Audited the current navigation structure.
- Diagnosed the issue as flat navigation, weak mental-model alignment, missing hub-and-spoke structure, and mixed product/process/audit content.
- Added reading-path metadata to docs.
- Updated the docs site navigation to support task-based reading paths.
- Added bilingual IA documentation.

Output artifacts:

- [Information Architecture](information-architecture.md)
- [Chinese Information Architecture](zh-CN/information-architecture.md)
- Updated docs site navigation in `src/main.js`
- Updated docs site styles in `src/styles.css`

Deviations:

- No real-user card sort or tree test was run yet.
- The IA update uses expert review and the user's stated discomfort as input.

Verification:

- `npm run build` prepared 45 documentation files.
- Browser verification confirmed:
  - All path shows 45 documents.
  - Plan path narrows to 14 documents.
  - Chinese path narrows to 22 documents and activates the Chinese language filter.
  - Information Architecture appears in navigation.

## 2026-05-18 - `information-architecture`

Task:

- Research and implement a concept-map model for the documentation system.

Skill source:

- `/Users/qyx/.codex/skills/information-architecture/SKILL.md`

Reason:

- The user wanted the docs to behave less like a shallow tree and more like a graph of related concepts.

Workflow steps followed:

- Read local `SKILL.md`.
- Reframed each document as a concept node.
- Defined relationship edges for reading-path membership, bilingual companions, and Markdown references.
- Surveyed graph and concept-map tools.
- Added a zero-dependency concept map view to the docs site.

Output artifacts:

- [Concept Map Research](concept-map-research.md)
- [Chinese Concept Map Research](zh-CN/concept-map-research.md)
- Updated docs manifest graph generation in `scripts/build-docs-content.mjs`
- Updated concept map UI in `src/main.js`
- Updated graph styles in `src/styles.css`

Deviations:

- No dependency such as Cytoscape.js or Sigma.js was adopted yet.
- The current graph view is a conservative in-project prototype because the docs graph is still small.

Verification:

- `npm run build` prepared 47 documentation files and generated graph edges.
- Browser verification confirms the Concept Map view renders visible nodes and edges.

## 2026-05-18 - `information-architecture`

Task:

- Research reusable module-governance resources and apply them to the project roadmap.

Skill source:

- `/Users/qyx/.codex/skills/information-architecture/SKILL.md`

Reason:

- The user wanted to reuse existing mature practices instead of inventing a module-first workflow from scratch.

Workflow steps followed:

- Read local `SKILL.md`.
- Surveyed reusable external frameworks: bounded contexts, Team Topologies, C4, ADRs, Diátaxis, SLOs, TRL, MVA, MVC, and tracer bullets.
- Converted those frameworks into a project-specific module passport and readiness model.
- Updated the MVP roadmap so module readiness comes before product MVP.

Output artifacts:

- [Module Governance First](module-governance-first.md)
- [Chinese Module Governance First](zh-CN/module-governance-first.md)
- Updated [MVP Roadmap](mvp-roadmap.md)
- Updated [Task Board](../TASKS.md)

Deviations:

- No user study or external team interview was run.
- The adopted model is a lightweight synthesis of established ideas, not a claim that any single framework fully solves the project.

Verification:

- `npm run build` prepared 49 documentation files and 287 graph edges.

## 2026-05-18 - `information-architecture`

Task:

- Apply the module-governance-first model to the documentation system itself.

Skill source:

- `/Users/qyx/.codex/skills/information-architecture/SKILL.md`

Reason:

- The user correctly observed that the prior change defined a governance principle but did not apply it to the docs module that already exists.

Workflow steps followed:

- Treated the documentation system as the first governed module.
- Created a module passport for its boundary, contract, verification, failure modes, and replaceability.
- Linked the passport from the documentation-system docs, module-governance docs, README, Chinese index, and task board.
- Added a promotion task for moving the documentation system from M4 to M5.

Output artifacts:

- [Documentation System Module Passport](module-passports/documentation-system.md)
- [Chinese Documentation System Module Passport](zh-CN/module-passports/documentation-system.md)
- Updated [Documentation System](documentation-system.md)
- Updated [Module Governance First](module-governance-first.md)
- Updated [Task Board](../TASKS.md)

Deviations:

- This pass defines the passport and promotion gate, but does not yet add automated coverage checks.

Verification:

- `npm run build` should include the module passport docs in the browser site and concept map.

## 2026-05-20 - `information-architecture` + `browser`

Task:

- Replace the custom SVG concept map with a graph-native third-party library.

Skill sources:

- `/Users/qyx/.codex/skills/information-architecture/SKILL.md`
- `/Users/qyx/.codex/plugins/cache/openai-bundled/browser/0.1.0-alpha2/skills/browser/SKILL.md`

Reason:

- The user reported that the prior map placed document nodes on a canvas but did not make document-to-document relationships clear.

Workflow steps followed:

- Reassessed the concept map against the goal of relationship readability.
- Adopted Cytoscape.js for interactive graph rendering.
- Kept the existing manifest graph data model.
- Added relationship-neighborhood selection and right-panel relationship summaries.
- Verified the graph in the browser.

Output artifacts:

- Updated [Concept Map Research](concept-map-research.md)
- Updated [Docs Site](docs-site.md)
- Updated `src/main.js`
- Updated `src/styles.css`
- Updated `scripts/build-docs-content.mjs`
- Updated `scripts/dev-server.mjs`
- Added `cytoscape` dependency

Deviations:

- The docs site is no longer zero-dependency. The added dependency is intentionally limited to graph rendering.

Verification:

- `npm run build` prepared 51 documentation files and 321 graph edges.
- Browser verification confirmed Cytoscape renders 57 nodes and 321 edges.
- Selecting a node highlights its neighborhood and shows relationship counts in the right panel.

## 2026-05-20 - `information-architecture` + `commit-work`

Task:

- Add a reuse-first discovery gate after the user identified high cost from premature custom implementation.

Skill sources:

- `/Users/qyx/.codex/skills/information-architecture/SKILL.md`
- `/Users/qyx/.codex/skills/commit-work/SKILL.md`

Reason:

- The project needed a structural workflow rule that forces reusable tool, library, API, product-pattern, and Skills.sh discovery before non-core implementation.

Workflow steps followed:

- Treated the issue as documentation-system governance rather than a one-off note.
- Created a bilingual discovery gate.
- Linked the gate from project management, document engineering, README, Chinese index, task board, and session handoff.
- Added Skills.sh references for technology evaluation, spec-first behavior, brainstorming, and implementation planning.
- Prepared the change as a scoped documentation commit.

Output artifacts:

- [Reuse-First Discovery Gate](reuse-first-discovery-gate.md)
- [Chinese Reuse-First Discovery Gate](zh-CN/reuse-first-discovery-gate.md)
- Updated [Project Management Workflow](project-management.md)
- Updated [Document Engineering Workflow](document-engineering-workflow.md)
- Updated [Task Board](../TASKS.md)
- Updated [Current Handoff](../.codex/handoffs/current.md)

Deviations:

- Resolved later: the referenced Skills.sh workflows are now installed locally or mirrored as audited local skills.
- Browser verification used the existing local docs site.

Verification:

- `npm run build` prepared 53 documentation files and 344 graph edges.
- Browser verification confirmed the sidebar lists 53 documents and the Chinese reuse-first gate renders with its trigger conditions, required sequence, and project-specific examples.

## 2026-05-20 - `skill-installer`

Task:

- Resolve the reuse-first gate deviation where external Skills.sh workflows were only referenced instead of installed locally.

Skill source:

- `/Users/qyx/.codex/skills/.system/skill-installer/SKILL.md`

Reason:

- The user wanted the referenced Skills.sh workflows to become local executable skills so future agents are less likely to improvise from project prose alone.

Workflow steps followed:

- Read local `skill-installer`.
- Installed GitHub-backed skills with the helper installer.
- Checked local installed skill directories.
- Audited unavailable or unsafe sources before deciding whether to mirror them.

Output artifacts:

- Installed `/Users/qyx/.codex/skills/evaluating-new-technology`
- Installed `/Users/qyx/.codex/skills/spec-first`
- Installed `/Users/qyx/.codex/skills/implementation-planner`
- Added audited local mirror `/Users/qyx/.codex/skills/simple-brainstorm`
- Added audited local mirror `/Users/qyx/.codex/skills/create-plan`
- Updated [Reuse-First Discovery Gate](reuse-first-discovery-gate.md)

Deviations:

- `simple-brainstorm` was not installed directly from its associated GitHub repository because the available similarly named repository skill contained untrusted instructions. It was mirrored locally with only the relevant brainstorming workflow.
- `create-plan` was not installable from the current public `openai/skills` repository or `npx skills add`; it was mirrored locally from the visible Skills.sh workflow.

Verification:

- Local skill directories now include `evaluating-new-technology`, `spec-first`, `implementation-planner`, `simple-brainstorm`, and `create-plan`.

## 2026-05-20 - `information-architecture` + `browser`

Task:

- Apply an Obsidian-style interaction model to the documentation knowledge graph.

Skill sources:

- `/Users/qyx/.codex/skills/information-architecture/SKILL.md`
- `/Users/qyx/.codex/plugins/cache/openai-bundled/browser/0.1.0-alpha2/skills/browser/SKILL.md`

Reason:

- The user wanted the knowledge graph interaction to feel closer to Obsidian, with local graph inspection and controllable visual density.

Workflow steps followed:

- Ran the reuse-first discovery gate.
- Kept Cytoscape.js as the reusable graph renderer instead of building a custom renderer.
- Used Obsidian Graph View as the product reference for global/local graph, filters, display controls, force controls, and local depth.
- Added graph controls around the existing manifest-driven graph.
- Verified the interaction in the local browser docs site.

Output artifacts:

- Updated [Concept Map Research](concept-map-research.md)
- Updated [Docs Site](docs-site.md)
- Updated `src/main.js`
- Updated `src/styles.css`

Deviations:

- No new graph dependency was added because Cytoscape.js already covers the needed rendering and traversal behavior.

Verification:

- `npm run build` prepared 53 documentation files and 344 graph edges.
- Browser verification confirmed:
  - global graph renders 53 nodes and 227 primary reference edges
  - local graph at depth 1 narrows to 8 nodes and 20 edges
  - graph settings expose 4 toggles and 4 sliders
  - label toggle changes node label opacity

## 2026-05-20 - `evaluating-new-technology` + `information-architecture`

Task:

- Research open source implementations before continuing the Obsidian-style graph fidelity work.

Skill sources:

- `/Users/qyx/.codex/skills/evaluating-new-technology/SKILL.md`
- `/Users/qyx/.codex/skills/information-architecture/SKILL.md`

Reason:

- The user pointed out that product-reference analysis was not enough; the project should first look for reusable open source implementations.

Workflow steps followed:

- Ran the reuse-first discovery gate.
- Checked Obsidian Graph View as the product baseline.
- Evaluated Juggl, Obsidian Extended Graph, GraphFrontier, and Obsidian Digital Garden.
- Compared implementation fit, license posture, Obsidian API coupling, and direct reuse potential.
- Documented a recommended spike path.

Output artifacts:

- [Obsidian Graph Open Source Research](obsidian-graph-open-source-research.md)
- [Chinese Obsidian Graph Open Source Research](zh-CN/obsidian-graph-open-source-research.md)
- Updated [Concept Map Research](concept-map-research.md)
- Updated [README](../README.md)

Deviations:

- No implementation changes were made in this pass; this is intentionally a selection and planning artifact.

Verification:

- The docs site build should include the new English and Chinese research docs.

## 2026-05-20 - `evaluating-new-technology` + `spec-first`

Task:

- Correct the Structure Tree reuse gap by evaluating mature mind-map and hierarchy libraries before adding more custom features.

Skill sources:

- `/Users/qyx/.codex/skills/evaluating-new-technology/SKILL.md`
- `/Users/qyx/.codex/skills/spec-first/SKILL.md`

Reason:

- The user pointed out that the SVG Structure Tree was implemented before a sufficiently deep reuse-first evaluation, and future features would otherwise be rebuilt incrementally.

Workflow steps followed:

- Reframed the problem as a build/buy/reuse decision.
- Checked package and repository signals for Markmap, Mind Elixir, jsMind, and d3-hierarchy.
- Compared fit against the project's manifest-driven documentation IA.
- Updated the existing Structure Map decision record so the native SVG tree is treated as a prototype and fallback.

Output artifacts:

- [Mind Map Library Evaluation](mind-map-library-evaluation.md)
- [Chinese Mind Map Library Evaluation](zh-CN/mind-map-library-evaluation.md)
- Updated [Task Board](../TASKS.md)
- Updated `.agents/DECISIONS/structure-map.md`

Deviations:

- No implementation changes were made in this pass. This was intentionally a selection and planning correction.

Verification:

- `npm run build` should include 57 documentation files after the new bilingual docs are added to the manifest.
