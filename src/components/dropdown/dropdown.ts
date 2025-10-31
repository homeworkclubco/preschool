import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * Dropdown Web Component
 *
 * A framework-agnostic dropdown menu component built with Lit
 *
 * @element hc-dropdown
 *
 * @slot trigger - The trigger button/element
 * @slot content - The dropdown menu content
 *
 * @fires hc-dropdown-open - Fired when dropdown opens
 * @fires hc-dropdown-close - Fired when dropdown closes
 *
 * @example
 * <hc-dropdown>
 *   <button slot="trigger">Open Menu</button>
 *   <div slot="content">
 *     <a href="#">Option 1</a>
 *     <a href="#">Option 2</a>
 *   </div>
 * </hc-dropdown>
 */
export class Dropdown extends LitElement {
    @property({ type: Boolean, reflect: true })
    open = false;

    static styles = css`
        :host {
            position: relative;
            display: inline-block;
        }

        .trigger {
            display: contents;
        }

        .content {
            position: absolute;
            top: calc(100% + var(--space-2xs, 0.5rem));
            left: 0;
            z-index: 1000;
            min-width: 12rem;
            padding: var(--space-xs, 0.75rem);
            background-color: var(--color-bg-alt, #f9fafb);
            border: 1px solid var(--color-border, #e5e7eb);
            border-radius: var(--radius-md, 0.5rem);
            box-shadow: var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1));
            opacity: 0;
            visibility: hidden;
            transform: translateY(-0.5rem);
            transition: all 0.2s ease;
        }

        :host([open]) .content {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        ::slotted(*) {
            display: block;
        }
    `;

    private _handleDocumentClick = this._handleDocumentClickImpl.bind(this);
    private _handleEscape = this._handleEscapeImpl.bind(this);

    connectedCallback(): void {
        super.connectedCallback();
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this._removeDocumentListeners();
    }

    render() {
        return html`
            <div class="trigger" @click=${this._toggle}>
                <slot name="trigger"></slot>
            </div>
            <div class="content" role="menu">
                <slot name="content"></slot>
            </div>
        `;
    }

    private _toggle(): void {
        this.open = !this.open;

        if (this.open) {
            this._addDocumentListeners();
            this.dispatchEvent(
                new CustomEvent('hc-dropdown-open', {
                    bubbles: true,
                    composed: true,
                })
            );
        } else {
            this._removeDocumentListeners();
            this.dispatchEvent(
                new CustomEvent('hc-dropdown-close', {
                    bubbles: true,
                    composed: true,
                })
            );
        }
    }

    private _addDocumentListeners(): void {
        setTimeout(() => {
            document.addEventListener('click', this._handleDocumentClick);
            document.addEventListener('keydown', this._handleEscape);
        }, 0);
    }

    private _removeDocumentListeners(): void {
        document.removeEventListener('click', this._handleDocumentClick);
        document.removeEventListener('keydown', this._handleEscape);
    }

    private _handleDocumentClickImpl(e: MouseEvent): void {
        if (!this.contains(e.target as Node)) {
            this.open = false;
            this._removeDocumentListeners();
            this.dispatchEvent(
                new CustomEvent('hc-dropdown-close', {
                    bubbles: true,
                    composed: true,
                })
            );
        }
    }

    private _handleEscapeImpl(e: KeyboardEvent): void {
        if (e.key === 'Escape' && this.open) {
            this.open = false;
            this._removeDocumentListeners();
            this.dispatchEvent(
                new CustomEvent('hc-dropdown-close', {
                    bubbles: true,
                    composed: true,
                })
            );
        }
    }
}

customElements.define('hc-dropdown', Dropdown);
