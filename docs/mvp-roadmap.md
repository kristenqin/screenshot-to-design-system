# MVP Roadmap

## Roadmap Reframe

This roadmap should now be read through [Module Governance First](module-governance-first.md).

The project should not optimize for the fastest broad end-to-end MVP if the modules underneath it are still vague. The preferred path is:

```text
module readiness first
  -> tracer-bullet integration
  -> product MVP
```

That means each phase below should promote one or more modules through explicit readiness levels before the whole screenshot-to-design workflow is treated as a product MVP.

## MVP Objective

Build a pragmatic prototype that proves the core loop:

> screenshot -> structured UI data -> component candidates -> design tokens -> reconstructed design -> visual diff

The MVP should avoid replacing mature modules such as the current Doubao wireframe generation step.

## Phase 1: Static Screenshot Parsing

Module target:

- Promote `Screenshot intake` from M1 to M2.
- Promote `UI AST parsing` from M1 to M3.

Inputs:

- one high-quality screenshot
- optional Doubao-generated wireframe

Outputs:

- detected UI elements
- OCR text
- bounding boxes
- basic element types

Success criteria:

- text regions are mostly detected
- major containers and controls are detected
- output is saved as structured JSON
- UI AST schema is explicit enough for later modules to consume

## Phase 2: Component Candidate Discovery

Module target:

- Promote `Component clustering` from M1 to M3.

Inputs:

- UI element JSON
- cropped element images
- OCR results

Outputs:

- grouped component candidates
- confidence score
- shared and variable properties

Success criteria:

- repeated buttons, list rows, table rows, and cards are grouped
- noise elements are not aggressively forced into clusters
- candidates are inspectable and explainable
- cluster output has a documented candidate contract

## Phase 3: Design Token Extraction

Module target:

- Promote `Design token extraction` from M1 to M3.

Outputs:

- color tokens
- typography scale
- spacing scale
- radius and border tokens

Success criteria:

- tokens are visually plausible
- major brand/action colors are captured
- typography scale is close even if exact font is unknown
- token output follows a stable schema

## Phase 4: Reconstruct One Page

Module target:

- Promote `Reconstruction output` from M0 to M3.
- Promote `Diff verification` from M1 to M3.

Outputs:

- Figma design, HTML, or React representation
- rendered screenshot of reconstruction
- diff report against source screenshot

Success criteria:

- layout is visually close
- repeated components reuse shared definitions
- diff output identifies obvious mismatches
- reconstruction can be traced back to UI AST, component candidates, and tokens

## Phase 5: Iterative Refinement

Module target:

- Promote the first integrated flow to M6 only after the participating modules expose their failures clearly.

Use feedback signals:

- pixel diff
- OCR diff
- bbox diff
- color distance
- layout mismatch

Success criteria:

- second-pass reconstruction improves measurable similarity
- errors can be traced to a specific stage

## Recommended First Tech Stack

- Doubao image generation API for wireframe generation
- UIED or YOLO-based UI detector for UI element boxes
- PaddleOCR or equivalent OCR
- OpenCV for crop processing, contours, color extraction, SSIM
- CLIP, SigLIP, or DINOv2 embeddings for visual similarity
- HDBSCAN or DBSCAN for clustering
- JSON schema for UI AST and component candidates
- Figma API, HTML, or React as output target

## Non-Goals for MVP

- perfect font-family recognition
- fully automatic design system without review
- custom wireframe generation model
- universal support for every app type
- perfect semantic interpretation of business logic
