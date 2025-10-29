import { describe, it, expect, beforeEach } from 'vitest';
import getOption from './getOption.js';

describe('getOption', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('div');
  });

  it('returns fallback when attribute does not exist', () => {
    const result = getOption(element, 'test', 'default-value');
    expect(result).toBe('default-value');
  });

  it('parses "true" string to boolean true', () => {
    element.setAttribute('data-aos-once', 'true');
    const result = getOption(element, 'once', false);
    expect(result).toBe(true);
  });

  it('parses "false" string to boolean false', () => {
    element.setAttribute('data-aos-once', 'false');
    const result = getOption(element, 'once', true);
    expect(result).toBe(false);
  });

  it('parses numeric strings to numbers', () => {
    element.setAttribute('data-aos-duration', '500');
    const result = getOption(element, 'duration', 400);
    expect(result).toBe(500);
  });

  it('parses negative numbers correctly', () => {
    element.setAttribute('data-aos-offset', '-100');
    const result = getOption(element, 'offset', 0);
    expect(result).toBe(-100);
  });

  it('parses decimal numbers correctly', () => {
    element.setAttribute('data-aos-threshold', '0.5');
    const result = getOption(element, 'threshold', 0);
    expect(result).toBe(0.5);
  });

  it('returns string value when not a boolean or number', () => {
    element.setAttribute('data-aos-easing', 'ease-in-out');
    const result = getOption(element, 'easing', 'ease');
    expect(result).toBe('ease-in-out');
  });

  it('returns string value when empty string', () => {
    element.setAttribute('data-aos-id', '');
    const result = getOption(element, 'id', 'default-id');
    expect(result).toBe('');
  });

  it('handles rootMargin CSS value strings', () => {
    element.setAttribute('data-aos-root-margin', '10px 20px 30px 40px');
    const result = getOption(element, 'root-margin', '0px');
    expect(result).toBe('10px 20px 30px 40px');
  });

  it('returns fallback for attribute key with hyphens', () => {
    const result = getOption(element, 'anchor-placement', 'top-bottom');
    expect(result).toBe('top-bottom');
  });

  it('reads attribute with hyphens when set', () => {
    element.setAttribute('data-aos-anchor-placement', 'center-center');
    const result = getOption(element, 'anchor-placement', 'top-bottom');
    expect(result).toBe('center-center');
  });
});
