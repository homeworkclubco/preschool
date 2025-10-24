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
- **Flexible theme system** using `data-color-scheme` attributes (light, dark, accent, etc.)
- **Scoped theming** - apply themes globally or to individual sections/components
- **Fluid spacing** using the Utopia methodology
- **Zero dependencies** for web components (vanilla JS)

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
