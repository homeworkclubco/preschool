import { LitElement, html, nothing, css, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * Modal Web Component - Rewritten based on Micromodal architecture
 *
 * A centered modal dialog overlay for confirmations, forms, alerts, and content display.
 *
 * @element hc-modal
 *
 * @slot - The modal's main content (body)
 * @slot header - Completely overrides the default header
 * @slot label - The modal's label (alternative to label attribute)
 * @slot header-actions - Optional actions to add to the header
 * @slot close-button - Custom close button that appears in header
 * @slot footer - The modal's footer, typically used for action buttons
 */
export class HcModal extends LitElement {
    static styles = css`
        /* Component variables */
        :host {
            /* Public API - can be customized */
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
            --max-height: calc(100vh - var(--space-lg, 2rem) * 2);
            --border-radius: var(--radius-sm, 0.25rem);

            /* Pseudo-private - internal use, inherit from global tokens */
            --_color-bg: var(--color-bg, #ffffff);
            --_color-foreground: var(--color-foreground, #000000);
            --_color-border: var(--color-border, #e5e5e5);
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
            z-index: 1;
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
            background-color: var(--_color-bg, #ffffff);
            color: var(--_color-foreground);
            border-radius: var(--border-radius);
            overflow: hidden;
            opacity: 0;
            transform: translateY(1rem) scale(0.95);
            transition:
                opacity var(--duration) var(--easing),
                transform var(--duration) var(--easing);
            z-index: 2;
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
            // border-bottom: 1px solid var(--_color-border);
        }

        /* Hide header when no-header attribute is present */
        :host([no-header]) .modal-header {
            display: none;
        }

        /* Title */
        .modal-title {
            flex: 1;
            margin: 0;
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
            // border-top: 1px solid var(--_color-border);
        }

        /* Hide footer if empty */
        .modal-footer:not(:has(*)) {
            display: none;
        }

        /* Animation variants */
        :host([animation='fade']) .modal-panel {
            transform: none;
        }

        :host([animation='fade']) .modal[data-visible] .modal-panel {
            transform: none;
        }

        :host([animation='slide-up']) .modal-panel {
            transform: translateY(2rem);
        }

        :host([animation='slide-up']) .modal[data-visible] .modal-panel {
            transform: translateY(0);
        }

        :host([animation='zoom']) .modal-panel {
            transform: scale(0.8);
        }

        :host([animation='zoom']) .modal[data-visible] .modal-panel {
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

    // Pre-bind handlers (Micromodal pattern - prevents memory leaks)
    private boundHandleClick = this.handleClick.bind(this);
    private boundHandleKeydown = this.handleKeydown.bind(this);

    // State for focus management and scroll lock
    private scrollY = 0;
    private previouslyFocused: HTMLElement | null = null;

    // Static trigger setup (one-time global setup)
    private static triggersInitialized = false;

    static initializeTriggers() {
        if (this.triggersInitialized) return;
        this.triggersInitialized = true;

        // Global click delegation for data-modal triggers
        document.addEventListener('click', (e: MouseEvent) => {
            const trigger = (e.target as HTMLElement).closest('[data-modal]');
            if (!trigger) return;

            const modalId = trigger.getAttribute('data-modal');
            if (!modalId) return;

            const modal = document.getElementById(modalId) as HcModal | null;
            if (modal && modal.tagName === 'HC-MODAL') {
                e.preventDefault();
                modal.show();
            }
        });
    }

    connectedCallback() {
        super.connectedCallback();
        // Initialize triggers once when first modal connects
        HcModal.initializeTriggers();

        // Emit ready event
        this.dispatchEvent(
            new CustomEvent('ps-ready', {
                bubbles: true,
                composed: true,
                cancelable: false,
            })
        );
    }

    firstUpdated() {
        // Set up click listener once, on the component itself
        this.addEventListener('click', this.boundHandleClick);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Clean up all listeners
        this.removeEventListener('click', this.boundHandleClick);
        document.removeEventListener('keydown', this.boundHandleKeydown);
    }

    updated(changed: PropertyValues) {
        // Only manage keyboard listener and modal state based on open property
        if (changed.has('open')) {
            if (this.open) {
                this.onOpen();
            } else {
                this.onClose();
            }
        }
    }

    private onOpen() {
        // Store previous focus
        this.previouslyFocused = document.activeElement as HTMLElement;

        // Lock scroll (unless no-modal mode)
        if (!this.noModal) {
            this.scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${this.scrollY}px`;
            document.body.style.width = '100%';
        }

        // Set initial focus using requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            const focusable = this.getFocusableElements();
            const autofocus = focusable.find(el => el.hasAttribute('autofocus'));
            const firstFocusable = autofocus || focusable[0];

            if (firstFocusable) {
                firstFocusable.focus();
            } else {
                // Focus the panel itself if no focusable elements
                const panel = this.shadowRoot?.querySelector('.modal-panel') as HTMLElement;
                panel?.focus();
            }
        });

        // Add keyboard listener
        document.addEventListener('keydown', this.boundHandleKeydown);

        // Emit events
        this.dispatchEvent(new CustomEvent('ps-show', { bubbles: true, composed: true }));

        // Emit after-show event after animation completes
        const duration = parseFloat(getComputedStyle(this).getPropertyValue('--duration') || '250ms');
        setTimeout(() => {
            this.dispatchEvent(new CustomEvent('ps-after-show', { bubbles: true, composed: true }));
        }, duration);
    }

    private onClose() {
        // Unlock scroll
        if (!this.noModal) {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, this.scrollY);
        }

        // Restore focus
        if (this.previouslyFocused && typeof this.previouslyFocused.focus === 'function') {
            this.previouslyFocused.focus();
        }
        this.previouslyFocused = null;

        // Remove keyboard listener
        document.removeEventListener('keydown', this.boundHandleKeydown);

        // Emit events
        this.dispatchEvent(new CustomEvent('ps-hide', { bubbles: true, composed: true }));

        // Emit after-hide event after animation completes
        const duration = parseFloat(getComputedStyle(this).getPropertyValue('--duration') || '250ms');
        setTimeout(() => {
            this.dispatchEvent(new CustomEvent('ps-after-hide', { bubbles: true, composed: true }));
        }, duration);
    }

    private handleClick(e: MouseEvent) {
        const target = e.target as HTMLElement;

        // Check for data-close attribute (Micromodal delegation pattern)
        if (target.closest('[data-close]')) {
            this.requestClose('data-close');
            return;
        }

        // Check for overlay click
        if (target.classList.contains('modal-overlay') && this.overlayDismiss) {
            this.requestClose('overlay');
        }
    }

    private handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape' && !this.noModal) {
            this.requestClose('keyboard');
        }

        // Handle Tab for focus trapping
        if (e.key === 'Tab' && !this.noModal) {
            this.handleTabKey(e);
        }
    }

    private handleTabKey(e: KeyboardEvent) {
        const focusable = this.getFocusableElements();
        if (focusable.length === 0) {
            e.preventDefault();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            // Shift+Tab on first element - wrap to last
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            // Tab on last element - wrap to first
            e.preventDefault();
            first.focus();
        }
    }

    private getFocusableElements(): HTMLElement[] {
        const selector = [
            'a[href]',
            'area[href]',
            'input:not([disabled]):not([type="hidden"])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'button:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            'iframe',
            'object',
            'embed',
            '[contenteditable]',
        ].join(',');

        const elements: HTMLElement[] = [];

        // Get from shadow DOM
        const shadowElements = Array.from(this.shadowRoot!.querySelectorAll(selector)) as HTMLElement[];
        elements.push(...shadowElements);

        // Get from slotted content (Light DOM)
        const slots = Array.from(this.shadowRoot!.querySelectorAll('slot'));
        slots.forEach(slot => {
            slot.assignedElements({ flatten: true }).forEach(el => {
                if (el.matches(selector)) {
                    elements.push(el as HTMLElement);
                }
                // Also check descendants
                const descendants = Array.from(el.querySelectorAll(selector)) as HTMLElement[];
                elements.push(...descendants);
            });
        });

        // Filter to only visible elements (Micromodal pattern)
        return elements.filter(el => {
            return el.offsetParent !== null && !el.hasAttribute('aria-hidden');
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

    render() {
        return html`
            <div class="modal" part="base" ?data-visible=${this.open}>
                <div class="modal-overlay" part="overlay"></div>
                <div
                    class="modal-panel"
                    part="panel"
                    role="dialog"
                    aria-modal=${!this.noModal}
                    aria-label=${this.label}
                    tabindex="-1"
                >
                    <header class="modal-header" part="header">
                        <slot name="header">
                            <div class="modal-title" part="title">
                                <slot name="label">${this.label}</slot>
                            </div>
                            <div class="modal-header-actions" part="header-actions">
                                <slot name="header-actions"></slot>
                            </div>
                            ${!this.noCloseButton ? html`<slot name="close-button"></slot>` : nothing}
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

    /** Opens the modal */
    show() {
        if (this.open) return;
        this.open = true;
    }

    /** Closes the modal */
    hide() {
        if (!this.open) return;
        this.open = false;
    }
}

if (!customElements.get('hc-modal')) {
    customElements.define('hc-modal', HcModal);
}
