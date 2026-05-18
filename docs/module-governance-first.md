# Module Governance First

This document captures a project principle:

> Do not rush directly into a product MVP when the underlying modules are still ambiguous. First make the important modules understandable, bounded, testable, and reusable. Then compose them into a product workflow.

The goal is not to reject MVP thinking. The goal is to prevent a weak MVP from turning into unmanaged complexity, fragile confidence, and a project that feels easier to restart than continue.

## External Ideas Worth Reusing

| Source | Reusable idea | How this project should use it |
| --- | --- | --- |
| [Domain-Driven Design: Bounded Context](https://martinfowler.com/bliki/BoundedContext.html) | A model is only coherent inside a clear boundary. | Treat each pipeline module as a bounded context with its own language, inputs, outputs, and invariants. |
| [Team Topologies](https://teamtopologies.com/key-concepts-content/what-are-the-core-team-types-in-team-topologies) | Architecture and team boundaries should reduce cognitive load and support fast flow. | Keep each module small enough that a human and an AI agent can reason about it without loading the whole system. |
| [C4 Model](https://c4model.com/introduction) | Describe systems through multiple abstraction levels: context, containers, components, and code. | Document each module at the right level instead of mixing product story, architecture, and implementation detail in one page. |
| [Architecture Decision Records](https://adr.github.io/) | Capture important decisions with context and consequences. | Record module-level decisions when choosing APIs, algorithms, model providers, schemas, or tradeoffs. |
| [Diátaxis](https://diataxis.fr/) | Documentation works better when tutorials, how-to guides, reference, and explanation are separated. | Give each mature module four doc surfaces: overview, operating guide, reference contract, and rationale. |
| [Google SRE SLOs](https://sre.google/sre-book/service-level-objectives/) | Define service health through indicators, objectives, and user-relevant behavior. | Define module quality through measurable checks such as OCR recall, bbox error, cluster purity, token stability, and diff improvement. |
| [NASA Technology Readiness Levels](https://www.nasa.gov/directorates/somd/space-communications-navigation-program/technology-readiness-levels/) | Maturity should be assessed in levels, not vibes. | Use a lightweight Module Readiness Level scale before promoting a module into the product flow. |
| [Minimum Viable Architecture](https://www.infoq.com/articles/minimum-viable-architecture/) | MVP still needs enough architecture to satisfy quality attributes. | Do not let a screenshot-to-design MVP bypass module contracts, verification, or replaceability. |
| [Minimum Viable Capability](https://www.sei.cmu.edu/blog/introducing-the-minimum-viable-capability-strategy/) | For complex systems, prove a capability rather than only a thin product shell. | Prefer a reliable UI AST capability or clustering capability over a broad but brittle end-to-end demo. |
| [Tracer Bullets](https://www.artima.com/articles/tracer-bullets-and-prototypes) | Build early real paths to get feedback without pretending the whole system is done. | Use tracer-bullet integrations only after key modules have enough contract clarity. |

## Project Principle

The project should use this ordering:

```text
module boundary
  -> module contract
  -> module verification
  -> module readiness
  -> product integration
  -> product MVP
```

This reverses the usual pressure to make the end-to-end demo first. A demo is still valuable, but only when it is built from modules whose behavior can be inspected and trusted.

## Module Passport

Every important module should eventually have a short passport:

| Field | Meaning |
| --- | --- |
| Purpose | What problem this module owns. |
| Non-purpose | What it explicitly does not own. |
| Inputs | Required files, data, model outputs, or user decisions. |
| Outputs | Artifacts produced by the module. |
| Contract | Schema, API, data format, or expected behavior. |
| Dependencies | External tools, models, APIs, libraries, or human review. |
| Verification | How we know the module worked. |
| Failure modes | How the module can fail and how failures are surfaced. |
| Replaceability | What must stay stable if the implementation is replaced. |
| Readiness level | Current maturity and next promotion gate. |
| Decisions | ADRs or research docs that explain why choices were made. |

## Module Readiness Levels

This project should use a lightweight readiness scale inspired by TRL, adapted for AI-assisted software modules.

| Level | Name | Meaning | Promotion evidence |
| --- | --- | --- | --- |
| M0 | Named | The module exists as a rough idea. | One-sentence purpose and owner document. |
| M1 | Researched | Existing tools, risks, and candidate approaches are known. | Research doc with adopted and rejected options. |
| M2 | Contracted | Inputs, outputs, and boundaries are explicit. | Schema, API sketch, or artifact contract. |
| M3 | Prototyped | A narrow prototype works on one controlled sample. | Reproducible run and saved output. |
| M4 | Verified | The module has checks on representative samples. | Metrics, visual inspection workflow, or regression fixture. |
| M5 | Reusable | The module can be used outside the current pipeline. | Stable interface, docs, examples, and replacement notes. |
| M6 | Integrated | The module participates in the product workflow without hiding its failures. | End-to-end trace, logged outputs, and failure diagnostics. |

The product MVP should not depend on modules that are still M0/M1 unless the integration explicitly treats them as unknown-risk experiments.

## Current Module Map

| Module | Current level | Why | Next gate |
| --- | --- | --- | --- |
| Screenshot intake | M1 | We know high-quality screenshots are required, but the input standard is not formalized. | Define screenshot quality checklist and fixture folder. |
| Wireframe generation | M3 | Doubao has been manually validated as a strong black-box provider. | Record API contract, cost assumptions, and sample outputs. |
| UI AST parsing | M1 | It is identified as the first core implementation target. | Define UI AST schema and first validated run. |
| Component clustering | M1 | Strategy exists, but no fixture-backed prototype yet. | Define candidate contract and similarity metrics. |
| Design token extraction | M1 | Research exists, but color/type/spacing extraction needs fixtures. | Define token schema and validation samples. |
| Reconstruction output | M0 | Output targets are still optional: Figma, HTML, or React. | Choose first output target for a narrow slice. |
| Diff verification | M1 | Feedback signals are identified. | Define first visual/OCR/bbox diff report contract. |
| Documentation system | M4 | Browser docs, bilingual docs, handoff, skill audit, concept map, and [module passport](module-passports/documentation-system.md) are working. | Create reusable passport template and automated consistency checks. |

## How This Changes the Roadmap

The roadmap should no longer ask only:

> What is the smallest end-to-end product demo?

It should first ask:

> Which module needs to become trustworthy enough that the next module can depend on it?

The next technical milestone should therefore be:

> Promote UI AST parsing from M1 to M3.

That means defining the schema, running one controlled screenshot through the parser, saving the output, and verifying that later modules can consume it.

After several modules reach M3/M4, a product MVP can be composed from them with far less psychological and technical debt.
