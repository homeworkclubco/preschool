---
title: Customization
description: Learn how to extend and customize Preschool for your project
---

Preschool is designed to be extended. Here's how to make it your own.

## Customizing Design Tokens

Override CSS variables in your own stylesheet:

```css
:root {
  /* Adjust spacing scale */
  --space-md: clamp(1.5rem, 1.37rem + 0.65vw, 2rem);

  /* Change typography */
  --font-family: "Inter", system-ui, sans-serif;
  --font-size: 1.125rem;

  /* Modify border radius */
  --radius-md: 0.75rem;

  /* Update shadows */
  --shadow-md: 0 8px 16px rgba(0, 0, 0, 0.1);
}
```

## Adding Fluid Spacing Values

Follow the [Utopia](https://utopia.fyi) methodology to generate new fluid space values:

```css
:root {
  /* Add new sizes */
  --space-3xl: clamp(6rem, 5.48rem + 2.61vw, 7.5rem);
  --space-4xl: clamp(8rem, 7.3rem + 3.48vw, 10rem);
}
```

## Creating New Components

Build new CSS components following the same pattern:

```css
/* src/styles/components/badge.css */

.badge {
  display: inline-flex;
  padding: var(--space-3xs) var(--space-xs);
  font-size: var(--font-size-sm);
  font-weight: 500;
  border-radius: var(--radius-full);
  background-color: var(--color-bg-alt);
  border: 1px solid var(--color-border);
}

.badge[data-variant="primary"] {
  background-color: var(--color-primary);
  color: var(--color-primary-text);
  border-color: transparent;
}
```

Then import it:

```js
import "./styles/components/badge.css";
```

## Adding Utility Classes

Extend the utility system:

```css
/* In your project CSS */

/* New spacing utilities */
.p-xl {
  padding: var(--space-xl);
}
.gap-xl {
  gap: var(--space-xl);
}

/* New layout utilities */
.container {
  max-width: 80rem;
  margin-inline: auto;
  padding-inline: var(--space-md);
}

/* New text utilities */
.text-xl {
  font-size: var(--font-size-xl);
}
.text-bold {
  font-weight: 700;
}
```

## Creating Web Components

Build new Lit components:

```js
// src/components/tooltip.js
import { LitElement, html, css } from "lit";

export class Tooltip extends LitElement {
  static properties = {
    text: { type: String },
  };

  static styles = css`
    :host {
      position: relative;
      display: inline-block;
    }
    /* Add your styles */
  `;

  render() {
    return html`
      <slot></slot>
      <div class="tooltip-content">${this.text}</div>
    `;
  }
}

customElements.define("ps-tooltip", Tooltip);
```

## Forking the Framework

For major customizations, fork Preschool:

1. Clone or copy the source
2. Modify `src/styles/tokens.css` with your design system
3. Add/remove components as needed
4. Build with `npm run build`

This approach gives you full control while maintaining the base structure.

## Best Practices

- **Override, don't replace** - Use CSS custom properties to modify values
- **Follow patterns** - Match existing naming and structure conventions
- **Stay minimal** - Only add what you actually need
- **Document changes** - Keep track of customizations for your team
- **Test thoroughly** - Verify changes across all color schemes
