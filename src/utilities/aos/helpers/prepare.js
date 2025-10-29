import getOption from './getOption';

/**
 * Prepare elements for Intersection Observer
 * Extracts options from data attributes and groups elements by observer config
 *
 * @param {Array} $elements - Array of element objects
 * @param {Object} options - Global options
 * @returns {Map} Map of observer configs to element arrays
 */
const prepare = function($elements, options) {
  const observerGroups = new Map();

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
    node._aosMeta = {
      options: {
        once,
        animatedClassNames,
        id
      },
      animated: false
    };

    // Group elements by observer configuration
    const configKey = `${rootMargin}|${threshold}`;
    const group = observerGroups.get(configKey) ?? {
      rootMargin,
      threshold,
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
