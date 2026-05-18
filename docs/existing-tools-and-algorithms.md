# Existing Tools and Algorithms

## Principle

Do not rebuild every stage from scratch. The system should assemble mature tools wherever possible and reserve custom work for the product-specific middle layer.

## Keep as Black Box

### Wireframe Generation

Use the existing Doubao image generation API if its output remains stable and cost-effective.

Reasons:

- high current quality
- hard to beat with lightweight custom CV
- expensive to reproduce reliably
- not the core differentiation

Potential future alternatives should only be considered if they reduce cost without hurting quality.

## Existing Capabilities Worth Reusing

### OCR

Use mature OCR instead of custom text recognition.

Candidates:

- PaddleOCR
- Tesseract
- cloud OCR APIs
- multimodal model OCR

### UI Element Detection

Useful references and tools:

- [UIED](https://github.com/MulongXie/UIED): UI element detection from screenshots using a mix of CV, OCR, and learning-based methods.
- [uitag](https://pypi.org/project/uitag/): screenshot annotation and UI manifest generation.
- [uitag YOLO UI detection model](https://huggingface.co/laywens/uitag-yolo11s-ui-detect-v1): YOLO-based UI detection model.
- [deki](https://github.com/RasulOs/deki): combines YOLO, OCR, and UI descriptions.

### Segmentation and Region Detection

Potential building blocks:

- OpenCV connected components
- contour detection
- Segment Anything Model variants
- YOLO object detection
- image region classification

For UI screenshots, classic CV can still be useful because many interfaces are composed of rectangles, lines, containers, and repeated regions.

### Visual Similarity

Reusable algorithms:

- perceptual hash, useful for near-duplicate elements
- SSIM, useful for visual crop comparison
- CLIP or SigLIP embeddings, useful for semantic similarity
- DINOv2 or ViT embeddings, useful for visual structure similarity
- color histograms, useful for style similarity
- OpenCV template matching, useful for repeated icons or fixed UI parts

### Clustering

Reusable clustering algorithms:

- DBSCAN
- HDBSCAN
- Agglomerative Clustering
- k-means when the number of groups is known

For this product, HDBSCAN or DBSCAN are especially useful because the number of component types is usually unknown.

## Custom Work That Is Still Needed

The reusable tools above do not directly produce a design system. The custom product layer should focus on:

- UI AST schema
- feature extraction from detected UI elements
- weighted similarity scoring
- component candidate merging
- token extraction rules
- design system naming
- page reconstruction logic
- screenshot diff feedback loop

## Research Notes

There are academic and experimental projects for UI understanding, semantic grouping, screenshot-to-code, and GUI parsing. They are useful for direction but should not be assumed to be production-ready.

The product should be built as a pragmatic pipeline first, with swappable models behind stable interfaces.

