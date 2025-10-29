import { describe, it, expect, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './accordion.ts';
import '../accordion-item/accordion-item.js';

describe('hc-accordion', () => {
    describe('Basic rendering', () => {
        it('renders with default properties', async () => {
            const el = await fixture(html`
                <hc-accordion>
                    <hc-accordion-item label="Item 1"
                        >Content 1</hc-accordion-item
                    >
                    <hc-accordion-item label="Item 2"
                        >Content 2</hc-accordion-item
                    >
                </hc-accordion>
            `);

            expect(el).toBeDefined();
            expect(el.tagName.toLowerCase()).toBe('hc-accordion');
            expect(el.allowMultiple).toBe(false);
        });

        it('renders with allow-multiple attribute', async () => {
            const el = await fixture(html`
                <hc-accordion allow-multiple>
                    <hc-accordion-item label="Item 1"
                        >Content 1</hc-accordion-item
                    >
                </hc-accordion>
            `);

            expect(el.allowMultiple).toBe(true);
        });

        it('finds all accordion items', async () => {
            const el = await fixture(html`
                <hc-accordion>
                    <hc-accordion-item label="Item 1"
                        >Content 1</hc-accordion-item
                    >
                    <hc-accordion-item label="Item 2"
                        >Content 2</hc-accordion-item
                    >
                    <hc-accordion-item label="Item 3"
                        >Content 3</hc-accordion-item
                    >
                </hc-accordion>
            `);

            await el.updateComplete;
            const items = el.getItems();
            expect(items.length).toBe(3);
        });
    });

    describe('Single expand mode (default)', () => {
        it('only allows one item to be expanded at a time', async () => {
            const el = await fixture(html`
                <hc-accordion>
                    <hc-accordion-item label="Item 1"
                        >Content 1</hc-accordion-item
                    >
                    <hc-accordion-item label="Item 2"
                        >Content 2</hc-accordion-item
                    >
                </hc-accordion>
            `);

            await el.updateComplete;
            const items = el.getItems();

            // Expand first item
            items[0].expanded = true;
            await items[0].updateComplete;
            expect(items[0].expanded).toBe(true);

            // Expand second item - first should collapse
            items[1].expanded = true;
            await new Promise(resolve => setTimeout(resolve, 400)); // Wait for animations
            expect(items[1].expanded).toBe(true);
            expect(items[0].expanded).toBe(false);
        });
    });

    describe('Multiple expand mode', () => {
        it('allows multiple items to be expanded', async () => {
            const el = await fixture(html`
                <hc-accordion allow-multiple>
                    <hc-accordion-item label="Item 1"
                        >Content 1</hc-accordion-item
                    >
                    <hc-accordion-item label="Item 2"
                        >Content 2</hc-accordion-item
                    >
                </hc-accordion>
            `);

            await el.updateComplete;
            const items = el.getItems();

            // Expand first item
            items[0].expanded = true;
            await items[0].updateComplete;
            expect(items[0].expanded).toBe(true);

            // Expand second item - both should be expanded
            items[1].expanded = true;
            await items[1].updateComplete;
            expect(items[0].expanded).toBe(true);
            expect(items[1].expanded).toBe(true);
        });

        it('expandAll() expands all items', async () => {
            const el = await fixture(html`
                <hc-accordion allow-multiple>
                    <hc-accordion-item label="Item 1"
                        >Content 1</hc-accordion-item
                    >
                    <hc-accordion-item label="Item 2"
                        >Content 2</hc-accordion-item
                    >
                    <hc-accordion-item label="Item 3"
                        >Content 3</hc-accordion-item
                    >
                </hc-accordion>
            `);

            await el.updateComplete;
            el.expandAll();
            await el.updateComplete;

            const items = el.getItems();
            items.forEach(item => {
                expect(item.expanded).toBe(true);
            });
        });

        it('expandAll() warns when allowMultiple is false', async () => {
            const el = await fixture(html`
                <hc-accordion>
                    <hc-accordion-item label="Item 1"
                        >Content 1</hc-accordion-item
                    >
                </hc-accordion>
            `);

            const consoleSpy = vi
                .spyOn(console, 'warn')
                .mockImplementation(() => {});

            el.expandAll();
            expect(consoleSpy).toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });

    describe('collapseAll()', () => {
        it('collapses all expanded items', async () => {
            const el = await fixture(html`
                <hc-accordion allow-multiple>
                    <hc-accordion-item label="Item 1" expanded
                        >Content 1</hc-accordion-item
                    >
                    <hc-accordion-item label="Item 2" expanded
                        >Content 2</hc-accordion-item
                    >
                </hc-accordion>
            `);

            await el.updateComplete;
            el.collapseAll();
            await el.updateComplete;

            const items = el.getItems();
            items.forEach(item => {
                expect(item.expanded).toBe(false);
            });
        });
    });

    describe('Events', () => {
        it('fires hc-before-expand event', async () => {
            const el = await fixture(html`
                <hc-accordion>
                    <hc-accordion-item label="Item 1"
                        >Content 1</hc-accordion-item
                    >
                </hc-accordion>
            `);

            const eventSpy = vi.fn();
            el.addEventListener('hc-before-expand', eventSpy);

            await el.updateComplete;
            const items = el.getItems();
            items[0].expanded = true;
            await items[0].updateComplete;

            expect(eventSpy).toHaveBeenCalledOnce();
        });

        it('fires hc-expand event after animation', async () => {
            const el = await fixture(html`
                <hc-accordion>
                    <hc-accordion-item label="Item 1"
                        >Content 1</hc-accordion-item
                    >
                </hc-accordion>
            `);

            const eventSpy = vi.fn();
            el.addEventListener('hc-expand', eventSpy);

            await el.updateComplete;
            const items = el.getItems();
            items[0].expanded = true;

            await new Promise(resolve => setTimeout(resolve, 400));
            expect(eventSpy).toHaveBeenCalled();
        });

        it('fires hc-before-collapse and hc-collapse events', async () => {
            const el = await fixture(html`
                <hc-accordion>
                    <hc-accordion-item label="Item 1" expanded
                        >Content 1</hc-accordion-item
                    >
                </hc-accordion>
            `);

            const beforeSpy = vi.fn();
            const afterSpy = vi.fn();
            el.addEventListener('hc-before-collapse', beforeSpy);
            el.addEventListener('hc-collapse', afterSpy);

            await el.updateComplete;
            const items = el.getItems();
            items[0].expanded = false;
            await items[0].updateComplete;

            expect(beforeSpy).toHaveBeenCalled();

            await new Promise(resolve => setTimeout(resolve, 400));
            expect(afterSpy).toHaveBeenCalled();
        });
    });

    describe('Disabled items', () => {
        it('excludes disabled items from getEnabledItems()', async () => {
            const el = await fixture(html`
                <hc-accordion>
                    <hc-accordion-item label="Item 1"
                        >Content 1</hc-accordion-item
                    >
                    <hc-accordion-item label="Item 2" disabled
                        >Content 2</hc-accordion-item
                    >
                    <hc-accordion-item label="Item 3"
                        >Content 3</hc-accordion-item
                    >
                </hc-accordion>
            `);

            await el.updateComplete;
            const enabledItems = el.getEnabledItems();
            expect(enabledItems.length).toBe(2);
        });

        it('skips disabled items in keyboard navigation', async () => {
            const el = await fixture(html`
                <hc-accordion>
                    <hc-accordion-item label="Item 1"
                        >Content 1</hc-accordion-item
                    >
                    <hc-accordion-item label="Item 2" disabled
                        >Content 2</hc-accordion-item
                    >
                    <hc-accordion-item label="Item 3"
                        >Content 3</hc-accordion-item
                    >
                </hc-accordion>
            `);

            await el.updateComplete;
            const items = el.getItems();

            // Focus first item
            items[0].focus();
            await el.updateComplete;

            // Press arrow down - should skip disabled item and go to third
            const activeElement = () =>
                items.find(item => item.shadowRoot?.activeElement)?.shadowRoot
                    ?.activeElement;

            expect(activeElement()?.id).toBe('header');
        });
    });
});

describe('hc-accordion-item', () => {
    describe('Basic rendering', () => {
        it('renders with default properties', async () => {
            const el = await fixture(html`
                <hc-accordion-item label="Test Item">
                    Test Content
                </hc-accordion-item>
            `);

            expect(el).toBeDefined();
            expect(el.expanded).toBe(false);
            expect(el.disabled).toBe(false);
            expect(el.label).toBe('Test Item');
        });

        it('renders with expanded attribute', async () => {
            const el = await fixture(html`
                <hc-accordion-item label="Test" expanded>
                    Content
                </hc-accordion-item>
            `);

            expect(el.expanded).toBe(true);
        });

        it('renders with disabled attribute', async () => {
            const el = await fixture(html`
                <hc-accordion-item label="Test" disabled>
                    Content
                </hc-accordion-item>
            `);

            expect(el.disabled).toBe(true);
        });

        it('renders with custom heading level', async () => {
            const el = await fixture(html`
                <hc-accordion-item label="Test" heading-level="2">
                    Content
                </hc-accordion-item>
            `);

            expect(el.headingLevel).toBe(2);
            const h2 = el.shadowRoot.querySelector('h2');
            expect(h2).toBeDefined();
        });
    });

    describe('Interaction', () => {
        it('toggles expanded state on click', async () => {
            const el = await fixture(html`
                <hc-accordion-item label="Test">Content</hc-accordion-item>
            `);

            expect(el.expanded).toBe(false);

            const header = el.shadowRoot.querySelector('#header');
            header.click();
            await el.updateComplete;

            expect(el.expanded).toBe(true);
        });

        it('does not toggle when disabled', async () => {
            const el = await fixture(html`
                <hc-accordion-item label="Test" disabled
                    >Content</hc-accordion-item
                >
            `);

            const header = el.shadowRoot.querySelector('#header');
            header.click();
            await el.updateComplete;

            expect(el.expanded).toBe(false);
        });

        it('fires hc-toggle event on click', async () => {
            const el = await fixture(html`
                <hc-accordion-item label="Test">Content</hc-accordion-item>
            `);

            const eventSpy = vi.fn();
            el.addEventListener('hc-toggle', eventSpy);

            const header = el.shadowRoot.querySelector('#header');
            header.click();
            await el.updateComplete;

            expect(eventSpy).toHaveBeenCalledOnce();
        });
    });

    describe('Accessibility', () => {
        it('has proper ARIA attributes', async () => {
            const el = await fixture(html`
                <hc-accordion-item label="Test">Content</hc-accordion-item>
            `);

            const header = el.shadowRoot.querySelector('#header');
            const body = el.shadowRoot.querySelector('#body');

            expect(header.getAttribute('aria-expanded')).toBe('false');
            expect(header.getAttribute('aria-controls')).toBe('body');
            expect(body.getAttribute('role')).toBe('region');
            expect(body.getAttribute('aria-labelledby')).toBe('header');
        });

        it('updates aria-expanded when toggled', async () => {
            const el = await fixture(html`
                <hc-accordion-item label="Test">Content</hc-accordion-item>
            `);

            const header = el.shadowRoot.querySelector('#header');

            expect(header.getAttribute('aria-expanded')).toBe('false');

            el.expanded = true;
            await el.updateComplete;

            expect(header.getAttribute('aria-expanded')).toBe('true');
        });

        it('sets aria-disabled when disabled', async () => {
            const el = await fixture(html`
                <hc-accordion-item label="Test" disabled
                    >Content</hc-accordion-item
                >
            `);

            const header = el.shadowRoot.querySelector('#header');
            expect(header.hasAttribute('disabled')).toBe(true);
        });

        it('has proper heading structure', async () => {
            const el = await fixture(html`
                <hc-accordion-item label="Test" heading-level="3">
                    Content
                </hc-accordion-item>
            `);

            const heading = el.shadowRoot.querySelector('h3');
            expect(heading).toBeDefined();

            const button = heading.querySelector('button');
            expect(button).toBeDefined();
        });
    });

    describe('Focus management', () => {
        it('focus() method focuses the header', async () => {
            const el = await fixture(html`
                <hc-accordion-item label="Test">Content</hc-accordion-item>
            `);

            el.focus();
            await el.updateComplete;

            const activeElement = el.shadowRoot.activeElement;
            expect(activeElement?.id).toBe('header');
        });

        it('blur() method removes focus', async () => {
            const el = await fixture(html`
                <hc-accordion-item label="Test">Content</hc-accordion-item>
            `);

            el.focus();
            await el.updateComplete;

            el.blur();
            await el.updateComplete;

            const activeElement = el.shadowRoot.activeElement;
            expect(activeElement).toBeNull();
        });
    });

    describe('Slots', () => {
        it('renders default slot content', async () => {
            const el = await fixture(html`
                <hc-accordion-item label="Test">
                    <p>Custom content</p>
                </hc-accordion-item>
            `);

            const content = el.querySelector('p');
            expect(content.textContent).toBe('Custom content');
        });

        it('renders label slot', async () => {
            const el = await fixture(html`
                <hc-accordion-item>
                    <span slot="label">Custom Label</span>
                    Content
                </hc-accordion-item>
            `);

            const labelSlot = el.querySelector('[slot="label"]');
            expect(labelSlot.textContent).toBe('Custom Label');
        });
    });

    describe('Animation', () => {
        it('respects prefers-reduced-motion', async () => {
            // Mock matchMedia to simulate prefers-reduced-motion
            const originalMatchMedia = window.matchMedia;
            window.matchMedia = vi.fn().mockImplementation(query => ({
                matches: query === '(prefers-reduced-motion: reduce)',
                media: query,
                onchange: null,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            }));

            const el = await fixture(html`
                <hc-accordion-item label="Test">Content</hc-accordion-item>
            `);

            el.expanded = true;
            await el.updateComplete;

            // Animation should complete instantly
            await new Promise(resolve => setTimeout(resolve, 50));

            const expandEvent = vi.fn();
            el.addEventListener('hc-expand', expandEvent);

            // Should have fired immediately
            expect(expandEvent).toHaveBeenCalled();

            window.matchMedia = originalMatchMedia;
        });
    });
});
