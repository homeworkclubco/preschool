import { LitElement, html, css, PropertyValues } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import type { PsCarouselItem } from './carousel-item.js';

/**
 * Carousel Web Component
 *
 * A CSS scroll-snap based carousel with flexible layout options,
 * keyboard navigation, and accessibility features.
 *
 * Navigation buttons can be placed anywhere in the DOM and linked
 * to the carousel via data-carousel-prev="carousel-id" and
 * data-carousel-next="carousel-id" attributes.
 *
 * @element ps-carousel
 *
 * @slot - ps-carousel-item elements
 *
 * @csspart base - The component's base wrapper
 * @csspart scroll-container - The scrollable container
 * @csspart track - The track containing slides
 *
 * @cssprop --carousel-gap - Gap between slides (default: 1rem)
 * @cssprop --carousel-aspect-ratio - Aspect ratio for slides (default: auto)
 * @cssprop --carousel-scroll-hint - Amount of next slide to show (default: 0)
 * @cssprop --carousel-transition - Scroll transition duration (default: 300ms)
 * @cssprop --carousel-easing - Scroll easing function (default: ease-out)
 *
 * @fires ps-slide-change - Fired when the active slide changes
 * @fires ps-scroll-start - Fired when scrolling starts
 * @fires ps-scroll-end - Fired when scrolling ends
 */
export class PsCarousel extends LitElement {
    static styles = css`
        :host {
            /* Public API - can be customized */
            --carousel-gap: 1rem;
            --carousel-aspect-ratio: auto;
            --carousel-scroll-hint: 0;
            --carousel-transition: 300ms;
            --carousel-easing: ease-out;

            /* Internal variables */
            --_gap: var(--carousel-gap);
            --_scroll-padding: var(--carousel-scroll-hint);

            display: block;
            position: relative;
        }

        /* Base container */
        .carousel {
            position: relative;
            width: 100%;
            height: 100%;
        }

        /* Scroll container */
        .carousel__scroll-container {
            display: flex;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE/Edge */
            cursor: grab;
        }

        /* Hide scrollbar for Chrome/Safari */
        .carousel__scroll-container::-webkit-scrollbar {
            display: none;
        }

        /* Track */
        .carousel__track {
            display: flex;
            flex-shrink: 0;
            gap: var(--_gap);
            min-width: 100%;
        }

        /* Alignment modes */
        :host([align='start']) .carousel__scroll-container {
            scroll-snap-type: x mandatory;
            scroll-padding-inline-start: var(--_scroll-padding);
        }

        :host([align='center']) .carousel__scroll-container {
            scroll-snap-type: x mandatory;
            scroll-padding-inline: calc(50% - var(--_scroll-padding));
        }

        /* Scroll snap for carousel items */
        :host([align='start']) ::slotted(ps-carousel-item) {
            scroll-snap-align: start;
            scroll-snap-stop: normal;
        }

        :host([align='center']) ::slotted(ps-carousel-item) {
            scroll-snap-align: center;
            scroll-snap-stop: normal;
        }

        /* Overflow modes */
        :host([overflow-mode='standard']) .carousel__scroll-container {
            padding-inline: var(--carousel-gap);
        }

        :host([overflow-mode='edge-bleed']) .carousel__scroll-container {
            padding-inline-start: 0;
            padding-inline-end: var(--carousel-gap);
        }

        :host([overflow-mode='edge-bleed']) .carousel__track {
            padding-inline-start: 0;
        }

        /* Aspect ratio for carousel items (if specified) */
        :host([aspect-ratio]) ::slotted(ps-carousel-item) {
            aspect-ratio: var(--carousel-aspect-ratio);
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            .carousel__scroll-container {
                scroll-behavior: auto;
            }

            ::slotted(*) {
                scroll-snap-stop: normal;
            }
        }

        /* Focus styles */
        .carousel:focus {
            outline: 2px solid var(--color-focus, #0066cc);
            outline-offset: 2px;
        }

        .carousel:focus:not(:focus-visible) {
            outline: none;
        }

        /* Scrolling state */
        .carousel--scrolling .carousel__scroll-container {
            pointer-events: none;
        }

        /* Mouse dragging cursor */
        :host([mouse-dragging]) .carousel__scroll-container:active {
            cursor: grabbing;
        }
    `;

    /** Alignment of slides within the viewport */
    @property({ type: String, reflect: true })
    align: 'start' | 'center' = 'start';

    /** Overflow mode for edge treatment */
    @property({ type: String, attribute: 'overflow-mode', reflect: true })
    overflowMode: 'standard' | 'edge-bleed' = 'standard';

    /** Enable mouse drag navigation */
    @property({ type: Boolean, attribute: 'mouse-dragging', reflect: true })
    mouseDragging = true;

    /** Gap between slides (CSS value) */
    @property({ type: String })
    gap = '1rem';

    /** Current active slide index */
    @state()
    private activeIndex = 0;

    /** Is currently scrolling */
    @state()
    private isScrolling = false;

    /** Reference to scroll container */
    @query('.carousel__scroll-container')
    private scrollContainer!: HTMLElement;

    /** Reference to track */
    @query('.carousel__track')
    private track!: HTMLElement;

    /** Carousel item elements from slot */
    private slides: PsCarouselItem[] = [];

    /** Intersection observer for slide visibility */
    private intersectionObserver?: IntersectionObserver;

    /** Scroll timeout for debouncing */
    private scrollTimeout?: number;

    /** Mouse drag state */
    private dragState = {
        isDragging: false,
        startX: 0,
        scrollLeft: 0,
    };

    connectedCallback() {
        super.connectedCallback();
        this.setupIntersectionObserver();
        this.setupGlobalNavigation();

        // Emit ready event
        this.dispatchEvent(
            new CustomEvent('ps-ready', {
                bubbles: true,
                composed: true,
                cancelable: false,
            })
        );
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.intersectionObserver?.disconnect();
        this.cleanupGlobalNavigation();
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
    }

    firstUpdated() {
        this.updateSlides();
        this.updateNavigationState();
    }

    updated(changed: PropertyValues) {
        if (changed.has('gap')) {
            this.style.setProperty('--carousel-gap', this.gap);
        }
    }

    private setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const slide = entry.target as PsCarouselItem;

                    // Mark slides in view (>50% visible)
                    slide.inView = entry.intersectionRatio > 0.5;

                    // Determine active slide (most visible)
                    if (entry.intersectionRatio > 0.5) {
                        const slideIndex = this.slides.indexOf(slide);
                        if (slideIndex !== -1 && slideIndex !== this.activeIndex) {
                            this.setActiveSlide(slideIndex);
                        }
                    }
                });
            },
            {
                root: this.scrollContainer,
                threshold: [0, 0.5, 1],
            }
        );
    }

    private updateSlides() {
        const slot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
        if (!slot) {
            console.warn('Slot not found');
            return;
        }

        const allElements = slot.assignedElements();
        console.log('All slotted elements:', allElements);

        // Only select ps-carousel-item elements
        this.slides = allElements.filter((el) => {
            return el.tagName.toLowerCase() === 'ps-carousel-item';
        }) as PsCarouselItem[];

        console.log('Carousel items found:', this.slides.length, this.slides);

        // Observe all slides
        this.slides.forEach((slide) => {
            this.intersectionObserver?.observe(slide);
        });

        // Set initial active slide
        if (this.slides.length > 0) {
            this.setActiveSlide(0);
        }
    }

    private navigationClickHandler = (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        // Check if the clicked element or any parent has carousel navigation attributes
        const button = target.closest('[data-carousel-prev], [data-carousel-next]') as HTMLElement;
        if (!button) return;

        const prevId = button.getAttribute('data-carousel-prev');
        const nextId = button.getAttribute('data-carousel-next');

        console.log('Button clicked:', { prevId, nextId, carouselId: this.id, slides: this.slides.length });

        // Check if this button controls this carousel
        if (prevId === this.id) {
            console.log('Previous button clicked for carousel:', this.id);
            e.preventDefault();
            this.previous();
        } else if (nextId === this.id) {
            console.log('Next button clicked for carousel:', this.id);
            e.preventDefault();
            this.next();
        }
    };

    private setupGlobalNavigation() {
        // Listen for clicks on the entire document to handle navigation buttons anywhere
        document.addEventListener('click', this.navigationClickHandler);
    }

    private cleanupGlobalNavigation() {
        document.removeEventListener('click', this.navigationClickHandler);
    }

    private setActiveSlide(index: number) {
        const previousIndex = this.activeIndex;
        this.activeIndex = index;

        // Reset all slide states
        this.slides.forEach((slide) => {
            slide.active = false;
            slide.previous = false;
            slide.next = false;
        });

        // Set new states
        if (this.slides[index]) {
            this.slides[index].active = true;
        }

        if (this.slides[index - 1]) {
            this.slides[index - 1].previous = true;
        }

        if (this.slides[index + 1]) {
            this.slides[index + 1].next = true;
        }

        this.updateNavigationState();

        // Emit slide change event
        if (previousIndex !== index) {
            this.dispatchEvent(
                new CustomEvent('ps-slide-change', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        activeIndex: index,
                        previousIndex,
                        activeSlide: this.slides[index],
                    },
                })
            );
        }
    }

    private updateNavigationState() {
        if (!this.id) return; // Need an ID to find navigation buttons

        const isAtStart = this.activeIndex === 0;
        const isAtEnd = this.activeIndex === this.slides.length - 1;

        // Find and update all prev buttons for this carousel
        const prevButtons = document.querySelectorAll(`[data-carousel-prev="${this.id}"]`);
        prevButtons.forEach((btn) => {
            btn.toggleAttribute('disabled', isAtStart);
        });

        // Find and update all next buttons for this carousel
        const nextButtons = document.querySelectorAll(`[data-carousel-next="${this.id}"]`);
        nextButtons.forEach((btn) => {
            btn.toggleAttribute('disabled', isAtEnd);
        });
    }

    private handleScroll = () => {
        // Emit scroll start event
        if (!this.isScrolling) {
            this.isScrolling = true;
            this.dispatchEvent(
                new CustomEvent('ps-scroll-start', {
                    bubbles: true,
                    composed: true,
                })
            );
        }

        // Debounce scroll end
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = window.setTimeout(() => {
            this.isScrolling = false;
            this.dispatchEvent(
                new CustomEvent('ps-scroll-end', {
                    bubbles: true,
                    composed: true,
                })
            );
        }, 150);
    };

    private handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previous();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.next();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.slides.length - 1);
                break;
        }
    };

    private handleMouseDown = (e: MouseEvent) => {
        if (!this.mouseDragging) return;

        this.dragState.isDragging = true;
        this.dragState.startX = e.pageX - this.scrollContainer.offsetLeft;
        this.dragState.scrollLeft = this.scrollContainer.scrollLeft;
        this.scrollContainer.style.cursor = 'grabbing';
        this.scrollContainer.style.userSelect = 'none';
    };

    private handleMouseMove = (e: MouseEvent) => {
        if (!this.dragState.isDragging) return;

        e.preventDefault();
        const x = e.pageX - this.scrollContainer.offsetLeft;
        const walk = (x - this.dragState.startX) * 2; // Scroll speed multiplier
        this.scrollContainer.scrollLeft = this.dragState.scrollLeft - walk;
    };

    private handleMouseUp = () => {
        this.dragState.isDragging = false;
        this.scrollContainer.style.cursor = 'grab';
        this.scrollContainer.style.userSelect = '';
    };

    private handleSlotChange = () => {
        this.updateSlides();
        this.updateNavigationState();
    };

    /** Navigate to the next slide */
    next() {
        const nextIndex = Math.min(this.activeIndex + 1, this.slides.length - 1);
        this.goToSlide(nextIndex);
    }

    /** Navigate to the previous slide */
    previous() {
        const prevIndex = Math.max(this.activeIndex - 1, 0);
        console.log('previous() called:', { currentIndex: this.activeIndex, prevIndex, totalSlides: this.slides.length });
        this.goToSlide(prevIndex);
    }

    /** Navigate to a specific slide by index */
    goToSlide(index: number) {
        if (index < 0 || index >= this.slides.length) {
            console.warn(`Invalid slide index: ${index}`);
            return;
        }

        const slide = this.slides[index] as HTMLElement;
        if (!slide) return;

        // Calculate the scroll position
        const scrollLeft = slide.offsetLeft;

        console.log('goToSlide:', { index, scrollLeft, slideOffset: slide.offsetLeft });

        // Scroll the container to the target position
        this.scrollContainer.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    }

    render() {
        const classes = {
            carousel: true,
            'carousel--scrolling': this.isScrolling,
        };

        return html`
            <div
                class=${classMap(classes)}
                part="base"
                role="region"
                aria-roledescription="carousel"
                aria-label="Carousel"
                @keydown=${this.handleKeyDown}
                tabindex="0"
            >
                <div
                    class="carousel__scroll-container"
                    part="scroll-container"
                    @scroll=${this.handleScroll}
                    @mousedown=${this.handleMouseDown}
                    @mousemove=${this.handleMouseMove}
                    @mouseup=${this.handleMouseUp}
                    @mouseleave=${this.handleMouseUp}
                >
                    <div class="carousel__track" part="track" role="list">
                        <slot @slotchange=${this.handleSlotChange}></slot>
                    </div>
                </div>
            </div>
        `;
    }
}

if (!customElements.get('ps-carousel')) {
    customElements.define('ps-carousel', PsCarousel);
}
