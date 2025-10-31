import getOption from './getOption';
import { ElementObject } from './elements';
import { AOSElement } from './handleIntersection';

/**
 * AOS Options interface
 */
export interface AOSOptions {
  rootMargin: string;
  threshold: number;
  once: boolean;
  startEvent: string;
  animatedClassName: string;
  initClassName: string;
  useClassNames: boolean;
  disableMutationObserver: boolean;
}

/**
 * Observer group configuration
 */
export interface ObserverGroup {
  rootMargin: string;
  threshold: number;
  elements: Element[];
}

/**
 * Prepare elements for Intersection Observer
 * Extracts options from data attributes and groups elements by observer config
 *
 * @param $elements - Array of element objects
 * @param options - Global options
 * @returns Map of observer configs to element arrays
 */
const prepare = function($elements: ElementObject[], options: AOSOptions): Map<string, ObserverGroup> {
  const observerGroups = new Map<string, ObserverGroup>();

  $elements.forEach(({ node }) => {
    // Get per-element options
    const rootMargin = getOption(node, 'root-margin', options.rootMargin);
    const threshold = getOption(node, 'threshold', options.threshold);
    const once = getOption(node, 'once', options.once);
    const id = getOption(node, 'id', null);

    // Build animation class names
    const customClassNames = options.useClassNames ? node.getAttribute('data-aos') : null;
    const animatedClassNames = [
      options.animatedClassName,
      ...(customClassNames ? customClassNames.split(' ') : [])
    ].filter(className => typeof className === 'string');

    // Add init class
    options.initClassName && node.classList.add(options.initClassName);

    // Store metadata on element for intersection callback
    (node as AOSElement)._aosMeta = {
      options: {
        once: Boolean(once),
        animatedClassNames,
        id: id ? String(id) : null
      },
      animated: false
    };

    // Group elements by observer configuration
    const configKey = `${rootMargin}|${threshold}`;
    const group = observerGroups.get(configKey) ?? {
      rootMargin: String(rootMargin),
      threshold: Number(threshold),
      elements: []
    };

    if (!observerGroups.has(configKey)) {
      observerGroups.set(configKey, group);
    }

    group.elements.push(node);
  });

  return observerGroups;
};

export default prepare;
