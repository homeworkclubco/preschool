# Accordion Components

Accessible, customizable accordion components built with TypeScript and Lit. Follows the [WAI-ARIA Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/).

## Components

- `<hc-accordion>` - Container for accordion items
- `<hc-accordion-item>` - Individual collapsible sections

## Features

- ✅ Full WAI-ARIA accessibility support
- ✅ Keyboard navigation (Arrow keys, Home, End)
- ✅ Single or multiple expand modes
- ✅ Smooth animations with Web Animations API
- ✅ Respects `prefers-reduced-motion`
- ✅ TypeScript support
- ✅ Customizable with CSS custom properties
- ✅ Framework-agnostic Web Components

## Basic Usage

### Single Expand Mode (Default)

Only one item can be expanded at a time:

```html
<hc-accordion>
  <hc-accordion-item label="Section 1">
    Content for section 1
  </hc-accordion-item>
  <hc-accordion-item label="Section 2" expanded>
    Content for section 2
  </hc-accordion-item>
  <hc-accordion-item label="Section 3">
    Content for section 3
  </hc-accordion-item>
</hc-accordion>
```

### Multiple Expand Mode

Allow multiple items to be expanded simultaneously:

```html
<hc-accordion allow-multiple>
  <hc-accordion-item label="Section 1" expanded>
    Content for section 1
  </hc-accordion-item>
  <hc-accordion-item label="Section 2" expanded>
    Content for section 2
  </hc-accordion-item>
</hc-accordion>
```

## hc-accordion API

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `allowMultiple` | `boolean` | `false` | Allow multiple items to be expanded simultaneously |

### Methods

| Method | Description |
|--------|-------------|
| `getItems()` | Returns all accordion items |
| `getEnabledItems()` | Returns all enabled (non-disabled) items |
| `expandAll()` | Expands all items (only works when `allowMultiple` is true) |
| `collapseAll()` | Collapses all expanded items |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `hc-before-expand` | `{ item: HcAccordionItem }` | Fired before an item expands (cancellable) |
| `hc-expand` | `{ item: HcAccordionItem }` | Fired when an item finishes expanding |
| `hc-before-collapse` | `{ item: HcAccordionItem }` | Fired before an item collapses (cancellable) |
| `hc-collapse` | `{ item: HcAccordionItem }` | Fired when an item finishes collapsing |

## hc-accordion-item API

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `expanded` | `boolean` | `false` | Whether the item is expanded |
| `label` | `string` | `''` | Text label for the accordion header |
| `disabled` | `boolean` | `false` | Disables the item (prevents interaction) |
| `headingLevel` | `number` | `3` | Heading level (1-6) for semantic HTML structure |
| `iconPlacement` | `'start' \| 'end'` | `'end'` | Position of the expand/collapse icon |
| `headerOffset` | `number` | `100` | Pixel offset from top of viewport when auto-scrolling expanded items into view |

### Methods

| Method | Description |
|--------|-------------|
| `focus()` | Focuses the accordion item header |
| `blur()` | Removes focus from the header |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `hc-toggle` | `{ expanded: boolean }` | Fired when item is toggled (before animation) |
| `hc-expand` | - | Fired when item finishes expanding |
| `hc-collapse` | - | Fired when item finishes collapsing |

### Slots

| Slot | Description |
|------|-------------|
| (default) | Content displayed when the accordion item is expanded |
| `label` | Custom content for the header (overrides `label` property) |
| `icon` | Custom icon element (replaces default chevron) |

## Keyboard Interactions

| Key | Action |
|-----|--------|
| `Enter` or `Space` | Toggles the focused accordion item |
| `Tab` | Moves focus to the next focusable element |
| `Shift + Tab` | Moves focus to the previous focusable element |
| `Down Arrow` | Moves focus to the next accordion header |
| `Up Arrow` | Moves focus to the previous accordion header |
| `Home` | Moves focus to the first accordion header |
| `End` | Moves focus to the last accordion header |

## Customization

### CSS Custom Properties

Customize the accordion appearance using CSS custom properties:

```css
:root {
  /* Colors */
  --hc-accordion-border-color: #e5e7eb;
  --hc-accordion-header-bg: #f9fafb;
  --hc-accordion-header-bg-hover: #ffffff;
  --hc-accordion-content-bg: #ffffff;

  /* Spacing */
  --hc-accordion-gap: 0.5rem;
  --hc-accordion-header-padding: 1rem;
  --hc-accordion-content-padding: 1rem;
  --hc-accordion-radius: 0.5rem;

  /* Animation */
  --hc-accordion-duration: 0.3s;
  --hc-accordion-easing: ease-in-out;
}
```

### Example: Custom Styling

```html
<style>
  hc-accordion {
    --hc-accordion-border-color: #3b82f6;
    --hc-accordion-header-bg: #eff6ff;
    --hc-accordion-header-bg-hover: #dbeafe;
    --hc-accordion-duration: 0.5s;
    --hc-accordion-easing: cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>

<hc-accordion>
  <hc-accordion-item label="Custom styled item">
    Beautiful custom styling!
  </hc-accordion-item>
</hc-accordion>
```

## JavaScript Usage

### Listen to Events

```javascript
const accordion = document.querySelector('hc-accordion');

accordion.addEventListener('hc-expand', (e) => {
  console.log('Item expanded:', e.detail.item.label);
});

accordion.addEventListener('hc-collapse', (e) => {
  console.log('Item collapsed:', e.detail.item.label);
});
```

### Programmatic Control

```javascript
const accordion = document.querySelector('hc-accordion');

// Expand all items (only works with allow-multiple)
accordion.expandAll();

// Collapse all items
accordion.collapseAll();

// Get all items
const items = accordion.getItems();
items[0].expanded = true; // Expand first item
```

### Cancel Expand/Collapse

```javascript
const accordion = document.querySelector('hc-accordion');

accordion.addEventListener('hc-before-expand', (e) => {
  if (someCondition) {
    e.preventDefault(); // Cancel the expand
    console.log('Expand cancelled');
  }
});
```

## Accessibility

The accordion components follow WAI-ARIA best practices:

- **Semantic HTML**: Uses proper heading structure with configurable levels
- **ARIA Attributes**:
  - `role="region"` on expandable content
  - `aria-expanded` indicates expansion state
  - `aria-controls` links header to content
  - `aria-labelledby` associates content with header
  - `aria-disabled` for disabled items
- **Keyboard Navigation**: Full keyboard support with arrow keys
- **Focus Management**: Proper focus indicators and management
- **Screen Reader Support**: Announces state changes and provides context

## Advanced Examples

### With Custom Label Slot

```html
<hc-accordion-item>
  <span slot="label">
    <strong>Important:</strong> Custom label with HTML
  </span>
  Content here
</hc-accordion-item>
```

### With Different Heading Levels

```html
<hc-accordion>
  <hc-accordion-item label="H2 Section" heading-level="2">
    This uses an h2 heading
  </hc-accordion-item>
  <hc-accordion-item label="H4 Section" heading-level="4">
    This uses an h4 heading
  </hc-accordion-item>
</hc-accordion>
```

### Icon Placement

```html
<hc-accordion>
  <!-- Icon at end (default) -->
  <hc-accordion-item label="Icon at End">
    Default position
  </hc-accordion-item>

  <!-- Icon at start -->
  <hc-accordion-item label="Icon at Start" icon-placement="start">
    Icon appears at the start of the header
  </hc-accordion-item>
</hc-accordion>
```

### Custom Icons

```html
<hc-accordion>
  <!-- Custom plus/minus icon -->
  <hc-accordion-item label="Custom Plus Icon">
    <svg slot="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
    Content with custom plus icon
  </hc-accordion-item>

  <!-- Custom arrow icon at start -->
  <hc-accordion-item label="Custom Arrow" icon-placement="start">
    <svg slot="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18l6-6-6-6"/>
    </svg>
    Content with custom arrow icon at start
  </hc-accordion-item>

  <!-- Custom icon with CSS for expand state -->
  <hc-accordion-item label="Dynamic Icon">
    <span slot="icon" class="custom-icon">+</span>
    <style>
      hc-accordion-item[expanded] .custom-icon {
        content: '−';
      }
    </style>
    Content with dynamic icon that changes on expand
  </hc-accordion-item>
</hc-accordion>
```

### Disabled Items

```html
<hc-accordion>
  <hc-accordion-item label="Normal Item">
    Can be toggled
  </hc-accordion-item>
  <hc-accordion-item label="Disabled Item" disabled>
    Cannot be toggled
  </hc-accordion-item>
</hc-accordion>
```

### Scroll Into View with Header Offset

When an accordion item expands, it automatically scrolls into view if the header is out of view or too close to the top. You can customize the offset:

```html
<hc-accordion>
  <!-- Default 100px offset from top -->
  <hc-accordion-item label="Default Offset">
    Content here
  </hc-accordion-item>

  <!-- Custom 150px offset (useful for sticky headers) -->
  <hc-accordion-item label="Custom Offset" header-offset="150">
    This will maintain 150px spacing from the top when scrolling into view
  </hc-accordion-item>

  <!-- No offset -->
  <hc-accordion-item label="No Offset" header-offset="0">
    This will scroll to the very top if needed
  </hc-accordion-item>
</hc-accordion>
```

## Browser Support

Works in all modern browsers that support:
- Web Components (Custom Elements v1)
- Shadow DOM
- ES2020
- Web Animations API

For older browsers, polyfills may be required.

## TypeScript

Full TypeScript support included. Import types:

```typescript
import type { HcAccordion } from './accordion.js';
import type { HcAccordionItem } from './accordion-item.js';

const accordion = document.querySelector('hc-accordion') as HcAccordion;
const items = accordion.getItems();
```

## Testing

Comprehensive tests are included using Vitest and Playwright. Run tests with:

```bash
npm test
```

See `accordion.test.js` for test examples.
