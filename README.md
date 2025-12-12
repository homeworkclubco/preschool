# Preschool

A minimal, extensible CSS framework and web component library.

# A WARNING

This is very early and a complete mess. Don't use it yet.

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

Preschool is built as an npm package that you can import into any JavaScript/TypeScript project (React, Vue, vanilla JS, WordPress themes with build tools, etc.).

### Basic Import (Everything)

Import the entire framework - all CSS and web components:

```js
import 'preschool';
```

This gives you:

- ✅ All CSS styles (tokens, utilities, components, animations)
- ✅ All web components (Dropdown, Accordion, AccordionItem)
- ✅ Programmatic access to components

### Import Components Selectively

Import just the components you need:

```js
import { AOS, Dropdown, HcAccordion, HcAccordionItem } from 'preschool';

// Initialize AOS with custom options
AOS.init({
    rootMargin: '0px 0px -20% 0px',
    once: true,
});

// Components are automatically registered as custom elements
// Now you can use them in your HTML:
// <hc-dropdown>, <hc-accordion>, <hc-accordion-item>
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
<div data-aos="fade-up">This will fade in from below as you scroll</div>

<div data-aos="zoom-in" data-aos-duration="1000">This will zoom in over 1 second</div>
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
<div data-aos="fade-up" data-aos-duration="800" data-aos-delay="200" data-aos-easing="ease-in-out" data-aos-once="true">
    This element animates with custom timing
</div>

<div data-aos="zoom-in" data-aos-root-margin="0px 0px -30% 0px">This triggers when 30% from bottom of viewport</div>
```

#### Global Configuration Options

You can configure AOS globally with these JavaScript options:

```js
import AOS from 'preschool/aos';

AOS.init({
    // IntersectionObserver options
    rootMargin: '0px 0px -20% 0px', // When to trigger (CSS margin syntax)
    threshold: 0, // Intersection threshold (0-1)

    // Behavior options
    once: true, // Animate only once (true/false)

    // Class names
    animatedClassName: 'aos-animate', // Class added when animated
    initClassName: 'aos-init', // Class added on initialization

    // Advanced options
    startEvent: 'DOMContentLoaded', // When to start observing
    useClassNames: false, // Use data-aos value as class name
    disableMutationObserver: false, // Disable auto-detection of new elements
});
```

**Note:** Animation properties like `duration`, `delay`, and `easing` are set via HTML `data-aos-*` attributes, not JavaScript options. These are handled purely by CSS.

#### Programmatic Control

AOS provides methods for manual control:

```js
import AOS from 'preschool/aos';

// Refresh AOS (recalculate element positions)
AOS.refresh();

// Disable all animations
AOS.disable();

// Get current state
const state = AOS.getState();
console.log(state); // { initialized: true, elementCount: 10, ... }

// Get all AOS elements
const elements = AOS.getElements();
```

### WordPress Theme Usage (with Build Tools)

If you're using a modern WordPress theme setup with Webpack/Vite/Parcel:

**Install the package:**

```bash
npm install preschool
```

**In your theme's main JS file (e.g., `src/index.js`):**

```js
import 'preschool';

// Your CSS is now included, and web components are registered
// Use <hc-dropdown>, <hc-accordion>, etc. in your PHP templates
```

**In your theme's PHP template:**

```php
<div data-aos="fade-up">
  <h2>Animated Heading</h2>
</div>

<hc-accordion>
  <hc-accordion-item label="FAQ Item 1">
    <p>Answer content here</p>
  </hc-accordion-item>
</hc-accordion>
```

### WordPress (without Build Tools)

If you're not using a bundler, copy the built files from `node_modules/preschool/dist/` to your theme and enqueue them:

**In your `functions.php`:**

```php
function enqueue_preschool() {
  // Enqueue CSS
  wp_enqueue_style(
    'preschool',
    get_template_directory_uri() . '/assets/preschool.css'
  );

  // Enqueue JS (module format for modern browsers)
  wp_enqueue_script(
    'preschool',
    get_template_directory_uri() . '/assets/preschool.js',
    array(),
    null,
    true
  );

  // Add type="module" attribute
  add_filter('script_loader_tag', function($tag, $handle) {
    if ($handle === 'preschool') {
      return str_replace('<script', '<script type="module"', $tag);
    }
    return $tag;
  }, 10, 2);
}
add_action('wp_enqueue_scripts', 'enqueue_preschool');
```

## Development

This project uses **Parcel** for building and bundling. We maintain two separate configurations:

- **Development** - Uses default Parcel config for serving `index.html`
- **Library builds** - Uses library bundler for npm package distribution

### Setup

```bash
# Install dependencies
npm install

# Clear Parcel cache (recommended after pulling changes)
rm -rf .parcel-cache
```

### Development Workflows

**Quick Component Testing:**

```bash
npm run dev
```

Serves `index.html` at http://localhost:1234 with hot module reload. Perfect for rapid prototyping and testing components in isolation.

**Documentation Development:**

```bash
# Terminal 1: Watch and rebuild on changes
npm run watch

# Terminal 2: Run Astro docs site
npm run docs:dev
```

This setup watches your source files, rebuilds to `dist/` on changes, and Astro hot-reloads the documentation site. The docs use iframes that import the built package for isolated component demos.

**Building for Distribution:**

```bash
npm run build
```

Builds the library package to `dist/` using the library bundler. Outputs:

- `dist/preschool.js` - Main entry (CommonJS)
- `dist/module.js` - ES Module entry
- `dist/preschool.*.css` - Bundled styles
- `dist/types.d.ts` - TypeScript type definitions

### Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Code Formatting

```bash
# Format all files
npm run format

# Check formatting without changes
npm run format:check
```

## How Framework Distribution Works

If you're new to building frameworks, here's how this package gets from your code to users' projects:

### 1. Source Code (`/src`)

Your framework's source code lives in `/src`:

- `src/index.ts` - Main entry point that imports everything
- `src/styles/` - CSS source files with PostCSS features
- `src/components/` - Web component TypeScript/Lit code
- `src/utilities/` - Utilities like AOS

### 2. Build Process (`npm run build`)

When you run `npm run build`, Parcel:

1. Reads `src/index.ts` as the entry point (defined in `package.json` → `"source"`)
2. Bundles all imports (CSS, TypeScript, dependencies)
3. Processes CSS through PostCSS plugins (nesting, custom media, etc.)
4. Compiles TypeScript to JavaScript
5. Generates multiple output formats in `dist/`:
    - **CommonJS** (`preschool.js`) - For Node.js and older bundlers
    - **ES Modules** (`module.js`) - For modern bundlers and browsers
    - **CSS** (`preschool.*.css`) - All styles bundled into one file
    - **TypeScript types** (`types.d.ts`) - For TypeScript projects

### 3. Package Publishing

When you publish to npm (`npm publish`):

- Only the `dist/` folder gets published (defined in `package.json` → `"files"`)
- Your `package.json` tells bundlers which files to use:
    - `"main": "dist/preschool.js"` - Default entry for require()
    - `"module": "dist/module.js"` - Entry for ESM imports
    - `"types": "dist/types.d.ts"` - TypeScript definitions

### 4. User Installation

When someone runs `npm install preschool`:

1. npm downloads your `dist/` folder to their `node_modules/preschool/`
2. Their bundler reads your `package.json` to find entry points
3. When they write `import 'preschool'`, their bundler:
    - Uses `module` entry for modern builds (preferred)
    - Uses `main` entry for CommonJS builds
    - Automatically includes the CSS file
    - Gets TypeScript types from `types` entry

### 5. What Gets Included

When a user imports your framework:

- **`import 'preschool'`** → Pulls in everything from `src/index.ts`:
    - All CSS (automatically bundled)
    - All web component registrations (Dropdown, Accordion, etc.)
    - All exports (AOS, Dropdown, HcAccordion, etc.)

This is why in your `src/index.ts`:

```typescript
import './styles/index.css';  // ← Ensures CSS is included
import './components/dropdown/dropdown.ts';  // ← Registers <hc-dropdown>

export { AOS, Dropdown, ... };  // ← Makes them importable
```

Everything imported at the top level gets bundled into the package, and everything exported becomes available to users via named imports!

## Documentation

See the [full documentation](./docs) for detailed guides on:

- Getting started
- Theming and customization
- Component usage
- Extending the framework

## License

MIT
