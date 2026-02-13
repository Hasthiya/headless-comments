---
name: heartbeat-design-system
description: Apply the Heartbeat design system when building or styling UI: 8pt spacing, limited palette (white, #191919, CTA #FF8C5F), natural easing, structured layouts. Use when the user or project references Heartbeat, this design system, or when implementing interfaces that should follow simplicity, lightness, and ease.
---

# Heartbeat Design System

Apply this skill when creating or updating UI that must follow the Heartbeat design system. Core principle: **design is based on simplicity**—lightness, freedom, ease. Use limited styles, intentional spacing, minimal color, and motion with natural easing.

## When to Use

- User or project specifies Heartbeat design system
- Building components, pages, or layouts that should feel light and minimal
- Styling CSS/SCSS, Tailwind, or design tokens for this system

## Spacing (8pt grid)

**Base unit:** 8px. Use multiples only: `8, 16, 24, 32, 40, 48, 56, 64, ...` (8×n).  
**Exception:** 4px only when strictly necessary.

- Unrelated elements: large separation
- Larger components: larger surrounding space
- White space is structural, not decorative

**Examples:**
```css
padding: 16px;
margin-bottom: 32px;
gap: 24px;
```

In Tailwind, prefer: `p-4` (16px), `gap-6` (24px), `mb-8` (32px), etc., and avoid arbitrary values that break the grid.

## Color

| Role            | Value     | Proportion |
|-----------------|-----------|------------|
| Primary bg      | `#FFFFFF` | ~80%       |
| Primary text    | `#191919` | ~10%       |
| Brand/Black     | `#191919` | ~10%       |
| CTA (actions)   | `#FF8C5F` | ~1%        |

- Keep approximate 80/10/10 balance. CTA only for actions; keep it visually distinct.
- No decorative color; do not introduce new colors.

**CSS variables example:**
```css
--heartbeat-bg: #FFFFFF;
--heartbeat-text: #191919;
--heartbeat-cta: #FF8C5F;
```

## Typography

- Line length: 40–60 characters per line
- Use the project’s predefined font scale; no arbitrary font sizes
- Paragraph spacing: minimum 16px; prefer 24px or 32px

## Motion

**Default easing:** `cubic-bezier(0.77, 0, 0.175, 1)`  
No linear animations. Motion should feel organic: subtle anticipation, smooth deceleration.

```css
transition: all 1s cubic-bezier(0.77, 0, 0.175, 1);
```

## Layout

- Unlimited elements allowed; **limited styles** enforced
- Structured asymmetry is allowed; spacing can look varied but must follow 8pt logic
- Prioritize breathing space over density; avoid clutter and excessive alignment changes

## Illustration (when applicable)

- Background: `#191919`
- Small elements: `#FFFFFF` with `2px #191919` border
- Text on dark: only on light surfaces. Consistent stroke thickness; no extra color styles.
- Style: “controlled chaos”—precise details, no additional colors.

## Green shape (brand element)

Represents speed, proactivity, adaptability. Use as an active, dynamic element in composition or motion; not purely decorative.

## Do / Do not

**Do:**

- Use 8pt spacing grid
- Use only the defined palette
- Use the defined easing curve
- Follow typography scale
- Keep layouts breathing

**Do not:**

- Add random font sizes
- Add new colors
- Use linear easing
- Overcrowd layouts
- Break the spacing system

## Full spec

For the complete developer spec (case study structure, implementation constraints, emotional direction), see [reference.md](reference.md).
