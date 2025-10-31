---
description: Generate documentation for CSS utility classes or JavaScript utilities
---

You are creating documentation for a Preschool utility (CSS or JavaScript).

## Task
Generate documentation for utility classes or JavaScript utility functions.

## Input Format
The user will provide either:
1. A file path (e.g., `src/styles/utilities.css` or `src/utilities/aos/aos.ts`)
2. Just the utility name (e.g., "aos", "flex"), and you'll search for it

## Steps

1. **Read the file** and determine type:
   - **CSS Utilities**: Classes like `.flex`, `.text-center`, `.sr-only`
   - **JavaScript Utilities**: Functions, classes, or modules
   - **Hybrid**: CSS classes that require JS initialization

2. **For CSS Utilities**:
   - Group by category (layout, typography, visibility, etc.)
   - Show all available classes
   - Provide use cases and examples
   - Note responsive variants if they exist

3. **For JavaScript Utilities**:
   - Explain what problem it solves
   - Show installation/import
   - Document API (functions, parameters, return values)
   - Provide complete working examples
   - Show common patterns

4. **Generate MDX documentation** at appropriate location:
   - CSS utilities: `/docs/src/content/docs/utilities/{name}.mdx`
   - JS utilities: `/docs/src/content/docs/utilities/{name}.mdx`

## CSS Utility Documentation Format

```mdx
---
title: Flex Utilities
description: Utility classes for flexbox layouts
---

import Iframe from '../../../components/Iframe.astro';

Quick flexbox utilities for common layout patterns.

## Available Classes

### Display
- `.flex` - `display: flex`
- `.inline-flex` - `display: inline-flex`

### Direction
- `.flex-row` - `flex-direction: row` (default)
- `.flex-col` - `flex-direction: column`
- `.flex-row-reverse` - `flex-direction: row-reverse`
- `.flex-col-reverse` - `flex-direction: column-reverse`

### Justify Content
- `.justify-start` - `justify-content: flex-start`
- `.justify-center` - `justify-content: center`
- `.justify-between` - `justify-content: space-between`
- `.justify-around` - `justify-content: space-around`

[Continue for all utilities...]

## Usage Examples

### Centered Content
```html
<div class="flex justify-center items-center">
  <p>Centered both ways</p>
</div>
```

### Responsive Navigation
```html
<nav class="flex flex-col md:flex-row justify-between">
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>
```

<Iframe>
  [Live demo of examples]
</Iframe>

## Common Patterns

### Card Layout
```html
<div class="flex flex-col gap-md">
  <div>Header</div>
  <div>Content</div>
  <div>Footer</div>
</div>
```

### Button Group
```html
<div class="flex gap-sm">
  <button>Cancel</button>
  <button>Save</button>
</div>
```

## Responsive Variants

If using breakpoint prefixes:
- `sm:flex` - Apply at small breakpoint
- `md:flex-row` - Apply at medium breakpoint
- `lg:justify-center` - Apply at large breakpoint
```

## JavaScript Utility Documentation Format

```mdx
---
title: AOS (Animate On Scroll)
description: Utility for triggering animations when elements enter the viewport
---

Animate elements as they scroll into view using Intersection Observer.

## Installation

```js
import { AOS } from '@preschool/utilities/aos';
```

## Basic Usage

```html
<div data-aos="fade-up">
  This will fade up when scrolled into view
</div>
```

```js
// Initialize AOS
const aos = new AOS();
```

## API Reference

### Constructor Options

```ts
interface AOSOptions {
  offset?: number;          // Offset from viewport (default: 0)
  duration?: number;        // Animation duration in ms (default: 400)
  easing?: string;          // CSS easing function (default: 'ease')
  once?: boolean;           // Animate only once (default: false)
  threshold?: number;       // Intersection threshold (default: 0)
}
```

### Methods

#### `init(options?: AOSOptions): void`
Initialize AOS with optional configuration.

```js
aos.init({
  offset: 100,
  duration: 600,
  once: true
});
```

#### `refresh(): void`
Recalculate element positions (useful after DOM changes).

```js
aos.refresh();
```

#### `destroy(): void`
Remove all observers and event listeners.

```js
aos.destroy();
```

## Available Animations

Set via `data-aos` attribute:

- `fade` - Fade in
- `fade-up` - Fade in from bottom
- `fade-down` - Fade in from top
- `fade-left` - Fade in from left
- `fade-right` - Fade in from right
- `slide-up` - Slide in from bottom
- `slide-down` - Slide in from top
- `zoom-in` - Scale up
- `zoom-out` - Scale down

## Custom Animation Options

Use data attributes to customize per element:

```html
<div
  data-aos="fade-up"
  data-aos-duration="800"
  data-aos-delay="200"
  data-aos-easing="ease-in-out"
>
  Custom animation
</div>
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="preschool/aos.css">
</head>
<body>
  <section>
    <h1 data-aos="fade-down">Welcome</h1>
    <p data-aos="fade-up" data-aos-delay="100">
      This paragraph fades up after the heading
    </p>
    <img
      src="hero.jpg"
      data-aos="zoom-in"
      data-aos-delay="200"
      alt="Hero image"
    >
  </section>

  <script type="module">
    import { AOS } from './preschool/utilities/aos.js';

    const aos = new AOS();
    aos.init({
      offset: 50,
      duration: 500,
      once: true
    });
  </script>
</body>
</html>
```

## Performance Considerations

- AOS uses Intersection Observer (efficient)
- Animations use CSS transforms (hardware accelerated)
- Call `refresh()` after dynamic content loads
- Use `once: true` for better performance on long pages

## Browser Support

- Modern browsers with Intersection Observer support
- Chrome 51+, Firefox 55+, Safari 12.1+, Edge 15+
- Consider polyfill for older browsers

## TypeScript Support

Full TypeScript definitions included:

```ts
import { AOS, type AOSOptions } from '@preschool/utilities/aos';

const options: AOSOptions = {
  duration: 600,
  once: true
};

const aos = new AOS();
aos.init(options);
```
```

## Documentation Detection Logic

1. **Check file extension**:
   - `.css` → CSS utility documentation
   - `.ts`, `.js` → JavaScript utility documentation

2. **For CSS files**:
   - Extract all class selectors
   - Group by prefix or pattern (e.g., `.flex-*`, `.text-*`)
   - Look for comments indicating categories

3. **For JS/TS files**:
   - Find exported functions, classes, types
   - Extract JSDoc comments for descriptions
   - Identify parameters and return types
   - Look for usage examples in comments

4. **Parse special comments**:
```css
/* @category Layout */
.flex { display: flex; }

/* @description Centers content */
.center { /* ... */ }
```

```ts
/**
 * Initialize AOS
 * @param options - Configuration options
 * @example
 * aos.init({ duration: 600 });
 */
```

## Output

After creating documentation:
1. State the file path
2. For CSS: Note number of utility classes documented
3. For JS: List main functions/classes exported
4. Mention any dependencies or requirements
5. Note if TypeScript types are available
6. Remind that it auto-appears in "Utilities" section

Keep it practical - users want to copy-paste and get working code quickly.
