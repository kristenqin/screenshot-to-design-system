# MVP Roadmap

## MVP Objective

Build a pragmatic prototype that proves the core loop:

> screenshot -> structured UI data -> component candidates -> design tokens -> reconstructed design -> visual diff

The MVP should avoid replacing mature modules such as the current Doubao wireframe generation step.

## Phase 1: Static Screenshot Parsing

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

## Phase 2: Component Candidate Discovery

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

## Phase 3: Design Token Extraction

Outputs:

- color tokens
- typography scale
- spacing scale
- radius and border tokens

Success criteria:

- tokens are visually plausible
- major brand/action colors are captured
- typography scale is close even if exact font is unknown

## Phase 4: Reconstruct One Page

Outputs:

- Figma design, HTML, or React representation
- rendered screenshot of reconstruction
- diff report against source screenshot

Success criteria:

- layout is visually close
- repeated components reuse shared definitions
- diff output identifies obvious mismatches

## Phase 5: Iterative Refinement

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

