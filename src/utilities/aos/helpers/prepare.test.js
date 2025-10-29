import { describe, it, expect, beforeEach } from 'vitest';
import prepare from './prepare.js';

describe('prepare', () => {
  const defaultOptions = {
    rootMargin: '0px',
    threshold: 0,
    once: false,
    animatedClassName: 'aos-animate',
    initClassName: 'aos-init',
    useClassNames: false
  };

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('groups elements by rootMargin and threshold', () => {
    document.body.innerHTML = `
      <div data-aos="fade-up" data-aos-root-margin="10px">1</div>
      <div data-aos="fade-down" data-aos-root-margin="10px">2</div>
      <div data-aos="zoom-in" data-aos-root-margin="20px">3</div>
    `;

    const elements = Array.from(document.querySelectorAll('[data-aos]'), node => ({ node }));
    const result = prepare(elements, defaultOptions);

    // Should have 2 groups (10px and 20px)
    expect(result.size).toBe(2);
  });

  it('adds init class to elements when specified', () => {
    document.body.innerHTML = '<div data-aos="fade-up" id="test">Test</div>';

    const elements = Array.from(document.querySelectorAll('[data-aos]'), node => ({ node }));
    prepare(elements, defaultOptions);

    const element = document.getElementById('test');
    expect(element.classList.contains('aos-init')).toBe(true);
  });

  it('does not add init class when initClassName is empty', () => {
    document.body.innerHTML = '<div data-aos="fade-up" id="test">Test</div>';

    const elements = Array.from(document.querySelectorAll('[data-aos]'), node => ({ node }));
    const options = { ...defaultOptions, initClassName: '' };
    prepare(elements, options);

    const element = document.getElementById('test');
    expect(element.classList.contains('aos-init')).toBe(false);
  });

  it('builds animation class names correctly with useClassNames=false', () => {
    document.body.innerHTML = '<div data-aos="fade-up" id="test">Test</div>';

    const elements = Array.from(document.querySelectorAll('[data-aos]'), node => ({ node }));
    prepare(elements, defaultOptions);

    const element = document.getElementById('test');
    expect(element._aosMeta.options.animatedClassNames).toEqual(['aos-animate']);
  });

  it('builds animation class names with useClassNames=true', () => {
    document.body.innerHTML = '<div data-aos="fade-up slide-left" id="test">Test</div>';

    const elements = Array.from(document.querySelectorAll('[data-aos]'), node => ({ node }));
    const options = { ...defaultOptions, useClassNames: true };
    prepare(elements, options);

    const element = document.getElementById('test');
    expect(element._aosMeta.options.animatedClassNames).toEqual([
      'aos-animate',
      'fade-up',
      'slide-left'
    ]);
  });

  it('does NOT throw error when useClassNames=false (regression test)', () => {
    document.body.innerHTML = '<div data-aos="fade-up" id="test">Test</div>';

    const elements = Array.from(document.querySelectorAll('[data-aos]'), node => ({ node }));

    // This used to throw "customClassNames?.split is not a function"
    expect(() => {
      prepare(elements, defaultOptions);
    }).not.toThrow();
  });

  it('creates _aosMeta on each element', () => {
    document.body.innerHTML = '<div data-aos="fade-up" id="test">Test</div>';

    const elements = Array.from(document.querySelectorAll('[data-aos]'), node => ({ node }));
    prepare(elements, defaultOptions);

    const element = document.getElementById('test');
    expect(element._aosMeta).toBeDefined();
    expect(element._aosMeta.options).toBeDefined();
    expect(element._aosMeta.animated).toBe(false);
  });

  it('stores once option in _aosMeta', () => {
    document.body.innerHTML = '<div data-aos="fade-up" data-aos-once="true" id="test">Test</div>';

    const elements = Array.from(document.querySelectorAll('[data-aos]'), node => ({ node }));
    prepare(elements, defaultOptions);

    const element = document.getElementById('test');
    expect(element._aosMeta.options.once).toBe(true);
  });

  it('stores id option in _aosMeta', () => {
    document.body.innerHTML = '<div data-aos="fade-up" data-aos-id="my-animation" id="test">Test</div>';

    const elements = Array.from(document.querySelectorAll('[data-aos]'), node => ({ node }));
    prepare(elements, defaultOptions);

    const element = document.getElementById('test');
    expect(element._aosMeta.options.id).toBe('my-animation');
  });

  it('uses global options as fallback', () => {
    document.body.innerHTML = '<div data-aos="fade-up" id="test">Test</div>';

    const elements = Array.from(document.querySelectorAll('[data-aos]'), node => ({ node }));
    const options = { ...defaultOptions, once: true, rootMargin: '50px' };
    prepare(elements, options);

    const element = document.getElementById('test');
    expect(element._aosMeta.options.once).toBe(true);
  });

  it('per-element options override global options', () => {
    document.body.innerHTML = `
      <div data-aos="fade-up" data-aos-once="false" id="test">Test</div>
    `;

    const elements = Array.from(document.querySelectorAll('[data-aos]'), node => ({ node }));
    const options = { ...defaultOptions, once: true };
    prepare(elements, options);

    const element = document.getElementById('test');
    expect(element._aosMeta.options.once).toBe(false);
  });

  it('handles multiple elements in same group', () => {
    document.body.innerHTML = `
      <div data-aos="fade-up" id="test1">1</div>
      <div data-aos="fade-down" id="test2">2</div>
      <div data-aos="zoom-in" id="test3">3</div>
    `;

    const elements = Array.from(document.querySelectorAll('[data-aos]'), node => ({ node }));
    const result = prepare(elements, defaultOptions);

    // All should be in same group (same rootMargin and threshold)
    expect(result.size).toBe(1);

    const group = Array.from(result.values())[0];
    expect(group.elements).toHaveLength(3);
  });

  it('returns Map with correct structure', () => {
    document.body.innerHTML = '<div data-aos="fade-up">Test</div>';

    const elements = Array.from(document.querySelectorAll('[data-aos]'), node => ({ node }));
    const result = prepare(elements, defaultOptions);

    expect(result).toBeInstanceOf(Map);
    const group = Array.from(result.values())[0];
    expect(group).toHaveProperty('rootMargin');
    expect(group).toHaveProperty('threshold');
    expect(group).toHaveProperty('elements');
    expect(Array.isArray(group.elements)).toBe(true);
  });

  it('filters out non-string class names', () => {
    document.body.innerHTML = '<div data-aos="" id="test">Test</div>';

    const elements = Array.from(document.querySelectorAll('[data-aos]'), node => ({ node }));
    const options = { ...defaultOptions, useClassNames: true };
    prepare(elements, options);

    const element = document.getElementById('test');
    // Should only have 'aos-animate', empty string should be filtered
    expect(element._aosMeta.options.animatedClassNames).toEqual(['aos-animate']);
  });
});
