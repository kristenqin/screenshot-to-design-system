# Next Tasks

## Purpose

This document turns the current product discussion into concrete next steps for implementing the screenshot-to-design-system workflow.

The immediate goal is not to build the full product. The immediate goal is to prove the first reliable loop:

```text
screenshot
  -> detected UI elements
  -> structured UI JSON
  -> component candidates
  -> basic design tokens
  -> reconstructed HTML or design draft
  -> screenshot diff
```

## Task Group 1: Define the Intermediate Data Model

This should be the first implementation task.

Create schemas for:

- `UIAst`
- `Screen`
- `Element`
- `TextRun`
- `ComponentCandidate`
- `DesignTokenSet`
- `DetectionSource`
- `DiffReport`

Why this matters:

- all external tools can be swapped behind the same interface
- Doubao, OCR, UI detectors, clustering, and Figma output can share one structure
- failures become easier to inspect and debug

Suggested files:

```text
schemas/ui-ast.schema.json
schemas/component-candidate.schema.json
schemas/design-tokens.schema.json
schemas/diff-report.schema.json
```

Acceptance criteria:

- each detected element has an id, type, bbox, source, confidence, and optional style/text data
- component candidates can reference multiple element ids
- tokens can represent colors, typography, spacing, radius, border, and shadow
- schema supports multiple detection sources, such as screenshot, wireframe, OCR, and model inference

## Task Group 2: Prepare a Small Screenshot Dataset

Collect 10 to 20 real screenshots that represent likely product use cases.

Recommended categories:

- table-heavy enterprise page
- list page
- form page
- dashboard page
- card grid page
- sidebar navigation page
- modal or drawer state
- dropdown or menu state
- mobile page
- same product across multiple screens

Suggested structure:

```text
samples/
  raw/
  wireframes/
  annotations/
  outputs/
```

Acceptance criteria:

- screenshots are high enough resolution for OCR and bbox detection
- each screenshot has basic metadata
- at least 3 screenshots contain repeated component patterns

## Task Group 3: Run UI Detection and OCR Experiments

Start with existing tools instead of custom detection.

Candidates:

- UIED or YOLO-based UI detector for UI element boxes
- PaddleOCR or another mature OCR tool for text
- OpenCV contour detection as a lightweight baseline

Experiment goal:

- compare detection quality across original screenshots and Doubao-generated wireframes

Outputs:

```text
experiments/detection/
  input.png
  wireframe.png
  elements.raw.json
  elements.normalized.json
  overlay.png
```

Acceptance criteria:

- major containers and controls are detected
- OCR text is linked to nearby or containing UI elements
- results are normalized into the shared `UIAst` schema

## Task Group 4: Build a Visual Debug Viewer

This is important because the system will be hard to debug from JSON alone.

The viewer should show:

- original screenshot
- wireframe screenshot
- detected bounding boxes
- OCR text
- element types
- component cluster colors
- confidence scores
- selected element details

Acceptance criteria:

- user can visually inspect one screenshot result
- clusters are easy to distinguish
- obvious detection errors are visible without reading raw JSON

## Task Group 5: Prototype Component Candidate Clustering

Use detected elements and crops to find repeated components.

Feature extraction:

- geometry features
- color features
- OCR text role
- visual embedding
- layout relationship

Initial clustering:

- DBSCAN or HDBSCAN

Output:

```json
{
  "componentCandidates": [
    {
      "name": "ButtonCandidate",
      "instances": ["node_12", "node_38"],
      "confidence": 0.82,
      "sharedProperties": {
        "height": 40,
        "radius": 8
      },
      "variableProperties": ["text", "width"]
    }
  ]
}
```

Acceptance criteria:

- repeated buttons, list items, table rows, or cards can be grouped
- noise elements can remain unclustered
- each candidate includes shared and variable properties

## Task Group 6: Extract Basic Design Tokens

Start with pragmatic token extraction.

Initial tokens:

- background colors
- text colors
- primary action color
- border colors
- common font sizes
- common spacing values
- common radius values

Important rule:

Photo/image regions should be excluded from palette extraction when possible.

Acceptance criteria:

- token output is plausible for at least 3 sample screenshots
- major brand/action color is captured
- typography is represented as a scale even when exact font family is unknown

## Task Group 7: Generate the First Reconstructed Output

Use HTML first unless there is a strong reason to start directly with Figma.

Why HTML first:

- easier to render locally
- easier to screenshot
- easier to diff
- easier to debug layout and style generation

Output options:

- static HTML and CSS
- React component tree
- Figma file after the HTML loop is stable

Acceptance criteria:

- one screenshot can be reconstructed into a visible page
- repeated components reuse shared definitions
- output can be rendered into an image for diffing

## Task Group 8: Add Screenshot Diff Feedback

Render the reconstructed output and compare it against the original screenshot.

Diff types:

- pixel diff
- OCR diff
- bbox diff
- color distance
- layout mismatch

Acceptance criteria:

- diff report identifies obvious mismatches
- diff metrics can be stored per run
- later experiments can compare whether a change improved the result

## Suggested Four-Week Plan

### Week 1

- define schemas
- prepare sample screenshots
- run OCR and UI detection on 3 screenshots

### Week 2

- normalize detection output into `UIAst`
- build visual debug viewer
- compare original screenshot detection with wireframe detection

### Week 3

- implement component candidate clustering
- add crop feature extraction
- tune clustering on repeated UI patterns

### Week 4

- extract basic tokens
- generate first HTML reconstruction
- render screenshot and create diff report

## Recommended First Concrete Task

Create the initial project structure:

```text
schemas/
experiments/
samples/
tools/
viewer/
```

Then implement the first schema:

```text
schemas/ui-ast.schema.json
```

This is the safest starting point because it makes every later tool integration easier to evaluate.

## Current Priority Order

1. Define schema.
2. Collect screenshots.
3. Run detection experiments.
4. Build visual debug viewer.
5. Prototype component clustering.
6. Extract basic design tokens.
7. Generate HTML reconstruction.
8. Add screenshot diff feedback.

