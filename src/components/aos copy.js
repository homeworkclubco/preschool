import Lenis from 'lenis';

/**
 * Modern AOS (Animate On Scroll) replacement using Lenis for smooth scrolling
 */

class AnimateOnScroll {
  constructor(options = {}) {
    this.options = {
      // Global defaults - can be overridden per element
      duration: 400,
      delay: 0,
      easing: 'ease',
      offset: 120,
      once: false,
      mirror: false,
      anchorPlacement: 'top-bottom',
      // Lenis options
      lenisOptions: {
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
        autoResize: true,
        ...options.lenisOptions,
      },
      // AOS options
      startEvent: 'DOMContentLoaded',
      disableMutationObserver: false,
      debounceDelay: 50,
      throttleDelay: 99,
      ...options,
    };

    this.elements = [];
    this.lenis = null;
    this.initialized = false;
    this.observer = null;
  }

  /**
   * Initialize AOS and Lenis
   */
  init() {
    if (this.initialized) return;

    // Initialize Lenis for smooth scrolling
    this.lenis = new Lenis(this.options.lenisOptions);

    // Request animation frame for Lenis
    const raf = time => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Listen to Lenis scroll events
    this.lenis.on('scroll', () => {
      this.handleScroll();
    });

    // Find all elements with data-aos attribute
    this.refresh();

    // Initial check for elements in viewport
    this.handleScroll();

    // Setup mutation observer to watch for new elements
    if (!this.options.disableMutationObserver) {
      this.setupMutationObserver();
    }

    // Setup resize observer
    window.addEventListener(
      'resize',
      this.debounce(() => {
        this.refresh();
        this.handleScroll();
      }, this.options.debounceDelay)
    );

    this.initialized = true;

    return this;
  }

  /**
   * Get element offset position (top)
   */
  getOffset(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return rect.top + scrollTop;
  }

  /**
   * Calculate position.in - scroll position where element should animate in
   * Based on AOS logic from https://github.com/michalsnik/aos
   */
  getPositionIn(element, offset, anchorPlacement) {
    const windowHeight = window.innerHeight;
    const elementTop = this.getOffset(element);
    const elementHeight = element.offsetHeight;

    // Start with element top minus window height (when element top enters bottom of viewport)
    let triggerPoint = elementTop - windowHeight;

    // Adjust based on anchor placement
    switch (anchorPlacement) {
      case 'top-bottom':
        // Element top crosses viewport bottom (default)
        break;
      case 'center-bottom':
        // Element center crosses viewport bottom
        triggerPoint += elementHeight / 2;
        break;
      case 'bottom-bottom':
        // Element bottom crosses viewport bottom
        triggerPoint += elementHeight;
        break;
      case 'top-center':
        // Element top crosses viewport center
        triggerPoint += windowHeight / 2;
        break;
      case 'center-center':
        // Element center crosses viewport center
        triggerPoint += windowHeight / 2 + elementHeight / 2;
        break;
      case 'bottom-center':
        // Element bottom crosses viewport center
        triggerPoint += windowHeight / 2 + elementHeight;
        break;
      case 'top-top':
        // Element top crosses viewport top
        triggerPoint += windowHeight;
        break;
      case 'bottom-top':
        // Element bottom crosses viewport top
        triggerPoint += windowHeight + elementHeight;
        break;
      case 'center-top':
        // Element center crosses viewport top
        triggerPoint += windowHeight + elementHeight / 2;
        break;
      default:
        // Default to top-bottom
        break;
    }

    return triggerPoint + offset;
  }

  /**
   * Calculate position.out - scroll position where element should animate out (mirror mode)
   * Based on AOS logic from https://github.com/michalsnik/aos
   */
  getPositionOut(element, offset) {
    const elementTop = this.getOffset(element);
    const elementHeight = element.offsetHeight;
    // Element should animate out when its bottom edge passes viewport top
    return elementTop + elementHeight - offset;
  }

  /**
   * Refresh elements - find all [data-aos] elements and prepare them
   */
  refresh() {
    const elements = document.querySelectorAll('[data-aos]');

    this.elements = Array.from(elements).map(element => {
      const animationName = element.getAttribute('data-aos');
      const duration =
        element.getAttribute('data-aos-duration') || this.options.duration;
      const delay =
        element.getAttribute('data-aos-delay') || this.options.delay;
      const easing =
        element.getAttribute('data-aos-easing') || this.options.easing;
      const offset =
        parseInt(element.getAttribute('data-aos-offset')) ||
        this.options.offset;
      const once =
        element.getAttribute('data-aos-once') !== null
          ? element.getAttribute('data-aos-once') === 'true'
          : this.options.once;
      const mirror =
        element.getAttribute('data-aos-mirror') !== null
          ? element.getAttribute('data-aos-mirror') === 'true'
          : this.options.mirror;
      const anchorPlacement =
        element.getAttribute('data-aos-anchor-placement') ||
        this.options.anchorPlacement;

      // Get anchor element if specified
      const anchorSelector = element.getAttribute('data-aos-anchor');
      const anchor = anchorSelector
        ? document.querySelector(anchorSelector)
        : element;

      // Pre-calculate trigger positions
      const positionIn = this.getPositionIn(anchor, offset, anchorPlacement);
      const positionOut = mirror ? this.getPositionOut(anchor, offset) : null;

      return {
        element,
        anchor,
        animationName,
        duration,
        delay,
        easing,
        offset,
        once,
        mirror,
        anchorPlacement,
        animated: false,
        position: {
          in: positionIn,
          out: positionOut,
        },
      };
    });

    return this;
  }

  /**
   * Handle scroll event - check which elements should be animated
   * Uses AOS three-way logic: mirror check -> in check -> out check
   */
  handleScroll() {
    const scrollTop = this.lenis?.scroll || window.scrollY;

    this.elements.forEach(item => {
      const { element, once, mirror, animated, position } = item;

      // Skip if animation should only happen once and already animated
      if (once && animated) {
        return;
      }

      // AOS three-way logic:
      // 1. If mirror mode AND scroll passed the "out" position: HIDE
      // 2. Else if scroll reached the "in" position: SHOW
      // 3. Else if element was animated: HIDE

      if (mirror && position.out !== null && scrollTop >= position.out) {
        // Mirror mode: element has scrolled past, remove animation
        element.classList.remove('aos-animate');
        item.animated = false;
      } else if (scrollTop >= position.in) {
        // Element has reached trigger point, add animation
        element.classList.add('aos-animate');
        item.animated = true;
      } else if (!once) {
        // Element hasn't reached trigger or has scrolled back, remove animation
        element.classList.remove('aos-animate');
        item.animated = false;
      }
    });
  }

  /**
   * Setup mutation observer to detect new elements
   */
  setupMutationObserver() {
    this.observer = new MutationObserver(
      this.debounce(() => {
        this.refresh();
        this.handleScroll();
      }, this.options.debounceDelay)
    );

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Destroy AOS and Lenis instance
   */
  destroy() {
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // Remove all aos-animate classes
    this.elements.forEach(({ element }) => {
      element.classList.remove('aos-animate');
    });

    this.elements = [];
    this.initialized = false;

    return this;
  }

  /**
   * Get the Lenis instance for custom scroll interactions
   */
  getLenis() {
    return this.lenis;
  }

  /**
   * Scroll to a target using Lenis
   */
  scrollTo(target, options = {}) {
    if (this.lenis) {
      this.lenis.scrollTo(target, options);
    }
  }

  /**
   * Utility: Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Create singleton instance
let aosInstance = null;

/**
 * Initialize AOS with options
 * @param {Object} options - Configuration options
 * @returns {AnimateOnScroll} AOS instance
 */
export function init(options = {}) {
  if (!aosInstance) {
    aosInstance = new AnimateOnScroll(options);
  }

  const startEvent = aosInstance.options.startEvent;

  if (startEvent === 'DOMContentLoaded') {
    if (document.readyState !== 'loading') {
      aosInstance.init();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        aosInstance.init();
      });
    }
  } else {
    document.addEventListener(startEvent, () => {
      aosInstance.init();
    });
  }

  return aosInstance;
}

/**
 * Refresh AOS - rescan for elements
 */
export function refresh() {
  if (aosInstance) {
    aosInstance.refresh();
    aosInstance.handleScroll();
  }
}

/**
 * Get the Lenis instance
 */
export function getLenis() {
  return aosInstance?.getLenis();
}

/**
 * Scroll to target using Lenis
 */
export function scrollTo(target, options) {
  if (aosInstance) {
    aosInstance.scrollTo(target, options);
  }
}

/**
 * Destroy AOS instance
 */
export function destroy() {
  if (aosInstance) {
    aosInstance.destroy();
    aosInstance = null;
  }
}

// Default export for convenience
export default {
  init,
  refresh,
  getLenis,
  scrollTo,
  destroy,
};
