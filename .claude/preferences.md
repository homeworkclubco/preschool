# Project Coding Preferences

## Component Types & Styling Approach

### CSS-Only Components & Utilities

**For standard HTML elements with utility classes** (buttons, badges, layout primitives, etc.)

These are presentational classes applied to regular HTML elements like `<button>`, `<div>`, `<span>`.

✅ **Use BEM modifiers for variants:**

```css
/* Buttons */
.btn {
}
.btn--primary {
}
.btn--secondary {
}
.btn--large {
}

/* Layout utilities */
.stack {
}
.stack--space-sm {
}
.stack--space-xl {
}

/* Badges */
.badge {
}
.badge--success {
}
.badge--warning {
}
```

**Why BEM here?**

- These are static styling choices made at authoring time
- Simple, class-based variants that don't change during runtime
- Part of your design system's utility/component library
- Applied to standard HTML elements

---

### Web Components (Custom Elements)

**For interactive, JavaScript-powered custom elements** (`<hc-drawer>`, `<hc-dropdown>`, etc.)

These are behavioral components with dynamic state and interactions.

✅ **Use data attributes for state and runtime behavior:**

```css
/* State attributes (changes during interaction) */
hc-drawer[data-visible] {
}
hc-dropdown[data-open] {
}

/* Position/placement attributes (behavioral configuration) */
hc-drawer[data-position='left'] {
}
hc-drawer[data-position='right'] {
}

/* Internal element classes (no modifiers) */
:where(hc-drawer) .panel {
}
:where(hc-drawer) .header {
}
:where(hc-drawer) .overlay {
}
```

**Why data attributes here?**

- These represent runtime state controlled by JavaScript
- State changes during user interaction (open/closed, visible/hidden)
- Easier to query and manipulate with JavaScript
- Clearer separation between styling (classes) and behavior (data attributes)
- Better semantics in DevTools when debugging

---

## Quick Decision Guide

**Ask yourself:** _Is this a custom element (`<element-name>`) or a utility class (`.class-name`)?_

| If it's a...                                   | Use...          | Example                                         |
| ---------------------------------------------- | --------------- | ----------------------------------------------- |
| **Standard HTML element** with a utility class | BEM modifiers   | `.btn--primary`, `.card--featured`              |
| **Layout primitive** with spacing/config       | BEM modifiers   | `.stack--space-lg`, `.grid--cols-3`             |
| **Custom element** with runtime state          | Data attributes | `<hc-drawer data-visible data-position="left">` |
| **Custom element** internal structure          | Simple classes  | `.drawer-panel`, `.drawer-header`               |

---

## Web Component Guidelines

- Override `createRenderRoot()` to return `this`
- Store styles in external `.css` files alongside `.ts` files
- Reference: See `ps-share` and `hc-drawer` components

### Internal Element Class Names

**Default: Short names with `:where()` scoping**

```css
:where(hc-drawer) .panel {
}
:where(hc-drawer) .header {
}
:where(hc-drawer) .overlay {
}
```

**Benefits:** Clean HTML, zero specificity (easy overrides), no repetition

**Use component-prefixed names (`.drawer-panel`) only when:**

- You need higher specificity for complex overrides
- Element is frequently queried in JavaScript (use a js- prefix when needed. Do not use js- prefix for styling)
- Name is too generic and might cause confusion

### State & Behavior

- Component state → data attributes: `data-visible`, `data-open`, `data-loading`
- Position/placement → data attributes: `data-position="left"`, `data-align="center"`
- Visual variants → CSS custom properties: `--width: 30rem`, `--duration: 300ms`
