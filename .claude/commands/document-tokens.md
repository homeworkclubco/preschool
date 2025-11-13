---
description: Generate documentation for CSS design tokens (colors, spacing, typography, etc.)
---

You are creating documentation for Preschool CSS design tokens.

## Task

Generate comprehensive documentation for a CSS tokens file that shows the available values, usage examples, and visual representations.

## Input Format

The user will provide either:

1. A file path to a tokens file (e.g., `src/styles/tokens/colors.css`)
2. Just the token category (e.g., "colors", "spacing"), and you'll look for it in `src/styles/tokens/`

## Steps

1. **Read the CSS file** and identify:
    - All custom property definitions
    - Token scales and patterns (e.g., `--space-xs` through `--space-xl`)
    - Semantic vs primitive tokens
    - Any comments explaining usage or relationships

2. **Determine token type** to customize documentation:
    - **Colors**: Show swatches, contrast ratios, usage guidelines
    - **Spacing**: Show size comparisons, common use cases
    - **Typography**: Show font samples, hierarchy, size scales
    - **Radius/Shadows**: Show visual examples of each value
    - **Z-index**: Show layering hierarchy
    - **Transitions/Animations**: Show timing and easing examples

3. **Generate MDX documentation** at `/Users/kurt/Websites/framework/preschool/docs/src/content/docs/tokens/{token-name}.mdx`:

### Required Sections:

- **Frontmatter** (title, description)
- **Import**: `import Iframe from '../../../components/Iframe.astro';`
- **Overview** - What these tokens control
- **Available Tokens** - Complete list with visual examples
- **Usage** - How to use in CSS
- **Guidelines** - When to use which values
- **Customization** - How to override or extend

## Token-Specific Formats

### Color Tokens

````mdx
## Color Palette

### Primary Colors

<Iframe>
  <div class="flex gap-sm">
    <div style="width: 4rem; height: 4rem; background: var(--color-primary-500); border-radius: 0.5rem;">
      <span style="color: white; padding: 0.5rem;">500</span>
    </div>
    <!-- More swatches -->
  </div>
</Iframe>

| Token                 | Value     | Usage                  |
| --------------------- | --------- | ---------------------- |
| `--color-primary-500` | `#3b82f6` | Primary actions, links |
| `--color-primary-600` | `#2563eb` | Hover states           |

## Usage

```css
.btn--primary {
    background: var(--color-primary-500);
    color: var(--color-white);
}

.link {
    color: var(--color-primary-600);
}
```
````

## Semantic Tokens

Use semantic tokens for consistency:

```css
--color-action: var(--color-primary-600);
--color-success: var(--color-green-600);
--color-error: var(--color-red-600);
```

## Accessibility

- Ensure 4.5:1 contrast ratio for text
- Test color combinations with contrast checkers
- Don't rely on color alone to convey information

````

### Spacing Tokens

```mdx
## Spacing Scale

<Iframe>
  <div class="stack">
    <div style="background: var(--color-gray-200); height: var(--space-xs); width: 100%;"></div>
    <div>--space-xs: {value}</div>

    <div style="background: var(--color-gray-200); height: var(--space-sm); width: 100%;"></div>
    <div>--space-sm: {value}</div>

    <!-- Show all spacing values -->
  </div>
</Iframe>

## Common Use Cases

### Component Spacing
```css
.card {
  padding: var(--space-md);
  gap: var(--space-sm);
}
````

### Layout Spacing

```css
.section {
    margin-block: var(--space-xl);
    padding-inline: var(--space-lg);
}
```

## Responsive Spacing

Some tokens are responsive (fluid):

```css
--space-md-lg: clamp(1rem, 2vw, 1.5rem);
```

Use these for:

- Container padding
- Section spacing
- Adaptive layouts

````

### Typography Tokens

```mdx
## Type Scale

<Iframe>
  <div class="stack space-md">
    <div style="font-size: var(--font-size-xs);">XS: The quick brown fox (--font-size-xs)</div>
    <div style="font-size: var(--font-size-sm);">SM: The quick brown fox (--font-size-sm)</div>
    <div style="font-size: var(--font-size-md);">MD: The quick brown fox (--font-size-md)</div>
    <!-- More sizes -->
  </div>
</Iframe>

## Font Families

```css
--font-sans: system-ui, -apple-system, sans-serif;
--font-serif: Georgia, Cambria, serif;
--font-mono: 'SF Mono', Consolas, monospace;
````

## Font Weights

| Token                    | Value | Usage           |
| ------------------------ | ----- | --------------- |
| `--font-weight-normal`   | 400   | Body text       |
| `--font-weight-medium`   | 500   | Emphasis        |
| `--font-weight-semibold` | 600   | Headings        |
| `--font-weight-bold`     | 700   | Strong emphasis |

## Line Heights

```css
--line-height-tight: 1.25; /* Headings */
--line-height-normal: 1.5; /* Body text */
--line-height-relaxed: 1.75; /* Long-form content */
```

## Usage Example

```css
h1 {
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
}

p {
    font-size: var(--font-size-md);
    line-height: var(--line-height-normal);
}
```

````

### Border Radius Tokens

```mdx
## Border Radius Scale

<Iframe>
  <div class="flex gap-md">
    <div style="width: 4rem; height: 4rem; background: var(--color-gray-300); border-radius: var(--radius-sm);"></div>
    <div>--radius-sm</div>
    <!-- More examples -->
  </div>
</Iframe>

## Usage

```css
.card {
  border-radius: var(--radius-lg);
}

.btn {
  border-radius: var(--radius-md);
}

.badge {
  border-radius: var(--radius-full); /* Pill shape */
}
````

````

## Visual Table Generator

For tokens that are hard to visualize, create tables:

```mdx
| Token | Value | Visual | Usage |
|-------|-------|--------|-------|
| `--space-xs` | `0.25rem` | [8px bar] | Tight spacing |
| `--space-sm` | `0.5rem` | [16px bar] | Related items |
````

## Extraction Logic

1. **Parse all `--token-name: value;` declarations**
2. **Group by prefix** (e.g., all `--color-*`, all `--space-*`)
3. **Detect scales** (xs, sm, md, lg, xl, or numeric 100-900)
4. **Find semantic aliases** (tokens that reference other tokens)
5. **Extract comments** for usage notes

## Comment Patterns to Look For

```css
/* Primary brand color */
--color-primary: #3b82f6;

/* @usage Buttons, links, primary actions */
--color-action: var(--color-primary);

/* Responsive spacing - grows with viewport */
--space-fluid: clamp(1rem, 3vw, 2rem);
```

## Output Format

After creating documentation:

1. State the file path
2. List token count and scale ranges
3. Note any semantic/alias tokens
4. Mention if tokens are responsive/fluid
5. Remind that it auto-appears in "Tokens" or "Design Tokens" section

Keep it visual and practical - designers and developers should quickly understand available options.
