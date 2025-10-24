---
title: Theming
description: Learn how to use and customize color schemes in Preschool
---

Preschool uses `data-color-scheme` attributes for flexible, scoped theming.

## Built-in Color Schemes

### Light (Default)

```html
<html data-color-scheme="light"></html>
```

### Dark

```html
<html data-color-scheme="dark"></html>
```

### Accent

```html
<html data-color-scheme="accent"></html>
```

## Scoped Theming

Apply different themes to different sections:

```html
<html data-color-scheme="light">
  <body>
    <!-- Uses light theme -->
    <header>...</header>

    <!-- This section uses dark theme -->
    <section data-color-scheme="dark">
      <h2>Dark Section</h2>
      <button class="btn">Button in dark theme</button>
    </section>

    <!-- This section uses accent theme -->
    <section data-color-scheme="accent">
      <h2>Accent Section</h2>
      <button class="btn">Button in accent theme</button>
    </section>

    <!-- Back to light theme -->
    <footer>...</footer>
  </body>
</html>
```

<div data-color-scheme="light" class="p-md" style="border: 1px solid var(--color-border); margin: 1rem 0;">
  <p>Light color scheme</p>
  <button class="btn">Example Button</button>
</div>

<div data-color-scheme="dark" class="p-md" style="border: 1px solid var(--color-border); margin: 1rem 0;">
  <p>Dark color scheme</p>
  <button class="btn">Example Button</button>
</div>

<div data-color-scheme="accent" class="p-md" style="border: 1px solid var(--color-border); margin: 1rem 0;">
  <p>Accent color scheme</p>
  <button class="btn">Example Button</button>
</div>

## Creating Custom Schemes

Add your own color schemes in your CSS:

```css
[data-color-scheme="brand"] {
  --color-bg: #1a1a2e;
  --color-bg-alt: #16213e;
  --color-border: #0f3460;

  --color-text: #edf5e1;
  --color-text-secondary: #8ac6d1;

  --color-primary: #e94560;
  --color-primary-hover: #ff6b6b;
  --color-primary-text: #ffffff;
}
```

Use it:

```html
<section data-color-scheme="brand">
  <h2>Custom Brand Theme</h2>
</section>
```

## Dynamic Theme Switching

Use JavaScript to switch themes dynamically:

```js
// Toggle between light and dark
const html = document.documentElement;
const currentScheme = html.getAttribute("data-color-scheme");
const newScheme = currentScheme === "light" ? "dark" : "light";
html.setAttribute("data-color-scheme", newScheme);
```

## Available CSS Variables

All color schemes should define these variables:

```css
--color-bg              /* Main background */
--color-bg-alt         /* Cards, elevated surfaces */
--color-border          /* Border color */
--color-text            /* Primary text */
--color-text-secondary      /* Secondary text */
--color-primary         /* Primary action color */
--color-primary-hover   /* Primary hover state */
--color-primary-text    /* Text on primary color */
```

## Tips

- Start with one of the built-in schemes as a template
- Keep contrast ratios accessible (WCAG AA minimum)
- Test all interactive elements in your custom scheme
- Use semantic naming for scheme names (e.g., `brand`, `high-contrast`)
