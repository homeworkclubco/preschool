# Preschool

A minimal, extensible CSS framework and web component library.

## Philosophy

Preschool is a barebones starter framework meant to be extended and customized for your specific needs. It provides:

- Minimal, unopinionated styles
- Only the bare essentials
- Flexibility and hackability over completeness
- A solid foundation to build upon

## Features

- **CSS-only components** for simple presentational elements (buttons, cards)
- **Web components** for interactive elements (framework-agnostic)
- **Scroll animations** - modern AOS implementation using IntersectionObserver
- **Flexible theme system** using `data-color-scheme` attributes (light, dark, accent, etc.)
- **Scoped theming** - apply themes globally or to individual sections/components
- **Fluid spacing** using the Utopia methodology
- **Performant animations** - hardware-accelerated CSS transforms with IntersectionObserver

## Installation

```bash
npm install preschool
```

## Usage

### Import everything

```js
import 'preschool'
import 'preschool/styles'
```

### Import AOS only (scroll animations)

If you only need the scroll animations without the full framework:

```js
import 'preschool/aos'
import 'preschool/aos.css'
```

### Import selectively

```js
import 'preschool/styles/tokens.css'
import 'preschool/styles/utilities.css'
import 'preschool/styles/components/button.css'
```

### Theming

Apply color schemes globally or to specific sections:

```html
<!-- Global color scheme -->
<html data-color-scheme="light">
  ...
</html>

<!-- Section-level theming -->
<section data-color-scheme="dark">
  <!-- This section uses dark theme -->
</section>

<section data-color-scheme="accent">
  <!-- This section uses accent theme -->
</section>
```

### Scroll Animations

Preschool includes a modern implementation of scroll animations using the IntersectionObserver API for performant, hardware-accelerated animations.

**How it works:**
- Uses **IntersectionObserver** to detect when elements enter/exit the viewport
- Applies CSS classes (`aos-animate`) to trigger **hardware-accelerated CSS transforms**
- Supports **ResizeObserver** to handle dynamic content and responsive layouts
- Automatically recalculates positions when new elements are added (via MutationObserver)
- Zero dependencies - just native browser APIs

#### Basic Usage

Add the `data-aos` attribute to any element:

```html
<div data-aos="fade-up">
  This will fade in from below as you scroll
</div>

<div data-aos="zoom-in" data-aos-duration="1000">
  This will zoom in over 1 second
</div>
```

#### Available Animations

**Fade:** `fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right`, `fade-up-right`, `fade-up-left`, `fade-down-right`, `fade-down-left`

**Zoom:** `zoom-in`, `zoom-in-up`, `zoom-in-down`, `zoom-in-left`, `zoom-in-right`, `zoom-out`, `zoom-out-up`, `zoom-out-down`, `zoom-out-left`, `zoom-out-right`

**Slide:** `slide-up`, `slide-down`, `slide-left`, `slide-right`

**Flip:** `flip-up`, `flip-down`, `flip-left`, `flip-right`

#### Per-Element Configuration Attributes

Animation timing and behavior can be customized per-element using HTML `data-aos-*` attributes. These are handled by CSS, not JavaScript:

- `data-aos` - Animation type (required) - see Available Animations above
- `data-aos-duration` - Animation duration in ms (50-1000, steps of 50)
- `data-aos-delay` - Animation delay in ms (50-3000, steps of 50+)
- `data-aos-easing` - Easing function (e.g., `ease`, `ease-in-out`, `ease-in-back`)
- `data-aos-once` - Animate only once (`true`/`false`) - overrides global setting
- `data-aos-root-margin` - Custom trigger point for this element (CSS margin syntax)
- `data-aos-threshold` - Custom intersection threshold for this element (0-1)
- `data-aos-id` - Optional ID for debugging/tracking

#### Example with Per-Element Configuration

```html
<div
  data-aos="fade-up"
  data-aos-duration="800"
  data-aos-delay="200"
  data-aos-easing="ease-in-out"
  data-aos-once="true"
>
  This element animates with custom timing
</div>

<div
  data-aos="zoom-in"
  data-aos-root-margin="0px 0px -30% 0px"
>
  This triggers when 30% from bottom of viewport
</div>
```

#### Global Configuration Options

You can configure AOS globally with these JavaScript options:

```js
import AOS from 'preschool/aos'

AOS.init({
  // IntersectionObserver options
  rootMargin: '0px 0px -20% 0px',  // When to trigger (CSS margin syntax)
  threshold: 0,                     // Intersection threshold (0-1)

  // Behavior options
  once: true,                       // Animate only once (true/false)

  // Class names
  animatedClassName: 'aos-animate', // Class added when animated
  initClassName: 'aos-init',        // Class added on initialization

  // Advanced options
  startEvent: 'DOMContentLoaded',   // When to start observing
  useClassNames: false,             // Use data-aos value as class name
  disableMutationObserver: false,   // Disable auto-detection of new elements
})
```

**Note:** Animation properties like `duration`, `delay`, and `easing` are set via HTML `data-aos-*` attributes, not JavaScript options. These are handled purely by CSS.

#### Programmatic Control

AOS provides methods for manual control:

```js
import AOS from 'preschool/aos'

// Refresh AOS (recalculate element positions)
AOS.refresh()

// Disable all animations
AOS.disable()

// Get current state
const state = AOS.getState()
console.log(state) // { initialized: true, elementCount: 10, ... }

// Get all AOS elements
const elements = AOS.getElements()
```

#### WordPress/Non-Bundled Usage

For WordPress or direct browser usage, include the UMD build:

**Full Framework:**

```html
<!-- Include CSS -->
<link rel="stylesheet" href="path/to/preschool/dist/style.css">

<!-- Include JS -->
<script src="path/to/preschool/dist/preschool.umd.cjs"></script>

<!-- AOS is auto-initialized -->
```

**AOS Only (scroll animations):**

If you only need scroll animations without the full framework:

```html
<!-- Include AOS CSS -->
<link rel="stylesheet" href="path/to/preschool/dist/aos.css">

<!-- Include AOS JS -->
<script src="path/to/preschool/dist/aos.umd.cjs"></script>

<!-- AOS is auto-initialized and available via window.PreschoolAOS -->
<script>
  // Optional: Reconfigure AOS with global options
  window.PreschoolAOS.init({
    rootMargin: '0px 0px -20% 0px',
    once: true
  })

  // Or refresh manually
  window.PreschoolAOS.refresh()

  // Note: duration, delay, easing are set via data-aos-* HTML attributes, not JS options
</script>
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Start documentation site
npm run docs:dev
```

## Documentation

See the [full documentation](./docs) for detailed guides on:

- Getting started
- Theming and customization
- Component usage
- Extending the framework

## License

MIT
