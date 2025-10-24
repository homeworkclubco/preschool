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
- **Scroll animations** - modern AOS replacement with Lenis smooth scrolling
- **Flexible theme system** using `data-color-scheme` attributes (light, dark, accent, etc.)
- **Scoped theming** - apply themes globally or to individual sections/components
- **Fluid spacing** using the Utopia methodology
- **Smooth scrolling** powered by Lenis for fluid, performant page navigation

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

Preschool includes a modern replacement for AOS (Animate On Scroll) powered by Lenis for smooth, performant scroll animations.

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

#### Configuration Attributes

- `data-aos` - Animation type (required)
- `data-aos-duration` - Animation duration in ms (50-3000, steps of 50)
- `data-aos-delay` - Animation delay in ms (50-3000, steps of 50)
- `data-aos-easing` - Easing function (e.g., `ease`, `ease-in-out`, `ease-in-back`)
- `data-aos-offset` - Offset from viewport in pixels (default: 120)
- `data-aos-once` - Animate only once (`true`/`false`)
- `data-aos-mirror` - Reverse animation when scrolling up (`true`/`false`)
- `data-aos-anchor-placement` - Trigger position (e.g., `top-bottom`, `center-center`)

#### Example with Configuration

```html
<div
  data-aos="fade-up"
  data-aos-duration="800"
  data-aos-delay="200"
  data-aos-easing="ease-in-out"
  data-aos-once="true"
>
  Content
</div>
```

#### Custom Configuration

You can configure AOS globally:

```js
import { initAOS } from 'preschool'

initAOS({
  duration: 600,
  easing: 'ease-out',
  once: true,
  offset: 100,
})
```

#### Access Lenis Instance

Lenis is available for custom scroll interactions:

```js
import { getLenis, scrollTo } from 'preschool'

// Get Lenis instance
const lenis = getLenis()

// Custom scroll event
lenis.on('scroll', (e) => {
  console.log('Scroll position:', e.animatedScroll)
})

// Smooth scroll to element
scrollTo('#target', { duration: 2 })
```

#### WordPress/Non-Bundled Usage

For WordPress or direct browser usage, include the UMD build:

```html
<!-- Include CSS -->
<link rel="stylesheet" href="path/to/preschool/dist/style.css">

<!-- Include JS -->
<script src="path/to/preschool/dist/preschool.umd.cjs"></script>

<!-- AOS is auto-initialized, Lenis is available via window.Preschool -->
<script>
  // Access Lenis
  const lenis = window.Preschool.getLenis()

  // Smooth scroll
  window.Preschool.scrollTo('#section', { duration: 1.5 })
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
