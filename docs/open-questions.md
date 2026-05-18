# Open Questions

## Product Questions

- Should the first product output be Figma, HTML, React, or a neutral JSON schema?
- Should users confirm component candidates before design system generation?
- What level of fidelity is enough for a useful first version?
- Is the target user a designer, developer, product manager, or internal automation workflow?

## Technical Questions

- Which UI detector performs best on the target screenshot types?
- Is Doubao wireframe generation stable across dense enterprise software screens?
- How much does the wireframe improve downstream detection compared with the original screenshot?
- Which embedding model works best for UI crop similarity?
- Should clustering happen at the element level, region level, or layout subtree level?
- How should conflicting detections from screenshot and wireframe be merged?

## Component Questions

- How should the system distinguish visually similar but semantically different components?
- How should variants be inferred, such as primary, secondary, disabled, danger, and selected?
- How should list/table repetition be separated from reusable component identity?
- What confidence threshold should promote a candidate into a component?

## Token Questions

- How should image/photo regions be excluded from color extraction?
- How should antialiasing and shadows be handled during palette extraction?
- Can typography be inferred well enough without exact font recognition?
- Should the typography system be mapped to common fonts such as Inter, SF Pro, Segoe UI, and Roboto?

## Evaluation Questions

- What screenshot diff metric best correlates with human judgment?
- Should OCR diff be weighted more heavily than pixel diff?
- How should layout errors be separated from color errors?
- What benchmark screenshots should be used for regression testing?

