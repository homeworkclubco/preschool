import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { HcAccordionItem } from '../accordion-item/accordion-item.js';

/**
 * Accordion Web Component
 *
 * An accessible container for collapsible content sections.
 * Follows WAI-ARIA Accordion Pattern.
 *
 * @element hc-accordion
 *
 * @slot - Default slot for hc-accordion-item elements
 *
 * @fires hc-before-expand - Fired before an item expands
 * @fires hc-expand - Fired when an item finishes expanding
 * @fires hc-before-collapse - Fired before an item collapses
 * @fires hc-collapse - Fired when an item finishes collapsing
 *
 * @example
 * <hc-accordion allow-multiple>
 *   <hc-accordion-item label="Section 1">Content 1</hc-accordion-item>
 *   <hc-accordion-item label="Section 2">Content 2</hc-accordion-item>
 * </hc-accordion>
 *
 * @example
 * <hc-accordion header-offset="150">
 *   <hc-accordion-item label="Section 1">Content 1</hc-accordion-item>
 *   <hc-accordion-item label="Section 2">Content 2</hc-accordion-item>
 * </hc-accordion>
 */
export class HcAccordion extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        ::slotted(hc-accordion-item) {
            display: block;
        }
    `;

    @property({ type: Boolean, attribute: 'allow-multiple' })
    allowMultiple = false;

    @property({ type: Number, attribute: 'header-offset' })
    headerOffset = 100;

    @state()
    private items: HcAccordionItem[] = [];

    private slotElement: HTMLSlotElement | null = null;

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener(
            'hc-toggle',
            this.handleItemToggle as EventListener
        );
        this.addEventListener('keydown', this.handleKeyDown as EventListener);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener(
            'hc-toggle',
            this.handleItemToggle as EventListener
        );
        this.removeEventListener(
            'keydown',
            this.handleKeyDown as EventListener
        );
    }

    render() {
        return html` <slot @slotchange=${this.handleSlotChange}></slot> `;
    }

    private handleSlotChange(e: Event) {
        const slot = e.target as HTMLSlotElement;
        this.slotElement = slot;
        this.updateItems();
    }

    private updateItems() {
        if (!this.slotElement) return;

        const nodes = this.slotElement.assignedElements({ flatten: true });
        this.items = nodes.filter(
            (node): node is HcAccordionItem =>
                node.tagName.toLowerCase() === 'hc-accordion-item'
        );
    }

    private handleItemToggle(e: CustomEvent) {
        e.stopPropagation();

        const item = e.target as HcAccordionItem;
        const willExpand = e.detail.expanded;

        if (willExpand) {
            // Fire before-expand event
            const beforeExpandEvent = new CustomEvent('hc-before-expand', {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: { item },
            });

            if (!this.dispatchEvent(beforeExpandEvent)) {
                // Event was cancelled
                e.preventDefault();
                return;
            }

            // Auto-collapse other items if allowMultiple is false
            if (!this.allowMultiple) {
                this.collapseOtherItems(item);
            }

            // Listen for expand completion
            const handleExpand = () => {
                this.dispatchEvent(
                    new CustomEvent('hc-expand', {
                        bubbles: true,
                        composed: true,
                        detail: { item },
                    })
                );
                item.removeEventListener('hc-expand', handleExpand);
            };
            item.addEventListener('hc-expand', handleExpand);
        } else {
            // Fire before-collapse event
            const beforeCollapseEvent = new CustomEvent('hc-before-collapse', {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: { item },
            });

            if (!this.dispatchEvent(beforeCollapseEvent)) {
                // Event was cancelled
                e.preventDefault();
                return;
            }

            // Listen for collapse completion
            const handleCollapse = () => {
                this.dispatchEvent(
                    new CustomEvent('hc-collapse', {
                        bubbles: true,
                        composed: true,
                        detail: { item },
                    })
                );
                item.removeEventListener('hc-collapse', handleCollapse);
            };
            item.addEventListener('hc-collapse', handleCollapse);
        }
    }

    private async collapseOtherItems(exceptItem: HcAccordionItem) {
        const otherExpandedItems = this.items.filter(
            item => item !== exceptItem && item.expanded && !item.disabled
        );

        const collapsePromises = otherExpandedItems.map(item => {
            return new Promise<void>(resolve => {
                const handleCollapse = () => {
                    item.removeEventListener('hc-collapse', handleCollapse);
                    resolve();
                };
                item.addEventListener('hc-collapse', handleCollapse);
                item.expanded = false;
            });
        });

        await Promise.allSettled(collapsePromises);
    }

    private handleKeyDown(e: KeyboardEvent) {
        const path = e.composedPath();
        const target = path[0] as HTMLElement;

        // Check if the event originated from a header
        if (target.getAttribute('part') !== 'header') return;

        // Get the accordion item from the shadow root host
        const shadowRoot = target.getRootNode() as ShadowRoot;
        const currentItem = shadowRoot.host as HcAccordionItem;

        if (!currentItem || !this.items.includes(currentItem)) return;

        const enabledItems = this.items.filter(item => !item.disabled);
        const currentEnabledIndex = enabledItems.indexOf(currentItem);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.focusNextItem(currentEnabledIndex);
                break;

            case 'ArrowUp':
                e.preventDefault();
                this.focusPreviousItem(currentEnabledIndex);
                break;

            case 'Home':
                e.preventDefault();
                this.focusFirstItem();
                break;

            case 'End':
                e.preventDefault();
                this.focusLastItem();
                break;
        }
    }

    private focusNextItem(currentIndex: number) {
        const enabledItems = this.getEnabledItems();
        if (enabledItems.length === 0) return;
        const nextIndex = (currentIndex + 1) % enabledItems.length;
        enabledItems[nextIndex]?.focus();
    }

    private focusPreviousItem(currentIndex: number) {
        const enabledItems = this.getEnabledItems();
        if (enabledItems.length === 0) return;
        const prevIndex =
            currentIndex === 0 ? enabledItems.length - 1 : currentIndex - 1;
        enabledItems[prevIndex]?.focus();
    }

    private focusFirstItem() {
        const enabledItems = this.getEnabledItems();
        if (enabledItems.length >= 0) {
            enabledItems[0]?.focus();
        }
    }

    private focusLastItem() {
        const enabledItems = this.getEnabledItems();
        if (enabledItems.length > 0) {
            enabledItems[enabledItems.length - 1]?.focus();
        }
    }

    /**
     * Gets all accordion items
     */
    getItems(): HcAccordionItem[] {
        return this.items;
    }

    /**
     * Gets all enabled (non-disabled) accordion items
     */
    getEnabledItems(): HcAccordionItem[] {
        return this.items.filter(item => !item.disabled);
    }

    /**
     * Expands all items (only works when allowMultiple is true)
     */
    expandAll() {
        if (!this.allowMultiple) {
            console.warn('expandAll() only works when allowMultiple is true');
            return;
        }

        this.items.forEach(item => {
            if (!item.disabled && !item.expanded) {
                item.expanded = true;
            }
        });
    }

    /**
     * Collapses all items
     */
    collapseAll() {
        this.items.forEach(item => {
            if (!item.disabled && item.expanded) {
                item.expanded = false;
            }
        });
    }
}

customElements.define('hc-accordion', HcAccordion);
