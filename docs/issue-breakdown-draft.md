# Issue Breakdown Draft

This document applies the `to-issues` skill to the current PRD. It breaks the work into independently grabbable vertical slices.

The project does not currently have a configured issue tracker or triage label vocabulary, so these are local draft issues rather than published tracker issues.

## Proposed Vertical Slices

### 1. Create the First Validated UI AST Run

Type: AFK

Blocked by: None - can start immediately

User stories covered: 1, 3, 5, 6, 21, 24

What to build:

Create the first end-to-end artifact path from one sample screenshot to a validated UI AST JSON file. This slice should define the minimal schema needed for screen metadata, elements, bounding boxes, source metadata, and confidence scores, then validate a fixture payload against it.

Acceptance criteria:

- [ ] A sample screenshot can be registered in the project sample structure.
- [ ] A minimal UI AST schema exists for screen metadata and UI elements.
- [ ] A fixture UI AST JSON file validates successfully.
- [ ] Invalid fixture data fails validation with useful errors.
- [ ] The output records detection source and confidence for each element.

### 2. Normalize OCR Output Into UI AST Text Runs

Type: AFK

Blocked by: Issue 1

User stories covered: 4, 5, 6, 20, 24

What to build:

Add an OCR normalization path that takes raw OCR-like output and maps it into the shared UI AST as text runs associated with bounding boxes and source metadata. The first version can use fixture OCR output before integrating a real OCR engine.

Acceptance criteria:

- [ ] Raw OCR fixture output can be normalized into UI AST text runs.
- [ ] Text runs include text content, bounding boxes, confidence, and source metadata.
- [ ] Text runs can be associated with containing or nearby elements when possible.
- [ ] Missing or low-confidence OCR entries are handled without breaking validation.
- [ ] The normalized output remains schema-valid.

### 3. Compare Screenshot and Wireframe Detection Inputs

Type: HITL

Blocked by: Issue 1

User stories covered: 2, 3, 5, 6, 20, 22

What to build:

Create an experiment path that accepts both an original screenshot and an optional Doubao wireframe, then records parallel detection inputs and source metadata. This slice should not replace Doubao or require a live Doubao integration; it should support using saved wireframe files.

Acceptance criteria:

- [ ] A sample can reference both a raw screenshot and saved wireframe image.
- [ ] The experiment output distinguishes screenshot-derived and wireframe-derived elements.
- [ ] The system can run with only a raw screenshot when no wireframe exists.
- [ ] A comparison summary shows counts and source coverage for both inputs.
- [ ] The user can review whether wireframe input improves structural detection for the sample.

### 4. Build the Visual Debug Viewer for One Sample

Type: AFK

Blocked by: Issues 1 and 2

User stories covered: 3, 4, 14, 15, 24

What to build:

Build a local visual debug viewer that loads one screenshot and its UI AST output, overlays bounding boxes and text metadata, and lets the user inspect element details.

Acceptance criteria:

- [ ] The viewer displays the source screenshot.
- [ ] The viewer overlays UI element bounding boxes.
- [ ] The viewer can show OCR text and confidence for text runs.
- [ ] Selecting an element shows id, type, bbox, source, confidence, and text data.
- [ ] The viewer can load data from a saved sample output.

### 5. Generate Component Candidates From Repeated Fixture Elements

Type: AFK

Blocked by: Issue 1

User stories covered: 7, 8, 9, 10, 23, 24

What to build:

Create the first component candidate generator using fixture UI AST data with repeated elements. The slice should group repeated patterns using simple geometry and style features before adding heavier visual embeddings.

Acceptance criteria:

- [ ] The component candidate schema exists and validates fixture output.
- [ ] Repeated fixture elements can be grouped into component candidates.
- [ ] Each candidate includes instance ids, confidence, shared properties, and variable properties.
- [ ] Unmatched or noisy elements can remain unclustered.
- [ ] Candidate output can be inspected in JSON and linked back to UI AST element ids.

### 6. Visualize Component Candidates in the Debug Viewer

Type: AFK

Blocked by: Issues 4 and 5

User stories covered: 8, 9, 14, 15, 23

What to build:

Extend the debug viewer so component candidates are visible on top of the screenshot, using cluster colors and candidate details.

Acceptance criteria:

- [ ] Component candidates are shown with distinct visual styling.
- [ ] Selecting a candidate shows instances, confidence, shared properties, and variable properties.
- [ ] Elements that are not part of a candidate remain visible but visually distinct.
- [ ] The viewer makes false grouping and missed grouping easy to notice.

### 7. Extract Basic Design Tokens From One Sample

Type: AFK

Blocked by: Issue 1

User stories covered: 11, 12, 13, 24

What to build:

Create a basic token extraction path that derives colors, typography estimates, spacing, and radius values from a sample UI AST and screenshot metadata. The first version should prefer stable, inspectable heuristics over complex inference.

Acceptance criteria:

- [ ] A design token schema exists and validates fixture output.
- [ ] Token output includes colors, typography, spacing, radius, border, and shadow sections.
- [ ] Major background, text, border, and action-like colors can be represented.
- [ ] Typography output is represented as a practical scale rather than an exact font claim.
- [ ] Token extraction can ignore regions marked as image/photo content when present.

### 8. Generate First HTML Reconstruction From UI AST

Type: AFK

Blocked by: Issues 1, 5, and 7

User stories covered: 16, 21, 24

What to build:

Generate a first-pass static HTML reconstruction from one UI AST, component candidate output, and token set. The output does not need perfect fidelity, but it must render a visible page from structured artifacts.

Acceptance criteria:

- [ ] One sample can produce an HTML file.
- [ ] Generated HTML uses token values where available.
- [ ] Repeated component candidates are reflected as reusable definitions or repeated structured output.
- [ ] The rendered page visibly resembles the source screenshot at a coarse layout level.
- [ ] The output can be regenerated from saved artifacts.

### 9. Render Reconstruction and Produce a Diff Report

Type: AFK

Blocked by: Issue 8

User stories covered: 17, 18, 19, 24

What to build:

Add the first verification loop that renders the reconstructed HTML to an image and compares it against the source screenshot with a saved diff report.

Acceptance criteria:

- [ ] Generated HTML can be rendered to an image.
- [ ] A diff report is saved for the run.
- [ ] The diff report includes at least image dimensions and a pixel-level mismatch signal.
- [ ] The report can be compared across multiple runs for the same sample.
- [ ] The diff output is linked to the source sample and reconstruction artifact.

### 10. Package the First Demo Run

Type: HITL

Blocked by: Issues 1 through 9

User stories covered: 1 through 25

What to build:

Create a first demo run that documents the full MVP loop on one representative screenshot. This issue should gather artifacts, summarize quality, and identify which module is currently the weakest link.

Acceptance criteria:

- [ ] One sample has raw screenshot, optional wireframe, UI AST, OCR text runs, component candidates, tokens, HTML reconstruction, rendered image, and diff report.
- [ ] The debug viewer can inspect the sample.
- [ ] A short demo report summarizes what worked and what failed.
- [ ] The user reviews whether the next phase should prioritize detection quality, clustering, token extraction, reconstruction, or diff metrics.

## Approval Questions

Before publishing these as real issues, confirm:

- Does this granularity feel right, or are the slices too small or too large?
- Are the dependency relationships correct?
- Should any slices be merged or split further?
- Are the HITL and AFK labels correct?

