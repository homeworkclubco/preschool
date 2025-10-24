import { LitElement, html, css } from 'lit'

/**
 * Dropdown Web Component
 *
 * A framework-agnostic dropdown menu component built with Lit
 *
 * @element ps-dropdown
 *
 * @slot trigger - The trigger button/element
 * @slot content - The dropdown menu content
 *
 * @fires ps-dropdown-open - Fired when dropdown opens
 * @fires ps-dropdown-close - Fired when dropdown closes
 *
 * @example
 * <ps-dropdown>
 *   <button slot="trigger">Open Menu</button>
 *   <div slot="content">
 *     <a href="#">Option 1</a>
 *     <a href="#">Option 2</a>
 *   </div>
 * </ps-dropdown>
 */
export class Dropdown extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true }
  }

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
  `

  constructor() {
    super()
    this.open = false
  }

  connectedCallback() {
    super.connectedCallback()
    this._handleDocumentClick = this._handleDocumentClick.bind(this)
    this._handleEscape = this._handleEscape.bind(this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._removeDocumentListeners()
  }

  render() {
    return html`
      <div class="trigger" @click=${this._toggle}>
        <slot name="trigger"></slot>
      </div>
      <div class="content" role="menu">
        <slot name="content"></slot>
      </div>
    `
  }

  _toggle() {
    this.open = !this.open

    if (this.open) {
      this._addDocumentListeners()
      this.dispatchEvent(new CustomEvent('ps-dropdown-open', {
        bubbles: true,
        composed: true
      }))
    } else {
      this._removeDocumentListeners()
      this.dispatchEvent(new CustomEvent('ps-dropdown-close', {
        bubbles: true,
        composed: true
      }))
    }
  }

  _addDocumentListeners() {
    setTimeout(() => {
      document.addEventListener('click', this._handleDocumentClick)
      document.addEventListener('keydown', this._handleEscape)
    }, 0)
  }

  _removeDocumentListeners() {
    document.removeEventListener('click', this._handleDocumentClick)
    document.removeEventListener('keydown', this._handleEscape)
  }

  _handleDocumentClick(e) {
    if (!this.contains(e.target)) {
      this.open = false
      this._removeDocumentListeners()
      this.dispatchEvent(new CustomEvent('ps-dropdown-close', {
        bubbles: true,
        composed: true
      }))
    }
  }

  _handleEscape(e) {
    if (e.key === 'Escape' && this.open) {
      this.open = false
      this._removeDocumentListeners()
      this.dispatchEvent(new CustomEvent('ps-dropdown-close', {
        bubbles: true,
        composed: true
      }))
    }
  }
}

customElements.define('ps-dropdown', Dropdown)
