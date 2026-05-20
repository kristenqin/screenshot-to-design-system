# Information Architecture

## Purpose

This document audits the documentation site's structure and defines a clearer information architecture.

It applies the `information-architecture` skill:

- `/Users/qyx/.codex/skills/information-architecture/SKILL.md`

## Problem

The documentation site had a usable but uncomfortable structure.

The sidebar grouped documents by broad buckets:

- Start
- Project
- Planning
- Research
- Workflow
- Chinese equivalents

This was technically organized, but it still felt like all documents were mixed together.

## Root Cause

The navigation was organized by document origin and broad file type, not by user task.

A reader usually arrives with one of these questions:

- How do I resume this project?
- What is this product?
- What should I do next?
- What research supports the plan?
- What rules govern the workflow?
- What evidence or audit trail exists?

The old navigation made the reader translate those questions into file categories.

## IA Diagnosis

### Flat Navigation Problem

The site exposed 40+ documents in one broad sidebar.

This created too many visible choices and made all docs feel equally important.

### Weak Mental Model Alignment

Labels like "Workflow" and "Planning" are reasonable internally, but they do not fully match the user's intent in the moment.

The user is not always looking for a planning doc. They may be trying to resume, understand, decide, execute, or audit.

### Missing Hub-and-Spoke Structure

The site had individual docs, but not enough reader paths or hub pages.

The reader needed a better high-level route before diving into detail.

### Mixed Operational and Product Docs

Product docs, process docs, logs, handoffs, and Chinese companion docs appeared in the same visual weight.

This made the navigation feel dense even though the content itself was useful.

## New Taxonomy

The docs site now uses reading paths as a faceted layer above document sections.

### Reading Paths

| Path | User question | Typical docs |
| --- | --- | --- |
| Resume | Where do I start right now? | Start Here, Handoff, Tasks |
| Understand | What is this project? | README, PRD, Workflow Overview |
| Plan | What should happen next? | Tasks, Issue Breakdown, Roadmap |
| Research | What evidence supports this? | Tools, Clustering, Tokens |
| Operate | What rules govern work? | Documentation System, Skill Policy, Session Continuity |
| Audit | What happened and why? | Skill Logs, Retrospectives, Handoff |
| 中文 | Chinese-facing product control | Chinese companion docs |

## Implementation Decision

The sidebar should support both:

- reading path filters
- language filters

Document sections remain available, but they are secondary to the user's current task.

## Structure Tree Content Audit

The Structure Tree rendering is strong enough. The next bottleneck is the node content model.

Problems found:

- Workflow and Chinese Workflow each contained 14 document leaves under one section, exceeding the recommended 5-9 scannable choices per level.
- The tree had only four semantic layers: project, module, section, document. Dense sections needed one additional topic layer.
- Root, module, section, and topic labels mixed project phases, file sections, and operating intent, so the naming system was not coherent enough for decision-making.
- Some top-level labels were sentence-like or internally oriented, which made the map harder to scan.
- Document leaves used full Markdown titles, so the tree read like a file inventory instead of a concept map.
- Full source paths were useful for debugging, but too noisy as visible node content.

Applied changes:

- Dense Workflow sections now use a fifth layer: project -> module -> section -> topic -> document.
- The root is shortened to Design Recovery.
- Top-level modules are renamed to Entry, Product, Evidence, Operating Model, and Modules.
- File-derived sections are displayed as task domains such as Session Entry, Product Context, Work Plan, Technical Research, Documentation Ops, and Module Passport.
- Workflow is split into Reading System, Structure Views, Agent Workflow, Reuse Rules, and Audit Trail.
- Chinese Workflow is split into 阅读系统, 结构视图, Agent 工作流, 复用规则, and 审计线索.
- Document leaves use short concept labels in the tree while keeping the full document title in node metadata.

This keeps the tree aligned with the user's goal: make project structure decisions quickly, then open the exact document only when needed.

## Success Criteria

The improved navigation should make it easier to answer:

- I am opening a new session. What should I read first?
- I want to understand the product. Where do I start?
- I want to execute the next task. Which docs matter?
- I want to review whether the workflow is trustworthy. Where is the audit trail?
- I want Chinese context. How do I narrow to that layer?

## Future Improvements

- Add a dedicated hub page for each reading path.
- Add breadcrumbs for source document relationships.
- Add visible document metadata such as `canonical`, `companion`, `audit`, `handoff`.
- Add lightweight tree testing tasks for navigation validation.
- Add search result snippets from document body, not only title and summary.
