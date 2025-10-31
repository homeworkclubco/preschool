# PS Share - Quick Examples

## Installation & Import

```bash
npm install preschool
```

```javascript
// ES Module import (auto-registers <ps-share>)
import { PsShare } from 'preschool';

// Or import everything
import * as Preschool from 'preschool';
```

## Common Use Cases

### 1. Blog/Article Share Button

```html
<ps-share
  label="Share this article"
  url="https://myblog.com/awesome-article"
  text="Check out this article about web components!"
></ps-share>
```

### 2. Social Media Post Share

```html
<ps-share
  label="Share post"
  text="Amazing sunset at the beach today! 🌅 #nature #photography"
  feedback-text="Post copied! 📋"
  feedback-placement="bottom"
></ps-share>
```

### 3. Product Share (E-commerce)

```html
<ps-share
  label="Share product"
  url="https://shop.com/products/awesome-gadget"
  text="Check out this awesome gadget I found!"
  class="primary"
></ps-share>

<style>
ps-share.primary {
  --ps-share-bg: #10b981;
  --ps-share-bg-hover: #059669;
  --ps-share-color: white;
  --ps-share-border-radius: 0.5rem;
}
</style>
```

### 4. Share with Custom Icon Button

```html
<ps-share
  label="Share recipe"
  url="https://recipes.com/chocolate-cake"
  text="Try this delicious chocolate cake recipe!"
>
  <button class="icon-button">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  </button>
</ps-share>

<style>
.icon-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
}
.icon-button:hover {
  background: #f3f4f6;
}
</style>
```

### 5. Share Button with Event Tracking

```html
<ps-share
  id="analytics-share"
  label="Share"
  url="https://example.com"
  text="Content to share"
></ps-share>

<script>
const shareBtn = document.getElementById('analytics-share');

shareBtn.addEventListener('ps-share-success', (e) => {
  // Track Web Share API usage
  analytics.track('share', {
    method: 'web-share-api',
    url: e.detail.data.url
  });
});

shareBtn.addEventListener('ps-share-copy', (e) => {
  // Track clipboard copy
  analytics.track('copy', {
    method: 'clipboard',
    content: e.detail.text
  });
});
</script>
```

### 6. Dynamic Share Content (SPA)

```html
<ps-share id="dynamic-share" label="Share"></ps-share>

<script>
// Update share content when route changes or content loads
function updateShareButton(pageData) {
  const shareBtn = document.getElementById('dynamic-share');
  shareBtn.label = pageData.title;
  shareBtn.text = pageData.description;
  shareBtn.url = pageData.canonicalUrl;
}

// Example: Update on page load
fetch('/api/page-data')
  .then(res => res.json())
  .then(data => updateShareButton(data));
</script>
```

### 7. Share Files (Images, PDFs, etc.)

```html
<ps-share id="file-share" label="Share image"></ps-share>

<script>
const shareBtn = document.getElementById('file-share');

async function shareImage() {
  try {
    const response = await fetch('/images/photo.jpg');
    const blob = await response.blob();
    const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });

    shareBtn.files = [file];
    shareBtn.text = 'Check out this photo!';
    await shareBtn.share();
  } catch (error) {
    console.error('Failed to share:', error);
  }
}

// Trigger when user clicks
document.querySelector('#share-photo-btn').addEventListener('click', shareImage);
</script>
```

### 8. Styled Share Button Collection

```html
<div class="share-buttons">
  <ps-share class="primary large" label="Share"></ps-share>
  <ps-share class="secondary" label="Copy link"></ps-share>
  <ps-share class="icon-only" label="Share">
    <button class="icon-btn">📤</button>
  </ps-share>
</div>

<style>
.share-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Primary button */
ps-share.primary {
  --ps-share-bg: #3b82f6;
  --ps-share-bg-hover: #2563eb;
  --ps-share-color: white;
  --ps-share-border-color: transparent;
}

/* Large size */
ps-share.large {
  --ps-share-padding-block: 0.875rem;
  --ps-share-padding-inline: 1.5rem;
  --ps-share-font-size: 1.125rem;
}

/* Secondary outline */
ps-share.secondary {
  --ps-share-bg: transparent;
  --ps-share-bg-hover: #f3f4f6;
  --ps-share-border-color: #d1d5db;
}

/* Icon only */
.icon-btn {
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem;
  font-size: 1.25rem;
  cursor: pointer;
  min-width: 44px;
  min-height: 44px;
}
</style>
```

### 9. Floating Share Button

```html
<ps-share class="floating" label="Share page"></ps-share>

<style>
ps-share.floating {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;

  --ps-share-bg: #3b82f6;
  --ps-share-bg-hover: #2563eb;
  --ps-share-color: white;
  --ps-share-border-radius: 9999px;
  --ps-share-padding-block: 1rem;
  --ps-share-padding-inline: 1rem;

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
</style>
```

### 10. Card with Share Button

```html
<article class="card">
  <img src="article.jpg" alt="Article image" />
  <div class="card-content">
    <h2>Amazing Article Title</h2>
    <p>This is a short description of the article content...</p>
    <div class="card-actions">
      <ps-share
        label="Share"
        url="https://blog.com/article"
        text="Check out this amazing article!"
        feedback-placement="top"
      ></ps-share>
    </div>
  </div>
</article>

<style>
.card {
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 1.5rem;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}
</style>
```

## Framework-Specific Examples

### React

```tsx
import { PsShare } from 'preschool';
import { useRef, useEffect } from 'react';

interface ShareButtonProps {
  title: string;
  url: string;
  text: string;
}

export function ShareButton({ title, url, text }: ShareButtonProps) {
  const shareRef = useRef<PsShare>(null);

  useEffect(() => {
    const handleSuccess = (e: CustomEvent) => {
      console.log('Shared:', e.detail);
      // Track analytics
    };

    const shareEl = shareRef.current;
    shareEl?.addEventListener('ps-share-success', handleSuccess as EventListener);

    return () => {
      shareEl?.removeEventListener('ps-share-success', handleSuccess as EventListener);
    };
  }, []);

  return (
    <ps-share
      ref={shareRef}
      label={title}
      url={url}
      text={text}
    />
  );
}
```

### Vue 3

```vue
<template>
  <ps-share
    ref="shareRef"
    :label="title"
    :url="url"
    :text="text"
    @ps-share-success="handleSuccess"
    @ps-share-copy="handleCopy"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PsShare } from 'preschool';

interface Props {
  title: string;
  url: string;
  text: string;
}

const props = defineProps<Props>();
const shareRef = ref<PsShare>();

const handleSuccess = (e: CustomEvent) => {
  console.log('Shared via Web Share API:', e.detail);
};

const handleCopy = (e: CustomEvent) => {
  console.log('Copied to clipboard:', e.detail);
};

// Programmatic share
const triggerShare = () => {
  shareRef.value?.share();
};

defineExpose({ triggerShare });
</script>
```

### Svelte

```svelte
<script lang="ts">
  import { PsShare } from 'preschool';
  import { onMount } from 'svelte';

  export let title: string;
  export let url: string;
  export let text: string;

  let shareElement: PsShare;

  onMount(() => {
    shareElement.addEventListener('ps-share-success', (e: CustomEvent) => {
      console.log('Shared:', e.detail);
    });
  });

  function handleShare() {
    shareElement.share();
  }
</script>

<ps-share
  bind:this={shareElement}
  label={title}
  {url}
  {text}
/>
```

### Angular

```typescript
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { PsShare } from 'preschool';

@Component({
  selector: 'app-share-button',
  template: `
    <ps-share
      #shareBtn
      [attr.label]="title"
      [attr.url]="url"
      [attr.text]="text"
      (ps-share-success)="onShareSuccess($event)"
    ></ps-share>
  `
})
export class ShareButtonComponent implements AfterViewInit {
  @ViewChild('shareBtn') shareBtn!: ElementRef<PsShare>;

  title = 'Share this';
  url = 'https://example.com';
  text = 'Check this out!';

  ngAfterViewInit() {
    // Component is ready
  }

  onShareSuccess(event: CustomEvent) {
    console.log('Shared:', event.detail);
  }

  programmaticShare() {
    this.shareBtn.nativeElement.share();
  }
}
```

## Advanced Patterns

### Conditional Share Button

Only show share button if Web Share API is available:

```html
<div id="share-container"></div>

<script>
import { PsShare } from 'preschool';

if (navigator.share) {
  const shareBtn = document.createElement('ps-share');
  shareBtn.setAttribute('label', 'Share');
  shareBtn.setAttribute('url', window.location.href);
  document.getElementById('share-container').appendChild(shareBtn);
} else {
  // Show alternative (e.g., social media links)
  document.getElementById('share-container').innerHTML = `
    <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}">
      Tweet
    </a>
  `;
}
</script>
```

### Progressive Enhancement

Start with a simple link, enhance to share button:

```html
<a href="mailto:?subject=Check this out&body=https://example.com" id="share-link">
  Share this page
</a>

<script type="module">
import { PsShare } from 'preschool';

const link = document.getElementById('share-link');
const shareBtn = document.createElement('ps-share');

shareBtn.setAttribute('label', 'Share this page');
shareBtn.setAttribute('url', 'https://example.com');
shareBtn.setAttribute('text', 'Check this out!');

// Replace link with share button
link.parentNode.replaceChild(shareBtn, link);
</script>
```

### Share with Custom Analytics

```javascript
import { PsShare } from 'preschool';

class AnalyticsShare extends PsShare {
  constructor() {
    super();

    this.addEventListener('ps-share-success', (e) => {
      this._trackEvent('share_success', {
        method: e.detail.method,
        url: e.detail.data.url
      });
    });

    this.addEventListener('ps-share-copy', (e) => {
      this._trackEvent('share_copy', {
        method: e.detail.method,
        length: e.detail.text.length
      });
    });
  }

  _trackEvent(eventName, data) {
    // Your analytics implementation
    if (window.gtag) {
      gtag('event', eventName, data);
    }
  }
}

customElements.define('analytics-share', AnalyticsShare);
```

```html
<analytics-share label="Share" url="https://example.com"></analytics-share>
```

## Styling Recipes

### Gradient Button

```css
ps-share.gradient {
  --ps-share-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --ps-share-bg-hover: linear-gradient(135deg, #5a67d8 0%, #6b3fa0 100%);
  --ps-share-color: white;
  --ps-share-border-color: transparent;
  --ps-share-border-radius: 0.5rem;
}
```

### Neumorphism Style

```css
ps-share.neumorphic {
  --ps-share-bg: #e0e5ec;
  --ps-share-color: #4a5568;
  --ps-share-border-color: transparent;
  --ps-share-border-radius: 1rem;
  box-shadow: 9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff;
}

ps-share.neumorphic:hover {
  box-shadow: inset 9px 9px 16px #a3b1c6, inset -9px -9px 16px #ffffff;
}
```

### Glass Morphism

```css
ps-share.glass {
  --ps-share-bg: rgba(255, 255, 255, 0.1);
  --ps-share-bg-hover: rgba(255, 255, 255, 0.2);
  --ps-share-color: white;
  --ps-share-border-color: rgba(255, 255, 255, 0.2);
  --ps-share-border-radius: 0.75rem;
  backdrop-filter: blur(10px);
}
```

## Tips & Tricks

1. **Mobile-First**: The Web Share API works best on mobile devices, so test on real devices
2. **Secure Context**: Always use HTTPS in production for full functionality
3. **User Gesture**: Share must be triggered by user interaction (click, tap, etc.)
4. **File Sharing**: Only works with Web Share API and requires support check
5. **Feedback Placement**: Choose placement based on button position on screen
6. **Accessibility**: Always include meaningful labels for screen readers
7. **Event Handling**: Use events for analytics and user feedback
8. **Progressive Enhancement**: Provide fallback options for older browsers

## Resources

- [Web Share API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
- [Clipboard API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Component README](./README.md)
- [Interactive Demo](./demo.html)
