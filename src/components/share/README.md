# PS Share Component

An accessible, production-ready web component for sharing content via the Web Share API with an automatic fallback to clipboard copy.

## Features

- **Web Share API Integration**: Native sharing on supported platforms (mobile devices, progressive web apps)
- **Automatic Fallback**: Seamlessly falls back to clipboard copy when Web Share API is unavailable
- **Full Accessibility**: WCAG 2.1 Level AA compliant with complete keyboard navigation and screen reader support
- **Customizable Styling**: Comprehensive CSS custom property API with proper fallback chains
- **Multiple Share Types**: Support for URLs, text, and files
- **Visual Feedback**: Animated "Copied!" notification with configurable placement
- **Secure Context Aware**: Automatically detects and handles non-secure contexts
- **Shadow DOM**: Encapsulated styles with exposed CSS parts for customization
- **TypeScript**: Full TypeScript support with proper typing
- **Zero Dependencies**: Built with Lit, no additional runtime dependencies

## Installation

```bash
npm install preschool
```

## Basic Usage

```html
<ps-share
  label="Share this article"
  url="https://example.com/article"
  text="Check out this amazing article!"
></ps-share>
```

```javascript
// Import the component (auto-registers as <ps-share>)
import { PsShare } from 'preschool';
```

## Component API

### Attributes/Properties

| Attribute | Property | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `label` | `label` | `string` | `"Share"` | Human-readable description of shared content (used in share dialog and button text) |
| `url` | `url` | `string` | `""` | URL to share |
| `text` | `text` | `string` | `""` | Text content to share |
| - | `files` | `File[]` | `[]` | Array of File objects to share (property only, not an attribute) |
| `disabled` | `disabled` | `boolean` | `false` | Disables the share functionality |
| `feedback-placement` | `feedbackPlacement` | `string` | `"top"` | Position of copy feedback: `"top"`, `"bottom"`, `"left"`, `"right"` |
| `feedback-text` | `feedbackText` | `string` | `"Copied!"` | Custom text for the feedback notification |

### Slots

| Slot | Description |
|------|-------------|
| (default) | Custom button content. When provided, replaces the default share button entirely. |

### Events

All events bubble and are composed (cross shadow DOM boundaries).

| Event | Detail | Description |
|-------|--------|-------------|
| `ps-share-success` | `{ method: 'web-share-api', data: ShareData }` | Fired when content is successfully shared via Web Share API |
| `ps-share-copy` | `{ method: 'clipboard', text: string }` | Fired when content is copied to clipboard (fallback) |
| `ps-share-error` | `{ message: string, error?: unknown }` | Fired when sharing or copying fails |

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `share()` | - | `Promise<void>` | Programmatically trigger the share action |

### CSS Parts

Expose internal elements for external styling:

| Part | Description |
|------|-------------|
| `share-button` | The default share button element |
| `share-icon` | The share icon SVG |
| `feedback` | The copy feedback notification element |

### CSS Custom Properties

The component follows a three-tier fallback system:
1. Component-specific custom properties (`--ps-share-*`)
2. Design system tokens (`--button-*`, `--color-*`, `--space-*`)
3. Hard-coded defaults

#### Button Styling

| Property | Default | Description |
|----------|---------|-------------|
| `--ps-share-bg` | `var(--button-secondary-bg, var(--color-bg-alt, #f9fafb))` | Background color |
| `--ps-share-bg-hover` | `var(--button-secondary-hover-bg, var(--color-bg, #ffffff))` | Background color on hover |
| `--ps-share-bg-active` | `var(--color-neutral-200, #e5e7eb)` | Background color when active |
| `--ps-share-color` | `var(--button-secondary-label, var(--color-foreground, #0a0a0a))` | Text color |
| `--ps-share-color-hover` | `var(--button-secondary-hover-label, var(--color-foreground, #0a0a0a))` | Text color on hover |
| `--ps-share-border-color` | `var(--button-secondary-border, var(--color-border, #e5e7eb))` | Border color |
| `--ps-share-border-radius` | `var(--button-radius, 0.375rem)` | Border radius |

#### Sizing & Spacing

| Property | Default | Description |
|----------|---------|-------------|
| `--ps-share-padding-block` | `var(--button-padding-block, var(--space-s, 0.75rem))` | Vertical padding |
| `--ps-share-padding-inline` | `var(--button-padding-inline, var(--space-m, 1rem))` | Horizontal padding |
| `--ps-share-gap` | `var(--button-gap, var(--space-2xs, 0.5rem))` | Gap between icon and text |
| `--ps-share-font-size` | `var(--button-font-size, var(--font-size, 1rem))` | Font size |
| `--ps-share-font-weight` | `var(--button-font-weight, 500)` | Font weight |

#### Icon Styling

| Property | Default | Description |
|----------|---------|-------------|
| `--ps-share-icon-size` | `1.25rem` | Icon width and height |
| `--ps-share-icon-color` | `var(--_ps-share-color)` | Icon color (inherits from text color) |

#### Focus Indicators

| Property | Default | Description |
|----------|---------|-------------|
| `--ps-share-focus-ring-color` | `var(--color-accent, #0a0a0a)` | Focus ring color |
| `--ps-share-focus-ring-offset` | `2px` | Focus ring offset |

#### Feedback Notification

| Property | Default | Description |
|----------|---------|-------------|
| `--ps-share-feedback-bg` | `var(--color-foreground, #0a0a0a)` | Feedback background color |
| `--ps-share-feedback-color` | `var(--color-bg, #ffffff)` | Feedback text color |
| `--ps-share-feedback-duration` | `2000ms` | Duration feedback is visible |
| `--ps-share-feedback-offset` | `0.5rem` | Distance from button |

## Usage Examples

### Sharing a URL

```html
<ps-share
  label="Share this page"
  url="https://example.com"
></ps-share>
```

### Sharing Text Only

```html
<ps-share
  label="Share quote"
  text="The best way to predict the future is to invent it. - Alan Kay"
></ps-share>
```

### Sharing URL and Text

```html
<ps-share
  label="Share article"
  url="https://example.com/article"
  text="Check out this amazing article about web components!"
></ps-share>
```

### Sharing Files (Web Share API only)

```javascript
const shareButton = document.querySelector('ps-share');

// Create or get file reference
const file = new File(['content'], 'document.txt', { type: 'text/plain' });

// Set files property (not an attribute)
shareButton.files = [file];
shareButton.label = 'Share file';
```

### Custom Feedback Placement

```html
<!-- Feedback appears below button -->
<ps-share
  label="Share"
  text="Content"
  feedback-placement="bottom"
></ps-share>

<!-- Feedback appears to the right -->
<ps-share
  label="Share"
  text="Content"
  feedback-placement="right"
></ps-share>
```

### Custom Feedback Text

```html
<ps-share
  label="Share"
  text="Content"
  feedback-text="Link copied! ✓"
></ps-share>
```

### Custom Button Content

Use the default slot to provide your own button:

```html
<ps-share
  label="Share this page"
  url="https://example.com"
  text="Check this out!"
>
  <button class="my-custom-button">
    🚀 Share This!
  </button>
</ps-share>
```

The component will handle all the sharing logic; you just provide the UI.

### Disabled State

```html
<ps-share
  label="Share"
  text="Content"
  disabled
></ps-share>
```

### Custom Styling with CSS Variables

```css
/* Primary button style */
ps-share.primary {
  --ps-share-bg: #3b82f6;
  --ps-share-bg-hover: #2563eb;
  --ps-share-bg-active: #1d4ed8;
  --ps-share-color: white;
  --ps-share-color-hover: white;
  --ps-share-border-color: #3b82f6;
  --ps-share-icon-color: white;
}

/* Large size */
ps-share.large {
  --ps-share-padding-block: 1rem;
  --ps-share-padding-inline: 1.5rem;
  --ps-share-font-size: 1.125rem;
  --ps-share-icon-size: 1.5rem;
}

/* Rounded */
ps-share.rounded {
  --ps-share-border-radius: 9999px;
}
```

```html
<ps-share class="primary large rounded" label="Share"></ps-share>
```

### Styling with CSS Parts

```css
/* Style the default button */
ps-share::part(share-button) {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

ps-share::part(share-button):hover {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Style the icon */
ps-share::part(share-icon) {
  transform: rotate(0deg);
  transition: transform 0.3s ease;
}

ps-share::part(share-button):hover ps-share::part(share-icon) {
  transform: rotate(15deg);
}

/* Style the feedback notification */
ps-share::part(feedback) {
  font-weight: 700;
  text-transform: uppercase;
}
```

### Event Handling

```javascript
const shareButton = document.querySelector('ps-share');

// Listen for successful Web Share API usage
shareButton.addEventListener('ps-share-success', (event) => {
  console.log('Shared via Web Share API');
  console.log('Method:', event.detail.method); // 'web-share-api'
  console.log('Data:', event.detail.data);     // { title, text, url }
});

// Listen for clipboard copy fallback
shareButton.addEventListener('ps-share-copy', (event) => {
  console.log('Copied to clipboard');
  console.log('Method:', event.detail.method); // 'clipboard'
  console.log('Text:', event.detail.text);

  // You could show your own custom notification here
});

// Listen for errors
shareButton.addEventListener('ps-share-error', (event) => {
  console.error('Share error:', event.detail.message);
  console.error('Error:', event.detail.error);

  // Handle error (e.g., show notification to user)
});
```

### Programmatic Sharing

```javascript
const shareButton = document.querySelector('ps-share');

// Trigger share programmatically
shareButton.share();

// Or with async/await
async function shareContent() {
  try {
    await shareButton.share();
    console.log('Share triggered');
  } catch (error) {
    console.error('Share failed:', error);
  }
}
```

### Dynamic Content

```javascript
const shareButton = document.querySelector('ps-share');

// Update share content dynamically
function updateShareContent(article) {
  shareButton.label = article.title;
  shareButton.text = article.excerpt;
  shareButton.url = article.url;
}
```

## Accessibility

The `<ps-share>` component is fully accessible and follows WAI-ARIA best practices:

### Keyboard Navigation

- **Tab**: Move focus to/from the share button
- **Enter** or **Space**: Activate the share button
- All interactive elements meet the minimum 44x44px touch target size

### Screen Reader Support

- Proper ARIA labels on the button element
- `aria-disabled` attribute when button is disabled
- Live region announcements for share/copy success and errors
- Semantic HTML structure

### Focus Management

- Clear focus indicators with minimum 3:1 contrast ratio
- Focus ring with configurable color and offset
- Focus is never trapped or lost

### Motion & Animation

- Respects `prefers-reduced-motion` user preference
- All animations can be disabled via CSS

### Testing with Screen Readers

The component has been designed to work with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS, iOS)
- TalkBack (Android)

## Browser Support

### Web Share API

The Web Share API is supported on:
- **Mobile**: iOS Safari 12.2+, Chrome on Android 61+
- **Desktop**: Safari 12.1+ (macOS), Chrome 89+ (with user gesture)

The component automatically detects support and falls back to clipboard copy.

### Clipboard API

Modern Clipboard API is supported on:
- Chrome 66+
- Firefox 63+
- Safari 13.1+
- Edge 79+

For older browsers, the component uses a legacy `document.execCommand('copy')` fallback.

### Secure Context Requirement

Both the Web Share API and modern Clipboard API require a **secure context** (HTTPS or localhost). The component:
- Automatically detects secure context
- Falls back to legacy clipboard copy in non-secure contexts
- Will warn in console if used in non-secure context

## How It Works

### Share Flow

1. **User clicks share button**
2. **Check Web Share API availability**
   - If available → Call `navigator.share()`
   - If unavailable → Go to clipboard fallback
3. **Web Share API**
   - Success → Fire `ps-share-success` event
   - User cancels → Do nothing (no error)
   - Error → Fall back to clipboard
4. **Clipboard Fallback**
   - Try modern Clipboard API (`navigator.clipboard.writeText()`)
   - If unavailable → Use legacy `execCommand('copy')`
   - Show visual feedback notification
   - Fire `ps-share-copy` event
5. **Error Handling**
   - If everything fails → Fire `ps-share-error` event
   - Log to console for debugging

### Security Considerations

- **User Gesture Required**: Share actions must be triggered by user interaction (click, tap, Enter/Space key)
- **Secure Context**: HTTPS required for Web Share API and modern Clipboard API
- **Permissions**: Web Share API doesn't require permissions, but Clipboard API may prompt on first use
- **File Sharing**: Only works with Web Share API and requires `navigator.canShare()` support

## TypeScript Usage

The component is built with TypeScript and exports proper types:

```typescript
import { PsShare } from 'preschool';

// Type-safe property access
const shareButton = document.querySelector('ps-share') as PsShare;

shareButton.label = 'Share article';
shareButton.url = 'https://example.com';
shareButton.disabled = false;

// Type-safe event handling
shareButton.addEventListener('ps-share-success', (event) => {
  // event.detail is properly typed
  console.log(event.detail.method); // 'web-share-api'
  console.log(event.detail.data);   // ShareData
});

// Programmatic usage
await shareButton.share();
```

## Framework Integration

### React

```tsx
import { PsShare } from 'preschool';
import { useRef } from 'react';

function ShareButton() {
  const shareRef = useRef<PsShare>(null);

  const handleSuccess = (e: CustomEvent) => {
    console.log('Shared:', e.detail);
  };

  return (
    <ps-share
      ref={shareRef}
      label="Share article"
      url="https://example.com"
      onPs-share-success={handleSuccess}
    />
  );
}
```

### Vue

```vue
<template>
  <ps-share
    label="Share article"
    :url="articleUrl"
    @ps-share-success="handleSuccess"
  />
</template>

<script setup>
import { PsShare } from 'preschool';
import { ref } from 'vue';

const articleUrl = ref('https://example.com');

const handleSuccess = (event) => {
  console.log('Shared:', event.detail);
};
</script>
```

### Angular

```typescript
import { Component } from '@angular/core';
import { PsShare } from 'preschool';

@Component({
  selector: 'app-share',
  template: `
    <ps-share
      label="Share article"
      [url]="articleUrl"
      (ps-share-success)="handleSuccess($event)"
    ></ps-share>
  `
})
export class ShareComponent {
  articleUrl = 'https://example.com';

  handleSuccess(event: CustomEvent) {
    console.log('Shared:', event.detail);
  }
}
```

## Best Practices

### Content Guidelines

1. **Provide meaningful labels**: Use descriptive text that explains what's being shared
2. **Include both URL and text**: Provides better sharing experience across platforms
3. **Keep text concise**: Share dialogs have limited space
4. **Use appropriate file types**: Only share files that are commonly supported

### UX Guidelines

1. **Provide visual feedback**: The default feedback notification helps users understand the action completed
2. **Handle errors gracefully**: Always listen for `ps-share-error` and inform users
3. **Don't disable unnecessarily**: Only disable when sharing is truly unavailable
4. **Consider mobile context**: Web Share API works best on mobile devices

### Performance

1. **Lazy load if needed**: If you have many share buttons, consider lazy loading
2. **Reuse instances**: Create one component and update its properties rather than creating many
3. **Clean up event listeners**: Remove event listeners when components are destroyed

### Accessibility

1. **Always provide a label**: Never leave the label empty
2. **Don't rely on icons alone**: Include text labels for clarity
3. **Test with keyboard**: Ensure all functionality works without a mouse
4. **Test with screen readers**: Verify announcements are clear and helpful

## Troubleshooting

### Web Share API not working

**Problem**: Share dialog doesn't appear on mobile

**Solutions**:
- Ensure you're using HTTPS (required for Web Share API)
- Verify browser support (not all desktop browsers support it)
- Check that the share was triggered by user interaction
- Look for errors in `ps-share-error` event

### Clipboard copy failing

**Problem**: Content not copied to clipboard

**Solutions**:
- Check if you're in a secure context (HTTPS or localhost)
- Verify browser permissions for clipboard access
- Look for errors in browser console
- Listen to `ps-share-error` event for details

### Feedback notification not showing

**Problem**: "Copied!" message doesn't appear

**Solutions**:
- Check that clipboard copy actually succeeded (listen for `ps-share-copy` event)
- Verify CSS custom properties aren't hiding it (check `--ps-share-feedback-duration`)
- Ensure `feedbackPlacement` is set to a valid value
- Check for CSS conflicts with `z-index`

### Custom button not working

**Problem**: Custom slotted button doesn't trigger share

**Solutions**:
- Ensure your custom button is placed in the default slot
- The component automatically handles click events on slotted content
- Check browser console for errors
- Verify the button isn't disabled

## Examples

See the [demo.html](./demo.html) file for comprehensive examples including:
- Basic usage variations
- Custom styling examples
- Event handling
- Programmatic usage
- Accessibility demonstrations
- Framework integration patterns

## License

MIT

## Contributing

Contributions are welcome! Please ensure:
- Accessibility standards are maintained
- TypeScript types are properly updated
- Documentation is updated
- Tests are added for new features

## Related Components

- `<ps-copy>` - Copy to clipboard button (if available in your framework)
- `<ps-dropdown>` - Dropdown menu for additional sharing options
- `<ps-tooltip>` - Alternative to built-in feedback notification
