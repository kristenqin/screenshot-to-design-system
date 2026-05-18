# Design Token Extraction

## Goal

Extract reusable design values from screenshots so the reconstructed design is not just visually similar, but also systematically editable.

## Color Extraction

Color extraction should not be a naive palette extraction from the entire screenshot. Screenshots contain noise from:

- shadows
- antialiasing
- photos
- icons
- gradients
- compression artifacts
- disabled states

## Recommended Color Priority

Extract colors in this order:

1. large background colors
2. frequent text colors
3. frequent border colors
4. primary interaction colors, such as buttons and links
5. semantic colors, such as success, warning, error, and info
6. disabled and muted colors

Image/photo regions should be excluded from token extraction when possible.

## Typography Extraction

Precise font-family recognition is currently unreliable. The first version should avoid overcommitting to exact font names.

Instead, infer typography system properties:

- font category: system, sans, serif, mono, geometric sans, humanist sans
- font size
- font weight
- line height
- text role
- heading/body/label/caption scale

Practical mappings:

- macOS or iOS screenshots -> SF Pro style
- Windows screenshots -> Segoe UI style
- web SaaS interfaces -> Inter or system-ui
- Material-style interfaces -> Roboto

## Spacing and Layout Tokens

Extract:

- common gaps
- container padding
- section margins
- grid columns
- row heights
- table cell padding
- sidebar widths
- header heights

Repeated distances are more useful than one-off measurements.

## Radius, Border, and Shadow Tokens

Extract:

- common radius values
- border widths
- border colors
- elevation/shadow levels
- divider styles

## Token Output Example

```json
{
  "tokens": {
    "colors": {
      "background.default": "#FFFFFF",
      "text.primary": "#111827",
      "text.muted": "#6B7280",
      "brand.primary": "#2563EB",
      "border.default": "#E5E7EB"
    },
    "typography": {
      "body.sm": {
        "fontSize": 14,
        "fontWeight": 400,
        "lineHeight": 20
      },
      "heading.md": {
        "fontSize": 20,
        "fontWeight": 600,
        "lineHeight": 28
      }
    },
    "radius": {
      "sm": 4,
      "md": 8
    },
    "spacing": {
      "xs": 4,
      "sm": 8,
      "md": 16,
      "lg": 24
    }
  }
}
```

## Open Risk

Theme extraction and font inference need further empirical testing. They should be evaluated against real screenshots rather than only synthetic examples.

