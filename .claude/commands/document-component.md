---
description: Generate documentation for a CSS component (buttons, dropdowns, etc.)
---

You are creating documentation for a Preschool CSS component.

## Task
Generate comprehensive documentation for a CSS component file.

## Input Format
The user will provide either:
1. A file path to a CSS component file (e.g., `src/styles/components/button.css`)
2. Just the component name (e.g., "button"), and you'll look for it in `src/styles/components/`

## Steps

1. **Read the CSS file** - Analyze the component structure:
   - Check for header comments that describe the component
   - Identify if it's BEM-style (`.btn`, `.btn--primary`) or utility-style
   - Find all modifiers, variants, and states
   - Extract custom properties and their defaults
   - Look for special comments that provide context (e.g., `/* For icon buttons */`)

2. **Determine component type** to tailor examples:
   - **Interactive** (dropdown, modal, tabs): Show state changes, JS requirements
   - **Form elements** (button, input): Show variants, sizes, states (hover, focus, disabled)
   - **Simple** (badge, card): Show variants and composition examples

3. **Generate MDX documentation** at `/Users/kurt/Websites/framework/preschool/docs/src/content/docs/components/{component-name}.mdx`:

### Required Sections:
- **Frontmatter** (title, description)
- **Import**: `import Iframe from '../../../components/Iframe.astro';`
- **Overview** - What it is and when to use it
- **Basic Usage** - Simplest implementation with demo
- **Variants** - Different styles (primary, secondary, outline, etc.)
- **Sizes** - If applicable (sm, md, lg)
- **States** - Interactive states (hover, focus, active, disabled)
- **Customization** - CSS custom properties with examples
- **Accessibility** - ARIA attributes, keyboard support, semantic HTML

### Optional Sections (when relevant):
- **Icons** - If the component supports icons
- **Loading States** - For buttons/interactive elements
- **Composition** - How to combine with other components
- **JavaScript** - If interactivity requires JS (link to utility docs)
- **Best Practices** - Common patterns and anti-patterns

4. **Example Format for Components**:

```html
<!-- Show progression: basic → with modifiers → complete example -->

<!-- Basic -->
<button class="btn">Button</button>

<!-- With modifiers -->
<button class="btn btn--primary btn--lg">Large Primary</button>

<!-- Complete example -->
<button class="btn btn--primary" aria-label="Save changes">
  <svg>...</svg>
  Save
</button>
```

5. **Iframe Demo Style**:
   - Use flex/grid layouts to show multiple variants side-by-side
   - Show interactive states visually when possible
   - Include realistic content (not just "Button" but "Save Changes", "Cancel", etc.)

6. **Extract info from CSS comments**:
   - Look for `/* Description */` above classes for usage notes
   - Find `/* @example */` comments for suggested HTML
   - Check for `/* @note */` or `/* Important: */` for special considerations
   - Use `/* Variants */`, `/* Sizes */`, etc. as section hints

7. **Color scheme awareness**:
   - If component uses `[data-color-scheme]`, include theming section
   - Show how to use with light/dark modes
   - Reference color tokens being used

## Example Output Structure

```mdx
---
title: Button
description: CSS-only button component with variants and sizes
---

import Iframe from '../../../components/Iframe.astro';

Description of what the button component does...

## Basic Usage

```html
<button class="btn">Click me</button>
```

<Iframe>
  <button class="btn">Click me</button>
</Iframe>

## Variants

### Primary
For main actions...

### Secondary
For secondary actions...

<Iframe>
  <div class="flex gap-md">
    <button class="btn btn--primary">Primary</button>
    <button class="btn btn--secondary">Secondary</button>
  </div>
</Iframe>

## Sizes
[Show all sizes with examples]

## States

### Disabled
```html
<button class="btn" disabled>Disabled</button>
```

### Loading
[If applicable]

## Icons
[If the component commonly uses icons]

## Customization

```css
.btn {
  --button-bg-color: #custom;
  --button-padding: 1rem 2rem;
}
```

Or create custom variants:

```css
.btn--danger {
  --button-bg-color: var(--color-red-600);
}
```

## Accessibility

- Use semantic `<button>` elements
- Include `aria-label` for icon-only buttons
- Ensure sufficient color contrast
- Keyboard accessible (Tab, Enter, Space)

[Add specific ARIA attributes needed]

## Best Practices

- Use primary variant sparingly (one per view)
- Prefer semantic elements over `<div>` with role
- Include loading states for async actions
```

## Special Handling

### For TypeScript/JS components:
- Note that JS is required
- Link to relevant utility documentation (e.g., dropdown.ts)
- Show data attributes needed for JS to work

### For form components:
- Show proper label associations
- Include validation state examples
- Demonstrate error messages

### For layout-like components (card, panel):
- Show composition examples
- Demonstrate with realistic content
- Include responsive behavior

## Output
After creating documentation:
1. State the file path
2. Summarize key features documented
3. Note if JS/utilities are required
4. Remind that it auto-appears in "Components" section

Be concise and practical - users want quick reference, not essays.
