# Workflow Overview

## Problem Framing

Directly asking an AI model to recreate a design file from a screenshot has a low success rate because the task requires too much precision in one pass. A better approach is to split the task into stages and let each stage produce verifiable intermediate artifacts.

The product should not be framed as only "screenshot to design file." A more accurate framing is:

> Reverse-engineer a design system from visual output, then rebuild the page using that design system.

## End-to-End Pipeline

```text
1. Screenshot input
2. Image preprocessing
3. Wireframe generation
4. UI element detection
5. OCR and semantic parsing
6. UI AST generation
7. Similar component extraction
8. Design token extraction
9. Design system generation
10. Page reconstruction
11. Render and compare with source screenshot
12. Iterate using visual and structural diffs
```

## Stage Details

### 1. Screenshot Input

Users should provide complete screenshots, ideally including multiple related states or pages when available.

Useful screenshot groups:

- single full-page screenshot
- same page with different states
- list/table pages with repeated items
- modal/dropdown/hover states
- mobile and desktop variants

### 2. Image Preprocessing

Preprocessing should normalize the input before detection:

- remove browser/device chrome if needed
- upscale low-resolution screenshots
- align multiple screenshots
- detect and exclude photo/image regions
- reduce noise from compression artifacts

### 3. Wireframe Generation

Use the existing Doubao image generation API as the primary wireframe generator for now.

Rationale:

- current output quality is already high
- replacing it would introduce unnecessary model risk
- custom implementation cost is high
- this step is not the core product moat

The only reason to replace or supplement this module would be if a cheaper, stable, and quality-comparable method is found.

### 4. UI Element Detection

The system should detect:

- text blocks
- buttons
- inputs
- cards
- sidebars
- navigation items
- tables
- icons
- image regions
- separators
- containers

The output should include bounding boxes, element types, and confidence scores.

### 5. UI AST Generation

The key intermediate artifact should be a structured UI AST, not only a wireframe image.

Example:

```json
{
  "screen": {
    "width": 1440,
    "height": 900
  },
  "elements": [
    {
      "id": "node_12",
      "type": "button",
      "bbox": [120, 80, 96, 40],
      "text": "Create",
      "style": {
        "background": "#2563EB",
        "radius": 8,
        "fontSize": 14
      }
    }
  ]
}
```

### 6. Component Candidate Extraction

Repeated or similar regions should be grouped into component candidates before generating the final design file.

This stage should output candidates, not final truth. Human or AI review can confirm whether grouped elements are actually the same component.

### 7. Design Token Extraction

Extract reusable values:

- colors
- typography scale
- spacing
- radius
- shadows
- borders
- layout grids

### 8. Design System Generation

Generate reusable primitives:

- Button
- Input
- Card
- Table
- Sidebar
- Header
- Modal
- List item
- Navigation item

### 9. Reconstruction and Feedback

The generated design should be rendered back into an image and compared against the original screenshot.

Feedback signals:

- pixel diff
- layout diff
- OCR text diff
- color distance
- bounding-box distance
- component count mismatch

