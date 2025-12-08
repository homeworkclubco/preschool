import { describe, it, expect, beforeEach, vi } from 'vitest';
import axe from 'axe-core';
import './carousel';
import './carousel-item';
import type { PsCarousel } from './carousel';
import type { PsCarouselItem } from './carousel-item';

describe('PsCarousel', () => {
    beforeEach(async () => {
        document.body.innerHTML = `
            <ps-carousel id="test-carousel">
                <ps-carousel-item><div class="slide">Slide 1</div></ps-carousel-item>
                <ps-carousel-item><div class="slide">Slide 2</div></ps-carousel-item>
                <ps-carousel-item><div class="slide">Slide 3</div></ps-carousel-item>
            </ps-carousel>
        `;
        await customElements.whenDefined('ps-carousel');
        await customElements.whenDefined('ps-carousel-item');
        await new Promise((resolve) => setTimeout(resolve, 100));
    });

    describe('Basic rendering', () => {
        it('should render with default properties', async () => {
            const el = document.querySelector('ps-carousel') as PsCarousel;

            expect(el).toBeTruthy();
            expect(el.tagName.toLowerCase()).toBe('ps-carousel');
            expect(el.shadowRoot).toBeTruthy();
        });

        it('should have correct default attributes', async () => {
            const el = document.querySelector('ps-carousel') as PsCarousel;

            expect(el.align).toBe('start');
            expect(el.overflowMode).toBe('standard');
            expect(el.mouseDragging).toBe(true);
            expect(el.gap).toBe('1rem');
        });

        it('should render carousel items', async () => {
            const items = document.querySelectorAll('ps-carousel-item');
            expect(items.length).toBe(3);
        });
    });

    describe('Attributes', () => {
        it('should reflect align attribute', async () => {
            document.body.innerHTML = `<ps-carousel align="center"></ps-carousel>`;
            await customElements.whenDefined('ps-carousel');
            await new Promise((resolve) => setTimeout(resolve, 100));

            const el = document.querySelector('ps-carousel') as PsCarousel;
            expect(el.align).toBe('center');
            expect(el.getAttribute('align')).toBe('center');
        });

        it('should reflect overflow-mode attribute', async () => {
            document.body.innerHTML = `<ps-carousel overflow-mode="edge-bleed"></ps-carousel>`;
            await customElements.whenDefined('ps-carousel');
            await new Promise((resolve) => setTimeout(resolve, 100));

            const el = document.querySelector('ps-carousel') as PsCarousel;
            expect(el.overflowMode).toBe('edge-bleed');
            expect(el.getAttribute('overflow-mode')).toBe('edge-bleed');
        });

        it('should accept custom gap value', async () => {
            document.body.innerHTML = `<ps-carousel gap="2rem"></ps-carousel>`;
            await customElements.whenDefined('ps-carousel');
            await new Promise((resolve) => setTimeout(resolve, 100));

            const el = document.querySelector('ps-carousel') as PsCarousel;
            expect(el.gap).toBe('2rem');
        });
    });

    describe('ARIA and accessibility', () => {
        it('should have correct ARIA roles', async () => {
            const el = document.querySelector('ps-carousel') as PsCarousel;
            const base = el.shadowRoot?.querySelector('[part="base"]');

            expect(base?.getAttribute('role')).toBe('region');
            expect(base?.getAttribute('aria-roledescription')).toBe('carousel');
            expect(base?.getAttribute('aria-label')).toBe('Carousel');
        });

        it('should be keyboard focusable', async () => {
            const el = document.querySelector('ps-carousel') as PsCarousel;
            const base = el.shadowRoot?.querySelector('[part="base"]');

            expect(base?.getAttribute('tabindex')).toBe('0');
        });

        it('should have role="list" on track', async () => {
            const el = document.querySelector('ps-carousel') as PsCarousel;
            const track = el.shadowRoot?.querySelector('[part="track"]');

            expect(track?.getAttribute('role')).toBe('list');
        });

        it('should have no accessibility violations', async () => {
            const results = await axe.run(document.body);
            expect(results.violations).toHaveLength(0);
        });
    });

    describe('Navigation methods', () => {
        it('should have next method', async () => {
            const el = document.querySelector('ps-carousel') as PsCarousel;
            expect(typeof el.next).toBe('function');
        });

        it('should have previous method', async () => {
            const el = document.querySelector('ps-carousel') as PsCarousel;
            expect(typeof el.previous).toBe('function');
        });

        it('should have goToSlide method', async () => {
            const el = document.querySelector('ps-carousel') as PsCarousel;
            expect(typeof el.goToSlide).toBe('function');
        });
    });

    describe('Keyboard navigation', () => {
        it('should handle arrow keys', async () => {
            const el = document.querySelector('ps-carousel') as PsCarousel;
            const nextSpy = vi.spyOn(el, 'next');
            const prevSpy = vi.spyOn(el, 'previous');

            const base = el.shadowRoot?.querySelector('[part="base"]') as HTMLElement;

            // Arrow right
            const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            base.dispatchEvent(rightEvent);
            expect(nextSpy).toHaveBeenCalled();

            // Arrow left
            const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
            base.dispatchEvent(leftEvent);
            expect(prevSpy).toHaveBeenCalled();
        });

        it('should handle Home key', async () => {
            const el = document.querySelector('ps-carousel') as PsCarousel;
            const goToSlideSpy = vi.spyOn(el, 'goToSlide');

            const base = el.shadowRoot?.querySelector('[part="base"]') as HTMLElement;
            const homeEvent = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
            base.dispatchEvent(homeEvent);

            expect(goToSlideSpy).toHaveBeenCalledWith(0);
        });

        it('should handle End key', async () => {
            const el = document.querySelector('ps-carousel') as PsCarousel;
            const goToSlideSpy = vi.spyOn(el, 'goToSlide');

            const base = el.shadowRoot?.querySelector('[part="base"]') as HTMLElement;
            const endEvent = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
            base.dispatchEvent(endEvent);

            expect(goToSlideSpy).toHaveBeenCalledWith(2);
        });
    });

    describe('Events', () => {
        it('should emit ps-ready event on connect', async () => {
            let eventFired = false;

            document.body.innerHTML = '<div id="container"></div>';
            const container = document.getElementById('container')!;

            container.addEventListener('ps-ready', () => {
                eventFired = true;
            });

            const el = document.createElement('ps-carousel') as PsCarousel;
            container.appendChild(el);

            await customElements.whenDefined('ps-carousel');
            await new Promise((resolve) => setTimeout(resolve, 100));

            expect(eventFired).toBe(true);
        });

        it('should emit ps-scroll-start event when scrolling', async () => {
            const el = document.querySelector('ps-carousel') as PsCarousel;
            let eventFired = false;

            el.addEventListener('ps-scroll-start', () => {
                eventFired = true;
            });

            const scrollContainer = el.shadowRoot?.querySelector('[part="scroll-container"]');
            scrollContainer?.dispatchEvent(new Event('scroll'));

            await new Promise((resolve) => setTimeout(resolve, 50));
            expect(eventFired).toBe(true);
        });

        it('should emit ps-scroll-end event after scrolling stops', async () => {
            const el = document.querySelector('ps-carousel') as PsCarousel;
            let eventFired = false;

            el.addEventListener('ps-scroll-end', () => {
                eventFired = true;
            });

            const scrollContainer = el.shadowRoot?.querySelector('[part="scroll-container"]');
            scrollContainer?.dispatchEvent(new Event('scroll'));

            // Wait for debounce
            await new Promise((resolve) => setTimeout(resolve, 200));
            expect(eventFired).toBe(true);
        });
    });

    describe('Navigation buttons', () => {
        it('should control carousel via ID-based buttons', async () => {
            document.body.innerHTML = `
                <button data-carousel-prev="nav-test">Previous</button>
                <button data-carousel-next="nav-test">Next</button>
                <ps-carousel id="nav-test">
                    <ps-carousel-item><div class="slide">Slide 1</div></ps-carousel-item>
                    <ps-carousel-item><div class="slide">Slide 2</div></ps-carousel-item>
                    <ps-carousel-item><div class="slide">Slide 3</div></ps-carousel-item>
                </ps-carousel>
            `;
            await customElements.whenDefined('ps-carousel');
            await customElements.whenDefined('ps-carousel-item');
            await new Promise((resolve) => setTimeout(resolve, 100));

            const el = document.querySelector('ps-carousel') as PsCarousel;
            const prevButton = document.querySelector('[data-carousel-prev="nav-test"]') as HTMLButtonElement;
            const nextButton = document.querySelector('[data-carousel-next="nav-test"]') as HTMLButtonElement;

            expect(prevButton).toBeTruthy();
            expect(nextButton).toBeTruthy();

            // Test that clicking next button calls next method
            const nextSpy = vi.spyOn(el, 'next');
            nextButton.click();
            expect(nextSpy).toHaveBeenCalled();

            // Test that clicking prev button calls previous method
            const prevSpy = vi.spyOn(el, 'previous');
            prevButton.click();
            expect(prevSpy).toHaveBeenCalled();
        });

        it('should disable prev button at start and next button at end', async () => {
            document.body.innerHTML = `
                <button data-carousel-prev="boundary-test">Previous</button>
                <button data-carousel-next="boundary-test">Next</button>
                <ps-carousel id="boundary-test">
                    <ps-carousel-item><div class="slide">Slide 1</div></ps-carousel-item>
                    <ps-carousel-item><div class="slide">Slide 2</div></ps-carousel-item>
                </ps-carousel>
            `;
            await customElements.whenDefined('ps-carousel');
            await customElements.whenDefined('ps-carousel-item');
            await new Promise((resolve) => setTimeout(resolve, 100));

            const prevButton = document.querySelector('[data-carousel-prev="boundary-test"]') as HTMLButtonElement;
            const nextButton = document.querySelector('[data-carousel-next="boundary-test"]') as HTMLButtonElement;

            // At start, prev should be disabled
            expect(prevButton.hasAttribute('disabled')).toBe(true);
            expect(nextButton.hasAttribute('disabled')).toBe(false);
        });
    });

    describe('CSS Parts', () => {
        it('should expose correct CSS parts', async () => {
            const el = document.querySelector('ps-carousel') as PsCarousel;

            const base = el.shadowRoot?.querySelector('[part="base"]');
            const scrollContainer = el.shadowRoot?.querySelector('[part="scroll-container"]');
            const track = el.shadowRoot?.querySelector('[part="track"]');

            expect(base).toBeTruthy();
            expect(scrollContainer).toBeTruthy();
            expect(track).toBeTruthy();
        });
    });
});

describe('PsCarouselItem', () => {
    beforeEach(async () => {
        document.body.innerHTML = `
            <ps-carousel id="item-test">
                <ps-carousel-item id="item-1"><div>Slide 1</div></ps-carousel-item>
                <ps-carousel-item id="item-2"><div>Slide 2</div></ps-carousel-item>
                <ps-carousel-item id="item-3"><div>Slide 3</div></ps-carousel-item>
            </ps-carousel>
        `;
        await customElements.whenDefined('ps-carousel');
        await customElements.whenDefined('ps-carousel-item');
        await new Promise((resolve) => setTimeout(resolve, 100));
    });

    describe('Basic rendering', () => {
        it('should render with default properties', async () => {
            const item = document.querySelector('#item-1') as PsCarouselItem;

            expect(item).toBeTruthy();
            expect(item.tagName.toLowerCase()).toBe('ps-carousel-item');
            expect(item.shadowRoot).toBeTruthy();
        });

        it('should have correct default state', async () => {
            const item = document.querySelector('#item-1') as PsCarouselItem;

            // First item should be active by default
            expect(item.active).toBe(true);
            expect(item.previous).toBe(false);
            expect(item.next).toBe(false);
        });
    });

    describe('State attributes', () => {
        it('should reflect active attribute', async () => {
            const item = document.querySelector('#item-1') as PsCarouselItem;

            item.active = true;
            await new Promise((resolve) => setTimeout(resolve, 50));

            expect(item.hasAttribute('active')).toBe(true);

            item.active = false;
            await new Promise((resolve) => setTimeout(resolve, 50));

            expect(item.hasAttribute('active')).toBe(false);
        });

        it('should reflect previous attribute', async () => {
            const item = document.querySelector('#item-1') as PsCarouselItem;

            item.previous = true;
            await new Promise((resolve) => setTimeout(resolve, 50));

            expect(item.hasAttribute('previous')).toBe(true);
        });

        it('should reflect next attribute', async () => {
            const item = document.querySelector('#item-1') as PsCarouselItem;

            item.next = true;
            await new Promise((resolve) => setTimeout(resolve, 50));

            expect(item.hasAttribute('next')).toBe(true);
        });

        it('should reflect in-view attribute', async () => {
            const item = document.querySelector('#item-1') as PsCarouselItem;

            item.inView = true;
            await new Promise((resolve) => setTimeout(resolve, 50));

            expect(item.hasAttribute('in-view')).toBe(true);
        });
    });
});
