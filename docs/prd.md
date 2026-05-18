# Product Requirements Document

## Problem Statement

Users want to reconstruct editable design drafts and reusable design systems from software screenshots, but one-shot AI generation is too unreliable for this level of visual and structural precision.

The current failure mode is not only visual mismatch. A generated design may look plausible while still missing the deeper structure that makes a design file useful:

- reusable components
- design tokens
- hierarchy
- layout rules
- editable text and regions
- measurable fidelity feedback

The user already has a strong wireframe-generation path using the Doubao image generation API. Rebuilding that capability from scratch would create unnecessary implementation risk. The project should instead focus on the middle layer that turns screenshots and wireframes into structured UI data, component candidates, design tokens, and reconstructable output.

## Solution

Build a staged screenshot-to-design-system workflow that treats every major step as an inspectable artifact.

The product should not try to directly generate a final Figma file from a screenshot in one pass. Instead, it should create a pipeline:

```text
screenshot
  -> optional Doubao wireframe
  -> UI element detection
  -> OCR and visual parsing
  -> structured UI AST
  -> component candidate clustering
  -> design token extraction
  -> reconstructed HTML or design draft
  -> screenshot diff feedback
```

The MVP should first prove a reliable local loop:

```text
screenshot
  -> detected UI elements
  -> structured UI JSON
  -> component candidates
  -> basic design tokens
  -> reconstructed HTML
  -> visual diff report
```

HTML should be the first reconstruction target because it is easier to render, screenshot, compare, and debug than Figma. Figma export can be added after the structured pipeline is stable.

## User Stories

1. As a product builder, I want to provide a software screenshot, so that I can start reconstructing a design without manually tracing every UI element.
2. As a product builder, I want to include a Doubao-generated wireframe, so that the system can use a high-quality structural signal without rebuilding wireframe generation.
3. As a designer, I want detected UI elements to include bounding boxes, so that I can inspect what the system believes exists on the screen.
4. As a designer, I want OCR text to be linked to UI elements, so that reconstructed outputs preserve editable text rather than flattening everything into an image.
5. As a developer, I want all detector outputs normalized into a shared UI AST, so that different detectors can be swapped without changing downstream modules.
6. As a developer, I want each UI element to record its detection source, so that I can compare screenshot, wireframe, OCR, and model-inferred results.
7. As a workflow designer, I want repeated UI patterns grouped into component candidates, so that the output moves toward a design system rather than a static copy.
8. As a designer, I want component candidates to include shared and variable properties, so that I can understand why elements were grouped.
9. As a designer, I want low-confidence groups to remain candidates rather than final components, so that the system does not overclaim ambiguous matches.
10. As a developer, I want clustering to use geometry, visual, text, color, and layout features, so that visually similar components can be identified more robustly.
11. As a product builder, I want the system to extract basic design tokens, so that reconstructed output has reusable color, typography, spacing, radius, border, and shadow values.
12. As a designer, I want image and photo regions excluded from palette extraction where possible, so that token extraction is not polluted by content imagery.
13. As a designer, I want typography represented as a practical scale, so that the product remains useful even when exact font-family recognition is unreliable.
14. As a developer, I want a visual debug viewer, so that I can diagnose detection, OCR, clustering, and token extraction errors without reading raw JSON.
15. As a developer, I want bounding boxes and clusters overlaid on the screenshot, so that I can quickly see where the pipeline is failing.
16. As a product builder, I want a first reconstructed HTML output, so that I can validate the structured pipeline before investing in Figma export.
17. As a developer, I want reconstructed output rendered back into a screenshot, so that I can compare it against the original image.
18. As a product builder, I want a visual diff report, so that each iteration can be measured rather than judged only by intuition.
19. As a developer, I want diff reports saved per run, so that experiments can be compared over time.
20. As a product builder, I want pluggable detector adapters, so that the system can evaluate UIED, YOLO-based detectors, OCR tools, OpenCV baselines, and multimodal models.
21. As a developer, I want sample screenshots organized with raw images, wireframes, annotations, and outputs, so that experiments are reproducible.
22. As a product builder, I want the first version scoped to representative software screens, so that the MVP does not overextend into every app style.
23. As a designer, I want final component promotion to remain reviewable, so that the generated design system can be trusted.
24. As a developer, I want intermediate JSON artifacts at every stage, so that failures can be isolated to a specific module.
25. As a project owner, I want clear milestone boundaries, so that implementation can proceed without turning every research thread into a custom build.

## Implementation Decisions

- Treat Doubao wireframe generation as an external black-box capability during the MVP.
- Use a stable intermediate UI AST as the core contract between all stages.
- Prefer pluggable adapters for external tools instead of binding the pipeline to one detector.
- Store source and confidence metadata on every detected element.
- Model component extraction as candidate generation first, not automatic final design system generation.
- Use HTML as the first reconstruction target because it supports fast rendering and screenshot diffing.
- Defer Figma export until detection, clustering, token extraction, and diffing are working on representative screenshots.
- Use existing OCR and UI detection tools before considering custom model training.
- Use OpenCV as a lightweight baseline for contours, crop processing, color extraction, and visual comparison.
- Use DBSCAN or HDBSCAN for early clustering because the number of component groups is unknown.
- Use visual embeddings such as CLIP, SigLIP, or DINOv2 as one input to similarity scoring, not as the only similarity signal.
- Combine geometry, visual, color, text, and layout features for component clustering.
- Represent typography as a practical scale first, with exact font-family recognition treated as optional.
- Exclude image/photo regions from design token extraction where possible.
- Save run outputs in a structured experiment directory so later runs can be compared.

Major modules to build or modify:

- Schema module: defines UI AST, component candidates, design tokens, detection sources, and diff reports.
- Sample dataset module: organizes raw screenshots, wireframes, annotations, and outputs.
- Detector adapter module: normalizes OCR, UI detector, wireframe, and OpenCV outputs.
- Feature extraction module: extracts geometry, visual, color, text, and layout features from detected elements and crops.
- Component clustering module: groups related UI elements into candidate components.
- Token extraction module: derives colors, typography, spacing, radius, border, and shadow tokens.
- Debug viewer module: visualizes screenshots, boxes, OCR, clusters, confidence, and element details.
- Reconstruction module: generates first-pass HTML from structured UI data.
- Diff module: renders reconstruction output and compares it to the source screenshot.

Deep modules worth isolating behind stable interfaces:

- UI AST schema and validator
- detector output normalizer
- feature extractor
- component candidate generator
- token extractor
- diff reporter

## Testing Decisions

Tests should focus on external behavior rather than implementation details. The core question for each test is whether a module turns a known input artifact into an expected output artifact.

Modules that should receive tests early:

- UI AST schema validation
- detector output normalization
- component candidate generation
- design token extraction
- diff report generation

Recommended test types:

- schema validation tests for valid and invalid UI AST payloads
- fixture-based tests for normalizing OCR and detector output
- clustering tests using small synthetic element sets with known repeated patterns
- token extraction tests against controlled screenshots or cropped fixtures
- diff tests using known image pairs

Good tests should:

- use stable fixture data
- avoid asserting private implementation details
- check output shape, required fields, and meaningful values
- include edge cases for missing OCR, low-confidence detections, and unclustered elements
- make regressions visible when detector or clustering behavior changes

Manual verification should remain part of the MVP because visual quality cannot be fully captured by unit tests. The debug viewer and screenshot diff report are both part of the verification strategy.

## Out of Scope

- Building a custom replacement for Doubao wireframe generation.
- Training a custom UI detection model in the MVP.
- Perfect font-family recognition.
- Fully automatic final design system generation without review.
- Universal support for all apps, styles, platforms, and screenshot qualities.
- Inferring business logic from screenshots.
- Prioritizing Figma export before the HTML reconstruction and diff loop works.
- Producing production-ready frontend code from the first prototype.

## Further Notes

The central product risk is not whether a screenshot can be turned into an image-like design. The central risk is whether the system can produce structured, inspectable, reusable design information.

The recommended first implementation task is to create the project structure and define the UI AST schema:

```text
schemas/
experiments/
samples/
tools/
viewer/
```

Then implement:

```text
schemas/ui-ast.schema.json
```

Issue tracker publishing was not completed because this project does not currently have a configured issue tracker or triage label vocabulary. The PRD is stored as a local project document and can later be converted into issues.

