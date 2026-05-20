# Reuse-First Discovery Gate

## Purpose

This project should not default to self-implementation when a mature tool, skill, library, hosted API, or product pattern can solve the problem.

The gate exists because implementation cost is not only engineering time. It also includes:

- human waiting time
- token cost
- review fatigue
- context drift
- debugging cost
- future maintenance burden
- psychological damage when a half-working module feels broken

The default posture is:

> Research reusable options first. Implement only after the reuse path is understood and deliberately rejected or scoped.

## Skills.sh Inputs

The following Skills.sh resources should inform this gate:

| Skill | Use in this project |
| --- | --- |
| [evaluating-new-technology](https://skills.sh/refoundai/lenny-skills/evaluating-new-technology) | Use before adopting, replacing, or self-building a non-trivial technology. The key idea is build AND buy: buy or reuse standard capabilities, build only what creates project-specific advantage. |
| [spec-first](https://skills.sh/shipshitdev/library/spec-first) | Use when an implementation direction is not yet stable. Define behavior, tradeoffs, and acceptance before code. |
| [simple-brainstorm](https://skills.sh/roin-orca/skills/simple-brainstorm) | Use when the user is exploring options. Do not code, scaffold, or execute until the direction is approved. |
| [implementation-planner](https://skills.sh/jumppad-labs/jumppad/implementation-planner) | Use after the reuse decision is made to turn the selected approach into a concrete plan. |
| [create-plan](https://skills.sh/openai/skills/create-plan) | Use for structured planning after discovery, not as a replacement for discovery. |

## When This Gate Triggers

Run this gate before implementation when any of these are true:

- The task involves a third-party UI, graph, workflow, documentation, testing, parsing, image, or ML capability.
- The expected change touches more than 2-3 files.
- The task requires technical selection or product interaction design.
- The capability is not the project's core differentiator.
- The user asks whether a tool, skill, library, or mature solution exists.
- The previous attempt showed high friction, poor quality, or unclear value.
- The work could create long-term maintenance burden.

## Required Sequence

Before coding:

1. Search for reusable tools, libraries, skills, APIs, or product patterns.
2. Identify at least 2 viable options when possible.
3. Compare tradeoffs:
   - fit to the user goal
   - implementation cost
   - maintenance cost
   - integration risk
   - quality ceiling
   - lock-in risk
   - reversibility
4. Recommend one of:
   - reuse directly
   - lightly integrate
   - prototype with a third-party tool
   - self-implement
   - pause because the problem is underspecified
5. Ask for confirmation when the choice changes product direction, adds a dependency, or costs meaningful time.
6. Only implement after the direction is clear.

## Decision Record Template

Use this short template in plans or docs:

```text
Discovery gate:
- Problem:
- Existing options checked:
- Recommended path:
- Why not self-build:
- Why self-build is justified, if applicable:
- Verification:
- Reversibility:
```

## Applying This to the Current Project

Examples:

| Area | Default stance |
| --- | --- |
| Wireframe generation | Reuse Doubao unless a cheaper option matches quality. |
| Concept map rendering | Reuse graph libraries or existing knowledge-graph tools before tuning custom rendering. |
| Documentation site | Prefer existing docs frameworks if the custom site becomes costly. |
| OCR | Reuse mature OCR engines before model work. |
| UI detection | Reuse UIED, YOLO-family detectors, or existing screen parsing tools before custom detectors. |
| Component clustering | Reuse embedding, clustering, and visual similarity libraries before custom algorithms. |
| Design token extraction | Reuse color/font/layout extraction libraries where quality is acceptable. |

## Completion Rule

An implementation task is not ready to start until the discovery gate has either:

- selected a reusable path, or
- documented why self-implementation is worth the cost.

If the user explicitly asks to brainstorm or discuss, do not implement during that turn unless the user later approves execution.
