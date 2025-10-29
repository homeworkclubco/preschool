import { describe, it, expect, beforeEach } from 'vitest';
import elements from './elements.js';

describe('elements', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns empty array when no [data-aos] elements exist', () => {
    document.body.innerHTML = '<div>No AOS here</div>';
    const result = elements();
    expect(result).toEqual([]);
  });

  it('returns array with one element when one [data-aos] exists', () => {
    document.body.innerHTML = '<div data-aos="fade-up">Test</div>';
    const result = elements();

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('node');
    expect(result[0].node.tagName).toBe('DIV');
  });

  it('returns array with multiple elements', () => {
    document.body.innerHTML = `
      <div data-aos="fade-up">First</div>
      <div data-aos="fade-down">Second</div>
      <div data-aos="zoom-in">Third</div>
    `;
    const result = elements();

    expect(result).toHaveLength(3);
    result.forEach(el => {
      expect(el).toHaveProperty('node');
      expect(el.node).toBeInstanceOf(HTMLElement);
    });
  });

  it('finds nested [data-aos] elements', () => {
    document.body.innerHTML = `
      <div>
        <section data-aos="fade-up">
          <div data-aos="fade-down">Nested</div>
        </section>
      </div>
    `;
    const result = elements();

    expect(result).toHaveLength(2);
  });

  it('ignores elements without data-aos attribute', () => {
    document.body.innerHTML = `
      <div data-aos="fade-up">Has AOS</div>
      <div class="no-aos">No AOS</div>
      <div data-aos="fade-down">Has AOS</div>
    `;
    const result = elements();

    expect(result).toHaveLength(2);
  });

  it('returns node property for each element', () => {
    document.body.innerHTML = `
      <div data-aos="fade-up" id="test-1">Test</div>
      <div data-aos="fade-down" id="test-2">Test</div>
    `;
    const result = elements();

    expect(result[0].node.id).toBe('test-1');
    expect(result[1].node.id).toBe('test-2');
  });

  it('uses Array.from to convert NodeList', () => {
    document.body.innerHTML = `
      <div data-aos="fade-up">1</div>
      <div data-aos="fade-down">2</div>
    `;
    const result = elements();

    // Verify it's a real array, not a NodeList
    expect(Array.isArray(result)).toBe(true);
    expect(result.map).toBeDefined();
    expect(result.filter).toBeDefined();
  });

  it('works with different element types', () => {
    document.body.innerHTML = `
      <div data-aos="fade-up">Div</div>
      <section data-aos="fade-down">Section</section>
      <article data-aos="zoom-in">Article</article>
      <span data-aos="fade-left">Span</span>
    `;
    const result = elements();

    expect(result).toHaveLength(4);
    expect(result[0].node.tagName).toBe('DIV');
    expect(result[1].node.tagName).toBe('SECTION');
    expect(result[2].node.tagName).toBe('ARTICLE');
    expect(result[3].node.tagName).toBe('SPAN');
  });
});
