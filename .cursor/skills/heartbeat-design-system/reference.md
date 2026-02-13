# Heartbeat Design System — Developer Spec (Reference)

Version: 1.0

## Core principle

Design is based on simplicity.

**Emotional direction:** Lightness, Freedom, Ease

**System characteristics:**

- Limited styles
- Intentional spacing
- Minimal color usage
- Motion with natural easing
- Structured storytelling

---

## Spacing system

**Base unit:** 8px

**Allowed values:** 8 / 16 / 24 / 32 / 40 / 48 / 56 / 64 / ... (8×n)

**Exception:** 4px may be used only when strictly necessary.

**Rules:**

- Unrelated elements must have large separation.
- Larger components require larger surrounding space.
- Layouts must breathe.
- White space is structural, not decorative.

**Example:**
```css
padding: 16px;
margin-bottom: 32px;
gap: 24px;
```

---

## Color system

**Color proportions:**

- 80% White `#FFFFFF`
- 10% Brand/Black `#191919`
- 10% Black `#191919`
- 1% CTA `#FF8C5F`

**Primary background:** `#FFFFFF`  
**Primary text:** `#191919`  
**CTA color:** `#FF8C5F` (used sparingly and only for actions)

**Rules:**

- Maintain approximate 80/10/10 balance.
- CTA must be visually distinct.
- No decorative color usage.
- Avoid introducing new colors.

---

## Typography

**Line length:** 40–60 characters per line (optimal readability)

**Rules:**

- Use predefined font scale from design guide.
- Do not introduce arbitrary font sizes.
- Provide generous spacing between paragraphs.
- Avoid dense text blocks.

**Paragraph spacing:** Minimum 16px. Recommended 24px or 32px.

---

## Motion system

**Principle:** Nothing moves linearly in nature. All animations must use easing.

**Default easing:** `cubic-bezier(0.77, 0, 0.175, 1)`

**Example:**
```css
transition: all 1s cubic-bezier(0.77, 0, 0.175, 1);
```

**Guidelines:**

- Motion should feel organic.
- Avoid linear animations.
- Avoid abrupt stops.
- Movement should feel physically believable.
- Prefer subtle anticipation and smooth deceleration.

---

## Layout principles

- Unlimited elements allowed.
- Limited styles enforced.
- Structured asymmetry is allowed.
- Spacing may appear chaotic but follows 8pt logic.
- Composition must feel intentional.

**Rules:**

- Avoid visual clutter.
- Avoid excessive alignment variations.
- Prioritize breathing space over density.

---

## Illustration rules

**Visual style:** “Controlled chaos”

- **Background:** `#191919`
- **Small background elements:** `#FFFFFF` with 2px `#191919` border
- **Text on dark background:** `#191919` on light surfaces only

**Rules:**

- Illustrations may look chaotic at first glance.
- Details must be precise.
- Do not introduce additional color styles.
- Maintain consistent stroke thickness.

---

## Brand element — Green shape

The green shape represents: Speed, Proactivity, Adaptability.

**Behavior:**

- Active element in compositions.
- May drive motion interactions.
- Should not be purely decorative.
- Must feel dynamic and responsive.

---

## Case study structure

- Content + imagery must complement each other.

**Guidelines:**

- Use storytelling.
- Pair text and visuals meaningfully.
- Maintain spacing logic.
- Detail-oriented execution.
- Keep style system consistent.

---

## Implementation constraints

**DO:**

- Use 8pt spacing grid.
- Use defined color palette only.
- Use defined easing curve.
- Follow typography scale.
- Maintain breathing layouts.

**DO NOT:**

- Add random font sizes.
- Add new colors.
- Use linear easing.
- Overcrowd layouts.
- Break spacing system arbitrarily.
