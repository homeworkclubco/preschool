import { LitElement, html, nothing, css } from 'lit';
import { property, query, state } from 'lit/decorators.js';

/**
 * Modal Web Component
 *
 * A centered modal dialog overlay for confirmations, forms, alerts, and content display.
 *
 * @element hc-modal
 *
 * @slot - The modal's main content (body)
 * @slot header - Completely overrides the default header. When used, label, header-actions, and close-button slots are not rendered
 * @slot label - The modal's label (alternative to label attribute)
 * @slot header-actions - Optional actions to add to the header (e.g., buttons, icons)
 * @slot close-button - Custom close button that appears in header. Should have @click handler that calls modal.hide()
 * @slot footer - The modal's footer, typically used for action buttons
 *
 * @fires ps-ready - Emitted when the modal is initialized and ready for interaction
 * @fires ps-show - Emitted when the modal opens
 * @fires ps-after-show - Emitted after the modal opens and all animations complete
 * @fires ps-hide - Emitted when the modal closes
 * @fires ps-after-hide - Emitted after the modal closes and all animations complete
 * @fires ps-initial-focus - Emitted when the modal is about to receive focus. Call event.preventDefault() to set focus yourself
 * @fires ps-request-close - Emitted when the user attempts to close the modal (via overlay click, escape key, or close button). Call event.preventDefault() to prevent closing. detail: {source: 'close-button' | 'keyboard' | 'overlay' | 'data-close'}
 *
 * @cssprop --size-sm - Small modal width. Default: 20rem
 * @cssprop --size-md - Medium modal width. Default: 32rem
 * @cssprop --size-lg - Large modal width. Default: 48rem
 * @cssprop --size-xl - Extra large modal width. Default: 64rem
 * @cssprop --size-full - Full width modal (with margins). Default: calc(100vw - var(--space-lg) * 2)
 * @cssprop --header-spacing - The amount of padding to use for the header. Default: 1.5rem
 * @cssprop --body-spacing - The amount of padding to use for the body. Default: 1.5rem
 * @cssprop --footer-spacing - The amount of padding to use for the footer. Default: 1.5rem
 * @cssprop --duration - Animation duration. Default: 250ms
 * @cssprop --easing - Animation easing function. Default: cubic-bezier(0.4, 0, 0.2, 1)
 * @cssprop --overlay-color - Overlay background color. Default: rgba(0, 0, 0, 0.5)
 * @cssprop --max-height - Maximum modal height. Default: calc(100vh - var(--space-lg) * 2)
 * @cssprop --border-radius - Modal border radius. Default: var(--radius-lg)
 *
 * @example
 * <!-- Declarative trigger using data-modal -->
 * <button data-modal="my-modal">Open Modal</button>
 *
 * <hc-modal id="my-modal" label="Confirm Action">
 *   <p>Are you sure?</p>
 *   <div slot="footer">
 *     <button data-close>Cancel</button>
 *     <button>Confirm</button>
 *   </div>
 * </hc-modal>
 *
 * @example
 * <!-- Programmatic trigger -->
 * <button onclick="document.getElementById('settings-modal').show()">Open Settings</button>
 *
 * <hc-modal id="settings-modal" label="Settings" size="lg">
 *   <form>...</form>
 *   <div slot="footer">
 *     <button data-close>Cancel</button>
 *     <button>Save</button>
 *   </div>
 * </hc-modal>
 */
export class HcModal extends LitElement {
    static styles = css`
        /* Component variables */
        :host {
            --size-sm: 20rem;
            --size-md: 32rem;
            --size-lg: 48rem;
            --size-xl: 64rem;
            --size-full: calc(100vw - var(--space-lg, 2rem) * 2);
            --header-spacing: var(--space-md, 1.5rem);
            --body-spacing: var(--space-md, 1.5rem);
            --footer-spacing: var(--space-md, 1.5rem);
            --duration: 250ms;
            --easing: cubic-bezier(0.4, 0, 0.2, 1);
            --overlay-color: rgba(0, 0, 0, 0.5);
            --color-bg: var(--color-bg, #ffffff);
            --color-foreground: var(--color-foreground, #000000);
            --color-border: var(--color-border, #e5e5e5);
            --max-height: calc(100vh - var(--space-lg, 2rem) * 2);
            --border-radius: var(--radius-lg, 0.5rem);
        }

        /* Modal container */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: var(--space-lg, 2rem);
        }

        /* Visible state */
        .modal[data-visible] {
            pointer-events: auto;
        }

        /* Overlay */
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-color);
            opacity: 0;
            transition: opacity var(--duration) var(--easing);
        }

        .modal[data-visible] .modal-overlay {
            opacity: 1;
        }

        /* Hide overlay when no-modal */
        :host([no-modal]) .modal-overlay {
            display: none;
        }

        /* Panel */
        .modal-panel {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: var(--size-md);
            max-height: var(--max-height);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            background-color: var(--color-bg);
            color: var(--color-foreground);
            border-radius: var(--border-radius);
            overflow: hidden;
            opacity: 0;
            transform: translateY(1rem) scale(0.95);
            transition: opacity var(--duration) var(--easing),
                transform var(--duration) var(--easing);
        }

        .modal[data-visible] .modal-panel {
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        /* Size variants */
        :host([size='sm']) .modal-panel {
            max-width: var(--size-sm);
        }

        :host([size='md']) .modal-panel {
            max-width: var(--size-md);
        }

        :host([size='lg']) .modal-panel {
            max-width: var(--size-lg);
        }

        :host([size='xl']) .modal-panel {
            max-width: var(--size-xl);
        }

        :host([size='full']) .modal-panel {
            max-width: var(--size-full);
        }

        /* Mobile full-screen */
        @media (max-width: 768px) {
            .modal {
                padding: 0;
            }

            .modal-panel {
                width: 100%;
                max-width: 100%;
                height: 100%;
                max-height: 100%;
                border-radius: 0;
            }
        }

        /* Vertical alignment */
        :host([vertical-align='top']) .modal {
            align-items: flex-start;
        }

        :host([vertical-align='center']) .modal {
            align-items: center;
        }

        :host([vertical-align='bottom']) .modal {
            align-items: flex-end;
        }

        /* Header */
        .modal-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: var(--header-spacing);
            border-bottom: 1px solid var(--color-border);
        }

        /* Hide header when no-header attribute is present */
        :host([no-header]) .modal-header {
            display: none;
        }

        /* Title */
        .modal-title {
            flex: 1;
            margin: 0;
            font-size: 1.25rem;
            font-weight: 600;
        }

        /* Header actions */
        .modal-header-actions {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        /* Body */
        .modal-body {
            flex: 1;
            padding: var(--body-spacing);
            overflow: auto;
        }

        /* Footer */
        .modal-footer {
            padding: var(--footer-spacing);
            border-top: 1px solid var(--color-border);
        }

        /* Hide footer if empty */
        .modal-footer:not(:has(*)) {
            display: none;
        }

        /* Animation variants */
        :host([animation='fade']) .modal-panel {
            transform: none;
        }

        :host([animation='fade'][data-visible]) .modal-panel {
            transform: none;
        }

        :host([animation='slide-up']) .modal-panel {
            transform: translateY(2rem);
        }

        :host([animation='slide-up'][data-visible]) .modal-panel {
            transform: translateY(0);
        }

        :host([animation='zoom']) .modal-panel {
            transform: scale(0.8);
        }

        :host([animation='zoom'][data-visible]) .modal-panel {
            transform: scale(1);
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
            .modal-overlay,
            .modal-panel {
                transition: none;
            }
        }
    `;

    /** Indicates whether the modal is open */
    @property({ type: Boolean, reflect: true })
    open = false;

    /** The modal's label as displayed in the header. Required for accessibility */
    @property({ type: String })
    label = '';

    /** Size of the modal */
    @property({ type: String, reflect: true })
    size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';

    /** Vertical alignment of the modal */
    @property({ type: String, attribute: 'vertical-align', reflect: true })
    verticalAlign: 'top' | 'center' | 'bottom' = 'center';

    /** Removes the header (including the close button) */
    @property({ type: Boolean, attribute: 'no-header', reflect: true })
    noHeader = false;

    /** Hides the default close button in the header */
    @property({ type: Boolean, attribute: 'no-close-button', reflect: true })
    noCloseButton = false;

    /** Removes the overlay and disables modal behavior (focus trap, Escape to close) */
    @property({ type: Boolean, attribute: 'no-modal', reflect: true })
    noModal = false;

    /** Allows clicking the overlay to close the modal */
    @property({ type: Boolean, attribute: 'overlay-dismiss', reflect: true })
    overlayDismiss = true;

    /** Animation variant */
    @property({ type: String, reflect: true })
    animation: 'fade-up' | 'fade' | 'slide-up' | 'zoom' = 'fade-up';

    /** Color scheme for theming the modal */
    @property({ type: String, attribute: 'data-color-scheme', reflect: true })
    colorScheme?: string;

    @state()
    private isVisible = false;

    @state()
    private hasCustomHeader = false;

    @query('.modal')
    private modal!: HTMLElement;

    @query('.modal-panel')
    private panel!: HTMLElement;

    @query('.modal-overlay')
    private overlay!: HTMLElement;

    private originalTrigger: HTMLElement | null = null;
    private focusableElements: HTMLElement[] = [];
    private isTransitioning = false;
    private boundHandleKeyDown = this.handleKeyDown.bind(this);
    private scrollY = 0;

    connectedCallback() {
        super.connectedCallback();

        // Handle initial open state
        if (this.open) {
            this.isVisible = true;
        }

        // DISABLED FOR DEBUGGING:
        // - Trigger setup
        // - Ready event

        // HcModal.setupTriggers();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.handleClose();
    }

    /**
     * Sets up global click handlers for data-modal triggers
     * This is called automatically when the first modal is connected
     * Triggers with data-modal="modal-id" will open the corresponding modal
     */
    private static triggersSetup = false;
    static setupTriggers() {
        if (this.triggersSetup) return;
        this.triggersSetup = true;

        // Handle clicks on elements with data-modal attribute
        document.addEventListener('click', (event: MouseEvent) => {
            const trigger = (event.target as HTMLElement).closest('[data-modal]');
            if (!trigger) return;

            const modalId = trigger.getAttribute('data-modal');
            if (!modalId) return;

            const modal = document.getElementById(modalId) as HcModal | null;
            if (modal && modal instanceof HcModal) {
                event.preventDefault();
                modal.show();
            }
        });
    }

    render() {
        return html`
            <div
                class="modal"
                data-visible=${this.isVisible ? '' : nothing}
            >
                <div class="modal-overlay" part="overlay"></div>
                <div
                    class="modal-panel"
                    part="panel"
                    role="dialog"
                    aria-modal=${!this.noModal}
                    aria-label=${this.label}
                    data-color-scheme=${this.colorScheme || nothing}
                    tabindex="-1"
                >
                    <header class="modal-header" part="header">
                        <slot name="header" @slotchange=${this.handleHeaderSlotChange}>
                            ${!this.hasCustomHeader
                                ? html`
                                      <div class="modal-title" part="title">
                                          <slot name="label">${this.label}</slot>
                                      </div>
                                      <div class="modal-header-actions" part="header-actions">
                                          <slot name="header-actions"></slot>
                                      </div>
                                      ${!this.noCloseButton
                                          ? html`<slot name="close-button"></slot>`
                                          : nothing}
                                  `
                                : nothing}
                        </slot>
                    </header>
                    <div class="modal-body" part="body">
                        <slot></slot>
                    </div>
                    <footer class="modal-footer" part="footer">
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
            } else if (changedProperties.get('open') === true) {
                // Only handle close if it was previously open
                this.handleClose();
            }
        }
    }

    private handleHeaderSlotChange(e: Event) {
        const slot = e.target as HTMLSlotElement;
        const assignedElements = slot.assignedElements({ flatten: true });
        this.hasCustomHeader = assignedElements.length > 0;
    }

    /** Opens the modal */
    async show() {
        if (this.open || this.isTransitioning) return;
        this.open = true;
    }

    /** Closes the modal */
    async hide() {
        if (!this.open || this.isTransitioning) return;
        this.open = false;
    }

    private async handleOpen() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;

        // Make visible immediately for transition
        this.isVisible = true;

        // DISABLED FOR DEBUGGING:
        // - Event emission
        // - Scroll lock
        // - Focus trap
        // - Initial focus
        // - Transition wait

        this.isTransitioning = false;
    }

    private async handleClose() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;

        // Start transition
        this.isVisible = false;

        // DISABLED FOR DEBUGGING:
        // - Event emission
        // - Transition wait
        // - Focus trap cleanup
        // - Scroll lock cleanup
        // - Focus restoration

        this.isTransitioning = false;
    }

    private waitForTransition(): Promise<void> {
        return new Promise(resolve => {
            const durationStr = getComputedStyle(this).getPropertyValue('--duration') || '250ms';
            const duration = parseFloat(durationStr);
            setTimeout(resolve, duration || 250);
        });
    }

    private requestClose(source: 'close-button' | 'keyboard' | 'overlay' | 'data-close') {
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
        if (this.noModal || !this.overlayDismiss) return;

        // Only close if clicking directly on modal container or overlay, not panel
        if (event.target === this.modal || event.target === this.overlay) {
            this.requestClose('overlay');
        }
    }

    private handlePanelClick(event: MouseEvent) {
        // Stop propagation to prevent overlay click handler from firing
        event.stopPropagation();

        // Check if clicked element or any parent has data-close attribute
        let target = event.target as HTMLElement;
        while (target && target !== this.panel) {
            if (target.hasAttribute('data-close')) {
                this.requestClose('data-close');
                return;
            }
            target = target.parentElement as HTMLElement;
        }
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape' && !this.noModal) {
            event.stopPropagation();
            this.requestClose('keyboard');
        }

        // Handle Tab key for focus trapping
        if (event.key === 'Tab' && !this.noModal) {
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

        // Priority: autofocus element, first focusable, panel itself
        const autofocusElement = this.focusableElements.find(el => el.hasAttribute('autofocus'));
        if (autofocusElement) {
            autofocusElement.focus();
        } else if (this.focusableElements.length > 0) {
            this.focusableElements[0].focus();
        } else {
            this.panel.focus();
        }
    }

    private setupScrollLock() {
        // Store current scroll position
        this.scrollY = window.scrollY;

        // Prevent body scroll
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollY}px`;
        document.body.style.width = '100%';
    }

    private removeScrollLock() {
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';

        // Restore scroll position
        window.scrollTo(0, this.scrollY);
    }

    private setupFocusTrap() {
        // Get all focusable elements within panel
        this.updateFocusableElements();

        // Listen for keyboard events globally
        document.addEventListener('keydown', this.boundHandleKeyDown);
    }

    private removeFocusTrap() {
        this.focusableElements = [];

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

        // Check if focus is within our modal (either Shadow DOM or slotted content)
        const isInModal = this.focusableElements.includes(activeElement as HTMLElement);

        if (event.shiftKey) {
            // Shift + Tab: Moving backwards
            if (activeElement === firstElement || !isInModal) {
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

if (!customElements.get('hc-modal')) {
    customElements.define('hc-modal', HcModal);
}
