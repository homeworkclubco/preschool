/**
 * AOS metadata interface stored on elements
 */
export interface AOSMeta {
  options: {
    once: boolean;
    animatedClassNames: string[];
    id: string | null;
  };
  animated: boolean;
}

/**
 * Extended Element interface with AOS metadata
 */
export interface AOSElement extends Element {
  _aosMeta?: AOSMeta;
}

/**
 * Fire custom event
 * @param eventName - Event name
 * @param node - DOM node
 */
const fireEvent = (eventName: string, node: Element): void => {
  const customEvent = new CustomEvent(eventName, {
    detail: node,
    bubbles: true,
    cancelable: true
  });
  document.dispatchEvent(customEvent);
};

/**
 * Add animation classes to node
 * @param node - DOM element
 * @param classes - Array of class names
 */
const addClasses = (node: Element, classes: string[]): void => {
  classes?.forEach(className => node.classList.add(className));
};

/**
 * Remove animation classes from node
 * @param node - DOM element
 * @param classes - Array of class names
 */
const removeClasses = (node: Element, classes: string[]): void => {
  classes?.forEach(className => node.classList.remove(className));
};

/**
 * Handle intersection changes
 * @param entries - Array of intersection entries
 * @param observer - The observer instance
 */
const handleIntersection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void => {
  entries.forEach(entry => {
    const element = entry.target as AOSElement;
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
