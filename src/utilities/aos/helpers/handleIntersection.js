/**
 * Fire custom event
 * @param {string} eventName - Event name
 * @param {Node} node - DOM node
 */
const fireEvent = (eventName, node) => {
  const customEvent = new CustomEvent(eventName, {
    detail: node,
    bubbles: true,
    cancelable: true
  });
  document.dispatchEvent(customEvent);
};

/**
 * Add animation classes to node
 * @param {Node} node - DOM element
 * @param {Array} classes - Array of class names
 */
const addClasses = (node, classes) => {
  classes?.forEach(className => node.classList.add(className));
};

/**
 * Remove animation classes from node
 * @param {Node} node - DOM element
 * @param {Array} classes - Array of class names
 */
const removeClasses = (node, classes) => {
  classes?.forEach(className => node.classList.remove(className));
};

/**
 * Handle intersection changes
 * @param {IntersectionObserverEntry[]} entries - Array of intersection entries
 * @param {IntersectionObserver} observer - The observer instance
 */
const handleIntersection = (entries, observer) => {
  entries.forEach(entry => {
    const element = entry.target;
    const aosMeta = element._aosMeta;

    if (!aosMeta) return;

    const { animatedClassNames, once, id } = aosMeta.options;
    const isIntersecting = entry.isIntersecting;

    // Show animation when entering viewport
    if (isIntersecting && !aosMeta.animated) {
      addClasses(element, animatedClassNames);
      aosMeta.animated = true;

      fireEvent('aos:in', element);
      if (id) {
        fireEvent(`aos:in:${id}`, element);
      }

      // If once is true, stop observing this element
      if (once) {
        observer.unobserve(element);
      }
    }
    // Hide animation when leaving viewport (unless once is true)
    else if (!isIntersecting && aosMeta.animated && !once) {
      removeClasses(element, animatedClassNames);
      aosMeta.animated = false;

      fireEvent('aos:out', element);
      if (id) {
        fireEvent(`aos:out:${id}`, element);
      }
    }
  });
};

export default handleIntersection;
