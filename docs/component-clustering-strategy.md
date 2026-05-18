# Component Clustering Strategy

## Goal

Detect repeated or visually similar UI regions and group them as reusable component candidates.

The output should not immediately claim that a design system is correct. It should produce candidates with confidence scores and explainable shared properties.

## Recommended Pipeline

```text
UI element detection
  -> crop each element or region
  -> extract geometry features
  -> extract visual features
  -> extract text features
  -> extract layout features
  -> compute similarity
  -> cluster
  -> AI or human review
  -> confirmed component definitions
```

## Feature Types

### Geometry Features

- width
- height
- aspect ratio
- area
- x/y position patterns
- alignment
- spacing to neighboring elements
- repeated grid/list position

### Visual Features

- image embedding
- color histogram
- dominant colors
- border color
- fill color
- radius
- shadow
- icon presence
- separator lines

### Text Features

- OCR text
- text length
- text role, such as action, title, value, label
- text embedding
- font size estimate
- font weight estimate

### Layout Features

- child count
- child ordering
- horizontal or vertical arrangement
- padding estimate
- gap estimate
- container relationships

## Similarity Formula

A practical first version can use weighted similarity:

```text
final_similarity =
  0.25 * geometry_similarity
+ 0.25 * visual_embedding_similarity
+ 0.20 * color_style_similarity
+ 0.20 * layout_tree_similarity
+ 0.10 * text_role_similarity
```

The weights should be tuned with real screenshots.

## Clustering Approach

Recommended first choice:

- HDBSCAN if available
- DBSCAN as a simpler fallback

Why:

- the number of component groups is unknown
- noise points are expected
- not every detected element belongs to a reusable component

## Candidate Output Format

```json
{
  "componentCandidates": [
    {
      "name": "PrimaryButtonCandidate",
      "instances": ["node_12", "node_38", "node_91"],
      "confidence": 0.87,
      "sharedProperties": {
        "height": 40,
        "radius": 8,
        "background": "#2563EB",
        "fontSize": 14
      },
      "variableProperties": ["text", "width"]
    }
  ]
}
```

## Important Product Decision

The first version should produce "component candidates" rather than automatically finalizing components.

This reduces risk and makes the system easier to debug. A later version can add automatic promotion rules for high-confidence clusters.

## Expected Strong Cases

- repeated buttons
- table rows
- list items
- navigation items
- cards in grids
- form fields
- metric cards

## Expected Weak Cases

- one-off hero sections
- dense dashboards with many small variations
- screenshots with heavy image content
- custom illustrations
- low-resolution or compressed screenshots
- similar-looking but semantically different elements

