import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * Carousel Item Component
 *
 * A wrapper component for carousel slides that manages state and provides
 * styling hooks through reflected attributes.
 *
 * @element ps-carousel-item
 *
 * @slot - Slide content
 *
 * @attr {boolean} active - Current active slide
 * @attr {boolean} previous - Slide immediately before active
 * @attr {boolean} next - Slide immediately after active
 * @attr {boolean} in-view - Slide is currently visible (>50%)
 */
export class PsCarouselItem extends LitElement {
    static styles = css`
        :host {
            display: block;
            flex: 0 0 auto;
            scroll-snap-align: inherit;
            scroll-snap-stop: inherit;
        }

        /* Container for slotted content */
        .item {
            width: 100%;
            height: 100%;
        }
    `;

    /** Whether this is the active slide */
    @property({ type: Boolean, reflect: true })
    active = false;

    /** Whether this is the previous slide */
    @property({ type: Boolean, reflect: true })
    previous = false;

    /** Whether this is the next slide */
    @property({ type: Boolean, reflect: true })
    next = false;

    /** Whether this slide is currently in view (>50% visible) */
    @property({ type: Boolean, reflect: true, attribute: 'in-view' })
    inView = false;

    render() {
        return html`
            <div class="item" role="group" aria-roledescription="slide">
                <slot></slot>
            </div>
        `;
    }
}

if (!customElements.get('ps-carousel-item')) {
    customElements.define('ps-carousel-item', PsCarouselItem);
}
