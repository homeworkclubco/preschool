import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * Share Web Component
 *
 * An accessible share button that uses the Web Share API when available,
 * with a fallback to clipboard copy. Follows WAI-ARIA Button Pattern.
 *
 * @element ps-share
 *
 * @slot - Default slot for custom button content (overrides default share button)
 *
 * @fires ps-share-success - Fired when content is successfully shared via Web Share API
 * @fires ps-share-copy - Fired when content is copied to clipboard (fallback)
 * @fires ps-share-error - Fired when sharing or copying fails
 *
 * @cssprop --ps-share-bg - Background color of the share button
 * @cssprop --ps-share-bg-hover - Background color on hover
 * @cssprop --ps-share-bg-active - Background color when active
 * @cssprop --ps-share-color - Text color of the share button
 * @cssprop --ps-share-color-hover - Text color on hover
 * @cssprop --ps-share-border-color - Border color
 * @cssprop --ps-share-border-radius - Border radius
 * @cssprop --ps-share-padding-block - Vertical padding
 * @cssprop --ps-share-padding-inline - Horizontal padding
 * @cssprop --ps-share-gap - Gap between icon and text
 * @cssprop --ps-share-font-size - Font size
 * @cssprop --ps-share-font-weight - Font weight
 * @cssprop --ps-share-icon-size - Icon size
 * @cssprop --ps-share-icon-color - Icon color
 * @cssprop --ps-share-focus-ring-color - Focus ring color
 * @cssprop --ps-share-focus-ring-offset - Focus ring offset
 * @cssprop --ps-share-feedback-bg - Feedback tooltip background
 * @cssprop --ps-share-feedback-color - Feedback tooltip text color
 * @cssprop --ps-share-feedback-duration - Animation duration for feedback
 * @cssprop --ps-share-feedback-offset - Distance of feedback from button
 *
 * @csspart share-button - The default share button element
 * @csspart share-icon - The share icon SVG
 * @csspart feedback - The copy feedback notification element
 *
 * @example
 * <ps-share
 *   label="Share this article"
 *   url="https://example.com"
 *   text="Check out this article!">
 * </ps-share>
 *
 * @example
 * <ps-share
 *   label="Share"
 *   text="Hello World"
 *   feedback-placement="top">
 *   <button slot="default">Custom Share Button</button>
 * </ps-share>
 */
export class PsShare extends LitElement {
    // Disable Shadow DOM to allow external styles to penetrate
    protected createRenderRoot() {
        return this;
    }

    /**
     * Human-readable description of the content being shared
     */
    @property({ type: String })
    label = 'Share';

    /**
     * URL to share
     */
    @property({ type: String })
    url = '';

    /**
     * Text content to share
     */
    @property({ type: String })
    text = '';

    /**
     * Array of File objects to share (property only, not an attribute)
     */
    @property({ type: Array })
    files: File[] = [];

    /**
     * Disables the share functionality
     */
    @property({ type: Boolean, reflect: true })
    disabled = false;

    /**
     * Placement of the copy feedback animation
     */
    @property({ type: String, attribute: 'feedback-placement' })
    feedbackPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top';

    /**
     * Custom feedback message
     */
    @property({ type: String, attribute: 'feedback-text' })
    feedbackText = 'Copied!';

    @state()
    private _showFeedback = false;

    @state()
    private _hasSlottedContent = false;

    @state()
    private _canShare = false;

    @state()
    private _isSecureContext = false;

    private _feedbackTimeout: number | null = null;

    connectedCallback() {
        super.connectedCallback();
        this._checkCapabilities();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._clearFeedbackTimeout();
    }

    /**
     * Check for Web Share API support and secure context
     */
    private _checkCapabilities() {
        this._isSecureContext =
            typeof window !== 'undefined' && window.isSecureContext;
        this._canShare =
            this._isSecureContext &&
            typeof navigator !== 'undefined' &&
            'share' in navigator;
    }

    /**
     * Handle slot change to detect custom button content
     */
    private _handleSlotChange(e: Event) {
        const slot = e.target as HTMLSlotElement;
        const nodes = slot.assignedNodes({ flatten: true });
        this._hasSlottedContent = nodes.length > 0;
    }

    /**
     * Handle share button click
     */
    private async _handleShare(e: Event) {
        e.preventDefault();

        if (this.disabled) {
            return;
        }

        // Prepare share data
        const shareData: ShareData = {};

        if (this.label) {
            shareData.title = this.label;
        }

        if (this.text) {
            shareData.text = this.text;
        }

        if (this.url) {
            shareData.url = this.url;
        }

        if (this.files && this.files.length > 0) {
            shareData.files = this.files;
        }

        // Try Web Share API first
        if (this._canShare && navigator.share) {
            try {
                // Check if we can share files
                if (
                    shareData.files &&
                    shareData.files.length > 0 &&
                    navigator.canShare &&
                    !navigator.canShare(shareData)
                ) {
                    // Files not supported, try without files
                    delete shareData.files;
                }

                await navigator.share(shareData);

                this.dispatchEvent(
                    new CustomEvent('ps-share-success', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            method: 'web-share-api',
                            data: shareData,
                        },
                    })
                );

                // Announce to screen readers
                this._announceToScreenReader('Content shared successfully');
            } catch (error) {
                // User cancelled or error occurred
                if (error instanceof Error && error.name === 'AbortError') {
                    // User cancelled, don't show error or fallback
                    return;
                }

                // Other errors, try fallback
                this._fallbackToCopy(shareData, error);
            }
        } else {
            // Web Share API not available, use clipboard fallback
            this._fallbackToCopy(shareData);
        }
    }

    /**
     * Fallback to copying content to clipboard
     */
    private async _fallbackToCopy(shareData: ShareData, error?: unknown) {
        // Build text to copy
        const parts: string[] = [];

        if (shareData.title) {
            parts.push(shareData.title);
        }

        if (shareData.text) {
            parts.push(shareData.text);
        }

        if (shareData.url) {
            parts.push(shareData.url);
        }

        const textToCopy = parts.join('\n\n');

        if (!textToCopy) {
            this._dispatchError('No content to copy', error);
            return;
        }

        try {
            if (
                this._isSecureContext &&
                navigator.clipboard &&
                navigator.clipboard.writeText
            ) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                // Fallback for non-secure contexts
                this._fallbackCopyToClipboard(textToCopy);
            }

            // Show feedback
            this._showCopyFeedback();

            this.dispatchEvent(
                new CustomEvent('ps-share-copy', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        method: 'clipboard',
                        text: textToCopy,
                    },
                })
            );

            // Announce to screen readers
            this._announceToScreenReader(this.feedbackText);
        } catch (copyError) {
            this._dispatchError('Failed to copy to clipboard', copyError);
        }
    }

    /**
     * Legacy clipboard copy for non-secure contexts
     */
    private _fallbackCopyToClipboard(text: string) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.setAttribute('aria-hidden', 'true');

        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    /**
     * Show copy feedback animation
     */
    private _showCopyFeedback() {
        this._clearFeedbackTimeout();
        this._showFeedback = true;

        this._feedbackTimeout = window.setTimeout(
            () => {
                this._showFeedback = false;
                this._feedbackTimeout = null;
            },
            parseInt(
                getComputedStyle(this).getPropertyValue(
                    '--_ps-share-feedback-duration'
                )
            ) || 2000
        );
    }

    /**
     * Clear feedback timeout
     */
    private _clearFeedbackTimeout() {
        if (this._feedbackTimeout !== null) {
            window.clearTimeout(this._feedbackTimeout);
            this._feedbackTimeout = null;
        }
    }

    /**
     * Dispatch error event
     */
    private _dispatchError(message: string, error?: unknown) {
        this.dispatchEvent(
            new CustomEvent('ps-share-error', {
                bubbles: true,
                composed: true,
                detail: {
                    message,
                    error,
                },
            })
        );

        // Announce to screen readers
        this._announceToScreenReader(`Error: ${message}`);

        // Log to console for debugging
        console.error(`[ps-share] ${message}`, error);
    }

    /**
     * Announce message to screen readers
     */
    private _announceToScreenReader(message: string) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        this.shadowRoot?.appendChild(announcement);

        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }

    /**
     * Default share icon SVG
     */
    private _renderShareIcon() {
        return html`
            <div class="icon">
                <svg
                    part="share-icon"
                    class="share-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                </svg>
            </div>
        `;
    }

    render() {
        const feedbackClasses = {
            'ps-share-feedback': true,
            show: this._showFeedback,
            [`placement-${this.feedbackPlacement}`]: true,
        };

        return html`
            <slot @slotchange=${this._handleSlotChange}>
                <!-- Default share button -->
                <button
                    class="btn is-icon"
                    type="button"
                    @click=${this._handleShare}
                    ?disabled=${this.disabled}
                    aria-label=${this.label}
                    aria-disabled=${this.disabled ? 'true' : 'false'}
                >
                    ${this._renderShareIcon()}
                    <span>${this.label}</span>
                </button>
            </slot>

            <!-- Copy feedback notification -->
            ${this._showFeedback
                ? html`
                      <div
                          class=${classMap(feedbackClasses)}
                          role="status"
                          aria-live="polite"
                      >
                          ${this.feedbackText}
                      </div>
                  `
                : nothing}
        `;
    }

    /**
     * Public method to programmatically trigger share
     */
    public async share() {
        if (!this.disabled) {
            await this._handleShare(new Event('click'));
        }
    }
}

// Register the custom element
customElements.define('ps-share', PsShare);
