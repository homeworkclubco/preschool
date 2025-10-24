---
title: Installation
description: How to install and use Preschool in your project
---

## NPM Installation

```bash
npm install preschool
```

## Usage

### Import Everything

The simplest way to get started:

```js
import 'preschool'
import 'preschool/styles'
```

This imports all styles and registers all web components.

### Selective Imports

For more control, import only what you need:

```js
// Just the design tokens
import 'preschool/styles/tokens.css'

// Specific components
import 'preschool/styles/components/button.css'
import { Dropdown } from 'preschool'
```

## CDN Usage

For quick prototyping, use a CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/preschool/dist/style.css">
<script type="module" src="https://unpkg.com/preschool"></script>
```

## HTML Setup

Add the color scheme attribute to your HTML:

```html
<!DOCTYPE html>
<html lang="en" data-color-scheme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
</head>
<body>
  <!-- Your content -->
</body>
</html>
```

## Framework Integration

### Vue

```js
// main.js
import 'preschool'
import 'preschool/styles'
```

Web components work automatically in Vue templates.

### React

```js
// App.jsx
import 'preschool'
import 'preschool/styles'
```

Use web components with JSX:

```jsx
<ps-dropdown>
  <button slot="trigger">Menu</button>
  <div slot="content">...</div>
</ps-dropdown>
```

### Astro

```astro
---
import 'preschool'
import 'preschool/styles'
---

<ps-dropdown>
  <button slot="trigger">Menu</button>
  <div slot="content">...</div>
</ps-dropdown>
```

## Next Steps

- [Learn about theming](/guides/theming)
- [Explore components](/components/button)
- [Customize the framework](/guides/customization)
