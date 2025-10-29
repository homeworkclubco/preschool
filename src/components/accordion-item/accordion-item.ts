import { LitElement, html, css } from 'lit';
import { property, query, state } from 'lit/decorators.js';

/**
 * Accordion Item Web Component
 *
 * An accessible, collapsible content section for use within hc-accordion.
 * Follows WAI-ARIA Accordion Pattern.
 *
 * @element hc-accordion-item
 *
 * @slot - Default slot for accordion content
 * @slot label - Optional slot for custom header label
 * @slot icon - Optional slot for custom icon (replaces default chevron)
 *
 * @fires hc-toggle - Fired when item is toggled (before animation)
 * @fires hc-expand - Fired when item finishes expanding
 * @fires hc-collapse - Fired when item finishes collapsing
 *
 * @example
 * <hc-accordion-item label="Section 1" expanded>
 *   Content goes here
 * </hc-accordion-item>
 *
 * @example
 * <hc-accordion-item label="Custom Icon" icon-placement="end">
 *   <svg slot="icon" width="20" height="20">...</svg>
 *   Content with custom icon at the end
 * </hc-accordion-item>
 */
export class HcAccordionItem extends LitElement {
    static styles = css`
        :host {
            display: block;
            overflow: hidden;
        }

        :host(:not(:first-of-type)) {
            margin-top: var(--hc-accordion-gap, 0.5rem);
        }

        .header {
            width: 100%;
            display: flex;
            align-items: center;
            gap: var(--hc-accordion-header-gap, var(--space-xs, 0.75rem));
            padding: var(--hc-accordion-header-padding, var(--space-sm, 1rem));
            background-color: var(
                --hc-accordion-header-bg,
                var(--color-bg-alt, #f9fafb)
            );
            border: none;
            text-align: left;
            font-size: var(--text-base, 1rem);
            color: var(--color-text, #111827);
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

        .header:hover:not(:disabled) {
            background-color: var(
                --hc-accordion-header-bg-hover,
                var(--color-bg, #ffffff)
            );
        }

        .header:focus-visible {
            outline: 2px solid var(--color-focus, #3b82f6);
            outline-offset: -2px;
        }

        .header:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .icon {
            width: 1.25rem;
            height: 1.25rem;
            flex-shrink: 0;
            transition: transform var(--hc-accordion-duration, 0.3s)
                var(--hc-accordion-easing, ease-in-out);
        }

        :host([expanded]) .icon {
            transform: rotate(180deg);
        }

        .label {
            flex: 1;
        }

        .header--icon-end {
            flex-direction: row-reverse;
        }

        .header--icon-end .label {
            text-align: left;
        }

        .body {
            overflow: hidden;
            height: 0;
        }

        .content {
            padding: var(--hc-accordion-content-padding, var(--space-sm, 1rem));
            background-color: var(
                --hc-accordion-content-bg,
                var(--color-bg, #ffffff)
            );
        }

        @media (prefers-reduced-motion: reduce) {
            .icon,
            .body {
                transition-duration: 0.001ms !important;
            }
        }
    `;

    @property({ type: Boolean, reflect: true })
    expanded = false;

    @property({ type: String })
    label = '';

    @property({ type: Boolean, reflect: true })
    disabled = false;

    @property({ type: Number, attribute: 'heading-level' })
    headingLevel = 3;

    @property({ type: String, attribute: 'icon-placement' })
    iconPlacement: 'start' | 'end' = 'end';

    @query('#header')
    private headerElement!: HTMLButtonElement;

    @query('#body')
    private bodyElement!: HTMLDivElement;

    @query('#content')
    private contentElement!: HTMLDivElement;

    @state()
    private animation: Animation | null = null;

    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('role', 'region');
    }

    updated(changedProperties: Map<string, any>) {
        super.updated(changedProperties);

        if (changedProperties.has('expanded')) {
            this.updateComplete.then(() => {
                if (this.expanded) {
                    this.animateExpand();
                } else {
                    this.animateCollapse();
                }
            });
        }
    }

    render() {
        // Dynamically create heading with button inside
        const headerClasses = `header ${this.iconPlacement === 'end' ? 'header--icon-end' : ''}`;

        const headingContent = html`
            <button
                id="header"
                part="header"
                class="${headerClasses}"
                aria-expanded="${this.expanded}"
                aria-controls="body"
                ?disabled="${this.disabled}"
                @click="${this.handleToggle}"
            >
                <span class="icon" aria-hidden="true">
                    <slot name="icon">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            width="20"
                            height="20"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </slot>
                </span>
                <span class="label">
                    <slot name="label">${this.label}</slot>
                </span>
            </button>
        `;

        return html`
            ${this.headingLevel === 2
                ? html`<h2 style="margin: 0;">${headingContent}</h2>`
                : ''}
            ${this.headingLevel === 3
                ? html`<h3 style="margin: 0;">${headingContent}</h3>`
                : ''}
            ${this.headingLevel === 4
                ? html`<h4 style="margin: 0;">${headingContent}</h4>`
                : ''}
            ${this.headingLevel === 5
                ? html`<h5 style="margin: 0;">${headingContent}</h5>`
                : ''}
            ${this.headingLevel === 6
                ? html`<h6 style="margin: 0;">${headingContent}</h6>`
                : ''}
            <div id="body" class="body" role="region" aria-labelledby="header">
                <div id="content" class="content">
                    <slot></slot>
                </div>
            </div>
        `;
    }

    private handleToggle(e: Event) {
        e.preventDefault();
        if (this.disabled) return;

        const toggleEvent = new CustomEvent('hc-toggle', {
            bubbles: true,
            composed: true,
            detail: { expanded: !this.expanded },
        });

        if (this.dispatchEvent(toggleEvent)) {
            this.expanded = !this.expanded;
        }
    }

    private async animateExpand() {
        if (this.animation) {
            this.animation.cancel();
        }

        const duration = this.getDuration();
        const easing = this.getEasing();
        const height = this.contentElement.scrollHeight;

        this.bodyElement.style.height = '0px';

        this.animation = this.bodyElement.animate(
            [
                { height: '0px', opacity: 0 },
                { height: `${height}px`, opacity: 1 },
            ],
            {
                duration,
                easing,
                fill: 'forwards',
            }
        );

        try {
            await this.animation.finished;
            this.bodyElement.style.height = 'auto';

            // Check if header is out of view or too close to top
            this.scrollIntoViewIfNeeded();

            this.dispatchEvent(
                new CustomEvent('hc-expand', {
                    bubbles: true,
                    composed: true,
                })
            );
        } catch (err) {
            // Animation was cancelled
        }

        this.animation = null;
    }

    private async animateCollapse() {
        if (this.animation) {
            this.animation.cancel();
        }

        const duration = this.getDuration();
        const easing = this.getEasing();
        const height = this.contentElement.scrollHeight;

        // Set explicit height before animating to 0
        this.bodyElement.style.height = `${height}px`;
        // Force reflow
        this.bodyElement.offsetHeight;

        this.animation = this.bodyElement.animate(
            [
                { height: `${height}px`, opacity: 1 },
                { height: '0px', opacity: 0 },
            ],
            {
                duration,
                easing,
                fill: 'forwards',
            }
        );

        try {
            await this.animation.finished;
            this.dispatchEvent(
                new CustomEvent('hc-collapse', {
                    bubbles: true,
                    composed: true,
                })
            );
        } catch (err) {
            // Animation was cancelled
        }

        this.animation = null;
    }

    private getDuration(): number {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;
        if (prefersReducedMotion) return 0;

        const duration = getComputedStyle(this).getPropertyValue(
            '--hc-accordion-duration'
        );
        return duration ? parseFloat(duration) * 1000 : 300;
    }

    private getEasing(): string {
        return (
            getComputedStyle(this).getPropertyValue('--hc-accordion-easing') ||
            'ease-in-out'
        );
    }

    private scrollIntoViewIfNeeded() {
        if (!this.headerElement) return;

        // Get headerOffset from parent accordion, defaulting to 100
        const accordion = this.parentElement?.closest('hc-accordion') as any;
        const headerOffset = accordion?.headerOffset ?? 100;

        const headerRect = this.headerElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Check if header is out of view at the top or too close to the top
        if (headerRect.top < headerOffset) {
            // Calculate the desired scroll position
            const elementTop = headerRect.top + window.scrollY;
            const targetScrollPosition = elementTop - headerOffset;

            window.scrollTo({
                top: targetScrollPosition,
                behavior: 'smooth',
            });
        }
        // Check if header is completely out of view at the bottom
        else if (headerRect.bottom > viewportHeight) {
            this.headerElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }

    /**
     * Focuses the accordion item header
     */
    focus() {
        this.headerElement?.focus();
    }

    /**
     * Removes focus from the accordion item header
     */
    blur() {
        this.headerElement?.blur();
    }
}

customElements.define('hc-accordion-item', HcAccordionItem);
