# Carousel Component

Version: 1.0.0

A CSS scroll-snap based carousel component with flexible layout options, keyboard navigation, and full accessibility support.

## Features (v1.0)

- CSS scroll-snap foundation with smooth scrolling
- CSS-controlled sizing - slotted children define their own widths
- Slotted navigation button support (`data-carousel-prev`/`data-carousel-next`)
- Active/previous/next state classes via Intersection Observer
- Mouse drag navigation
- Keyboard navigation (arrows, home, end)
- `align` attribute: 'start' | 'center'
- `overflow-mode` attribute: 'standard' | 'edge-bleed'
- `mouse-dragging` attribute (default true)
- `gap` attribute for spacing between slides
- Methods: `next()`, `previous()`, `goToSlide()`
- Events: `ps-slide-change`, `ps-scroll-start`, `ps-scroll-end`
- CSS custom properties for theming
- CSS parts: base, scroll-container, track
- Full ARIA compliance
- Reduced motion support
- Auto-disable navigation buttons at boundaries

## Usage

```html
<ps-carousel align="start" gap="1rem">
    <div class="slide">Slide 1</div>
    <div class="slide">Slide 2</div>
    <div class="slide">Slide 3</div>

    <button slot="navigation" data-carousel-prev>Previous</button>
    <button slot="navigation" data-carousel-next>Next</button>
</ps-carousel>
```

## Alignment Modes

### Start (default)
First slide aligns to container start. Slides use `scroll-snap-align: start`.

```html
<ps-carousel align="start">
    <!-- slides -->
</ps-carousel>
```

### Center
Active slide is centered in viewport with scroll padding.

```html
<ps-carousel align="center">
    <!-- slides -->
</ps-carousel>
```

## Overflow Modes

### Standard (default)
Equal padding on both sides for consistent layout.

```html
<ps-carousel overflow-mode="standard">
    <!-- slides -->
</ps-carousel>
```

### Edge Bleed
First item flush left, overflow bleeds to the right edge.

```html
<ps-carousel overflow-mode="edge-bleed">
    <!-- slides -->
</ps-carousel>
```

## State Classes

The carousel automatically applies these classes to slotted children:

- `.carousel-item--active` - Current active slide
- `.carousel-item--previous` - Slide before active
- `.carousel-item--next` - Slide after active
- `.carousel-item--in-view` - Any slide >50% visible

Style these in your global CSS:

```css
.slide.carousel-item--active {
    opacity: 1;
}

.slide:not(.carousel-item--in-view) {
    opacity: 0.5;
}
```

## Navigation

### Slotted Buttons

```html
<ps-carousel>
    <div>Slide 1</div>
    <div>Slide 2</div>

    <button slot="navigation" data-carousel-prev>Prev</button>
    <button slot="navigation" data-carousel-next>Next</button>
</ps-carousel>
```

Buttons are automatically:
- Wired to navigate
- Disabled at boundaries (when not looping)

### Programmatic

```javascript
const carousel = document.querySelector('ps-carousel');

carousel.next();
carousel.previous();
carousel.goToSlide(2);
```

## Keyboard Navigation

- Arrow Left/Right - Navigate between slides
- Home - Go to first slide
- End - Go to last slide

## Events

### ps-slide-change
Fired when the active slide changes.

```javascript
carousel.addEventListener('ps-slide-change', (e) => {
    console.log('Active index:', e.detail.activeIndex);
    console.log('Previous index:', e.detail.previousIndex);
    console.log('Active slide:', e.detail.activeSlide);
});
```

### ps-scroll-start
Fired when scrolling begins.

```javascript
carousel.addEventListener('ps-scroll-start', () => {
    console.log('Scrolling started');
});
```

### ps-scroll-end
Fired when scrolling ends (debounced).

```javascript
carousel.addEventListener('ps-scroll-end', () => {
    console.log('Scrolling ended');
});
```

## CSS Custom Properties

```css
ps-carousel {
    --carousel-gap: 1rem;
    --carousel-aspect-ratio: auto;
    --carousel-scroll-hint: 0;
    --carousel-transition: 300ms;
    --carousel-easing: ease-out;
}
```

## CSS Parts

```css
/* Base container */
ps-carousel::part(base) {
    /* ... */
}

/* Scroll container */
ps-carousel::part(scroll-container) {
    /* ... */
}

/* Track */
ps-carousel::part(track) {
    /* ... */
}
```

## Accessibility

- `role="region"` on base container
- `aria-roledescription="carousel"`
- `aria-label="Carousel"`
- `role="list"` on track
- Keyboard navigable
- Reduced motion support
- Focus visible states

## Roadmap (v1.1+)

- `autoplay` and related features
- `loop` mode
- Pagination dots
- `slides-per-page` attribute (container-relative using 100% as basis)
