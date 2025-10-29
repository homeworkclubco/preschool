import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import handleIntersection from './handleIntersection.js';

describe('handleIntersection', () => {
  let element;
  let mockObserver;
  let eventsFired;

  beforeEach(() => {
    element = document.createElement('div');
    element.id = 'test-element';
    document.body.appendChild(element);

    element._aosMeta = {
      options: {
        animatedClassNames: ['aos-animate'],
        once: false,
        id: null
      },
      animated: false
    };

    mockObserver = {
      unobserve: vi.fn()
    };

    eventsFired = [];
    document.addEventListener('aos:in', (e) => eventsFired.push({ type: 'aos:in', detail: e.detail }));
    document.addEventListener('aos:out', (e) => eventsFired.push({ type: 'aos:out', detail: e.detail }));
  });

  afterEach(() => {
    document.body.innerHTML = '';
    eventsFired = [];
  });

  it('adds aos-animate class when element enters viewport', () => {
    const entries = [{
      target: element,
      isIntersecting: true
    }];

    handleIntersection(entries, mockObserver);

    expect(element.classList.contains('aos-animate')).toBe(true);
    expect(element._aosMeta.animated).toBe(true);
  });

  it('removes aos-animate class when element leaves viewport', () => {
    // First, animate in
    element._aosMeta.animated = true;
    element.classList.add('aos-animate');

    const entries = [{
      target: element,
      isIntersecting: false
    }];

    handleIntersection(entries, mockObserver);

    expect(element.classList.contains('aos-animate')).toBe(false);
    expect(element._aosMeta.animated).toBe(false);
  });

  it('fires aos:in event when element enters viewport', () => {
    const entries = [{
      target: element,
      isIntersecting: true
    }];

    handleIntersection(entries, mockObserver);

    expect(eventsFired.some(e => e.type === 'aos:in')).toBe(true);
  });

  it('fires aos:out event when element leaves viewport', () => {
    element._aosMeta.animated = true;
    element.classList.add('aos-animate');

    const entries = [{
      target: element,
      isIntersecting: false
    }];

    handleIntersection(entries, mockObserver);

    expect(eventsFired.some(e => e.type === 'aos:out')).toBe(true);
  });

  it('fires aos:in:{id} event when element has id', () => {
    element._aosMeta.options.id = 'my-animation';

    let customEventFired = false;
    document.addEventListener('aos:in:my-animation', () => {
      customEventFired = true;
    });

    const entries = [{
      target: element,
      isIntersecting: true
    }];

    handleIntersection(entries, mockObserver);

    expect(customEventFired).toBe(true);
  });

  it('stops observing when once=true and element enters', () => {
    element._aosMeta.options.once = true;

    const entries = [{
      target: element,
      isIntersecting: true
    }];

    handleIntersection(entries, mockObserver);

    expect(mockObserver.unobserve).toHaveBeenCalledWith(element);
  });

  it('does not stop observing when once=false', () => {
    element._aosMeta.options.once = false;

    const entries = [{
      target: element,
      isIntersecting: true
    }];

    handleIntersection(entries, mockObserver);

    expect(mockObserver.unobserve).not.toHaveBeenCalled();
  });

  it('does not remove class when once=true and element leaves', () => {
    element._aosMeta.options.once = true;
    element._aosMeta.animated = true;
    element.classList.add('aos-animate');

    const entries = [{
      target: element,
      isIntersecting: false
    }];

    handleIntersection(entries, mockObserver);

    // Should keep the class because once=true
    expect(element.classList.contains('aos-animate')).toBe(true);
    expect(element._aosMeta.animated).toBe(true);
  });

  it('does not animate already animated elements', () => {
    element._aosMeta.animated = true;
    element.classList.add('aos-animate');
    eventsFired = [];

    const entries = [{
      target: element,
      isIntersecting: true
    }];

    handleIntersection(entries, mockObserver);

    // Should not fire event again
    expect(eventsFired.length).toBe(0);
  });

  it('handles multiple elements in one callback', () => {
    const element2 = document.createElement('div');
    element2._aosMeta = {
      options: {
        animatedClassNames: ['aos-animate'],
        once: false,
        id: null
      },
      animated: false
    };
    document.body.appendChild(element2);

    const entries = [
      { target: element, isIntersecting: true },
      { target: element2, isIntersecting: true }
    ];

    handleIntersection(entries, mockObserver);

    expect(element.classList.contains('aos-animate')).toBe(true);
    expect(element2.classList.contains('aos-animate')).toBe(true);
  });

  it('handles elements without _aosMeta gracefully', () => {
    const elementWithoutMeta = document.createElement('div');
    document.body.appendChild(elementWithoutMeta);

    const entries = [{
      target: elementWithoutMeta,
      isIntersecting: true
    }];

    expect(() => {
      handleIntersection(entries, mockObserver);
    }).not.toThrow();
  });

  it('adds multiple class names when specified', () => {
    element._aosMeta.options.animatedClassNames = ['aos-animate', 'fade-up', 'custom-class'];

    const entries = [{
      target: element,
      isIntersecting: true
    }];

    handleIntersection(entries, mockObserver);

    expect(element.classList.contains('aos-animate')).toBe(true);
    expect(element.classList.contains('fade-up')).toBe(true);
    expect(element.classList.contains('custom-class')).toBe(true);
  });

  it('removes multiple class names when leaving viewport', () => {
    element._aosMeta.options.animatedClassNames = ['aos-animate', 'fade-up'];
    element._aosMeta.animated = true;
    element.classList.add('aos-animate', 'fade-up');

    const entries = [{
      target: element,
      isIntersecting: false
    }];

    handleIntersection(entries, mockObserver);

    expect(element.classList.contains('aos-animate')).toBe(false);
    expect(element.classList.contains('fade-up')).toBe(false);
  });
});
