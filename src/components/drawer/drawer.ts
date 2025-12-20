import { LitElement, html, nothing, css } from 'lit';
import { property, query, state } from 'lit/decorators.js';

/**
 * Drawer Web Component
 *
 * A modal overlay that slides in from any edge of the viewport or container.
 * Based on Shoelace's Drawer component.
 *
 * @element hc-drawer
 *
 * @slot - The drawer's main content
 * @slot header - Completely overrides the default header. When used, label, header-actions, and close-button slots are not rendered
 * @slot label - The drawer's label (alternative to label attribute)
 * @slot header-actions - Optional actions to add to the header (e.g., buttons, icons)
 * @slot close-button - Custom close button. Should have @click handler that calls drawer.hide()
 * @slot footer - The drawer's footer, typically used for buttons
 *
 * @fires ps-ready - Emitted when the drawer is initialized and ready for interaction
 * @fires ps-show - Emitted when the drawer opens
 * @fires ps-after-show - Emitted after the drawer opens and all animations complete
 * @fires ps-hide - Emitted when the drawer closes
 * @fires ps-after-hide - Emitted after the drawer closes and all animations complete
 * @fires ps-initial-focus - Emitted when the drawer is about to receive focus. Call event.preventDefault() to set focus yourself
 * @fires ps-request-close - Emitted when the user attempts to close the drawer (via overlay click, escape key, or close button). Call event.preventDefault() to prevent closing. detail: {source: 'close-button' | 'keyboard' | 'overlay'}
 *
 * @attr {number} autofocus-skip - Number of focusable elements to skip when setting initial focus. Useful to skip the close button and focus the first link instead. Default: 0
 *
 * @cssprop --size - The preferred size of the drawer (width for left/right, height for top/bottom). Default: 25rem for sides, 100% for top/bottom
 * @cssprop --header-spacing - The amount of padding to use for the header. Default: 1.5rem
 * @cssprop --body-spacing - The amount of padding to use for the body. Default: 1.5rem
 * @cssprop --footer-spacing - The amount of padding to use for the footer. Default: 1.5rem
 * @cssprop --duration - Animation duration. Default: 250ms
 * @cssprop --easing - Animation easing function. Default: cubic-bezier(0.4, 0, 0.2, 1)
 *
 * @example
 * <hc-drawer label="Drawer" placement="right">
 *   Drawer content
 * </hc-drawer>
 *
 * @example
 * <hc-drawer label="Settings" placement="left" no-modal>
 *   <div slot="footer">
 *     <button>Cancel</button>
 *     <button>Save</button>
 *   </div>
 * </hc-drawer>
 *
 * @example
 * <!-- Skip close button and focus first link -->
 * <hc-drawer label="Navigation" placement="right" autofocus-skip="1">
 *   <a href="/home">Home</a>
 *   <a href="/about">About</a>
 * </hc-drawer>
 */
export class HcDrawer extends LitElement {
    static styles = css`
        /* Component variables */
        :host {
            --size: 25rem;
            --header-spacing: var(--space-md);
            --body-spacing: var(--space-md);
            --footer-spacing: var(--space-md);
            --duration: 250ms;
            --easing: cubic-bezier(0.4, 0, 0.2, 1);
            --overlay-color: rgba(0, 0, 0, 0.5);
            --color-bg: var(--color-bg);
            --color-foreground: var(--color-foreground);
            --color-border: var(--color-border);
        }

        /* Adjust default size for top/bottom placement */
        // :host([placement='top']),
        // :host([placement='bottom']) {
        //     --size: 100%;
        // }

        /* Drawer container */
        .drawer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            pointer-events: none;
        }

        /* Contained drawer positioning */
        :host([contained]) .drawer {
            position: absolute;
        }

        /* Visible state */
        .drawer[data-visible] {
            pointer-events: auto;
        }

        /* Overlay */
        .drawer-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-color);
            opacity: 0;
            transition: opacity var(--duration) var(--easing);
        }

        .drawer[data-visible] .drawer-overlay {
            opacity: 1;
        }

        /* Hide overlay when no-modal */
        :host([no-modal]) .drawer-overlay {
            display: none;
        }

        /* Panel */
        .drawer-panel {
            position: absolute;
            display: flex;
            flex-direction: column;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            transition: transform var(--duration) var(--easing);
            overflow: hidden;
            background-color: var(--color-bg);
            color: var(--color-foreground);
            border-color: var(--color-border);
        }

        /* Placement: Right (default) */
        .drawer[data-position='right'] .drawer-panel {
            top: 0;
            right: 0;
            max-width: var(--size);
            width: 100%;
            height: 100%;
            transform: translateX(100%);
        }

        .drawer[data-visible][data-position='right'] .drawer-panel {
            transform: translateX(0);
        }

        /* Placement: Left */
        .drawer[data-position='left'] .drawer-panel {
            top: 0;
            left: 0;
            max-width: var(--size);
            width: 100%;
            height: 100%;
            transform: translateX(-100%);
        }

        .drawer[data-visible][data-position='left'] .drawer-panel {
            transform: translateX(0);
        }

        /* Placement: Top */
        .drawer[data-position='top'] .drawer-panel {
            top: 0;
            left: 0;
            max-width: 100%;
            width: 100%
            height: var(--size);
            transform: translateY(-100%);
        }

        .drawer[data-visible][data-position='top'] .drawer-panel {
            transform: translateY(0);
        }

        /* Placement: Bottom */
        .drawer[data-position='bottom'] .drawer-panel {
            bottom: 0;
            left: 0;
            max-width: 100%;
            width: 100%;
            height: var(--size);
            transform: translateY(100%);
        }

        .drawer[data-visible][data-position='bottom'] .drawer-panel {
            transform: translateY(0);
        }

        /* Header */
        .drawer-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: var(--header-spacing);
        }

        /* Hide header when no-header attribute is present */
        :host([no-header]) .drawer-header {
            display: none;
        }

        /* Title */
        .drawer-title {
            flex: 1;
            margin: 0;
        }

        /* Header actions */
        .drawer-header-actions {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        /* Body */
        .drawer-body {
            flex: 1;
            padding: var(--body-spacing);
            overflow: auto;
        }

        /* Footer */
        .drawer-footer {
            padding: var(--footer-spacing);
        }

        /* Hide footer if empty */
        .drawer-footer:not(:has(*)) {
            display: none;
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
            .drawer-overlay,
            .drawer-panel {
                transition: none;
            }
        }
    `;

    /** Indicates whether the drawer is open */
    @property({ type: Boolean, reflect: true })
    open = false;

    /** The drawer's label as displayed in the header. Required for accessibility */
    @property({ type: String })
    label = '';

    /** The direction from which the drawer will open */
    @property({ type: String, reflect: true })
    placement: 'top' | 'right' | 'bottom' | 'left' = 'right';

    /**
     * By default, the drawer slides out of its containing block (usually the viewport).
     * Set this to true to make it slide out of its parent element instead.
     */
    @property({ type: Boolean, reflect: true })
    contained = false;

    /** Removes the header (including the close button) */
    @property({ type: Boolean, attribute: 'no-header', reflect: true })
    noHeader = false;

    /** Removes the overlay and disables modal behavior (focus trap, Escape to close) */
    @property({ type: Boolean, attribute: 'no-modal', reflect: true })
    noModal = false;

    /** Color scheme for theming the drawer */
    @property({ type: String, attribute: 'data-color-scheme', reflect: true })
    colorScheme?: string;

    /** Number of focusable elements to skip when setting initial focus (useful to skip close button). Default: 0 */
    @property({ type: Number, attribute: 'autofocus-skip', reflect: true })
    autofocusSkip = 0;

    @state()
    private isVisible = false;

    @state()
    private hasCustomHeader = false;

    @query('.drawer')
    private drawer!: HTMLElement;

    @query('.drawer-panel')
    private panel!: HTMLElement;

    @query('.drawer-overlay')
    private overlay!: HTMLElement;

    private originalTrigger: HTMLElement | null = null;
    private focusableElements: HTMLElement[] = [];
    private isTransitioning = false;
    private boundHandleKeyDown = this.handleKeyDown.bind(this);

    connectedCallback() {
        super.connectedCallback();

        // Handle initial open state
        if (this.open) {
            this.isVisible = true;
        }

        // Emit ready event
        const readyEvent = new CustomEvent('ps-ready', {
            bubbles: true,
            composed: true,
            cancelable: false,
        });
        this.dispatchEvent(readyEvent);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.handleClose();
    }

    render() {
        return html`
            <div
                class="drawer"
                data-visible=${this.isVisible ? '' : nothing}
                data-position=${this.placement}
                @click=${this.handleOverlayClick}
            >
                <div class="drawer-overlay" part="overlay"></div>
                <div
                    class="drawer-panel"
                    part="panel"
                    role="dialog"
                    aria-modal=${!this.noModal}
                    aria-label=${this.label}
                    data-color-scheme=${this.colorScheme || nothing}
                    tabindex="-1"
                >
                    <header class="drawer-header" part="header">
                        <slot name="header" @slotchange=${this.handleHeaderSlotChange}>
                            ${!this.hasCustomHeader
                                ? html`
                                      <div class="drawer-title" part="title">
                                          <slot name="label">${this.label}</slot>
                                      </div>
                                      <div class="drawer-header-actions" part="header-actions">
                                          <slot name="header-actions"></slot>
                                      </div>
                                      <slot name="close-button"></slot>
                                  `
                                : ''}
                        </slot>
                    </header>
                    <div class="drawer-body" part="body">
                        <slot></slot>
                    </div>
                    <footer class="drawer-footer" part="footer">
                        <slot name="footer"></slot>
                    </footer>
                </div>
            </div>
        `;
    }

    updated(changedProperties: Map<string, unknown>) {
        if (changedProperties.has('open')) {
            if (this.open) {
                this.handleOpen();
            } else {
                this.handleClose();
            }
        }
    }

    private handleHeaderSlotChange(e: Event) {
        const slot = e.target as HTMLSlotElement;
        const assignedElements = slot.assignedElements({ flatten: true });
        this.hasCustomHeader = assignedElements.length > 0;
    }

    /** Opens the drawer */
    async show() {
        if (this.open || this.isTransitioning) return;
        this.open = true;
    }

    /** Closes the drawer */
    async hide() {
        if (!this.open || this.isTransitioning) return;
        this.open = false;
    }

    private async handleOpen() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        this.originalTrigger = document.activeElement as HTMLElement;

        // Emit show event
        const showEvent = new CustomEvent('ps-show', {
            bubbles: true,
            composed: true,
            cancelable: false,
        });
        this.dispatchEvent(showEvent);

        // Make visible immediately for transition
        this.isVisible = true;

        // Set up focus trap
        if (!this.noModal && !this.contained) {
            this.setupFocusTrap();
        }

        // Wait for transition to complete
        await this.waitForTransition();

        // Set initial focus
        this.setInitialFocus();

        this.isTransitioning = false;

        // Emit after-show event
        const afterShowEvent = new CustomEvent('ps-after-show', {
            bubbles: true,
            composed: true,
            cancelable: false,
        });
        this.dispatchEvent(afterShowEvent);
    }

    private async handleClose() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;

        // Emit hide event
        const hideEvent = new CustomEvent('ps-hide', {
            bubbles: true,
            composed: true,
            cancelable: false,
        });
        this.dispatchEvent(hideEvent);

        // Start transition
        this.isVisible = false;

        // Wait for transition to complete
        await this.waitForTransition();

        // Clean up focus trap
        if (!this.noModal && !this.contained) {
            this.removeFocusTrap();
        }

        // Return focus to original trigger
        if (this.originalTrigger && typeof this.originalTrigger.focus === 'function') {
            this.originalTrigger.focus();
        }
        this.originalTrigger = null;

        this.isTransitioning = false;

        // Emit after-hide event
        const afterHideEvent = new CustomEvent('ps-after-hide', {
            bubbles: true,
            composed: true,
            cancelable: false,
        });
        this.dispatchEvent(afterHideEvent);
    }

    private waitForTransition(): Promise<void> {
        return new Promise(resolve => {
            const durationStr = getComputedStyle(this).getPropertyValue('--duration') || '250ms';
            const duration = parseFloat(durationStr);
            setTimeout(resolve, duration || 250);
        });
    }

    private requestClose(source: 'close-button' | 'keyboard' | 'overlay') {
        const requestCloseEvent = new CustomEvent('ps-request-close', {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: { source },
        });

        const shouldClose = this.dispatchEvent(requestCloseEvent);
        if (shouldClose) {
            this.hide();
        }
    }

    private handleOverlayClick(event: MouseEvent) {
        if (this.noModal || this.contained) return;

        // Only close if clicking directly on overlay, not panel
        if (event.target === this.drawer || event.target === this.overlay) {
            this.requestClose('overlay');
        }
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape' && !this.noModal && !this.contained) {
            event.stopPropagation();
            this.requestClose('keyboard');
        }

        // Handle Tab key for focus trapping
        if (event.key === 'Tab' && !this.noModal && !this.contained) {
            this.handleTabKey(event);
        }
    }

    private setInitialFocus() {
        // Emit initial focus event (preventable)
        const initialFocusEvent = new CustomEvent('ps-initial-focus', {
            bubbles: true,
            composed: true,
            cancelable: true,
        });

        if (!this.dispatchEvent(initialFocusEvent)) {
            return; // User prevented default, they'll handle focus themselves
        }

        // Update focusable elements list
        this.updateFocusableElements();

        // Focus element at autofocusSkip index, or panel if no focusable elements
        if (this.focusableElements.length > 0) {
            const focusIndex = Math.min(this.autofocusSkip, this.focusableElements.length - 1);
            this.focusableElements[focusIndex].focus();
        } else {
            this.panel.focus();
        }
    }

    private setupFocusTrap() {
        // Get all focusable elements within panel
        this.updateFocusableElements();

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Listen for keyboard events globally
        document.addEventListener('keydown', this.boundHandleKeyDown);
    }

    private removeFocusTrap() {
        this.focusableElements = [];
        document.body.style.overflow = '';

        // Remove keyboard listener
        document.removeEventListener('keydown', this.boundHandleKeyDown);
    }

    private updateFocusableElements() {
        const focusableSelectors = [
            'button:not([disabled])',
            '[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
        ].join(', ');

        const elements: HTMLElement[] = [];

        // Get focusable elements from Shadow DOM
        elements.push(...Array.from(this.panel.querySelectorAll<HTMLElement>(focusableSelectors)));

        // Get focusable elements from slotted content (Light DOM)
        const slots = this.panel.querySelectorAll('slot');
        slots.forEach(slot => {
            const assigned = slot.assignedElements({ flatten: true });
            assigned.forEach(el => {
                // Check if element itself is focusable
                if (el.matches(focusableSelectors)) {
                    elements.push(el as HTMLElement);
                }
                // Check for focusable descendants
                elements.push(...Array.from(el.querySelectorAll<HTMLElement>(focusableSelectors)));
            });
        });

        this.focusableElements = elements;
    }

    private handleTabKey(event: KeyboardEvent) {
        this.updateFocusableElements();

        if (this.focusableElements.length === 0) {
            event.preventDefault();
            return;
        }

        const firstElement = this.focusableElements[0];
        const lastElement = this.focusableElements[this.focusableElements.length - 1];
        const activeElement = document.activeElement;

        // Check if focus is within our drawer (either Shadow DOM or slotted content)
        const isInDrawer = this.focusableElements.includes(activeElement as HTMLElement);

        if (event.shiftKey) {
            // Shift + Tab: Moving backwards
            if (activeElement === firstElement || !isInDrawer) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab: Moving forwards
            if (activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }
}

customElements.define('hc-drawer', HcDrawer);
