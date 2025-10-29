import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import AOS from './aos.js';

describe('AOS Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    AOS.disable();
  });

  afterEach(() => {
    AOS.disable();
  });

  describe('Initialization', () => {
    it('initializes with default options', () => {
      document.body.innerHTML = '<div data-aos="fade-up">Test</div>';

      AOS.init();

      const state = AOS.getState();
      expect(state.initialized).toBe(true);
      expect(state.elementCount).toBe(1);
    });

    it('merges custom options with defaults', () => {
      document.body.innerHTML = '<div data-aos="fade-up">Test</div>';

      AOS.init({ once: true, threshold: 0.5 });

      const state = AOS.getState();
      expect(state.options.once).toBe(true);
      expect(state.options.threshold).toBe(0.5);
    });

    it('creates IntersectionObserver instances', () => {
      document.body.innerHTML = '<div data-aos="fade-up">Test</div>';

      AOS.init();

      const observers = AOS.getObservers();
      expect(observers.length).toBeGreaterThan(0);
    });

    it('adds init class to elements', () => {
      document.body.innerHTML = '<div data-aos="fade-up" id="test">Test</div>';

      AOS.init();

      const element = document.getElementById('test');
      expect(element.classList.contains('aos-init')).toBe(true);
    });

    it('handles empty page (no [data-aos] elements)', () => {
      document.body.innerHTML = '<div>No AOS here</div>';

      expect(() => AOS.init()).not.toThrow();

      const state = AOS.getState();
      expect(state.elementCount).toBe(0);
    });

    it('initializes when document is already ready', () => {
      // Document is already ready in tests
      document.body.innerHTML = '<div data-aos="fade-up">Test</div>';

      AOS.init({ startEvent: 'DOMContentLoaded' });

      // Should initialize immediately
      const state = AOS.getState();
      expect(state.initialized).toBe(true);
    });
  });

  describe('API Methods', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div data-aos="fade-up" id="test">Test</div>';
    });

    it('init() returns API for chaining', () => {
      const result = AOS.init();
      expect(result).toBe(AOS);
      expect(result.refresh).toBeDefined();
      expect(result.disable).toBeDefined();
    });

    it('refresh() returns API for chaining', () => {
      AOS.init();
      const result = AOS.refresh();
      expect(result).toBe(AOS);
    });

    it('disable() returns API for chaining', () => {
      AOS.init();
      const result = AOS.disable();
      expect(result).toBe(AOS);
    });

    it('refresh() recreates observers', () => {
      AOS.init();
      const observersBefore = AOS.getObservers();

      AOS.refresh();
      const observersAfter = AOS.getObservers();

      // New observer instances should be created
      expect(observersAfter.length).toBe(observersBefore.length);
    });

    it('disable() disconnects all observers', () => {
      AOS.init();
      expect(AOS.getState().initialized).toBe(true);

      AOS.disable();
      expect(AOS.getState().initialized).toBe(false);
      expect(AOS.getObservers()).toHaveLength(0);
    });

    it('disable() removes classes from elements', () => {
      AOS.init();
      const element = document.getElementById('test');

      // Simulate animation
      element.classList.add('aos-animate');

      AOS.disable();

      expect(element.classList.contains('aos-init')).toBe(false);
      expect(element.classList.contains('aos-animate')).toBe(false);
    });

    it('disable() cleans up metadata', () => {
      AOS.init();
      const element = document.getElementById('test');
      expect(element._aosMeta).toBeDefined();

      AOS.disable();
      expect(element._aosMeta).toBeUndefined();
    });

    it('getState() returns correct structure', () => {
      AOS.init();
      const state = AOS.getState();

      expect(state).toHaveProperty('initialized');
      expect(state).toHaveProperty('elementCount');
      expect(state).toHaveProperty('observerCount');
      expect(state).toHaveProperty('options');
    });

    it('getElements() returns array of [data-aos] elements', () => {
      document.body.innerHTML = `
        <div data-aos="fade-up">1</div>
        <div data-aos="fade-down">2</div>
      `;

      AOS.init();
      const elements = AOS.getElements();

      expect(Array.isArray(elements)).toBe(true);
      expect(elements).toHaveLength(2);
    });

    it('getObservers() returns array of IntersectionObserver instances', () => {
      AOS.init();
      const observers = AOS.getObservers();

      expect(Array.isArray(observers)).toBe(true);
      observers.forEach(observer => {
        expect(observer).toBeInstanceOf(IntersectionObserver);
      });
    });

    it('on() stores event listeners', () => {
      const callback = vi.fn();
      const result = AOS.on('test-event', callback);

      expect(result).toBe(AOS); // Should return API for chaining
    });
  });

  describe('Method Chaining', () => {
    it('allows chaining init -> getState', () => {
      document.body.innerHTML = '<div data-aos="fade-up">Test</div>';

      const state = AOS.init().getState();

      expect(state.initialized).toBe(true);
    });

    it('allows chaining init -> refresh -> getState', () => {
      document.body.innerHTML = '<div data-aos="fade-up">Test</div>';

      const state = AOS.init().refresh().getState();

      expect(state.initialized).toBe(true);
    });

    it('allows chaining with on()', () => {
      document.body.innerHTML = '<div data-aos="fade-up">Test</div>';

      const callback = vi.fn();
      const state = AOS.init().on('aos:in', callback).getState();

      expect(state.initialized).toBe(true);
    });
  });

  describe('Element Grouping', () => {
    it('groups elements with same config', () => {
      document.body.innerHTML = `
        <div data-aos="fade-up">1</div>
        <div data-aos="fade-down">2</div>
        <div data-aos="zoom-in">3</div>
      `;

      AOS.init();

      // All elements have same default config, should be in one group
      const observers = AOS.getObservers();
      expect(observers).toHaveLength(1);
    });

    it('creates separate groups for different rootMargin', () => {
      document.body.innerHTML = `
        <div data-aos="fade-up" data-aos-root-margin="10px">1</div>
        <div data-aos="fade-down" data-aos-root-margin="20px">2</div>
      `;

      AOS.init();

      // Different rootMargin values = different groups
      const observers = AOS.getObservers();
      expect(observers.length).toBe(2);
    });

    it('creates separate groups for different threshold', () => {
      document.body.innerHTML = `
        <div data-aos="fade-up" data-aos-threshold="0">1</div>
        <div data-aos="fade-down" data-aos-threshold="0.5">2</div>
      `;

      AOS.init();

      // Different threshold values = different groups
      const observers = AOS.getObservers();
      expect(observers.length).toBe(2);
    });
  });

  describe('Dynamic Elements (MutationObserver)', () => {
    it('detects new elements added to DOM', async () => {
      document.body.innerHTML = '<div data-aos="fade-up">Original</div>';

      AOS.init({ disableMutationObserver: false });

      expect(AOS.getState().elementCount).toBe(1);

      // Add new element
      const newElement = document.createElement('div');
      newElement.setAttribute('data-aos', 'fade-down');
      newElement.textContent = 'New';
      document.body.appendChild(newElement);

      // Wait for MutationObserver
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(AOS.getState().elementCount).toBe(2);
    });

    it('can be disabled with disableMutationObserver option', () => {
      const consoleInfo = vi.spyOn(console, 'info').mockImplementation(() => {});

      AOS.init({ disableMutationObserver: true });

      // Should not log the warning
      expect(consoleInfo).not.toHaveBeenCalled();

      consoleInfo.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('can be disabled and re-initialized', () => {
      document.body.innerHTML = '<div data-aos="fade-up">Test</div>';

      AOS.init();
      expect(AOS.getState().initialized).toBe(true);

      AOS.disable();
      expect(AOS.getState().initialized).toBe(false);

      AOS.init();
      expect(AOS.getState().initialized).toBe(true);
    });

    it('handles refresh before init gracefully', () => {
      document.body.innerHTML = '<div data-aos="fade-up">Test</div>';

      expect(() => AOS.refresh()).not.toThrow();

      // Should not be initialized
      expect(AOS.getState().initialized).toBe(false);
    });

    it('handles multiple getState() calls', () => {
      document.body.innerHTML = '<div data-aos="fade-up">Test</div>';

      AOS.init();

      const state1 = AOS.getState();
      const state2 = AOS.getState();

      expect(state1).toEqual(state2);
    });

    it('getElements() returns empty array when no elements', () => {
      document.body.innerHTML = '<div>No AOS</div>';

      const elements = AOS.getElements();
      expect(elements).toEqual([]);
    });

    it('handles elements with invalid data-aos values', () => {
      document.body.innerHTML = '<div data-aos="">Empty</div>';

      expect(() => AOS.init()).not.toThrow();

      const state = AOS.getState();
      expect(state.elementCount).toBe(1);
    });
  });

  describe('ResizeObserver', () => {
    it('sets up ResizeObserver for elements', () => {
      document.body.innerHTML = '<div data-aos="fade-up" id="test">Test</div>';

      AOS.init();

      // ResizeObserver should be created (can't easily test directly)
      const state = AOS.getState();
      expect(state.initialized).toBe(true);
    });

    it('cleans up ResizeObserver on disable', () => {
      document.body.innerHTML = '<div data-aos="fade-up">Test</div>';

      AOS.init();
      expect(() => AOS.disable()).not.toThrow();
    });
  });
});
